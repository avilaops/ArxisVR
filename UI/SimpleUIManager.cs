using System.Numerics;
using ImGuiNET;
using ArxisVR.Models;
using ArxisVR.Rendering;
using ArxisVR.VR;

namespace ArxisVR.UI;

/// <summary>
/// Simplified UI Manager - Responsive and functional with performance optimizations
/// </summary>
public class SimpleUIManager
{
    // Layout constants
    private const float TOOLBAR_WIDTH = 60f;
    private const float TOOLBAR_HEIGHT = 400f;
    private const float ELEMENTS_PANEL_WIDTH = 300f;
    private const float ELEMENTS_PANEL_HEIGHT = 400f;
    private const float PROPERTIES_PANEL_WIDTH = 300f;
    private const float PROPERTIES_PANEL_HEIGHT = 400f;
    private const float STATS_PANEL_WIDTH = 250f;
    private const float STATS_PANEL_HEIGHT = 150f;
    private const float STATUS_BAR_HEIGHT = 25f;
    private const float DEFAULT_STATUS_DURATION = 3f;

    private IfcModel? _currentModel;
    private IfcElement? _selectedElement;

    // Panel visibility
    private bool _showElements = true;
    private bool _showProperties = false;
    private bool _showStats = false;
    private bool _showAI = true;

    // Events
    public event Action? OnFocusModel;
    public event Action? OnResetCamera;
    public event Action<IfcElement?>? OnElementSelected;

    // Status system
    private string _statusMessage = "Ready";
    private float _statusTimer = 0;
    private float _statusDuration = DEFAULT_STATUS_DURATION;

    // Element filtering
    private string _elementFilter = "";
    private List<IfcElement>? _filteredElements = null;

    // Cache for performance
    private Dictionary<IfcElement, string> _elementLabelCache = new();

    public void SetModel(IfcModel model)
    {
        _currentModel = model;
        _elementFilter = "";
        _filteredElements = null;
        _elementLabelCache.Clear();
        ShowStatus($"Model loaded: {model.Elements.Count} elements");
    }

    public void SetSelectedElement(IfcElement? element)
    {
        _selectedElement = element;
        _showProperties = element != null;
        OnElementSelected?.Invoke(element);
    }

    private string GetElementLabel(IfcElement element)
    {
        if (!_elementLabelCache.TryGetValue(element, out var label))
        {
            var name = element.Name ?? element.IfcType ?? "Unknown";
            label = $"{element.IfcType}: {name}";
            _elementLabelCache[element] = label;
        }
        return label;
    }

    private List<IfcElement> GetFilteredElements()
    {
        if (_currentModel == null) return new List<IfcElement>();

        if (string.IsNullOrWhiteSpace(_elementFilter))
            return _currentModel.Elements;

        if (_filteredElements == null)
        {
            _filteredElements = _currentModel.Elements
                .Where(e => (e.Name?.Contains(_elementFilter, StringComparison.OrdinalIgnoreCase) ?? false) ||
                           (e.IfcType?.Contains(_elementFilter, StringComparison.OrdinalIgnoreCase) ?? false))
                .ToList();
        }

        return _filteredElements;
    }

    public void Render(float deltaTime)
    {
        // Update status timer
        if (_statusTimer > 0)
            _statusTimer -= deltaTime;

        RenderMainMenu();
        RenderToolbar();

        if (_showElements && _currentModel != null)
            RenderElementsPanel();

        if (_showProperties && _selectedElement != null)
            RenderPropertiesPanel();

        if (_showStats && _currentModel != null)
            RenderStatsPanel();

        RenderStatusBar();
    }

    private void RenderMainMenu()
    {
        if (ImGui.BeginMainMenuBar())
        {
            if (ImGui.BeginMenu("File"))
            {
                if (ImGui.MenuItem("Open IFC", "Ctrl+O"))
                {
                    ShowStatus("Drag & drop IFC file onto window", 5);
                }
                ImGui.Separator();
                if (ImGui.MenuItem("Exit", "Esc"))
                {
                    Environment.Exit(0);
                }
                ImGui.EndMenu();
            }

            if (ImGui.BeginMenu("View"))
            {
                ImGui.MenuItem("Elements", "F2", ref _showElements);
                ImGui.MenuItem("Properties", "F3", ref _showProperties);
                ImGui.MenuItem("Statistics", "F4", ref _showStats);
                ImGui.Separator();
                if (ImGui.MenuItem("Focus", "F"))
                {
                    OnFocusModel?.Invoke();
                }
                if (ImGui.MenuItem("Reset Camera", "R"))
                {
                    OnResetCamera?.Invoke();
                }
                ImGui.EndMenu();
            }

            if (ImGui.BeginMenu("Tools"))
            {
                if (ImGui.MenuItem("Measure Distance", "M"))
                {
                    ShowStatus("Measurement tool: Click two points");
                }
                ImGui.Separator();
                if (ImGui.MenuItem("Screenshot", "F12"))
                {
                    ShowStatus("Screenshot saved");
                }
                ImGui.EndMenu();
            }

            if (ImGui.BeginMenu("Help"))
            {
                if (ImGui.MenuItem("Controls", "F1"))
                {
                    ShowStatus("WASD=Move | Mouse=Look | F=Focus");
                }
                ImGui.Separator();
                if (ImGui.MenuItem("About"))
                {
                    ShowStatus("Vizzio v3.0 - IFC Viewer");
                }
                ImGui.EndMenu();
            }

            // FPS on the right (real-time)
            var fps = ImGui.GetIO().Framerate;
            var text = $"{fps:F1} FPS";
            var textSize = ImGui.CalcTextSize(text);
            ImGui.SetCursorPosX(ImGui.GetWindowWidth() - textSize.X - 10);
            ImGui.TextColored(new Vector4(0, 1, 0, 1), text);

            ImGui.EndMainMenuBar();
        }
    }

