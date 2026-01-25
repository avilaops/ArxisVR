# ArxisVR Architecture

> **High-performance BIM/IFC Viewer with WebXR support**

## 🎯 Vision

ArxisVR is a next-generation BIM visualization platform built from the ground up for:
- **Performance**: 60+ FPS even in complex models (10M+ polygons)
- **Accuracy**: 1:1 scale precision for immersive VR walkthrough
- **Extensibility**: Modular architecture supporting BIM 3D/4D/5D/6D
- **Standards**: Full OpenBIM compliance (IFC 2x3, IFC4, IFC4.3, ISO 19650)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   UI     │  │  Menus   │  │ Panels   │  │Inspector │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Managers  │  │Commands  │  │  Tools   │  │ Project  │   │
│  │(App Ctrl)│  │ Pattern  │  │          │  │Serialize │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                      DOMAIN LAYER (BIM)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Inspector │  │  BIM 4D  │  │  BIM 5D  │  │  BIM 6D  │   │
│  │   IFC    │  │ Temporal │  │  Costs   │  │Facilities│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                      ENGINE LAYER (3D)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Core   │  │   ECS    │  │ Systems  │  │  Runtime │   │
│  │  Loop    │  │Entities  │  │LOD/Cull  │  │Streaming │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                   INFRASTRUCTURE LAYER                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Three.js │  │ Web IFC  │  │  WebXR   │  │AVX Render│   │
│  │  Render  │  │  Loader  │  │   VR     │  │   WASM   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Module Structure

### **1. Core Layer** (`src/core/`)
**Responsibility**: Foundation utilities, event system, types

- `EventBus.ts` - Pub/sub event system
- `AppState.ts` - Centralized state management
- `types.ts` - Global TypeScript types
- `utils.ts` - Utility functions
- `theme/` - Theme system (UI customization)
- `hotreload/` - Development hot-reload

**Design Pattern**: Singleton (EventBus, AppState)

---

### **2. Engine Layer** (`src/engine/`)
**Responsibility**: 3D rendering, physics, performance

#### **2.1 Core** (`engine/core/`)
- `EngineLoop.ts` - Main game loop (60 FPS target)
- `Engine.ts` - Engine lifecycle
- `Time.ts` - Delta time, FPS tracking

#### **2.2 ECS** (`engine/ecs/`)
Entity-Component-System architecture:
- `Entity.ts` - Game objects
- `Component.ts` - Data containers (Transform, Mesh, LOD)
- `System.ts` - Logic processors
- `EntityManager.ts` - Entity lifecycle

#### **2.3 Systems** (`engine/systems/`)
Specialized systems:
- `RenderSystem.ts` - AVX WASM rendering
- `LODSystem.ts` - Level of detail
- `CullingSystem.ts` - Frustum culling
- `InstancingSystem.ts` - GPU instancing

#### **2.4 Runtime** (`engine/runtime/`)
Frame-by-frame systems:
- `ToolSystem.ts` - Tools update
- `VRSystem.ts` - WebXR
- `MultiplayerSystem.ts` - Networking
- `AISystem.ts` - Pathfinding, NPCs

#### **2.5 Optimization** (`engine/optimization/`)
Performance critical:
- `FrustumCuller.ts` - View frustum culling
- `BatchingSystem.ts` - Draw call reduction
- `GPUInstancingSystem.ts` - GPU instancing
- `RenderOptimizer.ts` - Automatic optimization

**Design Pattern**: ECS, Strategy, Observer

---

### **3. BIM Layer** (`src/bim/`)
**Responsibility**: Building Information Modeling features

- `inspector/` - IFC property inspection
- `4d/` - Temporal planning (schedules)
- `5d/` - Cost management (budget)
- `6d/` - Facilities management (O&M)

**Standards**: IFC 2x3, IFC4, IFC4.3, ISO 19650

**Design Pattern**: Strategy, Repository

---

### **4. Application Layer** (`src/app/`)
**Responsibility**: Business logic, state management

- `AppController.ts` - Main application controller
- `ProjectManager.ts` - Project lifecycle
- `SelectionManager.ts` - Object selection
- `LayerManager.ts` - Layer visibility
- `NavigationManager.ts` - Camera navigation
- `ToolManager.ts` - Tool switching
- `ProjectSerializer.ts` - Save/load, versioning

**Design Pattern**: MVC, Command, Facade

---

### **5. UI Layer** (`src/ui/`)
**Responsibility**: User interface components

- `UI.ts` - Main UI orchestrator
- `layout/` - Layout components (TopBar, LeftPanel, etc)
- `NotificationSystem.ts` - Toast notifications

**Design Pattern**: Component, Observer

---

### **6. Tools Layer** (`src/tools/`)
**Responsibility**: User interaction tools

- `SelectionTool.ts` - Object picking
- `NavigationTool.ts` - Camera controls
- `MeasurementTool.ts` - Distance, area, volume
- `LayerTool.ts` - Layer management

**Design Pattern**: Strategy, State

---

### **7. Systems Layer** (`src/systems/`)
**Responsibility**: Cross-cutting concerns

- `LightingSystem.ts` - Scene lighting
- `MaterialSystem.ts` - Material management
- `Avatar.ts` - Player representation

---

### **8. Loaders Layer** (`src/loaders/`)
**Responsibility**: Asset loading

- `IFCLoader.ts` - IFC file parsing
- `IFCStreamingLoader.ts` - Progressive loading

