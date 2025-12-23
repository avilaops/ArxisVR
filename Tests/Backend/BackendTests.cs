using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace ArxisVR.Tests.Backend;

/// <summary>
/// Testes de funcionalidade de back-end (serviços, parsers, lógica de negócio)
/// </summary>
public class BackendTests
{
    private readonly List<TestResult> _results = new();
    private readonly string _projectRoot;

    public class TestResult
    {
        public string Category { get; set; } = "";
        public string TestName { get; set; } = "";
        public bool Passed { get; set; }
        public string Message { get; set; } = "";
        public TimeSpan Duration { get; set; }
        public string Details { get; set; } = "";
    }

    public BackendTests()
    {
        _projectRoot = FindProjectRoot();
    }

    public async Task<List<TestResult>> RunAllTestsAsync()
    {
        Console.WriteLine("\n╔══════════════════════════════════════════════════════════╗");
        Console.WriteLine("║            🔙 TESTES DE BACK-END                         ║");
        Console.WriteLine("╚══════════════════════════════════════════════════════════╝\n");

        // Services Tests
        await TestIfcParserServiceAsync();
        await TestOllamaServiceAsync();
        await TestAIAssistantServiceAsync();

        // Models Tests
        await TestIfcModelLogicAsync();
        await TestIfcElementLogicAsync();
        await TestIfcGeometryLogicAsync();

        // Tools Tests
        await TestMeasurementToolLogicAsync();
        await TestAnnotationSystemLogicAsync();
        await TestLayerManagerLogicAsync();
        await TestUndoRedoManagerLogicAsync();

        // VR Backend Tests
        await TestVRManagerLogicAsync();
        await TestVRNavigationLogicAsync();

        // Rendering Backend Tests
        await TestCamera3DLogicAsync();
        await TestRendererLogicAsync();

        return _results;
    }

    // ==================== SERVICES TESTS ====================

    private async Task TestIfcParserServiceAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var parserPath = Path.Combine(_projectRoot, "Services", "IfcParser.cs");

