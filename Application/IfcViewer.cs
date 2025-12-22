using ImGuiNET;
using Silk.NET.Input;
using Silk.NET.OpenGL;
using Silk.NET.Windowing;
using System.Numerics;
using Vizzio.Interaction;
using Vizzio.Models;
using Vizzio.Rendering;
using Vizzio.Services;
using Vizzio.Tools;
using Vizzio.UI;
using Vizzio.VR;
using Vizzio.AI;

namespace Vizzio.Application;

/// <summary>
/// Main application controller for IFC viewer with VR/AR support
/// </summary>
public class IfcViewer : IDisposable
{
    private IWindow? _window;
    private GL? _gl;
    private IInputContext? _inputContext;

    private readonly Renderer3D _renderer;
    private readonly IfcParser _parser;
    private readonly VRManager _vrManager;
    private ImGuiController? _imguiController;
    private UIManager? _uiManager;
    private SelectionManager? _selectionManager;
    private MeasurementTool? _measurementTool;
    private MeasurementRenderer? _measurementRenderer;
    private AnnotationRenderer? _annotationRenderer;
    private ScreenshotCapture? _screenshotCapture;
    private SelectionHighlight? _selectionHighlight;
    private GridRenderer? _gridRenderer;
    private VRNavigation? _vrNavigation;
    private VRGestures? _vrGestures;
    private InteractionFeedback? _interactionFeedback;
    private TeleportRenderer? _teleportRenderer;
    private MinimapCompass? _minimapCompass;
    private TutorialSystem? _tutorialSystem;
    private ContextualHints? _contextualHints;

    private IfcModel? _currentModel;
    private bool _firstMouseMove = true;
    private Vector2 _lastMousePosition;
    private bool _isMouseCaptured = false;
    private bool _uiWantsMouse = false;
    private bool _isMiddleMousePressed = false;

    // Double click detection
    private DateTime _lastClickTime = DateTime.MinValue;
    private const double DoubleClickThreshold = 0.3; // seconds

    private float _deltaTime;
    private DateTime _lastFrameTime = DateTime.Now;

    // Statistics
    public int FrameCount { get; private set; }
    public float FPS { get; private set; }
    private DateTime _lastFpsUpdate = DateTime.Now;

    // Safe loading system
    private bool _isLoadingModel = false;
    private IfcModel? _pendingModel = null;
    private readonly object _loadLock = new object();
    public event Action<string>? OnStatusMessage;
    public event Action<IfcModel>? OnModelLoaded;

    public IfcViewer()
    {
        _renderer = new Renderer3D();
        _parser = new IfcParser();
        _vrManager = new VRManager();

        // Subscribe to parser events
        _parser.OnProgress += (msg) => OnStatusMessage?.Invoke(msg);
        _parser.OnError += (msg) => OnStatusMessage?.Invoke($"ERROR: {msg}");

        // Subscribe to VR events
        _vrManager.OnVRMessage += (msg) => OnStatusMessage?.Invoke(msg);
    }

    public void Run()
    {
        var options = WindowOptions.Default;
        options.Size = new Silk.NET.Maths.Vector2D<int>(1920, 1080);
        options.Title = "Vizzio - IFC Viewer with VR/AR Support";
        options.VSync = true;

        _window = Window.Create(options);

        _window.Load += OnLoad;
        _window.Update += OnUpdate;
        _window.Render += OnRender;
        _window.Resize += OnResize;
        _window.Closing += OnClosing;

        _window.Run();
    }

