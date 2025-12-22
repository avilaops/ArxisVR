using System.Numerics;
using Silk.NET.OpenGL;
using ImGuiNET;

namespace Vizzio.UI;

/// <summary>
/// 2D minimap and 3D compass for navigation orientation
/// </summary>
public class MinimapCompass : IDisposable
{
    private GL? _gl;
    private uint _compassShader;
    private uint _minimapShader;
    private uint _compassVAO;
    private uint _compassVBO;
    private uint _minimapVAO;
    private uint _minimapVBO;

    // Settings
    public bool ShowMinimap { get; set; } = true;
    public bool ShowCompass { get; set; } = true;
    public Vector2 MinimapPosition { get; set; } = new Vector2(0.85f, 0.85f); // Normalized screen coords
    public Vector2 MinimapSize { get; set; } = new Vector2(0.12f, 0.12f);
    public Vector2 CompassPosition { get; set; } = new Vector2(0.92f, 0.12f); // Top-right corner
    public float CompassSize { get; set; } = 0.065f;
    public bool ShowGeographicCoordinates { get; set; } = true;

    private Vector3 _cameraPosition;
    private float _cameraYaw;
    private Vector3 _modelCenter;
    private float _modelSize;

    // Geographic orientation (project north)
    public float ProjectNorth { get; set; } = 0.0f; // Degrees from true north
    public bool IsInteractive { get; set; } = true;

    // Events
    public event Action<float>? OnCompassClicked; // Returns direction in degrees

    public void Initialize(GL gl)
    {
        _gl = gl;
        CreateCompassShader();
        CreateMinimapShader();
        CreateCompassGeometry();
        CreateMinimapGeometry();
    }

    private void CreateCompassShader()
    {
        if (_gl == null) return;

        const string vertexShaderSource = @"
            #version 330 core
            layout (location = 0) in vec2 aPosition;
            layout (location = 1) in vec3 aColor;

            out vec3 Color;

            uniform vec2 screenPos;
            uniform float size;
            uniform float rotation;

            void main()
            {
                float c = cos(rotation);
                float s = sin(rotation);
                mat2 rot = mat2(c, s, -s, c);

                vec2 rotated = rot * (aPosition * size);
                vec2 pos = screenPos + rotated;

                Color = aColor;
                gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
            }
        ";

        const string fragmentShaderSource = @"
            #version 330 core
            in vec3 Color;
            out vec4 FragColor;

            void main()
            {
                FragColor = vec4(Color, 0.9);
            }
        ";

        var vertexShader = CompileShader(ShaderType.VertexShader, vertexShaderSource);
        var fragmentShader = CompileShader(ShaderType.FragmentShader, fragmentShaderSource);

        _compassShader = _gl.CreateProgram();
        _gl.AttachShader(_compassShader, vertexShader);
        _gl.AttachShader(_compassShader, fragmentShader);
        _gl.LinkProgram(_compassShader);

        _gl.DeleteShader(vertexShader);
        _gl.DeleteShader(fragmentShader);
    }

    private void CreateMinimapShader()
    {
        if (_gl == null) return;

        const string vertexShaderSource = @"
            #version 330 core
            layout (location = 0) in vec2 aPosition;
            layout (location = 1) in vec3 aColor;

            out vec3 Color;

            uniform vec2 screenPos;
            uniform vec2 size;

            void main()
            {
                vec2 pos = screenPos + aPosition * size;
                Color = aColor;
                gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
            }
        ";

        const string fragmentShaderSource = @"
            #version 330 core
            in vec3 Color;
            out vec4 FragColor;

            void main()
            {
                FragColor = vec4(Color, 0.8);
            }
        ";

        var vertexShader = CompileShader(ShaderType.VertexShader, vertexShaderSource);
        var fragmentShader = CompileShader(ShaderType.FragmentShader, fragmentShaderSource);

        _minimapShader = _gl.CreateProgram();
        _gl.AttachShader(_minimapShader, vertexShader);
        _gl.AttachShader(_minimapShader, fragmentShader);
        _gl.LinkProgram(_minimapShader);

        _gl.DeleteShader(vertexShader);
        _gl.DeleteShader(fragmentShader);
    }

