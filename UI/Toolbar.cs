using System.Numerics;
using ImGuiNET;

namespace ArxisVR.UI;

/// <summary>
/// Modern toolbar with beautiful icon buttons
/// </summary>
public class Toolbar
{
    private bool _isVisible = true;
    private ToolbarPosition _position = ToolbarPosition.Left;
    private ToolMode _currentTool = ToolMode.Select;

    public bool IsVisible
    {
        get => _isVisible;
        set => _isVisible = value;
    }

    public ToolbarPosition Position
    {
        get => _position;
        set => _position = value;
    }

    public ToolMode CurrentTool
    {
        get => _currentTool;
        set => _currentTool = value;
    }

    // Tool events
    public event Action? OnOpenFile;
    public event Action? OnSaveScreenshot;
    public event Action? OnExportModel;
    public event Action? OnMeasureDistance;
    public event Action? OnMeasureArea;
    public event Action? OnMeasureAngle;
    public event Action? OnAnnotate;
    public event Action? OnSelectMode;
    public event Action? OnPanMode;
    public event Action? OnOrbitMode;
    public event Action? OnFocusModel;
    public event Action? OnResetCamera;
    public event Action? OnIsolateSelection;
    public event Action? OnHideSelection;
    public event Action? OnShowAll;
    public event Action? OnSectionBox;
    public event Action? OnTransparencyMode;
    public event Action? OnWireframeMode;
    public event Action? OnToggleLighting;
    public event Action? OnToggleGrid;
    public event Action? OnToggleAxes;
    public event Action? OnToggleShadows;
    public event Action? OnToggleVR;
    public event Action? OnSettings;
    public event Action? OnHelp;

    public void Render(int windowWidth, int windowHeight)
    {
        if (!_isVisible)
            return;

        ImGui.PushStyleVar(ImGuiStyleVar.WindowPadding, new Vector2(10, 10));
        ImGui.PushStyleVar(ImGuiStyleVar.ItemSpacing, new Vector2(6, 6));

        SetToolbarPosition(windowWidth, windowHeight);

        var flags = ImGuiWindowFlags.NoDecoration |
                   ImGuiWindowFlags.NoMove |
                   ImGuiWindowFlags.NoResize |
                   ImGuiWindowFlags.AlwaysAutoResize |
                   ImGuiWindowFlags.NoSavedSettings |
                   ImGuiWindowFlags.NoFocusOnAppearing |
                   ImGuiWindowFlags.NoNav;

        if (ImGui.Begin("##Toolbar", flags))
        {
            RenderToolbarContent();
        }
        ImGui.End();

        ImGui.PopStyleVar(2);
    }

    private void SetToolbarPosition(int windowWidth, int windowHeight)
    {
        const float margin = 15.0f;

        switch (_position)
        {
            case ToolbarPosition.Left:
                ImGui.SetNextWindowPos(new Vector2(margin, 70), ImGuiCond.Always);
                break;

            case ToolbarPosition.Right:
                ImGui.SetNextWindowPos(new Vector2(windowWidth - 90, 70), ImGuiCond.Always);
                break;

            case ToolbarPosition.Top:
                ImGui.SetNextWindowPos(new Vector2(windowWidth / 2 - 250, margin + 40), ImGuiCond.Always);
                break;

            case ToolbarPosition.Bottom:
                ImGui.SetNextWindowPos(new Vector2(windowWidth / 2 - 250, windowHeight - 80), ImGuiCond.Always);
                break;
        }
    }

