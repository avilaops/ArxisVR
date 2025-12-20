using System.Numerics;
using ImGuiNET;

namespace Vizzio.UI;

/// <summary>
/// Visual toolbar with icon buttons for quick access to tools
/// </summary>
public class Toolbar
{
    private bool _isVisible = true;
    private ToolbarPosition _position = ToolbarPosition.Left;
    
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

    // Tool events
    public event Action? OnOpenFile;
    public event Action? OnSaveScreenshot;
    public event Action? OnMeasureDistance;
    public event Action? OnMeasureArea;
    public event Action? OnMeasureAngle;
    public event Action? OnSelectMode;
    public event Action? OnPanMode;
    public event Action? OnOrbitMode;
    public event Action? OnFocusModel;
    public event Action? OnResetCamera;
    public event Action? OnToggleGrid;
    public event Action? OnToggleLighting;
    public event Action? OnToggleVR;
    public event Action? OnSettings;

    private ToolMode _currentTool = ToolMode.Select;
    
    public ToolMode CurrentTool
    {
        get => _currentTool;
        set => _currentTool = value;
    }

    public void Render(int windowWidth, int windowHeight)
    {
        if (!_isVisible)
            return;

        ImGui.PushStyleVar(ImGuiStyleVar.WindowPadding, new Vector2(8, 8));
        ImGui.PushStyleVar(ImGuiStyleVar.ItemSpacing, new Vector2(4, 8));
        ImGui.PushStyleVar(ImGuiStyleVar.WindowRounding, 8.0f);
        
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

        ImGui.PopStyleVar(3);
    }

    private void SetToolbarPosition(int windowWidth, int windowHeight)
    {
        const float margin = 10.0f;
        
        switch (_position)
        {
            case ToolbarPosition.Left:
                ImGui.SetNextWindowPos(new Vector2(margin, 60), ImGuiCond.Always);
                break;
            
            case ToolbarPosition.Right:
                ImGui.SetNextWindowPos(new Vector2(windowWidth - 70, 60), ImGuiCond.Always);
                break;
            
            case ToolbarPosition.Top:
                ImGui.SetNextWindowPos(new Vector2(windowWidth / 2 - 200, margin + 30), ImGuiCond.Always);
                break;
            
            case ToolbarPosition.Bottom:
                ImGui.SetNextWindowPos(new Vector2(windowWidth / 2 - 200, windowHeight - 70), ImGuiCond.Always);
                break;
        }
    }

