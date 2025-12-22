using ImGuiNET;
using System.Numerics;

namespace ArxisVR.UI;

/// <summary>
/// Modern theme for ArxisVR with professional colors and styling
/// </summary>
public static class ModernTheme
{
    // Color Palette
    public static class Colors
    {
        // Primary Colors
        public static Vector4 Primary = new(0.2f, 0.4f, 0.8f, 1.0f);           // Blue
        public static Vector4 PrimaryHover = new(0.3f, 0.5f, 0.9f, 1.0f);
        public static Vector4 PrimaryActive = new(0.15f, 0.35f, 0.7f, 1.0f);
        
        // Background Colors
        public static Vector4 Background = new(0.12f, 0.12f, 0.14f, 1.0f);     // Dark
        public static Vector4 BackgroundDark = new(0.08f, 0.08f, 0.10f, 1.0f);
        public static Vector4 BackgroundLight = new(0.16f, 0.16f, 0.18f, 1.0f);
        
        // UI Element Colors
        public static Vector4 Panel = new(0.14f, 0.14f, 0.16f, 0.95f);
        public static Vector4 PanelHover = new(0.18f, 0.18f, 0.20f, 1.0f);
        public static Vector4 Border = new(0.3f, 0.3f, 0.35f, 1.0f);
        public static Vector4 Separator = new(0.25f, 0.25f, 0.28f, 1.0f);
        
        // Text Colors
        public static Vector4 Text = new(0.95f, 0.95f, 0.95f, 1.0f);
        public static Vector4 TextDim = new(0.6f, 0.6f, 0.65f, 1.0f);
        public static Vector4 TextBright = new(1.0f, 1.0f, 1.0f, 1.0f);
        
        // Status Colors
        public static Vector4 Success = new(0.2f, 0.8f, 0.3f, 1.0f);
        public static Vector4 Warning = new(0.9f, 0.7f, 0.2f, 1.0f);
        public static Vector4 Error = new(0.9f, 0.2f, 0.2f, 1.0f);
        public static Vector4 Info = new(0.3f, 0.7f, 0.9f, 1.0f);
        
        // Element Type Colors (for IFC elements)
        public static Vector4 Wall = new(0.7f, 0.5f, 0.3f, 1.0f);
        public static Vector4 Floor = new(0.5f, 0.5f, 0.5f, 1.0f);
        public static Vector4 Roof = new(0.6f, 0.3f, 0.3f, 1.0f);
        public static Vector4 Beam = new(0.8f, 0.6f, 0.2f, 1.0f);
        public static Vector4 Column = new(0.4f, 0.6f, 0.8f, 1.0f);
        public static Vector4 Door = new(0.4f, 0.7f, 0.4f, 1.0f);
        public static Vector4 Window = new(0.3f, 0.7f, 0.9f, 1.0f);
        
        // AI Colors
        public static Vector4 AIAssistant = new(0.6f, 0.4f, 0.9f, 1.0f);
        public static Vector4 AIUser = new(0.3f, 0.6f, 0.8f, 1.0f);
    }
    
    // Sizing
    public static class Sizes
    {
        public const float WindowPadding = 12.0f;
        public const float FramePadding = 8.0f;
        public const float ItemSpacing = 8.0f;
        public const float ItemInnerSpacing = 6.0f;
        public const float IndentSpacing = 20.0f;
        public const float ScrollbarSize = 14.0f;
        public const float GrabMinSize = 12.0f;
        
        public const float ButtonHeight = 32.0f;
        public const float InputHeight = 28.0f;
        public const float TitleBarHeight = 36.0f;
        
        public const float BorderRadius = 6.0f;
        public const float BorderSize = 1.0f;
    }
    