    private void OnLoad()
    {
        if (_window == null) return;

        _gl = _window.CreateOpenGL();
        _inputContext = _window.CreateInput();

        _renderer.Initialize(_gl, _window.Size.X, _window.Size.Y);
        _vrManager.Initialize();

        // Initialize all new tools
        _measurementTool = new MeasurementTool();
        _measurementRenderer = new MeasurementRenderer();
        _measurementRenderer.Initialize(_gl);

        _annotationRenderer = new AnnotationRenderer();
        _annotationRenderer.Initialize(_gl);

        _screenshotCapture = new ScreenshotCapture();
        _screenshotCapture.Initialize(_gl);

        _selectionHighlight = new SelectionHighlight();
        _selectionHighlight.Initialize(_gl);

        // Initialize grid renderer
        _gridRenderer = new GridRenderer();
        _gridRenderer.Initialize(_gl);
        _gridRenderer.ShowGrid = true;
        _gridRenderer.ShowAxes = true;

        // Initialize VR navigation
        _vrNavigation = new VRNavigation();
        _vrNavigation.OnNavigationMessage += (msg) => OnStatusMessage?.Invoke($"[VR] {msg}");

        _vrGestures = new VRGestures();
        _vrGestures.OnGestureMessage += (msg) => OnStatusMessage?.Invoke($"[Gesture] {msg}");
        _vrGestures.OnGestureDetected += HandleVRGesture;

        // Initialize interaction feedback
        _interactionFeedback = new InteractionFeedback();
        _interactionFeedback.Initialize(_gl);

        // Initialize teleport renderer
        _teleportRenderer = new TeleportRenderer();
        _teleportRenderer.Initialize(_gl);

        // Initialize minimap and compass
        _minimapCompass = new MinimapCompass();
        _minimapCompass.Initialize(_gl);
        _minimapCompass.OnCompassClicked += (bearing) =>
        {
            // Rotate camera to face the clicked direction
            _renderer.Camera.Yaw = -bearing; // Negative because yaw is CCW
            OnStatusMessage?.Invoke($"Camera oriented to {GetCardinalDirection(bearing)} ({bearing:F0}°)");
        };

        // Initialize tutorial system
        _tutorialSystem = new TutorialSystem();
        _tutorialSystem.OnStepChanged += (step) => OnStatusMessage?.Invoke($"📚 Tutorial: {step.Title}");
        _tutorialSystem.OnTutorialCompleted += () => OnStatusMessage?.Invoke("🎉 Tutorial completed!");
        _tutorialSystem.OnHint += (hint) => _contextualHints?.AddHint(hint);

        _contextualHints = new ContextualHints();

        // Set camera to orbit mode by default for more intuitive navigation
        _renderer.Camera.IsOrbitMode = true;

        // Initialize ImGui
        _imguiController = new ImGuiController(_gl, _window.Size.X, _window.Size.Y);
        _uiManager = new UIManager();
        _selectionManager = new SelectionManager();

        // Subscribe to UI events
        _uiManager.OnElementSelected += (element) =>
        {
            if (_selectionManager != null)
                _selectionManager.SelectedElement = element;
        };

        _uiManager.OnTypeVisibilityChanged += (type, visible) =>
        {
            if (_currentModel != null && _currentModel.ElementsByType.ContainsKey(type))
            {
                foreach (var element in _currentModel.ElementsByType[type])
                {
                    element.IsVisible = visible;
                }
            }
        };

        _uiManager.OnFocusRequested += FocusOnModel;
        _uiManager.OnResetCameraRequested += ResetCamera;

        _uiManager.OnOpenFileRequested += (filePath) =>
        {
            _ = LoadIfcFileAsync(filePath);
        };

        // NEW: Subscribe to measurement events
        _uiManager.OnMeasurementModeChanged += (mode) =>
        {
            if (_measurementTool != null)
            {
                _measurementTool.Mode = mode;
                _measurementTool.IsActive = true;
                OnStatusMessage?.Invoke($"Measurement mode: {mode}");
            }
        };

        _uiManager.OnClearMeasurements += () =>
        {
            _measurementTool?.ClearMeasurements();
            OnStatusMessage?.Invoke("Measurements cleared");
        };

        _uiManager.OnVRMessage += (message) =>
        {
            if (message == "TAKE_SCREENSHOT" && _screenshotCapture != null && _window != null)
            {
                _screenshotCapture.CaptureScreenshot(_window.Size.X, _window.Size.Y);
            }
            else
            {
                OnStatusMessage?.Invoke(message);
            }
        };

        // Subscribe to measurement tool events
        if (_measurementTool != null)
        {
            _measurementTool.OnMeasurementComplete += (result) =>
            {
                _uiManager?.AddMeasurementResult(result);
                _uiManager?.ShowNotification($"Measurement: {result}", UI.NotificationType.Success);
            };
        }

        // Subscribe to screenshot events
        if (_screenshotCapture != null)
        {
            _screenshotCapture.OnScreenshotSaved += (path) =>
            {
                _uiManager?.ShowNotification($"Screenshot saved: {Path.GetFileName(path)}", UI.NotificationType.Success);
            };

            _screenshotCapture.OnError += (error) =>
            {
                _uiManager?.ShowNotification($"Screenshot error: {error}", UI.NotificationType.Error);
            };
        }

        // Subscribe to selection events
        _selectionManager.OnSelectionChanged += (element) =>
        {
            if (_uiManager != null)
                _uiManager.SelectedElement = element;
        };

        // Setup input
        SetupInput();

        OnStatusMessage?.Invoke("🎮 Vizzio IFC Viewer - CS-Style Navigation Activated!");
        OnStatusMessage?.Invoke("WASD=Move • Shift=Sprint • Ctrl=Crouch • Double-click=Focus");

        // Show welcome notification
        _uiManager?.ShowNotification("Welcome to Vizzio! CS-style movement enabled 🔥", UI.NotificationType.Success);

        // Show tutorial on first launch
        _tutorialSystem?.ShowContextualHint("first_load");

        // Optionally start tutorial
        // _tutorialSystem?.Start();
    }

    private void SetupInput()
    {
        if (_inputContext == null) return;

        // Keyboard input
        foreach (var keyboard in _inputContext.Keyboards)
        {
            keyboard.KeyDown += OnKeyDown;
        }

        // Mouse input
        foreach (var mouse in _inputContext.Mice)
        {
            mouse.MouseMove += OnMouseMove;
            mouse.MouseDown += OnMouseDown;
            mouse.MouseUp += OnMouseUp;
            mouse.Scroll += OnMouseScroll;
        }

        // File drop support
        if (_window != null)
        {
            _window.FileDrop += OnFileDrop;
        }
    }

