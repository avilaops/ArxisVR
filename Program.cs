using Vizzio.Application;
using Vizzio.AI;

// Load environment variables
DotNetEnv.Env.Load();

Console.WriteLine("=== VIZZIO - IFC Viewer with 3D Visualization and VR/AR Support ===");
Console.WriteLine("Initializing application...");
Console.WriteLine();

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

    var viewer = new IfcViewer();
    
    // Pass AI assistant to viewer (NEW!)
    if (assistant != null)
    {
        viewer.SetAIAssistant(assistant);
    }
    
    // Subscribe to status messages
    viewer.OnStatusMessage += (message) =>
    {
        Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] {message}");
    };

    // Subscribe to model loaded event
    viewer.OnModelLoaded += async (model) =>
    {
        Console.WriteLine($"\n=== Model Statistics ===");
        Console.WriteLine($"File: {model.FileName}");
        Console.WriteLine($"Elements: {model.Elements.Count}");
        Console.WriteLine($"Element Types: {model.GetElementTypes().Count}");
        
        Console.WriteLine("\nElement Types:");
        foreach (var type in model.GetElementTypes().OrderBy(t => t))
        {
            var count = model.ElementsByType[type].Count;
            Console.WriteLine($"  {type}: {count}");
        }
        
        // AI analysis if available
        if (assistant != null)
        {
            Console.WriteLine("\n🤖 AI Analysis:");
            try
            {
                var suggestions = await assistant.GetSuggestionsAsync(
                    $"User loaded an IFC model with {model.Elements.Count} elements");
                foreach (var suggestion in suggestions)
                {
                    Console.WriteLine($"  💡 {suggestion}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"  ⚠️  AI analysis failed: {ex.Message}");
            }
        }
        
        Console.WriteLine();
    };

    Console.WriteLine("Starting viewer window...");
    Console.WriteLine("Press F1 in the viewer window for controls help.\n");
    
    viewer.Run();
}
catch (Exception ex)
{
    Console.WriteLine($"\nERROR: {ex.Message}");
    Console.WriteLine(ex.StackTrace);
    Console.WriteLine("\nPress any key to exit...");
    Console.ReadKey();
}