**Design Pattern**: Factory, Strategy

---

### **9. VR Layer** (`src/vr/`)
**Responsibility**: Virtual Reality features

- `input/` - VR controllers, gestures
- `ui/` - 3D UI in VR space
- `editor/` - In-headset editing

**Standards**: WebXR

---

### **10. Network Layer** (`src/network/`)
**Responsibility**: Multiplayer, collaboration

- `MultiplayerSync.ts` - State synchronization
- `VoIPSystem.ts` - Voice chat (WebRTC)

**Protocols**: WebSocket, WebRTC

---

### **11. AI Layer** (`src/ai/`)
**Responsibility**: Artificial intelligence

- `AIManager.ts` - AI orchestrator
- `Pathfinding.ts` - A* pathfinding
- `BehaviorTree.ts` - NPC behaviors

---

### **12. Assistant Layer** (`src/assistant/`)
**Responsibility**: AI assistant features

- `AIAssistant.ts` - Chat assistant
- `ChatUI.ts` - Chat interface
- `ViewerActionRouter.ts` - Command routing

---

## 🔄 Data Flow

### **1. User Input**
```
User Action
   ↓
InputSystem (engine)
   ↓
EventBus.emit(INPUT_EVENT)
   ↓
ToolManager.handleInput()
   ↓
Active Tool (Selection, Navigation, etc)
   ↓
AppController.updateState()
```

### **2. Render Loop**
```
EngineLoop.update(deltaTime)
   ↓
Systems update (order matters):
   1. ToolSystem
   2. StreamingSystem
   3. CullingSystem
   4. VRSystem
   5. MultiplayerSystem
   6. LODSystem
   7. ScriptingSystem
   8. AISystem
   9. TransformSystem
   10. InstancingSystem
   11. RenderSystem
   12. DebugSystem
   ↓
AVX Render (WASM)
   ↓
Frame rendered (60 FPS target)
```

### **3. IFC Loading**
```
User selects file
   ↓
IFCLoader.load(file)
   ↓
web-ifc parse
   ↓
Geometry extraction
   ↓
EntityManager.createEntity()
   ↓
Add Components (Transform, Mesh, LOD)
   ↓
InstancingSystem.initialize()
   ↓
Scene ready
```

---

## 🎨 Design Patterns Used

1. **ECS (Entity-Component-System)** - Core architecture
2. **MVC (Model-View-Controller)** - Application layer
3. **Observer/PubSub** - EventBus communication
4. **Command Pattern** - Undo/redo system
5. **Strategy Pattern** - Tool switching, systems
6. **Singleton** - AppController, EventBus
7. **Factory** - Entity creation
8. **Facade** - Complex system simplification
9. **Repository** - BIM data access

---

## 🚀 Performance Optimizations

### **Rendering**
- ✅ Frustum Culling (objects outside view)
- ✅ Occlusion Culling (objects behind others)
- ✅ LOD System (detail by distance)
- ✅ GPU Instancing (identical objects)
- ✅ Batching (draw call reduction)
- ✅ Asset Streaming (progressive loading)

### **Memory**
- ✅ LRU Cache (512MB limit)
- ✅ Object Pooling (entity reuse)
- ✅ Lazy Loading (on-demand)

### **Network**
- ✅ Delta Compression (state sync)
- ✅ Interest Management (only relevant data)

---

## 🧪 Testing Strategy

- **Unit Tests**: Vitest (modules, functions)
- **Integration Tests**: Cross-module interactions
- **E2E Tests**: Playwright (user workflows)
- **Performance Tests**: Lighthouse, Custom benchmarks

**Coverage Target**: 80%+

---

## 📚 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Language** | TypeScript |
| **3D Engine** | Three.js |
| **IFC Parser** | web-ifc, web-ifc-three |
| **VR** | WebXR |
| **Rendering** | AVX Render (Rust WASM) |
| **Build** | Vite |
| **Tests** | Vitest |
| **Linting** | ESLint |

---

## 🔐 Security Considerations

- ✅ **No eval()** - Safe script execution
- ✅ **CSP Headers** - Content Security Policy
- ✅ **Input Validation** - All user inputs sanitized
- ✅ **CORS** - Proper cross-origin handling
- ⚠️ **Auth** - TODO: Add authentication layer

---

## 📈 Scalability

### **Horizontal**
- Multi-user collaboration (WebRTC mesh)
- CDN for static assets
- WebSocket load balancing

### **Vertical**
- Web Workers for heavy computation
- WASM for performance-critical code
- GPU acceleration (WebGPU future)

---

## 🛣️ Roadmap

### **Q1 2026**
- ✅ Core 3D Engine
- ✅ IFC Support
- ✅ VR Mode
- 🚧 Sections & Clipping

### **Q2 2026**
- 🚧 BIM 4D (Temporal)
- 🚧 Advanced Inspector
- 🚧 Multiplayer Beta

### **Q3 2026**
- 📋 BIM 5D (Costs)
- 📋 Cloud Collaboration
- 📋 Mobile App

### **Q4 2026**
- 📋 BIM 6D (Facilities)
- 📋 AI Copilot
- 📋 Marketplace

---

## 📞 Contact

**Author**: Nícolas Ávila  
**Website**: https://avilaops.com  
**GitHub**: https://github.com/avilaops/ArxisVR

---

**Last Updated**: January 2026