    /// <summary>
    /// Apply modern theme to ImGui
    /// </summary>
    public static void Apply()
    {
        var style = ImGui.GetStyle();
        
        // Rounding
        style.WindowRounding = Sizes.BorderRadius;
        style.ChildRounding = Sizes.BorderRadius;
        style.FrameRounding = Sizes.BorderRadius;
        style.PopupRounding = Sizes.BorderRadius;
        style.ScrollbarRounding = Sizes.BorderRadius;
        style.GrabRounding = Sizes.BorderRadius;
        style.TabRounding = Sizes.BorderRadius;
        
        // Borders
        style.WindowBorderSize = Sizes.BorderSize;
        style.ChildBorderSize = Sizes.BorderSize;
        style.PopupBorderSize = Sizes.BorderSize;
        style.FrameBorderSize = 0.0f;
        style.TabBorderSize = 0.0f;
        
        // Padding & Spacing
        style.WindowPadding = new Vector2(Sizes.WindowPadding, Sizes.WindowPadding);
        style.FramePadding = new Vector2(Sizes.FramePadding, Sizes.FramePadding);
        style.ItemSpacing = new Vector2(Sizes.ItemSpacing, Sizes.ItemSpacing);
        style.ItemInnerSpacing = new Vector2(Sizes.ItemInnerSpacing, Sizes.ItemInnerSpacing);
        style.IndentSpacing = Sizes.IndentSpacing;
        style.ScrollbarSize = Sizes.ScrollbarSize;
        style.GrabMinSize = Sizes.GrabMinSize;
        
        // Title Bar
        style.WindowTitleAlign = new Vector2(0.5f, 0.5f);
        
        // Apply Colors
        var colors = style.Colors;
        
        // Window
        colors[(int)ImGuiCol.WindowBg] = Colors.Background;
        colors[(int)ImGuiCol.ChildBg] = Colors.Panel;
        colors[(int)ImGuiCol.PopupBg] = Colors.Panel;
        colors[(int)ImGuiCol.Border] = Colors.Border;
        colors[(int)ImGuiCol.BorderShadow] = new Vector4(0, 0, 0, 0);
        
        // Title
        colors[(int)ImGuiCol.TitleBg] = Colors.BackgroundDark;
        colors[(int)ImGuiCol.TitleBgActive] = Colors.Primary;
        colors[(int)ImGuiCol.TitleBgCollapsed] = Colors.BackgroundDark;
        
        // Menu
        colors[(int)ImGuiCol.MenuBarBg] = Colors.BackgroundDark;
        
        // Text
        colors[(int)ImGuiCol.Text] = Colors.Text;
        colors[(int)ImGuiCol.TextDisabled] = Colors.TextDim;
        colors[(int)ImGuiCol.TextSelectedBg] = Colors.Primary with { W = 0.3f };
        
        // Frame (Inputs, etc)
        colors[(int)ImGuiCol.FrameBg] = Colors.BackgroundDark;
        colors[(int)ImGuiCol.FrameBgHovered] = Colors.BackgroundLight;
        colors[(int)ImGuiCol.FrameBgActive] = Colors.PanelHover;
        
        // Button
        colors[(int)ImGuiCol.Button] = Colors.Primary;
        colors[(int)ImGuiCol.ButtonHovered] = Colors.PrimaryHover;
        colors[(int)ImGuiCol.ButtonActive] = Colors.PrimaryActive;
        
        // Header (Tree nodes, collapsible headers)
        colors[(int)ImGuiCol.Header] = Colors.Primary with { W = 0.6f };
        colors[(int)ImGuiCol.HeaderHovered] = Colors.PrimaryHover with { W = 0.8f };
        colors[(int)ImGuiCol.HeaderActive] = Colors.PrimaryActive;
        
        // Separator
        colors[(int)ImGuiCol.Separator] = Colors.Separator;
        colors[(int)ImGuiCol.SeparatorHovered] = Colors.Primary;
        colors[(int)ImGuiCol.SeparatorActive] = Colors.PrimaryActive;
        
        // Resize Grip
        colors[(int)ImGuiCol.ResizeGrip] = Colors.Primary with { W = 0.2f };
        colors[(int)ImGuiCol.ResizeGripHovered] = Colors.Primary with { W = 0.6f };
        colors[(int)ImGuiCol.ResizeGripActive] = Colors.Primary;
        
        // Tabs
        colors[(int)ImGuiCol.Tab] = Colors.BackgroundDark;
        colors[(int)ImGuiCol.TabHovered] = Colors.PrimaryHover;
        colors[(int)ImGuiCol.TabSelected] = Colors.Primary;
        colors[(int)ImGuiCol.TabDimmed] = Colors.BackgroundDark;
        colors[(int)ImGuiCol.TabDimmedSelected] = Colors.Panel;
        
        // Scrollbar
        colors[(int)ImGuiCol.ScrollbarBg] = Colors.BackgroundDark;
        colors[(int)ImGuiCol.ScrollbarGrab] = Colors.Primary with { W = 0.6f };
        colors[(int)ImGuiCol.ScrollbarGrabHovered] = Colors.PrimaryHover;
        colors[(int)ImGuiCol.ScrollbarGrabActive] = Colors.PrimaryActive;
        
        // Slider
        colors[(int)ImGuiCol.SliderGrab] = Colors.Primary;
        colors[(int)ImGuiCol.SliderGrabActive] = Colors.PrimaryActive;
        
        // Check Mark
        colors[(int)ImGuiCol.CheckMark] = Colors.Primary;
        
        // Plot
        colors[(int)ImGuiCol.PlotLines] = Colors.Primary;
        colors[(int)ImGuiCol.PlotLinesHovered] = Colors.PrimaryHover;
        colors[(int)ImGuiCol.PlotHistogram] = Colors.Primary;
        colors[(int)ImGuiCol.PlotHistogramHovered] = Colors.PrimaryHover;
        
        // Drag & Drop
        colors[(int)ImGuiCol.DragDropTarget] = Colors.Primary;
        
        // Nav
        colors[(int)ImGuiCol.NavCursor] = Colors.Primary;
        colors[(int)ImGuiCol.NavWindowingHighlight] = Colors.PrimaryHover;
        colors[(int)ImGuiCol.NavWindowingDimBg] = new Vector4(0.2f, 0.2f, 0.2f, 0.6f);
        
        // Modal
        colors[(int)ImGuiCol.ModalWindowDimBg] = new Vector4(0.1f, 0.1f, 0.1f, 0.7f);
    }
    
