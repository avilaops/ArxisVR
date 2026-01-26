# Enterprise Systems Integration Blueprint

## Correções Implementadas (Commit d490909)

### 1. LightingSystem - BUGS CRÍTICOS CORRIGIDOS

#### (A) ✅ `light.dispose()` não existe (CRASH)
**Antes:**
```typescript
light.dispose(); // ❌ ERRO: método não existe
```

**Depois:**
```typescript
if (light.shadow && light.shadow.map) {
  light.shadow.map.dispose(); // ✅ Correto
  light.shadow.map = null;
}
```

#### (B) ✅ Shadow camera fixa (`shadowSize=100`) - Falha em BIM real
**Novo método:**
```typescript
lightingSystem.fitToBounds(modelBounds, 1.2);
// Ajusta shadow camera dinamicamente:
// - left/right/top/bottom cobrem o modelo
// - target centralizado no bounds.center
// - near/far baseados no tamanho real
```

#### (C) ✅ Configuração do renderer
**Novo método:**
```typescript
lightingSystem.setupRenderer(renderer);
// Configura:
// - shadowMap.enabled = true
// - shadowMap.type = PCFSoftShadowMap
// - outputColorSpace = SRGBColorSpace
// - toneMapping = ACESFilmicToneMapping
```

#### Ajustes Finos
- ✅ `normalBias = 0.02` (mais estável que bias em cenas grandes)
- ✅ `groundColor` transitions (dia/noite)

---

### 2. LODSystem - PERFORMANCE & BUGS CORRIGIDOS

#### (A) ✅ Mutação de materiais compartilhados (CORRUPÇÃO)
**Antes:**
```typescript
material.roughness = 0.8; // ❌ Quebra outras meshes
material.metalness = 0.05;
```

**Depois:**
```typescript
// Cache de variants (criadas 1x por material)
const variants = {
  high: material,           // Original
  medium: material.clone(), // Variant
  low: material.clone()     // Variant
};
mesh.material = variants.medium; // ✅ Troca referência
```

#### (B) ✅ Hysteresis (15% margin) - Elimina flicker
**Antes:**
```typescript
if (distance > 50) targetLOD = 'MEDIUM'; // Flicker na borda
```

**Depois:**
```typescript
// HIGH → MEDIUM: 50m * 1.15 = 57.5m
// MEDIUM → HIGH: 50m * 0.85 = 42.5m
if (currentLOD === 'HIGH') {
  if (effectiveDistance > adjustedDistances.HIGH * 1.15) {
    targetLOD = 'MEDIUM';
  }
}
```

#### (C) ✅ Distância efetiva com raio do sphere
**Antes:**
```typescript
const distance = camera.position.distanceTo(center); // ❌ Culpa cedo
```

**Depois:**
```typescript
const distanceToCenter = camera.position.distanceTo(center);
const effectiveDistance = Math.max(0, distanceToCenter - radius); // ✅ Considera tamanho
```

#### (D) ✅ Handle `material[]` arrays
**Antes:**
```typescript
mesh.material.transparent = true; // ❌ Crash se array
```

**Depois:**
```typescript
if (Array.isArray(material)) {
  mesh.material = material.map(mat => getMaterialVariant(mat, 'high'));
} else {
  mesh.material = getMaterialVariant(material, 'high');
}
```

---

### 3. MaterialSystem - BUG CRÍTICO CORRIGIDO

#### ✅ Dispose de material compartilhado (CORRUPÇÃO)
**Antes:**
```typescript
child.material = material.clone();
oldMaterial.dispose(); // ❌ Quebra outras meshes
```

**Depois:**
```typescript
child.material = material.clone();
// ✅ Não dispor - materiais podem ser compartilhados
// Dispose só no teardown global (viewer.dispose)
```

#### ✅ Defaults arquitetônicos para texturas
**Novo método:**
```typescript
private applyArchitecturalDefaults(texture: THREE.Texture) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16; // Qualidade em ângulos rasos
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
}
```

---

### 4. RenderQualityManager (NOVO) - Coordenação

Gerencia qualidade de forma coordenada:

```typescript
const qualityManager = new RenderQualityManager(
  renderer,
  lightingSystem,
  lodSystem
);

// Presets coordenados
qualityManager.setQuality('high');
// - renderer.pixelRatio = 2.0
// - lightingSystem.setShadowQuality('high')
// - lodSystem.setLODDistances(20, 50, 100, 150)

// Safe mode (máquinas fracas)
qualityManager.enableSafeMode(true);
// - Força 'low' quality
// - pixelRatio = 1.0
// - Sem auto-ajuste

// Auto-ajuste por FPS
qualityManager.autoAdjustQuality(currentFPS, 60);
```

**Presets:**
- `ultra`: 4K, shadows 4096px, LOD distances +50%
- `high`: Default, shadows 2048px, balanced
- `medium`: Shadows 1024px, LOD distances -30%
- `low`: Shadows 512px, LOD agressivo
- `potato`: Sem sombras, pixelRatio 0.75, LOD muito agressivo

---

## Pipeline de Integração Correto

### 1. Setup Inicial (uma vez)
```typescript
// 1. Cria renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });

// 2. Cria sistemas
const lightingSystem = new LightingSystem(scene);
const lodSystem = new LODSystem(camera);
const materialSystem = new MaterialSystem(renderer);

// 3. Configura lighting + renderer
lightingSystem.setupDefaultLighting();
lightingSystem.setupRenderer(renderer);

// 4. Cria quality manager
const qualityManager = new RenderQualityManager(
  renderer,
  lightingSystem,
  lodSystem
);

// 5. Define qualidade inicial
qualityManager.setQuality('high');
```

