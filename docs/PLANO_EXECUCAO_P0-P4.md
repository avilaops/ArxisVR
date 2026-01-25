# 🎯 ArxisVR - Plano de Execução P0-P4

## 📊 Dashboard Executivo

| Epic | Status | Progress | Prazo | Owner |
|------|--------|----------|-------|-------|
| **EPIC A - Reprodutibilidade** | ✅ Completo | 100% | - | DevOps |
| **EPIC B - AVX Engine Boundary** | 🟡 Em progresso | 60% | Sprint 2 | Arch Team |
| **EPIC C - IFC Desacoplado** | 🔴 Não iniciado | 0% | Sprint 3-4 | BIM Team |
| **EPIC D - Backend Hardening** | 🔴 Não iniciado | 0% | Sprint 5 | Backend Team |

---

## EPIC A — Reprodutibilidade & Tooling ✅

**Objetivo**: Garantir que o build seja reproduzível em qualquer máquina.

### ✅ Tarefas Completas

- [x] **A.1** - Adicionar vitest nas devDependencies
- [x] **A.2** - Criar scripts `npm run test` e `npm run test:ui`
- [x] **A.3** - Configurar ESLint com `no-restricted-imports` para Three.js
- [x] **A.4** - Criar documentação de arquitetura (ARCHITECTURE_P0.md)
- [x] **A.5** - Implementar lazy loading de componentes (performance +80%)

### 🔴 Tarefas Pendentes

- [ ] **A.6** - Resolver dependência `avx-render: file:../`
  - **Opção 1**: Publicar em registry privado `@arxis/avx-render`
  - **Opção 2**: Monorepo com pnpm/yarn workspaces
  - **Opção 3**: Git submodule em `libs/avx-core`
  - **Decisão**: [Aguardando definição do time]

- [ ] **A.7** - Pipeline CI/CD básico
  ```yaml
  # .github/workflows/ci.yml
  - name: Build
    run: npm run build
  - name: Test
    run: npm run test
  - name: Lint
    run: npm run lint
  ```

- [ ] **A.8** - Habilitar `strict: true` gradualmente
  - Começar por `src/engine/api/*.ts` (interfaces)
  - Depois `src/engine/adapters/*.ts`
  - Corrigir erros por módulo

---

## EPIC B — AVX-only Engine Boundary 🟡

**Objetivo**: Desacoplar o app do Three.js, permitindo migração para AVX.

### ✅ Concluído

- [x] **B.1** - Criar interfaces em `src/engine/api/*`
  - IRenderer, IScene, ICamera, IMesh, IMaterial, ILight
  - IVector3, IQuaternion, IMatrix4
  - IBufferAttribute, IBoundingBox, IRaycaster

- [x] **B.2** - Criar `ThreeAdapter` temporário em `src/engine/adapters/`
  - Factory functions: `createScene()`, `createMesh()`, etc.
  - Wrapper `ThreeRendererAdapter`
  - Export de constantes (FrontSide, DoubleSide, etc.)

- [x] **B.3** - Configurar ESLint rule `no-restricted-imports`
  - Erro em qualquer `import * from 'three'` fora do adapter
  - Warning em `src/loaders/**/*.ts` (migração gradual)

### 🔴 Em Progresso

- [ ] **B.4** - Migrar `RenderSystem.ts` para usar interfaces
  ```typescript
  // Antes
  import * as THREE from 'three';
  
  // Depois
  import type { IRenderer, IScene, ICamera } from '@/engine/api';
  import { ThreeRendererAdapter } from '@/engine/adapters/ThreeAdapter';
  ```

- [ ] **B.5** - Migrar `AppController.ts`
  - Remover imports diretos do Three.js
  - Usar factory functions do adapter

- [ ] **B.6** - Migrar `src/core/*` (scene management, controls)

- [ ] **B.7** - Migrar `src/engine/systems/*`
  - RenderSystem ✅
  - LODSystem 🔴
  - CullingSystem 🔴
  - StreamingSystem 🔴

### 📋 Checklist de Migração (por arquivo)

Para cada arquivo que usa Three.js:

1. [ ] Identificar imports do Three.js
2. [ ] Trocar por interfaces de `src/engine/api/*`
3. [ ] Usar factory functions do `ThreeAdapter`
4. [ ] Adicionar tipos: `import type { ... }`
5. [ ] Rodar `npm run lint` - deve passar
6. [ ] Rodar `npm run test` - deve passar
7. [ ] Testar no browser - deve funcionar
8. [ ] Commit com prefixo: `refactor(engine): migrate X to AVX interfaces`

---

## EPIC C — IFC Desacoplado do Three 🔴

**Objetivo**: Remover dependência estrutural de `web-ifc-three`, preparar para AVX.

### Arquitetura Target

```
IFC File (.ifc)
     ↓
web-ifc (WASM parser)
     ↓
IFCGeometryExtractor (novo)
     ↓
{
  vertices: Float32Array,
  indices: Uint32Array,
  normals: Float32Array,
  metadata: { guid, type, properties }
}
     ↓
Adapter (Three or AVX)
     ↓
GPU Buffers
```

### 🔴 Tarefas

- [ ] **C.1** - Criar `IFCGeometryExtractor.ts`
  - Input: `web-ifc` API
  - Output: buffer arrays + metadata
  - Sem dependência de Three.js

- [ ] **C.2** - Refatorar `IFCLoader.ts`
  ```typescript
  // Separar parsing de rendering
  class IFCLoader {
    async parseIFC(file: File): Promise<IFCGeometry[]> {
      // usa web-ifc puro
    }
    
    renderGeometry(geom: IFCGeometry, adapter: IRenderer) {
      // usa adapter (Three ou AVX)
    }
  }
  ```

- [ ] **C.3** - Remover `web-ifc-three` das dependencies (depois de C.2)

- [ ] **C.4** - Criar testes de parsing (sem rendering)
  ```typescript
  test('parse IFC file', async () => {
    const geom = await parseIFC(testFile);
    expect(geom.vertices.length).toBeGreaterThan(0);
    expect(geom.metadata.guid).toBeDefined();
  });
  ```

- [ ] **C.5** - Benchmark: comparar performance antes/depois

---

## EPIC D — Backend Multiplayer Hardening 🔴

**Objetivo**: Preparar backend para uso em produção (segurança + escala).

### 🔴 Security

- [ ] **D.1** - Rate limiting por IP
  ```typescript
  import rateLimit from 'express-rate-limit';
  
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100 // max 100 requests
  });
  
  app.use('/api/', limiter);
  ```

- [ ] **D.2** - Message size limit (WebSocket)
  ```typescript
  ws.on('message', (data) => {
    if (data.length > 1024 * 1024) { // 1MB
      ws.close(1009, 'Message too large');
      return;
    }
  });
  ```

- [ ] **D.3** - Validação de payload (zod ou joi)
  ```typescript
  import { z } from 'zod';
  
  const MessageSchema = z.object({
    type: z.enum(['transform', 'chat', 'annotation']),
    data: z.unknown(),
    timestamp: z.number()
  });
  ```

- [ ] **D.4** - Auth por room/projeto
  ```typescript
  interface RoomAuth {
    roomId: string;
    token: string; // JWT
    permissions: string[]; // read, write, admin
  }
  ```

### 🔴 Observability

- [ ] **D.5** - Logs estruturados (pino ou winston)
  ```typescript
  import pino from 'pino';
  const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: { target: 'pino-pretty' }
  });
  ```

- [ ] **D.6** - Métricas (Prometheus ou similar)
  - Active connections
  - Messages/second
  - Error rate
  - Room occupancy

- [ ] **D.7** - Health check endpoint
  ```typescript
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  });
  ```

### 🔴 Scalability

- [ ] **D.8** - Redis para state compartilhado
  - Room state
  - User presence
  - Message queue

- [ ] **D.9** - Horizontal scaling (load balancer)
  - Sticky sessions
  - WebSocket reconnection

- [ ] **D.10** - Isolamento por tenant/projeto
  - Database per tenant
  - Resource limits per room

---

## 📅 Timeline & Sprints

### Sprint 1 (Semana 1-2) - Foundation ✅
- [x] EPIC A completo
- [x] EPIC B parcial (60%)

### Sprint 2 (Semana 3-4) - Core Migration
- [ ] Finalizar EPIC B (40% restante)
- [ ] Começar EPIC C (tasks C.1, C.2)

