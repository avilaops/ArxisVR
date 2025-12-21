using System.Numerics;
using ImGuiNET;

namespace Vizzio.UI;

/// <summary>
/// Beautiful toast notification system
/// </summary>
public class NotificationSystem
{
    private readonly List<Notification> _notifications = new();
    private const float NotificationDuration = 3.0f;
    private const float FadeInDuration = 0.3f;
    private const float FadeOutDuration = 0.3f;

    public void ShowSuccess(string message)
    {
        AddNotification(message, NotificationType.Success, "✓");
    }

    public void ShowInfo(string message)
    {
        AddNotification(message, NotificationType.Info, "ℹ");
    }

    public void ShowWarning(string message)
    {
        AddNotification(message, NotificationType.Warning, "⚠");
    }

    public void ShowError(string message)
    {
        AddNotification(message, NotificationType.Error, "✕");
    }

    private void AddNotification(string message, NotificationType type, string icon)
    {
        _notifications.Add(new Notification
        {
            Message = message,
            Type = type,
            Icon = icon,
            CreatedTime = DateTime.Now,
            Alpha = 0.0f
        });
    }

    public void Update(float deltaTime)
    {
        for (int i = _notifications.Count - 1; i >= 0; i--)
        {
            var notification = _notifications[i];
            var elapsed = (float)(DateTime.Now - notification.CreatedTime).TotalSeconds;

            // Fade in
            if (elapsed < FadeInDuration)
            {
                notification.Alpha = elapsed / FadeInDuration;
            }
            // Stay visible
            else if (elapsed < NotificationDuration - FadeOutDuration)
            {
                notification.Alpha = 1.0f;
            }
            // Fade out
            else if (elapsed < NotificationDuration)
            {
                notification.Alpha = 1.0f - ((elapsed - (NotificationDuration - FadeOutDuration)) / FadeOutDuration);
            }
            // Remove
            else
            {
                _notifications.RemoveAt(i);
                continue;
            }
        }
    }

    public void Render()
    {
        var viewport = ImGui.GetMainViewport();
        var startY = viewport.Size.Y - 80;
        
        for (int i = 0; i < _notifications.Count; i++)
        {
            var notification = _notifications[i];
            var yPos = startY - (i * 75);
            
            RenderNotification(notification, new Vector2(viewport.Size.X - 360, yPos));
        }
    }

    private void RenderNotification(Notification notification, Vector2 position)
    {
        ImGui.SetNextWindowPos(position, ImGuiCond.Always);
        ImGui.SetNextWindowSize(new Vector2(340, 0), ImGuiCond.Always);

        // Styling based on type
        var (bgColor, borderColor) = GetNotificationColors(notification.Type);
        
        ImGui.PushStyleVar(ImGuiStyleVar.Alpha, notification.Alpha);
        ImGui.PushStyleVar(ImGuiStyleVar.WindowRounding, 10.0f);
        ImGui.PushStyleVar(ImGuiStyleVar.WindowPadding, new Vector2(16, 14));
        ImGui.PushStyleColor(ImGuiCol.WindowBg, bgColor);
        ImGui.PushStyleColor(ImGuiCol.Border, borderColor);
        ImGui.PushStyleVar(ImGuiStyleVar.WindowBorderSize, 2.0f);

        var flags = ImGuiWindowFlags.NoDecoration | 
                   ImGuiWindowFlags.NoMove | 
                   ImGuiWindowFlags.NoResize |
                   ImGuiWindowFlags.NoSavedSettings |
                   ImGuiWindowFlags.NoFocusOnAppearing |
                   ImGuiWindowFlags.AlwaysAutoResize;

        if (ImGui.Begin($"##Notification{notification.GetHashCode()}", flags))
        {
            // Icon
            ImGui.PushStyleColor(ImGuiCol.Text, borderColor);
            ImGui.SetWindowFontScale(1.5f);
            ImGui.Text(notification.Icon);
            ImGui.SetWindowFontScale(1.0f);
            ImGui.PopStyleColor();
            
            ImGui.SameLine();
            
            // Message
            ImGui.BeginGroup();
            ImGui.PushTextWrapPos(ImGui.GetCursorPos().X + 260);
            ImGui.Text(notification.Message);
            ImGui.PopTextWrapPos();
            ImGui.EndGroup();
        }
        ImGui.End();

        ImGui.PopStyleVar(4);
        ImGui.PopStyleColor(2);
    }

    private (Vector4 bg, Vector4 border) GetNotificationColors(NotificationType type)
    {
        return type switch
        {
            NotificationType.Success => (
                new Vector4(0.15f, 0.35f, 0.20f, 0.95f),
                new Vector4(0.30f, 0.82f, 0.40f, 1.0f)
            ),
            NotificationType.Info => (
                new Vector4(0.15f, 0.25f, 0.40f, 0.95f),
                new Vector4(0.40f, 0.70f, 0.98f, 1.0f)
            ),
            NotificationType.Warning => (
                new Vector4(0.40f, 0.32f, 0.15f, 0.95f),
                new Vector4(1.00f, 0.84f, 0.00f, 1.0f)
            ),
            NotificationType.Error => (
                new Vector4(0.40f, 0.15f, 0.15f, 0.95f),
                new Vector4(1.00f, 0.27f, 0.23f, 1.0f)
            ),
            _ => (
                new Vector4(0.15f, 0.15f, 0.17f, 0.95f),
                new Vector4(0.50f, 0.50f, 0.52f, 1.0f)
            )
        };
    }
}

public class Notification
{
    public string Message { get; set; } = "";
    public NotificationType Type { get; set; }
    public string Icon { get; set; } = "";
    public DateTime CreatedTime { get; set; }
    public float Alpha { get; set; }
}

public enum NotificationType
{
    Success,
    Info,
    Warning,
    Error
}