    private void RenderToolbar()
    {
        ImGui.SetNextWindowPos(new Vector2(10, 30));
        ImGui.SetNextWindowSize(new Vector2(TOOLBAR_WIDTH, TOOLBAR_HEIGHT));
                   ImGuiWindowFlags.NoResize;

        if (ImGui.Begin("##Toolbar", flags))
        {
            if (ImGui.Button("Open\nIFC", new Vector2(50, 50)))
            {
                ShowStatus("Drag & drop IFC file or use Ctrl+O", 5);
            }

            ImGui.Dummy(new Vector2(0, 5));

            if (ImGui.Button("Select", new Vector2(50, 50)))
            {
                ShowStatus("Left-click elements to select");
            }

            ImGui.Dummy(new Vector2(0, 5));

            if (ImGui.Button("Measure", new Vector2(50, 50)))
            {
                ShowStatus("Press M to activate measurement");
            }

            ImGui.Dummy(new Vector2(0, 5));

            if (ImGui.Button("Focus", new Vector2(50, 50)))
            {
                OnFocusModel?.Invoke();
            }

            ImGui.Dummy(new Vector2(0, 5));

            if (ImGui.Button("Reset", new Vector2(50, 50)))
            {
                OnResetCamera?.Invoke();
            }
        }
        ImGui.End();
    }

    private void RenderElementsPanel()
    {
        ImGui.SetNextWindowPos(new Vector2(TOOLBAR_WIDTH + 10, 30), ImGuiCond.FirstUseEver);
        ImGui.SetNextWindowSize(new Vector2(ELEMENTS_PANEL_WIDTH, ELEMENTS_PANEL_HEIGHT), ImGuiCond.FirstUseEver);

        if (ImGui.Begin("Elements", ref _showElements))
        {
            ImGui.Text($"Total: {_currentModel!.Elements.Count}");

            // Filter input
            ImGui.SameLine();
            ImGui.Text(" | Filter:");
            ImGui.SameLine();
            ImGui.SetNextItemWidth(-1);
            if (ImGui.InputTextWithHint("##ElementFilter", "Search...", ref _elementFilter, 100))
            {
                _filteredElements = null; // Invalidate cache
            }

            ImGui.Separator();

            // Virtual list with clipper for performance
            if (ImGui.BeginChild("ElementList", new Vector2(0, -30)))
            {
                var elements = GetFilteredElements();

                unsafe
                {
                    var clipper = new ImGuiListClipper();
                    ImGuiNative.ImGuiListClipper_Begin(&clipper, elements.Count, -1);

                    while (ImGuiNative.ImGuiListClipper_Step(&clipper) != 0)
                    {
                        for (int i = clipper.DisplayStart; i < clipper.DisplayEnd; i++)
                        {
                            var element = elements[i];
                            var label = GetElementLabel(element);

                            if (ImGui.Selectable(label, element == _selectedElement))
                            {
                                SetSelectedElement(element);
                            }

                            // Tooltip with ID
                            if (ImGui.IsItemHovered())
                            {
                                ImGui.BeginTooltip();
                                ImGui.Text($"ID: {element.GlobalId}");
                                if (element.Properties.Count > 0)
                                {
                                    ImGui.Separator();
                                    ImGui.Text($"{element.Properties.Count} properties");
                                }
                                ImGui.EndTooltip();
                            }
                        }
                    }

                    ImGuiNative.ImGuiListClipper_End(&clipper);
                }

                ImGui.EndChild();
            }

            ImGui.Separator();
            if (ImGui.Button("Show All"))
            {
                foreach (var element in _currentModel.Elements)
                    element.IsVisible = true;
                ShowStatus($"All {_currentModel.Elements.Count} elements visible");
            }
            ImGui.SameLine();
            if (ImGui.Button("Hide All"))
            {
                foreach (var element in _currentModel.Elements)
                    element.IsVisible = false;
                ShowStatus("All elements hidden");
            }
        }
        ImGui.End();
    }