    private uint CompileShader(ShaderType type, string source)
    {
        if (_gl == null) return 0;

        var shader = _gl.CreateShader(type);
        _gl.ShaderSource(shader, source);
        _gl.CompileShader(shader);

        _gl.GetShader(shader, ShaderParameterName.CompileStatus, out int compileStatus);
        if (compileStatus == 0)
        {
            var log = _gl.GetShaderInfoLog(shader);
            throw new Exception($"Minimap shader compilation failed ({type}): {log}");
        }

        return shader;
    }

    private void CreateCompassGeometry()
    {
        if (_gl == null) return;

        var vertices = new float[]
        {
            // North arrow (Red)
            0.0f, 0.0f,    1.0f, 0.0f, 0.0f,
            -0.3f, -0.5f,  0.6f, 0.0f, 0.0f,
            0.3f, -0.5f,   0.6f, 0.0f, 0.0f,

            // North indicator
            0.0f, 0.8f,    1.0f, 0.3f, 0.3f,
            0.0f, 0.5f,    1.0f, 0.3f, 0.3f,

            // South indicator (White)
            0.0f, -0.8f,   0.8f, 0.8f, 0.8f,
            0.0f, -0.5f,   0.8f, 0.8f, 0.8f,

            // East indicator
            0.8f, 0.0f,    0.5f, 0.5f, 0.5f,
            0.5f, 0.0f,    0.5f, 0.5f, 0.5f,

            // West indicator
            -0.8f, 0.0f,   0.5f, 0.5f, 0.5f,
            -0.5f, 0.0f,   0.5f, 0.5f, 0.5f,

            // Circle
        };

        // Add circle
        var verticesList = vertices.ToList();
        int segments = 32;
        for (int i = 0; i <= segments; i++)
        {
            float angle = (float)i / segments * MathF.PI * 2.0f;
            float x = MathF.Cos(angle);
            float y = MathF.Sin(angle);

            verticesList.Add(x);
            verticesList.Add(y);
            verticesList.Add(0.3f);
            verticesList.Add(0.3f);
            verticesList.Add(0.3f);
        }

        _compassVAO = _gl.GenVertexArray();
        _compassVBO = _gl.GenBuffer();

        _gl.BindVertexArray(_compassVAO);
        _gl.BindBuffer(BufferTargetARB.ArrayBuffer, _compassVBO);

        var vertexArray = verticesList.ToArray();
        unsafe
        {
            fixed (float* v = vertexArray)
            {
                _gl.BufferData(BufferTargetARB.ArrayBuffer, (nuint)(vertexArray.Length * sizeof(float)),
                    v, BufferUsageARB.StaticDraw);
            }
        }

        _gl.VertexAttribPointer(0, 2, VertexAttribPointerType.Float, false, 5 * sizeof(float), 0);
        _gl.EnableVertexAttribArray(0);

        _gl.VertexAttribPointer(1, 3, VertexAttribPointerType.Float, false, 5 * sizeof(float), 2 * sizeof(float));
        _gl.EnableVertexAttribArray(1);

        _gl.BindVertexArray(0);
    }

