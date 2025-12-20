using System.Numerics;
using ImGuiNET;
using Vizzio.Models;
using Vizzio.Rendering;
using Vizzio.VR;
using Vizzio.Tools;

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
    private bool _showMeasurements = false; // NEW
    private Dictionary<string, bool> _typeVisibility = new();
    private List<MeasurementResult> _measurementHistory = new();
    private Toolbar _toolbar = new();
    private bool _showAnnotations = false; // NEW
    private bool _showLayers = false; // NEW
    private AnnotationSystem _annotationSystem = new(); // NEW
    private LayerManager _layerManager = new(); // NEW
    private UndoRedoManager _undoRedoManager = new(); // NEW
    private bool _showHistory = false; // NEW
    
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
    public event Action<string>? OnOpenFileRequested;
    public event Action<MeasurementMode>? OnMeasurementModeChanged; // NEW
    public event Action? OnClearMeasurements; // NEW
    public event Action<string>? OnVRMessage; // NEW - for export messages
    public event Action<Vector3, string, AnnotationType>? OnAnnotationAdded; // NEW
    public event Action<string, bool>? OnLayerVisibilityChanged; // NEW

    public AnnotationSystem AnnotationSystem => _annotationSystem; // NEW
    public LayerManager LayerManager => _layerManager; // NEW
    public UndoRedoManager UndoRedoManager => _undoRedoManager; // NEW

    public void SetModel(IfcModel model)
    {
        _currentModel = model;
        _typeVisibility.Clear();
        
        foreach (var type in model.GetElementTypes())
        {
            _typeVisibility[type] = true;
        }
        
        // Setup toolbar events
        SetupToolbarEvents();
        
        // Organize layers
        _layerManager.OrganizeByStorey(model);
    }

    private void SetupToolbarEvents()
    {
        _toolbar.OnOpenFile += () => OnOpenFileRequested?.Invoke("");
        _toolbar.OnSaveScreenshot += () => { /* Will implement */ };
        _toolbar.OnMeasureDistance += () =>
        {
            OnMeasurementModeChanged?.Invoke(MeasurementMode.Distance);
            _showMeasurements = true;
        };
        _toolbar.OnMeasureArea += () =>
        {
            OnMeasurementModeChanged?.Invoke(MeasurementMode.Area);
            _showMeasurements = true;
        };
        _toolbar.OnMeasureAngle += () =>
        {
            OnMeasurementModeChanged?.Invoke(MeasurementMode.Angle);
            _showMeasurements = true;
        };
        _toolbar.OnFocusModel += () => OnFocusRequested?.Invoke();
        _toolbar.OnResetCamera += () => OnResetCameraRequested?.Invoke();
        _toolbar.OnToggleLighting += () => { /* Camera lighting toggle */ };
        _toolbar.OnToggleVR += () => { /* VR toggle */ };
        _toolbar.OnSelectMode += () => { /* Select mode */ };
        _toolbar.OnPanMode += () => { /* Pan mode */ };
        _toolbar.OnOrbitMode += () => { /* Orbit mode */ };
    }

    public void Render(Camera camera, VRManager vrManager, float fps)
    {
        RenderMainMenuBar(camera, vrManager, fps);
        
        // Render toolbar
        _toolbar.Render((int)ImGui.GetIO().DisplaySize.X, (int)ImGui.GetIO().DisplaySize.Y);
        
        if (_showElementList)
            RenderElementList();
        
        if (_showProperties && _selectedElement != null)
            RenderPropertiesPanel();
        
        if (_showStatistics && _currentModel != null)
            RenderStatisticsPanel();
        
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
    }

    public void AddMeasurementResult(MeasurementResult result)
    {
        _measurementHistory.Add(result);
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
                bool toolbarVisible = _toolbar.IsVisible;
                if (ImGui.MenuItem("Toolbar", "F6", ref toolbarVisible))
                {
                    _toolbar.IsVisible = toolbarVisible;
                }
                
                ImGui.Separator();
                
                ImGui.MenuItem("Element List", "F2", ref _showElementList);
                ImGui.MenuItem("Properties", "F3", ref _showProperties);
                ImGui.MenuItem("Statistics", "F4", ref _showStatistics);
                ImGui.MenuItem("Measurements", "F5", ref _showMeasurements);
                ImGui.MenuItem("Annotations", "F7", ref _showAnnotations); // NEW
                ImGui.MenuItem("Layers", "F8", ref _showLayers); // NEW
                
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

            if (ImGui.BeginMenu("Tools")) // NEW
            {
                if (ImGui.MenuItem("Measure Distance", "M"))
                {
                    OnMeasurementModeChanged?.Invoke(MeasurementMode.Distance);
                    _showMeasurements = true;
                }
                
                if (ImGui.MenuItem("Measure Area", ""))
                {
                    OnMeasurementModeChanged?.Invoke(MeasurementMode.Area);
                    _showMeasurements = true;
                }
                
                if (ImGui.MenuItem("Measure Angle", ""))
                {
                    OnMeasurementModeChanged?.Invoke(MeasurementMode.Angle);
                    _showMeasurements = true;
                }
                
                ImGui.Separator();
                
                if (ImGui.MenuItem("Clear Measurements"))
                {
                    OnClearMeasurements?.Invoke();
                    _measurementHistory.Clear();
                }
                
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

            if (ImGui.BeginMenu("Edit")) // NEW
            {
                bool canUndo = _undoRedoManager.CanUndo;
                bool canRedo = _undoRedoManager.CanRedo;
                
                if (ImGui.MenuItem("Undo", "Ctrl+Z", false, canUndo))
                {
                    _undoRedoManager.Undo();
                }
                
                if (ImGui.MenuItem("Redo", "Ctrl+Y", false, canRedo))
                {
                    _undoRedoManager.Redo();
                }
                
                ImGui.Separator();
                
                ImGui.MenuItem("History", "F9", ref _showHistory);
                
                ImGui.Separator();
                
                if (ImGui.MenuItem("Clear History"))
                {
                    _undoRedoManager.Clear();
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
                var action = new ChangeColorAction(_selectedElement, color);
                _undoRedoManager.ExecuteAction(action);
            }

            // Visibility toggle
            bool isVisible = _selectedElement.IsVisible;
            if (ImGui.Checkbox("Visible", ref isVisible))
            {
                var action = new ChangeVisibilityAction(_selectedElement, isVisible);
                _undoRedoManager.ExecuteAction(action);
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

    private void RenderMeasurementsPanel()
    {
        ImGui.SetNextWindowPos(new Vector2(780, 30), ImGuiCond.FirstUseEver);
        ImGui.SetNextWindowSize(new Vector2(400, 300), ImGuiCond.FirstUseEver);

        if (ImGui.Begin("Measurements", ref _showMeasurements))
        {
            ImGui.Text("Measurement Tools");
            ImGui.Separator();

            // Mode selection
            if (ImGui.Button("Distance (M)"))
            {
                OnMeasurementModeChanged?.Invoke(MeasurementMode.Distance);
            }
            ImGui.SameLine();
            if (ImGui.Button("Area"))
            {
                OnMeasurementModeChanged?.Invoke(MeasurementMode.Area);
            }
            ImGui.SameLine();
            if (ImGui.Button("Angle"))
            {
                OnMeasurementModeChanged?.Invoke(MeasurementMode.Angle);
            }

            ImGui.Separator();

            // Instructions
            ImGui.TextWrapped("Click on elements to add measurement points. Press Enter to complete area measurements.");
            
            ImGui.Separator();

            // Measurement history
            ImGui.Text($"History ({_measurementHistory.Count}):");
            
            if (ImGui.BeginChild("MeasurementHistory"))
            {
                for (int i = _measurementHistory.Count - 1; i >= 0; i--)
                {
                    var result = _measurementHistory[i];
                    
                    if (ImGui.Selectable($"#{i + 1}: {result}"))
                    {
                        // Could highlight this measurement
                    }
                    
                    if (ImGui.IsItemHovered())
                    {
                        ImGui.BeginTooltip();
                        ImGui.Text($"Time: {result.Timestamp:HH:mm:ss}");
                        ImGui.Text($"Points: {result.Points.Count}");
                        ImGui.EndTooltip();
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
            
            ImGui.SameLine();
            
            if (ImGui.Button("Export..."))
            {
                ExportMeasurements();
            }
        }
        
        ImGui.End();
    }

    private void ExportMeasurements()
    {
        try
        {
            var filePath = $"measurements_{DateTime.Now:yyyyMMdd_HHmmss}.txt";
            using var writer = new System.IO.StreamWriter(filePath);
            
            writer.WriteLine("=== VIZZIO MEASUREMENTS ===");
            writer.WriteLine($"Date: {DateTime.Now}");
            writer.WriteLine($"Total: {_measurementHistory.Count}");
            writer.WriteLine();
            
            foreach (var result in _measurementHistory)
            {
                writer.WriteLine(result.ToString());
                writer.WriteLine($"  Time: {result.Timestamp:HH:mm:ss}");
                writer.WriteLine($"  Points: {result.Points.Count}");
                writer.WriteLine();
            }
            
            OnVRMessage?.Invoke($"Measurements exported to: {filePath}");
        }
        catch (Exception ex)
        {
            OnVRMessage?.Invoke($"Failed to export measurements: {ex.Message}");
        }
    }
    
    private void RenderAnnotationsPanel()
    {
        ImGui.SetNextWindowPos(new Vector2(10, 750), ImGuiCond.FirstUseEver);
        ImGui.SetNextWindowSize(new Vector2(350, 300), ImGuiCond.FirstUseEver);

        if (ImGui.Begin("Annotations", ref _showAnnotations))
        {
            ImGui.Text("3D Annotations");
            ImGui.Separator();

            // Add annotation buttons
            if (ImGui.Button("📝 Note"))
            {
                // Will trigger annotation mode
            }
            ImGui.SameLine();
            if (ImGui.Button("⚠️ Warning"))
            {
                // Will trigger warning annotation
            }
            ImGui.SameLine();
            if (ImGui.Button("❌ Error"))
            {
                // Will trigger error annotation
            }
            ImGui.SameLine();
            if (ImGui.Button("ℹ️ Info"))
            {
                // Will trigger info annotation
            }

            ImGui.Separator();

            // Annotation list
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
                        AnnotationType.Question => "❓",
                        _ => "•"
                    };

                    if (ImGui.Selectable($"{icon} [{annotation.Id}] {annotation.Text}"))
                    {
                        // Could focus on annotation
                    }

                    if (ImGui.IsItemHovered())
                    {
                        ImGui.BeginTooltip();
                        ImGui.Text($"Position: {annotation.Position}");
                        ImGui.Text($"Author: {annotation.Author}");
                        ImGui.Text($"Created: {annotation.CreatedAt:HH:mm:ss}");
                        ImGui.EndTooltip();
                    }
                }
                
                ImGui.EndChild();
            }

            ImGui.Separator();

            if (ImGui.Button("Clear All"))
            {
                _annotationSystem.ClearAll();
            }
            ImGui.SameLine();
            if (ImGui.Button("Export..."))
            {
                try
                {
                    var path = $"annotations_{DateTime.Now:yyyyMMdd_HHmmss}.txt";
                    _annotationSystem.ExportToFile(path);
                    OnVRMessage?.Invoke($"Annotations exported to: {path}");
                }
                catch (Exception ex)
                {
                    OnVRMessage?.Invoke($"Export failed: {ex.Message}");
                }
            }
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

            // Organization buttons
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
            
            ImGui.SameLine();
            if (ImGui.Button("Show All"))
            {
                _layerManager.ShowAll();
            }
            ImGui.SameLine();
            if (ImGui.Button("Hide All"))
            {
                _layerManager.HideAll();
            }

            ImGui.Separator();

            // Layer list
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

                    // Context menu
                    if (ImGui.BeginPopupContextItem($"layer_context_{layerName}"))
                    {
                        if (ImGui.MenuItem("Isolate"))
                        {
                            _layerManager.IsolateLayer(layerName);
                        }
                        
                        if (ImGui.MenuItem("Hide"))
                        {
                            _layerManager.SetLayerVisibility(layerName, false);
                        }
                        
                        if (ImGui.MenuItem("Show"))
                        {
                            _layerManager.SetLayerVisibility(layerName, true);
                        }
                        
                        ImGui.EndPopup();
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

            // Controls
            bool canUndo = _undoRedoManager.CanUndo;
            bool canRedo = _undoRedoManager.CanRedo;

            if (ImGui.Button("↶ Undo (Ctrl+Z)") && canUndo)
            {
                _undoRedoManager.Undo();
            }
            ImGui.SameLine();
            if (ImGui.Button("↷ Redo (Ctrl+Y)") && canRedo)
            {
                _undoRedoManager.Redo();
            }
            ImGui.SameLine();
            if (ImGui.Button("Clear All"))
            {
                _undoRedoManager.Clear();
            }

            ImGui.Separator();

            // Statistics
            ImGui.Text($"Undo Stack: {_undoRedoManager.UndoCount}");
            ImGui.SameLine();
            ImGui.Text($"| Redo Stack: {_undoRedoManager.RedoCount}");

            ImGui.Separator();

            // History lists
            if (ImGui.BeginTabBar("HistoryTabs"))
            {
                if (ImGui.BeginTabItem("Undo History"))
                {
                    if (ImGui.BeginChild("UndoList"))
                    {
                        var undoHistory = _undoRedoManager.GetUndoHistory();
                        
                        for (int i = undoHistory.Count - 1; i >= 0; i--)
                        {
                            ImGui.Bullet();
                            ImGui.Text(undoHistory[i]);
                        }
                        
                        if (undoHistory.Count == 0)
                        {
                            ImGui.TextDisabled("No actions to undo");
                        }
                        
                        ImGui.EndChild();
                    }
                    ImGui.EndTabItem();
                }

                if (ImGui.BeginTabItem("Redo History"))
                {
                    if (ImGui.BeginChild("RedoList"))
                    {
                        var redoHistory = _undoRedoManager.GetRedoHistory();
                        
                        for (int i = redoHistory.Count - 1; i >= 0; i--)
                        {
                            ImGui.Bullet();
                            ImGui.Text(redoHistory[i]);
                        }
                        
                        if (redoHistory.Count == 0)
                        {
                            ImGui.TextDisabled("No actions to redo");
                        }
                        
                        ImGui.EndChild();
                    }
                    ImGui.EndTabItem();
                }

                ImGui.EndTabBar();
            }

            ImGui.Separator();
            
            ImGui.TextWrapped("Tip: Use Ctrl+Z to undo and Ctrl+Y to redo actions. The history shows all reversible changes.");
        }
        
        ImGui.End();
    }
}
