using ImGuiNET;
using Silk.NET.Input;
using Silk.NET.OpenGL;
using Silk.NET.Windowing;
using System.Collections.Generic;
using System.Numerics;
using ArxisVR.AI;
using ArxisVR.Models;
using ArxisVR.Rendering;
using ArxisVR.Services;
using ArxisVR.UI;

namespace ArxisVR.Application;

/// <summary>
/// Simplified IFC Viewer - Clean and functional
/// </summary>
public class SimpleIfcViewer : IDisposable
{
    private IWindow? _window;
    private GL? _gl;
    private IInputContext? _inputContext;

    private readonly Renderer3D _renderer;
    private readonly IfcParser _parser;
    private ImGuiController? _imguiController;
    private SimpleUIManager? _uiManager;
    private GridRenderer? _gridRenderer;
    private AIChatPanel? _aiChatPanel;

    private IfcAIAssistant? _assistant;
    private string? _lastAnalyzedElementId;

    private IfcModel? _currentModel;
    private bool _isMouseCaptured = false;
    private Vector2 _lastMousePosition;
    private bool _firstMouseMove = true;

    private float FPS = 60;
    private int FrameCount = 0;
    private DateTime _lastFpsUpdate = DateTime.Now;

    public SimpleIfcViewer()
    {
        _renderer = new Renderer3D();
        _parser = new IfcParser();

        _parser.OnProgress += (msg) => Console.WriteLine($"[Parser] {msg}");
        _parser.OnError += (msg) => Console.WriteLine($"[Error] {msg}");
    }

    public void SetAssistant(IfcAIAssistant assistant)
    {
        _assistant = assistant;
        _aiChatPanel?.SetAssistant(assistant);
    }

    public void Run()
    {
        var options = WindowOptions.Default;
        options.Size = new Silk.NET.Maths.Vector2D<int>(1920, 1080);
        options.Title = "ArxisVR - IFC Viewer (Simplified UI)";
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

        // Grid
        _gridRenderer = new GridRenderer();
        _gridRenderer.Initialize(_gl);
        _gridRenderer.ShowGrid = true;
        _gridRenderer.ShowAxes = true;

        // UI
        _imguiController = new ImGuiController(_gl, _window.Size.X, _window.Size.Y);
        _uiManager = new SimpleUIManager();
        _uiManager.OnOpenFile += RequestFileOpen;
        _uiManager.OnFocusModel += FocusOnModel;
        _uiManager.OnResetCamera += ResetCamera;
        _uiManager.OnElementSelected += OnElementSelected;

        _aiChatPanel = new AIChatPanel();
        if (_assistant != null)
        {
            _aiChatPanel.SetAssistant(_assistant);
        }
        _uiManager.AttachAIChatPanel(_aiChatPanel);

        // Events

        // Input
        SetupInput();

        Console.WriteLine("=== ArxisVR Simplified UI Ready ===");
        Console.WriteLine("Press Ctrl+O to open an IFC file");
        Console.WriteLine("Press F1 for help");
    }

    private void SetupInput()
    {
        if (_inputContext == null)
            return;

        foreach (var keyboard in _inputContext.Keyboards)
        {
            keyboard.KeyDown += OnKeyDown;
        }

        foreach (var mouse in _inputContext.Mice)
        {
            mouse.MouseMove += OnMouseMove;
            mouse.MouseDown += OnMouseDown;
            mouse.MouseUp += OnMouseUp;
            mouse.Scroll += OnMouseScroll;
        }

        if (_window != null)
        {
            _window.FileDrop += OnFileDrop;
        }
    }

    private void OnUpdate(double deltaTime)
    {
        // Update FPS
        FrameCount++;
        if ((DateTime.Now - _lastFpsUpdate).TotalSeconds >= 1.0)
        {
            FPS = FrameCount / (float)(DateTime.Now - _lastFpsUpdate).TotalSeconds;
            FrameCount = 0;
            _lastFpsUpdate = DateTime.Now;
        }

        // Update ImGui
        if (_imguiController != null && _window != null)
        {
            _imguiController.Update((float)deltaTime, _window.Size.X, _window.Size.Y);
        }

        // Camera movement
        if (!ImGui.GetIO().WantCaptureKeyboard && _inputContext != null)
        {
            HandleCameraMovement((float)deltaTime);
        }
    }