    private void OnUpdate(double deltaTime)
    {
        _deltaTime = (float)deltaTime;

        // Update FPS counter
        FrameCount++;
        if ((DateTime.Now - _lastFpsUpdate).TotalSeconds >= 1.0)
        {
            FPS = FrameCount / (float)(DateTime.Now - _lastFpsUpdate).TotalSeconds;
            FrameCount = 0;
            _lastFpsUpdate = DateTime.Now;
        }

        // Check for pending model to load (on main thread)
        lock (_loadLock)
        {
            if (_pendingModel != null && !_isLoadingModel)
            {
                _isLoadingModel = true;
                try
                {
                    _renderer.LoadModel(_pendingModel);
                    _currentModel = _pendingModel;

                    if (_uiManager != null)
                    {
                        _uiManager.SetModel(_pendingModel);
                    }

                    OnModelLoaded?.Invoke(_pendingModel);
                    OnStatusMessage?.Invoke($"✅ Model loaded successfully!");
                    OnStatusMessage?.Invoke($"📊 Elements: {_pendingModel.Elements.Count}, Types: {_pendingModel.GetElementTypes().Count}");
                    OnStatusMessage?.Invoke($"🔺 Vertices: {_pendingModel.GetTotalVertexCount():N0}, Triangles: {_pendingModel.GetTotalTriangleCount():N0}");

                    // Don't clear _pendingModel yet - let renderer handle it
                    // _isLoadingModel will be cleared by renderer when GPU upload completes
                    _uiManager?.ShowNotification($"Model loaded: {_pendingModel.Elements.Count} elements", UI.NotificationType.Success);

                    // Record tutorial action
                    _tutorialSystem?.RecordAction("model_loaded");

                    // Show contextual hint for large models
                    if (_pendingModel.Elements.Count > 1000)
                    {
                        _contextualHints?.AddHint("💡 Large model! Use element list to toggle types for better performance.");
                    }

                    // Don't focus yet - renderer will do it when upload completes
                    // FocusOnModel();
                }
                catch (Exception ex)
                {
                    OnStatusMessage?.Invoke($"❌ Error loading model geometry: {ex.Message}");
                    _isLoadingModel = false;
                    _pendingModel = null;
                    _uiManager?.ShowNotification($"Error loading geometry: {ex.Message}", UI.NotificationType.Error);
                }
                // Don't use finally - let renderer complete loading
            }
        }

        // Monitor renderer loading status
        if (_isLoadingModel && !_renderer.IsLoadingModel)
        {
            // Renderer finished loading!
            _isLoadingModel = false;
            _pendingModel = null;
            OnStatusMessage?.Invoke($"✅ GPU upload complete! {_renderer.LoadedGeometryCount} geometries");
        }

        // Update VR/AR
        _vrManager.Update(_deltaTime);

        // Update VR navigation if in VR mode
        if (_vrManager.IsVREnabled && _vrNavigation != null)
        {
            var newPos = _vrNavigation.Update(
                _renderer.Camera.Position,
                _renderer.Camera.Front,
                _renderer.Camera.Right,
                _deltaTime
            );
            _renderer.Camera.Position = newPos;

            // Update VR gestures
            _vrGestures?.Update(
                _vrManager.LeftControllerPosition,
                _vrManager.RightControllerPosition,
                false, // TODO: Get actual grip button state from OpenXR
                false
            );
        }

        // Update interaction feedback
        _interactionFeedback?.Update(_deltaTime);

        // Update minimap/compass
        if (_currentModel != null)
        {
            _minimapCompass?.Update(
                _renderer.Camera.Position,
                _renderer.Camera.Yaw,
                _currentModel.ModelCenter,
                _currentModel.ModelSize
            );
        }

        // Update contextual hints
        _contextualHints?.Update();

        // Update ImGui
        if (_imguiController != null && _window != null)
        {
            _imguiController.Update(_deltaTime, _window.Size.X, _window.Size.Y);
            _uiWantsMouse = ImGui.GetIO().WantCaptureMouse;
        }

        // Handle continuous keyboard input (only if UI doesn't want input)
        if (!_uiWantsMouse && !ImGui.GetIO().WantCaptureKeyboard)
        {
            HandleContinuousInput();
        }
    }

