using System.Numerics;
using ImGuiNET;
using Vizzio.Models;
using Vizzio.Rendering;
using Vizzio.VR;

namespace Vizzio.UI;

/// <summary>
/// Main UI panel manager for the IFC viewer
/// </summary>
public class UIManager
{
    private IfcModel? _currentModel;
    private IfcElement? _selectedElement;
    private string _searchFilter = "";
    private bool _showProperties = true;
    private bool _showElementList = true;
    private bool _showStatistics = true;
    private bool _showVRSettings = false;
    private Dictionary<string, bool> _typeVisibility = new();
    
    public IfcElement? SelectedElement
    {
        get => _selectedElement;
        set
        {
            _selectedElement = value;
            OnElementSelected?.Invoke(value);
        }
    }

    public event Action<IfcElement?>? OnElementSelected;
    public event Action<string, bool>? OnTypeVisibilityChanged;
    public event Action? OnFocusRequested;
    public event Action? OnResetCameraRequested;
    public event Action<string>? OnOpenFileRequested; // NEW

    public void SetModel(IfcModel model)
    {
        _currentModel = model;
        _typeVisibility.Clear();
        
        foreach (var type in model.GetElementTypes())
        {
            _typeVisibility[type] = true;
        }
    }

    public void Render(Camera camera, VRManager vrManager, float fps)
    {
        RenderMainMenuBar(camera, vrManager, fps);
        
        if (_showElementList)
            RenderElementList();
        
        if (_showProperties && _selectedElement != null)
            RenderPropertiesPanel();
        
        if (_showStatistics && _currentModel != null)
            RenderStatisticsPanel();
        
        if (_showVRSettings)
            RenderVRSettingsPanel(vrManager);
    }

    private void RenderMainMenuBar(Camera camera, VRManager vrManager, float fps)
    {
        if (ImGui.BeginMainMenuBar())
        {
            if (ImGui.BeginMenu("File"))
            {
                if (ImGui.MenuItem("Open IFC...", "Ctrl+O"))
                {
                    // Trigger file dialog
                    var filePath = FileDialog.OpenFile("Open IFC File");
                    if (!string.IsNullOrEmpty(filePath))
                    {
                        OnOpenFileRequested?.Invoke(filePath);
                    }
                }
                
                ImGui.Separator();
                
                if (ImGui.MenuItem("Exit", "Alt+F4"))
                {
                    Environment.Exit(0);
                }
                
                ImGui.EndMenu();
            }

            if (ImGui.BeginMenu("View"))
            {
                ImGui.MenuItem("Element List", "F2", ref _showElementList);
                ImGui.MenuItem("Properties", "F3", ref _showProperties);
                ImGui.MenuItem("Statistics", "F4", ref _showStatistics);
                
                ImGui.Separator();
                
                if (ImGui.MenuItem("Focus on Model", "F"))
                {
                    OnFocusRequested?.Invoke();
                }
                
                if (ImGui.MenuItem("Reset Camera", "R"))
                {
                    OnResetCameraRequested?.Invoke();
                }
                
                ImGui.EndMenu();
            }

            if (ImGui.BeginMenu("VR/AR"))
            {
                bool vrEnabled = vrManager.IsVREnabled;
                if (ImGui.MenuItem("Enable VR", "F2", ref vrEnabled))
                {
                    if (vrEnabled)
                        vrManager.EnableVRMode(camera);
                    else
                        vrManager.DisableVRMode();
                }
                
                bool arEnabled = vrManager.IsAREnabled;
                if (ImGui.MenuItem("Enable AR", "F3", ref arEnabled))
                {
                    if (arEnabled)
                        vrManager.EnableARMode(camera);
                    else
                        vrManager.DisableARMode();
                }
                
                ImGui.Separator();
                
                ImGui.MenuItem("VR Settings", null, ref _showVRSettings);
                
                ImGui.EndMenu();
            }

            if (ImGui.BeginMenu("Help"))
            {
                if (ImGui.MenuItem("Controls", "F1"))
                {
                    // Show help dialog
                }
                
                if (ImGui.MenuItem("About"))
                {
                    // Show about dialog
                }
                
                ImGui.EndMenu();
            }

            // FPS counter on the right
            ImGui.SetCursorPosX(ImGui.GetWindowWidth() - 120);
            ImGui.Text($"FPS: {fps:F0}");

            ImGui.EndMainMenuBar();
        }
    }

