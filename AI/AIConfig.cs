namespace Vizzio.AI;

/// <summary>
/// Configuration for AI services
/// </summary>
public class AIConfig
{
    public string OllamaBaseUrl { get; set; } = "http://localhost:11434";
    public string OllamaModel { get; set; } = "llama3.2:3b";
    public string? OpenAIApiKey { get; set; }
    public string? DeepSeekApiKey { get; set; }
    public int MaxTokens { get; set; } = 2048;
    public float Temperature { get; set; } = 0.7f;
    
    public static AIConfig LoadFromEnvironment()
    {
        return new AIConfig
        {
            OllamaBaseUrl = Environment.GetEnvironmentVariable("OLLAMA_BASE_URL") ?? "http://localhost:11434",
            OllamaModel = Environment.GetEnvironmentVariable("OLLAMA_MODEL") ?? "llama3.2:3b",
            OpenAIApiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY"),
            DeepSeekApiKey = Environment.GetEnvironmentVariable("DEEPSEEK_API_KEY")
        };
    }
}