    private void CreateMinimapGeometry()
    {
        if (_gl == null) return;

        var vertices = new float[]
        {
            // Background square
            -1.0f, -1.0f,   0.1f, 0.1f, 0.15f,
             1.0f, -1.0f,   0.1f, 0.1f, 0.15f,
             1.0f,  1.0f,   0.1f, 0.1f, 0.15f,
            -1.0f,  1.0f,   0.1f, 0.1f, 0.15f,

            // Camera position indicator (center)
            -0.05f, -0.05f,  1.0f, 1.0f, 0.0f,
             0.05f, -0.05f,  1.0f, 1.0f, 0.0f,
             0.05f,  0.05f,  1.0f, 1.0f, 0.0f,
            -0.05f,  0.05f,  1.0f, 1.0f, 0.0f,
        };

        _minimapVAO = _gl.GenVertexArray();
        _minimapVBO = _gl.GenBuffer();

        _gl.BindVertexArray(_minimapVAO);
        _gl.BindBuffer(BufferTargetARB.ArrayBuffer, _minimapVBO);

        unsafe
        {
            fixed (float* v = vertices)
            {
                _gl.BufferData(BufferTargetARB.ArrayBuffer, (nuint)(vertices.Length * sizeof(float)),
                    v, BufferUsageARB.StaticDraw);
            }
        }

        _gl.VertexAttribPointer(0, 2, VertexAttribPointerType.Float, false, 5 * sizeof(float), 0);
        _gl.EnableVertexAttribArray(0);

        _gl.VertexAttribPointer(1, 3, VertexAttribPointerType.Float, false, 5 * sizeof(float), 2 * sizeof(float));
        _gl.EnableVertexAttribArray(1);

        _gl.BindVertexArray(0);
    }

    public void Update(Vector3 cameraPosition, float cameraYaw, Vector3 modelCenter, float modelSize)
    {
        _cameraPosition = cameraPosition;
        _cameraYaw = cameraYaw;
        _modelCenter = modelCenter;
        _modelSize = modelSize;
    }

    public void Render()
    {
        if (_gl == null) return;

        _gl.Enable(EnableCap.Blend);
        _gl.BlendFunc(BlendingFactor.SrcAlpha, BlendingFactor.OneMinusSrcAlpha);
        _gl.Disable(EnableCap.DepthTest);

        // Render compass
        if (ShowCompass)
        {
            _gl.UseProgram(_compassShader);

            var location = _gl.GetUniformLocation(_compassShader, "screenPos");
            _gl.Uniform2(location, CompassPosition.X, CompassPosition.Y);

            location = _gl.GetUniformLocation(_compassShader, "size");
            _gl.Uniform1(location, CompassSize);

            location = _gl.GetUniformLocation(_compassShader, "rotation");
            _gl.Uniform1(location, -_cameraYaw * MathF.PI / 180.0f);

            _gl.BindVertexArray(_compassVAO);

            // Draw north arrow
            _gl.DrawArrays(PrimitiveType.Triangles, 0, 3);

            // Draw direction indicators
            _gl.LineWidth(2.0f);
            _gl.DrawArrays(PrimitiveType.Lines, 3, 8);

            // Draw circle
            _gl.DrawArrays(PrimitiveType.LineLoop, 11, 33);
            _gl.LineWidth(1.0f);
        }

        // Render minimap
        if (ShowMinimap)
        {
            _gl.UseProgram(_minimapShader);

            var location = _gl.GetUniformLocation(_minimapShader, "screenPos");
            _gl.Uniform2(location, MinimapPosition.X, MinimapPosition.Y);

            location = _gl.GetUniformLocation(_minimapShader, "size");
            _gl.Uniform2(location, MinimapSize.X, MinimapSize.Y);

            _gl.BindVertexArray(_minimapVAO);

            // Draw background
            _gl.DrawArrays(PrimitiveType.TriangleFan, 0, 4);

            // Draw camera indicator
            _gl.DrawArrays(PrimitiveType.TriangleFan, 4, 4);
        }

        _gl.BindVertexArray(0);
        _gl.Enable(EnableCap.DepthTest);
        _gl.Disable(EnableCap.Blend);
    }

