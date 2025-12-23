using System.Text.Json;
using ArxisVR.Models;

namespace ArxisVR.Services;

/// <summary>
/// Parser for .bscollab files (BIMServer collaboration format)
/// These files contain references to IFC files and placement information
/// </summary>
public class BsCollabParser
{
    public event Action<string>? OnProgress;
    public event Action<string>? OnError;

    private readonly IfcParser _ifcParser;

    public BsCollabParser(IfcParser ifcParser)
    {
        _ifcParser = ifcParser;
    }

    /// <summary>
    /// Parse a .bscollab file and load the referenced IFC file
    /// </summary>
    public async Task<IfcModel?> ParseFileAsync(string filePath)
    {
        try
        {
            OnProgress?.Invoke($"📦 Opening BsCollab file: {Path.GetFileName(filePath)}");

            if (!File.Exists(filePath))
            {
                OnError?.Invoke($"File not found: {filePath}");
                return null;
            }

            // Read and parse JSON
            var jsonContent = await File.ReadAllTextAsync(filePath);
            var bscollab = JsonSerializer.Deserialize<BsCollabRoot>(jsonContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (bscollab?.Bscollab == null)
            {
                OnError?.Invoke("Invalid BsCollab file format");
                return null;
            }

            OnProgress?.Invoke($"📋 Collaboration: {bscollab.Bscollab.CollaborationDescription}");
            OnProgress?.Invoke($"🏢 Application: {bscollab.Bscollab.Application?.Name}");

            // Find the IFC document
            var ifcDocument = bscollab.Bscollab.Documents?.FirstOrDefault(d =>
                d.IdentificationTag?.ToLower() == "ifc");

            if (ifcDocument == null)
            {
                OnError?.Invoke("No IFC document found in BsCollab file");
                return null;
            }

            OnProgress?.Invoke($"🔍 Found IFC file reference: {ifcDocument.Name}");

            // Construct path to IFC file (same directory as .bscollab)
            var directory = Path.GetDirectoryName(filePath);
            var ifcPath = Path.Combine(directory ?? "", ifcDocument.Name ?? "");

            if (!File.Exists(ifcPath))
            {
                OnError?.Invoke($"Referenced IFC file not found: {ifcPath}");
                return null;
            }

            OnProgress?.Invoke($"⚡ Loading referenced IFC file...");

            // Load the IFC file using existing parser
            var model = await _ifcParser.ParseFileAsync(ifcPath);

            if (model != null)
            {
                // Add BsCollab metadata
                model.Properties["BsCollabSource"] = filePath;
                model.Properties["CollaborationGlobalId"] = bscollab.Bscollab.CollaborationGlobalId ?? "";
                model.Properties["Application"] = bscollab.Bscollab.Application?.Name ?? "";

                OnProgress?.Invoke("✅ BsCollab file loaded successfully!");
            }

            return model;
        }
        catch (Exception ex)
        {
            OnError?.Invoke($"Error parsing BsCollab file: {ex.Message}");
            return null;
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