    private void HandleCameraMovement(float deltaTime)
    {
        if (_inputContext == null || _inputContext.Keyboards.Count == 0) return;

        var keyboard = _inputContext.Keyboards[0];
        var camera = _renderer.Camera;

        if (keyboard.IsKeyPressed(Key.W))
            camera.ProcessKeyboard(CameraMovement.Forward, deltaTime);
        if (keyboard.IsKeyPressed(Key.S))
            camera.ProcessKeyboard(CameraMovement.Backward, deltaTime);
        if (keyboard.IsKeyPressed(Key.A))
            camera.ProcessKeyboard(CameraMovement.Left, deltaTime);
        if (keyboard.IsKeyPressed(Key.D))
            camera.ProcessKeyboard(CameraMovement.Right, deltaTime);
        if (keyboard.IsKeyPressed(Key.Space))
            camera.ProcessKeyboard(CameraMovement.Up, deltaTime);
        if (keyboard.IsKeyPressed(Key.ShiftLeft))
            camera.ProcessKeyboard(CameraMovement.Down, deltaTime);
    }

    private void OnRender(double deltaTime)
    {
        _renderer.Render();

        if (_gridRenderer != null)
        {
            _gridRenderer.Render(_renderer.Camera);
        }

        if (_uiManager != null && _imguiController != null)
        {
            _uiManager.Render((float)deltaTime);
            _imguiController.Render();
        }
    }

    private void OnResize(Silk.NET.Maths.Vector2D<int> size)
    {
        _renderer.Resize(size.X, size.Y);
    }

    private void OnKeyDown(IKeyboard keyboard, Key key, int keyCode)
    {
        if (ImGui.GetIO().WantCaptureKeyboard)
            return;

        bool ctrlPressed = keyboard.IsKeyPressed(Key.ControlLeft) || keyboard.IsKeyPressed(Key.ControlRight);

        if (ctrlPressed && key == Key.O)
        {
            RequestFileOpen();
            return;
        }

        switch (key)
        {
            case Key.Escape:
                if (_isMouseCaptured)
                    ReleaseMouse();
                else
                    _window?.Close();
                break;

            case Key.F:
                FocusOnModel();
                break;

            case Key.R:
                ResetCamera();
                break;

            case Key.G:
                if (_gridRenderer != null)
                {
                    _gridRenderer.ShowGrid = !_gridRenderer.ShowGrid;
                    _uiManager?.ShowStatus($"Grid: {(_gridRenderer.ShowGrid ? "ON" : "OFF")}", 2f, SimpleUIManager.StatusLevel.Info);
                }
                break;

            case Key.F1:
                ShowHelp();
                break;
        }
    }

    private void OnMouseMove(IMouse mouse, Vector2 position)
    {
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
        if (ImGui.GetIO().WantCaptureMouse)
            return;

        if (button == MouseButton.Right)
        {
            if (!_isMouseCaptured)
                CaptureMouse();
            else
                ReleaseMouse();
        }
    }

    private void OnMouseUp(IMouse mouse, MouseButton button)
    {
        // Placeholder
    }

