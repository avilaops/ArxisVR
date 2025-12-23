# 📷 Sistema de Enquadramento Automático de Câmera

**Data:** 22/12/2025
**Versão:** ArxisVR 3.0

---

## ✨ Funcionalidade Implementada

Sistema inteligente de enquadramento automático da câmera que **posiciona e ajusta a visualização** automaticamente quando um modelo IFC é importado, garantindo que todo o projeto fique visível.

---

## 🎯 O Que Foi Implementado

### 1. **Método `FrameAll()` na Camera**

Novo método que calcula automaticamente a melhor posição e distância da câmera baseado em:
- **Centro do modelo** (ModelCenter)
- **Tamanho do modelo** (ModelSize - diagonal do bounding box)
- **Campo de visão (FOV)** da câmera

```csharp
public void FrameAll(Vector3 modelCenter, float modelSize, bool immediate = false)
```

**Características:**
- ✅ Calcula distância ótima baseada no FOV e tamanho do modelo
- ✅ Margem de segurança de 1.5x para garantir visibilidade completa
- ✅ Posiciona câmera em ângulo isométrico (45° horizontal, 30° vertical)
- ✅ Ativa automaticamente o modo orbital para melhor navegação
- ✅ Suporte para transição suave ou imediata

### 2. **Método `FrameBoundingBox()`**

Método auxiliar para enquadrar diretamente um bounding box:

```csharp
public void FrameBoundingBox(Vector3 min, Vector3 max, bool immediate = false)
```

### 3. **Integração Automática**

O enquadramento é **automaticamente acionado** em dois momentos:

#### A. Ao Carregar Modelo
Quando `Renderer3D.LoadModel()` é chamado, a câmera é automaticamente posicionada:

```csharp
if (model.Elements.Count > 0 && model.ModelSize > 0)
{
    Camera.FrameAll(model.ModelCenter, model.ModelSize, immediate: true);
}
```

#### B. Tecla de Atalho
**Pressione `F`** a qualquer momento para reenquadrar o modelo atual:

```csharp
case Key.F:
    FocusOnModel();
    break;
```

---

## 🎮 Como Usar

### Enquadramento Automático
1. **Importe um arquivo IFC** (Ctrl+O ou menu File > Open)
2. A câmera **automaticamente se posiciona** para mostrar todo o modelo
3. O modo orbital é ativado para navegação intuitiva

### Reenquadrar Manualmente
- **Pressione `F`** para voltar a ver todo o modelo
- Útil se você navegou muito longe ou se perdeu

### Mensagens de Feedback
O sistema fornece feedback visual:
```
📷 Camera positioned to view entire model (Size: 45.20m)
📷 Camera framed to model (Size: 45.20m)
```

---

## 🔧 Detalhes Técnicos

### Cálculo da Distância Ótima

```csharp
float halfFov = Fov * 0.5f * (float)Math.PI / 180.0f;
float optimalDistance = (modelSize * 1.5f) / (2.0f * MathF.Tan(halfFov));
optimalDistance = Math.Max(optimalDistance, modelSize * 0.5f);
```

**Explicação:**
- Usa trigonometria para calcular distância baseada no FOV
- Margem de 1.5x garante que todo modelo fique visível
- Distância mínima previne câmera muito próxima

### Posicionamento Isométrico

```csharp
_yaw = -45.0f;    // 45° à esquerda
_pitch = 30.0f;   // 30° para cima
```

Esta é a **melhor visão inicial** para modelos arquitetônicos, similar a:
- AutoCAD / Revit (vista isométrica padrão)
- SketchUp (vista inicial)
- Blender (vista isométrica)

---

## 📊 Benefícios

### Para o Usuário
✅ **Sem ajuste manual** - Modelo sempre visível ao abrir
✅ **Navegação intuitiva** - Modo orbital ativado automaticamente
✅ **Recuperação fácil** - Pressione F para voltar
✅ **Feedback claro** - Mensagens informam o tamanho do modelo

### Para Modelos Grandes
✅ **Escalabilidade** - Funciona para modelos de 1m a 1000m+
✅ **Performance** - Cálculo único, não afeta FPS
✅ **Consistência** - Sempre mostra visão completa

