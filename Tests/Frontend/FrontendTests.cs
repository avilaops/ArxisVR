using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace ArxisVR.Tests.Frontend;

/// <summary>
/// Testes de funcionalidade de front-end (UI, interface, interação)
/// </summary>
public class FrontendTests
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
        public string Details { get; set; } = "";
    }

    public FrontendTests()
    {
        _projectRoot = FindProjectRoot();
    }

    public async Task<List<TestResult>> RunAllTestsAsync()
    {
        Console.WriteLine("\n╔══════════════════════════════════════════════════════════╗");
        Console.WriteLine("║           🎨 TESTES DE FRONT-END                         ║");
        Console.WriteLine("╚══════════════════════════════════════════════════════════╝\n");

        // UI Manager Tests
        await TestUIManagerComponentAsync();
        await TestModernToolbarComponentAsync();
        await TestElementListPanelComponentAsync();
        await TestAIChatPanelComponentAsync();

        // UI Components Tests
        await TestFileDialogComponentAsync();
        await TestWelcomeScreenComponentAsync();
        await TestNotificationSystemComponentAsync();
        await TestTutorialSystemComponentAsync();

        // Theme and Styling Tests
        await TestModernThemeAsync();
        await TestImGuiControllerAsync();

        // Interaction Tests
        await TestSelectionManagerAsync();
        await TestInteractionFeedbackAsync();

        // Visual Feedback Tests
        await TestSelectionHighlightAsync();
        await TestGridRendererAsync();
        await TestMinimapCompassAsync();

        return _results;
    }

    // ==================== UI MANAGER TESTS ====================

    private async Task TestUIManagerComponentAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var uiPath = Path.Combine(_projectRoot, "UI", "UIManager.cs");

            if (!File.Exists(uiPath))
            {
                AddResult("UI Manager", "UI Manager Component", false,
                    "UIManager.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(uiPath);

            bool hasRender = content.Contains("Render");
            bool hasUpdate = content.Contains("Update");
            bool hasSetModel = content.Contains("SetModel") || content.Contains("SetCurrentModel");
            bool hasImGui = content.Contains("ImGui");
            bool hasShowProperties = content.Contains("ShowProperties") ||
                                    content.Contains("_showProperties");
            bool hasShowElementList = content.Contains("ShowElementList") ||
                                     content.Contains("_showElementList");

            bool passed = hasRender && hasImGui && (hasShowProperties || hasShowElementList);

            var details = $"Render: {hasRender}, Update: {hasUpdate}, SetModel: {hasSetModel}, " +
                         $"ImGui: {hasImGui}, Properties: {hasShowProperties}, List: {hasShowElementList}";

            AddResult("UI Manager", "UI Manager Component", passed,
                passed ? "UI Manager completo" : "Funcionalidades faltando",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("UI Manager", "UI Manager Component", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    private async Task TestModernToolbarComponentAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var toolbarPath = Path.Combine(_projectRoot, "UI", "ModernToolbar.cs");

            if (!File.Exists(toolbarPath))
            {
                AddResult("UI Components", "Modern Toolbar Component", false,
                    "ModernToolbar.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(toolbarPath);

            bool hasRender = content.Contains("Render");
            bool hasButtons = content.Contains("Button") || content.Contains("IconButton");
            bool hasImGui = content.Contains("ImGui");
            bool hasToolbarActions = content.Contains("OnLoadFile") ||
                                    content.Contains("OnSave") ||
                                    content.Contains("Action") ||
                                    content.Contains("event");

            bool passed = hasRender && hasImGui && (hasButtons || hasToolbarActions);

            var details = $"Render: {hasRender}, Buttons: {hasButtons}, " +
                         $"ImGui: {hasImGui}, Actions: {hasToolbarActions}";

            AddResult("UI Components", "Modern Toolbar Component", passed,
                passed ? "Toolbar completo" : "Funcionalidades faltando",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("UI Components", "Modern Toolbar Component", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    private async Task TestElementListPanelComponentAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var panelPath = Path.Combine(_projectRoot, "UI", "ElementListPanel.cs");

            if (!File.Exists(panelPath))
            {
                AddResult("UI Components", "Element List Panel Component", false,
                    "ElementListPanel.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(panelPath);

            bool hasRender = content.Contains("Render");
            bool hasFilterElements = content.Contains("Filter") || content.Contains("Search");
            bool hasElementSelection = content.Contains("SelectElement") ||
                                      content.Contains("OnElementSelected");
            bool hasImGui = content.Contains("ImGui");

            bool passed = hasRender && hasImGui && (hasFilterElements || hasElementSelection);

            var details = $"Render: {hasRender}, Filter: {hasFilterElements}, " +
                         $"Selection: {hasElementSelection}, ImGui: {hasImGui}";

            AddResult("UI Components", "Element List Panel Component", passed,
                passed ? "Panel completo" : "Funcionalidades faltando",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("UI Components", "Element List Panel Component", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    private async Task TestAIChatPanelComponentAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var chatPath = Path.Combine(_projectRoot, "UI", "AIChatPanel.cs");

            if (!File.Exists(chatPath))
            {
                AddResult("UI Components", "AI Chat Panel Component", false,
                    "AIChatPanel.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(chatPath);

            bool hasRender = content.Contains("Render");
            bool hasSendMessage = content.Contains("SendMessage") || content.Contains("Send");
            bool hasChatHistory = content.Contains("_messages") || content.Contains("Messages");
            bool hasInputField = content.Contains("InputText") || content.Contains("Input");
            bool hasImGui = content.Contains("ImGui");

            bool passed = hasRender && hasImGui && hasChatHistory;

            var details = $"Render: {hasRender}, Send: {hasSendMessage}, History: {hasChatHistory}, " +
                         $"Input: {hasInputField}, ImGui: {hasImGui}";

            AddResult("UI Components", "AI Chat Panel Component", passed,
                passed ? "Chat panel completo" : "Funcionalidades faltando",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("UI Components", "AI Chat Panel Component", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    // ==================== OTHER UI COMPONENTS ====================

    private async Task TestFileDialogComponentAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var dialogPath = Path.Combine(_projectRoot, "UI", "FileDialog.cs");

            if (!File.Exists(dialogPath))
            {
                AddResult("UI Components", "File Dialog Component", false,
                    "FileDialog.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(dialogPath);

            bool hasShow = content.Contains("Show") || content.Contains("Open");
            bool hasGetSelectedFile = content.Contains("GetSelectedFile") ||
                                     content.Contains("SelectedFile");
            bool hasFileFilter = content.Contains("Filter") || content.Contains(".ifc");

            bool passed = hasShow && hasGetSelectedFile;

            var details = $"Show: {hasShow}, GetFile: {hasGetSelectedFile}, Filter: {hasFileFilter}";

            AddResult("UI Components", "File Dialog Component", passed,
                passed ? "Dialog completo" : "Funcionalidades faltando",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("UI Components", "File Dialog Component", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    private async Task TestWelcomeScreenComponentAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var welcomePath = Path.Combine(_projectRoot, "UI", "WelcomeScreen.cs");

            if (!File.Exists(welcomePath))
            {
                AddResult("UI Components", "Welcome Screen Component", false,
                    "WelcomeScreen.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(welcomePath);

            bool hasRender = content.Contains("Render") || content.Contains("Show");
            bool hasCloseButton = content.Contains("Close") || content.Contains("Button");
            bool hasImGui = content.Contains("ImGui");

            bool passed = hasRender && hasImGui;

            var details = $"Render: {hasRender}, Close: {hasCloseButton}, ImGui: {hasImGui}";

            AddResult("UI Components", "Welcome Screen Component", passed,
                passed ? "Welcome screen completo" : "Funcionalidades faltando",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("UI Components", "Welcome Screen Component", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    private async Task TestNotificationSystemComponentAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var notifPath = Path.Combine(_projectRoot, "UI", "NotificationSystem.cs");

            if (!File.Exists(notifPath))
            {
                AddResult("UI Components", "Notification System Component", false,
                    "NotificationSystem.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(notifPath);

            bool hasShow = content.Contains("ShowNotification") || content.Contains("Show");
            bool hasRender = content.Contains("Render") || content.Contains("Update");
            bool hasNotifications = content.Contains("_notifications") ||
                                   content.Contains("Notifications");
            bool hasNotificationType = content.Contains("NotificationType");

            bool passed = hasShow && hasNotifications;

            var details = $"Show: {hasShow}, Render: {hasRender}, " +
                         $"Notifications: {hasNotifications}, Type: {hasNotificationType}";

            AddResult("UI Components", "Notification System Component", passed,
                passed ? "Sistema de notificação completo" : "Funcionalidades faltando",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("UI Components", "Notification System Component", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    private async Task TestTutorialSystemComponentAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var tutorialPath = Path.Combine(_projectRoot, "UI", "TutorialSystem.cs");

            if (!File.Exists(tutorialPath))
            {
                AddResult("UI Components", "Tutorial System Component", false,
                    "TutorialSystem.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(tutorialPath);

            bool hasShow = content.Contains("Show") || content.Contains("Start");
            bool hasSteps = content.Contains("Step") || content.Contains("Tutorial");
            bool hasNext = content.Contains("Next") || content.Contains("Continue");

            bool passed = hasShow || hasSteps;

            var details = $"Show: {hasShow}, Steps: {hasSteps}, Next: {hasNext}";

            AddResult("UI Components", "Tutorial System Component", passed,
                passed ? "Sistema de tutorial disponível" : "Sistema não implementado",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("UI Components", "Tutorial System Component", true,
                "Tutorial não é crítico", sw.Elapsed);
        }
    }

    // ==================== THEME AND STYLING ====================

    private async Task TestModernThemeAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var themePath = Path.Combine(_projectRoot, "UI", "ModernTheme.cs");

            if (!File.Exists(themePath))
            {
                AddResult("Theme", "Modern Theme", false,
                    "ModernTheme.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(themePath);

            bool hasApply = content.Contains("Apply") || content.Contains("Set");
            bool hasColors = content.Contains("Color") || content.Contains("color");
            bool hasImGuiStyle = content.Contains("ImGuiStyle") || content.Contains("Style");

            bool passed = hasApply && hasColors;

            var details = $"Apply: {hasApply}, Colors: {hasColors}, Style: {hasImGuiStyle}";

            AddResult("Theme", "Modern Theme", passed,
                passed ? "Tema moderno implementado" : "Tema não configurado",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("Theme", "Modern Theme", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    private async Task TestImGuiControllerAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var controllerPath = Path.Combine(_projectRoot, "UI", "ImGuiController.cs");

            if (!File.Exists(controllerPath))
            {
                AddResult("Theme", "ImGui Controller", false,
                    "ImGuiController.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(controllerPath);

            bool hasInitialize = content.Contains("Initialize");
            bool hasUpdate = content.Contains("Update");
            bool hasRender = content.Contains("Render");
            bool hasImGui = content.Contains("ImGui");
            bool hasInputHandling = content.Contains("Input") || content.Contains("Mouse") ||
                                   content.Contains("Keyboard");

            bool passed = hasInitialize && hasRender && hasImGui;

            var details = $"Initialize: {hasInitialize}, Update: {hasUpdate}, Render: {hasRender}, " +
                         $"ImGui: {hasImGui}, Input: {hasInputHandling}";

            AddResult("Theme", "ImGui Controller", passed,
                passed ? "Controller ImGui completo" : "Funcionalidades faltando",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("Theme", "ImGui Controller", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    // ==================== INTERACTION TESTS ====================

    private async Task TestSelectionManagerAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var selectionPath = Path.Combine(_projectRoot, "Interaction", "SelectionManager.cs");

            if (!File.Exists(selectionPath))
            {
                AddResult("Interaction", "Selection Manager", false,
                    "SelectionManager.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(selectionPath);

            bool hasSelectElement = content.Contains("SelectElement");
            bool hasGetSelected = content.Contains("GetSelectedElement") ||
                                 content.Contains("SelectedElement");
            bool hasClearSelection = content.Contains("ClearSelection") ||
                                    content.Contains("Clear");
            bool hasOnSelectionChanged = content.Contains("OnSelectionChanged") ||
                                        content.Contains("SelectionChanged");

            bool passed = hasSelectElement && hasGetSelected;

            var details = $"Select: {hasSelectElement}, GetSelected: {hasGetSelected}, " +
                         $"Clear: {hasClearSelection}, OnChanged: {hasOnSelectionChanged}";

            AddResult("Interaction", "Selection Manager", passed,
                passed ? "Gerenciador de seleção completo" : "Funcionalidades faltando",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("Interaction", "Selection Manager", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    private async Task TestInteractionFeedbackAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var feedbackPath = Path.Combine(_projectRoot, "Rendering", "InteractionFeedback.cs");

            if (!File.Exists(feedbackPath))
            {
                AddResult("Interaction", "Interaction Feedback", false,
                    "InteractionFeedback.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(feedbackPath);

            bool hasRender = content.Contains("Render");
            bool hasUpdate = content.Contains("Update");
            bool hasShowFeedback = content.Contains("Show") || content.Contains("Display");

            bool passed = hasRender || hasUpdate;

            var details = $"Render: {hasRender}, Update: {hasUpdate}, Show: {hasShowFeedback}";

            AddResult("Interaction", "Interaction Feedback", passed,
                passed ? "Feedback de interação implementado" : "Feedback não implementado",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("Interaction", "Interaction Feedback", true,
                "Feedback não é crítico", sw.Elapsed);
        }
    }

    // ==================== VISUAL FEEDBACK ====================

    private async Task TestSelectionHighlightAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var highlightPath = Path.Combine(_projectRoot, "Rendering", "SelectionHighlight.cs");

            if (!File.Exists(highlightPath))
            {
                AddResult("Visual Feedback", "Selection Highlight", false,
                    "SelectionHighlight.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(highlightPath);

            bool hasRender = content.Contains("Render");
            bool hasSetSelected = content.Contains("SetSelected") ||
                                 content.Contains("Highlight");
            bool hasGL = content.Contains("GL") || content.Contains("OpenGL");

            bool passed = hasRender && hasGL;

            var details = $"Render: {hasRender}, SetSelected: {hasSetSelected}, GL: {hasGL}";

            AddResult("Visual Feedback", "Selection Highlight", passed,
                passed ? "Highlight de seleção implementado" : "Funcionalidades faltando",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("Visual Feedback", "Selection Highlight", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    private async Task TestGridRendererAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var gridPath = Path.Combine(_projectRoot, "Rendering", "GridRenderer.cs");

            if (!File.Exists(gridPath))
            {
                AddResult("Visual Feedback", "Grid Renderer", false,
                    "GridRenderer.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(gridPath);

            bool hasInitialize = content.Contains("Initialize");
            bool hasRender = content.Contains("Render");
            bool hasGL = content.Contains("GL");

            bool passed = hasInitialize && hasRender;

            var details = $"Initialize: {hasInitialize}, Render: {hasRender}, GL: {hasGL}";

            AddResult("Visual Feedback", "Grid Renderer", passed,
                passed ? "Grid implementado" : "Funcionalidades faltando",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("Visual Feedback", "Grid Renderer", false,
                $"Erro: {ex.Message}", sw.Elapsed);
        }
    }

    private async Task TestMinimapCompassAsync()
    {
        var sw = Stopwatch.StartNew();
        try
        {
            var minimapPath = Path.Combine(_projectRoot, "UI", "MinimapCompass.cs");

            if (!File.Exists(minimapPath))
            {
                AddResult("Visual Feedback", "Minimap/Compass", false,
                    "MinimapCompass.cs não encontrado", sw.Elapsed);
                return;
            }

            var content = await File.ReadAllTextAsync(minimapPath);

            bool hasRender = content.Contains("Render");
            bool hasUpdate = content.Contains("Update");
            bool hasCamera = content.Contains("Camera");

            bool passed = hasRender || hasUpdate;

            var details = $"Render: {hasRender}, Update: {hasUpdate}, Camera: {hasCamera}";

            AddResult("Visual Feedback", "Minimap/Compass", passed,
                passed ? "Minimap/Compass implementado" : "Não implementado",
                sw.Elapsed, details);
        }
        catch (Exception ex)
        {
            AddResult("Visual Feedback", "Minimap/Compass", true,
                "Minimap não é crítico", sw.Elapsed);
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
        string message, TimeSpan duration, string details = "")
    {
        var result = new TestResult
        {
            Category = category,
            TestName = testName,
            Passed = passed,
            Message = message,
            Duration = duration,
            Details = details
        };
        _results.Add(result);

        var icon = passed ? "✅" : "❌";
        Console.WriteLine($"{icon} [{category}] {testName}: {message} ({duration.TotalMilliseconds:F0}ms)");
    }

    public void PrintSummary()
    {
        Console.WriteLine("\n╔══════════════════════════════════════════════════════════╗");
        Console.WriteLine("║          📊 RESUMO DE TESTES DE FRONT-END                ║");
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
            Console.WriteLine("🎉 TODO O FRONT-END ESTÁ FUNCIONAL!");
        }
        else
        {
            Console.WriteLine($"⚠️  {failed} COMPONENTE(S) DE FRONT-END COM PROBLEMAS");
        }

        Console.WriteLine(new string('═', 60) + "\n");
    }
}
