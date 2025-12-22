using System.Numerics;
using System.Runtime.InteropServices;
using Silk.NET.OpenGL;
using Vizzio.Models;

namespace Vizzio.Rendering;

/// <summary>
/// OpenGL-based 3D renderer for IFC models
/// </summary>
public class Renderer3D : IDisposable
{
    private GL? _gl;
    private uint _shaderProgram;
    private readonly MeshManager _meshManager = new();
    private readonly Dictionary<string, uint> _meshBuffers = new();
    private readonly GpuBufferManager _gpuBufferManager = new();
    private IfcModel? _pendingModel;
    private bool _isLoadingModel = false;
    private int _totalElementsToLoad = 0;
    private int _elementsLoaded = 0;

    public Camera Camera { get; private set; }
    public bool IsInitialized { get; private set; }
    public Vector3 BackgroundColor { get; set; } = new Vector3(0.1f, 0.1f, 0.15f);
    public bool EnableLighting { get; set; } = true;
    public Vector3 LightDirection { get; set; } = Vector3.Normalize(new Vector3(1, -1, 1));

    public bool IsLoadingModel => _isLoadingModel;
    public int LoadedGeometryCount => _gpuBufferManager.LoadedCount;
    public int PendingGeometryCount => _gpuBufferManager.PendingCount;

    public Renderer3D()
    {
        Camera = new Camera(new Vector3(0, 5, 10));
    }

    public void Initialize(GL gl, int width, int height)
    {
        _gl = gl;

        _gpuBufferManager.Initialize(gl);

        _gl.Enable(EnableCap.DepthTest);
        _gl.Enable(EnableCap.CullFace);
        _gl.CullFace(TriangleFace.Back);

        Camera.AspectRatio = (float)width / height;

        CreateShaderProgram();

        IsInitialized = true;
    }

    private void CreateShaderProgram()
    {
        if (_gl == null) return;

        const string vertexShaderSource = @"
            #version 330 core
            layout (location = 0) in vec3 aPosition;
            layout (location = 1) in vec3 aNormal;
            layout (location = 2) in vec3 aColor;

            out vec3 FragPos;
            out vec3 Normal;
            out vec3 Color;

            uniform mat4 model;
            uniform mat4 view;
            uniform mat4 projection;

            void main()
            {
                FragPos = vec3(model * vec4(aPosition, 1.0));
                Normal = mat3(transpose(inverse(model))) * aNormal;
                Color = aColor;
                gl_Position = projection * view * vec4(FragPos, 1.0);
            }
        ";

        const string fragmentShaderSource = @"
            #version 330 core
            in vec3 FragPos;
            in vec3 Normal;
            in vec3 Color;

            out vec4 FragColor;

            uniform vec3 lightDir;
            uniform bool enableLighting;

            void main()
            {
                if (enableLighting)
                {
                    vec3 norm = normalize(Normal);
                    vec3 lightDirection = normalize(-lightDir);

                    float ambient = 0.3;
                    float diff = max(dot(norm, lightDirection), 0.0);

                    vec3 lighting = vec3(ambient + diff * 0.7);
                    vec3 result = Color * lighting;

                    FragColor = vec4(result, 1.0);
                }
                else
                {
                    FragColor = vec4(Color, 1.0);
                }
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
            throw new Exception($"Shader program linking failed: {log}");
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
            throw new Exception($"Shader compilation failed ({type}): {log}");
        }

        return shader;
    }

    public void LoadModel(IfcModel model)
    {
        if (_gl == null || !IsInitialized)
        {
            Console.WriteLine("❌ ERROR: OpenGL not initialized!");
            throw new InvalidOperationException("Renderer not initialized");
        }

        Console.WriteLine($"🔄 LoadModel() called: Queueing {model.Elements.Count} elements for GPU upload...");
        Console.WriteLine($"   GL initialized: {_gl != null}, IsInitialized: {IsInitialized}");

        _pendingModel = model;
        _isLoadingModel = true;
        _totalElementsToLoad = model.Elements.Count;
        _elementsLoaded = 0;

        Console.WriteLine($"   _isLoadingModel set to: {_isLoadingModel}");

        // Queue all geometry for upload (thread-safe)
        foreach (var element in model.Elements)
        {
            if (element.Geometry != null && element.Geometry.Vertices.Count > 0)
            {
                try
                {
                    var vertexData = MeshConverter.ToVertexArray(element.Geometry, element.Color);
                    var indexData = MeshConverter.ToIndexArray(element.Geometry);

                    _gpuBufferManager.QueueGeometryUpload(element.GlobalId, vertexData, indexData, element.Color);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"⚠️ Error queueing {element.Type}: {ex.Message}");
                }
            }
        }

