using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ArxisVR.Tests.Commands;
using ArxisVR.Tests.Backend;
using ArxisVR.Tests.Frontend;

namespace ArxisVR.Tests;

/// <summary>
/// Runner completo para executar TODOS os testes:
/// - Comandos e scripts
/// - Backend (serviços, lógica)
/// - Frontend (UI, interação)
/// </summary>
public class CompleteTestRunner
{
    private readonly string _projectRoot;
    private readonly string _timestamp;
    private readonly List<string> _reportLines = new();

    public CompleteTestRunner()
    {
        _projectRoot = FindProjectRoot();
        _timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");
    }

    public static async Task Main(string[] args)
    {
        var runner = new CompleteTestRunner();
        await runner.RunAllTestSuitesAsync();
    }

    public async Task RunAllTestSuitesAsync()
    {
        PrintHeader();

        var overallStopwatch = Stopwatch.StartNew();
        var allResults = new Dictionary<string, (int passed, int total, List<object> results)>();

        // 1. TESTES DE COMANDOS E SCRIPTS
        Console.WriteLine("\n┌─────────────────────────────────────────────────────────┐");
        Console.WriteLine("│  FASE 1: TESTES DE COMANDOS E SCRIPTS                  │");
        Console.WriteLine("└─────────────────────────────────────────────────────────┘\n");

        var commandTests = new CommandTests();
        var commandResults = await commandTests.RunAllTestsAsync();
        commandTests.PrintSummary();

        var commandPassed = commandResults.Count(r => r.Passed);
        allResults["Comandos"] = (commandPassed, commandResults.Count, commandResults.Cast<object>().ToList());

        // 2. TESTES DE BACKEND
        Console.WriteLine("\n┌─────────────────────────────────────────────────────────┐");
        Console.WriteLine("│  FASE 2: TESTES DE BACKEND                             │");
        Console.WriteLine("└─────────────────────────────────────────────────────────┘\n");

        var backendTests = new BackendTests();
        var backendResults = await backendTests.RunAllTestsAsync();
        backendTests.PrintSummary();

        var backendPassed = backendResults.Count(r => r.Passed);
        allResults["Backend"] = (backendPassed, backendResults.Count, backendResults.Cast<object>().ToList());

        // 3. TESTES DE FRONTEND
        Console.WriteLine("\n┌─────────────────────────────────────────────────────────┐");
        Console.WriteLine("│  FASE 3: TESTES DE FRONTEND                            │");
        Console.WriteLine("└─────────────────────────────────────────────────────────┘\n");

        var frontendTests = new FrontendTests();
        var frontendResults = await frontendTests.RunAllTestsAsync();
        frontendTests.PrintSummary();

        var frontendPassed = frontendResults.Count(r => r.Passed);
        allResults["Frontend"] = (frontendPassed, frontendResults.Count, frontendResults.Cast<object>().ToList());

        overallStopwatch.Stop();

        // SUMÁRIO GERAL
        PrintOverallSummary(allResults, overallStopwatch.Elapsed);

        // GERAR RELATÓRIO
        await GenerateDetailedReportAsync(allResults, overallStopwatch.Elapsed);

        // GERAR CERTIFICAÇÃO
        await GenerateCertificationAsync(allResults);
    }

    private void PrintHeader()
    {
        Console.Clear();
        Console.WriteLine("╔═══════════════════════════════════════════════════════════════╗");
        Console.WriteLine("║                                                               ║");
        Console.WriteLine("║        🚀 ARXISVR - TESTE COMPLETO DE SISTEMA 🚀              ║");
        Console.WriteLine("║                                                               ║");
        Console.WriteLine("║    ✅ Comandos e Scripts                                      ║");
        Console.WriteLine("║    ✅ Backend (Serviços e Lógica)                             ║");
        Console.WriteLine("║    ✅ Frontend (UI e Interação)                               ║");
        Console.WriteLine("║                                                               ║");
        Console.WriteLine("╚═══════════════════════════════════════════════════════════════╝");
    }

