using System.Numerics;
using ImGuiNET;
using Vizzio.Models;
using Vizzio.Rendering;
using Vizzio.VR;
using Vizzio.Tools;
using Vizzio.AI;

namespace Vizzio.UI;

/// <summary>
/// Modern UI manager with beautiful interface
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
    private bool _showMeasurements = false;
    private bool _showAnnotations = false;
    private bool _showLayers = false;
    private bool _showHistory = false;
    private bool _showAIChat = true; // NEW!
    
    private Dictionary<string, bool> _typeVisibility = new();
    private List<MeasurementResult> _measurementHistory = new();
    
    // Modern components
    private Toolbar _toolbar = new();
    private ElementListPanel _elementListPanel = new();
    private AIChatPanel _aiChatPanel = new(); // NEW!
    
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
            _selectedElement = value;
            OnElementSelected?.Invoke(value);
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
            ShowNotification("Screenshot feature coming soon!", NotificationType.Info);
        };

        _toolbar.OnMeasureDistance += () =>
        {
            OnMeasurementModeChanged?.Invoke(MeasurementMode.Distance);
            _showMeasurements = true;
            ShowNotification("Distance measurement mode activated", NotificationType.Info);
        };

        _toolbar.OnMeasureArea += () =>
        {
            OnMeasurementModeChanged?.Invoke(MeasurementMode.Area);
            _showMeasurements = true;
            ShowNotification("Area measurement mode activated", NotificationType.Info);
        };

        _toolbar.OnMeasureAngle += () =>
        {
            OnMeasurementModeChanged?.Invoke(MeasurementMode.Angle);
            _showMeasurements = true;
            ShowNotification("Angle measurement mode activated", NotificationType.Info);
        };

        _toolbar.OnSelectMode += () =>
        {
            ShowNotification("Select mode activated", NotificationType.Info);
        };

        _toolbar.OnPanMode += () =>
        {
            ShowNotification("Pan mode activated", NotificationType.Info);
        };

        _toolbar.OnOrbitMode += () =>
        {
            ShowNotification("Orbit mode activated", NotificationType.Info);
        };

        _toolbar.OnFocusModel += () =>
        {
            OnFocusRequested?.Invoke();
            ShowNotification("Focus on model", NotificationType.Info);
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

        _toolbar.OnToggleVR += () =>
        {
            ShowNotification("VR mode toggled", NotificationType.Info);
        };

        _toolbar.OnSettings += () =>
        {
            ShowNotification("Settings opened", NotificationType.Info);
        };
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

        // Toolbar
        _toolbar.Render((int)ImGui.GetIO().DisplaySize.X, (int)ImGui.GetIO().DisplaySize.Y);

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
        ImGui.PushStyleVar(ImGuiStyleVar.FramePadding, new Vector2(12, 8));

        if (ImGui.BeginMainMenuBar())
        {
            // App title
            ImGui.PushStyleColor(ImGuiCol.Text, ModernTheme.Colors.Primary);
            ImGui.Text("✦ VIZZIO");
            ImGui.PopStyleColor();

            ImGui.Spacing();
            ImGui.Separator();
            ImGui.Spacing();

            // File menu
            if (ImGui.BeginMenu("📂 File"))
            {
                if (ImGui.MenuItem("📂 Open IFC...", "Ctrl+O"))
                {
                    var filePath = FileDialog.OpenFile("Open IFC File");
                    if (!string.IsNullOrEmpty(filePath))
                    {
                        OnOpenFileRequested?.Invoke(filePath);
                        ShowNotification($"Opening: {System.IO.Path.GetFileName(filePath)}", NotificationType.Info);
                    }
                }

                ImGui.Separator();

                if (ImGui.MenuItem("💾 Save Screenshot", "F12"))
                {
                    ShowNotification("Screenshot feature coming soon!", NotificationType.Info);
                }

                ImGui.Separator();

                if (ImGui.MenuItem("❌ Exit", "Alt+F4"))
                {
                    Environment.Exit(0);
                }

                ImGui.EndMenu();
            }

            // View menu
            if (ImGui.BeginMenu("👁️ View"))
            {
                ImGui.MenuItem("📋 Elements", "F2", ref _showElementList);
                ImGui.MenuItem("ℹ️ Properties", "F3", ref _showProperties);
                ImGui.MenuItem("📊 Statistics", "F4", ref _showStatistics);
                ImGui.MenuItem("🤖 AI Chat", "F9", ref _showAIChat);
                
                ImGui.Separator();
                
                ImGui.MenuItem("📏 Measurements", "F5", ref _showMeasurements);
                ImGui.MenuItem("📝 Annotations", "F7", ref _showAnnotations);
                ImGui.MenuItem("🗂️ Layers", "F8", ref _showLayers);

                ImGui.Separator();

                if (ImGui.MenuItem("🎯 Focus Model", "F"))
                    OnFocusRequested?.Invoke();

                if (ImGui.MenuItem("↺ Reset Camera", "R"))
                    OnResetCameraRequested?.Invoke();

                ImGui.EndMenu();
            }

            // Tools menu
            if (ImGui.BeginMenu("🔧 Tools"))
            {
                if (ImGui.MenuItem("📏 Distance", "M"))
                {
                    OnMeasurementModeChanged?.Invoke(MeasurementMode.Distance);
                    _showMeasurements = true;
                }

                if (ImGui.MenuItem("📐 Area"))
                {
                    OnMeasurementModeChanged?.Invoke(MeasurementMode.Area);
                    _showMeasurements = true;
                }

                ImGui.Separator();

                if (ImGui.MenuItem("🗑️ Clear All"))
                {
                    OnClearMeasurements?.Invoke();
                    _measurementHistory.Clear();
                }

                ImGui.EndMenu();
            }

            // VR/AR menu
            if (ImGui.BeginMenu("🥽 VR/AR"))
            {
                bool vrEnabled = vrManager.IsVREnabled;
                if (ImGui.MenuItem("🥽 VR Mode", "F2", ref vrEnabled))
                {
                    if (vrEnabled)
                        vrManager.EnableVRMode(camera);
                    else
                        vrManager.DisableVRMode();
                }

                bool arEnabled = vrManager.IsAREnabled;
                if (ImGui.MenuItem("📱 AR Mode", "F3", ref arEnabled))
                {
                    if (arEnabled)
                        vrManager.EnableARMode(camera);
                    else
                        vrManager.DisableARMode();
                }

                ImGui.Separator();

                ImGui.MenuItem("⚙️ Settings", null, ref _showVRSettings);

                ImGui.EndMenu();
            }

            // Help menu
            if (ImGui.BeginMenu("❓ Help"))
            {
                if (ImGui.MenuItem("⌨️ Controls", "F1"))
                {
                    ShowNotification("Press F1 for controls!", NotificationType.Info);
                }

                ImGui.Separator();

                if (ImGui.MenuItem("ℹ️ About"))
                {
                    ShowNotification("VIZZIO - IFC Viewer with AI", NotificationType.Info);
                }

                ImGui.EndMenu();
            }

            // FPS counter (right-aligned)
            var availWidth = ImGui.GetContentRegionAvail().X;
            ImGui.SetCursorPosX(ImGui.GetCursorPosX() + availWidth - 100);
            
            ImGui.PushStyleColor(ImGuiCol.Text, ModernTheme.Colors.Success);
            ImGui.Text($"⚡ {fps:F0} FPS");
            ImGui.PopStyleColor();

            ImGui.EndMainMenuBar();
        }

        ImGui.PopStyleVar();
    }

    private void RenderModernPropertiesPanel()
    {
        if (_selectedElement == null)
            return;

        ImGui.SetNextWindowSize(new Vector2(380, 550), ImGuiCond.FirstUseEver);
        ImGui.SetNextWindowPos(new Vector2(ImGui.GetIO().DisplaySize.X - 400, 120), ImGuiCond.FirstUseEver);

        if (ImGui.Begin("ℹ️ Properties", ref _showProperties))
        {
            // Header
            ModernTheme.SectionHeader(_selectedElement.Name ?? "Unknown");

            // Basic info
            ImGui.Text($"Type: {_selectedElement.IfcType}");
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

            // Properties table
            if (ImGui.BeginTabBar("PropertyTabs"))
            {
                if (ImGui.BeginTabItem("📋 Properties"))
                {
                    if (ImGui.BeginTable("props", 2, ImGuiTableFlags.Borders | ImGuiTableFlags.RowBg | ImGuiTableFlags.ScrollY))
                    {
                        ImGui.TableSetupColumn("Property", ImGuiTableColumnFlags.WidthFixed, 150);
                        ImGui.TableSetupColumn("Value");
                        ImGui.TableHeadersRow();

                        foreach (var (key, value) in _selectedElement.Properties.OrderBy(p => p.Key))
                        {
                            ImGui.TableNextRow();
                            ImGui.TableNextColumn();
                            ImGui.TextUnformatted(key);
                            ImGui.TableNextColumn();
                            ImGui.TextWrapped(value);
                        }

                        ImGui.EndTable();
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

        ImGui.SetNextWindowSize(new Vector2(320, 280), ImGuiCond.FirstUseEver);
        ImGui.SetNextWindowPos(new Vector2(15, ImGui.GetIO().DisplaySize.Y - 300), ImGuiCond.FirstUseEver);

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
}
