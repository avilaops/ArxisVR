using System.Numerics;

namespace ArxisVR.Models;

/// <summary>
/// Represents an IFC model with all its elements
/// </summary>
public class IfcModel
{
    public string FilePath { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public List<IfcElement> Elements { get; set; } = new();
    public Vector3 ModelCenter { get; set; }
    public float ModelSize { get; set; }
    public Dictionary<string, List<IfcElement>> ElementsByType { get; set; } = new();
    public Dictionary<string, string> Properties { get; set; } = new();

    public void CalculateModelBounds()
    {
        if (Elements.Count == 0)
            return;

        var allVertices = new List<Vector3>();

        foreach (var element in Elements)
        {
            if (element.Geometry != null)
            {
                foreach (var vertex in element.Geometry.Vertices)
                {
                    allVertices.Add(vertex.Position);
                }
            }
        }

        if (allVertices.Count == 0)
            return;

        var min = allVertices[0];
        var max = allVertices[0];

        foreach (var vertex in allVertices)
        {
            min = Vector3.Min(min, vertex);
            max = Vector3.Max(max, vertex);
        }

        ModelCenter = (min + max) * 0.5f;
        ModelSize = Vector3.Distance(min, max);
    }

    public void OrganizeElementsByType()
    {
        ElementsByType.Clear();

        foreach (var element in Elements)
        {
            if (!ElementsByType.ContainsKey(element.IfcType))
            {
                ElementsByType[element.IfcType] = new List<IfcElement>();
            }
            ElementsByType[element.IfcType].Add(element);
        }
    }

    public List<string> GetElementTypes()
    {
        return ElementsByType.Keys.ToList();
    }

    public int GetTotalVertexCount()
    {
        return Elements
            .Where(e => e.Geometry != null)
            .Sum(e => e.Geometry!.Vertices.Count);
    }

    public int GetTotalTriangleCount()
    {
        return Elements
            .Where(e => e.Geometry != null)
            .Sum(e => e.Geometry!.Indices.Count / 3);
    }
}