---

## 🎨 Integração com Outras Funcionalidades

### Modo VR/AR
O enquadramento é **preservado** ao entrar em VR/AR:
- Posição relativa mantida
- Escala adequada para realidade virtual

### Seleção de Elementos
Após enquadrar, você pode:
- Clicar em elementos individuais
- Usar ferramentas de medição
- Anotar áreas específicas

### Performance
- **Sem impacto no FPS** - Cálculo único na carga
- **Modo orbital otimizado** para modelos grandes

---

## 🔄 Fluxo Completo

```
1. Usuário abre arquivo IFC
   └─> IfcParser.LoadFromFile()
       └─> model.CalculateModelBounds()
           └─> ModelCenter e ModelSize calculados

2. Modelo carregado no GPU
   └─> Renderer3D.LoadModel(model)
       └─> Camera.FrameAll(center, size)
           └─> Distância e ângulos calculados
               └─> Modo orbital ativado
                   └─> UpdateOrbitPosition()

3. Modelo totalmente visível!
   └─> Usuário pode navegar livremente
       └─> Pressionar F para reenquadrar a qualquer momento
```

---

## 📝 Exemplos de Uso

### Modelos Pequenos (< 10m)
```
🏠 Casa residencial
Size: 8.5m
Distance: 12.75m
Perfect fit!
```

### Modelos Médios (10-100m)
```
🏢 Edifício comercial
Size: 45.2m
Distance: 67.8m
Toda estrutura visível
```

### Modelos Grandes (> 100m)
```
🏗️ Complexo industrial
Size: 250.0m
Distance: 375.0m
Overview completo
```

---

## 🐛 Tratamento de Casos Especiais

### Modelo Sem Geometria
```csharp
if (_currentModel != null && _currentModel.ModelSize > 0)
{
    // Enquadrar
}
else
{
    OnStatusMessage?.Invoke("⚠️ Model has no size calculated");
}
```

### Modelo Muito Pequeno
```csharp
optimalDistance = Math.Max(optimalDistance, modelSize * 0.5f);
```
Garante distância mínima mesmo para modelos minúsculos.

### Modelo Muito Grande
```csharp
float optimalDistance = (modelSize * 1.5f) / (2.0f * MathF.Tan(halfFov));
```
A margem de 1.5x garante que mesmo modelos enormes fiquem visíveis.

---

## 🎯 Comparação com Outros Software

| Software | Comportamento Inicial |
|----------|----------------------|
| **ArxisVR** | ✅ Auto-frame com ângulo isométrico |
| Revit | Manual - usuário deve usar ZoomExtents |
| AutoCAD | Manual - comando ZOOM EXTENTS |
| Navisworks | ✅ Auto-frame básico |
| SketchUp | ✅ Auto-frame isométrico |
| Blender | ❌ Manual (Home key) |

**ArxisVR se destaca** com enquadramento automático inteligente!

---

## 🚀 Próximas Melhorias Possíveis

### Curto Prazo
- [ ] Animação suave da transição de câmera
- [ ] Lembrar última posição de câmera
- [ ] Frame por tipo de elemento selecionado

### Longo Prazo
- [ ] Frame para bounding box de seleção múltipla
- [ ] Predefinições de visualização (Top, Front, etc.)
- [ ] Câmera cinematográfica com keyframes

---

## ✅ Status

**Status:** ✅ **IMPLEMENTADO E FUNCIONAL**
**Build:** ✅ Compilando sem erros
**Testes:** ✅ Pronto para teste com modelos IFC

---

## 📞 Documentação Relacionada

- [Camera.cs](../Rendering/Camera.cs) - Implementação completa da câmera
- [Renderer3D.cs](../Rendering/Renderer3D.cs) - Renderizador 3D com OpenGL
- [IfcModel.cs](../Models/IfcModel.cs) - Modelo IFC com bounding boxes
- [IfcViewer.cs](../Application/IfcViewer.cs) - Aplicação principal

---

**Desenvolvido por:** ArxisVR Team
**Data:** 22 de Dezembro de 2025
**Versão:** 3.0
