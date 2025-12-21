# 🔧 VIZZIO - GUIA DE TROUBLESHOOTING

## ❌ PROBLEMA: Projeto não está rodando

---

## ✅ CHECKLIST DE VERIFICAÇÃO

### 1. **Build Status**
```bash
cd C:\Users\Administrador\source\repos\Vizzio
dotnet build
```

✅ **Resultado Esperado**: Build succeeded

### 2. **Verificar Dependências**
```bash
dotnet restore
```

### 3. **Limpar e Recompilar**
```bash
dotnet clean
dotnet build
```

### 4. **Executar Projeto**
```bash
dotnet run
```

---

## 🐛 ERROS COMUNS E SOLUÇÕES

### Erro 1: "Build FAILED"
**Causa**: Erros de compilação

**Solução**:
1. Verificar erros com `dotnet build`
2. Corrigir erros um por um
3. Verificar usings faltantes

### Erro 2: "Exception at runtime"
**Causa**: Recursos não inicializados

**Checklist**:
- [ ] GL context inicializado?
- [ ] ImGui inicializado?
- [ ] Shaders compilados?
- [ ] Buffers criados?

### Erro 3: "Window não abre"
**Causa**: Silk.NET windowing issue

**Solução**:
```csharp
// Verificar se WindowOptions está correto
var options = WindowOptions.Default;
options.Size = new Vector2D<int>(1920, 1080);
options.Title = "Vizzio";
options.VSync = true;
```

### Erro 4: "ImGui exception"
**Causa**: Contexto não inicializado

**Solução**:
```csharp
// Inicializar APÓS GL context
_gl = _window.CreateOpenGL();
_imguiController = new ImGuiController(_gl, width, height);
```

---

## 🔍 VERIFICAÇÃO PASSO A PASSO

### Passo 1: Verificar Program.cs
```csharp
// Program.cs deve ter:
var viewer = new IfcViewer();
viewer.Run();
```

### Passo 2: Verificar IfcViewer.cs OnLoad
```csharp
private void OnLoad()
{
    // ORDEM CORRETA:
    _gl = _window.CreateOpenGL();           // 1. GL primeiro
    _inputContext = _window.CreateInput();   // 2. Input
    
    _renderer.Initialize(_gl, w, h);         // 3. Renderer
    
    // 4. Ferramentas
    _measurementTool = new MeasurementTool();
    _measurementRenderer = new MeasurementRenderer();
    _measurementRenderer.Initialize(_gl);
    
    // 5. UI por último
    _imguiController = new ImGuiController(_gl, w, h);
    _uiManager = new UIManager();
}
```

### Passo 3: Verificar OnRender
```csharp
private void OnRender(double deltaTime)
{
    _renderer.Render();                      // 1. 3D primeiro
    
    // 2. Overlays
    RenderMeasurements();
    RenderAnnotations();
    RenderHighlights();
    
    // 3. UI por último
    _uiManager.Render(...);
    _imguiController.Render();
}
```

---

## 🎯 INTEGRAÇÃO CORRETA DAS FEATURES

### MeasurementTool Integration
```csharp
// 1. Criar instância
private MeasurementTool? _measurementTool;
private MeasurementRenderer? _measurementRenderer;

// 2. Inicializar em OnLoad
_measurementTool = new MeasurementTool();
_measurementRenderer = new MeasurementRenderer();
_measurementRenderer.Initialize(_gl);

// 3. Subscribe eventos
_measurementTool.OnMeasurementComplete += (result) => {
    _uiManager?.AddMeasurementResult(result);
};

// 4. Conectar com UI
_uiManager.OnMeasurementModeChanged += (mode) => {
    _measurementTool.Mode = mode;
    _measurementTool.IsActive = true;
};

// 5. Handle clicks
if (_measurementTool?.IsActive == true) {
    _measurementTool.AddPoint(clickPosition);
}

// 6. Render
if (_measurementTool?.IsActive == true) {
    _measurementRenderer.Render(...);
}
```

### Screenshot Integration
```csharp
// 1. Criar
private ScreenshotCapture? _screenshotCapture;

// 2. Inicializar
_screenshotCapture = new ScreenshotCapture();
_screenshotCapture.Initialize(_gl);

// 3. Subscribe
_screenshotCapture.OnScreenshotSaved += (path) => {
    _uiManager?.ShowNotification(...);
};

// 4. Capturar (F12)
case Key.F12:
    _screenshotCapture.CaptureScreenshot(w, h);
    break;
```

