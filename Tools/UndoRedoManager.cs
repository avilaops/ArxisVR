using System.Numerics;
using ArxisVR.Models;

namespace ArxisVR.Tools;

/// <summary>
/// Undo/Redo system for user actions
/// </summary>
public class UndoRedoManager
{
    private readonly Stack<IUndoableAction> _undoStack = new();
    private readonly Stack<IUndoableAction> _redoStack = new();
    private int _maxHistorySize = 50;

    public int MaxHistorySize
    {
        get => _maxHistorySize;
        set => _maxHistorySize = Math.Max(1, value);
    }

    public bool CanUndo => _undoStack.Count > 0;
    public bool CanRedo => _redoStack.Count > 0;

    public int UndoCount => _undoStack.Count;
    public int RedoCount => _redoStack.Count;

    public event Action? OnHistoryChanged;

    public void ExecuteAction(IUndoableAction action)
    {
        action.Execute();
        _undoStack.Push(action);
        _redoStack.Clear(); // Clear redo stack when new action is executed

        // Limit history size
        if (_undoStack.Count > _maxHistorySize)
        {
            var tempStack = new Stack<IUndoableAction>(_undoStack.Reverse().Take(_maxHistorySize).Reverse());
            _undoStack.Clear();
            foreach (var item in tempStack)
            {
                _undoStack.Push(item);
            }
        }

        OnHistoryChanged?.Invoke();
    }

    public void Undo()
    {
        if (!CanUndo)
            return;

        var action = _undoStack.Pop();
        action.Undo();
        _redoStack.Push(action);

        OnHistoryChanged?.Invoke();
    }

    public void Redo()
    {
        if (!CanRedo)
            return;

        var action = _redoStack.Pop();
        action.Execute();
        _undoStack.Push(action);

        OnHistoryChanged?.Invoke();
    }

    public void Clear()
    {
        _undoStack.Clear();
        _redoStack.Clear();
        OnHistoryChanged?.Invoke();
    }

    public IReadOnlyList<string> GetUndoHistory()
    {
        return _undoStack.Select(a => a.Description).ToList();
    }

    public IReadOnlyList<string> GetRedoHistory()
    {
        return _redoStack.Select(a => a.Description).ToList();
    }
}

/// <summary>
/// Interface for undoable actions
/// </summary>
public interface IUndoableAction
{
    string Description { get; }
    void Execute();
    void Undo();
}

/// <summary>
/// Action for changing element visibility
/// </summary>
public class ChangeVisibilityAction : IUndoableAction
{
    private readonly IfcElement _element;
    private readonly bool _oldVisibility;
    private readonly bool _newVisibility;

    public string Description { get; }

    public ChangeVisibilityAction(IfcElement element, bool newVisibility)
    {
        _element = element;
        _oldVisibility = element.IsVisible;
        _newVisibility = newVisibility;
        Description = $"Change visibility of {element.Name}";
    }

    public void Execute()
    {
        _element.IsVisible = _newVisibility;
    }

    public void Undo()
    {
        _element.IsVisible = _oldVisibility;
    }
}

/// <summary>
/// Action for changing element color
/// </summary>
public class ChangeColorAction : IUndoableAction
{
    private readonly IfcElement _element;
    private readonly Vector3 _oldColor;
    private readonly Vector3 _newColor;

    public string Description { get; }

    public ChangeColorAction(IfcElement element, Vector3 newColor)
    {
        _element = element;
        _oldColor = element.Color;
        _newColor = newColor;
        Description = $"Change color of {element.Name}";
    }

    public void Execute()
    {
        _element.Color = _newColor;
    }

    public void Undo()
    {
        _element.Color = _oldColor;
    }
}

/// <summary>
/// Action for changing layer visibility
/// </summary>
public class ChangeLayerVisibilityAction : IUndoableAction
{
    private readonly Layer _layer;
    private readonly bool _oldVisibility;
    private readonly bool _newVisibility;

    public string Description { get; }

    public ChangeLayerVisibilityAction(Layer layer, bool newVisibility)
    {
        _layer = layer;
        _oldVisibility = layer.IsVisible;
        _newVisibility = newVisibility;
        Description = $"Change layer '{layer.Name}' visibility";
    }

    public void Execute()
    {
        _layer.IsVisible = _newVisibility;
        foreach (var element in _layer.Elements)
        {
            element.IsVisible = _newVisibility;
        }
    }

    public void Undo()
    {
        _layer.IsVisible = _oldVisibility;
        foreach (var element in _layer.Elements)
        {
            element.IsVisible = _oldVisibility;
        }
    }
}

/// <summary>
/// Action for adding annotation
/// </summary>
public class AddAnnotationAction : IUndoableAction
{
    private readonly AnnotationSystem _system;
    private readonly Vector3 _position;
    private readonly string _text;
    private readonly AnnotationType _type;
    private Annotation? _createdAnnotation;

    public string Description { get; }

    public AddAnnotationAction(AnnotationSystem system, Vector3 position, string text, AnnotationType type)
    {
        _system = system;
        _position = position;
        _text = text;
        _type = type;
        Description = $"Add {type} annotation";
    }

    public void Execute()
    {
        _createdAnnotation = _system.AddAnnotation(_position, _text, _type);
    }

    public void Undo()
    {
        if (_createdAnnotation != null)
        {
            _system.RemoveAnnotation(_createdAnnotation.Id);
        }
    }
}

/// <summary>
/// Action for removing annotation
/// </summary>
public class RemoveAnnotationAction : IUndoableAction
{
    private readonly AnnotationSystem _system;
    private readonly Annotation _annotation;

    public string Description { get; }

    public RemoveAnnotationAction(AnnotationSystem system, Annotation annotation)
    {
        _system = system;
        _annotation = annotation;
        Description = $"Remove {annotation.Type} annotation";
    }

    public void Execute()
    {
        _system.RemoveAnnotation(_annotation.Id);
    }

    public void Undo()
    {
        _system.AddAnnotation(_annotation.Position, _annotation.Text, _annotation.Type);
    }
}

/// <summary>
/// Batch action for executing multiple actions as one
/// </summary>
public class BatchAction : IUndoableAction
{
    private readonly List<IUndoableAction> _actions = new();
    
    public string Description { get; }

    public BatchAction(string description)
    {
        Description = description;
    }

    public void AddAction(IUndoableAction action)
    {
        _actions.Add(action);
    }

    public void Execute()
    {
        foreach (var action in _actions)
        {
            action.Execute();
        }
    }

    public void Undo()
    {
        // Undo in reverse order
        for (int i = _actions.Count - 1; i >= 0; i--)
        {
            _actions[i].Undo();
        }
    }
}
