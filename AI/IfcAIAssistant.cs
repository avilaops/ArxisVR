namespace Vizzio.AI;

/// <summary>
/// AI Assistant for IFC viewer - provides context-aware help and analysis
/// </summary>
public class IfcAIAssistant
{
    private readonly OllamaService _ollama;
    private readonly List<ChatMessage> _conversationHistory;
    private const string SystemPrompt = @"You are an expert AI assistant for an IFC (Industry Foundation Classes) 3D viewer application called VIZZIO.

You help users with:
- Understanding IFC models and BIM concepts
- Navigating and using the 3D viewer
- Analyzing building elements and properties
- Measuring and annotating models
- VR mode and visualization features
- Layer management and element selection
- Troubleshooting common issues

Keep your responses concise, practical, and focused on helping users accomplish their tasks.
When discussing technical details, explain them in a way that's accessible to both beginners and professionals.";

    public IfcAIAssistant(OllamaService ollamaService)
    {
        _ollama = ollamaService ?? throw new ArgumentNullException(nameof(ollamaService));
        _conversationHistory = new List<ChatMessage>
        {
            ChatMessage.System(SystemPrompt)
        };
    }

    /// <summary>
    /// Ask a question to the AI assistant
    /// </summary>
    public async Task<string> AskAsync(string question, CancellationToken cancellationToken = default)
    {
        _conversationHistory.Add(ChatMessage.User(question));

        var response = await _ollama.ChatAsync(_conversationHistory, cancellationToken);
        
        _conversationHistory.Add(ChatMessage.Assistant(response));

        // Keep conversation history manageable (last 10 exchanges)
        if (_conversationHistory.Count > 21) // 1 system + 10 exchanges (20 messages)
        {
            var toRemove = _conversationHistory.Count - 21;
            _conversationHistory.RemoveRange(1, toRemove); // Keep system message
        }

        return response;
    }

    /// <summary>
    /// Analyze IFC element properties and provide insights
    /// </summary>
    public async Task<string> AnalyzeElementAsync(
        string elementType, 
        Dictionary<string, string> properties,
        CancellationToken cancellationToken = default)
    {
        var propertiesText = string.Join("\n", properties.Select(p => $"- {p.Key}: {p.Value}"));
        
        var prompt = $@"Analyze this IFC element:

Type: {elementType}

Properties:
{propertiesText}

Provide a brief analysis covering:
1. What this element represents
2. Key properties and their significance
3. Any notable characteristics or potential issues";

        return await _ollama.GenerateAsync(prompt, cancellationToken);
    }

    /// <summary>
    /// Get help with a specific feature
    /// </summary>
    public async Task<string> GetFeatureHelpAsync(
        string featureName, 
        CancellationToken cancellationToken = default)
    {
        var prompt = $"Explain how to use the '{featureName}' feature in the VIZZIO IFC viewer. Keep it practical and step-by-step.";
        return await _ollama.GenerateAsync(prompt, cancellationToken);
    }

    /// <summary>
    /// Generate suggestions based on current context
    /// </summary>
    public async Task<List<string>> GetSuggestionsAsync(
        string context,
        CancellationToken cancellationToken = default)
    {
        var prompt = $@"Based on this context: '{context}'

Suggest 3-5 helpful next actions or tips for the user. 
Format each suggestion as a single line starting with '- '.
Be specific and actionable.";

        var response = await _ollama.GenerateAsync(prompt, cancellationToken);
        
        return response
            .Split('\n')
            .Where(line => line.Trim().StartsWith('-'))
            .Select(line => line.Trim().TrimStart('-').Trim())
            .ToList();
    }

    /// <summary>
    /// Clear conversation history
    /// </summary>
    public void ClearHistory()
    {
        _conversationHistory.Clear();
        _conversationHistory.Add(ChatMessage.System(SystemPrompt));
    }

    /// <summary>
    /// Get conversation history
    /// </summary>
    public IReadOnlyList<ChatMessage> GetHistory() => _conversationHistory.AsReadOnly();
}
