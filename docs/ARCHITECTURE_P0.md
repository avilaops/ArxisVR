# 🏗️ ArxisVR - Arquitetura P0 (Migração AVX)

## 📋 Status Atual

✅ **Lazy Loading** implementado - componentes carregam sob demanda  
✅ **Interfaces AVX** criadas em `src/engine/api/*`  
✅ **ThreeAdapter** implementado em `src/engine/adapters/ThreeAdapter.ts`  
✅ **ESLint Rule** configurada para proibir imports diretos do Three.js  
⚠️ **Dependência local** `avx-render` ainda usa `file:` (não portátil)  
⏳ **Migração gradual** do código para usar interfaces AVX

---

## 🎯 Arquitetura Target (AVX-First)

```
┌─────────────────────────────────────────────────────────────┐
│                      ArxisVR App                            │
│  (BIM 4D/5D/6D + VR + Multiplayer + AI Assistant)          │
└─────────────────────────────────────────────────────────────┘
                           ↓ usa apenas
┌─────────────────────────────────────────────────────────────┐
│              src/engine/api/* (Interfaces)                  │
│  IRenderer, IScene, ICamera, IMesh, IMaterial, ILight...   │
└─────────────────────────────────────────────────────────────┘
                           ↓ implementado por
┌─────────────────────────────────────────────────────────────┐
│         src/engine/adapters/* (Implementações)              │
│                                                             │
│  ThreeAdapter.ts  ←─── temporário, migração gradual       │
│  AvxAdapter.ts    ←─── destino final (AVX WASM)           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚫 Regra Crítica: "Three.js só no Adapter"

### ✅ PERMITIDO
```typescript
// src/engine/adapters/ThreeAdapter.ts
import * as THREE from 'three'; // ✅ OK