    private void HandleContinuousInput()
    {
        if (_inputContext == null || _inputContext.Keyboards.Count == 0) return;

        var keyboard = _inputContext.Keyboards[0];
        var camera = _renderer.Camera;

        // CS-style movement controls
        bool isMoving = false;

        // Sprint (Shift) and Crouch (Ctrl)
        camera.IsSprinting = keyboard.IsKeyPressed(Key.ShiftLeft) || keyboard.IsKeyPressed(Key.ShiftRight);
        camera.IsCrouching = keyboard.IsKeyPressed(Key.ControlLeft) || keyboard.IsKeyPressed(Key.ControlRight);

        // Determine speed multiplier (only when not sprinting/crouching)
        float speedMultiplier = 1.0f;
        if (!camera.IsSprinting && !camera.IsCrouching)
        {
            // Alt for even slower precision movement
            if (keyboard.IsKeyPressed(Key.AltLeft) || keyboard.IsKeyPressed(Key.AltRight))
                speedMultiplier = 0.5f;
        }

        // Camera movement (WASD)
        if (keyboard.IsKeyPressed(Key.W))
        {
            camera.ProcessKeyboard(CameraMovement.Forward, _deltaTime, speedMultiplier);
            isMoving = true;
        }
        if (keyboard.IsKeyPressed(Key.S))
        {
            camera.ProcessKeyboard(CameraMovement.Backward, _deltaTime, speedMultiplier);
            isMoving = true;
        }
        if (keyboard.IsKeyPressed(Key.A))
        {
            camera.ProcessKeyboard(CameraMovement.Left, _deltaTime, speedMultiplier);
            isMoving = true;
        }
        if (keyboard.IsKeyPressed(Key.D))
        {
            camera.ProcessKeyboard(CameraMovement.Right, _deltaTime, speedMultiplier);
            isMoving = true;
        }

        // Vertical movement (Space/E for up, C for down)
        if (keyboard.IsKeyPressed(Key.Space) || keyboard.IsKeyPressed(Key.E))
        {
            camera.ProcessKeyboard(CameraMovement.Up, _deltaTime, speedMultiplier);
            isMoving = true;
        }
        if (keyboard.IsKeyPressed(Key.C))
        {
            camera.ProcessKeyboard(CameraMovement.Down, _deltaTime, speedMultiplier);
            isMoving = true;
        }

        // Apply deceleration when no movement keys are pressed
        if (!isMoving)
        {
            camera.ApplyDeceleration(_deltaTime);
        }

        // Update smooth zoom
        camera.UpdateSmoothZoom(_deltaTime);

        // Speed control with +/- keys
        if (keyboard.IsKeyPressed(Key.Equal) || keyboard.IsKeyPressed(Key.KeypadAdd))
            camera.MovementSpeed += 10.0f * _deltaTime;
        if (keyboard.IsKeyPressed(Key.Minus) || keyboard.IsKeyPressed(Key.KeypadSubtract))
            camera.MovementSpeed = Math.Max(1.0f, camera.MovementSpeed - 10.0f * _deltaTime);
    }

    private void OnRender(double deltaTime)
    {
        _renderer.Render();

        // Render grid and axes
        if (_gridRenderer != null)
        {
            _gridRenderer.Render(_renderer.Camera);
        }

        // Render interaction feedback
        if (_interactionFeedback != null && _selectionManager != null)
        {
            // Set hover position
            if (_selectionManager.HoveredElement != null && _selectionManager.HoveredElement.Geometry != null)
            {
                _interactionFeedback.SetHoverPosition(_selectionManager.HoveredElement.Geometry.GetCenter());
            }
            else
            {
                _interactionFeedback.SetHoverPosition(null);
            }

            // Set selection position
            if (_selectionManager.SelectedElement != null && _selectionManager.SelectedElement.Geometry != null)
            {
                _interactionFeedback.SetSelectionPosition(_selectionManager.SelectedElement.Geometry.GetCenter());
            }
            else
            {
                _interactionFeedback.SetSelectionPosition(null);
            }

            _interactionFeedback.Render(_renderer.Camera);
        }

        // Render selection highlight
        if (_selectionManager?.SelectedElement != null && _selectionHighlight != null)
        {
            var element = _selectionManager.SelectedElement;
            if (element.Geometry != null)
            {
                _selectionHighlight.BeginSelection();
                _selectionHighlight.EndSelection();
            }
        }

        // Render measurements
        if (_measurementTool?.IsActive == true && _measurementRenderer != null)
        {
            var points = _measurementTool.MeasurementPoints.ToList();
            var lines = _measurementTool.GetMeasurementLines();

            if (points.Count > 0)
            {
                _measurementRenderer.RenderMeasurementPoints(
                    points,
                    _renderer.Camera,
                    new Vector3(1.0f, 0.0f, 0.0f) // Red
                );
            }

            if (lines.Any())
            {
                _measurementRenderer.RenderMeasurementLines(
                    lines,
                    _renderer.Camera,
                    new Vector3(1.0f, 1.0f, 0.0f) // Yellow
                );
            }
        }

        // Render annotations
        if (_annotationRenderer != null && _uiManager != null)
        {
            var annotations = _uiManager.AnnotationSystem.Annotations.ToList();
            if (annotations.Count > 0)
            {
                _annotationRenderer.RenderAnnotations(
                    annotations,
                    _renderer.Camera,
                    20.0f // Marker size
                );
            }
        }

        // Render minimap and compass
        _minimapCompass?.Render();

        // Render geographic overlay (must be after ImGui context is ready)
        _minimapCompass?.RenderGeographicOverlay();

        // Render UI
        if (_uiManager != null && _imguiController != null)
        {
            _uiManager.Render(_renderer.Camera, _vrManager, FPS);

            // Render tutorial overlay if active
            if (_tutorialSystem?.IsActive == true)
            {
                RenderTutorialOverlay();
            }

            // Render contextual hints
            if (_contextualHints?.HasHint == true)
            {
                RenderContextualHint();
            }

            _imguiController.Render();
        }
    }

    private void OnResize(Silk.NET.Maths.Vector2D<int> size)
    {
        _renderer.Resize(size.X, size.Y);
    }