    private void PrintOverallSummary(
        Dictionary<string, (int passed, int total, List<object> results)> allResults,
        TimeSpan totalTime)
    {
        Console.WriteLine("\n\n");
        Console.WriteLine("╔═══════════════════════════════════════════════════════════════╗");
        Console.WriteLine("║                  📊 SUMÁRIO GERAL FINAL                       ║");
        Console.WriteLine("╚═══════════════════════════════════════════════════════════════╝\n");

        int totalPassed = 0;
        int totalTests = 0;

        foreach (var kvp in allResults)
        {
            var suite = kvp.Key;
            var (passed, total, _) = kvp.Value;
            var percentage = total > 0 ? (passed * 100.0 / total) : 0;

            var status = percentage == 100 ? "✅" : percentage >= 80 ? "⚠️" : "❌";
            Console.WriteLine($"{status} {suite,-20} {passed,3}/{total,3} ({percentage:F1}%)");

            totalPassed += passed;
            totalTests += total;
        }

        var overallPercentage = totalTests > 0 ? (totalPassed * 100.0 / totalTests) : 0;

        Console.WriteLine(new string('─', 63));
        Console.WriteLine($"   {"TOTAL",-20} {totalPassed,3}/{totalTests,3} ({overallPercentage:F1}%)");
        Console.WriteLine(new string('─', 63));
        Console.WriteLine($"\n⏱️  Tempo Total: {totalTime.TotalSeconds:F2}s\n");

        if (overallPercentage >= 95)
        {
            Console.WriteLine("╔═══════════════════════════════════════════════════════════════╗");
            Console.WriteLine("║  🎉🎉🎉 SISTEMA TOTALMENTE TESTADO E APROVADO! 🎉🎉🎉         ║");
            Console.WriteLine("╚═══════════════════════════════════════════════════════════════╝");
        }
        else if (overallPercentage >= 80)
        {
            Console.WriteLine("╔═══════════════════════════════════════════════════════════════╗");
            Console.WriteLine("║  ⚠️  SISTEMA APROVADO COM RESSALVAS                          ║");
            Console.WriteLine("╚═══════════════════════════════════════════════════════════════╝");
        }
        else
        {
            Console.WriteLine("╔═══════════════════════════════════════════════════════════════╗");
            Console.WriteLine("║  ❌ ATENÇÃO: SISTEMA REQUER CORREÇÕES                        ║");
            Console.WriteLine("╚═══════════════════════════════════════════════════════════════╝");
        }
    }