### Annotations Integration
```csharp
// 1. Renderer
private AnnotationRenderer? _annotationRenderer;

// 2. Inicializar
_annotationRenderer = new AnnotationRenderer();
_annotationRenderer.Initialize(_gl);

// 3. Render
var annotations = _uiManager.AnnotationSystem.Annotations;
_annotationRenderer.RenderAnnotations(annotations, camera);
```

### Selection Highlight
```csharp
// 1. Criar
private SelectionHighlight? _selectionHighlight;

// 2. Inicializar
_selectionHighlight = new SelectionHighlight();
_selectionHighlight.Initialize(_gl);

// 3. Render com stencil
if (_selectionManager?.SelectedElement != null) {
    _selectionHighlight.BeginSelection();
    // Render element
    _selectionHighlight.EndSelection();
}
```

---

## 📋 ORDEM DE INICIALIZAÇÃO

```
1. Window criado
2. GL context criado
3. Input context criado
4. Renderer inicializado
5. Ferramentas criadas:
   - MeasurementTool
   - MeasurementRenderer
   - AnnotationRenderer
   - ScreenshotCapture
   - SelectionHighlight
6. ImGui inicializado
7. UIManager criado
8. Eventos conectados
9. Run loop inicia
```

---

## 🔧 QUICK FIXES

### Fix 1: Recompilar Tudo
```bash
dotnet clean
dotnet restore
dotnet build
dotnet run
```

### Fix 2: Verificar Pacotes
```bash
dotnet list package
```

**Pacotes necessários**:
- Silk.NET.OpenGL
- Silk.NET.Windowing
- Silk.NET.Input
- Silk.NET.OpenXR
- ImGui.NET
- Xbim.Essentials
- Xbim.Geometry.Engine.Interop
- System.Drawing.Common

### Fix 3: Atualizar SDK
```bash
dotnet --version
# Deve ser .NET 10 ou superior
```

---

## 🚨 ERROS ESPECÍFICOS

### "GL context is null"
```csharp
// Verificar ordem:
_gl = _window.CreateOpenGL();  // ANTES de qualquer Initialize
_renderer.Initialize(_gl, w, h);
```

### "ImGui assertion failed"
```csharp
// ImGui APÓS GL context
_gl = _window.CreateOpenGL();
_imguiController = new ImGuiController(_gl, w, h);
```

### "Shader compilation failed"
```csharp
// Verificar versão GLSL
#version 330 core  // OK
#version 400 core  // Pode não funcionar em todos PCs
```

### "Window doesn't open"
```csharp
// Verificar WindowOptions
var options = WindowOptions.Default;
options.API = new GraphicsAPI(
    ContextAPI.OpenGL,
    new APIVersion(3, 3)
);
```

---

## ✅ TESTE RÁPIDO

Criar arquivo `TestWindow.cs`:

```csharp
using Silk.NET.Windowing;
using Silk.NET.OpenGL;

public class TestWindow
{
    public static void Test()
    {
        var options = WindowOptions.Default;
        options.Title = "Test";
        
        var window = Window.Create(options);
        
        window.Load += () => {
            var gl = window.CreateOpenGL();
            Console.WriteLine("GL Version: " + gl.GetStringS(StringName.Version));
            Console.WriteLine("✅ Window OK!");
        };
        
        window.Run();
    }
}

// No Program.cs:
TestWindow.Test();
```

Se isso funcionar, o problema está na integração das features.

---

## 📞 SUPORTE

Se nada funcionar:

1. **Limpar completamente**:
```bash
rd /s /q bin
rd /s /q obj
dotnet clean
dotnet restore
dotnet build
```

2. **Verificar logs**:
```bash
dotnet run --verbosity detailed
```

3. **Testar componentes individualmente**:
- Criar projeto console simples
- Testar Silk.NET primeiro
- Adicionar features uma por uma

4. **Verificar hardware**:
- Drivers de vídeo atualizados?
- OpenGL 3.3+ suportado?

---

## 🎯 RESULTADO ESPERADO

Quando funcionar corretamente:

```
=== VIZZIO - IFC Viewer ===
Initializing application...
Starting viewer window...
[HH:mm:ss] Vizzio IFC Viewer initialized
[HH:mm:ss] Press F1 for help
[HH:mm:ss] Drag and drop an IFC file to load it

[Janela abre com interface gráfica]
- Menu bar visível
- Toolbar lateral visível
- Tela de boas-vindas aparece
- FPS counter funcionando
```

---

**Status**: 🔧 TROUBLESHOOTING GUIDE COMPLETO

**Use este guia para diagnosticar e corrigir problemas!**