    private void OnKeyDown(IKeyboard keyboard, Key key, int keyCode)
    {
        // Check if UI wants keyboard input
        if (ImGui.GetIO().WantCaptureKeyboard)
            return;

        // Check for Ctrl combinations
        bool ctrlPressed = keyboard.IsKeyPressed(Key.ControlLeft) || keyboard.IsKeyPressed(Key.ControlRight);

        // Ctrl+O - Open File
        if (ctrlPressed && key == Key.O)
        {
            OpenFile();
            return;
        }

        // Ctrl+Z - Undo
        if (ctrlPressed && key == Key.Z)
        {
            if (_uiManager?.UndoRedoManager.CanUndo == true)
            {
                _uiManager.UndoRedoManager.Undo();
                _uiManager.ShowNotification("Action undone", UI.NotificationType.Info);
            }
            return;
        }

        // Ctrl+Y - Redo
        if (ctrlPressed && key == Key.Y)
        {
            if (_uiManager?.UndoRedoManager.CanRedo == true)
            {
                _uiManager.UndoRedoManager.Redo();
                _uiManager.ShowNotification("Action redone", UI.NotificationType.Info);
            }
            return;
        }

        switch (key)
        {
            case Key.Escape:
                if (_isMouseCaptured)
                {
                    ReleaseMouse();
                }
                else
                {
                    _window?.Close();
                }
                break;

            case Key.F1:
                ShowHelp();
                break;

            case Key.F2:
                _vrManager.ToggleVRMode(_renderer.Camera);
                break;

            case Key.F3:
                _vrManager.ToggleARMode(_renderer.Camera);
                break;

            case Key.M:
                // Activate measurement mode
                if (_measurementTool != null)
                {
                    _measurementTool.Mode = MeasurementMode.Distance;
                    _measurementTool.IsActive = true;
                    _uiManager?.ShowNotification("Measurement mode: Distance", UI.NotificationType.Info);
                }
                break;

            case Key.F12:
                // Take screenshot
                if (_screenshotCapture != null && _window != null)
                {
                    _screenshotCapture.CaptureScreenshot(_window.Size.X, _window.Size.Y);
                }
                break;

            case Key.L:
                _renderer.EnableLighting = !_renderer.EnableLighting;
                OnStatusMessage?.Invoke($"Lighting: {(_renderer.EnableLighting ? "ON" : "OFF")}");
                break;

            case Key.F:
                FocusOnModel();
                break;

            case Key.R:
                ResetCamera();
                break;

            case Key.F11:
                ToggleFullscreen();
                break;

            case Key.Delete:
                if (_selectionManager != null)
                    _selectionManager.ClearSelection();
                break;

            case Key.G:
                // Toggle grid
                if (_gridRenderer != null)
                {
                    _gridRenderer.ShowGrid = !_gridRenderer.ShowGrid;
                    OnStatusMessage?.Invoke($"Grid: {(_gridRenderer.ShowGrid ? "ON" : "OFF")}");
                }
                break;

            case Key.H:
                // Toggle axes
                if (_gridRenderer != null)
                {
                    _gridRenderer.ShowAxes = !_gridRenderer.ShowAxes;
                    OnStatusMessage?.Invoke($"Axes: {(_gridRenderer.ShowAxes ? "ON" : "OFF")}");
                }
                break;

            case Key.O:
                // Toggle orbit/FPS mode
                _renderer.Camera.IsOrbitMode = !_renderer.Camera.IsOrbitMode;
                OnStatusMessage?.Invoke($"Camera mode: {(_renderer.Camera.IsOrbitMode ? "ORBIT" : "FPS")}");
                break;

            // Camera presets
            case Key.Keypad1:
                if (_currentModel != null)
                {
                    _renderer.Camera.SetCameraPreset(CameraPreset.Front, _currentModel.ModelCenter, _currentModel.ModelSize);
                    OnStatusMessage?.Invoke("Camera: Front view");
                }
                break;

            case Key.Keypad3:
                if (_currentModel != null)
                {
                    _renderer.Camera.SetCameraPreset(CameraPreset.Right, _currentModel.ModelCenter, _currentModel.ModelSize);
                    OnStatusMessage?.Invoke("Camera: Right view");
                }
                break;

            // Arrow keys for camera rotation
            case Key.Left:
                _renderer.Camera.Yaw -= 2.0f; // Rotate left
                break;

            case Key.Right:
                _renderer.Camera.Yaw += 2.0f; // Rotate right
                break;

            case Key.Up:
                _renderer.Camera.Pitch += 2.0f; // Look up
                break;

            case Key.Down:
                _renderer.Camera.Pitch -= 2.0f; // Look down
                break;

            case Key.Keypad7:
                if (_currentModel != null)
                {
                    _renderer.Camera.SetCameraPreset(CameraPreset.Top, _currentModel.ModelCenter, _currentModel.ModelSize);
                    OnStatusMessage?.Invoke("Camera: Top view");
                }
                break;

            case Key.Keypad0:
                if (_currentModel != null)
                {
                    _renderer.Camera.SetCameraPreset(CameraPreset.Isometric, _currentModel.ModelCenter, _currentModel.ModelSize);
                    OnStatusMessage?.Invoke("Camera: Isometric view");
                    _tutorialSystem?.RecordAction("preset_used");
                }
                break;

            case Key.PageUp:
                // Level camera (remove pitch) - useful when stuck upside down
                _renderer.Camera.LevelCamera();
                OnStatusMessage?.Invoke("Camera leveled (pitch reset)");
                break;

            case Key.Home:
                // Full orientation reset
                _renderer.Camera.ResetOrientation();
                OnStatusMessage?.Invoke("Camera orientation reset");
                break;

            case Key.End:
                // Correct upside down camera
                _renderer.Camera.CorrectUpsideDown();
                OnStatusMessage?.Invoke("Camera corrected");
                break;

            case Key.T:
                // Toggle tutorial
                if (_tutorialSystem != null)
                {
                    if (_tutorialSystem.IsActive)
                        _tutorialSystem.Stop();
                    else
                        _tutorialSystem.Start();
                }
                break;

            case Key.N:
                // Toggle minimap
                if (_minimapCompass != null)
                {
                    _minimapCompass.ShowMinimap = !_minimapCompass.ShowMinimap;
                    OnStatusMessage?.Invoke($"Minimap: {(_minimapCompass.ShowMinimap ? "ON" : "OFF")}");
                }
                break;

            case Key.B:
                // Toggle compass
                if (_minimapCompass != null)
                {
                    _minimapCompass.ShowCompass = !_minimapCompass.ShowCompass;
                    OnStatusMessage?.Invoke($"Compass: {(_minimapCompass.ShowCompass ? "ON" : "OFF")}");
                }
                break;
        }
    }

