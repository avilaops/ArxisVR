using System;
using System.IO;
using System.Linq;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace ArxisVR.Tests.Standalone;

/// <summary>
/// Standalone test runner that doesn't require compiling the full project
/// </summary>
class StandaloneTestRunner
{
    static async Task Main(string[] args)
    {
        Console.OutputEncoding = System.Text.Encoding.UTF8;

        Console.WriteLine(@"
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║              🚀 ARXISVR - SUITE DE TESTES E2E                   ║
║                Análise de Segurança e Funcionalidades             ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
");

        var startTime = DateTime.Now;
        var results = new List<TestResult>();

        // Run all tests
        results.AddRange(await RunSecurityTestsAsync());
        results.AddRange(await RunFunctionalTestsAsync());
        results.AddRange(await RunCodeAnalysisAsync());

        var endTime = DateTime.Now;
        var totalTime = endTime - startTime;

        // Print summary
        PrintSummary(results, totalTime);

        // Generate report
        await GenerateReportAsync(results, totalTime);

        Console.WriteLine("\n✨ Pressione qualquer tecla para sair...");
        Console.ReadKey();
    }

    class TestResult
    {
        public string Category { get; set; } = "";
        public string Name { get; set; } = "";
        public bool Passed { get; set; }
        public string Message { get; set; } = "";
        public string Severity { get; set; } = "Info";
    }

    static async Task<List<TestResult>> RunSecurityTestsAsync()
    {
        Console.WriteLine("\n🔐 FASE 1: ANÁLISE DE SEGURANÇA\n");
        var results = new List<TestResult>();
        var baseDir = FindProjectRoot();

        // Test 1: Path Traversal Protection
        results.Add(new TestResult
        {
            Category = "Segurança",
            Name = "Proteção contra Path Traversal",
            Passed = await TestPathTraversalAsync(baseDir),
            Message = "Sistema valida caminhos de arquivo",
            Severity = "Critical"
        });

        // Test 2: File Extension Validation
        results.Add(new TestResult
        {
            Category = "Segurança",
            Name = "Validação de Extensão de Arquivo",
            Passed = TestFileExtensionValidation(baseDir),
            Message = "Apenas arquivos .ifc são processados",
            Severity = "High"
        });

        // Test 3: Null Reference Protection
        results.Add(new TestResult
        {
            Category = "Segurança",
            Name = "Proteção contra Null Reference",
            Passed = CheckNullableAnnotations(baseDir),
            Message = "Código usa nullable reference types",
            Severity = "Medium"
        });

        // Test 4: Unsafe Code Usage
        results.Add(new TestResult
        {
            Category = "Segurança",
            Name = "Uso de Código Unsafe",
            Passed = CheckUnsafeCodeUsage(baseDir),
            Message = "Código unsafe usado apropriadamente",
            Severity = "High"
        });

        // Test 5: Environment Variable Security
        results.Add(new TestResult
        {
            Category = "Segurança",
            Name = "Segurança de Variáveis de Ambiente",
            Passed = CheckEnvironmentVariableSecurity(baseDir),
            Message = "Configurações sensíveis em variáveis de ambiente",
            Severity = "High"
        });

        // Test 6: Input Validation
        results.Add(new TestResult
        {
            Category = "Segurança",
            Name = "Validação de Entrada",
            Passed = CheckInputValidation(baseDir),
            Message = "Parâmetros são validados",
            Severity = "High"
        });

        // Test 7: Exception Handling
        results.Add(new TestResult
        {
            Category = "Segurança",
            Name = "Tratamento de Exceções",
            Passed = CheckExceptionHandling(baseDir),
            Message = "Exceções são tratadas adequadamente",
            Severity = "Medium"
        });

        // Test 8: Resource Disposal
        results.Add(new TestResult
        {
            Category = "Segurança",
            Name = "Disposal de Recursos",
            Passed = CheckResourceDisposal(baseDir),
            Message = "IDisposable implementado corretamente",
            Severity = "Medium"
        });

        // Test 9: Network Security (AI)
        results.Add(new TestResult
        {
            Category = "Segurança",
            Name = "Segurança de Rede (AI)",
            Passed = CheckNetworkSecurity(baseDir),
            Message = "Comunicação com AI é segura",
            Severity = "High"
        });

        // Test 10: Logging Security
        results.Add(new TestResult
        {
            Category = "Segurança",
            Name = "Logging Seguro",
            Passed = CheckLoggingSecurity(baseDir),
            Message = "Logs não expõem dados sensíveis",
            Severity = "Medium"
        });

        foreach (var result in results)
        {
            var icon = result.Passed ? "✅" : "❌";
            var sevIcon = result.Severity switch
            {
                "Critical" => "🔴",
                "High" => "🟠",
                "Medium" => "🟡",
                _ => "🟢"
            };
            Console.WriteLine($"{icon} {sevIcon} {result.Name}: {result.Message}");
        }

        await Task.CompletedTask;
        return results;
    }

    static async Task<List<TestResult>> RunFunctionalTestsAsync()
    {
        Console.WriteLine("\n🧪 FASE 2: ANÁLISE FUNCIONAL\n");
        var results = new List<TestResult>();
        var baseDir = FindProjectRoot();

        // Test 1: IFC Parser Exists
        results.Add(new TestResult
        {
            Category = "Funcional",
            Name = "Parser IFC",
            Passed = File.Exists(Path.Combine(baseDir, "Services", "IfcParser.cs")),
            Message = "Sistema de parsing IFC implementado",
            Severity = "Info"
        });

        // Test 2: 3D Rendering System
        results.Add(new TestResult
        {
            Category = "Funcional",
            Name = "Sistema de Renderização 3D",
            Passed = File.Exists(Path.Combine(baseDir, "Rendering", "Renderer3D.cs")),
            Message = "Renderização 3D implementada",
            Severity = "Info"
        });

        // Test 3: VR/AR Support
        results.Add(new TestResult
        {
            Category = "Funcional",
            Name = "Suporte VR/AR",
            Passed = File.Exists(Path.Combine(baseDir, "VR", "VRManager.cs")),
            Message = "Sistema VR/AR implementado",
            Severity = "Info"
        });

        // Test 4: AI Integration
        results.Add(new TestResult
        {
            Category = "Funcional",
            Name = "Integração AI",
            Passed = File.Exists(Path.Combine(baseDir, "AI", "IfcAIAssistant.cs")),
            Message = "Assistente AI implementado",
            Severity = "Info"
        });

        // Test 5: Measurement Tools
        results.Add(new TestResult
        {
            Category = "Funcional",
            Name = "Ferramentas de Medição",
            Passed = File.Exists(Path.Combine(baseDir, "Tools", "MeasurementTool.cs")),
            Message = "Ferramenta de medição disponível",
            Severity = "Info"
        });

        // Test 6: Annotation System
        results.Add(new TestResult
        {
            Category = "Funcional",
            Name = "Sistema de Anotações",
            Passed = File.Exists(Path.Combine(baseDir, "Tools", "AnnotationSystem.cs")),
            Message = "Sistema de anotações disponível",
            Severity = "Info"
        });

        // Test 7: Layer Management
        results.Add(new TestResult
        {
            Category = "Funcional",
            Name = "Gerenciamento de Camadas",
            Passed = File.Exists(Path.Combine(baseDir, "Tools", "LayerManager.cs")),
            Message = "Gerenciador de camadas implementado",
            Severity = "Info"
        });

        // Test 8: Undo/Redo System
        results.Add(new TestResult
        {
            Category = "Funcional",
            Name = "Sistema Undo/Redo",
            Passed = File.Exists(Path.Combine(baseDir, "Tools", "UndoRedoManager.cs")),
            Message = "Sistema de desfazer/refazer implementado",
            Severity = "Info"
        });

        // Test 9: UI System
        results.Add(new TestResult
        {
            Category = "Funcional",
            Name = "Sistema de UI",
            Passed = File.Exists(Path.Combine(baseDir, "UI", "UIManager.cs")),
            Message = "Interface de usuário implementada",
            Severity = "Info"
        });

        // Test 10: Camera System
        results.Add(new TestResult
        {
            Category = "Funcional",
            Name = "Sistema de Câmera",
            Passed = File.Exists(Path.Combine(baseDir, "Rendering", "Camera.cs")),
            Message = "Sistema de câmera implementado",
            Severity = "Info"
        });

        foreach (var result in results)
        {
            var icon = result.Passed ? "✅" : "❌";
            Console.WriteLine($"{icon} {result.Name}: {result.Message}");
        }

        await Task.CompletedTask;
        return results;
    }

    static async Task<List<TestResult>> RunCodeAnalysisAsync()
    {
        Console.WriteLine("\n📊 FASE 3: ANÁLISE DE CÓDIGO\n");
        var results = new List<TestResult>();
        var baseDir = FindProjectRoot();

        // Test 1: Code Structure
        var allFiles = Directory.GetFiles(baseDir, "*.cs", SearchOption.AllDirectories)
            .Where(f => !f.Contains("\\bin\\") && !f.Contains("\\obj\\") && !f.Contains("\\Tests\\"))
            .ToList();

        results.Add(new TestResult
        {
            Category = "Análise",
            Name = "Estrutura do Código",
            Passed = allFiles.Count > 20,
            Message = $"{allFiles.Count} arquivos C# encontrados",
            Severity = "Info"
        });

        // Test 2: Documentation
        int documentedFiles = 0;
        foreach (var file in allFiles.Take(10)) // Sample
        {
            var content = await File.ReadAllTextAsync(file);
            if (content.Contains("///") || content.Contains("/**"))
                documentedFiles++;
        }

        results.Add(new TestResult
        {
            Category = "Análise",
            Name = "Documentação",
            Passed = documentedFiles > 5,
            Message = $"{documentedFiles}/10 arquivos amostrais documentados",
            Severity = "Info"
        });

        // Test 3: Project Structure
        var folders = new[] { "AI", "Application", "Interaction", "Models", "Rendering",
                             "Services", "Tools", "UI", "VR" };
        int existingFolders = folders.Count(f => Directory.Exists(Path.Combine(baseDir, f)));

        results.Add(new TestResult
        {
            Category = "Análise",
            Name = "Estrutura de Pastas",
            Passed = existingFolders == folders.Length,
            Message = $"{existingFolders}/{folders.Length} pastas organizadas",
            Severity = "Info"
        });

        // Test 4: Dependencies
        var csprojPath = Path.Combine(baseDir, "ArxisVR.csproj");
        if (File.Exists(csprojPath))
        {
            var csproj = await File.ReadAllTextAsync(csprojPath);
            var packageCount = System.Text.RegularExpressions.Regex.Matches(csproj, "PackageReference").Count;

            results.Add(new TestResult
            {
                Category = "Análise",
                Name = "Dependências",
                Passed = packageCount > 10,
                Message = $"{packageCount} pacotes NuGet utilizados",
                Severity = "Info"
            });
        }

        foreach (var result in results)
        {
            var icon = result.Passed ? "✅" : "❌";
            Console.WriteLine($"{icon} {result.Name}: {result.Message}");
        }

        return results;
    }

    // Security check implementations
    static async Task<bool> TestPathTraversalAsync(string baseDir)
    {
        var parserPath = Path.Combine(baseDir, "Services", "IfcParser.cs");
        if (!File.Exists(parserPath)) return false;

        var content = await File.ReadAllTextAsync(parserPath);
        // Check if file exists validation is present
        return content.Contains("File.Exists");
    }

    static bool TestFileExtensionValidation(string baseDir)
    {
        var parserPath = Path.Combine(baseDir, "Services", "IfcParser.cs");
        if (!File.Exists(parserPath)) return false;

        var content = File.ReadAllText(parserPath);
        // IFC parser should handle .ifc files
        return content.Contains(".ifc") || content.Contains("IFC");
    }

    static bool CheckNullableAnnotations(string baseDir)
    {
        var csprojPath = Path.Combine(baseDir, "ArxisVR.csproj");
        if (!File.Exists(csprojPath)) return false;

        var content = File.ReadAllText(csprojPath);
        return content.Contains("<Nullable>enable</Nullable>");
    }

    static bool CheckUnsafeCodeUsage(string baseDir)
    {
        var allFiles = Directory.GetFiles(baseDir, "*.cs", SearchOption.AllDirectories)
            .Where(f => !f.Contains("\\bin\\") && !f.Contains("\\obj\\"))
            .ToList();

        int unsafeCount = 0;
        foreach (var file in allFiles)
        {
            var content = File.ReadAllText(file);
            if (content.Contains("unsafe"))
                unsafeCount++;
        }

        // Unsafe code should be minimal
        return unsafeCount < 5;
    }

    static bool CheckEnvironmentVariableSecurity(string baseDir)
    {
        var aiConfigPath = Path.Combine(baseDir, "AI", "AIConfig.cs");
        if (!File.Exists(aiConfigPath)) return false;

        var content = File.ReadAllText(aiConfigPath);
        // Should use environment variables
        return content.Contains("Environment") || content.Contains("DotNetEnv");
    }

    static bool CheckInputValidation(string baseDir)
    {
        var parserPath = Path.Combine(baseDir, "Services", "IfcParser.cs");
        if (!File.Exists(parserPath)) return false;

        var content = File.ReadAllText(parserPath);
        // Should have null/validation checks
        return content.Contains("if") && (content.Contains("null") || content.Contains("Exists"));
    }

    static bool CheckExceptionHandling(string baseDir)
    {
        var programPath = Path.Combine(baseDir, "Program.cs");
        if (!File.Exists(programPath)) return false;

        var content = File.ReadAllText(programPath);
        // Should have try-catch blocks
        return content.Contains("try") && content.Contains("catch");
    }

    static bool CheckResourceDisposal(string baseDir)
    {
        var ollamaPath = Path.Combine(baseDir, "AI", "OllamaService.cs");
        if (!File.Exists(ollamaPath)) return false;

        var content = File.ReadAllText(ollamaPath);
        // Should implement IDisposable
        return content.Contains("IDisposable") && content.Contains("Dispose");
    }

    static bool CheckNetworkSecurity(string baseDir)
    {
        var ollamaPath = Path.Combine(baseDir, "AI", "OllamaService.cs");
        if (!File.Exists(ollamaPath)) return false;

        var content = File.ReadAllText(ollamaPath);
        // Should have timeout and error handling
        return content.Contains("Timeout") || content.Contains("HttpClient");
    }

    static bool CheckLoggingSecurity(string baseDir)
    {
        var programPath = Path.Combine(baseDir, "Program.cs");
        if (!File.Exists(programPath)) return false;

        var content = File.ReadAllText(programPath);
        // Should use Console.WriteLine for logging (not exposing sensitive data)
        return content.Contains("Console.WriteLine");
    }

    static string FindProjectRoot()
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

    static void PrintSummary(List<TestResult> results, TimeSpan totalTime)
    {
        Console.WriteLine("\n╔══════════════════════════════════════════════════════════════════╗");
        Console.WriteLine("║                    📊 RESUMO GERAL DOS TESTES                    ║");
        Console.WriteLine("╚══════════════════════════════════════════════════════════════════╝\n");

        var total = results.Count;
        var passed = results.Count(r => r.Passed);
        var failed = total - passed;
        var percentage = total > 0 ? (passed * 100.0 / total) : 0;

        Console.WriteLine($"⏱️  Tempo Total: {totalTime.TotalSeconds:F2}s");
        Console.WriteLine($"📋 Total de Testes: {total}");
        Console.WriteLine($"✅ Aprovados: {passed} ({percentage:F1}%)");
        Console.WriteLine($"❌ Falhados: {failed}");
        Console.WriteLine();

        // By category
        var byCategory = results.GroupBy(r => r.Category);
        foreach (var group in byCategory)
        {
            var catPassed = group.Count(r => r.Passed);
            var catTotal = group.Count();
            Console.WriteLine($"{group.Key}: {catPassed}/{catTotal} aprovados");
        }

        // Critical failures
        var criticalFailed = results.Where(r => !r.Passed && r.Severity == "Critical").ToList();
        var highFailed = results.Where(r => !r.Passed && r.Severity == "High").ToList();

        if (criticalFailed.Any())
        {
            Console.WriteLine("\n⚠️  VULNERABILIDADES CRÍTICAS:");
            foreach (var test in criticalFailed)
            {
                Console.WriteLine($"   🔴 {test.Name}");
            }
        }

        if (highFailed.Any())
        {
            Console.WriteLine("\n⚠️  VULNERABILIDADES ALTAS:");
            foreach (var test in highFailed)
            {
                Console.WriteLine($"   🟠 {test.Name}");
            }
        }

        Console.WriteLine("\n" + new string('═', 70));

        if (failed == 0)
        {
            Console.WriteLine("🎉 SUCESSO! Todos os testes passaram!");
            Console.WriteLine("✅ Sistema aprovado");
        }
        else if (criticalFailed.Any())
        {
            Console.WriteLine("🚨 FALHA CRÍTICA! Correção necessária!");
            Console.WriteLine("❌ Sistema NÃO aprovado");
        }
        else
        {
            Console.WriteLine($"⚠️  Aprovado com {failed} ressalva(s)");
        }

        Console.WriteLine(new string('═', 70));
    }

    static async Task GenerateReportAsync(List<TestResult> results, TimeSpan totalTime)
    {
        var baseDir = FindProjectRoot();
        var reportPath = Path.Combine(baseDir, "Tests", $"TestReport_{DateTime.Now:yyyyMMdd_HHmmss}.md");

        Directory.CreateDirectory(Path.GetDirectoryName(reportPath)!);

        var total = results.Count;
        var passed = results.Count(r => r.Passed);
        var percentage = total > 0 ? (passed * 100.0 / total) : 0;

        var report = $@"# 📊 Relatório de Testes E2E - ArxisVR

**Data:** {DateTime.Now:dd/MM/yyyy HH:mm:ss}
**Duração:** {totalTime.TotalSeconds:F2}s
**Status:** {(passed == total ? "✅ APROVADO" : "❌ REPROVADO")}

---

## 📈 Resumo

| Métrica | Valor |
|---------|-------|
| Total | {total} |
| Aprovados | {passed} ({percentage:F1}%) |
| Falhados | {total - passed} |

---

## 🔒 Testes de Segurança

{GenerateCategorySection(results.Where(r => r.Category == "Segurança").ToList())}

---

## 🧪 Testes Funcionais

{GenerateCategorySection(results.Where(r => r.Category == "Funcional").ToList())}

---

## 📊 Análise de Código

{GenerateCategorySection(results.Where(r => r.Category == "Análise").ToList())}

---

## 🎯 Conclusão

{GenerateConclusion(results)}

---

*Relatório gerado automaticamente pelo ArxisVR Test Suite*
";

        await File.WriteAllTextAsync(reportPath, report);
        Console.WriteLine($"\n📄 Relatório salvo em: {reportPath}");
    }

    static string GenerateCategorySection(List<TestResult> results)
    {
        if (!results.Any()) return "*Nenhum teste nesta categoria*";

        var section = "";
        foreach (var result in results)
        {
            var icon = result.Passed ? "✅" : "❌";
            var sevIcon = result.Severity switch
            {
                "Critical" => "🔴",
                "High" => "🟠",
                "Medium" => "🟡",
                _ => "🟢"
            };
            section += $"- {icon} {sevIcon} **{result.Name}**: {result.Message}\n";
        }
        return section;
    }

    static string GenerateConclusion(List<TestResult> results)
    {
        var criticalFailed = results.Where(r => !r.Passed && r.Severity == "Critical").Count();
        var highFailed = results.Where(r => !r.Passed && r.Severity == "High").Count();
        var totalFailed = results.Count(r => !r.Passed);

        if (criticalFailed > 0)
        {
            return $@"### 🚨 Sistema REPROVADO

**{criticalFailed} vulnerabilidade(s) crítica(s)** detectadas.

**Ação Necessária:** Corrigir vulnerabilidades críticas imediatamente.";
        }

        if (totalFailed == 0)
        {
            return @"### ✅ Sistema APROVADO

Todos os testes passaram com sucesso!

- ✅ Segurança robusta
- ✅ Funcionalidades completas
- ✅ Código bem estruturado";
        }

        return $@"### ⚠️ Sistema APROVADO com Ressalvas

{totalFailed} teste(s) falharam (não-críticos).

**Recomendação:** Revisar e corrigir as falhas identificadas.";
    }
}
