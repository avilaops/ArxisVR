using System.Numerics;
using ImGuiNET;
using Silk.NET.OpenGL;
using Vizzio.Models;

namespace Vizzio.UI;

/// <summary>
/// ImGui renderer for OpenGL
/// </summary>
public class ImGuiController : IDisposable
{
    private GL _gl;
    private uint _vertexArray;
    private uint _vertexBuffer;
    private uint _indexBuffer;
    private uint _shaderProgram;
    private uint _fontTexture;
    private int _windowWidth;
    private int _windowHeight;

    public ImGuiController(GL gl, int width, int height)
    {
        _gl = gl;
        _windowWidth = width;
        _windowHeight = height;

        var context = ImGui.CreateContext();
        ImGui.SetCurrentContext(context);

        var io = ImGui.GetIO();
        io.DisplaySize = new Vector2(width, height);
        io.DisplayFramebufferScale = Vector2.One;
        
        io.BackendFlags |= ImGuiBackendFlags.RendererHasVtxOffset;
        
        CreateDeviceObjects();
        SetupKeyMap();
        
        ImGui.StyleColorsDark();
        CustomizeStyle();
    }

    private void CustomizeStyle()
    {
        var style = ImGui.GetStyle();
        style.WindowRounding = 6.0f;
        style.FrameRounding = 4.0f;
        style.GrabRounding = 3.0f;
        style.ScrollbarRounding = 4.0f;
        
        var colors = style.Colors;
        colors[(int)ImGuiCol.WindowBg] = new Vector4(0.1f, 0.1f, 0.12f, 0.95f);
        colors[(int)ImGuiCol.TitleBg] = new Vector4(0.15f, 0.15f, 0.2f, 1.0f);
        colors[(int)ImGuiCol.TitleBgActive] = new Vector4(0.2f, 0.2f, 0.3f, 1.0f);
        colors[(int)ImGuiCol.Button] = new Vector4(0.3f, 0.3f, 0.4f, 1.0f);
        colors[(int)ImGuiCol.ButtonHovered] = new Vector4(0.4f, 0.4f, 0.5f, 1.0f);
        colors[(int)ImGuiCol.ButtonActive] = new Vector4(0.5f, 0.5f, 0.6f, 1.0f);
        colors[(int)ImGuiCol.Header] = new Vector4(0.3f, 0.3f, 0.4f, 1.0f);
        colors[(int)ImGuiCol.HeaderHovered] = new Vector4(0.4f, 0.4f, 0.5f, 1.0f);
        colors[(int)ImGuiCol.HeaderActive] = new Vector4(0.5f, 0.5f, 0.6f, 1.0f);
    }

    private void SetupKeyMap()
    {
        var io = ImGui.GetIO();
        // Key mapping will be handled by the input system
    }

