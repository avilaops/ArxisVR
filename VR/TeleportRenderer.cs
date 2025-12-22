using System.Numerics;
using Silk.NET.OpenGL;
using ArxisVR.Rendering;

namespace ArxisVR.VR;

/// <summary>
/// Renders teleport arc and target indicator for VR navigation
/// </summary>
public class TeleportRenderer : IDisposable
{
    private GL? _gl;
    private uint _shaderProgram;
    private uint _arcVAO;
    private uint _arcVBO;
    private uint _targetVAO;
    private uint _targetVBO;
    private uint _reticleVAO;
    private uint _reticleVBO;
    
    private List<Vector3> _arcPoints = new();
    private bool _isValidTarget;
    
    public Vector3 ValidColor { get; set; } = new Vector3(0.0f, 1.0f, 0.3f); // Green
    public Vector3 InvalidColor { get; set; } = new Vector3(1.0f, 0.3f, 0.0f); // Red
    public float ArcThickness { get; set; } = 2.0f;
    public float TargetRadius { get; set; } = 1.0f;

    public void Initialize(GL gl)
    {
        _gl = gl;
        CreateShaderProgram();
        CreateArcGeometry();
        CreateTargetGeometry();
        CreateReticleGeometry();
    }

    private void CreateShaderProgram()
    {
        if (_gl == null) return;

        const string vertexShaderSource = @"
            #version 330 core
            layout (location = 0) in vec3 aPosition;
            layout (location = 1) in vec3 aColor;
            
            out vec3 Color;
            
            uniform mat4 view;
            uniform mat4 projection;
            uniform mat4 model;
            
            void main()
            {
                Color = aColor;
                gl_Position = projection * view * model * vec4(aPosition, 1.0);
            }
        ";

        const string fragmentShaderSource = @"
            #version 330 core
            in vec3 Color;
            out vec4 FragColor;
            
            uniform float alpha;
            
            void main()
            {
                FragColor = vec4(Color, alpha);
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
            throw new Exception($"Teleport shader program linking failed: {log}");
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
            throw new Exception($"Teleport shader compilation failed ({type}): {log}");
        }

        return shader;
    }

    private void CreateArcGeometry()
    {
        if (_gl == null) return;

        _arcVAO = _gl.GenVertexArray();
        _arcVBO = _gl.GenBuffer();

        _gl.BindVertexArray(_arcVAO);
        _gl.BindBuffer(BufferTargetARB.ArrayBuffer, _arcVBO);

        // Initial empty buffer
        unsafe
        {
            _gl.BufferData(BufferTargetARB.ArrayBuffer, 1000 * 6 * sizeof(float),
                (void*)0, BufferUsageARB.DynamicDraw);
        }

        _gl.VertexAttribPointer(0, 3, VertexAttribPointerType.Float, false, 6 * sizeof(float), 0);
        _gl.EnableVertexAttribArray(0);

        _gl.VertexAttribPointer(1, 3, VertexAttribPointerType.Float, false, 6 * sizeof(float), 3 * sizeof(float));
        _gl.EnableVertexAttribArray(1);

        _gl.BindVertexArray(0);
    }