    private void OnMouseMove(IMouse mouse, Vector2 position)
    {
        // Update selection if not captured
        if (!_isMouseCaptured && !_uiWantsMouse && _selectionManager != null && _window != null)
        {
            var screenSize = new Vector2(_window.Size.X, _window.Size.Y);
            _selectionManager.UpdateSelection(position, screenSize, _renderer.Camera, _currentModel);

            // Show contextual hint on first hover
            if (_selectionManager.HoveredElement != null && !_tutorialSystem!.HasCompletedAction("first_hover"))
            {
                _tutorialSystem?.ShowContextualHint("first_hover");
                _tutorialSystem?.RecordAction("first_hover");
            }
        }

        if (!_isMouseCaptured && !_isMiddleMousePressed)
            return;

        if (_firstMouseMove)
        {
            _lastMousePosition = position;
            _firstMouseMove = false;
            return;
        }

        var xOffset = position.X - _lastMousePosition.X;
        var yOffset = _lastMousePosition.Y - position.Y;

        _lastMousePosition = position;

        // Middle mouse for panning
        if (_isMiddleMousePressed)
        {
            _renderer.Camera.ProcessMousePan(xOffset, yOffset);
            _tutorialSystem?.RecordAction("camera_panned");
        }
        // Right mouse for rotation
        else
        {
            _renderer.Camera.ProcessMouseMovement(xOffset, yOffset);
            _tutorialSystem?.RecordAction("camera_rotated");
        }
    }

    private void OnMouseDown(IMouse mouse, MouseButton button)
    {
        if (_uiWantsMouse)
            return;

        if (button == MouseButton.Left)
        {
            // Detect double click
            var now = DateTime.Now;
            var timeSinceLastClick = (now - _lastClickTime).TotalSeconds;
            bool isDoubleClick = timeSinceLastClick < DoubleClickThreshold;
            _lastClickTime = now;

            // Double click to focus on element
            if (isDoubleClick && _selectionManager?.HoveredElement != null)
            {
                var element = _selectionManager.HoveredElement;
                if (element.Geometry != null)
                {
                    var center = element.Geometry.GetCenter();
                    var size = element.Geometry.GetSize();
                    var distance = Math.Max(size * 2.0f, 5.0f);

                    _renderer.Camera.FocusOnPoint(center, distance);
                    _uiManager?.ShowNotification($"Focused on {element.Type}", UI.NotificationType.Info);
                    _tutorialSystem?.RecordAction("element_focused");
                }
                return;
            }

            // Check if measurement tool is active
            if (_measurementTool?.IsActive == true && _selectionManager?.HoveredElement != null)
            {
                var element = _selectionManager.HoveredElement;
                if (element.Geometry != null)
                {
                    var position = element.Geometry.GetCenter();
                    _measurementTool.AddPoint(position);
                    OnStatusMessage?.Invoke($"Point added for measurement");
                    _tutorialSystem?.RecordAction("measurement_made");
                }
            }
            // Otherwise, select element
            else if (_selectionManager != null)
            {
                _selectionManager.SelectHoveredElement();
                if (_selectionManager.SelectedElement != null)
                {
                    _tutorialSystem?.RecordAction("element_selected");
                }
            }
        }
        else if (button == MouseButton.Right)
        {
            if (!_isMouseCaptured)
            {
                CaptureMouse();
            }
            else
            {
                ReleaseMouse();
            }
        }
        else if (button == MouseButton.Middle)
        {
            _isMiddleMousePressed = true;
            _firstMouseMove = true;
        }
    }

    private void OnMouseUp(IMouse mouse, MouseButton button)
    {
        if (button == MouseButton.Middle)
        {
            _isMiddleMousePressed = false;
        }
    }

    private void OnMouseScroll(IMouse mouse, ScrollWheel scrollWheel)
    {
        if (_uiWantsMouse)
            return;

        _renderer.Camera.ProcessMouseScroll(scrollWheel.Y);
        _tutorialSystem?.RecordAction("camera_zoomed");
    }

    private void CaptureMouse()
    {
        if (_inputContext?.Mice.Count > 0)
        {
            _inputContext.Mice[0].Cursor.CursorMode = CursorMode.Raw;
            _isMouseCaptured = true;
            _firstMouseMove = true;
            OnStatusMessage?.Invoke("Mouse captured. Right-click again or press ESC to release.");
        }
    }