    private void OnMouseScroll(IMouse mouse, ScrollWheel scrollWheel)
    {
        if (ImGui.GetIO().WantCaptureMouse)
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
            _uiManager?.ShowStatus("Mouse captured - Right-click to release", 4f, SimpleUIManager.StatusLevel.Info);
        }
    }

    private void ReleaseMouse()
    {
        if (_inputContext?.Mice.Count > 0)
        {
            _inputContext.Mice[0].Cursor.CursorMode = CursorMode.Normal;
            _isMouseCaptured = false;
            _uiManager?.ShowStatus("Mouse released", 3f, SimpleUIManager.StatusLevel.Info);
        }
    }

    private void OnFileDrop(string[] files)
    {
        if (files.Length > 0 && files[0].EndsWith(".ifc", StringComparison.OrdinalIgnoreCase))
        {
            _ = LoadIfcFileAsync(files[0]);
        }
    }

    private void RequestFileOpen()
    {
        _uiManager?.ShowStatus("Select an IFC file…", 5f, SimpleUIManager.StatusLevel.Info);

        var filePath = SimpleFileDialog.OpenFile();

        if (!string.IsNullOrEmpty(filePath))
        {
            _ = LoadIfcFileAsync(filePath);
        }
        else
        {
            _uiManager?.ShowStatus("File selection cancelled", 3f, SimpleUIManager.StatusLevel.Warning);
        }
    }

    public async Task LoadIfcFileAsync(string filePath)
    {
        _uiManager?.ShowStatus($"Loading {Path.GetFileName(filePath)}...", 999f, SimpleUIManager.StatusLevel.Loading);

        var model = await _parser.ParseFileAsync(filePath);

        if (model != null && model.Elements.Count > 0)
        {
            _currentModel = model;
            _renderer.LoadModel(model);
            _uiManager?.SetModel(model);
            _uiManager?.ShowStatus($"Loaded {model.Elements.Count} elements", 5f, SimpleUIManager.StatusLevel.Success);

            Console.WriteLine($"Model loaded: {model.Elements.Count} elements");

            if (_aiChatPanel != null)
            {
                await _aiChatPanel.AddSystemMessage($"Model '{Path.GetFileName(filePath)}' loaded with {model.Elements.Count} elements.");
            }
        }
        else
        {
            _uiManager?.ShowStatus("Failed to load model", 3f, SimpleUIManager.StatusLevel.Error);
        }
    }

    private void FocusOnModel()
    {
        if (_currentModel != null)
        {
            _renderer.Camera.FocusOn(_currentModel.ModelCenter, _currentModel.ModelSize * 1.5f);
            _uiManager?.ShowStatus("Camera focused on model", 3f, SimpleUIManager.StatusLevel.Success);
        }
    }

    private void ResetCamera()
    {
        _renderer.Camera.Position = new Vector3(0, 5, 10);
        _renderer.Camera.Yaw = -90.0f;
        _renderer.Camera.Pitch = 0.0f;
        _uiManager?.ShowStatus("Camera reset", 3f, SimpleUIManager.StatusLevel.Info);
    }

    private void OnElementSelected(IfcElement? element)
    {
        if (element == null || _aiChatPanel == null)
        {
            return;
        }

        if (_uiManager is null || !_uiManager.IsAIPanelVisible)
        {
            return;
        }

        if (string.Equals(_lastAnalyzedElementId, element.GlobalId, StringComparison.Ordinal))
        {
            return;
        }

        _lastAnalyzedElementId = element.GlobalId;

        var elementType = !string.IsNullOrWhiteSpace(element.IfcType)
            ? element.IfcType
            : (!string.IsNullOrWhiteSpace(element.Type) ? element.Type : "Element");

        var propertiesSnapshot = new Dictionary<string, string>(element.Properties);
        _ = _aiChatPanel.AnalyzeElement(elementType, propertiesSnapshot);
    }

    private void ShowHelp()
    {
        Console.WriteLine("=== CONTROLS ===");
        Console.WriteLine("WASD - Move camera");
        Console.WriteLine("Right-click - Rotate view");
        Console.WriteLine("Scroll - Zoom");
        Console.WriteLine("Ctrl+O - Open file");
        Console.WriteLine("F - Focus on model");
        Console.WriteLine("R - Reset camera");
        Console.WriteLine("G - Toggle grid");
        Console.WriteLine("ESC - Exit");
        _uiManager?.ShowStatus("Controls printed to console", 3f, SimpleUIManager.StatusLevel.Info);
    }

    private void OnClosing()
    {
        Dispose();
    }

    public void Dispose()
    {
        if (_uiManager != null)
        {
            _uiManager.OnOpenFile -= RequestFileOpen;
            _uiManager.OnFocusModel -= FocusOnModel;
            _uiManager.OnResetCamera -= ResetCamera;
            _uiManager.OnElementSelected -= OnElementSelected;
        }

        _gridRenderer?.Dispose();
        _imguiController?.Dispose();
        _renderer?.Dispose();
        _inputContext?.Dispose();
        _gl?.Dispose();
    }
}
