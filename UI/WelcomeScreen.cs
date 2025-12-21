using System.Numerics;
using ImGuiNET;

namespace Vizzio.UI;

/// <summary>
/// Stunning welcome screen for first-time users
/// </summary>
public class WelcomeScreen
{
    private bool _isVisible = false; // Disabled by default to allow toolbar interaction
    private float _animationTime = 0.0f;
    private const float AnimationDuration = 0.5f;

    public bool IsVisible
    {
        get => _isVisible;
        set => _isVisible = value;
    }

    public void Render(float deltaTime)
    {
        if (!_isVisible)
            return;

        _animationTime += deltaTime;
        var alpha = Math.Min(_animationTime / AnimationDuration, 1.0f);

        // Center the window
        var viewport = ImGui.GetMainViewport();
        var center = viewport.GetCenter();
        ImGui.SetNextWindowPos(center, ImGuiCond.Always, new Vector2(0.5f, 0.5f));
        ImGui.SetNextWindowSize(new Vector2(700, 500), ImGuiCond.Always);

        // Beautiful styling
        ImGui.PushStyleVar(ImGuiStyleVar.Alpha, alpha);
        ImGui.PushStyleVar(ImGuiStyleVar.WindowRounding, 16.0f);
        ImGui.PushStyleVar(ImGuiStyleVar.WindowPadding, new Vector2(30, 30));
        ImGui.PushStyleColor(ImGuiCol.WindowBg, new Vector4(0.08f, 0.08f, 0.10f, 0.98f));
        ImGui.PushStyleColor(ImGuiCol.Border, new Vector4(0.26f, 0.50f, 0.92f, 0.5f));

        var flags = ImGuiWindowFlags.NoDecoration |
                   ImGuiWindowFlags.NoMove |
                   ImGuiWindowFlags.NoResize |
                   ImGuiWindowFlags.NoSavedSettings;

        if (ImGui.Begin("##WelcomeScreen", flags))
        {
            // Logo and Title
            var titleColor = new Vector4(0.30f, 0.60f, 0.98f, 1.0f);
            ImGui.PushStyleColor(ImGuiCol.Text, titleColor);

            ImGui.SetCursorPosX((ImGui.GetWindowWidth() - ImGui.CalcTextSize("✦ VIZZIO").X) * 0.5f);
            ImGui.SetWindowFontScale(3.0f);
            ImGui.Text("✦ VIZZIO");
            ImGui.SetWindowFontScale(1.0f);

            ImGui.PopStyleColor();

            ImGui.Spacing();

            // Subtitle
            ImGui.PushStyleColor(ImGuiCol.Text, new Vector4(0.75f, 0.75f, 0.78f, 1.0f));
            var subtitle = "Professional IFC Viewer with VR/AR Support";
            ImGui.SetCursorPosX((ImGui.GetWindowWidth() - ImGui.CalcTextSize(subtitle).X) * 0.5f);
            ImGui.Text(subtitle);
            ImGui.PopStyleColor();

            ImGui.Spacing();
            ImGui.Spacing();
            ImGui.Separator();
            ImGui.Spacing();
            ImGui.Spacing();

            // Features
            ImGui.PushStyleColor(ImGuiCol.Text, new Vector4(0.90f, 0.90f, 0.92f, 1.0f));

            RenderFeature("🏗️", "Open IFC Files", "Load and visualize BIM models (IFC2x3, IFC4, IFC4x3)");
            RenderFeature("📏", "Measure Everything", "Distance, area, angle measurements with precision");
            RenderFeature("📝", "Add Annotations", "Note, warning, error, info markers in 3D space");
            RenderFeature("🗂️", "Organize by Layers", "Group elements by floors or types");
            RenderFeature("🥽", "VR/AR Ready", "Experience your models in virtual reality");
            RenderFeature("⚡", "Ultra Fast", "60+ FPS with optimized rendering");

            ImGui.PopStyleColor();

            ImGui.Spacing();
            ImGui.Spacing();
            ImGui.Separator();
            ImGui.Spacing();

            // Quick Start
            ImGui.PushStyleColor(ImGuiCol.Text, titleColor);
            ImGui.Text("🚀 Quick Start:");
            ImGui.PopStyleColor();

            ImGui.Spacing();

            ImGui.BulletText("Press Ctrl+O to open an IFC file");
            ImGui.BulletText("Or drag and drop a file into the window");
            ImGui.BulletText("Press F1 for help and keyboard shortcuts");

            ImGui.Spacing();
            ImGui.Spacing();

            // Get Started Button
            ImGui.SetCursorPosX((ImGui.GetWindowWidth() - 200) * 0.5f);

            ImGui.PushStyleColor(ImGuiCol.Button, new Vector4(0.26f, 0.50f, 0.92f, 1.0f));
            ImGui.PushStyleColor(ImGuiCol.ButtonHovered, new Vector4(0.30f, 0.55f, 0.98f, 1.0f));
            ImGui.PushStyleColor(ImGuiCol.ButtonActive, new Vector4(0.20f, 0.42f, 0.85f, 1.0f));
            ImGui.PushStyleVar(ImGuiStyleVar.FrameRounding, 8.0f);
            ImGui.PushStyleVar(ImGuiStyleVar.FramePadding, new Vector2(40, 12));

            if (ImGui.Button("Get Started ✨", new Vector2(200, 0)))
            {
                _isVisible = false;
            }

            ImGui.PopStyleVar(2);
            ImGui.PopStyleColor(3);

            ImGui.Spacing();

            // Don't show again
            ImGui.SetCursorPosX((ImGui.GetWindowWidth() - 250) * 0.5f);
            ImGui.PushStyleColor(ImGuiCol.Text, new Vector4(0.60f, 0.60f, 0.62f, 1.0f));
            bool dontShow = false;
            if (ImGui.Checkbox("Don't show this again", ref dontShow))
            {
                // Save preference
            }
            ImGui.PopStyleColor();
        }
        ImGui.End();

        ImGui.PopStyleColor(2);
        ImGui.PopStyleVar(3);
    }

    private void RenderFeature(string icon, string title, string description)
    {
        ImGui.Spacing();

        // Icon
        ImGui.PushStyleColor(ImGuiCol.Text, new Vector4(0.30f, 0.60f, 0.98f, 1.0f));
        ImGui.Text(icon);
        ImGui.PopStyleColor();

        ImGui.SameLine();

        // Title and description
        ImGui.BeginGroup();
        ImGui.PushStyleColor(ImGuiCol.Text, new Vector4(0.96f, 0.96f, 0.98f, 1.0f));
        ImGui.Text(title);
        ImGui.PopStyleColor();

        ImGui.PushStyleColor(ImGuiCol.Text, new Vector4(0.70f, 0.70f, 0.72f, 1.0f));
        ImGui.TextWrapped(description);
        ImGui.PopStyleColor();
        ImGui.EndGroup();
    }
}