    /// <summary>
    /// Helper to create styled buttons
    /// </summary>
    public static bool StyledButton(string label, Vector2? size = null, Vector4? color = null)
    {
        if (color.HasValue)
        {
            ImGui.PushStyleColor(ImGuiCol.Button, color.Value);
            ImGui.PushStyleColor(ImGuiCol.ButtonHovered, color.Value with { X = color.Value.X * 1.2f, Y = color.Value.Y * 1.2f, Z = color.Value.Z * 1.2f });
            ImGui.PushStyleColor(ImGuiCol.ButtonActive, color.Value with { X = color.Value.X * 0.8f, Y = color.Value.Y * 0.8f, Z = color.Value.Z * 0.8f });
        }
        
        var result = ImGui.Button(label, size ?? new Vector2(0, Sizes.ButtonHeight));
        
        if (color.HasValue)
        {
            ImGui.PopStyleColor(3);
        }
        
        return result;
    }
    
    /// <summary>
    /// Create a colored badge
    /// </summary>
    public static void Badge(string label, Vector4 color)
    {
        ImGui.PushStyleColor(ImGuiCol.Button, color);
        ImGui.PushStyleColor(ImGuiCol.ButtonHovered, color);
        ImGui.PushStyleColor(ImGuiCol.ButtonActive, color);
        ImGui.PushStyleVar(ImGuiStyleVar.FramePadding, new Vector2(6, 2));
        ImGui.PushStyleVar(ImGuiStyleVar.FrameRounding, 12);
        
        ImGui.Button(label);
        
        ImGui.PopStyleVar(2);
        ImGui.PopStyleColor(3);
    }
    
    /// <summary>
    /// Create a section header
    /// </summary>
    public static void SectionHeader(string title)
    {
        ImGui.Spacing();
        ImGui.PushStyleColor(ImGuiCol.Text, Colors.Primary);
        ImGui.Text(title.ToUpper());
        ImGui.PopStyleColor();
        ImGui.Separator();
        ImGui.Spacing();
    }
}