    private void ReleaseMouse()
    {
        if (_inputContext?.Mice.Count > 0)
        {
            _inputContext.Mice[0].Cursor.CursorMode = CursorMode.Normal;
            _isMouseCaptured = false;
            OnStatusMessage?.Invoke("Mouse released.");
        }
    }

    private void OnFileDrop(string[] files)
    {
        if (files.Length > 0)
        {
            var filePath = files[0];
            if (Path.GetExtension(filePath).ToLower() == ".ifc")
            {
                _ = LoadIfcFileAsync(filePath);
            }
            else
            {
                OnStatusMessage?.Invoke("Please drop an IFC file (.ifc)");
            }
        }
    }

    public async Task LoadIfcFileAsync(string filePath)
    {
        // Check if already loading
        lock (_loadLock)
        {
            if (_isLoadingModel)
            {
                OnStatusMessage?.Invoke("⚠️ Already loading a model. Please wait...");
                _uiManager?.ShowNotification("Already loading a model", UI.NotificationType.Warning);
                return;
            }
            _isLoadingModel = true;
        }

        try
        {
            OnStatusMessage?.Invoke($"📂 Loading IFC file: {Path.GetFileName(filePath)}");
            _uiManager?.ShowNotification($"Loading {Path.GetFileName(filePath)}...", UI.NotificationType.Info);

            // Parse file in background thread (safe)
            var model = await _parser.ParseFileAsync(filePath);

            if (model != null && model.Elements.Count > 0)
            {
                // Queue model for loading on main thread
                lock (_loadLock)
                {
                    _pendingModel = model;
                    // _isLoadingModel will be reset in OnUpdate after loading
                }
            }
            else
            {
                OnStatusMessage?.Invoke("❌ Failed to load model or model is empty.");
                _uiManager?.ShowNotification("Failed to load model", UI.NotificationType.Error);

                lock (_loadLock)
                {
                    _isLoadingModel = false;
                }
            }
        }
        catch (Exception ex)
        {
            OnStatusMessage?.Invoke($"❌ Error loading IFC file: {ex.Message}");
            _uiManager?.ShowNotification($"Error: {ex.Message}", UI.NotificationType.Error);

            lock (_loadLock)
            {
                _isLoadingModel = false;
            }
        }
    }

    private void FocusOnModel()
    {
        if (_currentModel != null)
        {
            _renderer.Camera.FocusOn(_currentModel.ModelCenter, _currentModel.ModelSize * 1.5f);
            OnStatusMessage?.Invoke("Camera focused on model.");
        }
    }

    private void ResetCamera()
    {
        if (_currentModel != null)
        {
            // Reset to view the model
            _renderer.Camera.Position = _currentModel.ModelCenter + new Vector3(0, _currentModel.ModelSize * 0.5f, _currentModel.ModelSize * 1.5f);
            _renderer.Camera.TargetPoint = _currentModel.ModelCenter;
        }
        else
        {
            _renderer.Camera.Position = new Vector3(0, 5, 10);
            _renderer.Camera.TargetPoint = Vector3.Zero;
        }

        _renderer.Camera.ResetOrientation();
        _renderer.Camera.Fov = 45.0f;
        OnStatusMessage?.Invoke("Camera reset.");
    }

    private void ToggleFullscreen()
    {
        if (_window != null)
        {
            if (_window.WindowState == WindowState.Fullscreen)
            {
                _window.WindowState = WindowState.Normal;
                OnStatusMessage?.Invoke("Fullscreen: OFF");
            }
            else
            {
                _window.WindowState = WindowState.Fullscreen;
                OnStatusMessage?.Invoke("Fullscreen: ON");
            }
        }
    }

    private void ShowHelp()
    {
        OnStatusMessage?.Invoke("=== VIZZIO IFC VIEWER - CONTROLS ===");
        OnStatusMessage?.Invoke("NAVIGATION:");
        OnStatusMessage?.Invoke("  WASD: Move camera | Space/Shift: Up/Down");
        OnStatusMessage?.Invoke("  Right-Click + Drag: Rotate view (Orbit mode)");
        OnStatusMessage?.Invoke("  Middle-Click + Drag: Pan view");
        OnStatusMessage?.Invoke("  Mouse Scroll: Zoom in/out");
        OnStatusMessage?.Invoke("  +/-: Increase/Decrease movement speed");
        OnStatusMessage?.Invoke("CAMERA PRESETS:");
        OnStatusMessage?.Invoke("  Numpad 1: Front | Numpad 3: Right | Numpad 7: Top");
        OnStatusMessage?.Invoke("  Numpad 0: Isometric view");
        OnStatusMessage?.Invoke("ACTIONS:");
        OnStatusMessage?.Invoke("  Left-Click: Select element");
        OnStatusMessage?.Invoke("  F: Focus on model | R: Reset camera");
        OnStatusMessage?.Invoke("  G: Toggle grid | H: Toggle axes");
        OnStatusMessage?.Invoke("  N: Toggle minimap | B: Toggle compass");
        OnStatusMessage?.Invoke("  O: Toggle orbit/FPS mode");
        OnStatusMessage?.Invoke("  L: Toggle lighting | Delete: Clear selection");
        OnStatusMessage?.Invoke("  T: Toggle tutorial");
        OnStatusMessage?.Invoke("VR/AR:");
        OnStatusMessage?.Invoke("  F2: Toggle VR mode | F3: Toggle AR mode");
        OnStatusMessage?.Invoke("OTHER:");
        OnStatusMessage?.Invoke("  F11: Toggle fullscreen | ESC: Exit");
        OnStatusMessage?.Invoke("  Ctrl+O: Open IFC file");
        OnStatusMessage?.Invoke("  Drag & Drop: Load IFC file");
    }

