using System.Numerics;
using Silk.NET.OpenGL;

namespace Vizzio.Rendering;

/// <summary>
/// Renders measurement lines and labels in 3D space
/// </summary>
public class MeasurementRenderer : IDisposable
{
    private GL? _gl;
    private uint _lineVao;
    private uint _lineVbo;
    private uint _shaderProgram;
    private bool _isInitialized;

    public void Initialize(GL gl)
    {
        _gl = gl;
        
        CreateLineBuffers();
        CreateShaderProgram();
        
        _isInitialized = true;
    }

    private void CreateLineBuffers()
    {
        if (_gl == null) return;

        _lineVao = _gl.GenVertexArray();
        _lineVbo = _gl.GenBuffer();

        _gl.BindVertexArray(_lineVao);
        _gl.BindBuffer(BufferTargetARB.ArrayBuffer, _lineVbo);

        unsafe
        {
            _gl.VertexAttribPointer(0, 3, VertexAttribPointerType.Float, false, 6 * sizeof(float), (void*)0);
            _gl.EnableVertexAttribArray(0);
            
            _gl.VertexAttribPointer(1, 3, VertexAttribPointerType.Float, false, 6 * sizeof(float), (void*)(3 * sizeof(float)));
            _gl.EnableVertexAttribArray(1);
        }

        _gl.BindVertexArray(0);
    }

    private void CreateShaderProgram()
    {
        if (_gl == null) return;

        const string vertexShader = @"
            #version 330 core
            layout (location = 0) in vec3 aPosition;
            layout (location = 1) in vec3 aColor;
            
            uniform mat4 view;
            uniform mat4 projection;
            
            out vec3 Color;
            
            void main()
            {
                gl_Position = projection * view * vec4(aPosition, 1.0);
                Color = aColor;
            }
        ";

        const string fragmentShader = @"
            #version 330 core
            in vec3 Color;
            out vec4 FragColor;
            
            void main()
            {
                FragColor = vec4(Color, 1.0);
            }
        ";

        var vs = CompileShader(ShaderType.VertexShader, vertexShader);
        var fs = CompileShader(ShaderType.FragmentShader, fragmentShader);

        _shaderProgram = _gl.CreateProgram();
        _gl.AttachShader(_shaderProgram, vs);
        _gl.AttachShader(_shaderProgram, fs);
        _gl.LinkProgram(_shaderProgram);
        
        _gl.DeleteShader(vs);
        _gl.DeleteShader(fs);
    }

    private uint CompileShader(ShaderType type, string source)
    {
        if (_gl == null) return 0;

        var shader = _gl.CreateShader(type);
        _gl.ShaderSource(shader, source);
        _gl.CompileShader(shader);

        _gl.GetShader(shader, ShaderParameterName.CompileStatus, out int status);
        if (status == 0)
        {
            var log = _gl.GetShaderInfoLog(shader);
            throw new Exception($"Shader compilation failed: {log}");
        }

        return shader;
    }

    public void RenderMeasurementLines(List<Tools.MeasurementLine> lines, Camera camera, Vector3 color)
    {
        if (_gl == null || !_isInitialized || lines.Count == 0)
            return;

        // Prepare line data
        var lineData = new List<float>();
        
        foreach (var line in lines)
        {
            // Start point
            lineData.Add(line.Start.X);
            lineData.Add(line.Start.Y);
            lineData.Add(line.Start.Z);
            lineData.Add(color.X);
            lineData.Add(color.Y);
            lineData.Add(color.Z);
            
            // End point
            lineData.Add(line.End.X);
            lineData.Add(line.End.Y);
            lineData.Add(line.End.Z);
            lineData.Add(color.X);
            lineData.Add(color.Y);
            lineData.Add(color.Z);
        }

        // Upload to GPU
        _gl.BindBuffer(BufferTargetARB.ArrayBuffer, _lineVbo);
        _gl.BufferData(BufferTargetARB.ArrayBuffer, (nuint)(lineData.Count * sizeof(float)),
            lineData.ToArray(), BufferUsageARB.DynamicDraw);

        // Render
        _gl.UseProgram(_shaderProgram);
        
        var view = camera.GetViewMatrix();
        var projection = camera.GetProjectionMatrix();
        
        SetUniformMatrix4("view", view);
        SetUniformMatrix4("projection", projection);

        _gl.LineWidth(3.0f);
        _gl.BindVertexArray(_lineVao);
        _gl.DrawArrays(PrimitiveType.Lines, 0, (uint)(lineData.Count / 6));
        _gl.BindVertexArray(0);
    }

    public void RenderMeasurementPoints(List<Vector3> points, Camera camera, Vector3 color, float size = 10.0f)
    {
        if (_gl == null || !_isInitialized || points.Count == 0)
            return;

        var pointData = new List<float>();
        
        foreach (var point in points)
        {
            pointData.Add(point.X);
            pointData.Add(point.Y);
            pointData.Add(point.Z);
            pointData.Add(color.X);
            pointData.Add(color.Y);
            pointData.Add(color.Z);
        }

        _gl.BindBuffer(BufferTargetARB.ArrayBuffer, _lineVbo);
        _gl.BufferData(BufferTargetARB.ArrayBuffer, (nuint)(pointData.Count * sizeof(float)),
            pointData.ToArray(), BufferUsageARB.DynamicDraw);

        _gl.UseProgram(_shaderProgram);
        
        var view = camera.GetViewMatrix();
        var projection = camera.GetProjectionMatrix();
        
        SetUniformMatrix4("view", view);
        SetUniformMatrix4("projection", projection);

        _gl.PointSize(size);
        _gl.BindVertexArray(_lineVao);
        _gl.DrawArrays(PrimitiveType.Points, 0, (uint)(pointData.Count / 6));
        _gl.BindVertexArray(0);
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

    public void Dispose()
    {
        if (_gl != null)
        {
            _gl.DeleteVertexArray(_lineVao);
            _gl.DeleteBuffer(_lineVbo);
            _gl.DeleteProgram(_shaderProgram);
        }
    }
}
