using System.Linq;
using System.Numerics;
using ImGuiNET;
using ArxisVR.Models;
using ArxisVR.Rendering;
using ArxisVR.VR;
using ArxisVR.Tools;
using ArxisVR.AI;

namespace ArxisVR.UI;

/// <summary>
/// Modern UI manager with beautiful interface and performance optimizations
/// </summary>
public class UIManager
{
    // Layout constants
    private const float PROPERTIES_PANEL_WIDTH = 420f;
    private const float PROPERTIES_PANEL_HEIGHT = 700f;
    private const float STATS_PANEL_WIDTH = 320f;
    private const float STATS_PANEL_HEIGHT = 280f;
    private const float PANEL_OFFSET = 20f;
    private const float MENU_BAR_PADDING = 12f;
    private const int MAX_PROPERTY_GROUPS = 50;

    private IfcModel? _currentModel;
    private IfcElement? _selectedElement;
    private string _searchFilter = "";
    private bool _isUpdatingSelection = false; // Prevent re-entrance

    // Cache for performance
    private Dictionary<string, string> _elementIconCache = new();
    private Dictionary<string, string> _propertyCategoryCache = new();

    // Search functionality
    public string SearchFilter
    {
        get => _searchFilter;
        set
        {
            _searchFilter = value;
            FilterElements();
        }
    }
    private bool _showProperties = true;
    private bool _showElementList = true;
    private bool _showStatistics = true;
    private bool _showVRSettings = false;
    private bool _showMeasurements = false;
    private bool _showAnnotations = false;
    private bool _showLayers = false;
    private bool _showHistory = false;
    private bool _showAIChat = true; // NEW!

    private Dictionary<string, bool> _typeVisibility = new();
    private List<MeasurementResult> _measurementHistory = new();

    // Modern components
    private ModernToolbar _toolbar = new();
    private ElementListPanel _elementListPanel = new();
    private AIChatPanel _aiChatPanel = new();

    // Existing components
    private AnnotationSystem _annotationSystem = new();
    private LayerManager _layerManager = new();
    private UndoRedoManager _undoRedoManager = new();
    private WelcomeScreen _welcomeScreen = new();
    private NotificationSystem _notifications = new();

    // Properties and Events
    public IfcElement? SelectedElement
    {
        get => _selectedElement;
        set
        {
            if (_isUpdatingSelection) return; // Prevent re-entrance loop

            try
            {
                _isUpdatingSelection = true;
                _selectedElement = value;
                OnElementSelected?.Invoke(value);
            }
            finally
            {
                _isUpdatingSelection = false;
            }
        }
    }

    public AnnotationSystem AnnotationSystem => _annotationSystem;
    public LayerManager LayerManager => _layerManager;
    public UndoRedoManager UndoRedoManager => _undoRedoManager;

    public event Action<IfcElement?>? OnElementSelected;
    public event Action<string, bool>? OnTypeVisibilityChanged;
    public event Action? OnFocusRequested;
    public event Action? OnResetCameraRequested;
    public event Action<string>? OnOpenFileRequested;
    public event Action<MeasurementMode>? OnMeasurementModeChanged;
    public event Action? OnClearMeasurements;
    public event Action<string>? OnVRMessage;

    // Type visibility management
    public void SetTypeVisibility(string typeName, bool visible)
    {
        if (_typeVisibility.ContainsKey(typeName))
        {
            _typeVisibility[typeName] = visible;
            OnTypeVisibilityChanged?.Invoke(typeName, visible);
            ShowNotification($"{typeName}: {(visible ? "Visible" : "Hidden")}", NotificationType.Info);
        }
    }

    public UIManager()
    {
        SetupToolbarEvents();
    }

    /// <summary>
    /// Set AI assistant for the chat panel
    /// </summary>
    public void SetAIAssistant(IfcAIAssistant assistant)
    {
        _aiChatPanel.SetAssistant(assistant);
    }

    public void SetModel(IfcModel model)
    {
        _currentModel = model;
        _typeVisibility.Clear();
        _elementIconCache.Clear();
        _propertyCategoryCache.Clear();
        _searchFilter = "";

        foreach (var type in model.GetElementTypes())
        {
            _typeVisibility[type] = true;
        }

        _layerManager.OrganizeByStorey(model);
    }

