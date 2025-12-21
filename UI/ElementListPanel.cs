using ImGuiNET;
using System.Numerics;
using Vizzio.Models;

namespace Vizzio.UI;

/// <summary>
/// Modern element list panel with search and filters
/// </summary>
public class ElementListPanel
{
    private string _searchText = "";
    private string _selectedType = "All";
    private readonly Dictionary<string, bool> _typeFilters = new();
    private bool _showFilters = true;

    public void Render(IfcModel? model, Action<IfcElement>? onSelectElement)
    {
        ImGui.SetNextWindowSize(new Vector2(320, 600), ImGuiCond.FirstUseEver);
        ImGui.SetNextWindowPos(new Vector2(15, 120), ImGuiCond.FirstUseEver);

        if (ImGui.Begin("🗂️ Elements", ImGuiWindowFlags.None))
        {
            if (model == null)
            {
                ImGui.PushStyleColor(ImGuiCol.Text, ModernTheme.Colors.TextDim);
                ImGui.TextWrapped("No model loaded. Open an IFC file to see elements.");
                ImGui.PopStyleColor();
                ImGui.End();
                return;
            }

            RenderHeader(model);
            ImGui.Spacing();

            RenderSearchBar();
            ImGui.Spacing();

            RenderFilterBar(model);
            ImGui.Spacing();

            ImGui.Separator();
            ImGui.Spacing();

            RenderElementList(model, onSelectElement);
        }
        ImGui.End();
    }

    private void RenderHeader(IfcModel model)
    {
        ImGui.PushStyleColor(ImGuiCol.Text, ModernTheme.Colors.Primary);
        ImGui.Text($"📊 {model.Elements.Count} Elements");
        ImGui.PopStyleColor();
        
        ImGui.SameLine(ImGui.GetWindowWidth() - 110);
        if (ImGui.SmallButton(_showFilters ? "🔽 Filters" : "▶️ Filters"))
        {
            _showFilters = !_showFilters;
        }
    }

    private void RenderSearchBar()
    {
        ImGui.PushItemWidth(-1);
        ImGui.InputTextWithHint("##search", "🔍 Search elements...", ref _searchText, 256);
        ImGui.PopItemWidth();
    }

    private void RenderFilterBar(IfcModel model)
    {
        if (!_showFilters)
            return;

        ImGui.BeginChild("##filters", new Vector2(0, 120), ImGuiChildFlags.Borders);
        
        ImGui.PushStyleColor(ImGuiCol.Text, ModernTheme.Colors.TextDim);
        ImGui.Text("FILTER BY TYPE");
        ImGui.PopStyleColor();
        ImGui.Spacing();

        // All button
        if (ImGui.RadioButton("All", _selectedType == "All"))
        {
            _selectedType = "All";
        }
        ImGui.SameLine();
        ImGui.TextDisabled($"({model.Elements.Count})");

        ImGui.Spacing();

        // Type buttons with counts
        foreach (var (type, elements) in model.ElementsByType.OrderByDescending(x => x.Value.Count).Take(8))
        {
            var color = GetTypeColor(type);
            ImGui.PushStyleColor(ImGuiCol.CheckMark, color);
            
            bool isSelected = _selectedType == type;
            if (ImGui.RadioButton($"{GetTypeIcon(type)} {type}", isSelected))
            {
                _selectedType = type;
            }
            
            ImGui.PopStyleColor();
            ImGui.SameLine();
            ImGui.TextDisabled($"({elements.Count})");

            if (ImGui.GetCursorPosY() > ImGui.GetWindowHeight() - 30)
                break;
        }

        ImGui.EndChild();
    }

