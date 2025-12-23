using ImGuiNET;
using System.Numerics;
using ArxisVR.AI;

namespace ArxisVR.UI;

/// <summary>
/// Modern AI chat panel with performance optimizations
/// </summary>
public class AIChatPanel
{
    // Layout constants
    private const float PANEL_WIDTH = 400f;
    private const float PANEL_HEIGHT = 600f;
    private const float INPUT_HEIGHT = 50f;
    private const float BUTTON_WIDTH = 60f;
    private const float MESSAGE_WIDTH_RATIO = 0.85f;
    private const float MESSAGE_OFFSET_RATIO = 0.15f;
    private const float MESSAGE_ROUNDING = 8.0f;
    private const int MAX_INPUT_LENGTH = 2000;
    private const int MAX_MESSAGES_CACHE = 100;

    private readonly List<ChatMessageUI> _messages = new();
    private string _inputText = "";
    private bool _isLoading = false;
    private IfcAIAssistant? _assistant;
    private bool _autoScroll = true;
    private bool _scrollToBottom = false;
    private float _lastScrollMaxY = 0;

    // Performance optimization
    private int _lastRenderedCount = 0;

    public void SetAssistant(IfcAIAssistant assistant)
    {
        _assistant = assistant;

        // Add welcome message
        if (_messages.Count == 0)
        {
            _messages.Add(new ChatMessageUI
            {
                Role = "assistant",
                Content = "👋 Hi! I'm your AI assistant for IFC/BIM. Ask me anything about your model, IFC standards, or how to use ArxisVR!",
                Timestamp = DateTime.Now
            });
        }
    }

    public void Render()
    {
        var displaySize = ImGui.GetIO().DisplaySize;
        ImGui.SetNextWindowSize(new Vector2(PANEL_WIDTH, PANEL_HEIGHT), ImGuiCond.FirstUseEver);
        ImGui.SetNextWindowPos(new Vector2(displaySize.X - PANEL_WIDTH - 20, 120), ImGuiCond.FirstUseEver);

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
        ImGui.Text($"💬 Chat with AI ({_messages.Count} messages)");
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

        // Render messages (optimize for large message lists)
        if (_messages.Count > 50)
        {
            // For large lists, only render visible messages
            var startIdx = Math.Max(0, _messages.Count - 50);
            for (int i = startIdx; i < _messages.Count; i++)
            {
                RenderMessage(_messages[i]);
                ImGui.Spacing();
            }
        }
        else
        {
            // For small lists, render all
            foreach (var msg in _messages)
            {
                RenderMessage(msg);
                ImGui.Spacing();
            }
        }

        if (_isLoading)
        {
            ImGui.PushStyleColor(ImGuiCol.Text, ModernTheme.Colors.AIAssistant);
            ImGui.TextUnformatted("🤖 Thinking...");
            ImGui.PopStyleColor();
        }

        // Auto-scroll to bottom when new messages arrive
        if (_autoScroll)
        {
            if (_lastRenderedCount != _messages.Count || ImGui.GetScrollY() >= ImGui.GetScrollMaxY() - 10)
            {
                ImGui.SetScrollHereY(1.0f);
                _lastRenderedCount = _messages.Count;
            }
        }

        ImGui.EndChild();
    }

    private void RenderMessage(ChatMessageUI msg)
    {
        var isUser = msg.Role == "user";
        var isSystem = msg.Role == "system";
        var color = isUser ? ModernTheme.Colors.AIUser :
                    isSystem ? ModernTheme.Colors.Warning :
                    ModernTheme.Colors.AIAssistant;
        var icon = isUser ? "👤" : isSystem ? "⚙️" : "🤖";
        var name = isUser ? "You" : isSystem ? "System" : "AI Assistant";

        // Message bubble
        ImGui.PushStyleColor(ImGuiCol.ChildBg, color with { W = 0.15f });
        ImGui.PushStyleVar(ImGuiStyleVar.ChildRounding, MESSAGE_ROUNDING);

        var width = ImGui.GetContentRegionAvail().X * MESSAGE_WIDTH_RATIO;
        if (isUser)
            ImGui.SetCursorPosX(ImGui.GetCursorPosX() + ImGui.GetContentRegionAvail().X * MESSAGE_OFFSET_RATIO);

        ImGui.BeginChild($"##msg{msg.Timestamp.Ticks}", new Vector2(width, 0), ImGuiChildFlags.Borders | ImGuiChildFlags.AutoResizeY);

        // Header
        ImGui.PushStyleColor(ImGuiCol.Text, color);
        ImGui.Text($"{icon} {name}");
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
        ImGui.PushItemWidth(-BUTTON_WIDTH - 10);

        var enterPressed = ImGui.InputTextMultiline("##input", ref _inputText, MAX_INPUT_LENGTH,
            new Vector2(-1, INPUT_HEIGHT),
            ImGuiInputTextFlags.EnterReturnsTrue | ImGuiInputTextFlags.CtrlEnterForNewLine);

        ImGui.PopItemWidth();

        // Character counter
        if (_inputText.Length > 0)
        {
            ImGui.SameLine();
            var counterColor = _inputText.Length > MAX_INPUT_LENGTH * 0.9f
                ? ModernTheme.Colors.Warning
                : ModernTheme.Colors.TextDim;
            ImGui.PushStyleColor(ImGuiCol.Text, counterColor);
            ImGui.Text($"{_inputText.Length}/{MAX_INPUT_LENGTH}");
            ImGui.PopStyleColor();
        }

        ImGui.SameLine();
        ImGui.BeginGroup();

        var canSend = !string.IsNullOrWhiteSpace(_inputText) && !_isLoading;
        if (!canSend)
            ImGui.BeginDisabled();

        if (ModernTheme.StyledButton("Send\n📤", new Vector2(BUTTON_WIDTH, INPUT_HEIGHT), ModernTheme.Colors.Primary) || enterPressed)
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

            // Cleanup old messages if too many
            if (_messages.Count > MAX_MESSAGES_CACHE)
            {
                _messages.RemoveRange(0, _messages.Count - MAX_MESSAGES_CACHE);
            }
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
            _autoScroll = true; // Force scroll to show response
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
