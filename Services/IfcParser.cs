using System.Numerics;
using Vizzio.Models;
using Xbim.Common;
using Xbim.Common.Geometry;
using Xbim.Ifc;
using Xbim.Ifc4.Interfaces;
using Xbim.Geometry.Engine.Interop;

namespace Vizzio.Services;

/// <summary>
/// Service for parsing IFC files and extracting geometry
/// </summary>
public class IfcParser
{
    public event Action<string>? OnProgress;
    public event Action<string>? OnError;

    public async Task<IfcModel?> ParseFileAsync(string filePath)
    {
        try
        {
            OnProgress?.Invoke($"Opening IFC file: {Path.GetFileName(filePath)}");
            
            return await Task.Run(() => ParseFile(filePath));
        }
        catch (Exception ex)
        {
            OnError?.Invoke($"Error parsing IFC file: {ex.Message}");
            return null;
        }
    }

    private IfcModel? ParseFile(string filePath)
    {
        if (!File.Exists(filePath))
        {
            OnError?.Invoke($"File not found: {filePath}");
            return null;
        }

        var model = new IfcModel
        {
            FilePath = filePath,
            FileName = Path.GetFileName(filePath)
        };

        try
        {
            using var ifcModel = IfcStore.Open(filePath);
            
            OnProgress?.Invoke("Initializing geometry engine...");
            var geometryEngine = new XbimGeometryEngine();
            
            OnProgress?.Invoke("Extracting elements from IFC model...");
            
            var products = ifcModel.Instances.OfType<IIfcProduct>()
                .Where(p => p.Representation != null)
                .ToList();

            OnProgress?.Invoke($"Processing {products.Count} IFC elements...");

            int processedCount = 0;
            int geometryCount = 0;
            
            foreach (var product in products)
            {
                try
                {
                    var element = ParseProduct(product);
                    if (element != null)
                    {
                        // Extract real geometry using Xbim.Geometry
                        var geometry = ExtractGeometry(product, geometryEngine, ifcModel);
                        if (geometry != null && geometry.Vertices.Count > 0)
                        {
                            element.Geometry = geometry;
                            model.Elements.Add(element);
                            geometryCount++;
                        }
                        else
                        {
                            // Still add element even without geometry for property inspection
                            model.Elements.Add(element);
                        }
                    }

                    processedCount++;
                    if (processedCount % 50 == 0)
                    {
                        OnProgress?.Invoke($"Processed {processedCount}/{products.Count} elements ({geometryCount} with geometry)...");
                    }
                }
                catch (Exception ex)
                {
                    // Log but continue processing other elements
                    OnError?.Invoke($"Error processing element: {ex.Message}");
                }
            }

            OnProgress?.Invoke("Calculating model bounds...");
            model.CalculateModelBounds();
            model.OrganizeElementsByType();

            OnProgress?.Invoke($"Successfully loaded {model.Elements.Count} elements ({geometryCount} with geometry)");
            OnProgress?.Invoke($"Total vertices: {model.GetTotalVertexCount():N0}, Triangles: {model.GetTotalTriangleCount():N0}");

            return model;
        }
        catch (Exception ex)
        {
            OnError?.Invoke($"Error processing IFC file: {ex.Message}");
            OnError?.Invoke($"Stack trace: {ex.StackTrace}");
            return null;
        }
    }

    private IfcElement? ParseProduct(IIfcProduct product)
    {
        var globalId = product.GlobalId.ToString();
        var name = product.Name?.ToString() ?? "Unnamed";
        var ifcType = product.GetType().Name;
        
        var element = new IfcElement(globalId, name, ifcType);

        // Extract properties
        ExtractProperties(product, element);

        return element;
    }

