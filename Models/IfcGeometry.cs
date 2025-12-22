using System.Numerics;

namespace ArxisVR.Models;

/// <summary>
/// Represents a vertex in 3D space with position and normal
/// </summary>
public struct Vertex
{
    public Vector3 Position;
    public Vector3 Normal;
    public Vector3 Color;

    public Vertex(Vector3 position, Vector3 normal, Vector3 color)
    {
        Position = position;
        Normal = normal;
        Color = color;
    }
}

/// <summary>
/// Represents a triangle face with three vertex indices
/// </summary>
public struct Face
{
    public uint Index1;
    public uint Index2;
    public uint Index3;

    public Face(uint i1, uint i2, uint i3)
    {
        Index1 = i1;
        Index2 = i2;
        Index3 = i3;
    }
}

/// <summary>
/// Represents geometry data for a mesh
/// </summary>
public class MeshGeometry
{
    public List<Vertex> Vertices { get; set; } = new();
    public List<uint> Indices { get; set; } = new();
    public Vector3 BoundingBoxMin { get; set; }
    public Vector3 BoundingBoxMax { get; set; }

    public void CalculateBoundingBox()
    {
        if (Vertices.Count == 0)
            return;

        BoundingBoxMin = Vertices[0].Position;
        BoundingBoxMax = Vertices[0].Position;

        foreach (var vertex in Vertices)
        {
            BoundingBoxMin = Vector3.Min(BoundingBoxMin, vertex.Position);
            BoundingBoxMax = Vector3.Max(BoundingBoxMax, vertex.Position);
        }
    }

    public Vector3 GetCenter()
    {
        return (BoundingBoxMin + BoundingBoxMax) * 0.5f;
    }

    public float GetSize()
    {
        return Vector3.Distance(BoundingBoxMin, BoundingBoxMax);
    }
}
