namespace ArxisVR.UI;

/// <summary>
/// Simple file input - Uses console or drag & drop
/// </summary>
public static class SimpleFileDialog
{
    public static string? OpenFile()
    {
        // Try native dialog first
        try
        {
            var filePath = FileDialog.OpenFile("Select IFC or CAD file");
            if (!string.IsNullOrWhiteSpace(filePath) && File.Exists(filePath))
            {
                return filePath;
            }
        }
        catch
        {
            // Ignore and fall back to console prompt
        }

        Console.WriteLine("\n=== Open IFC File ===");
        Console.WriteLine("Enter the full path to your IFC file:");
        Console.WriteLine("(Or drag & drop an IFC file onto the window)");
        Console.Write("> ");

        var path = Console.ReadLine()?.Trim().Trim('"');

        if (!string.IsNullOrEmpty(path) && File.Exists(path))
        {
            return path;
        }

        Console.WriteLine("Invalid file path or file does not exist.");
        return null;
    }
}
