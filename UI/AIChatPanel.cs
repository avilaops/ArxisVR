using ImGuiNET;
using System.Numerics;
using Vizzio.AI;

namespace Vizzio.UI;

/// <summary>
/// Modern AI chat panel
/// </summary>
public class AIChatPanel
{
    private readonly List<ChatMessageUI> _messages = new();
    private string _inputText = "";
    private bool _isLoading = false;
    private IfcAIAssistant? _assistant;
    private bool _autoScroll = true;

    public void SetAssistant(IfcAIAssistant assistant)
    {
        _assistant = assistant;
        
        // Add welcome message
        if (_messages.Count == 0)
        {
            _messages.Add(new ChatMessageUI
            {
                Role = "assistant",
                Content = "👋 Hi! I'm your AI assistant for IFC/BIM. Ask me anything about your model, IFC standards, or how to use VIZZIO!",
                Timestamp = DateTime.Now
            });
        }
    }

    public void Render()
    {
        ImGui.SetNextWindowSize(new Vector2(400, 600), ImGuiCond.FirstUseEver);
        ImGui.SetNextWindowPos(new Vector2(ImGui.GetIO().DisplaySize.X - 420, 120), ImGuiCond.FirstUseEver);

        if (ImGui.Begin("🤖 AI Assistant", ImGuiWindowFlags.None))
        {
            if (_assistant == null)
            {
                RenderNotAvailable();
            }
            else
            {
                RenderHeader();
                ImGui.Spacing();
                ImGui.Separator();
                ImGui.Spacing();
                
                RenderMessages();
                ImGui.Spacing();
                
                RenderInput();
            }
        }
        ImGui.End();
    }

    private void RenderHeader()
    {
        ImGui.PushStyleColor(ImGuiCol.Text, ModernTheme.Colors.AIAssistant);
        ImGui.Text("💬 Chat with AI");
        ImGui.PopStyleColor();
        
        ImGui.SameLine(ImGui.GetWindowWidth() - 120);
        if (ImGui.SmallButton("🗑️ Clear"))
        {
            _messages.Clear();
            _messages.Add(new ChatMessageUI
            {
                Role = "assistant",
                Content = "Chat cleared. How can I help you?",
                Timestamp = DateTime.Now
            });
        }
        
        ImGui.SameLine();
        if (ImGui.SmallButton(_autoScroll ? "📜 Auto" : "📜 Manual"))
        {
            _autoScroll = !_autoScroll;
        }
    }

    private void RenderNotAvailable()
    {
        ImGui.PushStyleColor(ImGuiCol.Text, ModernTheme.Colors.Warning);
        ImGui.TextWrapped("⚠️ AI Assistant not available");
        ImGui.PopStyleColor();
        ImGui.Spacing();
        ImGui.TextWrapped("Make sure Ollama is running:");
        ImGui.BulletText("Run: ollama serve");
        ImGui.BulletText("Check: http://localhost:11434");
        ImGui.Spacing();
        ImGui.TextWrapped("See docs/OLLAMA_SETUP.md for help.");
    }

    private void RenderMessages()
    {
        ImGui.BeginChild("##messages", new Vector2(0, -60), ImGuiChildFlags.Borders);

        foreach (var msg in _messages)
        {
            RenderMessage(msg);
            ImGui.Spacing();
        }

        if (_isLoading)
        {
            ImGui.PushStyleColor(ImGuiCol.Text, ModernTheme.Colors.AIAssistant);
            ImGui.TextUnformatted("🤖 Thinking...");
            ImGui.PopStyleColor();
        }

        if (_autoScroll && ImGui.GetScrollY() >= ImGui.GetScrollMaxY())
        {
            ImGui.SetScrollHereY(1.0f);
        }

        ImGui.EndChild();
    }