    private void RenderElementList()
    {
        if (_currentModel == null)
            return;

        ImGui.SetNextWindowPos(new Vector2(10, 30), ImGuiCond.FirstUseEver);
        ImGui.SetNextWindowSize(new Vector2(350, 500), ImGuiCond.FirstUseEver);

        if (ImGui.Begin("Elements", ref _showElementList))
        {
            ImGui.Text($"Total Elements: {_currentModel.Elements.Count}");
            ImGui.Separator();

            // Search filter
            ImGui.InputTextWithHint("##search", "Search elements...", ref _searchFilter, 256);
            ImGui.Separator();

            // Type filtering
            if (ImGui.CollapsingHeader("Filter by Type", ImGuiTreeNodeFlags.DefaultOpen))
            {
                foreach (var type in _currentModel.GetElementTypes())
                {
                    var count = _currentModel.ElementsByType[type].Count;
                    bool visible = _typeVisibility.GetValueOrDefault(type, true);
                    
                    if (ImGui.Checkbox($"{type} ({count})", ref visible))
                    {
                        _typeVisibility[type] = visible;
                        OnTypeVisibilityChanged?.Invoke(type, visible);
                    }
                }
            }

            ImGui.Separator();

            // Element list
            if (ImGui.BeginChild("ElementList"))
            {
                foreach (var element in _currentModel.Elements)
                {
                    // Apply search filter
                    if (!string.IsNullOrWhiteSpace(_searchFilter))
                    {
                        if (!element.Name.Contains(_searchFilter, StringComparison.OrdinalIgnoreCase) &&
                            !element.IfcType.Contains(_searchFilter, StringComparison.OrdinalIgnoreCase))
                        {
                            continue;
                        }
                    }

                    // Apply type filter
                    if (!_typeVisibility.GetValueOrDefault(element.IfcType, true))
                        continue;

                    bool isSelected = _selectedElement == element;
                    
                    if (ImGui.Selectable($"{element.Name} ({element.IfcType})", isSelected))
                    {
                        SelectedElement = element;
                    }

                    if (ImGui.IsItemHovered())
                    {
                        ImGui.BeginTooltip();
                        ImGui.Text($"Type: {element.IfcType}");
                        ImGui.Text($"ID: {element.GlobalId}");
                        ImGui.EndTooltip();
                    }
                }
                
                ImGui.EndChild();
            }
        }
        
        ImGui.End();
    }