// Resto do app
import { createScene, createMesh } from '@/engine/adapters/ThreeAdapter';
```

### ❌ PROIBIDO
```typescript
// src/app/*, src/bim/*, src/core/*, etc.
import * as THREE from 'three'; // ❌ ERRO de ESLint
import { Scene } from 'three';   // ❌ ERRO de ESLint
```

**Exceção temporária**: `src/loaders/**/*.ts` (warning, não error)

---

## 📦 Estrutura de Diretórios

```
src/
├── engine/
│   ├── api/              ⭐ Interfaces AVX (contratos)
│   │   ├── IRenderer.ts
│   │   ├── IScene.ts
│   │   ├── ICamera.ts
│   │   ├── IMesh.ts
│   │   ├── IMaterial.ts
│   │   ├── ILight.ts
│   │   └── index.ts
│   │
│   ├── adapters/         ⭐ Implementações (único lugar com Three.js)
│   │   ├── ThreeAdapter.ts   (temporário)
│   │   └── AvxAdapter.ts     (futuro)
│   │
│   ├── ecs/              (Entity Component System)
│   ├── optimization/     (LOD, culling, batching)
│   ├── runtime/          (game loop, systems)
│   └── streaming/        (asset loading)
│
├── bim/                  (IFC, 4D/5D/6D)
├── vr/                   (WebXR, controllers)
├── network/              (multiplayer, WebRTC)
├── assistant/            (AI Assistant)
└── ui/                   (panels, modals)
```

---

## 🔄 Plano de Migração (Fases)

### Fase 1: P0 - Foundation ✅ COMPLETO
- [x] Criar interfaces em `src/engine/api/*`
- [x] Criar `ThreeAdapter` temporário
- [x] Configurar ESLint rule
- [x] Implementar lazy loading de componentes
- [x] Documentar arquitetura

### Fase 2: P1 - Core Migration (EM PROGRESSO)
- [ ] Migrar `src/engine/systems/RenderSystem.ts`
- [ ] Migrar `src/app/AppController.ts`
- [ ] Migrar `src/core/*` (scene, camera, controls)
- [ ] Criar factory functions para objetos comuns

### Fase 3: P2 - BIM & IFC
- [ ] Desacoplar `IFCLoader` do `web-ifc-three`
- [ ] Criar `IFCGeometryExtractor` (buffer-based)
- [ ] Pipeline: IFC → buffers → AVX/Three adapter

### Fase 4: P3 - Advanced Features
- [ ] Migrar VR (`src/vr/*`)
- [ ] Migrar Network (`src/network/*`)
- [ ] Migrar Assistant (`src/assistant/*`)

### Fase 5: P4 - AVX Switch
- [ ] Implementar `AvxAdapter.ts`
- [ ] Smoke tests com AVX
- [ ] Remover dependência do Three.js
- [ ] Comemorar 🎉

---

## 🛠️ Como Usar as Interfaces

### Antes (acoplado ao Three.js)
```typescript
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
```

### Depois (desacoplado, usando interfaces)
```typescript
import { 
  createScene, 
  createPerspectiveCamera,
  ThreeRendererAdapter 
} from '@/engine/adapters/ThreeAdapter';

const scene = createScene();
const camera = createPerspectiveCamera(75, aspect, 0.1, 1000);
const renderer = new ThreeRendererAdapter({ antialias: true });
```

### Tipos
```typescript
import type { IScene, ICamera, IRenderer } from '@/engine/api';

function setupScene(scene: IScene, camera: ICamera, renderer: IRenderer) {
  // Funciona com ThreeAdapter OU AvxAdapter
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}
```

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)
```bash
npm run test          # Run tests
npm run test:ui       # Open test UI
```

### Smoke Test (Before AVX Migration)
1. Todos os testes com `ThreeAdapter` devem passar
2. App deve funcionar normalmente
3. Performance baselines devem ser mantidas

### AVX Migration Test
1. Trocar `ThreeAdapter` por `AvxAdapter` em um sistema
2. Rodar testes - devem continuar passando
3. Validar visualmente no browser

---

## 📊 Performance Targets

| Métrica                  | Before (Three) | Target (AVX) |
|--------------------------|----------------|--------------|
| Startup Time             | 2-3s           | <500ms       |
| Component Load (lazy)    | 200-400ms      | <100ms       |
| IFC Parse (100MB)        | 8-12s          | 4-6s         |
| Frame Time (100k tris)   | 16ms           | <8ms         |
| Memory (large model)     | 2-3GB          | 1-1.5GB      |

---

## 🐛 Problemas Conhecidos

### CRÍTICO 1: Dependência `avx-render` não portátil
```json
// package.json
"avx-render": "file:../Avx-Core/.../pkg"  // ❌ Quebra em outras máquinas
```

**Solução**:
1. Publicar em registry privado: `@arxis/avx-render`
2. Ou usar workspace monorepo (pnpm/yarn)
3. Ou incluir como submodule

### CRÍTICO 2: TypeScript `strict: false`
```json
// tsconfig.json
"strict": false  // ❌ Dívida técnica
```

**Solução gradual**:
```bash
# Habilitar por módulo
npx tsc --strict src/engine/api/*.ts       # ✅ OK
npx tsc --strict src/engine/adapters/*.ts  # ✅ OK
npx tsc --strict src/app/*.ts              # 🔨 Fix errors
```

### ALTO 1: Duplicação de sistemas
- `engine/runtime/RenderSystem.ts`
- `engine/runtime-systems/RenderSystem.ts`
- `engine/systems/RenderSystem.ts`

**Solução**: Consolidar em `engine/systems/` e remover duplicatas.

---

## 📝 Checklist para Novos Devs

Ao adicionar novo código:

- [ ] Usar `import type` para tipos de `src/engine/api/*`
- [ ] Não importar `three` diretamente (ESLint vai reclamar)
- [ ] Usar factory functions de `ThreeAdapter`
- [ ] Escrever testes com interfaces, não implementações
- [ ] Rodar `npm run lint` antes de commit
- [ ] Adicionar comentário `// TODO(AVX): migrate` se código ainda usa Three

---

## 🎓 Recursos & Links

- [ESLint no-restricted-imports](https://eslint.org/docs/latest/rules/no-restricted-imports)
- [Adapter Pattern](https://refactoring.guru/design-patterns/adapter)
- [Vite Code Splitting](https://vitejs.dev/guide/features.html#code-splitting)
- [WebAssembly Best Practices](https://web.dev/webassembly/)

---

## 🚀 Quick Start

```bash
# 1. Clone repo
git clone <repo>
cd ArxisVR

# 2. Install deps
npm install

# 3. Dev server (fast!)
npm run dev

# 4. Run tests
npm run test

# 5. Lint
npm run lint

# 6. Build for production
npm run build
```

---

## 📞 Contato & Suporte

- **Arquiteto**: [Your Name]
- **Issues**: GitHub Issues
- **Docs**: `/docs` folder
- **Slack**: #arxisvr-dev

---

**Última atualização**: 25 de Janeiro de 2026  
**Versão**: 1.0.0 (P0 Completo)
