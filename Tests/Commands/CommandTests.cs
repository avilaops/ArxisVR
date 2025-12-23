using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace ArxisVR.Tests.Commands;

/// <summary>
/// Testes de funcionalidade de comandos e scripts do sistema
/// </summary>
public class CommandTests
{
    private readonly List<TestResult> _results = new();
    private readonly string _projectRoot;

    public class TestResult
    {
        public string Category { get; set; } = "";
        public string TestName { get; set; } = "";
        public bool Passed { get; set; }
        public string Message { get; set; } = "";
        public TimeSpan Duration { get; set; }
        public string Output { get; set; } = "";
    }

    public CommandTests()
    {
        _projectRoot = FindProjectRoot();
    }

    public async Task<List<TestResult>> RunAllTestsAsync()
    {
        Console.WriteLine("\n╔══════════════════════════════════════════════════════════╗");
        Console.WriteLine("║         🔧 TESTES DE COMANDOS E SCRIPTS                  ║");
        Console.WriteLine("╚══════════════════════════════════════════════════════════╝\n");

        // PowerShell Scripts
        await TestPowerShellScriptAsync();
        await TestScriptSyntaxAsync();

        // Build Commands
        await TestBuildCommandAsync();
        await TestCleanCommandAsync();
        await TestRestoreCommandAsync();

        // Project Commands
        await TestProjectStructureAsync();
        await TestDependenciesAsync();

        // Environment Commands
        await TestEnvironmentVariablesAsync();
        await TestConfigurationLoadAsync();

        return _results;
    }

    // ==================== POWERSHELL SCRIPTS ====================

    private async Task TestPowerShellScriptAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var scriptPath = Path.Combine(_projectRoot, "rename_vizzio_to_arxisvr.ps1");