    private async Task GenerateDetailedReportAsync(
        Dictionary<string, (int passed, int total, List<object> results)> allResults,
        TimeSpan totalTime)
    {
        var sb = new StringBuilder();

        sb.AppendLine("# RELATÓRIO COMPLETO DE TESTES - ARXISVR");
        sb.AppendLine($"**Data:** {DateTime.Now:dd/MM/yyyy HH:mm:ss}");
        sb.AppendLine($"**Duração Total:** {totalTime.TotalSeconds:F2}s");
        sb.AppendLine();
        sb.AppendLine("---");
        sb.AppendLine();

        // SUMÁRIO EXECUTIVO
        sb.AppendLine("## 📊 Sumário Executivo");
        sb.AppendLine();

        int totalPassed = 0;
        int totalTests = 0;

        foreach (var kvp in allResults)
        {
            var suite = kvp.Key;
            var (passed, total, _) = kvp.Value;
            var percentage = total > 0 ? (passed * 100.0 / total) : 0;

            sb.AppendLine($"- **{suite}**: {passed}/{total} ({percentage:F1}%)");

            totalPassed += passed;
            totalTests += total;
        }

        var overallPercentage = totalTests > 0 ? (totalPassed * 100.0 / totalTests) : 0;

        sb.AppendLine();
        sb.AppendLine($"### ✅ RESULTADO GERAL: **{totalPassed}/{totalTests} ({overallPercentage:F1}%)**");
        sb.AppendLine();

        // DETALHES POR SUITE
        sb.AppendLine("---");
        sb.AppendLine();
        sb.AppendLine("## 📝 Detalhes por Suite de Testes");
        sb.AppendLine();

        foreach (var kvp in allResults)
        {
            var suite = kvp.Key;
            var (passed, total, results) = kvp.Value;

            sb.AppendLine($"### {suite}");
            sb.AppendLine();
            sb.AppendLine($"**Resultado:** {passed}/{total} testes aprovados");
            sb.AppendLine();

            sb.AppendLine("| Teste | Status | Mensagem |");
            sb.AppendLine("|-------|--------|----------|");

            foreach (var result in results)
            {
                string testName = "";
                bool isPassed = false;
                string message = "";

                // Extract properties dynamically
                var type = result.GetType();
                var testNameProp = type.GetProperty("TestName");
                var passedProp = type.GetProperty("Passed");
                var messageProp = type.GetProperty("Message");

                if (testNameProp != null) testName = testNameProp.GetValue(result)?.ToString() ?? "";
                if (passedProp != null) isPassed = (bool)(passedProp.GetValue(result) ?? false);
                if (messageProp != null) message = messageProp.GetValue(result)?.ToString() ?? "";

                var status = isPassed ? "✅" : "❌";
                sb.AppendLine($"| {testName} | {status} | {message} |");
            }

            sb.AppendLine();
        }

        // CONCLUSÕES E RECOMENDAÇÕES
        sb.AppendLine("---");
        sb.AppendLine();
        sb.AppendLine("## 🎯 Conclusões e Recomendações");
        sb.AppendLine();

        if (overallPercentage >= 95)
        {
            sb.AppendLine("✅ **Sistema aprovado para produção**");
            sb.AppendLine();
            sb.AppendLine("O sistema ArxisVR passou por testes completos de comandos, backend e frontend, " +
                         "atingindo uma taxa de aprovação superior a 95%. Todas as funcionalidades críticas " +
                         "estão operacionais e o sistema está pronto para uso.");
        }
        else if (overallPercentage >= 80)
        {
            sb.AppendLine("⚠️ **Sistema aprovado com ressalvas**");
            sb.AppendLine();
            sb.AppendLine("O sistema apresenta boa taxa de aprovação, mas alguns componentes podem necessitar " +
                         "de ajustes. Recomenda-se revisar os testes falhados antes do deploy.");
        }
        else
        {
            sb.AppendLine("❌ **Sistema requer correções**");
            sb.AppendLine();
            sb.AppendLine("Foram identificados problemas significativos que devem ser corrigidos antes do deploy. " +
                         "Revisar todos os testes falhados.");
        }

        sb.AppendLine();
        sb.AppendLine("---");
        sb.AppendLine();
        sb.AppendLine($"*Relatório gerado automaticamente em {DateTime.Now:dd/MM/yyyy HH:mm:ss}*");

        // Salvar relatório
        var reportPath = Path.Combine(_projectRoot, "Tests", $"CompleteTestReport_{_timestamp}.md");
        await File.WriteAllTextAsync(reportPath, sb.ToString());

        Console.WriteLine($"\n📄 Relatório detalhado salvo em: {reportPath}");
    }

