using System.Numerics;

namespace ArxisVR.Tools;

/// <summary>
/// 3D annotation system for adding notes to the model
/// </summary>
public class AnnotationSystem
{
    private readonly List<Annotation> _annotations = new();
    private int _nextId = 1;

    public IReadOnlyList<Annotation> Annotations => _annotations.AsReadOnly();
    
    public event Action<Annotation>? OnAnnotationAdded;
    public event Action<Annotation>? OnAnnotationRemoved;
    public event Action<Annotation>? OnAnnotationModified;

    public Annotation AddAnnotation(Vector3 position, string text, AnnotationType type = AnnotationType.Note)
    {
        var annotation = new Annotation
        {
            Id = _nextId++,
            Position = position,
            Text = text,
            Type = type,
            CreatedAt = DateTime.Now,
            Author = Environment.UserName,
            Color = GetDefaultColorForType(type)
        };

        _annotations.Add(annotation);
        OnAnnotationAdded?.Invoke(annotation);
        
        return annotation;
    }

    public void RemoveAnnotation(int id)
    {
        var annotation = _annotations.FirstOrDefault(a => a.Id == id);
        if (annotation != null)
        {
            _annotations.Remove(annotation);
            OnAnnotationRemoved?.Invoke(annotation);
        }
    }

    public void UpdateAnnotation(int id, string newText)
    {
        var annotation = _annotations.FirstOrDefault(a => a.Id == id);
        if (annotation != null)
        {
            annotation.Text = newText;
            annotation.ModifiedAt = DateTime.Now;
            OnAnnotationModified?.Invoke(annotation);
        }
    }

    public void ClearAll()
    {
        var annotationsCopy = _annotations.ToList();
        _annotations.Clear();
        
        foreach (var annotation in annotationsCopy)
        {
            OnAnnotationRemoved?.Invoke(annotation);
        }
    }

    public void ExportToFile(string filePath)
    {
        using var writer = new StreamWriter(filePath);
        
        writer.WriteLine("=== ArxisVR ANNOTATIONS ===");
        writer.WriteLine($"Date: {DateTime.Now}");
        writer.WriteLine($"Total: {_annotations.Count}");
        writer.WriteLine();

        foreach (var annotation in _annotations.OrderBy(a => a.CreatedAt))
        {
            writer.WriteLine($"[{annotation.Id}] {annotation.Type}");
            writer.WriteLine($"Position: {annotation.Position}");
            writer.WriteLine($"Author: {annotation.Author}");
            writer.WriteLine($"Created: {annotation.CreatedAt:yyyy-MM-dd HH:mm:ss}");
            if (annotation.ModifiedAt.HasValue)
            {
                writer.WriteLine($"Modified: {annotation.ModifiedAt:yyyy-MM-dd HH:mm:ss}");
            }
            writer.WriteLine($"Text: {annotation.Text}");
            writer.WriteLine();
        }
    }

    public void ImportFromFile(string filePath)
    {
        // Simple import implementation
        // Could be enhanced to parse the export format
        if (!File.Exists(filePath))
            return;

        // For now, just add a note about the import
        AddAnnotation(Vector3.Zero, $"Imported from: {Path.GetFileName(filePath)}", AnnotationType.Info);
    }

    private Vector4 GetDefaultColorForType(AnnotationType type)
    {
        return type switch
        {
            AnnotationType.Note => new Vector4(1.0f, 1.0f, 0.5f, 1.0f),      // Yellow
            AnnotationType.Warning => new Vector4(1.0f, 0.5f, 0.0f, 1.0f),   // Orange
            AnnotationType.Error => new Vector4(1.0f, 0.2f, 0.2f, 1.0f),     // Red
            AnnotationType.Info => new Vector4(0.2f, 0.6f, 1.0f, 1.0f),      // Blue
            AnnotationType.Question => new Vector4(0.8f, 0.2f, 1.0f, 1.0f),  // Purple
            _ => new Vector4(1.0f, 1.0f, 1.0f, 1.0f)                         // White
        };
    }
}

public class Annotation
{
    public int Id { get; set; }
    public Vector3 Position { get; set; }
    public string Text { get; set; } = "";
    public AnnotationType Type { get; set; }
    public Vector4 Color { get; set; }
    public string Author { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public DateTime? ModifiedAt { get; set; }
    public bool IsVisible { get; set; } = true;

    public override string ToString()
    {
        return $"[{Type}] {Text}";
    }
}

public enum AnnotationType
{
    Note,
    Warning,
    Error,
    Info,
    Question
}
