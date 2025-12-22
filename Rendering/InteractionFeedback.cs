using System.Numerics;
using Silk.NET.OpenGL;

namespace ArxisVR.Rendering;

/// <summary>
/// Provides visual feedback for user interactions (hover, selection, navigation)
/// </summary>
public class InteractionFeedback : IDisposable
{
    private GL? _gl;
    private uint _shaderProgram;
    private uint _cursorVAO;
    private uint _cursorVBO;
    private uint _selectionRingVAO;
    private uint _selectionRingVBO;
    // Navigation path removed - not needed for current implementation

    // Animation state
    private float _hoverPulseTime;
    private float _selectionGlowTime;
    private Vector3? _hoverPosition;
    private Vector3? _selectionPosition;

    // Settings
    public bool ShowHoverIndicator { get; set; } = true;
    public bool ShowSelectionRing { get; set; } = true;
    public bool ShowNavigationPath { get; set; } = true;
    public float HoverIndicatorSize { get; set; } = 0.5f;
    public float SelectionRingSize { get; set; } = 1.0f;
    public Vector3 HoverColor { get; set; } = new Vector3(0.3f, 0.8f, 1.0f); // Cyan
    public Vector3 SelectionColor { get; set; } = new Vector3(1.0f, 0.8f, 0.0f); // Gold

    public void Initialize(GL gl)
    {
        _gl = gl;
        CreateShaderProgram();
        CreateCursorGeometry();
        CreateSelectionRingGeometry();
    }

    private void CreateShaderProgram()
    {
        if (_gl == null) return;

        const string vertexShaderSource = @"
            #version 330 core
            layout (location = 0) in vec3 aPosition;
            layout (location = 1) in vec3 aColor;

            out vec3 Color;
            out float Distance;

            uniform mat4 view;
            uniform mat4 projection;
            uniform mat4 model;
            uniform vec3 cameraPos;

            void main()
            {
                vec4 worldPos = model * vec4(aPosition, 1.0);
                Color = aColor;
                Distance = length(worldPos.xyz - cameraPos);
                gl_Position = projection * view * worldPos;
            }
        ";

        const string fragmentShaderSource = @"
            #version 330 core
            in vec3 Color;
            in float Distance;
            out vec4 FragColor;

            uniform float alpha;
            uniform float pulse;

            void main()
            {
                // Fade based on distance
                float distanceFade = 1.0 - smoothstep(10.0, 50.0, Distance);

                // Pulsing animation
                float pulseEffect = 0.7 + 0.3 * pulse;

                FragColor = vec4(Color, alpha * distanceFade * pulseEffect);
            }
        ";

        var vertexShader = CompileShader(ShaderType.VertexShader, vertexShaderSource);
        var fragmentShader = CompileShader(ShaderType.FragmentShader, fragmentShaderSource);

        _shaderProgram = _gl.CreateProgram();
        _gl.AttachShader(_shaderProgram, vertexShader);
        _gl.AttachShader(_shaderProgram, fragmentShader);
        _gl.LinkProgram(_shaderProgram);

        _gl.GetProgram(_shaderProgram, ProgramPropertyARB.LinkStatus, out int linkStatus);
        if (linkStatus == 0)
        {
            var log = _gl.GetProgramInfoLog(_shaderProgram);
            throw new Exception($"Feedback shader program linking failed: {log}");
        }

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
            throw new Exception($"Feedback shader compilation failed ({type}): {log}");
        }

