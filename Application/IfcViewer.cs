using System.Numerics;
using Silk.NET.Input;
using Silk.NET.OpenGL;
using Silk.NET.Windowing;
using Vizzio.Models;
using Vizzio.Rendering;
using Vizzio.Services;
using Vizzio.VR;
using Vizzio.UI;
using Vizzio.Interaction;
using ImGuiNET;

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
    
    private IfcModel? _currentModel;
    private bool _firstMouseMove = true;
    private Vector2 _lastMousePosition;
    private bool _isMouseCaptured = false;
    private bool _uiWantsMouse = false;
    
    private float _deltaTime;
    private DateTime _lastFrameTime = DateTime.Now;

    // Statistics
    public int FrameCount { get; private set; }
    public float FPS { get; private set; }
    private DateTime _lastFpsUpdate = DateTime.Now;

    // Events
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

        // Subscribe to selection events
        _selectionManager.OnSelectionChanged += (element) =>
        {
            if (_uiManager != null)
                _uiManager.SelectedElement = element;
        };

        // Setup input
        SetupInput();

        OnStatusMessage?.Invoke("Vizzio IFC Viewer initialized. Press F1 for help.");
        OnStatusMessage?.Invoke("Drag and drop an IFC file to load it.");
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

        // Update VR/AR
        _vrManager.Update(_deltaTime);

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

        // Camera movement
        if (keyboard.IsKeyPressed(Key.W))
            camera.ProcessKeyboard(CameraMovement.Forward, _deltaTime);
        if (keyboard.IsKeyPressed(Key.S))
            camera.ProcessKeyboard(CameraMovement.Backward, _deltaTime);
        if (keyboard.IsKeyPressed(Key.A))
            camera.ProcessKeyboard(CameraMovement.Left, _deltaTime);
        if (keyboard.IsKeyPressed(Key.D))
            camera.ProcessKeyboard(CameraMovement.Right, _deltaTime);
        if (keyboard.IsKeyPressed(Key.Space))
            camera.ProcessKeyboard(CameraMovement.Up, _deltaTime);
        if (keyboard.IsKeyPressed(Key.ShiftLeft))
            camera.ProcessKeyboard(CameraMovement.Down, _deltaTime);

        // Speed control
        if (keyboard.IsKeyPressed(Key.Equal) || keyboard.IsKeyPressed(Key.KeypadAdd))
            camera.MovementSpeed += 10.0f * _deltaTime;
        if (keyboard.IsKeyPressed(Key.Minus) || keyboard.IsKeyPressed(Key.KeypadSubtract))
            camera.MovementSpeed = Math.Max(1.0f, camera.MovementSpeed - 10.0f * _deltaTime);
    }

    private void OnRender(double deltaTime)
    {
        _renderer.Render();
        
        // Render UI
        if (_uiManager != null && _imguiController != null)
        {
            _uiManager.Render(_renderer.Camera, _vrManager, FPS);
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
        }
    }

    private void OnMouseMove(IMouse mouse, Vector2 position)
    {
        // Update selection if not captured
        if (!_isMouseCaptured && !_uiWantsMouse && _selectionManager != null && _window != null)
        {
            var screenSize = new Vector2(_window.Size.X, _window.Size.Y);
            _selectionManager.UpdateSelection(position, screenSize, _renderer.Camera, _currentModel);
        }

        if (!_isMouseCaptured)
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

        _renderer.Camera.ProcessMouseMovement(xOffset, yOffset);
    }

    private void OnMouseDown(IMouse mouse, MouseButton button)
    {
        if (_uiWantsMouse)
            return;

        if (button == MouseButton.Left)
        {
            // Select element
            if (_selectionManager != null)
            {
                _selectionManager.SelectHoveredElement();
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
    }

    private void OnMouseScroll(IMouse mouse, ScrollWheel scrollWheel)
    {
        if (_uiWantsMouse)
            return;

        _renderer.Camera.ProcessMouseScroll(scrollWheel.Y);
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
        OnStatusMessage?.Invoke($"Loading IFC file: {Path.GetFileName(filePath)}");

        var model = await _parser.ParseFileAsync(filePath);

        if (model != null && model.Elements.Count > 0)
        {
            _currentModel = model;
            _renderer.LoadModel(model);
            
            if (_uiManager != null)
            {
                _uiManager.SetModel(model);
            }
            
            OnModelLoaded?.Invoke(model);
            OnStatusMessage?.Invoke($"Model loaded successfully!");
            OnStatusMessage?.Invoke($"Elements: {model.Elements.Count}, Types: {model.GetElementTypes().Count}");
            OnStatusMessage?.Invoke($"Vertices: {model.GetTotalVertexCount():N0}, Triangles: {model.GetTotalTriangleCount():N0}");
        }
        else
        {
            OnStatusMessage?.Invoke("Failed to load model or model is empty.");
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
        _renderer.Camera.Position = new Vector3(0, 5, 10);
        _renderer.Camera.Yaw = -90.0f;
        _renderer.Camera.Pitch = 0.0f;
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
        OnStatusMessage?.Invoke("WASD: Move camera | Space/Shift: Up/Down");
        OnStatusMessage?.Invoke("Right-Click: Capture/Release mouse for look around");
        OnStatusMessage?.Invoke("Left-Click: Select element");
        OnStatusMessage?.Invoke("Mouse Scroll: Zoom in/out");
        OnStatusMessage?.Invoke("+/-: Increase/Decrease movement speed");
        OnStatusMessage?.Invoke("F: Focus on model | R: Reset camera");
        OnStatusMessage?.Invoke("L: Toggle lighting | Delete: Clear selection");
        OnStatusMessage?.Invoke("F2: Toggle VR mode | F3: Toggle AR mode");
        OnStatusMessage?.Invoke("F11: Toggle fullscreen | ESC: Exit");
        OnStatusMessage?.Invoke("Drag & Drop: Load IFC file");
    }

    private void OnClosing()
    {
        Dispose();
    }

    public void Dispose()
    {
        _imguiController?.Dispose();
        _renderer?.Dispose();
        _inputContext?.Dispose();
        _gl?.Dispose();
    }
}