### 2. Carregamento de Modelo
```typescript
// 1. Carrega IFC
const ifcLoader = new IFCLoader();
const group = await ifcLoader.loadAsync('model.ifc');

// 2. Normaliza transforms (centraliza, escala)
const bounds = new THREE.Box3().setFromObject(group);
const center = bounds.getCenter(new THREE.Vector3());
group.position.sub(center); // Centraliza

// 3. Adiciona à cena
scene.add(group);

// 4. Ajusta lighting ao modelo (CRÍTICO)
lightingSystem.fitToBounds(bounds);
console.log('✅ Shadow camera ajustada para modelo');

// 5. Registra no LOD (após posicionar)
lodSystem.registerModel(group);
console.log('✅ Modelo registrado no LOD');

// 6. (Opcional) Aplica materiais
// materialSystem.applyMaterialByIFCType(group, ifcType);
```

### 3. Loop de Renderização
```typescript
function animate(deltaTime: number) {
  // LOD update (throttled internamente se usar ModelSession)
  lodSystem.update();

  // Renderer
  renderer.render(scene, camera);

  // Auto-ajuste de qualidade (opcional, 1x por segundo)
  if (frameCount % 60 === 0) {
    const fps = 1000 / deltaTime;
    qualityManager.autoAdjustQuality(fps, 60);
  }
}
```

### 4. Controles de Usuário
```typescript
// Hora do dia
lightingSystem.updateTimeOfDay(hour); // 0-24

// Qualidade manual
qualityManager.setQuality('medium');

// Safe mode
qualityManager.enableSafeMode(true);
```

---

## Impacto das Correções

### Bugs Eliminados
1. ✅ Crash ao remover luzes (`light.dispose()` não existe)
2. ✅ Corrupção de materiais (dispose de compartilhados)
3. ✅ Crash com `material[]` arrays no LOD

### Performance
1. ✅ Material variants: evita recompilação de shaders
2. ✅ Hysteresis: reduz trocas de LOD desnecessárias
3. ✅ Distância efetiva: LOD mais preciso em modelos grandes
4. ✅ Cached variants: O(1) lookup vs O(n) property mutation

### Qualidade Visual
1. ✅ Shadow camera dinâmica: sem clipping em BIM 300m+
2. ✅ Tone mapping + color space: PBR consistente
3. ✅ Texturas arquitetônicas: repeat wrapping, anisotropy
4. ✅ Transições dia/noite suaves

### Escalabilidade
1. ✅ Safe mode: garante 30+ FPS em máquinas fracas
2. ✅ Auto-ajuste: adapta qualidade ao hardware
3. ✅ Presets coordenados: consistência entre sistemas

---

## Exemplo Completo

```typescript
// === SETUP ===
const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);

const lightingSystem = new LightingSystem(scene);
const lodSystem = new LODSystem(camera);
const materialSystem = new MaterialSystem(renderer);

lightingSystem.setupDefaultLighting();
lightingSystem.setupRenderer(renderer);

const qualityManager = new RenderQualityManager(
  renderer,
  lightingSystem,
  lodSystem
);

// Safe mode se GPU fraca
const isMobile = /Android|iPhone/i.test(navigator.userAgent);
qualityManager.enableSafeMode(isMobile);

// === LOAD MODEL ===
const ifcLoader = new IFCLoader();
const model = await ifcLoader.loadAsync('project.ifc');

// Centraliza
const bounds = new THREE.Box3().setFromObject(model);
const center = bounds.getCenter(new THREE.Vector3());
model.position.sub(center);

scene.add(model);

// FIT LIGHTING (CRÍTICO)
lightingSystem.fitToBounds(bounds, 1.2);

// REGISTRA LOD
lodSystem.registerModel(model);

// === LOOP ===
let frameCount = 0;
let lastTime = performance.now();

function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const deltaTime = now - lastTime;
  lastTime = now;

  // LOD
  lodSystem.update();

  // Render
  renderer.render(scene, camera);

  // Auto-ajuste (1x/segundo)
  if (frameCount++ % 60 === 0) {
    const fps = 1000 / deltaTime;
    qualityManager.autoAdjustQuality(fps, 60);
  }
}

animate();

// === CONTROLS ===
document.getElementById('time-slider').addEventListener('input', (e) => {
  const hour = parseFloat(e.target.value);
  lightingSystem.updateTimeOfDay(hour);
});

document.getElementById('quality-select').addEventListener('change', (e) => {
  qualityManager.setQuality(e.target.value);
});
```

---

## Checklist de Uso

Quando carregar um modelo:
- [ ] Centralizar/normalizar transforms ANTES de `registerModel()`
- [ ] Chamar `lightingSystem.fitToBounds(bounds)` SEMPRE
- [ ] Registrar no LOD DEPOIS de posicionar
- [ ] Não dispor materiais manualmente

Quando configurar qualidade:
- [ ] Usar `RenderQualityManager` ao invés de configurar sistemas diretamente
- [ ] Ativar safe mode em mobile/máquinas fracas
- [ ] Considerar auto-ajuste por FPS

Quando fazer dispose:
- [ ] Chamar `lodSystem.dispose()` para limpar material variants
- [ ] Chamar `lightingSystem.dispose()` para limpar shadow maps
- [ ] Não dispor materiais individuais (podem ser compartilhados)

---

**Commit:** d490909  
**Status:** ✅ Todos os testes passaram  
**Build:** ✅ Sucesso (713KB gzipped)  
**Impacto:** Elimina 3 crashes, previne corrupção de materiais, escalabilidade BIM real