    private void SetupToolbarEvents()
    {
        _toolbar.OnOpenFile += () =>
        {
            var filePath = FileDialog.OpenFile("Open IFC File");
            if (!string.IsNullOrEmpty(filePath))
            {
                OnOpenFileRequested?.Invoke(filePath);
                ShowNotification($"Opening: {System.IO.Path.GetFileName(filePath)}", NotificationType.Info);
            }
        };

        _toolbar.OnSaveScreenshot += () =>
        {
            OnVRMessage?.Invoke("TAKE_SCREENSHOT");
            ShowNotification("Taking screenshot...", NotificationType.Success);
        };

        _toolbar.OnMeasureDistance += () =>
        {
            OnMeasurementModeChanged?.Invoke(MeasurementMode.Distance);
            _showMeasurements = true;
            ShowNotification("Distance measurement activated", NotificationType.Info);
        };

        _toolbar.OnMeasureArea += () =>
        {
            OnMeasurementModeChanged?.Invoke(MeasurementMode.Area);
            _showMeasurements = true;
            ShowNotification("Area measurement activated", NotificationType.Info);
        };

        _toolbar.OnMeasureAngle += () =>
        {
            OnMeasurementModeChanged?.Invoke(MeasurementMode.Angle);
            _showMeasurements = true;
            ShowNotification("Angle measurement activated", NotificationType.Info);
        };

        _toolbar.OnAnnotate += () =>
        {
            _showAnnotations = true;
            ShowNotification("Annotation mode activated", NotificationType.Info);
        };

        _toolbar.OnSelectMode += () =>
        {
            ShowNotification("Select mode", NotificationType.Info);
        };

        _toolbar.OnIsolateSelection += () =>
        {
            if (!IsolateSelectedElement())
            {
                ShowNotification("Select an element first", NotificationType.Warning);
            }
        };

        _toolbar.OnHideSelection += () =>
        {
            if (!HideSelectedElement())
            {
                ShowNotification("Select an element first", NotificationType.Warning);
            }
        };

        _toolbar.OnShowAll += () =>
        {
            if (!ShowAllElements())
            {
                ShowNotification("Load a model to manage visibility", NotificationType.Warning);
            }
        };

        _toolbar.OnSectionBox += () =>
        {
            ShowNotification("Section box tool activated", NotificationType.Info);
        };

        _toolbar.OnToggleTransparency += () =>
        {
            ShowNotification("X-Ray mode toggled", NotificationType.Info);
        };

        _toolbar.OnToggleWireframe += () =>
        {
            ShowNotification("Wireframe mode toggled", NotificationType.Info);
        };

        _toolbar.OnFocusModel += () =>
        {
            OnFocusRequested?.Invoke();
            ShowNotification("Focusing on model", NotificationType.Info);
        };

        _toolbar.OnResetCamera += () =>
        {
            OnResetCameraRequested?.Invoke();
            ShowNotification("Camera reset", NotificationType.Info);
        };

        _toolbar.OnToggleLighting += () =>
        {
            ShowNotification("Lighting toggled", NotificationType.Info);
        };

        _toolbar.OnToggleGrid += () =>
        {
            ShowNotification("Grid toggled", NotificationType.Info);
        };

        _toolbar.OnHelp += () =>
        {
            ShowNotification("Drag=Rotate | Shift+Drag=Pan | Scroll=Zoom | DblClick=Focus", NotificationType.Info);
        };

        _toolbar.OnSettings += () =>
        {
            _showVRSettings = !_showVRSettings;
            ShowNotification("Settings", NotificationType.Info);
        };
    }

    private bool HideSelectedElement()
    {
        if (_currentModel == null || _selectedElement == null)
        {
            return false;
        }

        _selectedElement.IsVisible = false;
        ShowNotification($"Hidden: {_selectedElement.Type ?? _selectedElement.Name}", NotificationType.Info);
        return true;
    }

    private bool ShowAllElements()
    {
        if (_currentModel == null)
        {
            return false;
        }

        foreach (var element in _currentModel.Elements)
        {
            element.IsVisible = true;
        }

        if (_typeVisibility.Count > 0)
        {
            foreach (var key in _typeVisibility.Keys.ToList())
            {
                if (!_typeVisibility[key])
                {
                    _typeVisibility[key] = true;
                    OnTypeVisibilityChanged?.Invoke(key, true);
                }
            }
        }

        ShowNotification($"Showing all {_currentModel.Elements.Count:N0} elements", NotificationType.Success);
        return true;
    }

    private bool IsolateSelectedElement()
    {
        if (_currentModel == null || _selectedElement == null)
        {
            return false;
        }

        foreach (var element in _currentModel.Elements)
        {
            element.IsVisible = ReferenceEquals(element, _selectedElement);
        }

        if (_typeVisibility.Count > 0)
        {
            foreach (var key in _typeVisibility.Keys.ToList())
            {
                var visible = string.Equals(key, _selectedElement.Type ?? _selectedElement.IfcType, StringComparison.OrdinalIgnoreCase);
                if (_typeVisibility[key] != visible)
                {
                    _typeVisibility[key] = visible;
                    OnTypeVisibilityChanged?.Invoke(key, visible);
                }
            }
        }

        ShowNotification($"Isolated: {_selectedElement.Type ?? _selectedElement.Name}", NotificationType.Success);
        return true;
    }

    private void FilterElements()
    {
        // Filter elements based on search text
        // This will be used by element list panel
        if (_currentModel == null || string.IsNullOrWhiteSpace(_searchFilter))
            return;

        // Implementation handled by ElementListPanel
    }

