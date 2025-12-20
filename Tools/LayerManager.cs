using Vizzio.Models;

namespace Vizzio.Tools;

/// <summary>
/// Layer management system for organizing elements by floors/levels
/// </summary>
public class LayerManager
{
    private readonly Dictionary<string, Layer> _layers = new();
    private readonly List<string> _layerOrder = new();

    public IReadOnlyDictionary<string, Layer> Layers => _layers;
    public IReadOnlyList<string> LayerOrder => _layerOrder;

    public event Action<Layer>? OnLayerAdded;
    public event Action<Layer>? OnLayerRemoved;
    public event Action<Layer>? OnLayerVisibilityChanged;

    public void OrganizeByStorey(IfcModel model)
    {
        _layers.Clear();
        _layerOrder.Clear();

        // Group elements by storey/level
        var elementsByStorey = new Dictionary<string, List<IfcElement>>();

        foreach (var element in model.Elements)
        {
            var storey = ExtractStorey(element);
            
            if (!elementsByStorey.ContainsKey(storey))
            {
                elementsByStorey[storey] = new List<IfcElement>();
            }
            
            elementsByStorey[storey].Add(element);
        }

        // Create layers
        var sortedStoreys = elementsByStorey.Keys.OrderBy(s => ExtractStoreyNumber(s)).ToList();
        
        foreach (var storey in sortedStoreys)
        {
            var layer = new Layer
            {
                Name = storey,
                IsVisible = true,
                Elements = elementsByStorey[storey]
            };

            _layers[storey] = layer;
            _layerOrder.Add(storey);
            OnLayerAdded?.Invoke(layer);
        }
    }

    public void OrganizeByType(IfcModel model)
    {
        _layers.Clear();
        _layerOrder.Clear();

        foreach (var type in model.GetElementTypes())
        {
            if (!model.ElementsByType.ContainsKey(type))
                continue;

            var layer = new Layer
            {
                Name = type,
                IsVisible = true,
                Elements = model.ElementsByType[type].ToList()
            };

            _layers[type] = layer;
            _layerOrder.Add(type);
            OnLayerAdded?.Invoke(layer);
        }
    }

    public void SetLayerVisibility(string layerName, bool visible)
    {
        if (!_layers.ContainsKey(layerName))
            return;

        var layer = _layers[layerName];
        layer.IsVisible = visible;

        // Update element visibility
        foreach (var element in layer.Elements)
        {
            element.IsVisible = visible;
        }

        OnLayerVisibilityChanged?.Invoke(layer);
    }

    public void IsolateLayer(string layerName)
    {
        foreach (var kvp in _layers)
        {
            bool shouldBeVisible = kvp.Key == layerName;
            SetLayerVisibility(kvp.Key, shouldBeVisible);
        }
    }

    public void ShowAll()
    {
        foreach (var layerName in _layers.Keys)
        {
            SetLayerVisibility(layerName, true);
        }
    }

    public void HideAll()
    {
        foreach (var layerName in _layers.Keys)
        {
            SetLayerVisibility(layerName, false);
        }
    }

    public Layer? GetLayer(string name)
    {
        return _layers.GetValueOrDefault(name);
    }

    private string ExtractStorey(IfcElement element)
    {
        // Try to extract storey from properties
        var storeyProp = element.Properties.FirstOrDefault(p => 
            p.Key.Contains("Storey", StringComparison.OrdinalIgnoreCase) ||
            p.Key.Contains("Level", StringComparison.OrdinalIgnoreCase) ||
            p.Key.Contains("Floor", StringComparison.OrdinalIgnoreCase));

        if (!string.IsNullOrEmpty(storeyProp.Value))
        {
            return storeyProp.Value;
        }

        // Try to infer from element position
        if (element.Geometry != null)
        {
            var height = element.Geometry.GetCenter().Y;
            
            if (height < 0) return "Foundation";
            if (height < 4) return "Ground Floor";
            if (height < 8) return "1st Floor";
            if (height < 12) return "2nd Floor";
            if (height < 16) return "3rd Floor";
            
            var floorNumber = (int)(height / 4);
            return $"{floorNumber}th Floor";
        }

        return "Unassigned";
    }

    private int ExtractStoreyNumber(string storeyName)
    {
        // Extract number from storey name for sorting
        if (storeyName == "Foundation") return -1;
        if (storeyName == "Ground Floor") return 0;
        if (storeyName == "Unassigned") return 999;

        // Try to extract number
        var numbers = new string(storeyName.Where(char.IsDigit).ToArray());
        if (int.TryParse(numbers, out int number))
        {
            return number;
        }

        return 100;
    }
}

public class Layer
{
    public string Name { get; set; } = "";
    public bool IsVisible { get; set; } = true;
    public List<IfcElement> Elements { get; set; } = new();
    public int ElementCount => Elements.Count;

    public override string ToString()
    {
        return $"{Name} ({ElementCount} elements)";
    }
}
