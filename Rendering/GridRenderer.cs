using System.Numerics;
using Silk.NET.OpenGL;

namespace ArxisVR.Rendering;

/// <summary>
/// Renders a 3D grid and orientation axes for better spatial awareness
/// </summary>
public class GridRenderer : IDisposable
{
    private GL? _gl;
    private uint _shaderProgram;
    private uint _gridVAO;
    private uint _gridVBO;
    private uint _axesVAO;
    private uint _axesVBO;
    private int _gridLineCount;
    
    public bool ShowGrid { get; set; } = true;
    public bool ShowAxes { get; set; } = true;
    public float GridSize { get; set; } = 100.0f;
    public float GridSpacing { get; set; } = 1.0f;
    public Vector3 GridColor { get; set; } = new Vector3(0.3f, 0.3f, 0.3f);
    public float GridAlpha { get; set; } = 0.5f;

    public void Initialize(GL gl)
    {
        _gl = gl;
        CreateShaderProgram();
        CreateGridGeometry();
        CreateAxesGeometry();
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
            
            void main()
            {
                Color = aColor;
                gl_Position = projection * view * vec4(aPosition, 1.0);
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
            throw new Exception($"Grid shader program linking failed: {log}");
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
            throw new Exception($"Grid shader compilation failed ({type}): {log}");
        }

        return shader;
    }

    private void CreateGridGeometry()
    {
        if (_gl == null) return;

        var vertices = new List<float>();
        
        // Create grid lines
        int lineCount = (int)(GridSize / GridSpacing);
        _gridLineCount = lineCount * 4; // 2 lines per axis * 2 axes
        
        float halfSize = GridSize / 2.0f;
        
        // Lines parallel to X axis
        for (int i = -lineCount / 2; i <= lineCount / 2; i++)
        {
            float z = i * GridSpacing;
            
            // Start point
            vertices.Add(-halfSize); // x
            vertices.Add(0.0f);      // y
            vertices.Add(z);         // z
            vertices.Add(GridColor.X); // r
            vertices.Add(GridColor.Y); // g
            vertices.Add(GridColor.Z); // b
            
            // End point
            vertices.Add(halfSize);  // x
            vertices.Add(0.0f);      // y
            vertices.Add(z);         // z
            vertices.Add(GridColor.X); // r
            vertices.Add(GridColor.Y); // g
            vertices.Add(GridColor.Z); // b
        }
        
        // Lines parallel to Z axis
        for (int i = -lineCount / 2; i <= lineCount / 2; i++)
        {
            float x = i * GridSpacing;
            
            // Start point
            vertices.Add(x);         // x
            vertices.Add(0.0f);      // y
            vertices.Add(-halfSize); // z
            vertices.Add(GridColor.X); // r
            vertices.Add(GridColor.Y); // g
            vertices.Add(GridColor.Z); // b
            
            // End point
            vertices.Add(x);         // x
            vertices.Add(0.0f);      // y
            vertices.Add(halfSize);  // z
            vertices.Add(GridColor.X); // r
            vertices.Add(GridColor.Y); // g
            vertices.Add(GridColor.Z); // b
        }

        _gridVAO = _gl.GenVertexArray();
        _gridVBO = _gl.GenBuffer();

        _gl.BindVertexArray(_gridVAO);
        _gl.BindBuffer(BufferTargetARB.ArrayBuffer, _gridVBO);
        
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

    private void CreateAxesGeometry()
    {
        if (_gl == null) return;

        float axisLength = 5.0f;
        
        var vertices = new float[]
        {
            // X axis (Red)
            0.0f, 0.0f, 0.0f,  1.0f, 0.0f, 0.0f,
            axisLength, 0.0f, 0.0f,  1.0f, 0.0f, 0.0f,
            
            // Y axis (Green)
            0.0f, 0.0f, 0.0f,  0.0f, 1.0f, 0.0f,
            0.0f, axisLength, 0.0f,  0.0f, 1.0f, 0.0f,
            
            // Z axis (Blue)
            0.0f, 0.0f, 0.0f,  0.0f, 0.0f, 1.0f,
            0.0f, 0.0f, axisLength,  0.0f, 0.0f, 1.0f,
        };

        _axesVAO = _gl.GenVertexArray();
        _axesVBO = _gl.GenBuffer();

        _gl.BindVertexArray(_axesVAO);
        _gl.BindBuffer(BufferTargetARB.ArrayBuffer, _axesVBO);
        
        unsafe
        {
            fixed (float* v = vertices)
            {
                _gl.BufferData(BufferTargetARB.ArrayBuffer, (nuint)(vertices.Length * sizeof(float)),
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

        // Render grid
        if (ShowGrid)
        {
            SetUniform1("alpha", GridAlpha);
            _gl.BindVertexArray(_gridVAO);
            _gl.DrawArrays(PrimitiveType.Lines, 0, (uint)(_gridLineCount * 2));
        }

        // Render axes
        if (ShowAxes)
        {
            _gl.LineWidth(3.0f);
            SetUniform1("alpha", 1.0f);
            _gl.BindVertexArray(_axesVAO);
            _gl.DrawArrays(PrimitiveType.Lines, 0, 6);
            _gl.LineWidth(1.0f);
        }

        _gl.BindVertexArray(0);
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
            _gl.DeleteVertexArray(_gridVAO);
            _gl.DeleteBuffer(_gridVBO);
            _gl.DeleteVertexArray(_axesVAO);
            _gl.DeleteBuffer(_axesVBO);
            _gl.DeleteProgram(_shaderProgram);
        }
    }
}