    private void HandleVRGesture(GestureType gesture)
    {
        switch (gesture)
        {
            case GestureType.SwipeLeft:
                // Previous camera preset
                OnStatusMessage?.Invoke("Gesture: Previous view");
                break;
            case GestureType.SwipeRight:
                // Next camera preset
                OnStatusMessage?.Invoke("Gesture: Next view");
                break;
            case GestureType.SwipeUp:
                // Show menu
                OnStatusMessage?.Invoke("Gesture: Show menu");
                break;
            case GestureType.TwoHandGrab:
                // Scale model
                OnStatusMessage?.Invoke("Gesture: Scale model");
                break;
        }
    }

    private void RenderTutorialOverlay()
    {
        var step = _tutorialSystem?.CurrentStep;
        if (step == null) return;

        ImGui.SetNextWindowPos(new Vector2(ImGui.GetIO().DisplaySize.X / 2 - 250, 50));
        ImGui.SetNextWindowSize(new Vector2(500, 200));

        if (ImGui.Begin("Tutorial", ImGuiWindowFlags.NoCollapse | ImGuiWindowFlags.NoResize))
        {
            ImGui.TextColored(new Vector4(1, 0.8f, 0, 1), $"{step.Icon} {step.Title}");
            ImGui.Separator();

            ImGui.TextWrapped(step.Description);
            ImGui.Spacing();

            ImGui.TextColored(new Vector4(0.5f, 0.8f, 1, 1), $"💡 {step.Hint}");
            ImGui.Spacing();

            var progress = _tutorialSystem!.GetProgress();
            ImGui.ProgressBar((float)progress.CurrentStep / progress.TotalSteps,
                            new Vector2(-1, 0),
                            $"Step {progress.CurrentStep} / {progress.TotalSteps}");

            ImGui.Spacing();

            if (ImGui.Button("Previous"))
                _tutorialSystem.PreviousStep();

            ImGui.SameLine();
            if (ImGui.Button("Skip"))
                _tutorialSystem.SkipStep();

            ImGui.SameLine();
            if (ImGui.Button("Next"))
                _tutorialSystem.NextStep();

            ImGui.SameLine();
            if (ImGui.Button("Close Tutorial"))
                _tutorialSystem.Stop();
        }
        ImGui.End();
    }

    private void RenderContextualHint()
    {
        var hint = _contextualHints?.CurrentHint;
        if (string.IsNullOrEmpty(hint)) return;

        ImGui.SetNextWindowPos(new Vector2(ImGui.GetIO().DisplaySize.X / 2 - 200,
                                          ImGui.GetIO().DisplaySize.Y - 100));
        ImGui.SetNextWindowSize(new Vector2(400, 60));

        ImGui.PushStyleColor(ImGuiCol.WindowBg, new Vector4(0.1f, 0.1f, 0.15f, 0.95f));

        if (ImGui.Begin("Hint", ImGuiWindowFlags.NoTitleBar | ImGuiWindowFlags.NoResize | ImGuiWindowFlags.NoMove))
        {
            ImGui.TextWrapped(hint);
        }
        ImGui.End();

        ImGui.PopStyleColor();
    }

    private void OnClosing()
    {
        Dispose();
    }

    private string GetCardinalDirection(float bearing)
    {
        var directions = new[] { "North", "North-Northeast", "Northeast", "East-Northeast",
                                "East", "East-Southeast", "Southeast", "South-Southeast",
                                "South", "South-Southwest", "Southwest", "West-Southwest",
                                "West", "West-Northwest", "Northwest", "North-Northwest" };
        int index = (int)Math.Round(bearing / 22.5f) % 16;
        return directions[index];
    }

    public void Dispose()
    {
        _interactionFeedback?.Dispose();
        _teleportRenderer?.Dispose();
        _minimapCompass?.Dispose();
        _gridRenderer?.Dispose();
        _selectionHighlight?.Dispose();
        _measurementRenderer?.Dispose();
        _annotationRenderer?.Dispose();
        _imguiController?.Dispose();
        _renderer?.Dispose();
        _inputContext?.Dispose();
        _gl?.Dispose();
    }

    /// <summary>
    /// Set AI assistant for the UI
    /// </summary>
    public void SetAIAssistant(IfcAIAssistant assistant)
    {
        _uiManager?.SetAIAssistant(assistant);
    }

    private void OpenFile()
    {
        OnStatusMessage?.Invoke("Opening file dialog...");

        var filePath = UI.FileDialog.OpenFile("Open IFC File");

        if (!string.IsNullOrEmpty(filePath))
        {
            OnStatusMessage?.Invoke($"Selected file: {Path.GetFileName(filePath)}");
            _ = LoadIfcFileAsync(filePath);
        }
        else
        {
            OnStatusMessage?.Invoke("File selection cancelled.");
        }
    }
}