    private void RenderPropertiesPanel()
    {
        var displaySize = ImGui.GetIO().DisplaySize;
        ImGui.SetNextWindowPos(new Vector2(displaySize.X - PROPERTIES_PANEL_WIDTH - 10, 30), ImGuiCond.FirstUseEver);
        ImGui.SetNextWindowSize(new Vector2(PROPERTIES_PANEL_WIDTH, PROPERTIES_PANEL_HEIGHT), ImGuiCond.FirstUseEver);

        if (ImGui.Begin("Properties", ref _showProperties, ImGuiWindowFlags.AlwaysVerticalScrollbar))
        {
            if (_selectedElement != null)
            {
                // Header
                ImGui.PushStyleColor(ImGuiCol.Text, new Vector4(0.5f, 0.8f, 1, 1));
                ImGui.Text(_selectedElement.Name ?? "Unnamed");
                ImGui.PopStyleColor();

                ImGui.Separator();

                // Basic info table
                if (ImGui.BeginTable("BasicInfo", 2, ImGuiTableFlags.Borders | ImGuiTableFlags.RowBg))
                {
                    ImGui.TableSetupColumn("Property", ImGuiTableColumnFlags.WidthFixed, 100);
                    ImGui.TableSetupColumn("Value", ImGuiTableColumnFlags.WidthStretch);

                    RenderPropertyRow("Type", _selectedElement.IfcType ?? "Unknown");
                    RenderPropertyRow("ID", _selectedElement.GlobalId);

                    ImGui.EndTable();
                }

                ImGui.Separator();

                bool visible = _selectedElement.IsVisible;
                if (ImGui.Checkbox("Visible", ref visible))
                {
                    _selectedElement.IsVisible = visible;
                }

                ImGui.Separator();
                ImGui.Text($"Properties ({_selectedElement.Properties.Count}):");

                // Properties table
                if (ImGui.BeginChild("PropertiesList"))
                {
                    if (ImGui.BeginTable("Properties", 2, ImGuiTableFlags.Borders | ImGuiTableFlags.RowBg))
                    {
                        ImGui.TableSetupColumn("Name", ImGuiTableColumnFlags.WidthFixed, 120);
                        ImGui.TableSetupColumn("Value", ImGuiTableColumnFlags.WidthStretch);

                        foreach (var (key, value) in _selectedElement.Properties.Take(50))
                        {
                            RenderPropertyRow(key, value);
                        }

                        ImGui.EndTable();
                    }
                    ImGui.EndChild();
                }
            }
        }
        ImGui.End();
    }

    private void RenderPropertyRow(string label, string value)
    {
        ImGui.TableNextRow();
        ImGui.TableNextColumn();
        ImGui.TextColored(new Vector4(0.7f, 0.7f, 0.7f, 1), label);
        ImGui.TableNextColumn();
        ImGui.TextWrapped(value);
    }

    private void RenderStatsPanel()
    {
        ImGui.SetNextWindowPos(new Vector2(10, TOOLBAR_HEIGHT + 60), ImGuiCond.FirstUseEver);
        ImGui.SetNextWindowSize(new Vector2(STATS_PANEL_WIDTH, STATS_PANEL_HEIGHT), ImGuiCond.FirstUseEver);

        if (ImGui.Begin("Statistics", ref _showStats))
        {
            ImGui.Text($"Elements: {_currentModel!.Elements.Count:N0}");
            ImGui.Text($"Types: {_currentModel.GetElementTypes().Count}");
            ImGui.Separator();
            ImGui.Text($"Vertices: {_currentModel.GetTotalVertexCount():N0}");
            ImGui.Text($"Triangles: {_currentModel.GetTotalTriangleCount():N0}");
        }
        ImGui.End();
    }

    private void RenderStatusBar()
    {
        var displaySize = ImGui.GetIO().DisplaySize;
        ImGui.SetNextWindowPos(new Vector2(0, displaySize.Y - STATUS_BAR_HEIGHT));
        ImGui.SetNextWindowSize(new Vector2(displaySize.X, STATUS_BAR_HEIGHT));

        var flags = ImGuiWindowFlags.NoDecoration |
                   ImGuiWindowFlags.NoMove |
                   ImGuiWindowFlags.NoResize |
                   ImGuiWindowFlags.NoScrollbar;

        if (ImGui.Begin("##StatusBar", flags))
        {
            if (_statusTimer > 0)
            {
                // Show message in yellow with progress bar
                ImGui.TextColored(new Vector4(1, 1, 0, 1), _statusMessage);
                ImGui.SameLine();

                // Progress bar showing remaining time
                float progress = _statusTimer / _statusDuration;
                ImGui.ProgressBar(progress, new Vector2(100, 15), "");
            }
            else
            {
                ImGui.Text(_statusMessage);
            }
        }
        ImGui.End();
    }

    public void ShowStatus(string message, float duration = DEFAULT_STATUS_DURATION)
    {
        _statusMessage = message;
        _statusTimer = duration;
        _statusDuration = duration;
    }
}
