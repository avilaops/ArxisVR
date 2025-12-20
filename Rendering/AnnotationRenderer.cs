using System.Numerics;
using Silk.NET.OpenGL;
using Vizzio.Tools;

namespace Vizzio.Rendering;

/// <summary>
/// Renders 3D annotations with markers and labels
/// </summary>
public class AnnotationRenderer : IDisposable
{
    private GL? _gl;
    private uint _markerVao;
    private uint _markerVbo;
    private uint _shaderProgram;
    private bool _isInitialized;

    public void Initialize(GL gl)
    {
        _gl = gl;
        CreateMarkerBuffers();
        CreateShaderProgram();
        _isInitialized = true;
    }

    private void CreateMarkerBuffers()
    {
        if (_gl == null) return;

        _markerVao = _gl.GenVertexArray();
        _markerVbo = _gl.GenBuffer();

        _gl.BindVertexArray(_markerVao);
        _gl.BindBuffer(BufferTargetARB.ArrayBuffer, _markerVbo);

        unsafe
        {
            _gl.VertexAttribPointer(0, 3, VertexAttribPointerType.Float, false, 7 * sizeof(float), (void*)0);
            _gl.EnableVertexAttribArray(0);
            
            _gl.VertexAttribPointer(1, 4, VertexAttribPointerType.Float, false, 7 * sizeof(float), (void*)(3 * sizeof(float)));
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
            layout (location = 1) in vec4 aColor;
            
            uniform mat4 view;
            uniform mat4 projection;
            uniform float markerSize;
            
            out vec4 Color;
            
            void main()
            {
                gl_Position = projection * view * vec4(aPosition, 1.0);
                gl_PointSize = markerSize;
                Color = aColor;
            }
        ";

        const string fragmentShader = @"
            #version 330 core
            in vec4 Color;
            out vec4 FragColor;
            
            void main()
            {
                vec2 coord = gl_PointCoord - vec2(0.5);
                if(length(coord) > 0.5)
                    discard;
                    
                FragColor = Color;
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
            throw new Exception($"Annotation shader compilation failed: {log}");
        }

        return shader;
    }

    public void RenderAnnotations(List<Annotation> annotations, Camera camera, float markerSize = 20.0f)
    {
        if (_gl == null || !_isInitialized || annotations.Count == 0)
            return;

        var visibleAnnotations = annotations.Where(a => a.IsVisible).ToList();
        if (visibleAnnotations.Count == 0)
            return;

        // Prepare marker data
        var markerData = new List<float>();
        
        foreach (var annotation in visibleAnnotations)
        {
            // Position
            markerData.Add(annotation.Position.X);
            markerData.Add(annotation.Position.Y);
            markerData.Add(annotation.Position.Z);
            
            // Color
            markerData.Add(annotation.Color.X);
            markerData.Add(annotation.Color.Y);
            markerData.Add(annotation.Color.Z);
            markerData.Add(annotation.Color.W);
        }

        // Upload to GPU
        _gl.BindBuffer(BufferTargetARB.ArrayBuffer, _markerVbo);
        _gl.BufferData(BufferTargetARB.ArrayBuffer, (nuint)(markerData.Count * sizeof(float)),
            markerData.ToArray(), BufferUsageARB.DynamicDraw);

        // Render
        _gl.UseProgram(_shaderProgram);
        
        var view = camera.GetViewMatrix();
        var projection = camera.GetProjectionMatrix();
        
        SetUniformMatrix4("view", view);
        SetUniformMatrix4("projection", projection);
        SetUniformFloat("markerSize", markerSize);

        _gl.Enable(EnableCap.ProgramPointSize);
        _gl.BindVertexArray(_markerVao);
        _gl.DrawArrays(PrimitiveType.Points, 0, (uint)visibleAnnotations.Count);
        _gl.BindVertexArray(0);
        _gl.Disable(EnableCap.ProgramPointSize);
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

    private void SetUniformFloat(string name, float value)
    {
        if (_gl == null) return;
        
        var location = _gl.GetUniformLocation(_shaderProgram, name);
        _gl.Uniform1(location, value);
    }

    public void Dispose()
    {
        if (_gl != null && _isInitialized)
        {
            _gl.DeleteVertexArray(_markerVao);
            _gl.DeleteBuffer(_markerVbo);
            _gl.DeleteProgram(_shaderProgram);
        }
    }
}