    public void Render(Camera camera, VRManager vrManager, float fps)
    {
        // Apply modern theme
        ModernTheme.Apply();

        // Update notifications
        _notifications.Update(ImGui.GetIO().DeltaTime);

        // Welcome screen
        if (_welcomeScreen.IsVisible)
        {
            _welcomeScreen.Render(ImGui.GetIO().DeltaTime);
            return;
        }

        // Main menu bar
        RenderMainMenuBar(camera, vrManager, fps);

        // Modern compact toolbar
        _toolbar.Render((int)ImGui.GetIO().DisplaySize.X, (int)ImGui.GetIO().DisplaySize.Y);

        // Navigation indicator (bottom-left corner)
        RenderNavigationIndicator(camera);

        // Modern panels
        if (_showElementList)
            _elementListPanel.Render(_currentModel, element => SelectedElement = element);

        if (_showProperties && _selectedElement != null)
            RenderModernPropertiesPanel();

        if (_showStatistics && _currentModel != null)
            RenderModernStatisticsPanel();

        if (_showAIChat)
            _aiChatPanel.Render();

        // Legacy panels (keeping for functionality)
        if (_showVRSettings)
            RenderVRSettingsPanel(vrManager);

        if (_showMeasurements)
            RenderMeasurementsPanel();

        if (_showAnnotations)
            RenderAnnotationsPanel();

        if (_showLayers)
            RenderLayersPanel();

        if (_showHistory)
            RenderHistoryPanel();

        // Notifications on top
        _notifications.Render();
    }

    private void RenderMainMenuBar(Camera camera, VRManager vrManager, float fps)
    {
        ImGui.PushStyleVar(ImGuiStyleVar.FramePadding, new Vector2(MENU_BAR_PADDING, 8));

        if (ImGui.BeginMainMenuBar())
        {
            // App title
            ImGui.PushStyleColor(ImGuiCol.Text, ModernTheme.Colors.Primary);
            ImGui.Text("ArxisVR");
            ImGui.PopStyleColor();

            ImGui.Spacing();
            ImGui.Separator();
            ImGui.Spacing();

            // File menu
            if (ImGui.BeginMenu("File"))
            {
                if (ImGui.MenuItem("Open IFC...", "Ctrl+O"))
                {
                    var filePath = FileDialog.OpenFile("Open IFC File");
                    if (!string.IsNullOrEmpty(filePath))
                    {
                        OnOpenFileRequested?.Invoke(filePath);
                        ShowNotification($"Opening: {System.IO.Path.GetFileName(filePath)}", NotificationType.Info);
                    }
                }

                ImGui.Separator();

                if (ImGui.MenuItem("Screenshot", "F12"))
                {
                    OnVRMessage?.Invoke("TAKE_SCREENSHOT");
                }

                ImGui.Separator();

                if (ImGui.MenuItem("Exit", "Alt+F4"))
                {
                    Environment.Exit(0);
                }

                ImGui.EndMenu();
            }

            // View menu
            if (ImGui.BeginMenu("View"))
            {
                ImGui.MenuItem("Elements", "F2", ref _showElementList);
                ImGui.MenuItem("Properties", "F3", ref _showProperties);
                ImGui.MenuItem("Statistics", "F4", ref _showStatistics);
                ImGui.MenuItem("AI Chat", "F9", ref _showAIChat);

                ImGui.Separator();

                ImGui.MenuItem("Measurements", "F5", ref _showMeasurements);
                ImGui.MenuItem("Annotations", "F7", ref _showAnnotations);
                ImGui.MenuItem("Layers", "F8", ref _showLayers);

                ImGui.Separator();

                if (ImGui.MenuItem("Focus Model", "F"))
                    OnFocusRequested?.Invoke();

                if (ImGui.MenuItem("Reset Camera", "R"))
                    OnResetCameraRequested?.Invoke();

                ImGui.EndMenu();
            }

            // Tools menu
            if (ImGui.BeginMenu("Tools"))
            {
                ImGui.TextDisabled("MEASUREMENT");
                ImGui.Separator();

                if (ImGui.MenuItem("Distance", "M"))
                {
                    OnMeasurementModeChanged?.Invoke(MeasurementMode.Distance);
                    _showMeasurements = true;
                }

                if (ImGui.MenuItem("Area", "Shift+M"))
                {
                    OnMeasurementModeChanged?.Invoke(MeasurementMode.Area);
                    _showMeasurements = true;
                }

                if (ImGui.MenuItem("Angle", "Ctrl+M"))
                {
                    OnMeasurementModeChanged?.Invoke(MeasurementMode.Angle);
                    _showMeasurements = true;
                }

                ImGui.Separator();
                ImGui.TextDisabled("SELECTION");
                ImGui.Separator();

                if (ImGui.MenuItem("Isolate Selection", "I"))
                {
                    if (_selectedElement != null)
                        ShowNotification($"Isolated: {_selectedElement.Type}", NotificationType.Success);
                    else
                        ShowNotification("No element selected", NotificationType.Warning);
                }

                if (ImGui.MenuItem("Hide Selection", "H"))
                {
                    if (_selectedElement != null)
                        ShowNotification($"Hidden: {_selectedElement.Type}", NotificationType.Info);
                    else
                        ShowNotification("No element selected", NotificationType.Warning);
                }

                if (ImGui.MenuItem("Show All", "Shift+H"))
                {
                    ShowNotification("Showing all elements", NotificationType.Success);
                }

                ImGui.Separator();
                ImGui.TextDisabled("VISUALIZATION");
                ImGui.Separator();

                if (ImGui.MenuItem("Section Box", "B"))
                {
                    ShowNotification("Section box tool activated", NotificationType.Info);
                }

                if (ImGui.MenuItem("Wireframe", "W"))
                {
                    ShowNotification("Wireframe toggled", NotificationType.Info);
                }

                if (ImGui.MenuItem("Transparency", "T"))
                {
                    ShowNotification("Transparency toggled", NotificationType.Info);
                }

                ImGui.Separator();

                if (ImGui.MenuItem("Clear Measurements"))
                {
                    OnClearMeasurements?.Invoke();
                    _measurementHistory.Clear();
                    ShowNotification("Measurements cleared", NotificationType.Success);
                }

                ImGui.EndMenu();
            }

            // VR/AR menu
            if (ImGui.BeginMenu("VR/AR"))
            {
                bool vrEnabled = vrManager.IsVREnabled;
                if (ImGui.MenuItem("VR Mode", "F2", ref vrEnabled))
                {
                    if (vrEnabled)
                        vrManager.EnableVRMode(camera);
                    else
                        vrManager.DisableVRMode();
                }

                bool arEnabled = vrManager.IsAREnabled;
                if (ImGui.MenuItem("AR Mode", "F3", ref arEnabled))
                {
                    if (arEnabled)
                        vrManager.EnableARMode(camera);
                    else
                        vrManager.DisableARMode();
                }

                ImGui.Separator();

                ImGui.MenuItem("Settings", null, ref _showVRSettings);

                ImGui.EndMenu();
            }

            // Help menu
            if (ImGui.BeginMenu("Help"))
            {
                if (ImGui.MenuItem("Controls", "F1"))
                {
                    ShowNotification("Press F1 for controls!", NotificationType.Info);
                }

                ImGui.Separator();

                if (ImGui.MenuItem("About"))
                {
                    ShowNotification("ArxisVR - IFC Viewer with AI", NotificationType.Info);
                }

                ImGui.EndMenu();
            }

            // FPS counter (right-aligned)
            var availWidth = ImGui.GetContentRegionAvail().X;
            ImGui.SetCursorPosX(ImGui.GetCursorPosX() + availWidth - 100);

            ImGui.PushStyleColor(ImGuiCol.Text, ModernTheme.Colors.Success);
            ImGui.Text($"{fps:F0} FPS");
            ImGui.PopStyleColor();

            ImGui.EndMainMenuBar();
        }

        ImGui.PopStyleVar();
    }