        Console.WriteLine($"✅ {_gpuBufferManager.PendingCount} geometries queued for GPU upload");
    }

    private void LoadElementGeometry(IfcElement element)
    {
        if (_gl == null || element.Geometry == null)
        {
            throw new InvalidOperationException("OpenGL context or geometry is null");
        }

        var vao = _gl.GenVertexArray();
        var vbo = _gl.GenBuffer();
        var ebo = _gl.GenBuffer();

        _gl.BindVertexArray(vao);

        // Convert geometry to vertex array
        var vertexData = MeshConverter.ToVertexArray(element.Geometry, element.Color);
        var indexData = MeshConverter.ToIndexArray(element.Geometry);

        // Upload vertex data
        _gl.BindBuffer(BufferTargetARB.ArrayBuffer, vbo);
        _gl.BufferData(BufferTargetARB.ArrayBuffer, (nuint)(vertexData.Length * sizeof(float)),
            vertexData, BufferUsageARB.StaticDraw);

        // Upload index data
        _gl.BindBuffer(BufferTargetARB.ElementArrayBuffer, ebo);
        _gl.BufferData(BufferTargetARB.ElementArrayBuffer, (nuint)(indexData.Length * sizeof(uint)),
            indexData, BufferUsageARB.StaticDraw);

        unsafe
        {
            // Position attribute
            _gl.VertexAttribPointer(0, 3, VertexAttribPointerType.Float, false, 9 * sizeof(float), (void*)0);
            _gl.EnableVertexAttribArray(0);

            // Normal attribute
            _gl.VertexAttribPointer(1, 3, VertexAttribPointerType.Float, false, 9 * sizeof(float), (void*)(3 * sizeof(float)));
            _gl.EnableVertexAttribArray(1);

            // Color attribute
            _gl.VertexAttribPointer(2, 3, VertexAttribPointerType.Float, false, 9 * sizeof(float), (void*)(6 * sizeof(float)));
            _gl.EnableVertexAttribArray(2);
        }

        _gl.BindVertexArray(0);

        var mesh = new RenderMesh
        {
            VertexArrayObject = vao,
            VertexBufferObject = vbo,
            ElementBufferObject = ebo,
            IndexCount = indexData.Length,
            Color = element.Color,
            IsVisible = element.IsVisible,
            ElementId = element.GlobalId
        };

        _meshManager.AddMesh(element.GlobalId, mesh);
    }

    public void Render()
    {
        if (_gl == null || !IsInitialized) return;

        // Process pending GPU uploads (thread-safe, render thread only)
        if (_isLoadingModel)
        {
            Console.WriteLine($"🔄 Render() - Loading mode active!");
            Console.WriteLine($"   Pending={_gpuBufferManager.PendingCount}, Loaded={_gpuBufferManager.LoadedCount}");

            int processed = _gpuBufferManager.ProcessPendingUploads(50); // 50 per frame
            Console.WriteLine($"   Processed {processed} geometries this frame");

            _elementsLoaded += processed;

            if (_gpuBufferManager.PendingCount == 0 && _pendingModel != null)
            {
                // Loading complete
                _isLoadingModel = false;
                Console.WriteLine($"✅ GPU loading complete: {_gpuBufferManager.LoadedCount} geometries");

                // Focus camera
                Camera.FocusOn(_pendingModel.ModelCenter, _pendingModel.ModelSize * 1.5f);
                Camera.LookAt(_pendingModel.ModelCenter, Vector3.UnitY);

                _pendingModel = null;
            }
            else if (processed > 0 && _elementsLoaded % 250 == 0)
            {
                Console.WriteLine($"  GPU upload progress: {_elementsLoaded}/{_totalElementsToLoad} ({_gpuBufferManager.PendingCount} pending)");
            }
        }

        _gl.ClearColor(BackgroundColor.X, BackgroundColor.Y, BackgroundColor.Z, 1.0f);
        _gl.Clear(ClearBufferMask.ColorBufferBit | ClearBufferMask.DepthBufferBit);

        _gl.UseProgram(_shaderProgram);

        // Set uniforms
        var view = Camera.GetViewMatrix();
        var projection = Camera.GetProjectionMatrix();
        var model = Matrix4x4.Identity;

        SetUniformMatrix4("view", view);
        SetUniformMatrix4("projection", projection);
        SetUniformMatrix4("model", model);
        SetUniformVector3("lightDir", LightDirection);
        SetUniformBool("enableLighting", EnableLighting);

        // Render all meshes from GPU buffer manager
        unsafe
        {
            foreach (var (id, buffer) in _gpuBufferManager.GetAllBuffers())
            {
                if (buffer.IsVisible)
                {
                    _gl.BindVertexArray(buffer.VAO);
                    _gl.DrawElements(PrimitiveType.Triangles, (uint)buffer.IndexCount, DrawElementsType.UnsignedInt, null);
                }
            }
        }

        _gl.BindVertexArray(0);
    }

    public void Resize(int width, int height)
    {
        if (_gl == null) return;

        _gl.Viewport(0, 0, (uint)width, (uint)height);
        Camera.AspectRatio = (float)width / height;
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

    private void SetUniformBool(string name, bool value)
    {
        if (_gl == null) return;

        var location = _gl.GetUniformLocation(_shaderProgram, name);
        _gl.Uniform1(location, value ? 1 : 0);
    }

    private void ClearModel()
    {
        if (_gl == null) return;

        _gpuBufferManager.Clear();
        _meshManager.ClearAll();
    }

    public void Dispose()
    {
        if (_gl != null)
        {
            ClearModel();
            _gl.DeleteProgram(_shaderProgram);
        }
    }
}
