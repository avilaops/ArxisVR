using ArxisVR.Application;
using ArxisVR.Services;
using System.Diagnostics;

namespace ArxisVR.Testing;

/// <summary>
/// Test script to load all CAD files from project root
/// </summary>
public class FileLoadTester
{
    public static async Task TestAllFilesAsync()
    {
        var projectRoot = Directory.GetCurrentDirectory();
        Console.WriteLine($"📁 Project Root: {projectRoot}");
        Console.WriteLine();

        // Find all supported files
        var ifcFiles = Directory.GetFiles(projectRoot, "*.ifc");
        var bscollabFiles = Directory.GetFiles(projectRoot, "*.bscollab");
        var dwgFiles = Directory.GetFiles(projectRoot, "*.dwg", SearchOption.TopDirectoryOnly);

        Console.WriteLine("=== FOUND FILES ===");
        Console.WriteLine($"IFC Files: {ifcFiles.Length}");
        foreach (var file in ifcFiles)
            Console.WriteLine($"  • {Path.GetFileName(file)}");

        Console.WriteLine($"\nBsCollab Files: {bscollabFiles.Length}");
        foreach (var file in bscollabFiles)
            Console.WriteLine($"  • {Path.GetFileName(file)}");

        Console.WriteLine($"\nDWG Files: {dwgFiles.Length}");
        foreach (var file in dwgFiles)
            Console.WriteLine($"  • {Path.GetFileName(file)}");

        Console.WriteLine("\n=== TESTING FILES ===\n");

        // Test IFC files
        var ifcParser = new IfcParser();
        foreach (var file in ifcFiles)
        {
            await TestFile(file, ifcParser);
        }

        // Test BsCollab files
        var bscollabParser = new BsCollabParser(ifcParser);
        foreach (var file in bscollabFiles)
        {
            await TestBsCollabFile(file, bscollabParser);
        }

        // Test DWG files
        var dwgParser = new DwgParser();
        foreach (var file in dwgFiles)
        {
            await TestDwgFile(file, dwgParser);
        }

        Console.WriteLine("\n=== TEST COMPLETE ===");
    }

    private static async Task TestFile(string filePath, IfcParser parser)
    {
        Console.WriteLine($"🔍 Testing: {Path.GetFileName(filePath)}");
        var sw = Stopwatch.StartNew();

        try
        {
            var model = await parser.ParseFileAsync(filePath);
            sw.Stop();

            if (model != null && model.Elements.Count > 0)
            {
                Console.WriteLine($"   ✅ SUCCESS - Loaded in {sw.ElapsedMilliseconds}ms");
                Console.WriteLine($"   📊 Elements: {model.Elements.Count}");
                Console.WriteLine($"   📏 Model Size: {model.ModelSize:F2}m");

                var types = model.GetElementTypes();
                Console.WriteLine($"   🏗️  Element Types: {types.Count}");
                foreach (var type in types.Take(5))
                {
                    var count = model.ElementsByType[type].Count;
                    Console.WriteLine($"      • {type}: {count}");
                }
                if (types.Count > 5)
                    Console.WriteLine($"      • ... and {types.Count - 5} more types");
            }
            else
            {
                Console.WriteLine($"   ❌ FAILED - Model is null or empty");
            }
        }
        catch (Exception ex)
        {
            sw.Stop();
            Console.WriteLine($"   ❌ ERROR - {ex.Message}");
        }

        Console.WriteLine();
    }

    private static async Task TestBsCollabFile(string filePath, BsCollabParser parser)
    {
        Console.WriteLine($"📦 Testing BsCollab: {Path.GetFileName(filePath)}");
        var sw = Stopwatch.StartNew();

        try
        {
            var model = await parser.ParseFileAsync(filePath);
            sw.Stop();

            if (model != null && model.Elements.Count > 0)
            {
                Console.WriteLine($"   ✅ SUCCESS - Loaded in {sw.ElapsedMilliseconds}ms");
                Console.WriteLine($"   📊 Elements: {model.Elements.Count}");

                // Show BsCollab metadata
                if (model.Properties.ContainsKey("CollaborationGlobalId"))
                    Console.WriteLine($"   🌐 Global ID: {model.Properties["CollaborationGlobalId"]}");
                if (model.Properties.ContainsKey("Application"))
                    Console.WriteLine($"   🏢 Application: {model.Properties["Application"]}");
            }
            else
            {
                Console.WriteLine($"   ❌ FAILED - Model is null or empty");
            }
        }
        catch (Exception ex)
        {
            sw.Stop();
            Console.WriteLine($"   ❌ ERROR - {ex.Message}");
        }

        Console.WriteLine();
    }

    private static async Task TestDwgFile(string filePath, DwgParser parser)
    {
        Console.WriteLine($"📐 Testing DWG: {Path.GetFileName(filePath)}");
        var sw = Stopwatch.StartNew();

        try
        {
            var model = await parser.ParseFileAsync(filePath);
            sw.Stop();

            if (model != null && model.Elements.Count > 0)
            {
                Console.WriteLine($"   ⚠️  PLACEHOLDER - Parser in development");
                Console.WriteLine($"   ⏱️  Parsed in {sw.ElapsedMilliseconds}ms");
                Console.WriteLine($"   📊 Elements: {model.Elements.Count} (placeholder)");
                Console.WriteLine($"   💡 Full DWG support requires ACadSharp library");
            }
            else
            {
                Console.WriteLine($"   ❌ FAILED - Model is null or empty");
            }
        }
        catch (Exception ex)
        {
            sw.Stop();
            Console.WriteLine($"   ❌ ERROR - {ex.Message}");
        }

        Console.WriteLine();
    }
}