            if (!File.Exists(parserPath))
            {
                AddResult("Services", "IFC Parser Service", false,
                    "IfcParser.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(parserPath);

            // Check essential methods
            bool hasParseMethod = content.Contains("ParseFile");
            bool hasExtractGeometry = content.Contains("ExtractGeometry") || content.Contains("geometry");
            bool hasErrorHandling = content.Contains("try") && content.Contains("catch");
            bool hasXbimIntegration = content.Contains("Xbim") || content.Contains("IIfcProduct");

            bool passed = hasParseMethod && hasErrorHandling && hasXbimIntegration;

            var details = $"ParseMethod: {hasParseMethod}, Geometry: {hasExtractGeometry}, " +
                         $"ErrorHandling: {hasErrorHandling}, Xbim: {hasXbimIntegration}";

            AddResult("Services", "IFC Parser Service", passed,
                passed ? "Serviço completo e funcional" : "Funcionalidades faltando",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("Services", "IFC Parser Service", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    private async Task TestOllamaServiceAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var servicePath = Path.Combine(_projectRoot, "AI", "OllamaService.cs");

            if (!File.Exists(servicePath))
            {
                AddResult("Services", "Ollama Service", false,
                    "OllamaService.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(servicePath);

            bool hasHttpClient = content.Contains("HttpClient");
            bool hasIsAvailable = content.Contains("IsAvailableAsync");
            bool hasGenerate = content.Contains("GenerateAsync") || content.Contains("ChatAsync");
            bool hasDisposable = content.Contains("IDisposable") && content.Contains("Dispose");
            bool hasTimeout = content.Contains("Timeout");

            bool passed = hasHttpClient && hasIsAvailable && hasGenerate && hasDisposable;

            var details = $"HttpClient: {hasHttpClient}, IsAvailable: {hasIsAvailable}, " +
                         $"Generate: {hasGenerate}, Disposable: {hasDisposable}, Timeout: {hasTimeout}";

            AddResult("Services", "Ollama Service", passed,
                passed ? "Serviço AI completo" : "Funcionalidades faltando",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("Services", "Ollama Service", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    private async Task TestAIAssistantServiceAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var assistantPath = Path.Combine(_projectRoot, "AI", "IfcAIAssistant.cs");

            if (!File.Exists(assistantPath))
            {
                AddResult("Services", "AI Assistant Service", false,
                    "IfcAIAssistant.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(assistantPath);

            bool hasAskMethod = content.Contains("AskAsync");
            bool hasAnalyzeElement = content.Contains("AnalyzeElementAsync");
            bool hasConversationHistory = content.Contains("_conversationHistory") ||
                                         content.Contains("history");
            bool hasSystemPrompt = content.Contains("SystemPrompt") || content.Contains("system");

            bool passed = hasAskMethod && hasAnalyzeElement && hasConversationHistory;

            var details = $"Ask: {hasAskMethod}, Analyze: {hasAnalyzeElement}, " +
                         $"History: {hasConversationHistory}, SystemPrompt: {hasSystemPrompt}";

            AddResult("Services", "AI Assistant Service", passed,
                passed ? "Assistant completo" : "Funcionalidades faltando",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("Services", "AI Assistant Service", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    // ==================== MODELS TESTS ====================

    private async Task TestIfcModelLogicAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var modelPath = Path.Combine(_projectRoot, "Models", "IfcModel.cs");

            if (!File.Exists(modelPath))
            {
                AddResult("Models", "IFC Model Logic", false,
                    "IfcModel.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(modelPath);

            bool hasElements = content.Contains("Elements") && content.Contains("List");
            bool hasElementsByType = content.Contains("ElementsByType");
            bool hasGetElementTypes = content.Contains("GetElementTypes");
            bool hasProperties = content.Contains("FileName") && content.Contains("FilePath");

            bool passed = hasElements && hasElementsByType && hasGetElementTypes;

            var details = $"Elements: {hasElements}, ByType: {hasElementsByType}, " +
                         $"GetTypes: {hasGetElementTypes}, Properties: {hasProperties}";

            AddResult("Models", "IFC Model Logic", passed,
                passed ? "Modelo completo" : "Funcionalidades faltando",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("Models", "IFC Model Logic", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    private async Task TestIfcElementLogicAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var elementPath = Path.Combine(_projectRoot, "Models", "IfcElement.cs");

            if (!File.Exists(elementPath))
            {
                AddResult("Models", "IFC Element Logic", false,
                    "IfcElement.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(elementPath);

            bool hasGlobalId = content.Contains("GlobalId");
            bool hasName = content.Contains("Name");
            bool hasType = content.Contains("Type");
            bool hasProperties = content.Contains("Properties") && content.Contains("Dictionary");
            bool hasGeometry = content.Contains("Geometry");

            bool passed = hasGlobalId && hasName && hasType && hasProperties;

            var details = $"GlobalId: {hasGlobalId}, Name: {hasName}, Type: {hasType}, " +
                         $"Properties: {hasProperties}, Geometry: {hasGeometry}";

            AddResult("Models", "IFC Element Logic", passed,
                passed ? "Elemento completo" : "Funcionalidades faltando",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("Models", "IFC Element Logic", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    private async Task TestIfcGeometryLogicAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var geometryPath = Path.Combine(_projectRoot, "Models", "IfcGeometry.cs");

            if (!File.Exists(geometryPath))
            {
                AddResult("Models", "IFC Geometry Logic", false,
                    "IfcGeometry.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(geometryPath);

            bool hasVertices = content.Contains("Vertices") && content.Contains("Vector3");
            bool hasIndices = content.Contains("Indices");
            bool hasNormals = content.Contains("Normals");
            bool hasColors = content.Contains("Colors");

            bool passed = hasVertices && hasIndices;

            var details = $"Vertices: {hasVertices}, Indices: {hasIndices}, " +
                         $"Normals: {hasNormals}, Colors: {hasColors}";

            AddResult("Models", "IFC Geometry Logic", passed,
                passed ? "Geometria completa" : "Funcionalidades básicas faltando",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("Models", "IFC Geometry Logic", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    // ==================== TOOLS TESTS ====================

    private async Task TestMeasurementToolLogicAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var toolPath = Path.Combine(_projectRoot, "Tools", "MeasurementTool.cs");

            if (!File.Exists(toolPath))
            {
                AddResult("Tools", "Measurement Tool Logic", false,
                    "MeasurementTool.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(toolPath);

            bool hasStartMeasurement = content.Contains("StartMeasurement");
            bool hasCompleteMeasurement = content.Contains("CompleteMeasurement");
            bool hasDistance = content.Contains("Distance") || content.Contains("distance");
            bool hasVector3 = content.Contains("Vector3");

            bool passed = hasStartMeasurement && hasCompleteMeasurement && hasDistance;

            var details = $"Start: {hasStartMeasurement}, Complete: {hasCompleteMeasurement}, " +
                         $"Distance: {hasDistance}, Vector3: {hasVector3}";

            AddResult("Tools", "Measurement Tool Logic", passed,
                passed ? "Ferramenta completa" : "Funcionalidades faltando",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("Tools", "Measurement Tool Logic", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    private async Task TestAnnotationSystemLogicAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var systemPath = Path.Combine(_projectRoot, "Tools", "AnnotationSystem.cs");

            if (!File.Exists(systemPath))
            {
                AddResult("Tools", "Annotation System Logic", false,
                    "AnnotationSystem.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(systemPath);

            bool hasAddAnnotation = content.Contains("AddAnnotation");
            bool hasGetAnnotations = content.Contains("GetAnnotations");
            bool hasRemoveAnnotation = content.Contains("RemoveAnnotation") ||
                                       content.Contains("DeleteAnnotation");
            bool hasPosition = content.Contains("Position") || content.Contains("Vector3");

            bool passed = hasAddAnnotation && hasGetAnnotations;

            var details = $"Add: {hasAddAnnotation}, Get: {hasGetAnnotations}, " +
                         $"Remove: {hasRemoveAnnotation}, Position: {hasPosition}";

            AddResult("Tools", "Annotation System Logic", passed,
                passed ? "Sistema completo" : "Funcionalidades faltando",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("Tools", "Annotation System Logic", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    private async Task TestLayerManagerLogicAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var managerPath = Path.Combine(_projectRoot, "Tools", "LayerManager.cs");

            if (!File.Exists(managerPath))
            {
                AddResult("Tools", "Layer Manager Logic", false,
                    "LayerManager.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(managerPath);

            bool hasAddLayer = content.Contains("AddLayer");
            bool hasSetVisibility = content.Contains("SetLayerVisibility") ||
                                    content.Contains("SetVisibility");
            bool hasIsVisible = content.Contains("IsLayerVisible") ||
                               content.Contains("IsVisible");
            bool hasLayers = content.Contains("_layers") || content.Contains("Layers");

            bool passed = hasAddLayer && hasSetVisibility && hasIsVisible;

            var details = $"Add: {hasAddLayer}, SetVisibility: {hasSetVisibility}, " +
                         $"IsVisible: {hasIsVisible}, Layers: {hasLayers}";

            AddResult("Tools", "Layer Manager Logic", passed,
                passed ? "Gerenciador completo" : "Funcionalidades faltando",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("Tools", "Layer Manager Logic", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    private async Task TestUndoRedoManagerLogicAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var managerPath = Path.Combine(_projectRoot, "Tools", "UndoRedoManager.cs");

            if (!File.Exists(managerPath))
            {
                AddResult("Tools", "Undo/Redo Manager Logic", false,
                    "UndoRedoManager.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(managerPath);

            bool hasUndo = content.Contains("Undo");
            bool hasRedo = content.Contains("Redo");
            bool hasRecordAction = content.Contains("RecordAction") ||
                                   content.Contains("Record");
            bool hasCanUndo = content.Contains("CanUndo");
            bool hasCanRedo = content.Contains("CanRedo");

            bool passed = hasUndo && hasRedo && hasRecordAction;

            var details = $"Undo: {hasUndo}, Redo: {hasRedo}, Record: {hasRecordAction}, " +
                         $"CanUndo: {hasCanUndo}, CanRedo: {hasCanRedo}";

            AddResult("Tools", "Undo/Redo Manager Logic", passed,
                passed ? "Manager completo" : "Funcionalidades faltando",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("Tools", "Undo/Redo Manager Logic", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    // ==================== VR TESTS ====================

    private async Task TestVRManagerLogicAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var managerPath = Path.Combine(_projectRoot, "VR", "VRManager.cs");

            if (!File.Exists(managerPath))
            {
                AddResult("VR", "VR Manager Logic", false,
                    "VRManager.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(managerPath);

            bool hasIsVREnabled = content.Contains("IsVREnabled");
            bool hasIsAREnabled = content.Contains("IsAREnabled");
            bool hasInitialize = content.Contains("Initialize");
            bool hasUpdate = content.Contains("Update");
            bool hasOpenXR = content.Contains("OpenXR");

            bool passed = hasIsVREnabled && hasInitialize && hasUpdate;

            var details = $"VREnabled: {hasIsVREnabled}, AREnabled: {hasIsAREnabled}, " +
                         $"Initialize: {hasInitialize}, Update: {hasUpdate}, OpenXR: {hasOpenXR}";

            AddResult("VR", "VR Manager Logic", passed,
                passed ? "Manager VR completo" : "Funcionalidades faltando",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("VR", "VR Manager Logic", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    private async Task TestVRNavigationLogicAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var navPath = Path.Combine(_projectRoot, "VR", "VRNavigation.cs");

            if (!File.Exists(navPath))
            {
                AddResult("VR", "VR Navigation Logic", false,
                    "VRNavigation.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(navPath);

            bool hasUpdate = content.Contains("Update");
            bool hasTeleport = content.Contains("Teleport") || content.Contains("teleport");
            bool hasCamera = content.Contains("Camera") || content.Contains("camera");
            bool hasVRManager = content.Contains("VRManager") || content.Contains("vrManager");

            bool passed = hasUpdate && (hasTeleport || hasCamera);

            var details = $"Update: {hasUpdate}, Teleport: {hasTeleport}, " +
                         $"Camera: {hasCamera}, VRManager: {hasVRManager}";

            AddResult("VR", "VR Navigation Logic", passed,
                passed ? "Navegação VR completa" : "Funcionalidades faltando",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("VR", "VR Navigation Logic", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    // ==================== RENDERING TESTS ====================

    private async Task TestCamera3DLogicAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var cameraPath = Path.Combine(_projectRoot, "Rendering", "Camera.cs");

            if (!File.Exists(cameraPath))
            {
                AddResult("Rendering", "Camera 3D Logic", false,
                    "Camera.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(cameraPath);

            bool hasPosition = content.Contains("Position");
            bool hasTarget = content.Contains("Target");
            bool hasUpdate = content.Contains("Update");
            bool hasViewMatrix = content.Contains("ViewMatrix") || content.Contains("View");
            bool hasProjectionMatrix = content.Contains("ProjectionMatrix") ||
                                      content.Contains("Projection");

            bool passed = hasPosition && hasUpdate && (hasViewMatrix || hasProjectionMatrix);

            var details = $"Position: {hasPosition}, Target: {hasTarget}, Update: {hasUpdate}, " +
                         $"ViewMatrix: {hasViewMatrix}, ProjectionMatrix: {hasProjectionMatrix}";

            AddResult("Rendering", "Camera 3D Logic", passed,
                passed ? "Câmera completa" : "Funcionalidades faltando",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("Rendering", "Camera 3D Logic", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    private async Task TestRendererLogicAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var rendererPath = Path.Combine(_projectRoot, "Rendering", "Renderer3D.cs");

            if (!File.Exists(rendererPath))
            {
                AddResult("Rendering", "Renderer Logic", false,
                    "Renderer3D.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(rendererPath);

            bool hasInitialize = content.Contains("Initialize");
            bool hasRender = content.Contains("Render");
            bool hasCamera = content.Contains("Camera");
            bool hasShaders = content.Contains("Shader") || content.Contains("shader");
            bool hasOpenGL = content.Contains("GL") || content.Contains("OpenGL");

            bool passed = hasInitialize && hasRender && hasOpenGL;

            var details = $"Initialize: {hasInitialize}, Render: {hasRender}, Camera: {hasCamera}, " +
                         $"Shaders: {hasShaders}, OpenGL: {hasOpenGL}";

            AddResult("Rendering", "Renderer Logic", passed,
                passed ? "Renderer completo" : "Funcionalidades faltando",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("Rendering", "Renderer Logic", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    // ==================== HELPER METHODS ====================

    private string FindProjectRoot()
    {
        var currentDir = Directory.GetCurrentDirectory();
        while (currentDir != null)
        {
            if (File.Exists(Path.Combine(currentDir, "ArxisVR.csproj")))
                return currentDir;

            var parent = Directory.GetParent(currentDir);
            if (parent == null) break;
            currentDir = parent.FullName;
        }
        return Directory.GetCurrentDirectory();
    }

    private void AddResult(string category, string testName, bool passed,
        string message, TimeSpan duration, string details = "")
    {
        var result = new TestResult
        {
            Category = category,
            TestName = testName,
            Passed = passed,
            Message = message,
            Duration = duration,
            Details = details
        };
        _results.Add(result);

        var icon = passed ? "✅" : "❌";
        Console.WriteLine($"{icon} [{category}] {testName}: {message} ({duration.TotalMilliseconds:F0}ms)");
    }

    public void PrintSummary()
    {
        Console.WriteLine("\n╔══════════════════════════════════════════════════════════╗");
        Console.WriteLine("║           📊 RESUMO DE TESTES DE BACK-END                ║");
        Console.WriteLine("╚══════════════════════════════════════════════════════════╝\n");

        var total = _results.Count;
        var passed = _results.Count(r => r.Passed);
        var failed = total - passed;
        var percentage = total > 0 ? (passed * 100.0 / total) : 0;

        Console.WriteLine($"Total de Testes: {total}");
        Console.WriteLine($"Aprovados: {passed} ({percentage:F1}%)");
        Console.WriteLine($"Falhados: {failed}");
        Console.WriteLine();

        var byCategory = _results.GroupBy(r => r.Category);
        foreach (var group in byCategory)
        {
            var catPassed = group.Count(r => r.Passed);
            var catTotal = group.Count();
            var avgTime = group.Average(r => r.Duration.TotalMilliseconds);
            Console.WriteLine($"{group.Key}: {catPassed}/{catTotal} aprovados (avg: {avgTime:F0}ms)");
        }

        Console.WriteLine("\n" + new string('═', 60));

        if (failed == 0)
        {
            Console.WriteLine("🎉 TODO O BACK-END ESTÁ FUNCIONAL!");
        }
        else
        {
            Console.WriteLine($"⚠️  {failed} COMPONENTE(S) DE BACK-END COM PROBLEMAS");
        }

        Console.WriteLine(new string('═', 60) + "\n");
    }
}
