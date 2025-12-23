# 🔧 GUIA DE CORREÇÕES - ARXISVR

**Data:** 22/12/2025
**Status:** Pendente
**Objetivo:** Resolver os 8 problemas identificados nos testes

---

## 🎯 VISÃO GERAL

Este documento fornece um guia passo-a-passo para corrigir cada um dos problemas identificados nos testes, priorizados por criticidade.

**Total de Problemas:** 8
- 🔴 **Críticos:** 1 (Build)
- 🟠 **Altos:** 5 (Tools + File Dialog)
- 🟡 **Médios:** 2 (ImGui Controller + Selection Manager)

---

## 🔴 PRIORIDADE 1 - CRÍTICO

### 1. ❌ Build Command Falhou

**Arquivo:** Projeto principal (ArxisVR.csproj)
**Impacto:** CRÍTICO - Sistema não compila
**Tempo Estimado:** 1-2 horas

#### **Problema**
```
Build falhou: [erro desconhecido]
```

#### **Diagnóstico**
1. Execute o build manualmente para ver o erro completo:
```bash
dotnet build ArxisVR.csproj --verbosity detailed
```

2. Possíveis causas:
   - Namespace inconsistente (Vizzio vs ArxisVR)
   - Dependências quebradas
   - Arquivos faltando

#### **Solução Passo-a-Passo**

**Passo 1:** Verificar namespaces
```bash
# Procurar namespaces inconsistentes
grep -r "namespace Vizzio" .
grep -r "using Vizzio" .
```

**Passo 2:** Atualizar todos os namespaces
- Renomear `namespace Vizzio` para `namespace ArxisVR`
- Renomear `using Vizzio` para `using ArxisVR`

**Passo 3:** Limpar e reconstruir
```bash
dotnet clean
dotnet restore
dotnet build
```

**Passo 4:** Validar
```bash
# Se build funcionar, execute o teste novamente
cd Tests
dotnet run --project CompleteTests.csproj
```

#### **Código de Exemplo**

Antes:
```csharp
namespace Vizzio.Application
{
    public class IfcViewer
    {
        // ...
    }
}
```

Depois:
```csharp
namespace ArxisVR.Application
{
    public class IfcViewer
    {
        // ...
    }
}
```

---

## 🟠 PRIORIDADE 2 - ALTO

### 2. ❌ Measurement Tool - Funcionalidades Faltando

**Arquivo:** [Tools/MeasurementTool.cs](../Tools/MeasurementTool.cs)
**Impacto:** Alto - Funcionalidade essencial
**Tempo Estimado:** 2-3 horas

#### **Problema**
Métodos de medição ausentes ou incompletos.

#### **Funcionalidades Necessárias**
- `StartMeasurement()` - Iniciar medição
- `EndMeasurement()` - Finalizar medição
- `GetDistance()` - Obter distância medida
- `GetArea()` - Obter área medida
- `GetVolume()` - Obter volume medido
- `ClearMeasurement()` - Limpar medição

#### **Solução**

Adicionar ao [MeasurementTool.cs](../Tools/MeasurementTool.cs):

```csharp
namespace ArxisVR.Tools
{
    public class MeasurementTool
    {
        private Vector3 _startPoint;
        private Vector3 _endPoint;
        private bool _isActive;
        private List<Vector3> _points = new();

        public void StartMeasurement(Vector3 point)
        {
            _startPoint = point;
            _points.Clear();
            _points.Add(point);
            _isActive = true;
        }

        public void AddPoint(Vector3 point)
        {
            if (_isActive)
            {
                _points.Add(point);
            }
        }

        public void EndMeasurement(Vector3 point)
        {
            _endPoint = point;
            _points.Add(point);
            _isActive = false;
        }

        public float GetDistance()
        {
            if (_points.Count < 2) return 0f;

            float totalDistance = 0f;
            for (int i = 0; i < _points.Count - 1; i++)
            {
                totalDistance += Vector3.Distance(_points[i], _points[i + 1]);
            }
            return totalDistance;
        }

        public float GetArea()
        {
            // Implementar cálculo de área para polígono
            if (_points.Count < 3) return 0f;

            // Algoritmo de Shoelace para área de polígono
            float area = 0f;
            for (int i = 0; i < _points.Count - 1; i++)
            {
                area += _points[i].X * _points[i + 1].Y;
                area -= _points[i + 1].X * _points[i].Y;
            }
            return Math.Abs(area / 2f);
        }

        public float GetVolume()
        {
            // Implementar cálculo de volume para mesh
            // Por enquanto, retornar volume de bounding box
            if (_points.Count == 0) return 0f;

            var min = _points[0];
            var max = _points[0];

            foreach (var point in _points)
            {
                min = Vector3.Min(min, point);
                max = Vector3.Max(max, point);
            }

            var dimensions = max - min;
            return dimensions.X * dimensions.Y * dimensions.Z;
        }

        public void ClearMeasurement()
        {
            _points.Clear();
            _isActive = false;
        }

        public List<Vector3> GetPoints() => _points;
        public bool IsActive => _isActive;
    }
}
```

