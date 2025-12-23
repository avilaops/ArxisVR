using System.Text.Json;
using ArxisVR.Models;

namespace ArxisVR.Services;

/// <summary>
/// Parser for .bscollab files (BIMServer collaboration format) - Optimized
/// These files contain references to IFC files and placement information
/// </summary>
public class BsCollabParser
{
    // Constants for file processing
    private const string IFC_IDENTIFICATION_TAG = "ifc";
    private const int MAX_FILE_SIZE_MB = 100;
    private const int BUFFER_SIZE = 8192;

    public event Action<string>? OnProgress;
    public event Action<string>? OnError;

    private readonly IfcParser _ifcParser;
    private readonly JsonSerializerOptions _jsonOptions;

    public BsCollabParser(IfcParser ifcParser)
    {
        _ifcParser = ifcParser;

        // Initialize JSON options once for better performance
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            ReadCommentHandling = JsonCommentHandling.Skip,
            AllowTrailingCommas = true
        };
    }

    /// <summary>
    /// Parse a .bscollab file and load the referenced IFC file
    /// </summary>
    public async Task<IfcModel?> ParseFileAsync(string filePath)
    {
        try
        {
            OnProgress?.Invoke($"📦 Opening BsCollab file: {Path.GetFileName(filePath)}");

            // Validate file existence
            if (!File.Exists(filePath))
            {
                OnError?.Invoke($"File not found: {filePath}");
                return null;
            }

            // Validate file size
            var fileInfo = new FileInfo(filePath);
            var fileSizeMB = fileInfo.Length / (1024.0 * 1024.0);
            if (fileSizeMB > MAX_FILE_SIZE_MB)
            {
                OnError?.Invoke($"File too large: {fileSizeMB:F1}MB (max: {MAX_FILE_SIZE_MB}MB)");
                return null;
            }

            OnProgress?.Invoke($"📊 File size: {fileSizeMB:F2}MB");

            // Read and parse JSON with optimized buffer
            string jsonContent;
            using (var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, BUFFER_SIZE, useAsync: true))
            using (var reader = new StreamReader(stream))
            {
                jsonContent = await reader.ReadToEndAsync();
            }

            OnProgress?.Invoke("🔍 Parsing JSON structure...");
            var bscollab = JsonSerializer.Deserialize<BsCollabRoot>(jsonContent, _jsonOptions);

            if (bscollab?.Bscollab == null)
            {
                OnError?.Invoke("Invalid BsCollab file format");
                return null;
            }

            OnProgress?.Invoke($"📋 Collaboration: {bscollab.Bscollab.CollaborationDescription ?? "Unnamed"}");
            OnProgress?.Invoke($"🏢 Application: {bscollab.Bscollab.Application?.Name ?? "Unknown"}");

            // List all documents for debugging
            if (bscollab.Bscollab.Documents != null && bscollab.Bscollab.Documents.Count > 0)
            {
                OnProgress?.Invoke($"📄 Total documents: {bscollab.Bscollab.Documents.Count}");
            }

            // Find the IFC document
            var ifcDocument = bscollab.Bscollab.Documents?.FirstOrDefault(d =>
                d.IdentificationTag?.Equals(IFC_IDENTIFICATION_TAG, StringComparison.OrdinalIgnoreCase) == true);

            if (ifcDocument == null)
            {
                OnError?.Invoke("No IFC document found in BsCollab file");

                // List available documents for troubleshooting
                if (bscollab.Bscollab.Documents != null)
                {
                    foreach (var doc in bscollab.Bscollab.Documents.Take(5))
                    {
                        OnProgress?.Invoke($"  Available: {doc.Name} (Tag: {doc.IdentificationTag})");
                    }
                }
                return null;
            }

            OnProgress?.Invoke($"🔍 Found IFC file reference: {ifcDocument.Name}");

            // Construct path to IFC file (same directory as .bscollab)
            var directory = Path.GetDirectoryName(filePath);
            if (string.IsNullOrEmpty(directory))
            {
                OnError?.Invoke("Invalid directory path");
                return null;
            }

            if (string.IsNullOrEmpty(ifcDocument.Name))
            {
                OnError?.Invoke("IFC document name is empty");
                return null;
            }

            var ifcPath = Path.Combine(directory, ifcDocument.Name);
            OnProgress?.Invoke($"📂 Looking for: {ifcPath}");

            if (!File.Exists(ifcPath))
            {
                OnError?.Invoke($"Referenced IFC file not found: {ifcPath}");

                // Try to find IFC files in the same directory
                var ifcFiles = Directory.GetFiles(directory, "*.ifc", SearchOption.TopDirectoryOnly);
                if (ifcFiles.Length > 0)
                {
                    OnProgress?.Invoke($"Found {ifcFiles.Length} IFC file(s) in directory:");
                    foreach (var file in ifcFiles.Take(3))
                    {
                        OnProgress?.Invoke($"  - {Path.GetFileName(file)}");
                    }
                }
                return null;
            }

            OnProgress?.Invoke($"⚡ Loading referenced IFC file ({new FileInfo(ifcPath).Length / (1024.0 * 1024.0):F2}MB)...");

            // Load the IFC file using existing parser
            var model = await _ifcParser.ParseFileAsync(ifcPath);

            if (model != null)
            {
                // Add BsCollab metadata
                model.Properties["BsCollabSource"] = filePath;
                model.Properties["BsCollabFileName"] = Path.GetFileName(filePath);
                model.Properties["CollaborationGlobalId"] = bscollab.Bscollab.CollaborationGlobalId ?? "";
                model.Properties["CollaborationDescription"] = bscollab.Bscollab.CollaborationDescription ?? "";
                model.Properties["Application"] = bscollab.Bscollab.Application?.Name ?? "";
                model.Properties["ApplicationVersion"] = bscollab.Bscollab.Application?.Identifier ?? "";
                model.Properties["Developer"] = bscollab.Bscollab.Application?.DeveloperName ?? "";
                model.Properties["DocumentCount"] = bscollab.Bscollab.Documents?.Count.ToString() ?? "0";
                model.Properties["LoadedFrom"] = "BsCollab";

                OnProgress?.Invoke("✅ BsCollab file loaded successfully!");
                OnProgress?.Invoke($"📊 Model: {model.Elements.Count} elements, {model.GetTotalVertexCount():N0} vertices");
            }
            else
            {
                OnError?.Invoke("Failed to load IFC model from BsCollab reference");
            }

            return model;
        }
        catch (JsonException ex)
        {
            OnError?.Invoke($"Invalid JSON format: {ex.Message}");
            OnError?.Invoke($"Line: {ex.LineNumber}, Position: {ex.BytePositionInLine}");
            return null;
        }
        catch (IOException ex)
        {
            OnError?.Invoke($"File I/O error: {ex.Message}");
            return null;
        }
        catch (UnauthorizedAccessException ex)
        {
            OnError?.Invoke($"Access denied: {ex.Message}");
            return null;
        }
        catch (Exception ex)
        {
            OnError?.Invoke($"Error parsing BsCollab file: {ex.Message}");
            OnError?.Invoke($"Type: {ex.GetType().Name}");
            return null;
        }
    }

    /// <summary>
    /// Validate BsCollab file format without loading the full IFC
    /// </summary>
    public async Task<bool> ValidateFileAsync(string filePath)
    {
        try
        {
            if (!File.Exists(filePath))
                return false;

            var jsonContent = await File.ReadAllTextAsync(filePath);
            var bscollab = JsonSerializer.Deserialize<BsCollabRoot>(jsonContent, _jsonOptions);

            return bscollab?.Bscollab != null &&
                   bscollab.Bscollab.Documents != null &&
                   bscollab.Bscollab.Documents.Any(d =>
                       d.IdentificationTag?.Equals(IFC_IDENTIFICATION_TAG, StringComparison.OrdinalIgnoreCase) == true);
        }
        catch
        {
            return false;
        }
    }

    // JSON Models for BsCollab format
    private class BsCollabRoot
    {
        public BsCollabData? Bscollab { get; set; }
    }

    private class BsCollabData
    {
        public string? CollaborationGlobalId { get; set; }
        public string? CollaborationDescription { get; set; }
        public ApplicationInfo? Application { get; set; }
        public List<DocumentInfo>? Documents { get; set; }
    }

    private class ApplicationInfo
    {
        public string? Name { get; set; }
        public string? Identifier { get; set; }
        public string? DeveloperName { get; set; }
    }

    private class DocumentInfo
    {
        public string? Name { get; set; }
        public string? IdentificationTag { get; set; }
        public bool Hidden { get; set; }
    }
}