    private string GetElementIcon(string ifcType)
    {
        if (string.IsNullOrEmpty(ifcType)) return "[-]";

        if (_elementIconCache.TryGetValue(ifcType, out var cached))
            return cached;

        string icon;
        if (ifcType.Contains("Wall")) icon = "[W]";
        else if (ifcType.Contains("Slab")) icon = "[S]";
        else if (ifcType.Contains("Column")) icon = "[C]";
        else if (ifcType.Contains("Beam")) icon = "[B]";
        else if (ifcType.Contains("Door")) icon = "[D]";
        else if (ifcType.Contains("Window")) icon = "[Win]";
        else if (ifcType.Contains("Roof")) icon = "[R]";
        else if (ifcType.Contains("Stair")) icon = "[St]";
        else if (ifcType.Contains("Railing")) icon = "[Rl]";
        else if (ifcType.Contains("Pile") || ifcType.Contains("Footing")) icon = "[F]";
        else if (ifcType.Contains("Flow") || ifcType.Contains("Pipe")) icon = "[P]";
        else icon = "[-]";

        _elementIconCache[ifcType] = icon;
        return icon;
    }

    private void RenderModernPropertiesPanel()
    {
        if (_selectedElement == null)
            return;

        var displaySize = ImGui.GetIO().DisplaySize;
        ImGui.SetNextWindowSize(new Vector2(PROPERTIES_PANEL_WIDTH, PROPERTIES_PANEL_HEIGHT), ImGuiCond.FirstUseEver);
        ImGui.SetNextWindowPos(new Vector2(displaySize.X - PROPERTIES_PANEL_WIDTH - PANEL_OFFSET, 120), ImGuiCond.FirstUseEver);

        if (ImGui.Begin("📋 Properties Inspector", ref _showProperties))
        {
            // Header with icon based on type
            var icon = GetElementIcon(_selectedElement.IfcType ?? "");
            ModernTheme.SectionHeader($"{icon} {_selectedElement.Name ?? "Unnamed Element"}");

            // Type badge
            ImGui.PushStyleColor(ImGuiCol.Button, ModernTheme.Colors.Primary);
            ImGui.Button(_selectedElement.IfcType ?? "Unknown");
            ImGui.PopStyleColor();

            ImGui.SameLine();
            ImGui.TextDisabled($"ID: {_selectedElement.GlobalId}");

            ImGui.Spacing();
            ImGui.Separator();
            ImGui.Spacing();

            // Color picker
            var color = _selectedElement.Color;
            if (ImGui.ColorEdit3("Color", ref color))
            {
                var action = new ChangeColorAction(_selectedElement, color);
                _undoRedoManager.ExecuteAction(action);
            }

            // Visibility
            bool isVisible = _selectedElement.IsVisible;
            if (ImGui.Checkbox("Visible", ref isVisible))
            {
                var action = new ChangeVisibilityAction(_selectedElement, isVisible);
                _undoRedoManager.ExecuteAction(action);
            }

            ImGui.Spacing();

            // AI Analysis button
            if (ModernTheme.StyledButton("🤖 Analyze with AI", null, ModernTheme.Colors.AIAssistant))
            {
                _ = _aiChatPanel.AnalyzeElement(_selectedElement.Type ?? "Element",
                    _selectedElement.Properties);
            }

            ImGui.Spacing();
            ImGui.Separator();
            ImGui.Spacing();

            // Properties table - Complete view (AutoCAD/Revit style)
            if (ImGui.BeginTabBar("PropertyTabs"))
            {
                if (ImGui.BeginTabItem("📋 All Properties"))
                {
                    // Search filter for properties
                    string propFilter = "";
                    ImGui.SetNextItemWidth(-1);
                    ImGui.InputTextWithHint("##PropFilter", "Search properties...", ref propFilter, 100);
                    ImGui.Spacing();

                    // Group properties by category
                    var groupedProps = _selectedElement.Properties
                        .GroupBy(p => GetPropertyCategory(p.Key))
                        .OrderBy(g => g.Key)
                        .Take(MAX_PROPERTY_GROUPS);

                    if (ImGui.BeginChild("PropertiesScroll", new Vector2(0, 0)))
                    {
                        foreach (var group in groupedProps)
                        {
                            if (ImGui.CollapsingHeader(group.Key, ImGuiTreeNodeFlags.DefaultOpen))
                            {
                                if (ImGui.BeginTable($"props_{group.Key}", 2, ImGuiTableFlags.Borders | ImGuiTableFlags.RowBg | ImGuiTableFlags.SizingStretchProp))
                                {
                                    ImGui.TableSetupColumn("Property", ImGuiTableColumnFlags.WidthFixed, 180);
                                    ImGui.TableSetupColumn("Value");
                                    ImGui.TableHeadersRow();

                                    var properties = string.IsNullOrWhiteSpace(propFilter)
                                        ? group.OrderBy(p => p.Key)
                                        : group.Where(p => p.Key.Contains(propFilter, StringComparison.OrdinalIgnoreCase) ||
                                                          p.Value.Contains(propFilter, StringComparison.OrdinalIgnoreCase))
                                              .OrderBy(p => p.Key);

                                    foreach (KeyValuePair<string, string> prop in properties)
                                    {
                                        ImGui.TableNextRow();
                                        ImGui.TableNextColumn();
                                        ImGui.PushStyleColor(ImGuiCol.Text, ModernTheme.Colors.Text);
                                        ImGui.TextUnformatted(prop.Key);
                                        ImGui.PopStyleColor();

                                        ImGui.TableNextColumn();
                                        ImGui.TextWrapped(prop.Value);

                                        // Enhanced tooltips and copy
                                        if (ImGui.IsItemHovered())
                                        {
                                            ImGui.BeginTooltip();
                                            ImGui.Text("Right-click to copy");
                                            if (prop.Value.Length > 50)
                                            {
                                                ImGui.Separator();
                                                ImGui.TextWrapped(prop.Value);
                                            }
                                            ImGui.EndTooltip();

                                            if (ImGui.IsMouseClicked(ImGuiMouseButton.Right))
                                            {
                                                ImGui.SetClipboardText(prop.Value);
                                                ShowNotification($"Copied: {prop.Key}", NotificationType.Info);
                                            }
                                        }
                                    }

                                    ImGui.EndTable();
                                }
                            }
                        }
                        ImGui.EndChild();
                    }
                    ImGui.EndTabItem();
                }

                if (_selectedElement.Geometry != null && ImGui.BeginTabItem("📐 Geometry"))
                {
                    var geom = _selectedElement.Geometry;
                    ImGui.Text($"Vertices: {geom.Vertices.Count:N0}");
                    ImGui.Text($"Triangles: {geom.Indices.Count / 3:N0}");
                    ImGui.Spacing();
                    ImGui.Text($"Center: {geom.GetCenter()}");
                    ImGui.Text($"Size: {geom.GetSize():F2}");
                    ImGui.EndTabItem();
                }

                ImGui.EndTabBar();
            }
        }

        ImGui.End();
    }

