using System.Numerics;

namespace ArxisVR.UI;

/// <summary>
/// Interactive tutorial system with contextual hints
/// </summary>
public class TutorialSystem
{
    private List<TutorialStep> _steps = new();
    private int _currentStepIndex = -1;
    private bool _isActive;
    private DateTime _stepStartTime;
    private HashSet<string> _completedActions = new();
    
    public bool IsActive => _isActive;
    public TutorialStep? CurrentStep => _currentStepIndex >= 0 && _currentStepIndex < _steps.Count 
        ? _steps[_currentStepIndex] 
        : null;
    public int CurrentStepIndex => _currentStepIndex;
    public int TotalSteps => _steps.Count;
    public float Progress => _steps.Count > 0 ? (float)_currentStepIndex / _steps.Count : 0;
    
    public event Action<TutorialStep>? OnStepChanged;
    public event Action? OnTutorialCompleted;
    public event Action<string>? OnHint;

    public TutorialSystem()
    {
        InitializeSteps();
    }

    private void InitializeSteps()
    {
        _steps = new List<TutorialStep>
        {
            new TutorialStep
            {
                Id = "welcome",
                Title = "Welcome to ArxisVR",
                Description = "Learn the basics of navigating and viewing IFC models in 3D.",
                Hint = "Press F1 anytime to see all available controls",
                RequiredAction = "acknowledge",
                Icon = "👋"
            },
            new TutorialStep
            {
                Id = "load_model",
                Title = "Load an IFC Model",
                Description = "Drag and drop an IFC file into the window, or press Ctrl+O to open a file.",
                Hint = "You can find sample IFC files in the Examples folder",
                RequiredAction = "model_loaded",
                Icon = "📁"
            },
            new TutorialStep
            {
                Id = "camera_orbit",
                Title = "Orbit Camera",
                Description = "Right-click and drag to rotate the camera around the model.",
                Hint = "The camera orbits around a center point. You're in Orbit mode by default.",
                RequiredAction = "camera_rotated",
                Icon = "🔄"
            },
            new TutorialStep
            {
                Id = "camera_pan",
                Title = "Pan Camera",
                Description = "Middle-click and drag to move the camera sideways.",
                Hint = "Panning helps you reposition the view without rotating",
                RequiredAction = "camera_panned",
                Icon = "↔️"
            },
            new TutorialStep
            {
                Id = "camera_zoom",
                Title = "Zoom",
                Description = "Use the mouse scroll wheel to zoom in and out.",
                Hint = "You can also use + and - keys to adjust movement speed",
                RequiredAction = "camera_zoomed",
                Icon = "🔍"
            },
            new TutorialStep
            {
                Id = "select_element",
                Title = "Select Elements",
                Description = "Left-click on any element to select it and view its properties.",
                Hint = "Selected elements are highlighted in gold",
                RequiredAction = "element_selected",
                Icon = "👆"
            },
            new TutorialStep
            {
                Id = "camera_presets",
                Title = "Camera Presets",
                Description = "Use numpad keys to quickly switch views: 1-Front, 3-Right, 7-Top, 0-Isometric.",
                Hint = "Press F to focus on the model, R to reset the camera",
                RequiredAction = "preset_used",
                Icon = "📷"
            },
            new TutorialStep
            {
                Id = "grid_axes",
                Title = "Grid and Axes",
                Description = "Press G to toggle the grid, H to toggle the orientation axes.",
                Hint = "Red=X, Green=Y, Blue=Z axes help with spatial orientation",
                RequiredAction = "grid_toggled",
                Icon = "📐"
            },
            new TutorialStep
            {
                Id = "element_list",
                Title = "Element List",
                Description = "Use the left panel to browse all elements in the model by type.",
                Hint = "Click on type names to expand/collapse groups",
                RequiredAction = "panel_used",
                Icon = "📋"
            },
            new TutorialStep
            {
                Id = "measurements",
                Title = "Measurements",
                Description = "Press M to activate measurement mode, then click on two points to measure distance.",
                Hint = "Measurements appear in the right panel",
                RequiredAction = "measurement_made",
                Icon = "📏"
            },
            new TutorialStep
            {
                Id = "vr_mode",
                Title = "VR Mode (Optional)",
                Description = "Press F2 to enable VR mode if you have a VR headset connected.",
                Hint = "VR mode provides an immersive 3D experience",
                RequiredAction = "vr_explored",
                Icon = "🥽"
            },
            new TutorialStep
            {
                Id = "completed",
                Title = "Tutorial Completed!",
                Description = "You've learned the basics of ArxisVR. Explore more features on your own!",
                Hint = "Press F1 anytime to review all controls",
                RequiredAction = "finished",
                Icon = "🎉"
            }
        };
    }