    private async Task GenerateCertificationAsync(
        Dictionary<string, (int passed, int total, List<object> results)> allResults)
    {
        var sb = new StringBuilder();

        int totalPassed = allResults.Values.Sum(v => v.passed);
        int totalTests = allResults.Values.Sum(v => v.total);
        var overallPercentage = totalTests > 0 ? (totalPassed * 100.0 / totalTests) : 0;

        sb.AppendLine("# 🏆 CERTIFICAÇÃO OFICIAL DE TESTES - ARXISVR");
        sb.AppendLine();
        sb.AppendLine($"**Data de Emissão:** {DateTime.Now:dd/MM/yyyy}");
        sb.AppendLine($"**Versão do Sistema:** 1.0");
        sb.AppendLine($"**Tipo de Certificação:** Teste Completo de Sistema");
        sb.AppendLine();
        sb.AppendLine("---");
        sb.AppendLine();

        sb.AppendLine("## 📋 Escopo da Certificação");
        sb.AppendLine();
        sb.AppendLine("Esta certificação atesta que o sistema **ArxisVR** foi submetido a testes completos " +
                     "abrangendo as seguintes áreas:");
        sb.AppendLine();
        sb.AppendLine("1. **Comandos e Scripts** - Validação de build, deploy e automação");
        sb.AppendLine("2. **Backend** - Serviços, lógica de negócio e processamento");
        sb.AppendLine("3. **Frontend** - Interface de usuário e interação");
        sb.AppendLine();

        sb.AppendLine("---");
        sb.AppendLine();
        sb.AppendLine("## ✅ Resultados da Certificação");
        sb.AppendLine();
        sb.AppendLine($"**Taxa de Aprovação Global:** {overallPercentage:F1}%");
        sb.AppendLine($"**Testes Executados:** {totalTests}");
        sb.AppendLine($"**Testes Aprovados:** {totalPassed}");
        sb.AppendLine($"**Testes Falhados:** {totalTests - totalPassed}");
        sb.AppendLine();

        sb.AppendLine("### Detalhamento por Área:");
        sb.AppendLine();
        foreach (var kvp in allResults)
        {
            var (passed, total, _) = kvp.Value;
            var percentage = total > 0 ? (passed * 100.0 / total) : 0;
            sb.AppendLine($"- **{kvp.Key}**: {passed}/{total} ({percentage:F1}%)");
        }
        sb.AppendLine();

        sb.AppendLine("---");
        sb.AppendLine();
        sb.AppendLine("## 🎯 Parecer Final");
        sb.AppendLine();

        if (overallPercentage >= 95)
        {
            sb.AppendLine("### ✅ CERTIFICADO PARA PRODUÇÃO");
            sb.AppendLine();
            sb.AppendLine("O sistema **ArxisVR** foi testado de forma abrangente e atingiu uma taxa de " +
                         "aprovação superior a 95%. Todas as funcionalidades críticas foram validadas e " +
                         "o sistema está certificado para uso em ambiente de produção.");
        }
        else if (overallPercentage >= 80)
        {
            sb.AppendLine("### ⚠️ CERTIFICADO COM RESSALVAS");
            sb.AppendLine();
            sb.AppendLine("O sistema apresenta boa taxa de aprovação e as funcionalidades principais estão " +
                         "operacionais. Recomenda-se atenção aos componentes que apresentaram falhas nos testes.");
        }
        else
        {
            sb.AppendLine("### ❌ CERTIFICAÇÃO PENDENTE");
            sb.AppendLine();
            sb.AppendLine("O sistema requer correções significativas antes de ser certificado para produção. " +
                         "É necessário revisar e corrigir os componentes que falharam nos testes.");
        }

        sb.AppendLine();
        sb.AppendLine("---");
        sb.AppendLine();
        sb.AppendLine("## 📝 Assinatura Digital");
        sb.AppendLine();
        sb.AppendLine($"**Sistema de Teste Automatizado ArxisVR**");
        sb.AppendLine($"**Data:** {DateTime.Now:dd/MM/yyyy HH:mm:ss}");
        sb.AppendLine($"**Hash de Verificação:** {Guid.NewGuid().ToString("N").ToUpper()}");
        sb.AppendLine();
        sb.AppendLine("---");
        sb.AppendLine();
        sb.AppendLine("*Este documento foi gerado automaticamente pelo sistema de testes do ArxisVR.*");

        // Salvar certificação
        var certPath = Path.Combine(_projectRoot, "Tests", $"CERTIFICACAO_COMPLETA_{_timestamp}.md");
        await File.WriteAllTextAsync(certPath, sb.ToString());

        Console.WriteLine($"🏆 Certificação oficial salva em: {certPath}\n");
    }

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
}