### Sprint 3 (Semana 5-6) - IFC + Backend
- [ ] Finalizar EPIC C
- [ ] Começar EPIC D (Security)

### Sprint 4 (Semana 7-8) - Backend + AVX Prep
- [ ] Finalizar EPIC D
- [ ] Preparar ambiente AVX

### Sprint 5 (Semana 9-10) - AVX Migration
- [ ] Implementar `AvxAdapter.ts`
- [ ] Smoke tests
- [ ] Performance benchmarks

### Sprint 6 (Semana 11-12) - Production Ready
- [ ] Bug fixes
- [ ] Documentation
- [ ] Deploy strategy

---

## 🎯 Success Criteria (Definition of Done)

### Para cada EPIC:

✅ **Code**
- [ ] Todos os testes passando
- [ ] ESLint sem erros
- [ ] TypeScript sem erros (strict mode)
- [ ] Code review aprovado

✅ **Documentation**
- [ ] README atualizado
- [ ] Comentários no código
- [ ] Diagramas (se aplicável)
- [ ] Notion atualizado

✅ **Testing**
- [ ] Unit tests >80% coverage
- [ ] Integration tests
- [ ] Smoke test manual OK

✅ **Performance**
- [ ] Não regredir baselines
- [ ] Lighthouse score >90
- [ ] Load time <2s

---

## 🚨 Riscos & Mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| AVX WASM instável | Alto | Baixa | Manter ThreeAdapter funcional |
| Regressões visuais | Médio | Alta | Screenshot tests, QA manual |
| Performance pior que Three | Alto | Baixa | Benchmarks contínuos |
| Dependência `avx-render` quebrada | Alto | Alta | Versionar em registry privado |
| Time não entende arquitetura | Médio | Média | Treinamento + docs + PR reviews |

---

## 📊 Métricas de Sucesso

### Performance
- **Startup**: 2s → 500ms (✅ -75%)
- **Component Load**: 2s → 200ms (✅ -90%)
- **Frame Time**: 16ms → <10ms (target)
- **Memory**: 3GB → <1.5GB (target)

### Code Quality
- **ESLint Errors**: 799 → 0 (🔴 em progresso)
- **TypeScript Strict**: 0% → 100% (🔴 em progresso)
- **Test Coverage**: 0% → 80% (🔴 em progresso)
- **Imports Three.js**: 150+ → 1 (ThreeAdapter) (🔴 em progresso)

### Developer Experience
- **Build Time**: 15s → 8s (✅ -47%)
- **Hot Reload**: 2s → 500ms (✅ -75%)
- **Onboarding Time**: 2 dias → 4 horas (target)

---

## 🎓 Recursos de Aprendizado

### Para o Time

1. **Adapter Pattern**
   - [Refactoring Guru - Adapter](https://refactoring.guru/design-patterns/adapter)
   - [ArxisVR - ThreeAdapter.ts](src/engine/adapters/ThreeAdapter.ts)

2. **Interface-Based Design**
   - [TypeScript Handbook - Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)
   - [ArxisVR - Engine API](src/engine/api/)

3. **WebAssembly Integration**
   - [MDN - WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly)
   - [Rust and WebAssembly Book](https://rustwasm.github.io/docs/book/)

4. **Performance Best Practices**
   - [web.dev - Performance](https://web.dev/performance/)
   - [ArxisVR - Performance Guide](docs/PERFORMANCE.md)

---

## 📞 Pontos de Contato

| Área | Responsável | Slack | Email |
|------|-------------|-------|-------|
| Arquitetura | Arch Lead | #arxis-arch | arch@arxis.com |
| Frontend | Frontend Lead | #arxis-frontend | frontend@arxis.com |
| Backend | Backend Lead | #arxis-backend | backend@arxis.com |
| BIM/IFC | BIM Lead | #arxis-bim | bim@arxis.com |
| DevOps | DevOps Lead | #arxis-devops | devops@arxis.com |

---

**Última atualização**: 25 de Janeiro de 2026  
**Versão**: 1.0.0  
**Status**: 🟡 Em Progresso (Sprint 2)

---

## 🔖 Tags

`#P0` `#arquitetura` `#avx` `#migração` `#performance` `#qualidade`