    /// <summary>
    /// Render geographic coordinates overlay with ImGui (AutoCAD style)
    /// </summary>
    public void RenderGeographicOverlay()
    {
        if (!ShowCompass || !ShowGeographicCoordinates) return;

        // Position at top-right with compass
        var displaySize = ImGui.GetIO().DisplaySize;
        var compassScreenPos = new Vector2(
            displaySize.X * CompassPosition.X,
            displaySize.Y * CompassPosition.Y
        );

        ImGui.SetNextWindowPos(new Vector2(compassScreenPos.X + 80, compassScreenPos.Y - 50));
        ImGui.SetNextWindowSize(new Vector2(160, 140));
        ImGui.PushStyleVar(ImGuiStyleVar.WindowPadding, new Vector2(8, 8));
        ImGui.PushStyleVar(ImGuiStyleVar.WindowRounding, 8);
        ImGui.PushStyleColor(ImGuiCol.WindowBg, new Vector4(0.1f, 0.1f, 0.15f, 0.92f));

        if (ImGui.Begin("##GeographicCoords", ImGuiWindowFlags.NoTitleBar | ImGuiWindowFlags.NoResize | ImGuiWindowFlags.NoMove))
        {
            ImGui.PushFont(ImGui.GetFont());

            // Title
            ImGui.PushStyleColor(ImGuiCol.Text, new Vector4(0.8f, 0.9f, 1.0f, 1.0f));
            ImGui.Text("🧭 Geographic");
            ImGui.PopStyleColor();
            ImGui.Separator();

            // Calculate bearing from camera yaw
            float bearing = (_cameraYaw + ProjectNorth) % 360.0f;
            if (bearing < 0) bearing += 360.0f;

            string direction = GetCardinalDirection(bearing);

            // Display bearing with color based on cardinal direction
            ImGui.Text($"Bearing: {bearing:F1}°");

            ImGui.PushStyleColor(ImGuiCol.Text, new Vector4(1.0f, 0.3f, 0.3f, 1.0f));
            ImGui.Text($"➤ {direction}");
            ImGui.PopStyleColor();

            ImGui.Spacing();

            // Cardinal directions as clickable buttons (AutoCAD style)
            ImGui.Text("Quick Orient:");

            // North button
            if (ImGui.Button("N🧭", new Vector2(35, 25)))
            {
                OnCompassClicked?.Invoke(0.0f);
            }
            if (ImGui.IsItemHovered())
                ImGui.SetTooltip("Face North");

            // East and West
            ImGui.SameLine();
            if (ImGui.Button("E", new Vector2(35, 25)))
            {
                OnCompassClicked?.Invoke(90.0f);
            }
            if (ImGui.IsItemHovered())
                ImGui.SetTooltip("Face East");

            ImGui.SameLine();
            if (ImGui.Button("S", new Vector2(35, 25)))
            {
                OnCompassClicked?.Invoke(180.0f);
            }
            if (ImGui.IsItemHovered())
                ImGui.SetTooltip("Face South");

            ImGui.SameLine();
            if (ImGui.Button("W", new Vector2(35, 25)))
            {
                OnCompassClicked?.Invoke(270.0f);
            }
            if (ImGui.IsItemHovered())
                ImGui.SetTooltip("Face West");

            ImGui.PopFont();
        }
        ImGui.End();

        ImGui.PopStyleColor();
        ImGui.PopStyleVar(2);
    }

    private string GetCardinalDirection(float bearing)
    {
        // 16-point compass rose
        var directions = new[] { "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                                "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW" };
        int index = (int)Math.Round(bearing / 22.5f) % 16;
        return directions[index];
    }

    public void Dispose()
    {
        if (_gl != null)
        {
            _gl.DeleteVertexArray(_compassVAO);
            _gl.DeleteBuffer(_compassVBO);
            _gl.DeleteVertexArray(_minimapVAO);
            _gl.DeleteBuffer(_minimapVBO);
            _gl.DeleteProgram(_compassShader);
            _gl.DeleteProgram(_minimapShader);
        }
    }
}