    private void RenderPropertiesPanel()
    {
        if (_selectedElement == null)
            return;

        ImGui.SetNextWindowPos(new Vector2(370, 30), ImGuiCond.FirstUseEver);
        ImGui.SetNextWindowSize(new Vector2(400, 500), ImGuiCond.FirstUseEver);

        if (ImGui.Begin("Properties", ref _showProperties))
        {
            ImGui.Text($"Element: {_selectedElement.Name}");
            ImGui.Text($"Type: {_selectedElement.IfcType}");
            ImGui.Text($"ID: {_selectedElement.GlobalId}");
            
            ImGui.Separator();

            // Color picker
            var color = _selectedElement.Color;
            if (ImGui.ColorEdit3("Color", ref color))
            {
                _selectedElement.Color = color;
            }

            // Visibility toggle
            bool isVisible = _selectedElement.IsVisible;
            if (ImGui.Checkbox("Visible", ref isVisible))
            {
                _selectedElement.IsVisible = isVisible;
            }

            ImGui.Separator();

            // Properties
            if (ImGui.CollapsingHeader("Properties", ImGuiTreeNodeFlags.DefaultOpen))
            {
                if (ImGui.BeginTable("PropertiesTable", 2, ImGuiTableFlags.Borders | ImGuiTableFlags.RowBg))
                {
                    ImGui.TableSetupColumn("Property", ImGuiTableColumnFlags.WidthFixed, 150);
                    ImGui.TableSetupColumn("Value", ImGuiTableColumnFlags.WidthStretch);
                    ImGui.TableHeadersRow();

                    foreach (var prop in _selectedElement.Properties.OrderBy(p => p.Key))
                    {
                        ImGui.TableNextRow();
                        ImGui.TableNextColumn();
                        ImGui.Text(prop.Key);
                        ImGui.TableNextColumn();
                        ImGui.Text(prop.Value);
                    }

                    ImGui.EndTable();
                }
            }

            // Geometry info
            if (_selectedElement.Geometry != null)
            {
                ImGui.Separator();
                if (ImGui.CollapsingHeader("Geometry"))
                {
                    var geom = _selectedElement.Geometry;
                    ImGui.Text($"Vertices: {geom.Vertices.Count:N0}");
                    ImGui.Text($"Triangles: {geom.Indices.Count / 3:N0}");
                    ImGui.Text($"Center: {geom.GetCenter()}");
                    ImGui.Text($"Size: {geom.GetSize():F2}");
                }
            }
        }
        
        ImGui.End();
    }

    private void RenderStatisticsPanel()
    {
        if (_currentModel == null)
            return;

        ImGui.SetNextWindowPos(new Vector2(10, 540), ImGuiCond.FirstUseEver);
        ImGui.SetNextWindowSize(new Vector2(350, 200), ImGuiCond.FirstUseEver);

        if (ImGui.Begin("Statistics", ref _showStatistics))
        {
            ImGui.Text($"Model: {_currentModel.FileName}");
            ImGui.Separator();
            
            ImGui.Text($"Total Elements: {_currentModel.Elements.Count:N0}");
            ImGui.Text($"Element Types: {_currentModel.GetElementTypes().Count}");
            ImGui.Text($"Total Vertices: {_currentModel.GetTotalVertexCount():N0}");
            ImGui.Text($"Total Triangles: {_currentModel.GetTotalTriangleCount():N0}");
            
            ImGui.Separator();
            
            ImGui.Text($"Model Center: {_currentModel.ModelCenter}");
            ImGui.Text($"Model Size: {_currentModel.ModelSize:F2}");
        }
        
        ImGui.End();
    }

    private void RenderVRSettingsPanel(VRManager vrManager)
    {
        ImGui.SetNextWindowPos(new Vector2(400, 300), ImGuiCond.FirstUseEver);
        ImGui.SetNextWindowSize(new Vector2(400, 300), ImGuiCond.FirstUseEver);

        if (ImGui.Begin("VR/AR Settings", ref _showVRSettings))
        {
            ImGui.Text("VR Configuration");
            ImGui.Separator();

            var ipd = vrManager.IPD * 1000; // Convert to mm
            if (ImGui.SliderFloat("IPD (mm)", ref ipd, 55, 75))
            {
                vrManager.IPD = ipd / 1000;
            }

            var headHeight = vrManager.HeadHeight;
            if (ImGui.SliderFloat("Head Height (m)", ref headHeight, 1.4f, 2.0f))
            {
                vrManager.HeadHeight = headHeight;
            }

            ImGui.Separator();
            
            if (vrManager.IsVREnabled)
            {
                ImGui.TextColored(new Vector4(0, 1, 0, 1), "VR Mode: ACTIVE");
                ImGui.Text(vrManager.GetVRDeviceInfo());
            }
            else if (vrManager.IsAREnabled)
            {
                ImGui.TextColored(new Vector4(0, 1, 1, 1), "AR Mode: ACTIVE");
                ImGui.Text(vrManager.GetARDeviceInfo());
            }
            else
            {
                ImGui.TextColored(new Vector4(1, 1, 0, 1), "VR/AR Mode: INACTIVE");
                ImGui.Text("Press F2 to enable VR or F3 to enable AR");
            }
        }
        
        ImGui.End();
    }
}
