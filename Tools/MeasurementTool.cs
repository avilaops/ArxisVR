using System.Numerics;

namespace Vizzio.Tools;

/// <summary>
/// Tool for measuring distances and areas in 3D space
/// </summary>
public class MeasurementTool
{
    private readonly List<Vector3> _measurementPoints = new();
    private bool _isActive;
    private MeasurementMode _mode = MeasurementMode.Distance;

    public bool IsActive
    {
        get => _isActive;
        set
        {
            _isActive = value;
            if (!value)
            {
                ClearMeasurements();
            }
        }
    }

    public MeasurementMode Mode
    {
        get => _mode;
        set
        {
            _mode = value;
            ClearMeasurements();
        }
    }

    public IReadOnlyList<Vector3> MeasurementPoints => _measurementPoints.AsReadOnly();
    
    public event Action<MeasurementResult>? OnMeasurementComplete;

    public void AddPoint(Vector3 point)
    {
        if (!_isActive)
            return;

        _measurementPoints.Add(point);

        // Check if measurement is complete
        if (_mode == MeasurementMode.Distance && _measurementPoints.Count == 2)
        {
            CompleteMeasurement();
        }
        else if (_mode == MeasurementMode.Area && _measurementPoints.Count >= 3)
        {
            // Area measurement can have multiple points
            // User can finish by pressing Enter or clicking first point again
        }
    }

    public void RemoveLastPoint()
    {
        if (_measurementPoints.Count > 0)
        {
            _measurementPoints.RemoveAt(_measurementPoints.Count - 1);
        }
    }

    public void CompleteMeasurement()
    {
        if (_measurementPoints.Count < 2)
            return;

        MeasurementResult result;

        switch (_mode)
        {
            case MeasurementMode.Distance:
                result = CalculateDistance();
                break;
            
            case MeasurementMode.Area:
                result = CalculateArea();
                break;
            
            case MeasurementMode.Angle:
                result = CalculateAngle();
                break;
            
            default:
                return;
        }

        OnMeasurementComplete?.Invoke(result);
    }

    public void ClearMeasurements()
    {
        _measurementPoints.Clear();
    }

    private MeasurementResult CalculateDistance()
    {
        if (_measurementPoints.Count < 2)
            return new MeasurementResult(MeasurementMode.Distance, 0, "m");

        var distance = Vector3.Distance(_measurementPoints[0], _measurementPoints[1]);
        
        return new MeasurementResult(
            MeasurementMode.Distance,
            distance,
            "m",
            _measurementPoints.ToList()
        );
    }

    private MeasurementResult CalculateArea()
    {
        if (_measurementPoints.Count < 3)
            return new MeasurementResult(MeasurementMode.Area, 0, "m²");

        // Calculate area using Shoelace formula for polygon
        float area = 0;
        
        for (int i = 0; i < _measurementPoints.Count; i++)
        {
            var p1 = _measurementPoints[i];
            var p2 = _measurementPoints[(i + 1) % _measurementPoints.Count];
            
            // Project to XZ plane for ground area
            area += (p1.X * p2.Z) - (p2.X * p1.Z);
        }
        
        area = Math.Abs(area) / 2.0f;

        return new MeasurementResult(
            MeasurementMode.Area,
            area,
            "m²",
            _measurementPoints.ToList()
        );
    }

    private MeasurementResult CalculateAngle()
    {
        if (_measurementPoints.Count < 3)
            return new MeasurementResult(MeasurementMode.Angle, 0, "°");

        // Calculate angle between three points (p0-p1-p2)
        var v1 = Vector3.Normalize(_measurementPoints[0] - _measurementPoints[1]);
        var v2 = Vector3.Normalize(_measurementPoints[2] - _measurementPoints[1]);
        
        var dot = Vector3.Dot(v1, v2);
        var angle = Math.Acos(Math.Clamp(dot, -1.0f, 1.0f)) * (180.0f / Math.PI);

        return new MeasurementResult(
            MeasurementMode.Angle,
            (float)angle,
            "°",
            _measurementPoints.ToList()
        );
    }

    public List<MeasurementLine> GetMeasurementLines()
    {
        var lines = new List<MeasurementLine>();

        if (_measurementPoints.Count < 2)
            return lines;

        switch (_mode)
        {
            case MeasurementMode.Distance:
                if (_measurementPoints.Count >= 2)
                {
                    lines.Add(new MeasurementLine(
                        _measurementPoints[0],
                        _measurementPoints[1],
                        Vector3.Distance(_measurementPoints[0], _measurementPoints[1])
                    ));
                }
                break;

            case MeasurementMode.Area:
                // Create lines between consecutive points
                for (int i = 0; i < _measurementPoints.Count; i++)
                {
                    var p1 = _measurementPoints[i];
                    var p2 = _measurementPoints[(i + 1) % _measurementPoints.Count];
                    
                    lines.Add(new MeasurementLine(p1, p2, Vector3.Distance(p1, p2)));
                }
                break;

            case MeasurementMode.Angle:
                if (_measurementPoints.Count >= 3)
                {
                    lines.Add(new MeasurementLine(_measurementPoints[0], _measurementPoints[1], 0));
                    lines.Add(new MeasurementLine(_measurementPoints[1], _measurementPoints[2], 0));
                }
                break;
        }

        return lines;
    }
}

public enum MeasurementMode
{
    Distance,
    Area,
    Angle
}

public class MeasurementResult
{
    public MeasurementMode Mode { get; }
    public float Value { get; }
    public string Unit { get; }
    public List<Vector3> Points { get; }
    public DateTime Timestamp { get; }

    public MeasurementResult(MeasurementMode mode, float value, string unit, List<Vector3>? points = null)
    {
        Mode = mode;
        Value = value;
        Unit = unit;
        Points = points ?? new List<Vector3>();
        Timestamp = DateTime.Now;
    }

    public override string ToString()
    {
        return $"{Mode}: {Value:F3} {Unit}";
    }
}

public struct MeasurementLine
{
    public Vector3 Start { get; }
    public Vector3 End { get; }
    public float Length { get; }

    public MeasurementLine(Vector3 start, Vector3 end, float length)
    {
        Start = start;
        End = end;
        Length = length;
    }

    public Vector3 Midpoint => (Start + End) * 0.5f;
}