    private void CreateTargetGeometry()
    {
        if (_gl == null) return;

        // Create target circle
        int segments = 32;
        var vertices = new List<float>();
        
        for (int i = 0; i <= segments; i++)
        {
            float angle = (float)i / segments * MathF.PI * 2.0f;
            float x = MathF.Cos(angle);
            float z = MathF.Sin(angle);
            
            vertices.Add(x);
            vertices.Add(0.0f);
            vertices.Add(z);
            vertices.Add(1.0f); // Color will be set via uniform
            vertices.Add(1.0f);
            vertices.Add(1.0f);
        }

        _targetVAO = _gl.GenVertexArray();
        _targetVBO = _gl.GenBuffer();

        _gl.BindVertexArray(_targetVAO);
        _gl.BindBuffer(BufferTargetARB.ArrayBuffer, _targetVBO);
        
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

    private void CreateReticleGeometry()
    {
        if (_gl == null) return;

        // Create crosshair reticle
        var vertices = new float[]
        {
            // Horizontal line
            -0.5f, 0.0f, 0.0f,  1.0f, 1.0f, 1.0f,
             0.5f, 0.0f, 0.0f,  1.0f, 1.0f, 1.0f,
            
            // Vertical line
             0.0f, 0.0f, -0.5f,  1.0f, 1.0f, 1.0f,
             0.0f, 0.0f,  0.5f,  1.0f, 1.0f, 1.0f,
        };

        _reticleVAO = _gl.GenVertexArray();
        _reticleVBO = _gl.GenBuffer();

        _gl.BindVertexArray(_reticleVAO);
        _gl.BindBuffer(BufferTargetARB.ArrayBuffer, _reticleVBO);
        
        unsafe
        {
            fixed (float* v = vertices)
            {
                _gl.BufferData(BufferTargetARB.ArrayBuffer, (nuint)(vertices.Length * sizeof(float)),
                    v, BufferUsageARB.StaticDraw);
            }
        }

        _gl.VertexAttribPointer(0, 3, VertexAttribPointerType.Float, false, 6 * sizeof(float), 0);
        _gl.EnableVertexAttribArray(0);

        _gl.VertexAttribPointer(1, 3, VertexAttribPointerType.Float, false, 6 * sizeof(float), 3 * sizeof(float));
        _gl.EnableVertexAttribArray(1);

        _gl.BindVertexArray(0);
    }

    public void CalculateTeleportArc(Vector3 origin, Vector3 direction, float maxDistance, out Vector3 target, out bool isValid)
    {
        _arcPoints.Clear();
        
        // Physics simulation for arc
        Vector3 velocity = direction * 10.0f; // Initial velocity
        Vector3 position = origin;
        Vector3 gravity = new Vector3(0, -9.8f, 0);
        float timeStep = 0.1f;
        float maxTime = 3.0f;
        
        target = origin;
        isValid = false;
        
        for (float t = 0; t < maxTime; t += timeStep)
        {
            Vector3 nextPos = position + velocity * timeStep;
            velocity += gravity * timeStep;
            
            _arcPoints.Add(position);
            
            // Check if hit ground or max distance
            if (nextPos.Y <= 0.0f || Vector3.Distance(origin, nextPos) > maxDistance)
            {
                target = new Vector3(nextPos.X, 0.0f, nextPos.Z);
                isValid = Vector3.Distance(origin, target) <= maxDistance && target.Y >= -0.5f;
                _isValidTarget = isValid;
                break;
            }
            
            position = nextPos;
        }
    }

    public void UpdateArcGeometry()
    {
        if (_gl == null || _arcPoints.Count == 0) return;

        var color = _isValidTarget ? ValidColor : InvalidColor;
        var vertices = new List<float>();
        
        foreach (var point in _arcPoints)
        {
            vertices.Add(point.X);
            vertices.Add(point.Y);
            vertices.Add(point.Z);
            vertices.Add(color.X);
            vertices.Add(color.Y);
            vertices.Add(color.Z);
        }

        _gl.BindBuffer(BufferTargetARB.ArrayBuffer, _arcVBO);
        var vertexArray = vertices.ToArray();
        unsafe
        {
            fixed (float* v = vertexArray)
            {
                _gl.BufferSubData(BufferTargetARB.ArrayBuffer, 0, (nuint)(vertexArray.Length * sizeof(float)), v);
            }
        }
    }

    public void Render(Camera camera, Vector3 targetPosition)
    {
        if (_gl == null || _arcPoints.Count == 0) return;

        _gl.UseProgram(_shaderProgram);
        _gl.Enable(EnableCap.Blend);
        _gl.BlendFunc(BlendingFactor.SrcAlpha, BlendingFactor.OneMinusSrcAlpha);
        _gl.Disable(EnableCap.DepthTest);

        var view = camera.GetViewMatrix();
        var projection = camera.GetProjectionMatrix();
        var model = Matrix4x4.Identity;

        SetUniformMatrix4("view", view);
        SetUniformMatrix4("projection", projection);
        SetUniformMatrix4("model", model);

        // Render arc
        _gl.LineWidth(ArcThickness);
        SetUniform1("alpha", 0.8f);
        _gl.BindVertexArray(_arcVAO);
        _gl.DrawArrays(PrimitiveType.LineStrip, 0, (uint)_arcPoints.Count);

        // Render target circle
        var targetModel = Matrix4x4.CreateScale(TargetRadius) *
                         Matrix4x4.CreateTranslation(targetPosition);
        SetUniformMatrix4("model", targetModel);
        SetUniform1("alpha", _isValidTarget ? 0.5f : 0.3f);
        
        _gl.LineWidth(3.0f);
        _gl.BindVertexArray(_targetVAO);
        _gl.DrawArrays(PrimitiveType.LineLoop, 0, 33);

        // Render reticle
        var reticleModel = Matrix4x4.CreateScale(0.3f) *
                          Matrix4x4.CreateTranslation(targetPosition + new Vector3(0, 0.01f, 0));
        SetUniformMatrix4("model", reticleModel);
        SetUniform1("alpha", 1.0f);
        
        _gl.BindVertexArray(_reticleVAO);
        _gl.DrawArrays(PrimitiveType.Lines, 0, 4);

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
            _gl.DeleteVertexArray(_arcVAO);
            _gl.DeleteBuffer(_arcVBO);
            _gl.DeleteVertexArray(_targetVAO);
            _gl.DeleteBuffer(_targetVBO);
            _gl.DeleteVertexArray(_reticleVAO);
            _gl.DeleteBuffer(_reticleVBO);
            _gl.DeleteProgram(_shaderProgram);
        }
    }
}
