using System.Numerics;
using ImGuiNET;

namespace ArxisVR.UI;

/// <summary>
/// Ultra-modern, compact toolbar - Steve Jobs approved
/// </summary>
public class ModernToolbar
{
    private bool _isVisible = true;
    private ToolMode _currentTool = ToolMode.Select;

    // Events
    public event Action? OnOpenFile;
    public event Action? OnSaveScreenshot;
    public event Action? OnMeasureDistance;
    public event Action? OnMeasureArea;
    public event Action? OnMeasureAngle;
    public event Action? OnAnnotate;
    public event Action? OnSelectMode;
    public event Action? OnIsolateSelection;
    public event Action? OnHideSelection;
    public event Action? OnShowAll;
    public event Action? OnSectionBox;
    public event Action? OnFocusModel;
    public event Action? OnResetCamera;
    public event Action? OnToggleWireframe;
    public event Action? OnToggleTransparency;
    public event Action? OnToggleGrid;
    public event Action? OnToggleLighting;
    public event Action? OnSettings;
    public event Action? OnHelp;

    public ToolMode CurrentTool => _currentTool;
    public bool IsVisible { get => _isVisible; set => _isVisible = value; }

    public void Render(int windowWidth, int windowHeight)
    {
        if (!_isVisible) return;

        RenderCompactToolbar(windowWidth);
        RenderQuickActions(windowWidth, windowHeight);
    }

    private void RenderCompactToolbar(int windowWidth)
    {
        // Top horizontal toolbar - clean and minimal
        ImGui.SetNextWindowPos(new Vector2(10, 35), ImGuiCond.Always);
        ImGui.SetNextWindowSize(new Vector2(windowWidth - 20, 0), ImGuiCond.Always);

        var flags = ImGuiWindowFlags.NoDecoration |
                   ImGuiWindowFlags.NoMove |
                   ImGuiWindowFlags.NoResize |
                   ImGuiWindowFlags.AlwaysAutoResize |
                   ImGuiWindowFlags.NoSavedSettings |
                   ImGuiWindowFlags.NoFocusOnAppearing |
                   ImGuiWindowFlags.NoNav |
                   ImGuiWindowFlags.NoBackground;

        ImGui.PushStyleVar(ImGuiStyleVar.WindowPadding, new Vector2(8, 6));
        ImGui.PushStyleVar(ImGuiStyleVar.ItemSpacing, new Vector2(4, 4));
        ImGui.PushStyleVar(ImGuiStyleVar.FrameRounding, 6.0f);

        if (ImGui.Begin("##ModernToolbar", flags))
        {
            // File group
            ToolGroup("FILE", () =>
            {
                if (ToolButton("Open", "Open IFC File", false, new Vector2(45, 32)))
                    OnOpenFile?.Invoke();
                ImGui.SameLine();
                if (ToolButton("Shot", "Screenshot", false, new Vector2(40, 32)))
                    OnSaveScreenshot?.Invoke();
            });

            ImGui.SameLine();
            Divider();
            ImGui.SameLine();

            // Selection tools
            ToolGroup("SELECT", () =>
            {
                if (ToolButton("Sel", "Select Mode", _currentTool == ToolMode.Select, new Vector2(35, 32)))
                {
                    _currentTool = ToolMode.Select;
                    OnSelectMode?.Invoke();
                }
                ImGui.SameLine();
                if (ToolButton("Iso", "Isolate", false, new Vector2(35, 32)))
                    OnIsolateSelection?.Invoke();
                ImGui.SameLine();
                if (ToolButton("Hide", "Hide Selected", false, new Vector2(40, 32)))
                    OnHideSelection?.Invoke();
                ImGui.SameLine();
                if (ToolButton("Show", "Show All", false, new Vector2(40, 32)))
                    OnShowAll?.Invoke();
            });

            ImGui.SameLine();
            Divider();
            ImGui.SameLine();

            // Measurement tools
            ToolGroup("MEASURE", () =>
            {
                if (ToolButton("Dist", "Distance", _currentTool == ToolMode.MeasureDistance, new Vector2(38, 32)))
                {
                    _currentTool = ToolMode.MeasureDistance;
                    OnMeasureDistance?.Invoke();
                }
                ImGui.SameLine();
                if (ToolButton("Area", "Area", _currentTool == ToolMode.MeasureArea, new Vector2(38, 32)))
                {
                    _currentTool = ToolMode.MeasureArea;
                    OnMeasureArea?.Invoke();
                }
                ImGui.SameLine();
                if (ToolButton("Ang", "Angle", _currentTool == ToolMode.MeasureAngle, new Vector2(35, 32)))
                {
                    _currentTool = ToolMode.MeasureAngle;
                    OnMeasureAngle?.Invoke();
                }
                ImGui.SameLine();
                if (ToolButton("Anno", "Annotate", _currentTool == ToolMode.Annotate, new Vector2(45, 32)))
                {
                    _currentTool = ToolMode.Annotate;
                    OnAnnotate?.Invoke();
                }
            });

            ImGui.SameLine();
            Divider();
            ImGui.SameLine();

            // View tools
            ToolGroup("VIEW", () =>
            {
                if (ToolButton("Box", "Section Box", _currentTool == ToolMode.SectionBox, new Vector2(35, 32)))
                {
                    _currentTool = ToolMode.SectionBox;
                    OnSectionBox?.Invoke();
                }
                ImGui.SameLine();
                if (ToolButton("Focus", "Focus Model", false, new Vector2(45, 32)))
                    OnFocusModel?.Invoke();
                ImGui.SameLine();
                if (ToolButton("Reset", "Reset Camera", false, new Vector2(45, 32)))
                    OnResetCamera?.Invoke();
            });

            ImGui.SameLine();
            Divider();
            ImGui.SameLine();

            // Display modes
            ToolGroup("DISPLAY", () =>
            {
                if (ToolButton("Wire", "Wireframe", false, new Vector2(38, 32)))
                    OnToggleWireframe?.Invoke();
                ImGui.SameLine();
                if (ToolButton("XRay", "X-Ray Mode", false, new Vector2(40, 32)))
                    OnToggleTransparency?.Invoke();
                ImGui.SameLine();
                if (ToolButton("Grid", "Grid", false, new Vector2(35, 32)))
                    OnToggleGrid?.Invoke();
                ImGui.SameLine();
                if (ToolButton("Light", "Lighting", false, new Vector2(40, 32)))
                    OnToggleLighting?.Invoke();
            });

            // Right side - help and settings
            ImGui.SameLine();
            float availWidth = ImGui.GetContentRegionAvail().X;
            ImGui.SetCursorPosX(ImGui.GetCursorPosX() + availWidth - 120);

            if (ToolButton("Help", "Help (F1)", false, new Vector2(40, 32)))
                OnHelp?.Invoke();
            ImGui.SameLine();
            if (ToolButton("Set", "Settings", false, new Vector2(35, 32)))
                OnSettings?.Invoke();
        }
        ImGui.End();

        ImGui.PopStyleVar(3);
    }

