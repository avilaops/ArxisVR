using ArxisVR.Application;
using ArxisVR.AI;
using ArxisVR.Testing;

// Load environment variables
DotNetEnv.Env.Load();

Console.WriteLine("=== ArxisVR - IFC Viewer with 3D Visualization and VR/AR Support ===");
Console.WriteLine("Initializing application...");
Console.WriteLine();

// Test mode: Check if user wants to test file loading
if (args.Length > 0 && args[0] == "--test-files")
{
    Console.WriteLine("🧪 TEST MODE: Testing all CAD files in project root");
    Console.WriteLine();
    await FileLoadTester.TestAllFilesAsync();
    Console.WriteLine("\nPress any key to start viewer...");
    Console.ReadKey();
}

try
{
    // Initialize AI if Ollama is available
    var aiConfig = AIConfig.LoadFromEnvironment();
    using var ollama = new OllamaService(aiConfig);

    IfcAIAssistant? assistant = null;

    Console.WriteLine("Checking AI availability...");
    if (await ollama.IsAvailableAsync())
    {
        Console.WriteLine("✅ AI Assistant (Ollama) is available!");
        var models = await ollama.GetAvailableModelsAsync();
        Console.WriteLine($"📦 Available models: {string.Join(", ", models)}");
        Console.WriteLine($"🤖 Using model: {aiConfig.OllamaModel}");

        assistant = new IfcAIAssistant(ollama);
        Console.WriteLine("💡 Type 'help ai' in the console for AI commands.\n");
    }
    else
    {
        Console.WriteLine("⚠️  AI Assistant not available. Run 'ollama serve' to enable it.");
        Console.WriteLine("   See docs/OLLAMA_SETUP.md for setup instructions.\n");
    }

    Console.WriteLine("Starting viewer window...");
    Console.WriteLine("Press F1 in the viewer window for controls help.\n");

    var viewer = new SimpleIfcViewer();
    if (assistant != null)
    {
        viewer.SetAssistant(assistant);
    }
    viewer.Run();
}
catch (Exception ex)
{
    Console.WriteLine($"\nERROR: {ex.Message}");
    Console.WriteLine(ex.StackTrace);
    Console.WriteLine("\nPress any key to exit...");
    Console.ReadKey();
}
