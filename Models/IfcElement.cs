using System.Numerics;

namespace Vizzio.Models;

/// <summary>
/// Represents an IFC element with its geometry and properties
/// </summary>
public class IfcElement
{
    public string GlobalId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string IfcType { get; set; } = string.Empty;
    public MeshGeometry? Geometry { get; set; }
    public Dictionary<string, string> Properties { get; set; } = new();
    public Matrix4x4 Transform { get; set; } = Matrix4x4.Identity;
    
    public Vector3 Color { get; set; } = new Vector3(0.7f, 0.7f, 0.7f);
    public bool IsVisible { get; set; } = true;
    public bool IsSelected { get; set; } = false;

    public IfcElement()
    {
    }

    public IfcElement(string globalId, string name, string ifcType)
    {
        GlobalId = globalId;
        Name = name;
        IfcType = ifcType;
        AssignColorByType(ifcType);
    }

    private void AssignColorByType(string ifcType)
    {
        // Assign colors based on IFC element type
        Color = ifcType.ToLower() switch
        {
            var t when t.Contains("wall") => new Vector3(0.9f, 0.9f, 0.85f),
            var t when t.Contains("slab") || t.Contains("floor") => new Vector3(0.7f, 0.7f, 0.7f),
            var t when t.Contains("roof") => new Vector3(0.6f, 0.3f, 0.3f),
            var t when t.Contains("beam") => new Vector3(0.5f, 0.5f, 0.8f),
            var t when t.Contains("column") => new Vector3(0.8f, 0.5f, 0.5f),
            var t when t.Contains("window") => new Vector3(0.6f, 0.8f, 0.9f),
            var t when t.Contains("door") => new Vector3(0.6f, 0.4f, 0.2f),
            var t when t.Contains("stair") => new Vector3(0.5f, 0.5f, 0.5f),
            var t when t.Contains("railing") => new Vector3(0.3f, 0.3f, 0.3f),
            var t when t.Contains("furniture") => new Vector3(0.8f, 0.7f, 0.5f),
            _ => new Vector3(0.7f, 0.7f, 0.7f)
        };
    }

    public void AddProperty(string key, string value)
    {
        Properties[key] = value;
    }

    public string GetProperty(string key, string defaultValue = "")
    {
        return Properties.TryGetValue(key, out var value) ? value : defaultValue;
    }
}