    private void RenderToolbarContent()
    {
        bool isVertical = _position == ToolbarPosition.Left || _position == ToolbarPosition.Right;

        // File operations
        RenderToolbarSection("File", isVertical);
        
        if (ToolButton("📁", "Open IFC (Ctrl+O)", _currentTool == ToolMode.Select))
        {
            OnOpenFile?.Invoke();
        }
        NextItem(isVertical);
        
        if (ToolButton("📷", "Screenshot (F12)", false))
        {
            OnSaveScreenshot?.Invoke();
        }
        NextItem(isVertical);

        RenderSeparator(isVertical);

        // Selection & Navigation
        RenderToolbarSection("Tools", isVertical);
        
        if (ToolButton("🔍", "Select Mode (S)", _currentTool == ToolMode.Select))
        {
            _currentTool = ToolMode.Select;
            OnSelectMode?.Invoke();
        }
        NextItem(isVertical);
        
        if (ToolButton("✋", "Pan Mode (P)", _currentTool == ToolMode.Pan))
        {
            _currentTool = ToolMode.Pan;
            OnPanMode?.Invoke();
        }
        NextItem(isVertical);
        
        if (ToolButton("🔄", "Orbit Mode (O)", _currentTool == ToolMode.Orbit))
        {
            _currentTool = ToolMode.Orbit;
            OnOrbitMode?.Invoke();
        }
        NextItem(isVertical);

        RenderSeparator(isVertical);

        // Measurements
        RenderToolbarSection("Measure", isVertical);
        
        if (ToolButton("📏", "Distance (M)", _currentTool == ToolMode.MeasureDistance))
        {
            _currentTool = ToolMode.MeasureDistance;
            OnMeasureDistance?.Invoke();
        }
        NextItem(isVertical);
        
        if (ToolButton("📐", "Area", _currentTool == ToolMode.MeasureArea))
        {
            _currentTool = ToolMode.MeasureArea;
            OnMeasureArea?.Invoke();
        }
        NextItem(isVertical);
        
        if (ToolButton("📊", "Angle", _currentTool == ToolMode.MeasureAngle))
        {
            _currentTool = ToolMode.MeasureAngle;
            OnMeasureAngle?.Invoke();
        }
        NextItem(isVertical);

        RenderSeparator(isVertical);

        // View controls
        RenderToolbarSection("View", isVertical);
        
        if (ToolButton("🎯", "Focus (F)", false))
        {
            OnFocusModel?.Invoke();
        }
        NextItem(isVertical);
        
        if (ToolButton("↺", "Reset (R)", false))
        {
            OnResetCamera?.Invoke();
        }
        NextItem(isVertical);

        RenderSeparator(isVertical);

        // Display options
        if (ToolButton("🔆", "Lighting (L)", false))
        {
            OnToggleLighting?.Invoke();
        }
        NextItem(isVertical);
        
        if (ToolButton("🥽", "VR Mode (F2)", false))
        {
            OnToggleVR?.Invoke();
        }
        NextItem(isVertical);

        RenderSeparator(isVertical);

        // Settings
        if (ToolButton("⚙️", "Settings", false))
        {
            OnSettings?.Invoke();
        }
    }

    private bool ToolButton(string icon, string tooltip, bool isActive)
    {
        if (isActive)
        {
            ImGui.PushStyleColor(ImGuiCol.Button, new Vector4(0.4f, 0.6f, 0.8f, 1.0f));
            ImGui.PushStyleColor(ImGuiCol.ButtonHovered, new Vector4(0.5f, 0.7f, 0.9f, 1.0f));
        }

        ImGui.PushStyleVar(ImGuiStyleVar.FramePadding, new Vector2(10, 10));
        ImGui.PushFont(ImGui.GetIO().Fonts.Fonts[0]);
        
        bool clicked = ImGui.Button($"{icon}###{tooltip}", new Vector2(44, 44));
        
        ImGui.PopFont();
        ImGui.PopStyleVar();

        if (isActive)
        {
            ImGui.PopStyleColor(2);
        }

        if (ImGui.IsItemHovered())
        {
            ImGui.BeginTooltip();
            ImGui.Text(tooltip);
            ImGui.EndTooltip();
        }

        return clicked;
    }

    private void RenderToolbarSection(string name, bool isVertical)
    {
        if (!isVertical && name != "File")
        {
            ImGui.SameLine();
            ImGui.Dummy(new Vector2(4, 0));
            ImGui.SameLine();
        }
        
        // Section labels are hidden but could be shown with:
        // ImGui.TextDisabled(name);
    }

    private void RenderSeparator(bool isVertical)
    {
        if (isVertical)
        {
            ImGui.Dummy(new Vector2(0, 4));
            ImGui.Separator();
            ImGui.Dummy(new Vector2(0, 4));
        }
        else
        {
            ImGui.SameLine();
            ImGui.Dummy(new Vector2(2, 40));
            ImGui.SameLine();
        }
    }

    private void NextItem(bool isVertical)
    {
        if (!isVertical)
        {
            ImGui.SameLine();
        }
    }
}

public enum ToolbarPosition
{
    Left,
    Right,
    Top,
    Bottom
}

public enum ToolMode
{
    Select,
    Pan,
    Orbit,
    MeasureDistance,
    MeasureArea,
    MeasureAngle,
    Annotate
}