    private void CreateDeviceObjects()
    {
        // Create shader
        const string vertexShader = @"
            #version 330 core
            layout (location = 0) in vec2 aPosition;
            layout (location = 1) in vec2 aTexCoord;
            layout (location = 2) in vec4 aColor;
            
            uniform mat4 projection;
            
            out vec2 TexCoord;
            out vec4 Color;
            
            void main()
            {
                gl_Position = projection * vec4(aPosition, 0, 1);
                TexCoord = aTexCoord;
                Color = aColor;
            }
        ";

        const string fragmentShader = @"
            #version 330 core
            in vec2 TexCoord;
            in vec4 Color;
            
            uniform sampler2D uTexture;
            
            out vec4 FragColor;
            
            void main()
            {
                FragColor = Color * texture(uTexture, TexCoord);
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

        // Create buffers
        _vertexArray = _gl.GenVertexArray();
        _vertexBuffer = _gl.GenBuffer();
        _indexBuffer = _gl.GenBuffer();

        _gl.BindVertexArray(_vertexArray);
        _gl.BindBuffer(BufferTargetARB.ArrayBuffer, _vertexBuffer);

        unsafe
        {
            var stride = sizeof(ImDrawVert);
            _gl.EnableVertexAttribArray(0);
            _gl.VertexAttribPointer(0, 2, VertexAttribPointerType.Float, false, (uint)stride, (void*)0);
            
            _gl.EnableVertexAttribArray(1);
            _gl.VertexAttribPointer(1, 2, VertexAttribPointerType.Float, false, (uint)stride, (void*)8);
            
            _gl.EnableVertexAttribArray(2);
            _gl.VertexAttribPointer(2, 4, VertexAttribPointerType.UnsignedByte, true, (uint)stride, (void*)16);
        }

        _gl.BindVertexArray(0);

        // Create font texture
        CreateFontTexture();
    }

    private void CreateFontTexture()
    {
        var io = ImGui.GetIO();
        io.Fonts.GetTexDataAsRGBA32(out IntPtr pixels, out int width, out int height, out int bytesPerPixel);

        _fontTexture = _gl.GenTexture();
        _gl.BindTexture(TextureTarget.Texture2D, _fontTexture);
        
        _gl.TexParameter(TextureTarget.Texture2D, TextureParameterName.TextureMinFilter, (int)TextureMinFilter.Linear);
        _gl.TexParameter(TextureTarget.Texture2D, TextureParameterName.TextureMagFilter, (int)TextureMagFilter.Linear);

        unsafe
        {
            _gl.TexImage2D(TextureTarget.Texture2D, 0, InternalFormat.Rgba, (uint)width, (uint)height, 0,
                PixelFormat.Rgba, PixelType.UnsignedByte, (void*)pixels);
        }

        io.Fonts.SetTexID((IntPtr)_fontTexture);
        io.Fonts.ClearTexData();
    }

    private uint CompileShader(ShaderType type, string source)
    {
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

    public void Update(float deltaTime, int width, int height)
    {
        _windowWidth = width;
        _windowHeight = height;

        var io = ImGui.GetIO();
        io.DisplaySize = new Vector2(width, height);
        io.DeltaTime = deltaTime;

        ImGui.NewFrame();
    }

    public void Render()
    {
        ImGui.Render();
        RenderImDrawData(ImGui.GetDrawData());
    }

    private void RenderImDrawData(ImDrawDataPtr drawData)
    {
        if (drawData.CmdListsCount == 0)
            return;

        var io = ImGui.GetIO();
        var fbWidth = (int)(drawData.DisplaySize.X * drawData.FramebufferScale.X);
        var fbHeight = (int)(drawData.DisplaySize.Y * drawData.FramebufferScale.Y);
        
        if (fbWidth <= 0 || fbHeight <= 0)
            return;

        // Setup render state
        _gl.Enable(EnableCap.Blend);
        _gl.BlendEquation(BlendEquationModeEXT.FuncAdd);
        _gl.BlendFunc(BlendingFactor.SrcAlpha, BlendingFactor.OneMinusSrcAlpha);
        _gl.Disable(EnableCap.CullFace);
        _gl.Disable(EnableCap.DepthTest);
        _gl.Enable(EnableCap.ScissorTest);

        _gl.UseProgram(_shaderProgram);

        // Setup orthographic projection
        var L = drawData.DisplayPos.X;
        var R = drawData.DisplayPos.X + drawData.DisplaySize.X;
        var T = drawData.DisplayPos.Y;
        var B = drawData.DisplayPos.Y + drawData.DisplaySize.Y;
        
        var projection = Matrix4x4.CreateOrthographicOffCenter(L, R, B, T, -1, 1);
        
        var projLoc = _gl.GetUniformLocation(_shaderProgram, "projection");
        unsafe
        {
            _gl.UniformMatrix4(projLoc, 1, false, (float*)&projection);
        }

        _gl.BindVertexArray(_vertexArray);

        var clipOff = drawData.DisplayPos;
        var clipScale = drawData.FramebufferScale;

        for (int n = 0; n < drawData.CmdListsCount; n++)
        {
            var cmdList = drawData.CmdLists[n];

            // Upload vertex/index data
            _gl.BindBuffer(BufferTargetARB.ArrayBuffer, _vertexBuffer);
            unsafe
            {
                _gl.BufferData(BufferTargetARB.ArrayBuffer, (nuint)(cmdList.VtxBuffer.Size * sizeof(ImDrawVert)),
                    (void*)cmdList.VtxBuffer.Data, BufferUsageARB.StreamDraw);
            }

            _gl.BindBuffer(BufferTargetARB.ElementArrayBuffer, _indexBuffer);
            unsafe
            {
                _gl.BufferData(BufferTargetARB.ElementArrayBuffer, (nuint)(cmdList.IdxBuffer.Size * sizeof(ushort)),
                    (void*)cmdList.IdxBuffer.Data, BufferUsageARB.StreamDraw);
            }

            for (int i = 0; i < cmdList.CmdBuffer.Size; i++)
            {
                var cmd = cmdList.CmdBuffer[i];
                
                var clipRect = new Vector4(
                    (cmd.ClipRect.X - clipOff.X) * clipScale.X,
                    (cmd.ClipRect.Y - clipOff.Y) * clipScale.Y,
                    (cmd.ClipRect.Z - clipOff.X) * clipScale.X,
                    (cmd.ClipRect.W - clipOff.Y) * clipScale.Y
                );

                if (clipRect.X < fbWidth && clipRect.Y < fbHeight && clipRect.Z >= 0.0f && clipRect.W >= 0.0f)
                {
                    _gl.Scissor((int)clipRect.X, (int)(fbHeight - clipRect.W), 
                        (uint)(clipRect.Z - clipRect.X), (uint)(clipRect.W - clipRect.Y));

                    _gl.BindTexture(TextureTarget.Texture2D, (uint)cmd.TextureId);
                    
                    unsafe
                    {
                        _gl.DrawElementsBaseVertex(PrimitiveType.Triangles, cmd.ElemCount, 
                            DrawElementsType.UnsignedShort, 
                            (void*)(cmd.IdxOffset * sizeof(ushort)),
                            (int)cmd.VtxOffset);
                    }
                }
            }
        }

        // Restore state
        _gl.Disable(EnableCap.Blend);
        _gl.Disable(EnableCap.ScissorTest);
        _gl.Enable(EnableCap.DepthTest);
        _gl.Enable(EnableCap.CullFace);
    }

    public void Dispose()
    {
        _gl.DeleteVertexArray(_vertexArray);
        _gl.DeleteBuffer(_vertexBuffer);
        _gl.DeleteBuffer(_indexBuffer);
        _gl.DeleteProgram(_shaderProgram);
        _gl.DeleteTexture(_fontTexture);
        
        ImGui.DestroyContext();
    }
}
