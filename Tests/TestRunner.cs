using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ArxisVR.Tests.Security;
using ArxisVR.Tests.E2E;

namespace ArxisVR.Tests;

/// <summary>
/// Main test runner for ArxisVR E2E and Security tests
/// </summary>
class Program
{
    static async Task Main(string[] args)
    {
        Console.OutputEncoding = System.Text.Encoding.UTF8;

        Console.WriteLine(@"
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║              🚀 ARXISVR - SUITE DE TESTES E2E                   ║
║                   Testes de Segurança e Funcionais               ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
");

        var startTime = DateTime.Now;

        // 1. Run Security Tests
        Console.WriteLine("\n🔐 FASE 1: TESTES DE SEGURANÇA\n");
        var securityTests = new SecurityTests();
        var securityResults = await securityTests.RunAllTestsAsync();
        securityTests.PrintSummary();

        // 2. Run Functional Tests
        Console.WriteLine("\n🧪 FASE 2: TESTES FUNCIONAIS E2E\n");
        var functionalTests = new FunctionalTests();
        var functionalResults = await functionalTests.RunAllTestsAsync();
        functionalTests.PrintSummary();

        // 3. Overall Summary
        var endTime = DateTime.Now;
        var totalTime = endTime - startTime;

        PrintOverallSummary(securityResults, functionalResults, totalTime);

        // 4. Generate Report
        await GenerateTestReportAsync(securityResults, functionalResults, totalTime);

        Console.WriteLine("\n✨ Pressione qualquer tecla para sair...");
        Console.ReadKey();
    }

    static void PrintOverallSummary(
        System.Collections.Generic.List<SecurityTests.TestResult> securityResults,
        System.Collections.Generic.List<FunctionalTests.TestResult> functionalResults,
        TimeSpan totalTime)
    {
        Console.WriteLine("\n╔══════════════════════════════════════════════════════════════════╗");
        Console.WriteLine("║                    📊 RESUMO GERAL DOS TESTES                    ║");
        Console.WriteLine("╚══════════════════════════════════════════════════════════════════╝\n");

        var totalTests = securityResults.Count + functionalResults.Count;
        var totalPassed = securityResults.Count(r => r.Passed) + functionalResults.Count(r => r.Passed);
        var totalFailed = totalTests - totalPassed;
        var percentage = totalTests > 0 ? (totalPassed * 100.0 / totalTests) : 0;

        Console.WriteLine($"⏱️  Tempo Total de Execução: {totalTime.TotalSeconds:F2}s");
        Console.WriteLine($"📋 Total de Testes: {totalTests}");
        Console.WriteLine($"✅ Testes Aprovados: {totalPassed} ({percentage:F1}%)");
        Console.WriteLine($"❌ Testes Falhados: {totalFailed}");
        Console.WriteLine();

        // Security breakdown
        var criticalFailed = securityResults
            .Where(r => !r.Passed && r.Severity == SecurityTests.SecurityLevel.Critical)
            .ToList();
        var highFailed = securityResults
            .Where(r => !r.Passed && r.Severity == SecurityTests.SecurityLevel.High)
            .ToList();

        if (criticalFailed.Any() || highFailed.Any())
        {
            Console.WriteLine("⚠️  VULNERABILIDADES CRÍTICAS DETECTADAS:");
            foreach (var test in criticalFailed)
            {
                Console.WriteLine($"   🔴 CRÍTICO: {test.TestName}");
            }
            foreach (var test in highFailed)
            {
                Console.WriteLine($"   🟠 ALTO: {test.TestName}");
            }
            Console.WriteLine();
        }

        // Final verdict
        Console.WriteLine(new string('═', 70));

        if (totalFailed == 0)
        {
            Console.WriteLine("🎉 SUCESSO TOTAL! Todos os testes passaram!");
            Console.WriteLine("✅ Sistema aprovado para produção");
        }
        else if (criticalFailed.Any())
        {
            Console.WriteLine("🚨 FALHA CRÍTICA! Vulnerabilidades críticas detectadas!");
            Console.WriteLine("❌ Sistema NÃO aprovado para produção");
        }
        else if (totalFailed <= 3)
        {
            Console.WriteLine("⚠️  Aprovado com ressalvas. Alguns testes falharam.");
            Console.WriteLine("🔍 Revisar falhas antes da produção");
        }
        else
        {
            Console.WriteLine($"❌ REPROVADO! {totalFailed} testes falharam.");
            Console.WriteLine("🔧 Correções necessárias antes da produção");
        }

        Console.WriteLine(new string('═', 70) + "\n");
    }

    static async Task GenerateTestReportAsync(
        System.Collections.Generic.List<SecurityTests.TestResult> securityResults,
        System.Collections.Generic.List<FunctionalTests.TestResult> functionalResults,
        TimeSpan totalTime)
    {
        var reportPath = Path.Combine(
            Directory.GetCurrentDirectory(),
            "Tests",
            $"TestReport_{DateTime.Now:yyyyMMdd_HHmmss}.md"
        );

        Directory.CreateDirectory(Path.GetDirectoryName(reportPath)!);

        var report = GenerateMarkdownReport(securityResults, functionalResults, totalTime);
        await File.WriteAllTextAsync(reportPath, report);

        Console.WriteLine($"📄 Relatório gerado: {reportPath}");
    }

    static string GenerateMarkdownReport(
        System.Collections.Generic.List<SecurityTests.TestResult> securityResults,
        System.Collections.Generic.List<FunctionalTests.TestResult> functionalResults,
        TimeSpan totalTime)
    {
        var totalTests = securityResults.Count + functionalResults.Count;
        var totalPassed = securityResults.Count(r => r.Passed) + functionalResults.Count(r => r.Passed);
        var percentage = totalTests > 0 ? (totalPassed * 100.0 / totalTests) : 0;

        var report = $@"# 📊 Relatório de Testes E2E - ArxisVR

**Data:** {DateTime.Now:dd/MM/yyyy HH:mm:ss}
**Duração Total:** {totalTime.TotalSeconds:F2}s
**Status:** {(totalPassed == totalTests ? "✅ APROVADO" : "❌ REPROVADO")}

---

## 📈 Resumo Executivo

| Métrica | Valor |
|---------|-------|
| Total de Testes | {totalTests} |
| Aprovados | {totalPassed} ({percentage:F1}%) |
| Falhados | {totalTests - totalPassed} |
| Taxa de Sucesso | {percentage:F1}% |

---

## 🔒 Testes de Segurança

**Total:** {securityResults.Count} testes
**Aprovados:** {securityResults.Count(r => r.Passed)} ({(securityResults.Count(r => r.Passed) * 100.0 / securityResults.Count):F1}%)

### Por Severidade

{GenerateSeverityTable(securityResults)}

### Resultados Detalhados

{GenerateSecurityDetails(securityResults)}

---

## 🧪 Testes Funcionais

**Total:** {functionalResults.Count} testes
**Aprovados:** {functionalResults.Count(r => r.Passed)} ({(functionalResults.Count(r => r.Passed) * 100.0 / functionalResults.Count):F1}%)

### Por Categoria

{GenerateCategoryTable(functionalResults)}

### Resultados Detalhados

{GenerateFunctionalDetails(functionalResults)}

---

## 🎯 Conclusão

{GenerateConclusion(securityResults, functionalResults)}

---

## 📋 Recomendações

{GenerateRecommendations(securityResults, functionalResults)}

---

*Relatório gerado automaticamente pelo ArxisVR Test Suite*
";

        return report;
    }

    static string GenerateSeverityTable(System.Collections.Generic.List<SecurityTests.TestResult> results)
    {
        var table = "| Severidade | Total | Aprovados | Falhados |\n";
        table += "|------------|-------|-----------|----------|\n";

        foreach (var severity in Enum.GetValues<SecurityTests.SecurityLevel>())
        {
            var tests = results.Where(r => r.Severity == severity).ToList();
            if (tests.Any())
            {
                var passed = tests.Count(r => r.Passed);
                var failed = tests.Count - passed;
                table += $"| {GetSeverityIcon(severity)} {severity} | {tests.Count} | {passed} | {failed} |\n";
            }
        }

        return table;
    }

    static string GetSeverityIcon(SecurityTests.SecurityLevel severity) => severity switch
    {
        SecurityTests.SecurityLevel.Critical => "🔴",
        SecurityTests.SecurityLevel.High => "🟠",
        SecurityTests.SecurityLevel.Medium => "🟡",
        SecurityTests.SecurityLevel.Low => "🟢",
        _ => "⚪"
    };

    static string GenerateSecurityDetails(System.Collections.Generic.List<SecurityTests.TestResult> results)
    {
        var details = "";
        var grouped = results.GroupBy(r => r.Severity).OrderByDescending(g => g.Key);

        foreach (var group in grouped)
        {
            details += $"#### {GetSeverityIcon(group.Key)} {group.Key}\n\n";
            foreach (var result in group)
            {
                var icon = result.Passed ? "✅" : "❌";
                details += $"- {icon} **{result.TestName}**: {result.Message}\n";
            }
            details += "\n";
        }

        return details;
    }

    static string GenerateCategoryTable(System.Collections.Generic.List<FunctionalTests.TestResult> results)
    {
        var table = "| Categoria | Total | Aprovados | Falhados | Tempo Médio |\n";
        table += "|-----------|-------|-----------|----------|-------------|\n";

        var grouped = results.GroupBy(r => r.Category).OrderBy(g => g.Key);
        foreach (var group in grouped)
        {
            var passed = group.Count(r => r.Passed);
            var failed = group.Count() - passed;
            var avgTime = group.Average(r => r.Duration.TotalMilliseconds);
            table += $"| {group.Key} | {group.Count()} | {passed} | {failed} | {avgTime:F0}ms |\n";
        }

        return table;
    }

    static string GenerateFunctionalDetails(System.Collections.Generic.List<FunctionalTests.TestResult> results)
    {
        var details = "";
        var grouped = results.GroupBy(r => r.Category).OrderBy(g => g.Key);

        foreach (var group in grouped)
        {
            details += $"#### {group.Key}\n\n";
            foreach (var result in group)
            {
                var icon = result.Passed ? "✅" : "❌";
                details += $"- {icon} **{result.TestName}**: {result.Message} ({result.Duration.TotalMilliseconds:F0}ms)\n";
            }
            details += "\n";
        }

        return details;
    }

    static string GenerateConclusion(
        System.Collections.Generic.List<SecurityTests.TestResult> securityResults,
        System.Collections.Generic.List<FunctionalTests.TestResult> functionalResults)
    {
        var criticalFailed = securityResults
            .Where(r => !r.Passed && r.Severity == SecurityTests.SecurityLevel.Critical)
            .Count();

        if (criticalFailed > 0)
        {
            return $@"### 🚨 Sistema REPROVADO

**{criticalFailed} vulnerabilidade(s) crítica(s)** foram detectadas. O sistema **NÃO DEVE** ser colocado em produção até que todas as vulnerabilidades críticas sejam resolvidas.

**Ação Imediata Necessária:** Corrigir todas as vulnerabilidades críticas antes de qualquer deploy.";
        }

        var totalFailed = securityResults.Count(r => !r.Passed) + functionalResults.Count(r => !r.Passed);

        if (totalFailed == 0)
        {
            return @"### ✅ Sistema APROVADO

Todos os testes passaram com sucesso! O sistema demonstrou:

- ✅ Segurança robusta sem vulnerabilidades críticas
- ✅ Funcionalidades operacionais conforme esperado
- ✅ Performance adequada
- ✅ Gestão de recursos eficiente

**Sistema pronto para produção.**";
        }

        return $@"### ⚠️ Sistema APROVADO com Ressalvas

O sistema passou na maioria dos testes ({totalFailed} falhas não-críticas). Recomenda-se revisar e corrigir as falhas identificadas antes do deploy em produção.

**Ação Recomendada:** Revisar e corrigir falhas menores.";
    }

    static string GenerateRecommendations(
        System.Collections.Generic.List<SecurityTests.TestResult> securityResults,
        System.Collections.Generic.List<FunctionalTests.TestResult> functionalResults)
    {
        var recommendations = "";

        // Security recommendations
        var securityFailed = securityResults.Where(r => !r.Passed).ToList();
        if (securityFailed.Any())
        {
            recommendations += "### 🔒 Segurança\n\n";
            foreach (var failure in securityFailed.Take(5))
            {
                recommendations += $"- [ ] **{failure.TestName}**: {failure.Message}\n";
            }
            recommendations += "\n";
        }

        // Functional recommendations
        var functionalFailed = functionalResults.Where(r => !r.Passed).ToList();
        if (functionalFailed.Any())
        {
            recommendations += "### 🧪 Funcionalidades\n\n";
            foreach (var failure in functionalFailed.Take(5))
            {
                recommendations += $"- [ ] **{failure.TestName}**: {failure.Message}\n";
            }
            recommendations += "\n";
        }

        if (!securityFailed.Any() && !functionalFailed.Any())
        {
            recommendations = @"### ✅ Nenhuma ação necessária

Todos os testes passaram com sucesso. Recomendações gerais:

- Continue executando testes regularmente
- Mantenha as dependências atualizadas
- Monitore logs de segurança em produção
- Implemente testes de integração contínua (CI/CD)";
        }

        return recommendations;
    }
}