    private void RenderQuickActions(int windowWidth, int windowHeight)
    {
        // Floating action button for quick access
        ImGui.SetNextWindowPos(new Vector2(windowWidth - 80, windowHeight - 80), ImGuiCond.Always);

        var flags = ImGuiWindowFlags.NoDecoration |
                   ImGuiWindowFlags.NoMove |
                   ImGuiWindowFlags.NoResize |
                   ImGuiWindowFlags.AlwaysAutoResize |
                   ImGuiWindowFlags.NoSavedSettings |
                   ImGuiWindowFlags.NoBackground;

        ImGui.PushStyleVar(ImGuiStyleVar.WindowPadding, new Vector2(0, 0));

        if (ImGui.Begin("##QuickActions", flags))
        {
            // Quick focus button
            ImGui.PushStyleColor(ImGuiCol.Button, new Vector4(0.2f, 0.6f, 1.0f, 0.9f));
            ImGui.PushStyleColor(ImGuiCol.ButtonHovered, new Vector4(0.3f, 0.7f, 1.0f, 1.0f));
            ImGui.PushStyleColor(ImGuiCol.ButtonActive, new Vector4(0.1f, 0.5f, 0.9f, 1.0f));
            ImGui.PushStyleVar(ImGuiStyleVar.FrameRounding, 30.0f);

            if (ImGui.Button("FOCUS", new Vector2(60, 60)))
                OnFocusModel?.Invoke();

            ImGui.PopStyleVar();
            ImGui.PopStyleColor(3);

            if (ImGui.IsItemHovered())
            {
                ImGui.BeginTooltip();
                ImGui.Text("Focus on Model");
                ImGui.TextDisabled("Press F to focus");
                ImGui.EndTooltip();
            }
        }
        ImGui.End();

        ImGui.PopStyleVar();
    }

    private void ToolGroup(string label, Action renderContent)
    {
        ImGui.BeginGroup();

        // Label above buttons
        ImGui.PushStyleColor(ImGuiCol.Text, new Vector4(0.5f, 0.5f, 0.5f, 1.0f));
        ImGui.TextUnformatted(label);
        ImGui.PopStyleColor();

        renderContent();
        ImGui.EndGroup();
    }

    private bool ToolButton(string icon, string tooltip, bool isActive, Vector2 size)
    {
        if (isActive)
        {
            ImGui.PushStyleColor(ImGuiCol.Button, new Vector4(0.2f, 0.6f, 1.0f, 0.8f));
            ImGui.PushStyleColor(ImGuiCol.ButtonHovered, new Vector4(0.3f, 0.7f, 1.0f, 0.9f));
            ImGui.PushStyleColor(ImGuiCol.ButtonActive, new Vector4(0.1f, 0.5f, 0.9f, 1.0f));
        }
        else
        {
            ImGui.PushStyleColor(ImGuiCol.Button, new Vector4(0.15f, 0.15f, 0.15f, 0.7f));
            ImGui.PushStyleColor(ImGuiCol.ButtonHovered, new Vector4(0.25f, 0.25f, 0.25f, 0.8f));
            ImGui.PushStyleColor(ImGuiCol.ButtonActive, new Vector4(0.2f, 0.2f, 0.2f, 0.9f));
        }

        bool clicked = ImGui.Button(icon, size);

        ImGui.PopStyleColor(3);

        if (ImGui.IsItemHovered())
        {
            ImGui.BeginTooltip();
            ImGui.Text(tooltip);
            ImGui.EndTooltip();
        }

        return clicked;
    }

    private void Divider()
    {
        ImGui.PushStyleColor(ImGuiCol.Separator, new Vector4(0.4f, 0.4f, 0.4f, 0.5f));
        ImGui.SameLine();
        ImGui.Dummy(new Vector2(2, 32));
        ImGui.PopStyleColor();
    }
}

public enum ToolMode
{
    Select,
    Pan,
    Orbit,
    Walk,
    MeasureDistance,
    MeasureArea,
    MeasureAngle,
    Annotate,
    SectionBox
}
