using System.Runtime.InteropServices;
using System.Diagnostics;

namespace ArxisVR.UI;

/// <summary>
/// Simple file input - Uses console or drag & drop
/// </summary>
public static class SimpleFileDialog
{
    public static string? OpenFile()
    {
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