---

### 3. ❌ Annotation System - Funcionalidades Faltando

**Arquivo:** [Tools/AnnotationSystem.cs](../Tools/AnnotationSystem.cs)
**Impacto:** Alto
**Tempo Estimado:** 2-3 horas

#### **Funcionalidades Necessárias**
- `CreateAnnotation()` - Criar anotação
- `UpdateAnnotation()` - Atualizar anotação
- `DeleteAnnotation()` - Deletar anotação
- `GetAnnotations()` - Obter todas as anotações
- `SaveAnnotations()` - Salvar anotações
- `LoadAnnotations()` - Carregar anotações

#### **Solução**

Adicionar ao [AnnotationSystem.cs](../Tools/AnnotationSystem.cs):

```csharp
namespace ArxisVR.Tools
{
    public class Annotation
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Text { get; set; } = "";
        public Vector3 Position { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string Author { get; set; } = "";
    }

    public class AnnotationSystem
    {
        private readonly List<Annotation> _annotations = new();
        private readonly string _savePath;

        public AnnotationSystem(string savePath = "annotations.json")
        {
            _savePath = savePath;
        }

        public Annotation CreateAnnotation(string text, Vector3 position, string author = "User")
        {
            var annotation = new Annotation
            {
                Text = text,
                Position = position,
                Author = author
            };
            _annotations.Add(annotation);
            return annotation;
        }

        public bool UpdateAnnotation(Guid id, string newText)
        {
            var annotation = _annotations.FirstOrDefault(a => a.Id == id);
            if (annotation == null) return false;

            annotation.Text = newText;
            return true;
        }

        public bool DeleteAnnotation(Guid id)
        {
            var annotation = _annotations.FirstOrDefault(a => a.Id == id);
            if (annotation == null) return false;

            return _annotations.Remove(annotation);
        }

        public List<Annotation> GetAnnotations()
        {
            return new List<Annotation>(_annotations);
        }

        public async Task<bool> SaveAnnotationsAsync()
        {
            try
            {
                var json = System.Text.Json.JsonSerializer.Serialize(_annotations, new System.Text.Json.JsonSerializerOptions
                {
                    WriteIndented = true
                });
                await File.WriteAllTextAsync(_savePath, json);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> LoadAnnotationsAsync()
        {
            try
            {
                if (!File.Exists(_savePath)) return false;

                var json = await File.ReadAllTextAsync(_savePath);
                var loaded = System.Text.Json.JsonSerializer.Deserialize<List<Annotation>>(json);

                if (loaded != null)
                {
                    _annotations.Clear();
                    _annotations.AddRange(loaded);
                    return true;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }

        public int Count => _annotations.Count;
    }
}
```

---

### 4. ❌ Layer Manager - Funcionalidades Faltando

**Arquivo:** [Tools/LayerManager.cs](../Tools/LayerManager.cs)
**Impacto:** Alto
**Tempo Estimado:** 1-2 horas

#### **Funcionalidades Necessárias**
- `CreateLayer()` - Criar camada
- `DeleteLayer()` - Deletar camada
- `ShowLayer()` / `HideLayer()` - Mostrar/ocultar
- `GetLayers()` - Obter todas as camadas
- `IsLayerVisible()` - Verificar visibilidade

#### **Solução**

Adicionar ao [LayerManager.cs](../Tools/LayerManager.cs):