    private void RenderToolbarContent()
    {
        bool isVertical = _position == ToolbarPosition.Left || _position == ToolbarPosition.Right;

        // File Section
        SectionLabel("FILE", isVertical);
        if (IconButton("📂", "Open IFC File\n(Ctrl+O)", false))
            OnOpenFile?.Invoke();
        NextItem(isVertical);

        if (IconButton("�", "Export Model\n(Ctrl+E)", false))
            OnExportModel?.Invoke();
        NextItem(isVertical);

        if (IconButton("📸", "Take Screenshot\n(F12)", false))
            OnSaveScreenshot?.Invoke();
        NextItem(isVertical);

        RenderSeparator(isVertical);

        // Navigation Section
        SectionLabel("NAVIGATE", isVertical);
        if (IconButton("🎯", "Select Mode\n(1)", _currentTool == ToolMode.Select))
        {
            _currentTool = ToolMode.Select;
            OnSelectMode?.Invoke();
        }
        NextItem(isVertical);

        if (IconButton("🔄", "Orbit Mode\n(2)", _currentTool == ToolMode.Orbit))
        {
            _currentTool = ToolMode.Orbit;
            OnOrbitMode?.Invoke();
        }
        NextItem(isVertical);

        if (IconButton("✋", "Pan Mode\n(3)", _currentTool == ToolMode.Pan))
        {
            _currentTool = ToolMode.Pan;
            OnPanMode?.Invoke();
        }
        NextItem(isVertical);

        if (IconButton("🚶", "Walk Mode\n(4)", _currentTool == ToolMode.Walk))
        {
            _currentTool = ToolMode.Walk;
            OnPanMode?.Invoke(); // Reuse pan for now
        }
        NextItem(isVertical);

        RenderSeparator(isVertical);

        // Measure Section
        SectionLabel("MEASURE", isVertical);
        if (IconButton("📏", "Measure Distance\n(M)", _currentTool == ToolMode.MeasureDistance))
        {
            _currentTool = ToolMode.MeasureDistance;
            OnMeasureDistance?.Invoke();
        }
        NextItem(isVertical);

        if (IconButton("📐", "Measure Area\n(Shift+M)", _currentTool == ToolMode.MeasureArea))
        {
            _currentTool = ToolMode.MeasureArea;
            OnMeasureArea?.Invoke();
        }
        NextItem(isVertical);

        if (IconButton("∠", "Measure Angle\n(Ctrl+M)", _currentTool == ToolMode.MeasureAngle))
        {
            _currentTool = ToolMode.MeasureAngle;
            OnMeasureAngle?.Invoke();
        }
        NextItem(isVertical);

        if (IconButton("📝", "Annotate\n(N)", _currentTool == ToolMode.Annotate))
        {
            _currentTool = ToolMode.Annotate;
            OnAnnotate?.Invoke();
        }
        NextItem(isVertical);

        RenderSeparator(isVertical);

        // Selection Tools
        SectionLabel("SELECT", isVertical);
        if (IconButton("🎯", "Isolate Selection\n(I)", false))
            OnIsolateSelection?.Invoke();
        NextItem(isVertical);

        if (IconButton("👁️", "Hide Selection\n(H)", false))
            OnHideSelection?.Invoke();
        NextItem(isVertical);

        if (IconButton("👁️‍🗨️", "Show All\n(Shift+H)", false))
            OnShowAll?.Invoke();
        NextItem(isVertical);

        RenderSeparator(isVertical);

        // View Tools
        SectionLabel("VIEW", isVertical);
        if (IconButton("📦", "Section Box\n(B)", _currentTool == ToolMode.SectionBox))
        {
            _currentTool = ToolMode.SectionBox;
            OnSectionBox?.Invoke();
        }
        NextItem(isVertical);

        if (IconButton("🎬", "Focus on Model\n(F)", false))
            OnFocusModel?.Invoke();
        NextItem(isVertical);

        if (IconButton("↺", "Reset Camera\n(Home)", false))
            OnResetCamera?.Invoke();
        NextItem(isVertical);

        RenderSeparator(isVertical);

        // Display Modes
        SectionLabel("DISPLAY", isVertical);
        if (IconButton("🔲", "Wireframe\n(W)", false))
            OnWireframeMode?.Invoke();
        NextItem(isVertical);

        if (IconButton("💎", "Transparency\n(T)", false))
            OnTransparencyMode?.Invoke();
        NextItem(isVertical);

        if (IconButton("💡", "Toggle Lighting\n(L)", false))
            OnToggleLighting?.Invoke();
        NextItem(isVertical);

        if (IconButton("🌓", "Toggle Shadows\n(Shift+L)", false))
            OnToggleShadows?.Invoke();
        NextItem(isVertical);

        if (IconButton("#", "Toggle Grid\n(G)", false))
            OnToggleGrid?.Invoke();
        NextItem(isVertical);

        if (IconButton("📐", "Toggle Axes\n(X)", false))
            OnToggleAxes?.Invoke();
        NextItem(isVertical);

        RenderSeparator(isVertical);

        // VR & Settings
        if (IconButton("🥽", "VR Mode\n(F2)", false))
            OnToggleVR?.Invoke();
        NextItem(isVertical);

        if (IconButton("❓", "Help\n(F1)", false))
            OnHelp?.Invoke();
        NextItem(isVertical);

        if (IconButton("⚙️", "Settings", false))
            OnSettings?.Invoke();
    }

    private void SectionLabel(string label, bool isVertical)
    {
        if (!isVertical)
        {
            ImGui.SameLine();
            ImGui.Dummy(new Vector2(8, 0));
            ImGui.SameLine();
        }

        ImGui.PushStyleColor(ImGuiCol.Text, ModernTheme.Colors.TextDim);
        ImGui.TextUnformatted(label);
        ImGui.PopStyleColor();

        if (!isVertical)
            ImGui.SameLine();
    }

    private bool IconButton(string icon, string tooltip, bool isActive)
    {
        var color = isActive ? ModernTheme.Colors.Primary : ModernTheme.Colors.Panel;
        var hoverColor = isActive ? ModernTheme.Colors.PrimaryHover : ModernTheme.Colors.PanelHover;
        var activeColor = isActive ? ModernTheme.Colors.PrimaryActive : ModernTheme.Colors.BackgroundLight;

        ImGui.PushStyleColor(ImGuiCol.Button, color);
        ImGui.PushStyleColor(ImGuiCol.ButtonHovered, hoverColor);
        ImGui.PushStyleColor(ImGuiCol.ButtonActive, activeColor);
        ImGui.PushStyleVar(ImGuiStyleVar.FramePadding, new Vector2(14, 14));

        bool clicked = ImGui.Button(icon, new Vector2(52, 52));

        ImGui.PopStyleVar();
        ImGui.PopStyleColor(3);

        if (ImGui.IsItemHovered())
        {
            ImGui.BeginTooltip();
            ImGui.PushTextWrapPos(ImGui.GetFontSize() * 15.0f);
            ImGui.TextUnformatted(tooltip);
            ImGui.PopTextWrapPos();
            ImGui.EndTooltip();
        }

        return clicked;
    }

    private void RenderSeparator(bool isVertical)
    {
        if (isVertical)
        {
            ImGui.Dummy(new Vector2(0, 6));
            ImGui.Separator();
            ImGui.Dummy(new Vector2(0, 6));
        }
        else
        {
            ImGui.SameLine();
            ImGui.Dummy(new Vector2(4, 48));
            ImGui.SameLine();
        }
    }

    private void NextItem(bool isVertical)
    {
        if (!isVertical)
            ImGui.SameLine();
    }
}

public enum ToolbarPosition
{
    Left,
    Right,
    Top,
    Bottom
}

// ToolMode moved to ModernToolbar.cs to avoid conflict
