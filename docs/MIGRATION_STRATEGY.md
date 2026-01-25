# Estratégia de Migração AVX - Separação Three.js

## 🎯 Objetivo

Isolar Three.js em `src/engine/adapters/ThreeAdapter.ts` e forçar o resto do código a usar interfaces abstratas de `src/engine/api/`.

Isso permite:
- ✅ Trocar backend (Three.js → AVX) sem reescrever todo código
- ✅ Migração gradual (módulo por módulo)
- ✅ Type safety completo
- ✅ Zero leaky abstractions

## 📐 Arquitetura

```
src/
├── engine/
│   ├── api/              ← Interfaces puras (zero import de Three.js)
│   │   ├── IRenderer.ts
│   │   ├── IScene.ts
│   │   ├── ICamera.ts
│   │   ├── IMesh.ts
│   │   ├── IGeometry.ts
│   │   ├── IMaterial.ts
│   │   ├── ILight.ts
│   │   └── index.ts     ← IEngineFactory (entry point)
│   │
│   └── adapters/         ← ÚNICO local com import de Three.js
│       ├── ThreeAdapter.ts  ← Implementa IEngineFactory com Three.js
│       └── AvxAdapter.ts    ← (futuro) Implementa IEngineFactory com AVX
│
├── loaders/              ← Deve migrar para usar src/engine/api/
├── systems/              ← Deve migrar para usar src/engine/api/
└── ...
```

## 🔒 Regras ESLint

**Arquivo**: `.eslintrc.json`

```json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          {
            "group": ["three", "three/*"],
            "message": "⚠️ PROIBIDO: Three.js só pode ser importado em src/engine/adapters/ThreeAdapter.ts"
          }
        ]
      }
    ]
  },
  "overrides": [
    {
      "files": ["src/engine/adapters/ThreeAdapter.ts"],
      "rules": {
        "no-restricted-imports": "off"
      }
    }
  ]
}
```

## 🚀 Como Usar

### Antes (acoplado)
```typescript
import * as THREE from 'three';

const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
```

### Depois (desacoplado)
```typescript
import { threeEngine } from '@/engine/adapters/ThreeAdapter';
// OU: import { avxEngine } from '@/engine/adapters/AvxAdapter';

const renderer = threeEngine.createRenderer();
const scene = threeEngine.createScene();
const camera = threeEngine.createPerspectiveCamera(75, 1, 0.1, 1000);
```

## 📝 Status de Implementação

### ✅ Completo
- [x] Interfaces AVX (`src/engine/api/*`)
- [x] ThreeAdapter básico (Renderer, Scene, Camera)
- [x] Regra ESLint (proibir Three.js fora de adapters)
- [x] package.json (vitest, @typescript-eslint)
- [x] tsconfig.json (strict: true)

### 🔨 Em Progresso
- [ ] ThreeAdapter completo (Geometry, Material, Light)
- [ ] Migrar `src/loaders/IFCLoader.ts` para usar abstrações
- [ ] Migrar `src/systems/*` para usar abstrações

### 📅 Próximos Passos
1. **Completar ThreeAdapter**
   - Implementar `IGeometryFactory`
   - Implementar `IMaterialFactory`
   - Implementar `ILightFactory`
   - Implementar `IOrthographicCamera`
   - Implementar `IMesh` e raycasting

2. **Migração Piloto**
   - Escolher 1 módulo (ex: `src/systems/LODSystem.ts`)
   - Reescrever usando apenas `src/engine/api/`
   - Validar que funciona identicamente

3. **Migração Sistemática**
   - `src/loaders/` (IFCLoader, GLTFLoader)
   - `src/systems/` (LODSystem, OcclusionCulling)
   - `src/core/` (Scene, Camera)
   - `src/engine/` (rendering core)

4. **Validação**
   - Rodar `npm run lint` → 0 erros
   - Todos imports de Three.js fora de adapters devem dar erro ESLint
   - Build deve compilar sem erros

5. **AVX Backend (futuro)**
   - Criar `AvxAdapter.ts` implementando `IEngineFactory`
   - Fazer switch: `const engine = USE_AVX ? avxEngine : threeEngine;`
   - Testar renderização side-by-side

## 🧪 Testes

```bash
# Validar regras ESLint
npm run lint

# Type checking
npm run type-check

# Testes unitários
npm test
```

## 📊 Métricas de Sucesso

- **0 imports** de `three` fora de `src/engine/adapters/`
- **100% strict mode** no TypeScript
- **Build reprodutível** (sem `file:` dependencies)
- **Cobertura de testes** > 70%

## ⚠️ Avisos

### getNativeObject()
```typescript
interface ISceneObject {
  getNativeObject(): any; // ⚠️ Escape hatch temporário
}
```

Métodos `getNative*()` são **temporários** para compatibilidade durante migração. Após migração completa, devem ser removidos.

### Loaders com Three.js
`src/loaders/` pode continuar usando Three.js temporariamente (configurado como `warn` no ESLint), mas deve migrar eventualmente.

## 📚 Referências

- **Interface Segregation Principle** (ISP)
- **Dependency Inversion Principle** (DIP)
- **Adapter Pattern**
- **Strategy Pattern**

## 🎓 Exemplo Completo

Ver: `src/engine/adapters/ThreeAdapter.ts` + `src/engine/api/index.ts`