```csharp
namespace ArxisVR.Tools
{
    public class Layer
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = "";
        public bool IsVisible { get; set; } = true;
        public List<Guid> ElementIds { get; set; } = new();
    }

    public class LayerManager
    {
        private readonly List<Layer> _layers = new();

        public Layer CreateLayer(string name)
        {
            var layer = new Layer { Name = name };
            _layers.Add(layer);
            return layer;
        }

        public bool DeleteLayer(Guid id)
        {
            var layer = _layers.FirstOrDefault(l => l.Id == id);
            if (layer == null) return false;
            return _layers.Remove(layer);
        }

        public bool ShowLayer(Guid id)
        {
            var layer = _layers.FirstOrDefault(l => l.Id == id);
            if (layer == null) return false;
            layer.IsVisible = true;
            return true;
        }

        public bool HideLayer(Guid id)
        {
            var layer = _layers.FirstOrDefault(l => l.Id == id);
            if (layer == null) return false;
            layer.IsVisible = false;
            return true;
        }

        public bool ToggleLayer(Guid id)
        {
            var layer = _layers.FirstOrDefault(l => l.Id == id);
            if (layer == null) return false;
            layer.IsVisible = !layer.IsVisible;
            return true;
        }

        public List<Layer> GetLayers()
        {
            return new List<Layer>(_layers);
        }

        public bool IsLayerVisible(Guid id)
        {
            var layer = _layers.FirstOrDefault(l => l.Id == id);
            return layer?.IsVisible ?? false;
        }

        public bool AddElementToLayer(Guid layerId, Guid elementId)
        {
            var layer = _layers.FirstOrDefault(l => l.Id == layerId);
            if (layer == null) return false;
            if (!layer.ElementIds.Contains(elementId))
            {
                layer.ElementIds.Add(elementId);
            }
            return true;
        }

        public bool RemoveElementFromLayer(Guid layerId, Guid elementId)
        {
            var layer = _layers.FirstOrDefault(l => l.Id == layerId);
            if (layer == null) return false;
            return layer.ElementIds.Remove(elementId);
        }
    }
}
```

---

### 5. ❌ Undo/Redo Manager - Funcionalidades Faltando

**Arquivo:** [Tools/UndoRedoManager.cs](../Tools/UndoRedoManager.cs)
**Impacto:** Alto
**Tempo Estimado:** 2-3 horas

#### **Funcionalidades Necessárias**
- `ExecuteCommand()` - Executar comando
- `Undo()` - Desfazer
- `Redo()` - Refazer
- `CanUndo()` / `CanRedo()` - Verificar possibilidade
- `Clear()` - Limpar histórico

#### **Solução**

Adicionar ao [UndoRedoManager.cs](../Tools/UndoRedoManager.cs):

```csharp
namespace ArxisVR.Tools
{
    public interface ICommand
    {
        void Execute();
        void Undo();
        string Description { get; }
    }

    public class UndoRedoManager
    {
        private readonly Stack<ICommand> _undoStack = new();
        private readonly Stack<ICommand> _redoStack = new();
        private const int MaxHistorySize = 50;

        public void ExecuteCommand(ICommand command)
        {
            command.Execute();
            _undoStack.Push(command);
            _redoStack.Clear(); // Clear redo stack when new command is executed

            // Limit history size
            if (_undoStack.Count > MaxHistorySize)
            {
                var temp = _undoStack.ToList();
                temp.RemoveAt(temp.Count - 1);
                _undoStack.Clear();
                foreach (var cmd in temp.AsEnumerable().Reverse())
                {
                    _undoStack.Push(cmd);
                }
            }
        }

        public bool Undo()
        {
            if (!CanUndo()) return false;

            var command = _undoStack.Pop();
            command.Undo();
            _redoStack.Push(command);
            return true;
        }

        public bool Redo()
        {
            if (!CanRedo()) return false;

            var command = _redoStack.Pop();
            command.Execute();
            _undoStack.Push(command);
            return true;
        }

        public bool CanUndo() => _undoStack.Count > 0;
        public bool CanRedo() => _redoStack.Count > 0;

        public void Clear()
        {
            _undoStack.Clear();
            _redoStack.Clear();
        }

        public int UndoCount => _undoStack.Count;
        public int RedoCount => _redoStack.Count;

        public string? GetNextUndoDescription()
        {
            return CanUndo() ? _undoStack.Peek().Description : null;
        }

        public string? GetNextRedoDescription()
        {
            return CanRedo() ? _redoStack.Peek().Description : null;
        }
    }

    // Exemplo de comando
    public class MoveElementCommand : ICommand
    {
        private readonly Guid _elementId;
        private readonly Vector3 _oldPosition;
        private readonly Vector3 _newPosition;
        private readonly Action<Guid, Vector3> _moveAction;

        public string Description => $"Move Element";

        public MoveElementCommand(Guid elementId, Vector3 oldPos, Vector3 newPos, Action<Guid, Vector3> moveAction)
        {
            _elementId = elementId;
            _oldPosition = oldPos;
            _newPosition = newPos;
            _moveAction = moveAction;
        }

        public void Execute()
        {
            _moveAction(_elementId, _newPosition);
        }

        public void Undo()
        {
            _moveAction(_elementId, _oldPosition);
        }
    }
}
```

---

### 6. ❌ File Dialog - Funcionalidades Faltando

**Arquivo:** [UI/FileDialog.cs](../UI/FileDialog.cs)
**Impacto:** Alto
**Tempo Estimado:** 1 hora

