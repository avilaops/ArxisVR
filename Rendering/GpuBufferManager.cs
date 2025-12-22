using System.Collections.Concurrent;
using Silk.NET.OpenGL;

namespace ArxisVR.Rendering;

/// <summary>
/// Thread-safe GPU buffer manager inspired by Arxis architecture
/// Manages geometry loading on render thread only
/// </summary>
public class GpuBufferManager
{
    private readonly ConcurrentQueue<PendingGeometry> _pendingUploads = new();
    private readonly Dictionary<string, GeometryBuffer> _loadedBuffers = new();
    private GL? _gl;
    private bool _isInitialized;

    public void Initialize(GL gl)
    {
        _gl = gl;
        _isInitialized = true;
    }

    /// <summary>
    /// Queue geometry for upload (thread-safe)
    /// </summary>
    public void QueueGeometryUpload(string id, float[] vertexData, uint[] indexData, System.Numerics.Vector3 color)
    {
        _pendingUploads.Enqueue(new PendingGeometry
        {
            Id = id,
            VertexData = vertexData,
            IndexData = indexData,
            Color = color
        });

        if (_pendingUploads.Count % 250 == 0)
        {
            Console.WriteLine($"📦 Queued {_pendingUploads.Count} geometries for GPU upload");
        }
    }

    /// <summary>
    /// Process pending uploads (MUST be called from render thread)
    /// </summary>
    public int ProcessPendingUploads(int maxBatchSize = 50)
    {
        if (_gl == null || !_isInitialized)
        {
            Console.WriteLine($"⚠️ ProcessPendingUploads: GL not initialized! (_gl={_gl != null}, _isInitialized={_isInitialized})");
            return 0;
        }

        int processedCount = 0;

        while (processedCount < maxBatchSize && _pendingUploads.TryDequeue(out var pending))
        {
            try
            {
                var buffer = UploadGeometry(pending.VertexData, pending.IndexData, pending.Color);
                _loadedBuffers[pending.Id] = buffer;
                processedCount++;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"⚠️ Failed to upload geometry {pending.Id}: {ex.Message}");
            }
        }

        return processedCount;
    }

    private GeometryBuffer UploadGeometry(float[] vertexData, uint[] indexData, System.Numerics.Vector3 color)
    {
        if (_gl == null)
            throw new InvalidOperationException("GL not initialized");

        var vao = _gl.GenVertexArray();
        var vbo = _gl.GenBuffer();
        var ebo = _gl.GenBuffer();

        _gl.BindVertexArray(vao);

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
            // Position
            _gl.VertexAttribPointer(0, 3, VertexAttribPointerType.Float, false, 9 * sizeof(float), (void*)0);
            _gl.EnableVertexAttribArray(0);

            // Normal
            _gl.VertexAttribPointer(1, 3, VertexAttribPointerType.Float, false, 9 * sizeof(float), (void*)(3 * sizeof(float)));
            _gl.EnableVertexAttribArray(1);

            // Color
            _gl.VertexAttribPointer(2, 3, VertexAttribPointerType.Float, false, 9 * sizeof(float), (void*)(6 * sizeof(float)));
            _gl.EnableVertexAttribArray(2);
        }

        _gl.BindVertexArray(0);

        return new GeometryBuffer
        {
            VAO = vao,
            VBO = vbo,
            EBO = ebo,
            IndexCount = indexData.Length,
            Color = color
        };
    }

    public GeometryBuffer? GetBuffer(string id)
    {
        return _loadedBuffers.TryGetValue(id, out var buffer) ? buffer : null;
    }

    public int PendingCount => _pendingUploads.Count;

    public int LoadedCount => _loadedBuffers.Count;

    public void Clear()
    {
        if (_gl == null) return;

        foreach (var buffer in _loadedBuffers.Values)
        {
            _gl.DeleteVertexArray(buffer.VAO);
            _gl.DeleteBuffer(buffer.VBO);
            _gl.DeleteBuffer(buffer.EBO);
        }

        _loadedBuffers.Clear();
        _pendingUploads.Clear();
    }

    public IEnumerable<(string Id, GeometryBuffer Buffer)> GetAllBuffers()
    {
        return _loadedBuffers.Select(kvp => (kvp.Key, kvp.Value));
    }
}

public class PendingGeometry
{
    public string Id { get; set; } = "";
    public float[] VertexData { get; set; } = Array.Empty<float>();
    public uint[] IndexData { get; set; } = Array.Empty<uint>();
    public System.Numerics.Vector3 Color { get; set; }
}

public class GeometryBuffer
{
    public uint VAO { get; set; }
    public uint VBO { get; set; }
    public uint EBO { get; set; }
    public int IndexCount { get; set; }
    public System.Numerics.Vector3 Color { get; set; }
    public bool IsVisible { get; set; } = true;
}
