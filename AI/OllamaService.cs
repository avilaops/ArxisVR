using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Vizzio.AI;

/// <summary>
/// Service for interacting with Ollama AI models
/// </summary>
public class OllamaService : IDisposable
{
    private readonly HttpClient _httpClient;
    private readonly AIConfig _config;
    private bool _disposed;

    public OllamaService(AIConfig config)
    {
        _config = config ?? throw new ArgumentNullException(nameof(config));
        _httpClient = new HttpClient
        {
            BaseAddress = new Uri(_config.OllamaBaseUrl),
            Timeout = TimeSpan.FromMinutes(5)
        };
    }

    /// <summary>
    /// Check if Ollama is running and accessible
    /// </summary>
    public async Task<bool> IsAvailableAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _httpClient.GetAsync("/api/tags", cancellationToken);
            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }

    /// <summary>
    /// Get list of available models
    /// </summary>
    public async Task<List<string>> GetAvailableModelsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _httpClient.GetAsync("/api/tags", cancellationToken);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync(cancellationToken);
            var result = JsonSerializer.Deserialize<ModelsResponse>(content);
            
            return result?.Models?.Select(m => m.Name).ToList() ?? new List<string>();
        }
        catch
        {
            return new List<string>();
        }
    }

    /// <summary>
    /// Generate a response from the AI model
    /// </summary>
    public async Task<string> GenerateAsync(string prompt, CancellationToken cancellationToken = default)
    {
        var request = new GenerateRequest
        {
            Model = _config.OllamaModel,
            Prompt = prompt,
            Stream = false,
            Options = new GenerateOptions
            {
                Temperature = _config.Temperature,
                NumPredict = _config.MaxTokens
            }
        };

        var json = JsonSerializer.Serialize(request);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("/api/generate", content, cancellationToken);
        response.EnsureSuccessStatusCode();

        var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);
        var result = JsonSerializer.Deserialize<GenerateResponse>(responseContent);

        return result?.Response ?? string.Empty;
    }

    /// <summary>
    /// Generate a streaming response from the AI model
    /// </summary>
    public async IAsyncEnumerable<string> GenerateStreamAsync(
        string prompt, 
        [System.Runtime.CompilerServices.EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        var request = new GenerateRequest
        {
            Model = _config.OllamaModel,
            Prompt = prompt,
            Stream = true,
            Options = new GenerateOptions
            {
                Temperature = _config.Temperature,
                NumPredict = _config.MaxTokens
            }
        };

        var json = JsonSerializer.Serialize(request);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        using var requestMessage = new HttpRequestMessage(HttpMethod.Post, "/api/generate")
        {
            Content = content
        };

        using var response = await _httpClient.SendAsync(requestMessage, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
        response.EnsureSuccessStatusCode();

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        using var reader = new StreamReader(stream);

        string? line;
        while ((line = await reader.ReadLineAsync(cancellationToken)) != null)
        {
            cancellationToken.ThrowIfCancellationRequested();
            
            if (string.IsNullOrWhiteSpace(line))
                continue;

            var result = JsonSerializer.Deserialize<GenerateResponse>(line);
            if (result?.Response != null)
                yield return result.Response;

            if (result?.Done == true)
                break;
        }
    }

    /// <summary>
    /// Chat with the AI model (maintains context)
    /// </summary>
    public async Task<string> ChatAsync(
        List<ChatMessage> messages, 
        CancellationToken cancellationToken = default)
    {
        var request = new ChatRequest
        {
            Model = _config.OllamaModel,
            Messages = messages,
            Stream = false,
            Options = new GenerateOptions
            {
                Temperature = _config.Temperature,
                NumPredict = _config.MaxTokens
            }
        };

        var json = JsonSerializer.Serialize(request);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.PostAsync("/api/chat", content, cancellationToken);
        response.EnsureSuccessStatusCode();

        var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);
        var result = JsonSerializer.Deserialize<ChatResponse>(responseContent);

        return result?.Message?.Content ?? string.Empty;
    }

    public void Dispose()
    {
        if (!_disposed)
        {
            _httpClient?.Dispose();
            _disposed = true;
        }
        GC.SuppressFinalize(this);
    }

    #region DTOs

    private class ModelsResponse
    {
        [JsonPropertyName("models")]
        public List<ModelInfo>? Models { get; set; }
    }

    private class ModelInfo
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
    }

    private class GenerateRequest
    {
        [JsonPropertyName("model")]
        public string Model { get; set; } = string.Empty;

        [JsonPropertyName("prompt")]
        public string Prompt { get; set; } = string.Empty;

        [JsonPropertyName("stream")]
        public bool Stream { get; set; }

        [JsonPropertyName("options")]
        public GenerateOptions? Options { get; set; }
    }

    private class GenerateOptions
    {
        [JsonPropertyName("temperature")]
        public float Temperature { get; set; }

        [JsonPropertyName("num_predict")]
        public int NumPredict { get; set; }
    }

    private class GenerateResponse
    {
        [JsonPropertyName("response")]
        public string? Response { get; set; }

        [JsonPropertyName("done")]
        public bool Done { get; set; }
    }

    private class ChatRequest
    {
        [JsonPropertyName("model")]
        public string Model { get; set; } = string.Empty;

        [JsonPropertyName("messages")]
        public List<ChatMessage> Messages { get; set; } = new();

        [JsonPropertyName("stream")]
        public bool Stream { get; set; }

        [JsonPropertyName("options")]
        public GenerateOptions? Options { get; set; }
    }

    private class ChatResponse
    {
        [JsonPropertyName("message")]
        public ChatMessage? Message { get; set; }

        [JsonPropertyName("done")]
        public bool Done { get; set; }
    }

    #endregion
}

/// <summary>
/// Represents a chat message
/// </summary>
public class ChatMessage
{
    [JsonPropertyName("role")]
    public string Role { get; set; } = "user";

    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;

    public static ChatMessage System(string content) => new() { Role = "system", Content = content };
    public static ChatMessage User(string content) => new() { Role = "user", Content = content };
    public static ChatMessage Assistant(string content) => new() { Role = "assistant", Content = content };
}
