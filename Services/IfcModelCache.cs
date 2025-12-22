using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Vizzio.Models;

namespace Vizzio.Services
{
    /// <summary>
    /// High-performance cache manager for IFC models with intelligent memory management
    /// </summary>
    public class IfcModelCache
    {
        private readonly ConcurrentDictionary<string, CachedModel> _cache;
        private readonly SemaphoreSlim _loadLock;
        private readonly IfcParser _parser;
        private long _totalMemoryUsage;
        private readonly long _maxMemoryUsage;

        public string? CurrentModelPath { get; private set; }
        public IfcModel? CurrentModel => CurrentModelPath != null && _cache.TryGetValue(CurrentModelPath, out var cached) 
            ? cached.Model 
            : null;

        public IEnumerable<string> LoadedModels => _cache.Keys;
        public int CachedModelCount => _cache.Count;
        public long TotalMemoryUsage => _totalMemoryUsage;

        public event EventHandler<ModelLoadedEventArgs>? ModelLoaded;
        public event EventHandler<ModelSwitchedEventArgs>? ModelSwitched;
        public event EventHandler<ModelUnloadedEventArgs>? ModelUnloaded;

        public IfcModelCache(long maxMemoryMB = 2048)
        {
            _cache = new ConcurrentDictionary<string, CachedModel>();
            _loadLock = new SemaphoreSlim(1, 1);
            _parser = new IfcParser();
            _maxMemoryUsage = maxMemoryMB * 1024 * 1024; // Convert to bytes
            _totalMemoryUsage = 0;
        }

        /// <summary>
        /// Load multiple IFC files in parallel with progress reporting
        /// </summary>
        public async Task<List<string>> LoadMultipleAsync(
            IEnumerable<string> filePaths,
            IProgress<LoadProgress>? progress = null,
            CancellationToken cancellationToken = default)
        {
            var loadedPaths = new List<string>();
            var paths = filePaths.ToList();
            var total = paths.Count;

            for (int i = 0; i < paths.Count; i++)
            {
                if (cancellationToken.IsCancellationRequested)
                    break;

                var path = paths[i];
                progress?.Report(new LoadProgress
                {
                    Current = i + 1,
                    Total = total,
                    CurrentFile = Path.GetFileName(path),
                    Stage = "Loading"
                });

                var loaded = await LoadAsync(path, cancellationToken);
                if (loaded)
                    loadedPaths.Add(path);

                progress?.Report(new LoadProgress
                {
                    Current = i + 1,
                    Total = total,
                    CurrentFile = Path.GetFileName(path),
                    Stage = "Completed"
                });
            }

            return loadedPaths;
        }

        /// <summary>
        /// Load an IFC file with caching
        /// </summary>
        public async Task<bool> LoadAsync(string filePath, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrEmpty(filePath) || !File.Exists(filePath))
            {
                Console.WriteLine($"[Cache] File not found: {filePath}");
                return false;
            }

            var normalizedPath = Path.GetFullPath(filePath);

            // Check if already cached
            if (_cache.TryGetValue(normalizedPath, out var existing))
            {
                Console.WriteLine($"[Cache] Model already loaded: {Path.GetFileName(normalizedPath)}");
                existing.LastAccessed = DateTime.UtcNow;
                existing.AccessCount++;
                return true;
            }

