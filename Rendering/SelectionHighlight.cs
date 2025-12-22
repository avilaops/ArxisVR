using System.Numerics;
using Silk.NET.OpenGL;
using ArxisVR.Models;

namespace ArxisVR.Rendering;

/// <summary>
/// Renders selection highlight with outline effect
/// </summary>
public class SelectionHighlight : IDisposable
{
    private GL? _gl;
    private uint _outlineShaderProgram;
    private bool _isInitialized;

    public Vector4 OutlineColor { get; set; } = new Vector4(1.0f, 0.6f, 0.0f, 1.0f); // Orange
    public float OutlineThickness { get; set; } = 1.05f; // 5% larger
    public bool EnableOutline { get; set; } = true;

    public void Initialize(GL gl)
    {
        _gl = gl;
        CreateOutlineShader();
        _isInitialized = true;
    }

    private void CreateOutlineShader()
    {
        if (_gl == null) return;

        const string vertexShader = @"
            #version 330 core
            layout (location = 0) in vec3 aPosition;
            layout (location = 1) in vec3 aNormal;
            layout (location = 2) in vec3 aColor;
            
            uniform mat4 model;
            uniform mat4 view;
            uniform mat4 projection;
            uniform float outlineThickness;
            
            void main()
            {
                vec3 expandedPos = aPosition + aNormal * outlineThickness;
                gl_Position = projection * view * model * vec4(expandedPos, 1.0);
            }
        ";

        const string fragmentShader = @"
            #version 330 core
            uniform vec4 outlineColor;
            out vec4 FragColor;
            
            void main()
            {
                FragColor = outlineColor;
            }
        ";

        var vs = CompileShader(ShaderType.VertexShader, vertexShader);
        var fs = CompileShader(ShaderType.FragmentShader, fragmentShader);

        _outlineShaderProgram = _gl.CreateProgram();
        _gl.AttachShader(_outlineShaderProgram, vs);
        _gl.AttachShader(_outlineShaderProgram, fs);
        _gl.LinkProgram(_outlineShaderProgram);

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
            throw new Exception($"Outline shader compilation failed: {log}");
        }

        return shader;
    }

    public void RenderOutline(uint vao, uint indexCount, Matrix4x4 model, Matrix4x4 view, Matrix4x4 projection)
    {
        if (_gl == null || !_isInitialized || !EnableOutline)
            return;

        // Disable depth writing but enable depth testing
        _gl.DepthMask(false);
        _gl.StencilFunc(StencilFunction.Notequal, 1, 0xFF);
        _gl.StencilMask(0x00);

        _gl.UseProgram(_outlineShaderProgram);

        // Set uniforms
        SetUniformMatrix4("model", model);
        SetUniformMatrix4("view", view);
        SetUniformMatrix4("projection", projection);
        SetUniformFloat("outlineThickness", (OutlineThickness - 1.0f) * 0.1f);
        SetUniformVector4("outlineColor", OutlineColor);

        // Render mesh
        _gl.BindVertexArray(vao);
        _gl.DrawElements(PrimitiveType.Triangles, indexCount, DrawElementsType.UnsignedInt, 0);
        _gl.BindVertexArray(0);

        // Reset states
        _gl.DepthMask(true);
        _gl.StencilMask(0xFF);
        _gl.StencilFunc(StencilFunction.Always, 1, 0xFF);
    }

    public void RenderHighlight(IfcElement element, uint vao, uint indexCount, Matrix4x4 model, Matrix4x4 view, Matrix4x4 projection)
    {
        if (_gl == null || !_isInitialized || element.Geometry == null)
            return;

        // First pass: render element to stencil buffer
        _gl.Enable(EnableCap.StencilTest);
        _gl.StencilOp(StencilOp.Keep, StencilOp.Keep, StencilOp.Replace);
        _gl.StencilFunc(StencilFunction.Always, 1, 0xFF);
        _gl.StencilMask(0xFF);

        // Render normal element (this will be done by main renderer)
        // We just set up the stencil

        // Second pass: render outline
        RenderOutline(vao, indexCount, model, view, projection);

        _gl.Disable(EnableCap.StencilTest);
    }

    public void BeginSelection()
    {
        if (_gl == null) return;
        
        _gl.Enable(EnableCap.StencilTest);
        _gl.StencilOp(StencilOp.Keep, StencilOp.Keep, StencilOp.Replace);
        _gl.StencilFunc(StencilFunction.Always, 1, 0xFF);
        _gl.StencilMask(0xFF);
        _gl.Clear(ClearBufferMask.StencilBufferBit);
    }

    public void EndSelection()
    {
        if (_gl == null) return;
        _gl.Disable(EnableCap.StencilTest);
    }

    private void SetUniformMatrix4(string name, Matrix4x4 matrix)
    {
        if (_gl == null) return;
        
        var location = _gl.GetUniformLocation(_outlineShaderProgram, name);
        unsafe
        {
            _gl.UniformMatrix4(location, 1, false, (float*)&matrix);
        }
    }

    private void SetUniformFloat(string name, float value)
    {
        if (_gl == null) return;
        
        var location = _gl.GetUniformLocation(_outlineShaderProgram, name);
        _gl.Uniform1(location, value);
    }

    private void SetUniformVector4(string name, Vector4 value)
    {
        if (_gl == null) return;
        
        var location = _gl.GetUniformLocation(_outlineShaderProgram, name);
        _gl.Uniform4(location, value.X, value.Y, value.Z, value.W);
    }

    public void Dispose()
    {
        if (_gl != null && _isInitialized)
        {
            _gl.DeleteProgram(_outlineShaderProgram);
        }
    }
}
