using System.Runtime.InteropServices;

namespace Vizzio.UI;

/// <summary>
/// Cross-platform file dialog using native system dialogs
/// </summary>
public static class FileDialog
{
    public static string? OpenFile(string title, string filter = "IFC Files (*.ifc)|*.ifc|All Files (*.*)|*.*")
    {
        if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            return OpenFileWindows(title, filter);
        }
        else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
        {
            return OpenFileLinux(title);
        }
        else if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
        {
            return OpenFileMacOS(title);
        }

        return null;
    }

    private static string? OpenFileWindows(string title, string filter)
    {
        try
        {
            // Use PowerShell to open file dialog on Windows
            var psi = new System.Diagnostics.ProcessStartInfo
            {
                FileName = "powershell.exe",
                Arguments = @$"-Command ""Add-Type -AssemblyName System.Windows.Forms; $f = New-Object System.Windows.Forms.OpenFileDialog; $f.Title = '{title}'; $f.Filter = 'IFC Files (*.ifc)|*.ifc|All Files (*.*)|*.*'; $f.ShowDialog() | Out-Null; $f.FileName""",
                RedirectStandardOutput = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = System.Diagnostics.Process.Start(psi);
            if (process == null)
                return null;

            var output = process.StandardOutput.ReadToEnd();
            process.WaitForExit();

            var filePath = output.Trim();
            return string.IsNullOrEmpty(filePath) ? null : filePath;
        }
        catch
        {
            return null;
        }
    }

    private static string? OpenFileLinux(string title)
    {
        try
        {
            // Try zenity first (most common)
            var psi = new System.Diagnostics.ProcessStartInfo
            {
                FileName = "zenity",
                Arguments = $"--file-selection --title=\"{title}\" --file-filter=\"IFC files | *.ifc\" --file-filter=\"All files | *\"",
                RedirectStandardOutput = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = System.Diagnostics.Process.Start(psi);
            if (process == null)
                return null;

            var output = process.StandardOutput.ReadToEnd();
            process.WaitForExit();

            if (process.ExitCode == 0)
            {
                var filePath = output.Trim();
                return string.IsNullOrEmpty(filePath) ? null : filePath;
            }
        }
        catch
        {
            // Fallback: Try kdialog
            try
            {
                var psi = new System.Diagnostics.ProcessStartInfo
                {
                    FileName = "kdialog",
                    Arguments = $"--getopenfilename . \"*.ifc|IFC files\"",
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using var process = System.Diagnostics.Process.Start(psi);
                if (process == null)
                    return null;

                var output = process.StandardOutput.ReadToEnd();
                process.WaitForExit();

                var filePath = output.Trim();
                return string.IsNullOrEmpty(filePath) ? null : filePath;
            }
            catch
            {
                return null;
            }
        }

        return null;
    }

    private static string? OpenFileMacOS(string title)
    {
        try
        {
            var psi = new System.Diagnostics.ProcessStartInfo
            {
                FileName = "osascript",
                Arguments = $"-e 'POSIX path of (choose file with prompt \"{title}\" of type {{\"ifc\"}})'",
                RedirectStandardOutput = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = System.Diagnostics.Process.Start(psi);
            if (process == null)
                return null;

            var output = process.StandardOutput.ReadToEnd();
            process.WaitForExit();

            if (process.ExitCode == 0)
            {
                var filePath = output.Trim();
                return string.IsNullOrEmpty(filePath) ? null : filePath;
            }
        }
        catch
        {
            return null;
        }

        return null;
    }
}
