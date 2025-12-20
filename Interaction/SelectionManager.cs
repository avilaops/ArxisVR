using System.Numerics;
using Vizzio.Models;
using Vizzio.Rendering;

namespace Vizzio.Interaction;

/// <summary>
/// Handles element selection using ray casting
/// </summary>
public class SelectionManager
{
    private IfcElement? _selectedElement;
    private IfcElement? _hoveredElement;
    
    public IfcElement? SelectedElement
    {
        get => _selectedElement;
        set
        {
            if (_selectedElement != null)
                _selectedElement.IsSelected = false;
            
            _selectedElement = value;
            
            if (_selectedElement != null)
                _selectedElement.IsSelected = true;
            
            OnSelectionChanged?.Invoke(_selectedElement);
        }
    }

    public IfcElement? HoveredElement
    {
        get => _hoveredElement;
        private set => _hoveredElement = value;
    }

    public event Action<IfcElement?>? OnSelectionChanged;

    public void UpdateSelection(Vector2 mousePosition, Vector2 screenSize, Camera camera, IfcModel? model)
    {
        if (model == null)
            return;

        var ray = ScreenPointToRay(mousePosition, screenSize, camera);
        HoveredElement = RaycastElements(ray, model);
    }

    public void SelectHoveredElement()
    {
        if (HoveredElement != null)
        {
            SelectedElement = HoveredElement;
        }
    }

    public void ClearSelection()
    {
        SelectedElement = null;
    }

    private Ray ScreenPointToRay(Vector2 screenPoint, Vector2 screenSize, Camera camera)
    {
        // Convert screen coordinates to normalized device coordinates [-1, 1]
        var x = (2.0f * screenPoint.X) / screenSize.X - 1.0f;
        var y = 1.0f - (2.0f * screenPoint.Y) / screenSize.Y;

        // Create ray in clip space
        var rayClip = new Vector4(x, y, -1.0f, 1.0f);

        // Transform to view space
        var projection = camera.GetProjectionMatrix();
        Matrix4x4.Invert(projection, out var invProjection);
        var rayEye = Vector4.Transform(rayClip, invProjection);
        rayEye = new Vector4(rayEye.X, rayEye.Y, -1.0f, 0.0f);

        // Transform to world space
        var view = camera.GetViewMatrix();
        Matrix4x4.Invert(view, out var invView);
        var rayWorld = Vector4.Transform(rayEye, invView);
        
        var direction = new Vector3(rayWorld.X, rayWorld.Y, rayWorld.Z);
        direction = Vector3.Normalize(direction);

        return new Ray(camera.Position, direction);
    }

    private IfcElement? RaycastElements(Ray ray, IfcModel model)
    {
        IfcElement? closestElement = null;
        float closestDistance = float.MaxValue;

        foreach (var element in model.Elements)
        {
            if (!element.IsVisible || element.Geometry == null)
                continue;

            var distance = RayIntersectsElement(ray, element);
            
            if (distance.HasValue && distance.Value < closestDistance)
            {
                closestDistance = distance.Value;
                closestElement = element;
            }
        }

        return closestElement;
    }

    private float? RayIntersectsElement(Ray ray, IfcElement element)
    {
        if (element.Geometry == null)
            return null;

        // First check bounding box for early rejection
        if (!RayIntersectsBox(ray, element.Geometry.BoundingBoxMin, element.Geometry.BoundingBoxMax))
            return null;

        // Check individual triangles
        float? closestHit = null;
        var geometry = element.Geometry;

        for (int i = 0; i < geometry.Indices.Count; i += 3)
        {
            var v0 = geometry.Vertices[(int)geometry.Indices[i]].Position;
            var v1 = geometry.Vertices[(int)geometry.Indices[i + 1]].Position;
            var v2 = geometry.Vertices[(int)geometry.Indices[i + 2]].Position;

            var hit = RayIntersectsTriangle(ray, v0, v1, v2);
            
            if (hit.HasValue)
            {
                if (!closestHit.HasValue || hit.Value < closestHit.Value)
                {
                    closestHit = hit.Value;
                }
            }
        }

        return closestHit;
    }

    private bool RayIntersectsBox(Ray ray, Vector3 boxMin, Vector3 boxMax)
    {
        var invDir = new Vector3(
            1.0f / ray.Direction.X,
            1.0f / ray.Direction.Y,
            1.0f / ray.Direction.Z
        );

        var t1 = (boxMin.X - ray.Origin.X) * invDir.X;
        var t2 = (boxMax.X - ray.Origin.X) * invDir.X;
        var t3 = (boxMin.Y - ray.Origin.Y) * invDir.Y;
        var t4 = (boxMax.Y - ray.Origin.Y) * invDir.Y;
        var t5 = (boxMin.Z - ray.Origin.Z) * invDir.Z;
        var t6 = (boxMax.Z - ray.Origin.Z) * invDir.Z;

        var tmin = Math.Max(Math.Max(Math.Min(t1, t2), Math.Min(t3, t4)), Math.Min(t5, t6));
        var tmax = Math.Min(Math.Min(Math.Max(t1, t2), Math.Max(t3, t4)), Math.Max(t5, t6));

        // if tmax < 0, ray is intersecting box but entire box is behind ray
        if (tmax < 0)
            return false;

        // if tmin > tmax, ray doesn't intersect box
        if (tmin > tmax)
            return false;

        return true;
    }

    private float? RayIntersectsTriangle(Ray ray, Vector3 v0, Vector3 v1, Vector3 v2)
    {
        // Möller–Trumbore intersection algorithm
        const float epsilon = 0.0000001f;
        
        var edge1 = v1 - v0;
        var edge2 = v2 - v0;
        var h = Vector3.Cross(ray.Direction, edge2);
        var a = Vector3.Dot(edge1, h);

        if (a > -epsilon && a < epsilon)
            return null; // Ray is parallel to triangle

        var f = 1.0f / a;
        var s = ray.Origin - v0;
        var u = f * Vector3.Dot(s, h);

        if (u < 0.0f || u > 1.0f)
            return null;

        var q = Vector3.Cross(s, edge1);
        var v = f * Vector3.Dot(ray.Direction, q);

        if (v < 0.0f || u + v > 1.0f)
            return null;

        var t = f * Vector3.Dot(edge2, q);

        if (t > epsilon)
            return t; // Ray intersection
        
        return null;
    }
}

/// <summary>
/// Represents a ray in 3D space
/// </summary>
public struct Ray
{
    public Vector3 Origin;
    public Vector3 Direction;

    public Ray(Vector3 origin, Vector3 direction)
    {
        Origin = origin;
        Direction = direction;
    }

    public Vector3 GetPoint(float distance)
    {
        return Origin + Direction * distance;
    }
}
