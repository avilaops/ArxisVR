using System.Numerics;
using Vizzio.Models;

namespace Vizzio.Rendering;

/// <summary>
/// Represents a renderable mesh with OpenGL buffer data
/// </summary>
public class RenderMesh
{
    public uint VertexArrayObject { get; set; }
    public uint VertexBufferObject { get; set; }
    public uint ElementBufferObject { get; set; }
    public int IndexCount { get; set; }
    public Vector3 Color { get; set; } = Vector3.One;
    public bool IsVisible { get; set; } = true;
    public string ElementId { get; set; } = string.Empty;

    public void Dispose()
    {
        // Cleanup will be handled by renderer
    }
}

/// <summary>
/// Manages mesh data for rendering
/// </summary>
public class MeshManager
{
    private readonly Dictionary<string, RenderMesh> _meshes = new();

    public void AddMesh(string id, RenderMesh mesh)
    {
        _meshes[id] = mesh;
    }

    public RenderMesh? GetMesh(string id)
    {
        return _meshes.TryGetValue(id, out var mesh) ? mesh : null;
    }

    public IEnumerable<RenderMesh> GetAllMeshes()
    {
        return _meshes.Values;
    }

    public void RemoveMesh(string id)
    {
        if (_meshes.TryGetValue(id, out var mesh))
        {
            mesh.Dispose();
            _meshes.Remove(id);
        }
    }

    public void Clear()
    {
        foreach (var mesh in _meshes.Values)
        {
            mesh.Dispose();
        }
        _meshes.Clear();
    }

    public void ClearAll()
    {
        Clear();
    }

    public int GetMeshCount()
    {
        return _meshes.Count;
    }

    public int GetVisibleMeshCount()
    {
        return _meshes.Values.Count(m => m.IsVisible);
    }
}

/// <summary>
/// Helper for converting IFC geometry to render data
/// </summary>
public static class MeshConverter
{
    public static float[] ToVertexArray(MeshGeometry geometry, Vector3 color)
    {
        var vertexData = new float[geometry.Vertices.Count * 9]; // 3 pos + 3 normal + 3 color

        for (int i = 0; i < geometry.Vertices.Count; i++)
        {
            var vertex = geometry.Vertices[i];
            var index = i * 9;

            // Position
            vertexData[index + 0] = vertex.Position.X;
            vertexData[index + 1] = vertex.Position.Y;
            vertexData[index + 2] = vertex.Position.Z;

            // Normal
            vertexData[index + 3] = vertex.Normal.X;
            vertexData[index + 4] = vertex.Normal.Y;
            vertexData[index + 5] = vertex.Normal.Z;

            // Color
            vertexData[index + 6] = color.X;
            vertexData[index + 7] = color.Y;
            vertexData[index + 8] = color.Z;
        }

        return vertexData;
    }

    public static uint[] ToIndexArray(MeshGeometry geometry)
    {
        return geometry.Indices.ToArray();
    }
}
