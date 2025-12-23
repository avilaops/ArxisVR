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
    public enum StatusLevel
    {
        Idle,
        Info,
        Success,
        Warning,
        Error,
        Loading
    }

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
    private const float LONG_STATUS_DURATION = 30f;
    private const string READY_STATUS_TEXT = "Ready";

    private IfcModel? _currentModel;
    private IfcElement? _selectedElement;

    // Panel visibility
    private bool _showElements = true;
    private bool _showProperties = false;
    private bool _showStats = false;
    private bool _showAI = true;

    private AIChatPanel? _aiPanel;

    // Events
    public event Action? OnOpenFile;
    public event Action? OnFocusModel;
    public event Action? OnResetCamera;
    public event Action<IfcElement?>? OnElementSelected;

    // Status system
    private string _statusMessage = READY_STATUS_TEXT;
    private float _statusTimer = 0;
    private float _statusDuration = DEFAULT_STATUS_DURATION;
    private StatusLevel _statusLevel = StatusLevel.Idle;
    private float _statusPulse;

    // Element filtering
    private string _elementFilter = "";
    private List<IfcElement>? _filteredElements = null;

    // Cache for performance
    private Dictionary<IfcElement, string> _elementLabelCache = new();

    public bool IsAIPanelVisible => _showAI;

    public void AttachAIChatPanel(AIChatPanel panel)
    {
        _aiPanel = panel;
    }

    public void SetModel(IfcModel model)
    {
        _currentModel = model;
        _elementFilter = "";
        _filteredElements = null;
        _elementLabelCache.Clear();
        ShowStatus($"Model loaded: {model.Elements.Count} elements", DEFAULT_STATUS_DURATION, StatusLevel.Success);
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
        {
            _statusTimer -= deltaTime;

            if (_statusTimer <= 0)
            {
                _statusTimer = 0;
                if (_statusLevel != StatusLevel.Loading)
                {
                    _statusMessage = READY_STATUS_TEXT;
                    _statusLevel = StatusLevel.Idle;
                }
            }
        }

        _statusPulse = (_statusPulse + deltaTime) % 2f;

        RenderMainMenu();
        RenderToolbar();

        if (_showElements && _currentModel != null)
            RenderElementsPanel();

        if (_showProperties && _selectedElement != null)
            RenderPropertiesPanel();

        if (_showStats && _currentModel != null)
            RenderStatsPanel();

        if (_showAI)
        {
            if (_aiPanel != null)
            {
                _aiPanel.Render();
            }
            else
            {
                RenderAIPanelFallback();
            }
        }

        RenderStatusBar();
    }

    private void RenderMainMenu()
    {
        ImGui.PushStyleVar(ImGuiStyleVar.FramePadding, new Vector2(12f, 6f));
        ImGui.PushStyleColor(ImGuiCol.MenuBarBg, new Vector4(0.11f, 0.12f, 0.16f, 0.95f));
        ImGui.PushStyleColor(ImGuiCol.Text, new Vector4(0.9f, 0.92f, 0.96f, 1f));
        ImGui.PushStyleColor(ImGuiCol.Header, new Vector4(0.18f, 0.2f, 0.26f, 1f));
        ImGui.PushStyleColor(ImGuiCol.HeaderHovered, new Vector4(0.32f, 0.34f, 0.42f, 1f));
        ImGui.PushStyleColor(ImGuiCol.HeaderActive, new Vector4(0.24f, 0.26f, 0.33f, 1f));
        ImGui.PushStyleColor(ImGuiCol.Separator, new Vector4(0.25f, 0.27f, 0.34f, 0.9f));

        if (ImGui.BeginMainMenuBar())
        {
            if (ImGui.BeginMenu("File"))
            {
                RenderMenuAction("Open IFC", "Ctrl+O", "Load an IFC file", () =>
                {
                    if (OnOpenFile != null)
                    {
                        OnOpenFile.Invoke();
                    }
                    else
                    {
                        ShowStatus("Drag & drop IFC file onto window", 5, StatusLevel.Info);
                    }
                });

                ImGui.Separator();

            private (Vector4 Background, Vector4 Text, Vector4 Accent) GetStatusPalette(StatusLevel level)
            {
                return level switch
                {
                    StatusLevel.Success => (new Vector4(0.10f, 0.16f, 0.12f, 0.95f), new Vector4(0.86f, 0.96f, 0.88f, 1f), new Vector4(0.38f, 0.78f, 0.48f, 1f)),
                    StatusLevel.Warning => (new Vector4(0.16f, 0.14f, 0.08f, 0.95f), new Vector4(0.98f, 0.92f, 0.76f, 1f), new Vector4(0.96f, 0.78f, 0.38f, 1f)),
                    StatusLevel.Error => (new Vector4(0.18f, 0.10f, 0.10f, 0.95f), new Vector4(0.98f, 0.86f, 0.86f, 1f), new Vector4(0.94f, 0.42f, 0.45f, 1f)),
                    StatusLevel.Loading => (new Vector4(0.12f, 0.12f, 0.18f, 0.95f), new Vector4(0.92f, 0.94f, 1f, 1f), new Vector4(0.55f, 0.65f, 1f, 1f)),
                    StatusLevel.Info => (new Vector4(0.11f, 0.13f, 0.18f, 0.95f), new Vector4(0.9f, 0.94f, 1f, 1f), new Vector4(0.4f, 0.6f, 0.95f, 1f)),
                    _ => (new Vector4(0.08f, 0.09f, 0.12f, 0.95f), new Vector4(0.65f, 0.68f, 0.75f, 1f), new Vector4(0.36f, 0.56f, 0.9f, 1f))
                };
            }

            private string GetStatusIcon(StatusLevel level)
            {
                return level switch
                {
                    StatusLevel.Success => "✓",
                    StatusLevel.Warning => "!",
                    StatusLevel.Error => "x",
                    StatusLevel.Loading => "…",
                    StatusLevel.Info => "i",
                    StatusLevel.Idle => "•",
                    _ => string.Empty
                };
            }

            private string GetLoadingIndicator()
            {
                var phase = (int)(_statusPulse * 3f) % 3 + 1;
                return new string('.', phase).PadRight(3, ' ');
            }

                RenderMenuAction("Exit", "Esc", "Close ArxisVR", () =>
                {
                    Environment.Exit(0);
                });
                ImGui.EndMenu();
            }

            if (ImGui.BeginMenu("View"))
            {
                RenderToggleMenuItem("Elements", "F2", "Toggle elements panel", ref _showElements, visible =>
                {
                    ShowStatus(visible ? "Elements panel visible" : "Elements panel hidden", DEFAULT_STATUS_DURATION, visible ? StatusLevel.Success : StatusLevel.Info);
                });

                RenderToggleMenuItem("Properties", "F3", "Toggle properties panel", ref _showProperties, visible =>
                {
                    ShowStatus(visible ? "Properties panel visible" : "Properties panel hidden", DEFAULT_STATUS_DURATION, visible ? StatusLevel.Success : StatusLevel.Info);
                });

                RenderToggleMenuItem("Statistics", "F4", "Toggle statistics panel", ref _showStats, visible =>
                {
                    ShowStatus(visible ? "Statistics panel visible" : "Statistics panel hidden", DEFAULT_STATUS_DURATION, visible ? StatusLevel.Success : StatusLevel.Info);
                });

                RenderToggleMenuItem("AI Assistant", "F5", "Show or hide the AI assistant", ref _showAI, visible =>
                {
                    ShowStatus(visible ? "AI Assistant panel enabled" : "AI Assistant hidden", DEFAULT_STATUS_DURATION, visible ? StatusLevel.Success : StatusLevel.Warning);
                });

                ImGui.Separator();

                RenderMenuAction("Focus", "F", "Focus camera on selection", () =>
                {
                    if (OnFocusModel != null)
                    {
                        OnFocusModel.Invoke();
                    }
                    else
                    {
                        ShowStatus("Focus action not available", 5, StatusLevel.Warning);
                    }
                });

                RenderMenuAction("Reset Camera", "R", "Reset camera position", () =>
                {
                    if (OnResetCamera != null)
                    {
                        OnResetCamera.Invoke();
                    }
                    else
                    {
                        ShowStatus("Reset camera action not available", 5, StatusLevel.Warning);
                    }
                });
                ImGui.EndMenu();
            }

            if (ImGui.BeginMenu("Tools"))
            {
                RenderMenuAction("Measure Distance", "M", "Open measurement tool", () =>
                {
                    ShowStatus("Measurement tool: Click two points", DEFAULT_STATUS_DURATION, StatusLevel.Info);
                });

                ImGui.Separator();

                RenderMenuAction("Screenshot", "F12", "Capture current view", () =>
                {
                    ShowStatus("Screenshot saved", DEFAULT_STATUS_DURATION, StatusLevel.Success);
                });
                ImGui.EndMenu();
            }

            if (ImGui.BeginMenu("Help"))
            {
                RenderMenuAction("Controls", "F1", "Show movement controls", () =>
                {
                    ShowStatus("WASD=Move | Mouse=Look | F=Focus", DEFAULT_STATUS_DURATION, StatusLevel.Info);
                });

                ImGui.Separator();

                RenderMenuAction("About", string.Empty, "About ArxisVR", () =>
                {
                    ShowStatus("ArxisVR v3.0 - IFC Viewer", DEFAULT_STATUS_DURATION, StatusLevel.Info);
                });
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

        ImGui.PopStyleColor(6);
        ImGui.PopStyleVar();
    }

    private void RenderToolbar()
    {
        ImGui.SetNextWindowPos(new Vector2(10, 30));
        ImGui.SetNextWindowSize(new Vector2(TOOLBAR_WIDTH, TOOLBAR_HEIGHT));

        var flags = ImGuiWindowFlags.NoDecoration |
                   ImGuiWindowFlags.NoMove |
                   ImGuiWindowFlags.NoResize;

        if (ImGui.Begin("##Toolbar", flags))
        {
            RenderToolbarButton("Open\nIFC", "Open an IFC file (Ctrl+O)", () =>
            {
                if (OnOpenFile != null)
                {
                    OnOpenFile.Invoke();
                }
                else
                {
                    ShowStatus("Drag & drop IFC file or use Ctrl+O", 5, StatusLevel.Info);
                }
            });

            ImGui.Dummy(new Vector2(0, 5));

            RenderToolbarButton("Select", "Selection mode", () =>
            {
                ShowStatus("Left-click elements to select", DEFAULT_STATUS_DURATION, StatusLevel.Info);
            });

            ImGui.Dummy(new Vector2(0, 5));

            RenderToolbarButton("Measure", "Measurement tools", () =>
            {
                ShowStatus("Press M to activate measurement", DEFAULT_STATUS_DURATION, StatusLevel.Info);
            });

            ImGui.Dummy(new Vector2(0, 5));

            RenderToolbarButton("Focus", "Focus camera on model (F)", () =>
            {
                OnFocusModel?.Invoke();
            });

            ImGui.Dummy(new Vector2(0, 5));

            RenderToolbarButton("Reset", "Reset camera (R)", () =>
            {
                OnResetCamera?.Invoke();
            });
        }
        ImGui.End();
    }

    private void RenderToolbarButton(string label, string tooltip, Action onClick)
    {
        ImGui.PushStyleColor(ImGuiCol.Button, new Vector4(0.18f, 0.2f, 0.26f, 1f));
        ImGui.PushStyleColor(ImGuiCol.ButtonHovered, new Vector4(0.32f, 0.34f, 0.42f, 1f));
        ImGui.PushStyleColor(ImGuiCol.ButtonActive, new Vector4(0.24f, 0.26f, 0.33f, 1f));
        ImGui.PushStyleVar(ImGuiStyleVar.FrameRounding, 6f);
        ImGui.PushStyleVar(ImGuiStyleVar.FrameBorderSize, 1f);

        var clicked = ImGui.Button(label, new Vector2(50, 50));

        ImGui.PopStyleVar(2);
        ImGui.PopStyleColor(3);

        if (ImGui.IsItemHovered())
        {
            ImGui.SetMouseCursor(ImGuiMouseCursor.Hand);
            ImGui.SetTooltip(tooltip);
        }

        if (clicked)
        {
            InvokeSafely(onClick);
        }
    }

    private void RenderMenuAction(string label, string shortcut, string description, Action onClick)
    {
        if (ImGui.MenuItem(label, shortcut))
        {
            InvokeSafely(onClick);
        }

        HandleMenuHover(description);
    }

    private void RenderToggleMenuItem(string label, string shortcut, string description, ref bool value, Action<bool>? onToggle = null)
    {
        if (ImGui.MenuItem(label, shortcut, ref value))
        {
            if (onToggle != null)
            {
                var currentState = value;
                InvokeSafely(() => onToggle(currentState));
            }
        }

        HandleMenuHover(description);
    }

    private void HandleMenuHover(string description)
    {
        if (ImGui.IsItemHovered())
        {
            ImGui.SetMouseCursor(ImGuiMouseCursor.Hand);

            if (!string.IsNullOrWhiteSpace(description))
            {
                ImGui.SetTooltip(description);
            }
        }
    }

    private void InvokeSafely(Action action)
    {
        try
        {
            action();
        }
        catch (Exception ex)
        {
            ShowStatus($"Action failed: {ex.Message}", 5f, StatusLevel.Error);
        }
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
                ShowStatus($"All {_currentModel.Elements.Count} elements visible", DEFAULT_STATUS_DURATION, StatusLevel.Success);
            }
            ImGui.SameLine();
            if (ImGui.Button("Hide All"))
            {
                foreach (var element in _currentModel.Elements)
                    element.IsVisible = false;
                ShowStatus("All elements hidden", DEFAULT_STATUS_DURATION, StatusLevel.Warning);
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

    private void RenderAIPanelFallback()
    {
        ImGui.SetNextWindowPos(new Vector2(TOOLBAR_WIDTH + 15, TOOLBAR_HEIGHT + 80), ImGuiCond.FirstUseEver);
        ImGui.SetNextWindowSize(new Vector2(STATS_PANEL_WIDTH + 60, 140), ImGuiCond.FirstUseEver);

        if (ImGui.Begin("AI Assistant", ref _showAI, ImGuiWindowFlags.NoCollapse))
        {
            ImGui.Text("🤖 AI Assistant");
            ImGui.Separator();
            ImGui.TextWrapped("Enable Ollama and connect an AI model to chat about your IFC data.");
            ImGui.Spacing();
            ImGui.TextWrapped("Press Ctrl+O to load a model, then ask questions to analyze it.");

            if (ImGui.Button("View Setup Guide"))
            {
                ShowStatus("See docs/OLLAMA_SETUP.md for AI setup", 5f, StatusLevel.Info);
            }
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

        var palette = GetStatusPalette(_statusLevel);

        ImGui.PushStyleColor(ImGuiCol.WindowBg, palette.Background);
        ImGui.PushStyleVar(ImGuiStyleVar.WindowPadding, new Vector2(12f, 4f));
        ImGui.PushStyleVar(ImGuiStyleVar.ItemSpacing, new Vector2(8f, 0f));

        if (ImGui.Begin("##StatusBar", flags))
        {
            var icon = GetStatusIcon(_statusLevel);
            if (!string.IsNullOrWhiteSpace(icon))
            {
                ImGui.TextColored(palette.Accent, icon);
                ImGui.SameLine();
            }

            ImGui.TextColored(palette.Text, _statusMessage);

            var showProgress = _statusTimer > 0 && _statusDuration > 0.0001f && _statusDuration <= LONG_STATUS_DURATION;
            if (showProgress)
            {
                ImGui.SameLine();
                ImGui.PushStyleColor(ImGuiCol.PlotHistogram, palette.Accent);
                ImGui.PushStyleColor(ImGuiCol.PlotHistogramHovered, palette.Accent);
                var progress = System.Math.Clamp(_statusTimer / _statusDuration, 0f, 1f);
                ImGui.ProgressBar(progress, new Vector2(90, 12), "");
                ImGui.PopStyleColor(2);
            }
            else if (_statusLevel == StatusLevel.Loading)
            {
                ImGui.SameLine();
                ImGui.TextColored(palette.Accent, GetLoadingIndicator());
            }
        }

        ImGui.End();
        ImGui.PopStyleVar(2);
        ImGui.PopStyleColor();
    }

    public void ShowStatus(string message, float duration = DEFAULT_STATUS_DURATION, StatusLevel level = StatusLevel.Info)
    {
        _statusMessage = message;
        _statusLevel = level;

        if (duration > 0)
        {
            _statusTimer = duration;
            _statusDuration = duration;
        }
        else
        {
            _statusTimer = 0;
            _statusDuration = DEFAULT_STATUS_DURATION;
        }
    }
}