        return shader;
    }

    private void CreateCursorGeometry()
    {
        if (_gl == null) return;

        // Create a circle for hover cursor
        int segments = 32;
        var vertices = new List<float>();

        for (int i = 0; i <= segments; i++)
        {
            float angle = (float)i / segments * MathF.PI * 2.0f;
            float x = MathF.Cos(angle) * 0.5f;
            float z = MathF.Sin(angle) * 0.5f;

            vertices.Add(x);
            vertices.Add(0.0f);
            vertices.Add(z);
            vertices.Add(HoverColor.X);
            vertices.Add(HoverColor.Y);
            vertices.Add(HoverColor.Z);
        }

        _cursorVAO = _gl.GenVertexArray();
        _cursorVBO = _gl.GenBuffer();

        _gl.BindVertexArray(_cursorVAO);
        _gl.BindBuffer(BufferTargetARB.ArrayBuffer, _cursorVBO);

        var vertexArray = vertices.ToArray();
        unsafe
        {
            fixed (float* v = vertexArray)
            {
                _gl.BufferData(BufferTargetARB.ArrayBuffer, (nuint)(vertexArray.Length * sizeof(float)),
                    v, BufferUsageARB.StaticDraw);
            }
        }

        // Position attribute
        _gl.VertexAttribPointer(0, 3, VertexAttribPointerType.Float, false, 6 * sizeof(float), 0);
        _gl.EnableVertexAttribArray(0);

        // Color attribute
        _gl.VertexAttribPointer(1, 3, VertexAttribPointerType.Float, false, 6 * sizeof(float), 3 * sizeof(float));
        _gl.EnableVertexAttribArray(1);

        _gl.BindVertexArray(0);
    }

    private void CreateSelectionRingGeometry()
    {
        if (_gl == null) return;

        // Create a ring for selection
        int segments = 64;
        var vertices = new List<float>();

        // Outer ring
        for (int i = 0; i <= segments; i++)
        {
            float angle = (float)i / segments * MathF.PI * 2.0f;
            float x = MathF.Cos(angle);
            float z = MathF.Sin(angle);

            vertices.Add(x);
            vertices.Add(0.0f);
            vertices.Add(z);
            vertices.Add(SelectionColor.X);
            vertices.Add(SelectionColor.Y);
            vertices.Add(SelectionColor.Z);
        }

        _selectionRingVAO = _gl.GenVertexArray();
        _selectionRingVBO = _gl.GenBuffer();

        _gl.BindVertexArray(_selectionRingVAO);
        _gl.BindBuffer(BufferTargetARB.ArrayBuffer, _selectionRingVBO);

        var vertexArray = vertices.ToArray();
        unsafe
        {
            fixed (float* v = vertexArray)
            {
                _gl.BufferData(BufferTargetARB.ArrayBuffer, (nuint)(vertexArray.Length * sizeof(float)),
                    v, BufferUsageARB.StaticDraw);
            }
        }

        _gl.VertexAttribPointer(0, 3, VertexAttribPointerType.Float, false, 6 * sizeof(float), 0);
        _gl.EnableVertexAttribArray(0);

        _gl.VertexAttribPointer(1, 3, VertexAttribPointerType.Float, false, 6 * sizeof(float), 3 * sizeof(float));
        _gl.EnableVertexAttribArray(1);

        _gl.BindVertexArray(0);
    }

    public void Update(float deltaTime)
    {
        _hoverPulseTime += deltaTime * 2.0f;
        _selectionGlowTime += deltaTime * 3.0f;
    }

    public void SetHoverPosition(Vector3? position)
    {
        _hoverPosition = position;
    }

    public void SetSelectionPosition(Vector3? position)
    {
        _selectionPosition = position;
    }

    public void Render(Camera camera)
    {
        if (_gl == null) return;

        _gl.UseProgram(_shaderProgram);
        _gl.Enable(EnableCap.Blend);
        _gl.BlendFunc(BlendingFactor.SrcAlpha, BlendingFactor.OneMinusSrcAlpha);
        _gl.Disable(EnableCap.DepthTest);

        var view = camera.GetViewMatrix();
        var projection = camera.GetProjectionMatrix();

        SetUniformMatrix4("view", view);
        SetUniformMatrix4("projection", projection);
        SetUniformVector3("cameraPos", camera.Position);

        // Render hover indicator
        if (ShowHoverIndicator && _hoverPosition.HasValue)
        {
            var model = Matrix4x4.CreateScale(HoverIndicatorSize) *
                       Matrix4x4.CreateTranslation(_hoverPosition.Value);

            SetUniformMatrix4("model", model);
            SetUniform1("alpha", 0.6f);
            SetUniform1("pulse", MathF.Sin(_hoverPulseTime));

            _gl.LineWidth(2.0f);
            _gl.BindVertexArray(_cursorVAO);
            _gl.DrawArrays(PrimitiveType.LineLoop, 0, 33);
        }

        // Render selection ring
        if (ShowSelectionRing && _selectionPosition.HasValue)
        {
            var model = Matrix4x4.CreateScale(SelectionRingSize) *
                       Matrix4x4.CreateTranslation(_selectionPosition.Value);

            SetUniformMatrix4("model", model);
            SetUniform1("alpha", 0.8f);
            SetUniform1("pulse", MathF.Sin(_selectionGlowTime));

            _gl.LineWidth(3.0f);
            _gl.BindVertexArray(_selectionRingVAO);
            _gl.DrawArrays(PrimitiveType.LineLoop, 0, 65);
        }

        _gl.BindVertexArray(0);
        _gl.LineWidth(1.0f);
        _gl.Enable(EnableCap.DepthTest);
        _gl.Disable(EnableCap.Blend);
    }

    private void SetUniformMatrix4(string name, Matrix4x4 matrix)
    {
        if (_gl == null) return;

        var location = _gl.GetUniformLocation(_shaderProgram, name);
        unsafe
        {
            _gl.UniformMatrix4(location, 1, false, (float*)&matrix);
        }
    }

    private void SetUniformVector3(string name, Vector3 vector)
    {
        if (_gl == null) return;

        var location = _gl.GetUniformLocation(_shaderProgram, name);
        _gl.Uniform3(location, vector.X, vector.Y, vector.Z);
    }

    private void SetUniform1(string name, float value)
    {
        if (_gl == null) return;

        var location = _gl.GetUniformLocation(_shaderProgram, name);
        _gl.Uniform1(location, value);
    }

    public void Dispose()
    {
        if (_gl != null)
        {
            _gl.DeleteVertexArray(_cursorVAO);
            _gl.DeleteBuffer(_cursorVBO);
            _gl.DeleteVertexArray(_selectionRingVAO);
            _gl.DeleteBuffer(_selectionRingVBO);
            _gl.DeleteProgram(_shaderProgram);
        }
    }
}