    private void RenderMessage(ChatMessageUI msg)
    {
        var isUser = msg.Role == "user";
        var color = isUser ? ModernTheme.Colors.AIUser : ModernTheme.Colors.AIAssistant;
        var icon = isUser ? "👤" : "🤖";

        // Message bubble
        ImGui.PushStyleColor(ImGuiCol.ChildBg, color with { W = 0.15f });
        ImGui.PushStyleVar(ImGuiStyleVar.ChildRounding, 8.0f);
        
        var width = ImGui.GetContentRegionAvail().X * 0.85f;
        if (isUser)
            ImGui.SetCursorPosX(ImGui.GetCursorPosX() + ImGui.GetContentRegionAvail().X * 0.15f);

        ImGui.BeginChild($"##msg{msg.Timestamp.Ticks}", new Vector2(width, 0), ImGuiChildFlags.Borders | ImGuiChildFlags.AutoResizeY);

        // Header
        ImGui.PushStyleColor(ImGuiCol.Text, color);
        ImGui.Text($"{icon} {(isUser ? "You" : "AI Assistant")}");
        ImGui.PopStyleColor();
        
        ImGui.SameLine(ImGui.GetWindowWidth() - 60);
        ImGui.PushStyleColor(ImGuiCol.Text, ModernTheme.Colors.TextDim);
        ImGui.TextUnformatted(msg.Timestamp.ToString("HH:mm"));
        ImGui.PopStyleColor();

        ImGui.Spacing();

        // Content
        ImGui.PushTextWrapPos(ImGui.GetWindowWidth() - 10);
        ImGui.TextWrapped(msg.Content);
        ImGui.PopTextWrapPos();

        ImGui.EndChild();
        ImGui.PopStyleVar();
        ImGui.PopStyleColor();
    }

    private void RenderInput()
    {
        ImGui.PushItemWidth(-70);
        
        var enterPressed = ImGui.InputTextMultiline("##input", ref _inputText, 1000, 
            new Vector2(-1, 50), 
            ImGuiInputTextFlags.EnterReturnsTrue | ImGuiInputTextFlags.CtrlEnterForNewLine);
        
        ImGui.PopItemWidth();

        ImGui.SameLine();
        ImGui.BeginGroup();
        
        var canSend = !string.IsNullOrWhiteSpace(_inputText) && !_isLoading;
        if (!canSend)
            ImGui.BeginDisabled();

        if (ModernTheme.StyledButton("Send\n📤", new Vector2(60, 50), ModernTheme.Colors.Primary) || enterPressed)
        {
            if (canSend)
            {
                SendMessage();
            }
        }

        if (!canSend)
            ImGui.EndDisabled();
        
        ImGui.EndGroup();

        if (ImGui.IsItemHovered() && canSend)
        {
            ImGui.SetTooltip("Send message (Enter)");
        }
    }

    private async void SendMessage()
    {
        if (_assistant == null || string.IsNullOrWhiteSpace(_inputText))
            return;

        var userMessage = _inputText.Trim();
        _inputText = "";

        // Add user message
        _messages.Add(new ChatMessageUI
        {
            Role = "user",
            Content = userMessage,
            Timestamp = DateTime.Now
        });

        _isLoading = true;

        try
        {
            // Get AI response
            var response = await _assistant.AskAsync(userMessage);

            // Add AI response
            _messages.Add(new ChatMessageUI
            {
                Role = "assistant",
                Content = response,
                Timestamp = DateTime.Now
            });
        }
        catch (Exception ex)
        {
            _messages.Add(new ChatMessageUI
            {
                Role = "assistant",
                Content = $"❌ Error: {ex.Message}\n\nPlease check if Ollama is running.",
                Timestamp = DateTime.Now
            });
        }
        finally
        {
            _isLoading = false;
        }
    }

    public async Task AddSystemMessage(string message)
    {
        _messages.Add(new ChatMessageUI
        {
            Role = "system",
            Content = message,
            Timestamp = DateTime.Now
        });
    }

    public async Task AnalyzeElement(string elementType, Dictionary<string, string> properties)
    {
        if (_assistant == null)
            return;

        _isLoading = true;

        try
        {
            var analysis = await _assistant.AnalyzeElementAsync(elementType, properties);

            _messages.Add(new ChatMessageUI
            {
                Role = "assistant",
                Content = $"📊 Element Analysis:\n\n{analysis}",
                Timestamp = DateTime.Now
            });
        }
        catch (Exception ex)
        {
            _messages.Add(new ChatMessageUI
            {
                Role = "assistant",
                Content = $"❌ Failed to analyze element: {ex.Message}",
                Timestamp = DateTime.Now
            });
        }
        finally
        {
            _isLoading = false;
        }
    }
}

public class ChatMessageUI
{
    public string Role { get; set; } = "user";
    public string Content { get; set; } = "";
    public DateTime Timestamp { get; set; }
}