    public void Start()
    {
        if (!_isActive)
        {
            _isActive = true;
            _currentStepIndex = 0;
            _stepStartTime = DateTime.Now;
            _completedActions.Clear();
            OnStepChanged?.Invoke(_steps[0]);
        }
    }

    public void Stop()
    {
        _isActive = false;
        _currentStepIndex = -1;
    }

    public void Reset()
    {
        Stop();
        _completedActions.Clear();
    }

    public void NextStep()
    {
        if (!_isActive || _currentStepIndex >= _steps.Count - 1)
        {
            CompleteTutorial();
            return;
        }

        _currentStepIndex++;
        _stepStartTime = DateTime.Now;
        OnStepChanged?.Invoke(_steps[_currentStepIndex]);
    }

    public void PreviousStep()
    {
        if (_currentStepIndex > 0)
        {
            _currentStepIndex--;
            _stepStartTime = DateTime.Now;
            OnStepChanged?.Invoke(_steps[_currentStepIndex]);
        }
    }

    public void SkipStep()
    {
        NextStep();
    }

    public void RecordAction(string actionId)
    {
        if (!_isActive) return;

        _completedActions.Add(actionId);
        
        var currentStep = CurrentStep;
        if (currentStep != null && currentStep.RequiredAction == actionId)
        {
            // Auto-advance after completing required action
            Task.Delay(1000).ContinueWith(_ => NextStep());
        }
    }

    public bool HasCompletedAction(string actionId)
    {
        return _completedActions.Contains(actionId);
    }

    public void ShowHint(string hint)
    {
        OnHint?.Invoke(hint);
    }

    public void ShowContextualHint(string context)
    {
        var hints = new Dictionary<string, string>
        {
            ["first_load"] = "💡 Tip: You can drag and drop IFC files directly into the window!",
            ["empty_scene"] = "💡 Tip: Load an IFC model to start exploring. Press Ctrl+O or drag a file.",
            ["large_model"] = "💡 Tip: For large models, use the element list to hide/show specific types.",
            ["measurement_active"] = "💡 Tip: Click on element surfaces to add measurement points.",
            ["vr_mode"] = "💡 Tip: Use controller thumbsticks to teleport around the model.",
            ["selection_active"] = "💡 Tip: Selected element properties are shown in the right panel.",
            ["camera_far"] = "💡 Tip: Press F to focus the camera on the model center.",
            ["first_rotation"] = "💡 Tip: Hold right-click and drag to look around!",
            ["first_pan"] = "💡 Tip: Use middle-click to pan the view.",
        };

        if (hints.TryGetValue(context, out var hint))
        {
            OnHint?.Invoke(hint);
        }
    }

    private void CompleteTutorial()
    {
        _isActive = false;
        OnTutorialCompleted?.Invoke();
    }

    public TutorialProgress GetProgress()
    {
        return new TutorialProgress
        {
            CurrentStep = _currentStepIndex + 1,
            TotalSteps = _steps.Count,
            CompletedActions = _completedActions.Count,
            ElapsedTime = _isActive ? DateTime.Now - _stepStartTime : TimeSpan.Zero,
            IsCompleted = _currentStepIndex >= _steps.Count - 1
        };
    }
}

public class TutorialStep
{
    public string Id { get; set; } = "";
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string Hint { get; set; } = "";
    public string RequiredAction { get; set; } = "";
    public string Icon { get; set; } = "ℹ️";
    public Vector2? HighlightPosition { get; set; }
    public bool IsOptional { get; set; }
}

public class TutorialProgress
{
    public int CurrentStep { get; set; }
    public int TotalSteps { get; set; }
    public int CompletedActions { get; set; }
    public TimeSpan ElapsedTime { get; set; }
    public bool IsCompleted { get; set; }
}

/// <summary>
/// Contextual hints that appear based on user actions
/// </summary>
public class ContextualHints
{
    private Queue<string> _hintQueue = new();
    private string? _currentHint;
    private DateTime _hintShowTime;
    private readonly TimeSpan _hintDisplayDuration = TimeSpan.FromSeconds(5);
    
    public string? CurrentHint => _currentHint;
    public bool HasHint => _currentHint != null;

    public void AddHint(string hint)
    {
        _hintQueue.Enqueue(hint);
        ShowNextHint();
    }

    public void Update()
    {
        if (_currentHint != null && DateTime.Now - _hintShowTime > _hintDisplayDuration)
        {
            _currentHint = null;
            ShowNextHint();
        }
    }

    private void ShowNextHint()
    {
        if (_currentHint == null && _hintQueue.Count > 0)
        {
            _currentHint = _hintQueue.Dequeue();
            _hintShowTime = DateTime.Now;
        }
    }

    public void Clear()
    {
        _hintQueue.Clear();
        _currentHint = null;
    }
}