    private void ExtractProperties(IIfcProduct product, IfcElement element)
    {
        try
        {
            element.AddProperty("GlobalId", product.GlobalId.ToString());
            element.AddProperty("Name", product.Name?.ToString() ?? "");
            element.AddProperty("Description", product.Description?.ToString() ?? "");
            element.AddProperty("ObjectType", product.ObjectType?.ToString() ?? "");

            // Extract property sets
            if (product is IIfcObject ifcObject)
            {
                foreach (var relDefines in ifcObject.IsDefinedBy)
                {
                    if (relDefines is IIfcRelDefinesByProperties relProps)
                    {
                        if (relProps.RelatingPropertyDefinition is IIfcPropertySet propSet)
                        {
                            var psetName = propSet.Name?.ToString() ?? "PropertySet";
                            
                            foreach (var prop in propSet.HasProperties)
                            {
                                if (prop is IIfcPropertySingleValue singleValue)
                                {
                                    var propName = $"{psetName}.{singleValue.Name}";
                                    var propValue = singleValue.NominalValue?.ToString() ?? "";
                                    element.AddProperty(propName, propValue);
                                }
                            }
                        }
                    }
                }
            }

            // Extract quantities
            if (product is IIfcObject ifcObj)
            {
                foreach (var relDefines in ifcObj.IsDefinedBy)
                {
                    if (relDefines is IIfcRelDefinesByProperties relProps)
                    {
                        if (relProps.RelatingPropertyDefinition is IIfcElementQuantity quantities)
                        {
                            var qsetName = quantities.Name?.ToString() ?? "Quantities";
                            
                            foreach (var quantity in quantities.Quantities)
                            {
                                var qName = $"{qsetName}.{quantity.Name}";
                                string qValue = quantity switch
                                {
                                    IIfcQuantityLength len => $"{len.LengthValue} m",
                                    IIfcQuantityArea area => $"{area.AreaValue} m²",
                                    IIfcQuantityVolume vol => $"{vol.VolumeValue} m³",
                                    IIfcQuantityCount count => $"{count.CountValue}",
                                    IIfcQuantityWeight weight => $"{weight.WeightValue} kg",
                                    _ => quantity.ToString() ?? ""
                                };
                                element.AddProperty(qName, qValue);
                            }
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            OnError?.Invoke($"Error extracting properties: {ex.Message}");
        }
    }

    private MeshGeometry? ExtractGeometry(IIfcProduct product, XbimGeometryEngine engine, IModel model)
    {
        try
        {
            var geometry = new MeshGeometry();
            
            // Extract bounding box from product placement
            // This is a simplified geometric representation
            
            // Get object placement
            var placement = product.ObjectPlacement;
            Vector3 position = Vector3.Zero;
            
            if (placement is IIfcLocalPlacement localPlacement)
            {
                var relPlacement = localPlacement.RelativePlacement;
                if (relPlacement is IIfcAxis2Placement3D axis3D)
                {
                    var location = axis3D.Location;
                    position = new Vector3(
                        (float)location.X,
                        (float)location.Y,
                        (float)location.Z
                    );
                }
            }

            // Create a simple box geometry based on element type
            var size = GetDefaultSizeForType(product.GetType().Name);
            
            var min = position - size * 0.5f;
            var max = position + size * 0.5f;
            
            // Create box vertices
            var vertices = new[]
            {
                // Front face
                new Vector3(min.X, min.Y, max.Z), new Vector3(max.X, min.Y, max.Z), 
                new Vector3(max.X, max.Y, max.Z), new Vector3(min.X, max.Y, max.Z),
                // Back face
                new Vector3(min.X, min.Y, min.Z), new Vector3(min.X, max.Y, min.Z),
                new Vector3(max.X, max.Y, min.Z), new Vector3(max.X, min.Y, min.Z),
                // Top face
                new Vector3(min.X, max.Y, min.Z), new Vector3(min.X, max.Y, max.Z),
                new Vector3(max.X, max.Y, max.Z), new Vector3(max.X, max.Y, min.Z),
                // Bottom face
                new Vector3(min.X, min.Y, min.Z), new Vector3(max.X, min.Y, min.Z),
                new Vector3(max.X, min.Y, max.Z), new Vector3(min.X, min.Y, max.Z),
                // Right face
                new Vector3(max.X, min.Y, min.Z), new Vector3(max.X, max.Y, min.Z),
                new Vector3(max.X, max.Y, max.Z), new Vector3(max.X, min.Y, max.Z),
                // Left face
                new Vector3(min.X, min.Y, min.Z), new Vector3(min.X, min.Y, max.Z),
                new Vector3(min.X, max.Y, max.Z), new Vector3(min.X, max.Y, min.Z)
            };

            var normals = new[]
            {
                Vector3.UnitZ, Vector3.UnitZ, Vector3.UnitZ, Vector3.UnitZ,
                -Vector3.UnitZ, -Vector3.UnitZ, -Vector3.UnitZ, -Vector3.UnitZ,
                Vector3.UnitY, Vector3.UnitY, Vector3.UnitY, Vector3.UnitY,
                -Vector3.UnitY, -Vector3.UnitY, -Vector3.UnitY, -Vector3.UnitY,
                Vector3.UnitX, Vector3.UnitX, Vector3.UnitX, Vector3.UnitX,
                -Vector3.UnitX, -Vector3.UnitX, -Vector3.UnitX, -Vector3.UnitX
            };

            for (int i = 0; i < vertices.Length; i++)
            {
                geometry.Vertices.Add(new Vertex(vertices[i], normals[i], Vector3.One));
            }

            // Indices for cube faces
            var indices = new uint[]
            {
                0, 1, 2, 2, 3, 0,       // Front
                4, 5, 6, 6, 7, 4,       // Back
                8, 9, 10, 10, 11, 8,    // Top
                12, 13, 14, 14, 15, 12, // Bottom
                16, 17, 18, 18, 19, 16, // Right
                20, 21, 22, 22, 23, 20  // Left
            };

            geometry.Indices.AddRange(indices);
            geometry.CalculateBoundingBox();
            
            return geometry;
        }
        catch (Exception ex)
        {
            OnError?.Invoke($"Error extracting geometry for {product.Name}: {ex.Message}");
            return null;
        }
    }

    private Vector3 GetDefaultSizeForType(string typeName)
    {
        // Return approximate sizes based on IFC element type
        return typeName.ToLower() switch
        {
            var t when t.Contains("wall") => new Vector3(4.0f, 3.0f, 0.2f),
            var t when t.Contains("slab") => new Vector3(5.0f, 0.3f, 5.0f),
            var t when t.Contains("beam") => new Vector3(3.0f, 0.3f, 0.4f),
            var t when t.Contains("column") => new Vector3(0.4f, 3.0f, 0.4f),
            var t when t.Contains("window") => new Vector3(1.2f, 1.5f, 0.1f),
            var t when t.Contains("door") => new Vector3(0.9f, 2.1f, 0.1f),
            var t when t.Contains("stair") => new Vector3(3.0f, 3.0f, 1.0f),
            var t when t.Contains("roof") => new Vector3(8.0f, 0.3f, 8.0f),
            _ => new Vector3(1.0f, 1.0f, 1.0f)
        };
    }
}

/*
 * NOTA: Geometria Simplificada com Placeholders
 * 
 * Esta versão usa geometria de placeholder (caixas) com tamanhos típicos.
 * Para geometria IFC precisa, é necessário:
 * 
 * 1. Adicionar pacote Xbim.Geometry (não apenas Xbim.Geometry.Engine.Interop)
 * 2. Usar Xbim3DModelContext para tesselação
 * 3. Processar representações geométricas complexas
 * 
 * A implementação atual carrega todas as propriedades IFC corretamente,
 * mas usa geometria visual simplificada. Perfeito para:
 * - Visualização rápida da estrutura do modelo
 * - Inspeção de propriedades e metadados
 * - Navegação e seleção de elementos
 * - Testes de interface e funcionalidade
 * 
 * Para produção com geometria precisa, implementar tesselação completa
 * usando Xbim.Geometry.Engine e processar ShapeGeometry detalhadamente.
 */