#### **Funcionalidades Necessárias**
- `GetSelectedFile()` - Obter arquivo selecionado
- Filtros de arquivo adequados (`.ifc`)

#### **Solução**

Adicionar ao [FileDialog.cs](../UI/FileDialog.cs):

```csharp
namespace ArxisVR.UI
{
    public class FileDialog
    {
        private string? _selectedFile;
        private readonly string[] _filters;

        public FileDialog(string[]? filters = null)
        {
            _filters = filters ?? new[] { ".ifc", ".ifcxml", ".ifczip" };
        }

        public bool Show(string title = "Open File")
        {
            // Implementação do diálogo de arquivo
            // Usar biblioteca nativa do Windows ou cross-platform
            try
            {
                using var dialog = new System.Windows.Forms.OpenFileDialog();
                dialog.Title = title;
                dialog.Filter = CreateFilterString();
                dialog.FilterIndex = 1;

                if (dialog.ShowDialog() == System.Windows.Forms.DialogResult.OK)
                {
                    _selectedFile = dialog.FileName;
                    return true;
                }
                return false;
            }
            catch
            {
                // Fallback para console input em caso de erro
                Console.Write("Digite o caminho do arquivo: ");
                _selectedFile = Console.ReadLine();
                return !string.IsNullOrEmpty(_selectedFile);
            }
        }

        public string? GetSelectedFile()
        {
            return _selectedFile;
        }

        public void ClearSelection()
        {
            _selectedFile = null;
        }

        private string CreateFilterString()
        {
            var filters = new List<string>();

            if (_filters.Contains(".ifc"))
                filters.Add("IFC Files (*.ifc)|*.ifc");
            if (_filters.Contains(".ifcxml"))
                filters.Add("IFC XML Files (*.ifcxml)|*.ifcxml");
            if (_filters.Contains(".ifczip"))
                filters.Add("IFC Zip Files (*.ifczip)|*.ifczip");

            filters.Add("All Files (*.*)|*.*");

            return string.Join("|", filters);
        }

        public bool IsFileSelected => !string.IsNullOrEmpty(_selectedFile);
    }
}
```

---

## 🟡 PRIORIDADE 3 - MÉDIO

### 7. ❌ ImGui Controller - Funcionalidades Faltando

**Arquivo:** [UI/ImGuiController.cs](../UI/ImGuiController.cs)
**Impacto:** Médio
**Tempo Estimado:** 1 hora

#### **Adicionar Método Initialize()**

```csharp
public void Initialize(IWindow window, GL gl)
{
    _window = window;
    _gl = gl;

    // Setup ImGui context
    ImGui.CreateContext();
    ImGui.StyleColorsDark();

    // Setup input
    SetupInput();

    // Load fonts
    LoadFonts();
}

private void SetupInput()
{
    // Configure input callbacks
    _window.MouseMove += OnMouseMove;
    _window.MouseDown += OnMouseDown;
    _window.MouseUp += OnMouseUp;
    _window.KeyDown += OnKeyDown;
    _window.KeyUp += OnKeyUp;
}
```

---

### 8. ❌ Selection Manager - Funcionalidades Faltando

**Arquivo:** [Interaction/SelectionManager.cs](../Interaction/SelectionManager.cs)
**Impacto:** Médio
**Tempo Estimado:** 30 minutos

#### **Adicionar Métodos Faltantes**

```csharp
public event EventHandler<IfcElement>? OnSelectionChanged;

public IfcElement? GetSelectedElement()
{
    return _selectedElement;
}

public void ClearSelection()
{
    _selectedElement = null;
    OnSelectionChanged?.Invoke(this, null);
}
```

---

## ✅ VALIDAÇÃO

Após cada correção, execute os testes:

```bash
cd Tests
dotnet run --project CompleteTests.csproj
```

**Meta:** Atingir **95%+ de aprovação** em todos os testes.

---

## 📊 CHECKLIST DE PROGRESSO

- [ ] 🔴 Build Command corrigido
- [ ] 🟠 MeasurementTool completo
- [ ] 🟠 AnnotationSystem completo
- [ ] 🟠 LayerManager completo
- [ ] 🟠 UndoRedoManager completo
- [ ] 🟠 FileDialog completo
- [ ] 🟡 ImGuiController completo
- [ ] 🟡 SelectionManager completo

---

## 🎯 PRÓXIMO PASSO

Depois de concluir todas as correções:

1. Execute os testes completos
2. Verifique taxa de aprovação > 95%
3. Gere certificação final
4. Deploy para produção

---

**Boa sorte com as correções! 🚀**
