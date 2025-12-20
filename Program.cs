using Vizzio.Application;

// See https://aka.ms/new-console-template for more information
Console.WriteLine("=== VIZZIO - IFC Viewer with 3D Visualization and VR/AR Support ===");
Console.WriteLine("Initializing application...");
Console.WriteLine();

try
{
    var viewer = new IfcViewer();
    
    // Subscribe to status messages
    viewer.OnStatusMessage += (message) =>
    {
        Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] {message}");
    };

    // Subscribe to model loaded event
    viewer.OnModelLoaded += (model) =>
    {
        Console.WriteLine($"\n=== Model Statistics ===");
        Console.WriteLine($"File: {model.FileName}");
        Console.WriteLine($"Elements: {model.Elements.Count}");
        Console.WriteLine($"Element Types: {model.GetElementTypes().Count}");
        
        Console.WriteLine("\nElement Types:");
        foreach (var type in model.GetElementTypes().OrderBy(t => t))
        {
            var count = model.ElementsByType[type].Count;
            Console.WriteLine($"  {type}: {count}");
        }
        Console.WriteLine();
    };

    Console.WriteLine("Starting viewer window...");
    Console.WriteLine("Press F1 in the viewer window for controls help.\n");
    
    viewer.Run();
}
catch (Exception ex)
{
    Console.WriteLine($"\nERROR: {ex.Message}");
    Console.WriteLine(ex.StackTrace);
    Console.WriteLine("\nPress any key to exit...");
    Console.ReadKey();
}