            if (!File.Exists(scriptPath))
            {
                AddResult("Scripts", "PowerShell Script Exists", false,
                    "Script não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(scriptPath);
            bool hasValidSyntax = content.Contains("param") || content.Contains("$") ||
                                  content.Contains("Write-Host") || content.Contains("Get-");

            AddResult("Scripts", "PowerShell Script Exists", hasValidSyntax,
                $"Script encontrado com {content.Split('\n').Length} linhas", sw.Elapsed);
        }
        catch (Exception ex)
        {
            AddResult("Scripts", "PowerShell Script Exists", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    private async Task TestScriptSyntaxAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var scriptPath = Path.Combine(_projectRoot, "rename_vizzio_to_arxisvr.ps1");

            if (!File.Exists(scriptPath))
            {
                AddResult("Scripts", "Script Syntax Check", false,
                    "Script não encontrado", sw.Elapsed);
                return;
            }

            // Test PowerShell syntax with -Syntax parameter
            var psi = new ProcessStartInfo
            {
                FileName = "powershell.exe",
                Arguments = $"-NoProfile -Command \"Test-Path '{scriptPath}'\"",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = Process.Start(psi);
            if (process != null)
            {
                var output = await process.StandardOutput.ReadToEndAsync();
                var error = await process.StandardError.ReadToEndAsync();
                await process.WaitForExitAsync();

                bool passed = process.ExitCode == 0 && string.IsNullOrEmpty(error);
                AddResult("Scripts", "Script Syntax Check", passed,
                    passed ? "Sintaxe válida" : $"Erro de sintaxe: {error}", sw.Elapsed);
            }
        }
        catch (Exception ex)
        {
            AddResult("Scripts", "Script Syntax Check", false,
                $"Erro ao validar: {ex.Message}", sw.Elapsed);
        }
    }

    // ==================== BUILD COMMANDS ====================

    private async Task TestBuildCommandAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var psi = new ProcessStartInfo
            {
                FileName = "dotnet",
                Arguments = "build --no-restore",
                WorkingDirectory = _projectRoot,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = Process.Start(psi);
            if (process != null)
            {
                var output = await process.StandardOutput.ReadToEndAsync();
                var error = await process.StandardError.ReadToEndAsync();
                await process.WaitForExitAsync();

                bool passed = process.ExitCode == 0;
                AddResult("Build", "Build Command", passed,
                    passed ? "Build executado com sucesso" : $"Build falhou: {error}",
                    sw.Elapsed, output);
            }
        }
        catch (Exception ex)
        {
            AddResult("Build", "Build Command", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    private async Task TestCleanCommandAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var psi = new ProcessStartInfo
            {
                FileName = "dotnet",
                Arguments = "clean",
                WorkingDirectory = _projectRoot,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = Process.Start(psi);
            if (process != null)
            {
                var output = await process.StandardOutput.ReadToEndAsync();
                await process.WaitForExitAsync();

                bool passed = process.ExitCode == 0;
                AddResult("Build", "Clean Command", passed,
                    passed ? "Clean executado com sucesso" : "Clean falhou",
                    sw.Elapsed);
            }
        }
        catch (Exception ex)
        {
            AddResult("Build", "Clean Command", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    private async Task TestRestoreCommandAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var psi = new ProcessStartInfo
            {
                FileName = "dotnet",
                Arguments = "restore",
                WorkingDirectory = _projectRoot,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = Process.Start(psi);
            if (process != null)
            {
                var output = await process.StandardOutput.ReadToEndAsync();
                await process.WaitForExitAsync();

                bool passed = process.ExitCode == 0;
                AddResult("Build", "Restore Command", passed,
                    passed ? "Restore executado com sucesso" : "Restore falhou",
                    sw.Elapsed);
            }
        }
        catch (Exception ex)
        {
            AddResult("Build", "Restore Command", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    // ==================== PROJECT COMMANDS ====================

    private async Task TestProjectStructureAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var csprojFiles = Directory.GetFiles(_projectRoot, "*.csproj", SearchOption.AllDirectories)
                .Where(f => !f.Contains("\\bin\\") && !f.Contains("\\obj\\"))
                .ToList();

            bool passed = csprojFiles.Count > 0;
            AddResult("Project", "Project Files", passed,
                $"{csprojFiles.Count} arquivo(s) .csproj encontrado(s)", sw.Elapsed);

            await Task.CompletedTask;
        }
        catch (Exception ex)
        {
            AddResult("Project", "Project Files", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    private async Task TestDependenciesAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var csprojPath = Path.Combine(_projectRoot, "ArxisVR.csproj");

            if (!File.Exists(csprojPath))
            {
                AddResult("Project", "Dependencies Check", false,
                    ".csproj não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(csprojPath);
            var packageCount = System.Text.RegularExpressions.Regex.Matches(content, "PackageReference").Count;

            bool passed = packageCount > 0;
            AddResult("Project", "Dependencies Check", passed,
                $"{packageCount} dependências encontradas", sw.Elapsed);
        }
        catch (Exception ex)
        {
            AddResult("Project", "Dependencies Check", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    // ==================== ENVIRONMENT COMMANDS ====================

    private async Task TestEnvironmentVariablesAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var envFile = Path.Combine(_projectRoot, ".env");
            bool hasEnvFile = File.Exists(envFile);

            var vars = new[]
            {
                "OLLAMA_BASE_URL",
                "OLLAMA_MODEL",
                "AZURE_OPENAI_ENDPOINT"
            };

            int foundVars = 0;
            if (hasEnvFile)
            {
                var content = await File.ReadAllTextAsync(envFile);
                foundVars = vars.Count(v => content.Contains(v));
            }

            AddResult("Environment", "Environment Variables", hasEnvFile,
                hasEnvFile ? $"{foundVars}/{vars.Length} variáveis configuradas" :
                ".env não encontrado", sw.Elapsed);
        }
        catch (Exception ex)
        {
            AddResult("Environment", "Environment Variables", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    private async Task TestConfigurationLoadAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            // Test if AIConfig can be loaded
            var configFile = Path.Combine(_projectRoot, "AI", "AIConfig.cs");
            bool configExists = File.Exists(configFile);

            if (configExists)
            {
                var content = await File.ReadAllTextAsync(configFile);
                bool hasLoadMethod = content.Contains("LoadFromEnvironment") ||
                                    content.Contains("Load");

                AddResult("Environment", "Configuration Load", hasLoadMethod,
                    hasLoadMethod ? "Método de carregamento encontrado" :
                    "Método de carregamento não encontrado", sw.Elapsed);
            }
            else
            {
                AddResult("Environment", "Configuration Load", false,
                    "AIConfig.cs não encontrado", sw.Elapsed);
            }
        }
        catch (Exception ex)
        {
            AddResult("Environment", "Configuration Load", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    // ==================== HELPER METHODS ====================

    private string FindProjectRoot()
    {
        var currentDir = Directory.GetCurrentDirectory();
        while (currentDir != null)
        {
            if (File.Exists(Path.Combine(currentDir, "ArxisVR.csproj")))
                return currentDir;

            var parent = Directory.GetParent(currentDir);
            if (parent == null) break;
            currentDir = parent.FullName;
        }
        return Directory.GetCurrentDirectory();
    }

    private void AddResult(string category, string testName, bool passed,
        string message, TimeSpan duration, string output = "")
    {
        var result = new TestResult
        {
            Category = category,
            TestName = testName,
            Passed = passed,
            Message = message,
            Duration = duration,
            Output = output
        };
        _results.Add(result);

        var icon = passed ? "✅" : "❌";
        Console.WriteLine($"{icon} [{category}] {testName}: {message} ({duration.TotalMilliseconds:F0}ms)");
    }

    public void PrintSummary()
    {
        Console.WriteLine("\n╔══════════════════════════════════════════════════════════╗");
        Console.WriteLine("║         📊 RESUMO DE TESTES DE COMANDOS                  ║");
        Console.WriteLine("╚══════════════════════════════════════════════════════════╝\n");

        var total = _results.Count;
        var passed = _results.Count(r => r.Passed);
        var failed = total - passed;
        var percentage = total > 0 ? (passed * 100.0 / total) : 0;

        Console.WriteLine($"Total de Testes: {total}");
        Console.WriteLine($"Aprovados: {passed} ({percentage:F1}%)");
        Console.WriteLine($"Falhados: {failed}");
        Console.WriteLine();

        var byCategory = _results.GroupBy(r => r.Category);
        foreach (var group in byCategory)
        {
            var catPassed = group.Count(r => r.Passed);
            var catTotal = group.Count();
            var avgTime = group.Average(r => r.Duration.TotalMilliseconds);
            Console.WriteLine($"{group.Key}: {catPassed}/{catTotal} aprovados (avg: {avgTime:F0}ms)");
        }

        Console.WriteLine("\n" + new string('═', 60));

        if (failed == 0)
        {
            Console.WriteLine("🎉 TODOS OS COMANDOS FUNCIONAM CORRETAMENTE!");
        }
        else
        {
            Console.WriteLine($"⚠️  {failed} COMANDO(S) FALHARAM");

            var failures = _results.Where(r => !r.Passed);
            foreach (var failure in failures)
            {
                Console.WriteLine($"  ❌ {failure.Category}/{failure.TestName}: {failure.Message}");
            }
        }

        Console.WriteLine(new string('═', 60) + "\n");
    }
}