    private void RenderElementList(IfcModel model, Action<IfcElement>? onSelectElement)
    {
        ImGui.BeginChild("##elementlist");

        var filteredElements = GetFilteredElements(model);
        
        if (filteredElements.Count == 0)
        {
            ImGui.PushStyleColor(ImGuiCol.Text, ModernTheme.Colors.TextDim);
            ImGui.TextWrapped("No elements match the current filter.");
            ImGui.PopStyleColor();
            ImGui.EndChild();
            return;
        }

        // Group by type
        var grouped = filteredElements.GroupBy(e => e.Type).OrderBy(g => g.Key);

        foreach (var group in grouped)
        {
            var type = group.Key ?? "Unknown";
            var color = GetTypeColor(type);
            var icon = GetTypeIcon(type);

            ImGui.PushStyleColor(ImGuiCol.Header, color with { W = 0.3f });
            ImGui.PushStyleColor(ImGuiCol.HeaderHovered, color with { W = 0.5f });
            ImGui.PushStyleColor(ImGuiCol.HeaderActive, color with { W = 0.7f });

            if (ImGui.CollapsingHeader($"{icon} {type} ({group.Count()})###{type}"))
            {
                ImGui.Indent();

                foreach (var element in group.Take(100)) // Limit for performance
                {
                    var name = element.Name ?? $"<{element.GlobalId}>";
                    if (name.Length > 40)
                        name = name.Substring(0, 37) + "...";

                    if (ImGui.Selectable($"  {name}##{element.GlobalId}", false))
                    {
                        onSelectElement?.Invoke(element);
                    }

                    if (ImGui.IsItemHovered())
                    {
                        ImGui.BeginTooltip();
                        ImGui.Text($"Type: {element.Type}");
                        ImGui.Text($"Name: {element.Name ?? "N/A"}");
                        ImGui.Text($"ID: {element.GlobalId}");
                        ImGui.EndTooltip();
                    }
                }

                if (group.Count() > 100)
                {
                    ImGui.TextDisabled($"  ... and {group.Count() - 100} more");
                }

                ImGui.Unindent();
            }

            ImGui.PopStyleColor(3);
        }

        ImGui.EndChild();
    }

    private List<IfcElement> GetFilteredElements(IfcModel model)
    {
        var elements = model.Elements.AsEnumerable();

        // Filter by type
        if (_selectedType != "All")
        {
            elements = elements.Where(e => e.Type == _selectedType);
        }

        // Filter by search
        if (!string.IsNullOrWhiteSpace(_searchText))
        {
            var search = _searchText.ToLower();
            elements = elements.Where(e =>
                (e.Name?.ToLower().Contains(search) ?? false) ||
                (e.Type?.ToLower().Contains(search) ?? false) ||
                (e.GlobalId?.ToLower().Contains(search) ?? false));
        }

        return elements.ToList();
    }

    private Vector4 GetTypeColor(string type)
    {
        return type.ToLower() switch
        {
            var t when t.Contains("wall") => ModernTheme.Colors.Wall,
            var t when t.Contains("floor") || t.Contains("slab") => ModernTheme.Colors.Floor,
            var t when t.Contains("roof") => ModernTheme.Colors.Roof,
            var t when t.Contains("beam") => ModernTheme.Colors.Beam,
            var t when t.Contains("column") => ModernTheme.Colors.Column,
            var t when t.Contains("door") => ModernTheme.Colors.Door,
            var t when t.Contains("window") => ModernTheme.Colors.Window,
            _ => ModernTheme.Colors.Primary
        };
    }

    private string GetTypeIcon(string type)
    {
        return type.ToLower() switch
        {
            var t when t.Contains("wall") => "🧱",
            var t when t.Contains("floor") || t.Contains("slab") => "⬜",
            var t when t.Contains("roof") => "🏠",
            var t when t.Contains("beam") => "━",
            var t when t.Contains("column") => "┃",
            var t when t.Contains("door") => "🚪",
            var t when t.Contains("window") => "🪟",
            var t when t.Contains("stair") => "🪜",
            var t when t.Contains("furniture") => "🪑",
            _ => "📦"
        };
    }
}
