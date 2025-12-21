using Vizzio.AI;

namespace Vizzio.Examples;

/// <summary>
/// Examples of using the AI Assistant
/// </summary>
public static class AIExamples
{
    /// <summary>
    /// Example 1: Basic chat with AI
    /// </summary>
    public static async Task BasicChatExampleAsync()
    {
        Console.WriteLine("=== Example 1: Basic Chat ===\n");
        
        var config = AIConfig.LoadFromEnvironment();
        using var ollama = new OllamaService(config);
        
        if (!await ollama.IsAvailableAsync())
        {
            Console.WriteLine("❌ Ollama not available. Run: ollama serve");
            return;
        }
        
        var assistant = new IfcAIAssistant(ollama);
        
        // Ask questions
        var questions = new[]
        {
            "What is an IFC file?",
            "How do I use VR mode in VIZZIO?",
            "What are the best practices for viewing large models?"
        };
        
        foreach (var question in questions)
        {
            Console.WriteLine($"Q: {question}");
            var answer = await assistant.AskAsync(question);
            Console.WriteLine($"A: {answer}\n");
        }
    }

    /// <summary>
    /// Example 2: Element analysis
    /// </summary>
    public static async Task ElementAnalysisExampleAsync()
    {
        Console.WriteLine("=== Example 2: Element Analysis ===\n");
        
        var config = AIConfig.LoadFromEnvironment();
        using var ollama = new OllamaService(config);
        
        if (!await ollama.IsAvailableAsync())
        {
            Console.WriteLine("❌ Ollama not available. Run: ollama serve");
            return;
        }
        
        var assistant = new IfcAIAssistant(ollama);
        
        // Analyze a wall element
        var wallProperties = new Dictionary<string, string>
        {
            ["Type"] = "IfcWall",
            ["Name"] = "External Wall - North",
            ["Height"] = "3.0m",
            ["Thickness"] = "0.3m",
            ["Material"] = "Reinforced Concrete",
            ["Fire Rating"] = "REI 120",
            ["Thermal Transmittance"] = "0.25 W/m²K"
        };
        
        Console.WriteLine("Analyzing wall element...");
        var analysis = await assistant.AnalyzeElementAsync("Wall", wallProperties);
        Console.WriteLine($"\nAnalysis:\n{analysis}\n");
    }

    /// <summary>
    /// Example 3: Streaming responses
    /// </summary>
    public static async Task StreamingExampleAsync()
    {
        Console.WriteLine("=== Example 3: Streaming Response ===\n");
        
        var config = AIConfig.LoadFromEnvironment();
        using var ollama = new OllamaService(config);
        
        if (!await ollama.IsAvailableAsync())
        {
            Console.WriteLine("❌ Ollama not available. Run: ollama serve");
            return;
        }
        
        Console.WriteLine("Q: Explain BIM and its benefits\n");
        Console.Write("A: ");
        
        await foreach (var chunk in ollama.GenerateStreamAsync("Explain BIM (Building Information Modeling) and its main benefits in construction. Keep it under 100 words."))
        {
            Console.Write(chunk);
        }
        
        Console.WriteLine("\n");
    }

    /// <summary>
    /// Example 4: Contextual suggestions
    /// </summary>
    public static async Task ContextualSuggestionsExampleAsync()
    {
        Console.WriteLine("=== Example 4: Contextual Suggestions ===\n");
        
        var config = AIConfig.LoadFromEnvironment();
        using var ollama = new OllamaService(config);
        
        if (!await ollama.IsAvailableAsync())
        {
            Console.WriteLine("❌ Ollama not available. Run: ollama serve");
            return;
        }
        
        var assistant = new IfcAIAssistant(ollama);
        
        var contexts = new[]
        {
            "User just opened a large IFC model with 50,000 elements",
            "User is having trouble navigating the 3D view",
            "User wants to measure distances between elements"
        };
        
        foreach (var context in contexts)
        {
            Console.WriteLine($"Context: {context}");
            var suggestions = await assistant.GetSuggestionsAsync(context);
            
            Console.WriteLine("Suggestions:");
            foreach (var suggestion in suggestions)
            {
                Console.WriteLine($"  💡 {suggestion}");
            }
            Console.WriteLine();
        }
    }

    /// <summary>
    /// Example 5: Feature help
    /// </summary>
    public static async Task FeatureHelpExampleAsync()
    {
        Console.WriteLine("=== Example 5: Feature Help ===\n");
        
        var config = AIConfig.LoadFromEnvironment();
        using var ollama = new OllamaService(config);
        
        if (!await ollama.IsAvailableAsync())
        {
            Console.WriteLine("❌ Ollama not available. Run: ollama serve");
            return;
        }
        
        var assistant = new IfcAIAssistant(ollama);
        
        var features = new[] { "VR Mode", "Layer Manager", "Measurement Tool", "Annotation System" };
        
        foreach (var feature in features)
        {
            Console.WriteLine($"Feature: {feature}");
            var help = await assistant.GetFeatureHelpAsync(feature);
            Console.WriteLine($"{help}\n");
        }
    }

    /// <summary>
    /// Example 6: Model comparison
    /// </summary>
    public static async Task ListAvailableModelsExampleAsync()
    {
        Console.WriteLine("=== Example 6: Available Models ===\n");
        
        var config = AIConfig.LoadFromEnvironment();
        using var ollama = new OllamaService(config);
        
        if (!await ollama.IsAvailableAsync())
        {
            Console.WriteLine("❌ Ollama not available. Run: ollama serve");
            return;
        }
        
        Console.WriteLine("Checking available models...\n");
        var models = await ollama.GetAvailableModelsAsync();
        
        if (models.Count == 0)
        {
            Console.WriteLine("No models installed!");
            Console.WriteLine("Run: ollama pull llama3.2:3b");
        }
        else
        {
            Console.WriteLine($"Found {models.Count} model(s):\n");
            foreach (var model in models)
            {
                var current = model == config.OllamaModel ? " (current)" : "";
                Console.WriteLine($"  📦 {model}{current}");
            }
        }
        
        Console.WriteLine($"\nCurrent configuration:");
        Console.WriteLine($"  Base URL: {config.OllamaBaseUrl}");
        Console.WriteLine($"  Model: {config.OllamaModel}");
        Console.WriteLine($"  Max Tokens: {config.MaxTokens}");
        Console.WriteLine($"  Temperature: {config.Temperature}");
    }

    /// <summary>
    /// Run all examples
    /// </summary>
    public static async Task RunAllExamplesAsync()
    {
        Console.WriteLine("╔════════════════════════════════════════════════╗");
        Console.WriteLine("║      VIZZIO AI Assistant - Examples            ║");
        Console.WriteLine("╚════════════════════════════════════════════════╝");
        Console.WriteLine();

        try
        {
            await ListAvailableModelsExampleAsync();
            await Task.Delay(2000);
            
            await BasicChatExampleAsync();
            await Task.Delay(2000);
            
            await ElementAnalysisExampleAsync();
            await Task.Delay(2000);
            
            await StreamingExampleAsync();
            await Task.Delay(2000);
            
            await ContextualSuggestionsExampleAsync();
            await Task.Delay(2000);
            
            await FeatureHelpExampleAsync();
            
            Console.WriteLine("╔════════════════════════════════════════════════╗");
            Console.WriteLine("║         All examples completed! ✅             ║");
            Console.WriteLine("╚════════════════════════════════════════════════╝");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"\n❌ Error running examples: {ex.Message}");
            Console.WriteLine(ex.StackTrace);
        }
    }
}
