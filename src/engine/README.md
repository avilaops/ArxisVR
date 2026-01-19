# Engine Core - ArxisVR

Sistema de engine modular baseado em Systems Architecture.

## 🚀 Quick Start

```typescript
import { Engine, RenderSystem, AISystem } from './engine';
import { eventBus, appState } from './core';

// Criar context
const ctx = {
  scene,
  camera,
  renderer,
  eventBus,
  appState,
  app: appController
};

// Configurar engine
const engine = new Engine(ctx);
engine
  .addSystem(new RenderSystem())
  .addSystem(new AISystem());

// Iniciar
engine.init();
engine.start();
```

## 📦 Sistemas Disponíveis

- **RenderSystem**: Renderização 3D
- **AISystem**: Gerenciamento de IA
- **InputSystemEngine**: Processamento de input
- **NavigationSystem**: Navegação na cena
- **DebugSystem**: Stats e profiling
- **LegacyUpdateSystem**: Compatibilidade com código antigo

## 🔧 Criar Sistema Customizado

```typescript
import { ISystem, EngineContext } from './engine/types';

class MySystem implements ISystem {
  name = "MySystem";
  enabled = true;

  init(ctx: EngineContext): void {
    // Inicialização única
  }

  update(ctx: EngineContext, dt: number): void {
    // Executado todo frame
  }

  dispose(ctx: EngineContext): void {
    // Limpeza
  }
}
```

## 📚 Documentação Completa

Ver [ENGINE_ARCHITECTURE.md](../docs/ENGINE_ARCHITECTURE.md)