    private void RenderModernStatisticsPanel()
    {
        if (_currentModel == null)
            return;

        var displaySize = ImGui.GetIO().DisplaySize;
        ImGui.SetNextWindowSize(new Vector2(STATS_PANEL_WIDTH, STATS_PANEL_HEIGHT), ImGuiCond.FirstUseEver);
        ImGui.SetNextWindowPos(new Vector2(PANEL_OFFSET - 5, displaySize.Y - STATS_PANEL_HEIGHT - PANEL_OFFSET), ImGuiCond.FirstUseEver);

        if (ImGui.Begin("📊 Statistics", ref _showStatistics))
        {
            ModernTheme.SectionHeader("Model Info");

            ImGui.Text($"📄 {_currentModel.FileName}");
            ImGui.Spacing();

            // Stats with badges
            ImGui.Text("Elements:");
            ImGui.SameLine();
            ModernTheme.Badge($"{_currentModel.Elements.Count:N0}", ModernTheme.Colors.Primary);

            ImGui.Text("Types:");
            ImGui.SameLine();
            ModernTheme.Badge($"{_currentModel.GetElementTypes().Count}", ModernTheme.Colors.Info);

            ImGui.Spacing();
            ImGui.Separator();
            ImGui.Spacing();

            ModernTheme.SectionHeader("Geometry");

            ImGui.Text($"📐 Vertices: {_currentModel.GetTotalVertexCount():N0}");
            ImGui.Text($"🔺 Triangles: {_currentModel.GetTotalTriangleCount():N0}");
            ImGui.Spacing();
            ImGui.TextDisabled($"Center: {_currentModel.ModelCenter}");
            ImGui.TextDisabled($"Size: {_currentModel.ModelSize:F2}");
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

            var ipd = vrManager.IPD * 1000;
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

    private void RenderMeasurementsPanel()
    {
        ImGui.SetNextWindowPos(new Vector2(780, 30), ImGuiCond.FirstUseEver);
        ImGui.SetNextWindowSize(new Vector2(400, 300), ImGuiCond.FirstUseEver);

        if (ImGui.Begin("Measurements", ref _showMeasurements))
        {
            ImGui.Text("Measurement Tools");
            ImGui.Separator();

            if (ImGui.Button("Distance (M)"))
                OnMeasurementModeChanged?.Invoke(MeasurementMode.Distance);
            ImGui.SameLine();
            if (ImGui.Button("Area"))
                OnMeasurementModeChanged?.Invoke(MeasurementMode.Area);
            ImGui.SameLine();
            if (ImGui.Button("Angle"))
                OnMeasurementModeChanged?.Invoke(MeasurementMode.Angle);

            ImGui.Separator();

            ImGui.TextWrapped("Click on elements to add measurement points.");

            ImGui.Separator();

            ImGui.Text($"History ({_measurementHistory.Count}):");

            if (ImGui.BeginChild("MeasurementHistory"))
            {
                for (int i = _measurementHistory.Count - 1; i >= 0; i--)
                {
                    var result = _measurementHistory[i];
                    if (ImGui.Selectable($"#{i + 1}: {result}"))
                    {
                        // Highlight measurement
                    }
                }

                ImGui.EndChild();
            }

            ImGui.Separator();

            if (ImGui.Button("Clear All"))
            {
                OnClearMeasurements?.Invoke();
                _measurementHistory.Clear();
            }
        }

        ImGui.End();
    }

    private void RenderAnnotationsPanel()
    {
        ImGui.SetNextWindowPos(new Vector2(10, 750), ImGuiCond.FirstUseEver);
        ImGui.SetNextWindowSize(new Vector2(350, 300), ImGuiCond.FirstUseEver);

        if (ImGui.Begin("Annotations", ref _showAnnotations))
        {
            ImGui.Text("3D Annotations");
            ImGui.Separator();

            if (ImGui.Button("📝 Note"))
            {
                // Add note annotation
            }
            ImGui.SameLine();
            if (ImGui.Button("⚠️ Warning"))
            {
                // Add warning annotation
            }
            ImGui.SameLine();
            if (ImGui.Button("❌ Error"))
            {
                // Add error annotation
            }

            ImGui.Separator();

            ImGui.Text($"Total: {_annotationSystem.Annotations.Count}");

            if (ImGui.BeginChild("AnnotationList"))
            {
                foreach (var annotation in _annotationSystem.Annotations)
                {
                    var icon = annotation.Type switch
                    {
                        AnnotationType.Note => "📝",
                        AnnotationType.Warning => "⚠️",
                        AnnotationType.Error => "❌",
                        AnnotationType.Info => "ℹ️",
                        _ => "•"
                    };

                    if (ImGui.Selectable($"{icon} [{annotation.Id}] {annotation.Text}"))
                    {
                        // Focus on annotation
                    }
                }

                ImGui.EndChild();
            }

            ImGui.Separator();

            if (ImGui.Button("Clear All"))
                _annotationSystem.ClearAll();
        }

        ImGui.End();
    }

    private void RenderLayersPanel()
    {
        ImGui.SetNextWindowPos(new Vector2(370, 540), ImGuiCond.FirstUseEver);
        ImGui.SetNextWindowSize(new Vector2(400, 300), ImGuiCond.FirstUseEver);

        if (ImGui.Begin("Layers", ref _showLayers))
        {
            ImGui.Text("Model Layers");
            ImGui.Separator();

            if (ImGui.Button("By Storey"))
            {
                if (_currentModel != null)
                    _layerManager.OrganizeByStorey(_currentModel);
            }
            ImGui.SameLine();
            if (ImGui.Button("By Type"))
            {
                if (_currentModel != null)
                    _layerManager.OrganizeByType(_currentModel);
            }

            ImGui.Separator();

            if (ImGui.BeginChild("LayerList"))
            {
                foreach (var layerName in _layerManager.LayerOrder)
                {
                    var layer = _layerManager.GetLayer(layerName);
                    if (layer == null) continue;

                    bool isVisible = layer.IsVisible;
                    if (ImGui.Checkbox($"{layer.Name} ({layer.ElementCount})", ref isVisible))
                    {
                        _layerManager.SetLayerVisibility(layerName, isVisible);
                    }
                }

                ImGui.EndChild();
            }
        }

        ImGui.End();
    }

    private void RenderHistoryPanel()
    {
        ImGui.SetNextWindowPos(new Vector2(780, 350), ImGuiCond.FirstUseEver);
        ImGui.SetNextWindowSize(new Vector2(350, 400), ImGuiCond.FirstUseEver);

        if (ImGui.Begin("History", ref _showHistory))
        {
            ImGui.Text("Undo/Redo History");
            ImGui.Separator();

            bool canUndo = _undoRedoManager.CanUndo;
            bool canRedo = _undoRedoManager.CanRedo;

            if (ImGui.Button("↶ Undo (Ctrl+Z)") && canUndo)
            {
                _undoRedoManager.Undo();
                ShowNotification("Action undone", NotificationType.Info);
            }
            ImGui.SameLine();
            if (ImGui.Button("↷ Redo (Ctrl+Y)") && canRedo)
            {
                _undoRedoManager.Redo();
                ShowNotification("Action redone", NotificationType.Info);
            }

            ImGui.Separator();

            ImGui.Text($"Undo: {_undoRedoManager.UndoCount} | Redo: {_undoRedoManager.RedoCount}");
        }

        ImGui.End();
    }

    public void ShowNotification(string message, NotificationType type = NotificationType.Info)
    {
        switch (type)
        {
            case NotificationType.Success:
                _notifications.ShowSuccess(message);
                break;
            case NotificationType.Warning:
                _notifications.ShowWarning(message);
                break;
            case NotificationType.Error:
                _notifications.ShowError(message);
                break;
            default:
                _notifications.ShowInfo(message);
                break;
        }
    }

    public void AddMeasurementResult(MeasurementResult result)
    {
        _measurementHistory.Add(result);
    }

    private void RenderNavigationIndicator(Camera camera)
    {
        var viewport = ImGui.GetMainViewport();
        ImGui.SetNextWindowPos(new Vector2(20, viewport.Size.Y - 200), ImGuiCond.Always);
        ImGui.SetNextWindowSize(new Vector2(260, 170), ImGuiCond.Always);

        ImGui.PushStyleVar(ImGuiStyleVar.WindowRounding, 12.0f);
        ImGui.PushStyleVar(ImGuiStyleVar.WindowPadding, new Vector2(16, 12));
        ImGui.PushStyleColor(ImGuiCol.WindowBg, new Vector4(0.08f, 0.08f, 0.10f, 0.92f));
        ImGui.PushStyleColor(ImGuiCol.Border, new Vector4(0.4f, 0.7f, 0.98f, 0.4f));

        var flags = ImGuiWindowFlags.NoDecoration |
                   ImGuiWindowFlags.NoMove |
                   ImGuiWindowFlags.NoResize |
                   ImGuiWindowFlags.NoSavedSettings |
                   ImGuiWindowFlags.NoFocusOnAppearing;

        if (ImGui.Begin("##NavigationIndicator", flags))
        {
            // Title
            ImGui.PushStyleColor(ImGuiCol.Text, new Vector4(0.4f, 0.7f, 0.98f, 1.0f));
            ImGui.Text("🎮 CS-Style Navigation");
            ImGui.PopStyleColor();

            ImGui.Separator();
            ImGui.Spacing();

            // Camera mode
            string modeIcon = camera.IsOrbitMode ? "🔄" : "🚶";
            string modeText = camera.IsOrbitMode ? "Orbit" : "FPS";
            ImGui.Text($"{modeIcon} Mode: {modeText}");

            // Movement state
            string stateIcon = "🟢";
            string stateText = "Walk";
            Vector4 stateColor = new Vector4(0.3f, 0.8f, 0.4f, 1.0f);

            if (camera.IsSprinting)
            {
                stateIcon = "🔥";
                stateText = "SPRINT";
                stateColor = new Vector4(1.0f, 0.4f, 0.2f, 1.0f);
            }
            else if (camera.IsCrouching)
            {
                stateIcon = "🟡";
                stateText = "Crouch";
                stateColor = new Vector4(1.0f, 0.8f, 0.0f, 1.0f);
            }

            ImGui.PushStyleColor(ImGuiCol.Text, stateColor);
            ImGui.Text($"{stateIcon} {stateText}");
            ImGui.PopStyleColor();

            // Velocity (CS-style speedometer)
            float velocity = camera.CurrentVelocity;
            float velocityPercent = Math.Min(velocity / (camera.MovementSpeed * 2.0f), 1.0f);

            ImGui.Text($"⚡ Speed: {velocity:F1} u/s");

            // Speed bar
            ImGui.PushStyleColor(ImGuiCol.PlotHistogram, new Vector4(0.2f + velocityPercent * 0.6f, 0.8f - velocityPercent * 0.5f, 0.2f, 1.0f));
            ImGui.ProgressBar(velocityPercent, new Vector2(-1, 8), "");
            ImGui.PopStyleColor();

            // FOV
            ImGui.Text($"🔍 FOV: {camera.Fov:F0}°");

            ImGui.Spacing();

            // Controls hint
            ImGui.PushStyleColor(ImGuiCol.Text, new Vector4(0.5f, 0.5f, 0.55f, 1.0f));
            ImGui.TextWrapped("Shift=Sprint • Ctrl=Crouch");
            ImGui.TextWrapped("Double-click to focus");
            ImGui.PopStyleColor();
        }
        ImGui.End();

        ImGui.PopStyleColor(2);
        ImGui.PopStyleVar(2);
    }

    private void RenderCrosshair()
    {
        var viewport = ImGui.GetMainViewport();
        var center = new Vector2(viewport.Size.X / 2, viewport.Size.Y / 2);

        // Subtle CS-style crosshair
        var drawList = ImGui.GetForegroundDrawList();

        float size = 8.0f;
        float thickness = 1.5f;
        float gap = 4.0f;

        var color = ImGui.ColorConvertFloat4ToU32(new Vector4(0.0f, 1.0f, 0.3f, 0.7f));

        // Horizontal lines
        drawList.AddLine(
            new Vector2(center.X - size - gap, center.Y),
            new Vector2(center.X - gap, center.Y),
            color, thickness);
        drawList.AddLine(
            new Vector2(center.X + gap, center.Y),
            new Vector2(center.X + size + gap, center.Y),
            color, thickness);

        // Vertical lines
        drawList.AddLine(
            new Vector2(center.X, center.Y - size - gap),
            new Vector2(center.X, center.Y - gap),
            color, thickness);
        drawList.AddLine(
            new Vector2(center.X, center.Y + gap),
            new Vector2(center.X, center.Y + size + gap),
            color, thickness);

        // Center dot (optional)
        drawList.AddCircleFilled(center, 1.0f, color);
    }

    private string GetPropertyCategory(string propertyKey)
    {
        // Categorize properties based on common IFC patterns
        if (propertyKey.Contains("Dimension") || propertyKey.Contains("Width") || propertyKey.Contains("Height") ||
            propertyKey.Contains("Length") || propertyKey.Contains("Thickness") || propertyKey.Contains("Area") ||
            propertyKey.Contains("Volume"))
            return "📏 Dimensions";

        if (propertyKey.Contains("Material") || propertyKey.Contains("Finish"))
            return "🎨 Materials";

        if (propertyKey.Contains("Structural") || propertyKey.Contains("Load") || propertyKey.Contains("Strength"))
            return "🏗️ Structural";

        if (propertyKey.Contains("Fire") || propertyKey.Contains("Acoustic") || propertyKey.Contains("Thermal"))
            return "🔥 Performance";

        if (propertyKey.Contains("Status") || propertyKey.Contains("Phase") || propertyKey.Contains("Created") ||
            propertyKey.Contains("Modified"))
            return "📋 Status";

        return "📦 General";
    }
}