            await _loadLock.WaitAsync(cancellationToken);
            try
            {
                // Double-check after acquiring lock
                if (_cache.ContainsKey(normalizedPath))
                    return true;

                Console.WriteLine($"[Cache] Loading: {Path.GetFileName(normalizedPath)}...");
                var startTime = DateTime.UtcNow;

                // Parse the IFC file
                var model = await Task.Run(() => _parser.Parse(normalizedPath), cancellationToken);

                if (model == null)
                {
                    Console.WriteLine($"[Cache] Failed to parse: {Path.GetFileName(normalizedPath)}");
                    return false;
                }

                // Estimate memory usage
                var estimatedSize = EstimateModelSize(model);

                // Check memory limits and evict if necessary
                await EnsureMemoryAvailable(estimatedSize);

                // Cache the model
                var cached = new CachedModel
                {
                    Model = model,
                    FilePath = normalizedPath,
                    FileName = Path.GetFileName(normalizedPath),
                    LoadedAt = DateTime.UtcNow,
                    LastAccessed = DateTime.UtcNow,
                    EstimatedSize = estimatedSize,
                    AccessCount = 1
                };

                _cache[normalizedPath] = cached;
                Interlocked.Add(ref _totalMemoryUsage, estimatedSize);

                var loadTime = (DateTime.UtcNow - startTime).TotalMilliseconds;
                Console.WriteLine($"[Cache] ✓ Loaded in {loadTime:F0}ms - {model.Elements.Count} elements ({FormatBytes(estimatedSize)})");

                ModelLoaded?.Invoke(this, new ModelLoadedEventArgs
                {
                    FilePath = normalizedPath,
                    Model = model,
                    LoadTime = TimeSpan.FromMilliseconds(loadTime)
                });

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Cache] Error loading {Path.GetFileName(normalizedPath)}: {ex.Message}");
                return false;
            }
            finally
            {
                _loadLock.Release();
            }
        }

        /// <summary>
        /// Switch to a different cached model
        /// </summary>
        public bool SwitchTo(string filePath)
        {
            var normalizedPath = Path.GetFullPath(filePath);

            if (!_cache.TryGetValue(normalizedPath, out var cached))
            {
                Console.WriteLine($"[Cache] Model not in cache: {Path.GetFileName(normalizedPath)}");
                return false;
            }

            var previousPath = CurrentModelPath;
            CurrentModelPath = normalizedPath;
            cached.LastAccessed = DateTime.UtcNow;
            cached.AccessCount++;

            Console.WriteLine($"[Cache] Switched to: {cached.FileName}");

            ModelSwitched?.Invoke(this, new ModelSwitchedEventArgs
            {
                PreviousPath = previousPath,
                CurrentPath = normalizedPath,
                Model = cached.Model
            });

            return true;
        }

        /// <summary>
        /// Unload a specific model from cache
        /// </summary>
        public bool Unload(string filePath)
        {
            var normalizedPath = Path.GetFullPath(filePath);

            if (!_cache.TryRemove(normalizedPath, out var cached))
                return false;

            Interlocked.Add(ref _totalMemoryUsage, -cached.EstimatedSize);

            if (CurrentModelPath == normalizedPath)
                CurrentModelPath = null;

            Console.WriteLine($"[Cache] Unloaded: {cached.FileName} (freed {FormatBytes(cached.EstimatedSize)})");

            ModelUnloaded?.Invoke(this, new ModelUnloadedEventArgs
            {
                FilePath = normalizedPath,
                FileName = cached.FileName
            });

            return true;
        }

        /// <summary>
        /// Clear all cached models
        /// </summary>
        public void Clear()
        {
            var count = _cache.Count;
            _cache.Clear();
            _totalMemoryUsage = 0;
            CurrentModelPath = null;

            Console.WriteLine($"[Cache] Cleared {count} models");
        }

        /// <summary>
        /// Get information about all cached models
        /// </summary>
        public List<CachedModelInfo> GetCachedModels()
        {
            return _cache.Values
                .OrderByDescending(c => c.LastAccessed)
                .Select(c => new CachedModelInfo
                {
                    FilePath = c.FilePath,
                    FileName = c.FileName,
                    ElementCount = c.Model.Elements.Count,
                    LoadedAt = c.LoadedAt,
                    LastAccessed = c.LastAccessed,
                    AccessCount = c.AccessCount,
                    EstimatedSize = c.EstimatedSize,
                    IsCurrent = c.FilePath == CurrentModelPath
                })
                .ToList();
        }

        /// <summary>
        /// Ensure enough memory is available by evicting least recently used models
        /// </summary>
        private async Task EnsureMemoryAvailable(long requiredSize)
        {
            while (_totalMemoryUsage + requiredSize > _maxMemoryUsage && _cache.Count > 0)
            {
                // Find least recently used model (excluding current)
                var lru = _cache.Values
                    .Where(c => c.FilePath != CurrentModelPath)
                    .OrderBy(c => c.LastAccessed)
                    .FirstOrDefault();

                if (lru == null)
                    break; // Only current model remains

                Console.WriteLine($"[Cache] Memory limit reached, evicting: {lru.FileName}");
                Unload(lru.FilePath);
            }
        }

        /// <summary>
        /// Estimate memory usage of a model
        /// </summary>
        private long EstimateModelSize(IfcModel model)
        {
            // Rough estimation:
            // - Each element: ~1KB base
            // - Each vertex: ~24 bytes (Vector3 + normal)
            // - Each face: ~12 bytes (3 indices)
            
            long size = 0;

            // Base size per element
            size += model.Elements.Count * 1024;

            // Geometry size
            foreach (var element in model.Elements)
            {
                if (element.Geometry != null)
                {
                    size += element.Geometry.Vertices.Count * 24; // Vector3 (12) + Normal (12)
                    size += element.Geometry.Indices.Count * 4;   // int32
                }
            }

            return size;
        }

        /// <summary>
        /// Format bytes to human-readable string
        /// </summary>
        private string FormatBytes(long bytes)
        {
            string[] sizes = { "B", "KB", "MB", "GB" };
            double len = bytes;
            int order = 0;
            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len = len / 1024;
            }
            return $"{len:F2} {sizes[order]}";
        }

        private class CachedModel
        {
            public IfcModel Model { get; set; } = null!;
            public string FilePath { get; set; } = string.Empty;
            public string FileName { get; set; } = string.Empty;
            public DateTime LoadedAt { get; set; }
            public DateTime LastAccessed { get; set; }
            public long EstimatedSize { get; set; }
            public int AccessCount { get; set; }
        }
    }

    public class CachedModelInfo
    {
        public string FilePath { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public int ElementCount { get; set; }
        public DateTime LoadedAt { get; set; }
        public DateTime LastAccessed { get; set; }
        public int AccessCount { get; set; }
        public long EstimatedSize { get; set; }
        public bool IsCurrent { get; set; }
    }

    public class LoadProgress
    {
        public int Current { get; set; }
        public int Total { get; set; }
        public string CurrentFile { get; set; } = string.Empty;
        public string Stage { get; set; } = string.Empty;
        public double Percentage => Total > 0 ? (double)Current / Total * 100 : 0;
    }

    public class ModelLoadedEventArgs : EventArgs
    {
        public string FilePath { get; set; } = string.Empty;
        public IfcModel Model { get; set; } = null!;
        public TimeSpan LoadTime { get; set; }
    }

    public class ModelSwitchedEventArgs : EventArgs
    {
        public string? PreviousPath { get; set; }
        public string CurrentPath { get; set; } = string.Empty;
        public IfcModel Model { get; set; } = null!;
    }

    public class ModelUnloadedEventArgs : EventArgs
    {
        public string FilePath { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
    }
}
