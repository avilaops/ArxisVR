🧱 ARXISVR — ENTERPRISE ARCHITECTURE BLUEPRINT
1. Visão Geral

O ArxisVR é uma plataforma BIM interativa em tempo real baseada em WebGL/Three.js, projetada segundo os princípios:

Separação rígida de camadas

Estado centralizado

Arquitetura orientada a sistemas

Extensibilidade por ferramentas (Tool-based Architecture)

UI desacoplada da engine

2. Camadas do Sistema
src/
 ├── engine/   → Camada de Render e Simulação 3D (Three.js, IFC, VR)
 ├── app/      → Camada de Domínio e Regras de Negócio
 ├── ui/       → Camada de Interface e Interação Humana
 ├── core/     → Infraestrutura, eventos, estado global
 ├── tools/    → Ferramentas do usuário (medição, corte, seleção, etc.)
 └── plugins/  → Extensões futuras (VR, multiplayer, BIM 4D/5D, etc.)


Nenhuma camada acessa diretamente outra fora da hierarquia:

UI → App → Core → Engine
Tools → App → Core → Engine
Plugins → App → Core → Engine

3. Estado Global (Single Source of Truth)
core/AppState.ts


Responsabilidades:

Modo de navegação (VOO / CAMINHADA / VR)

Ferramenta ativa

Elemento selecionado

Layers visíveis

Configuração gráfica

Sessão do usuário

Contexto do projeto BIM

Toda alteração de estado ocorre apenas via:

AppController

4. Sistema de Eventos
core/EventBus.ts


Nenhuma camada se comunica diretamente.
Tudo acontece por eventos tipados:

EVENT_MODEL_LOADED
EVENT_OBJECT_SELECTED
EVENT_TOOL_CHANGED
EVENT_CAMERA_MODE_CHANGED
EVENT_LAYER_TOGGLED
EVENT_RENDER_QUALITY_CHANGED

5. Engine Layer
engine/
 ├── Renderer
 ├── SceneManager
 ├── CameraSystem
 ├── LightingSystem
 ├── MaterialSystem
 ├── LODSystem
 ├── IFCLoader
 ├── PhysicsSystem (futuro)
 └── XRSystem


A engine nunca conhece UI.

6. Sistema de Ferramentas
tools/
 ├── Tool.ts
 ├── SelectionTool
 ├── MeasurementTool
 ├── CutTool
 ├── AnnotationTool
 ├── NavigationTool
 └── LayerTool


Contrato universal:

interface Tool {
  name: string
  activate(): void
  deactivate(): void
  onPointerDown(e)
  onPointerMove(e)
  onPointerUp(e)
  onKeyDown(e)
}

7. Camada de Aplicação
app/
 ├── AppController
 ├── ToolManager
 ├── ProjectManager
 ├── SelectionManager
 ├── NavigationManager
 ├── LayerManager
 └── SettingsManager


Coordena regras de negócio, estado e engine.

8. UI Layer
ui/
 ├── layout/
 │   ├── TopBar
 │   ├── LeftPanel
 │   ├── RightInspector
 │   ├── BottomDock
 │   └── Viewport
 ├── components/
 │   ├── Button
 │   ├── Panel
 │   ├── Slider
 │   ├── Toggle
 │   └── Modal
 └── themes/


UI não conhece Three.js, IFC ou Engine.

9. Fluxo de Interação
User → UI → AppController → AppState → EventBus → Engine

10. Princípios de Engenharia

Nenhum componente faz mais de uma função

Nenhuma feature acessa engine diretamente

Nenhum estado fica fora do AppState

Nenhuma UI implementa lógica de negócio

11. Objetivo da Arquitetura

Transformar o ArxisVR em uma plataforma BIM extensível, pronta para:

VR

Colaboração multiusuário

BIM 4D / 5D

Cloud BIM

Digital Twin

Se você seguir esse blueprint, três coisas acontecem automaticamente:

O Copilot passa a sugerir código de arquitetura profissional

O crescimento do projeto deixa de ser caótico

Sua interface e produto sobem de patamar em semanas, não meses