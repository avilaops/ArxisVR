# ARQUITETURA MOBILE VIZZIO - IFC/BIM/AR
**Documento Técnico Definitivo**

> *"Mobile não é engine completa. Mobile é terminal geométrico inteligente."*

---

## PREMISSAS FÍSICAS NÃO-NEGOCIÁVEIS

### Restrições Hardware Mobile
- **RAM**: 2–8 GB compartilhados (sistema + apps)
- **GPU**: Tile-based rendering (não desktop-class)
- **CPU**: big.LITTLE (heterogêneo)
- **Energia**: Recurso crítico (thermal throttling)
- **Target**: 30–60 FPS estáveis em AR

### Consequências Arquiteturais
```
❌ Mobile NÃO executa o núcleo completo
✅ Mobile executa subconjunto COMPILADO do núcleo
```

---

## 1. SEPARAÇÃO ARQUITETURAL OBRIGATÓRIA

### Pipeline Correto
```
┌─────────────────────────────────────┐
│  NÚCLEO IFC PESADO                  │
│  (Offline/Server/Pré-processamento) │
└─────────────────┬───────────────────┘
                  │
                  ▼
          ┌───────────────┐
          │ Resolução     │
          │ Completa      │
          │ - CSG         │
          │ - BSP         │
          │ - Extrusões   │
          │ - Revoluções  │
          │ - Openings    │
          │ - Layers      │
          └───────┬───────┘
                  │
                  ▼
          ┌───────────────┐
          │ Normalização  │
          │ - Watertight  │
          │ - Instancing  │
          │ - LODs        │
          │ - Decimation  │
          └───────┬───────┘
                  │
                  ▼
          ┌───────────────┐
          │ Export        │
          │ - Malhas      │
          │ - Materiais   │
          │ - Metadados   │
          │ - Índices     │
          └───────┬───────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  RUNTIME MOBILE                     │
│  Loader → Cache → SceneGraph → GPU │
└─────────────────────────────────────┘
```

### Regra de Ouro
> **O mobile NÃO sabe o que é IFC.**  
> Ele só entende: `runtime geometry + metadata`

---

## 2. O QUE O MOBILE EXECUTA

### 2.1 Geometria Permitida

#### ✅ ACEITO
- **Apenas triângulos** (malhas pré-trianguladas)
- **Apenas instâncias** (transform batching)
- **Apenas LOD selecionado** (não resolve em runtime)
- **Buffers compactados**:
  - `VertexBuffer` (posições + normais + UV)
  - `IndexBuffer` (uint16/uint32)
  - `InstanceBuffer` (transforms)

#### ❌ PROIBIDO
- Geometria implícita (IfcSweptSolid, IfcExtrudedAreaSolid)
- CSG trees profundas
- BSP dinâmico
- Revolução/extrusão paramétrica
- Layers estruturais não-resolvidas

### 2.2 Extrusão/Revolução no Mobile

#### Casos Aceitáveis (locais)
- Tubos simples (UI helpers)
- Perfis pequenos (<100 vértices)
- Gizmos de medição
- Elementos paramétricos isolados

#### Casos Proibidos
- IfcWall com openings
- CSG com múltiplas operações
- Layers estruturais
- Extrusões longas (>10m)

**Regra prática**:
```
Extrusão no mobile = apenas UI/UX, não BIM
```

---

## 3. BSP NO MOBILE

### ❌ BSP Completo
- Pesado (recursão profunda)
- Alocação excessiva
- Split dinâmico caro

### ✅ Substitutos Corretos

#### A) BSP Pré-Compilado
```
Usado apenas como estrutura de CORTE
Não como CSG dinâmico
Serializado do backend
```

#### B) Clipping por Plano Simples
```rust
// Algoritmos usados:
- Half-space clipping
- Sutherland–Hodgman (simplificado)
- Shader-based discard
```

---

## 4. CORTES E SEÇÕES

### Estratégia A: Shader-Based Clipping (PREFERIDA)

```glsl
// Fragment Shader
uniform vec4 clipPlane; // (normal.xyz, distance)

void main() {
    float dist = dot(clipPlane.xyz, worldPos) - clipPlane.w;
    if (dist > 0.0) discard;
    // ... resto do shader
}
```

**Vantagens**:
- Zero alteração de malha
- Custo apenas na GPU
- Tempo real
- Múltiplos planos simultâneos

### Estratégia B: Malhas Pré-Cortadas

```
Cortes horizontais por pavimento (pre-computed)
Usados para navegação entre andares
Gerados no backend
```

---

## 5. PRECISÃO NUMÉRICA MOBILE

### Problema
```
Mobile usa float32 (não double)
Precisão limitada: ~7 dígitos decimais
Erro visível em coordenadas grandes (>10.000m)
```

### Solução: Floating Origin

```rust
// Conceito
coordenada_mundo = coordenada_local + offset_global

// Prática
struct FloatingOrigin {
    local_center: Vec3,  // sempre próximo de (0,0,0)
    world_offset: DVec3, // double precision
}

impl FloatingOrigin {
    fn world_to_local(&self, world_pos: DVec3) -> Vec3 {
        (world_pos - self.world_offset).as_vec3()
    }
    
    fn update(&mut self, camera_pos: DVec3) {
        if camera_pos.distance(self.world_offset) > 1000.0 {
            self.world_offset = camera_pos;
            // Reposicionar todos os objetos...
        }
    }
}
```

**Sem Floating Origin**:
- Jitter (tremor de câmera)
- Medições imprecisas
- AR instável

---

## 6. AR NO MOBILE - REQUISITOS

### O que AR Exige
- **Pose tracking** contínuo (60 Hz)
- **Ray casting** constante (picking)
- **Oclusão** simples (depth-based)
- **Escala real** 1:1 (sem transformações arbitrárias)

### Ajustes no Núcleo

#### ✅ Malhas Simplificadas
```
Target: 200k–500k triângulos visíveis
Instancing OBRIGATÓRIO
LOD agressivo por distância
```

#### ✅ Bounding Volumes Agressivos
```
AABB para broad-phase
OBB apenas quando necessário
Sphere bounds para oclusão
```

#### ✅ Colisão Simplificada
```
AABB/OBB apenas
❌ Nada de triangle-level collision
Ray-triangle só para picking final
```

---

## 7. INDEXAÇÃO ESPACIAL MOBILE

### ✅ Estruturas Usadas

#### A) BVH Raso (max 5 níveis)
```rust
struct BVHNode {
    bounds: AABB,
    children: Option<[Box<BVHNode>; 2]>,
    objects: Vec<ObjectHandle>, // se folha
}
```

#### B) Grids Uniformes
```rust
struct UniformGrid {
    cell_size: f32,
    cells: HashMap<IVec3, Vec<ObjectHandle>>,
}
```

#### C) Buckets por Pavimento
```rust
struct BuildingIndex {
    storeys: BTreeMap<i32, StoreyBucket>,
}

struct StoreyBucket {
    elevation: f32,
    objects: Vec<ObjectHandle>,
    spatial_grid: UniformGrid,
}
```

### ❌ Estruturas NÃO Usadas
- Octree profundo (>6 níveis)
- KD-tree dinâmico
- BSP completo

---

## 8. STREAMING NO MOBILE

### Modelo de Carregamento Progressivo

```
┌─────────────────────┐
│ Envelope do Prédio  │ (sempre carregado)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Pavimentos Próximos │ (±2 andares)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Ambientes Visíveis  │ (frustum culling)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Detalhes sob Demanda│ (proximidade)
└─────────────────────┘
```

### Critérios de Carregamento
1. **Distância** (euclidiana 3D)
2. **Frustum** (visibilidade)
3. **Pavimento** (contexto arquitetônico)
4. **Disciplina** (ARQ/STR/MEP toggle)

---

## 9. MEMÓRIA - REGRAS CRÍTICAS

### Limites Práticos
```
1 milhão de triângulos = PESADO
VR/AR ideal = 200k–500k visíveis
Target conservador = 300k triângulos
```

### Orçamento de Memória (exemplo 4GB device)
```
Sistema operacional:  1.5 GB
App base:             0.5 GB
──────────────────────────────
Disponível para cena: 2.0 GB
  ├─ Geometria:       1.0 GB
  ├─ Texturas:        0.5 GB
  ├─ Índices:         0.3 GB
  └─ Buffers temp:    0.2 GB
```

### Consequências
- **Instancing obrigatório** (reduz 10x–100x)
- **Compressão agressiva** (quantização)
- **Streaming constante** (não carregar tudo)

**Sem isso**:
- Queda de FPS
- Thermal throttling
- App encerrado pelo OS (OOM)

---

## 10. COMPARAÇÃO DESKTOP vs MOBILE

| Camada                | Desktop | Mobile  |
|-----------------------|---------|---------|
| IFC parsing           | ✔️       | ❌       |
| CSG dinâmico          | ✔️       | ❌       |
| Extrusão pesada       | ✔️       | ❌       |
| BSP completo          | ✔️       | ❌       |
| Instancing            | ✔️       | ✔️✔️     |
| LOD agressivo         | Médio   | Extremo |
| Floating origin       | Opcional| **Obrigatório** |
| Max triângulos visíveis| 5M     | 500k    |
| Precisão numérica     | double  | float32 |

---

## 11. KERNEL GEOMÉTRICO MÍNIMO MOBILE

### Objeto Canônico
```rust
struct RuntimeSolid {
    // Geometria (imutável)
    vertices: VertexBuffer,    // Vec<Vertex>
    indices: IndexBuffer,      // Vec<u32>
    
    // Topologia (opcional, simplificada)
    adjacency: Option<EdgeAdjacency>,
    
    // Transform
    local_to_world: Mat4,
    
    // Bounds
    aabb_local: AABB,
    aabb_world: AABB,  // cached
    
    // Metadados
    ifc_guid: String,
    ifc_type: IfcEntityType,
    storey: i32,
    discipline: Discipline,
    
    // LOD
    lod_level: u8,
    lod_siblings: Vec<AssetHandle>, // outros LODs
}
```

### Pipeline Mínimo
```
[ Asset Loader ]
      ↓
[ Decompression ]
      ↓
[ GPU Upload ]
      ↓
[ SceneGraph Insert ]
      ↓
[ Spatial Index ]
```

---

## 12. FORMATO DE DADOS: BACKEND → MOBILE

### Proposta: AVX Binary Format (`.avxb`)

```rust
// Header
struct AvxbHeader {
    magic: [u8; 4],        // "AVXB"
    version: u32,
    flags: u32,
    num_objects: u32,
    index_offset: u64,
    metadata_offset: u64,
}

// Objeto serializado
struct AvxbObject {
    guid: u128,
    ifc_type: u16,
    lod_level: u8,
    vertex_count: u32,
    index_count: u32,
    transform: [f32; 16],
    aabb: [f32; 6],
    
    // Dados comprimidos
    vertex_data: CompressedBlob,
    index_data: CompressedBlob,
}
```

**Características**:
- Compressão Draco ou Meshoptimizer
- Quantização 16-bit para posições
- Quantização 8-bit para normais (octahedral)
- Índices uint16 quando possível

---

## 13. DEFINIÇÃO DO KERNEL CANÔNICO

### Responsabilidades Imutáveis

```
┌───────────────────────────────────────┐
│         KERNEL (Núcleo Imutável)      │
├───────────────────────────────────────┤
│ - Tipos geométricos fundamentais      │
│ - Álgebra linear (Vec3, Mat4, Quat)   │
│ - Interseções básicas                 │
│ - Transformações                      │
│ - Tolerâncias numéricas               │
│ - Invariantes topológicos             │
└───────────────────────────────────────┘
         ▲
         │ usa
         │
┌───────────────────────────────────────┐
│       PIPELINE (Imutável)             │
├───────────────────────────────────────┤
│ 1. Parse                              │
│ 2. Normalização                       │
│ 3. Resolução geométrica               │
│ 4. Validação topológica               │
│ 5. Geração de runtime objects         │
│ 6. Adaptação por target               │
└───────────────────────────────────────┘
         ▲
         │ usa
         │
┌───────────────────────────────────────┐
│       RUNTIME (Mutável)               │
├───────────────────────────────────────┤
│ - Scene graph                         │
│ - Culling                             │
│ - LOD selection                       │
│ - Streaming                           │
│ - GPU upload                          │
└───────────────────────────────────────┘
         ▲
         │ usa
         │
┌───────────────────────────────────────┐
│       UI/AR (Altamente Mutável)       │
├───────────────────────────────────────┤
│ - Interaction                         │
│ - Picking                             │
│ - Measurements                        │
│ - AR tracking                         │
└───────────────────────────────────────┘
```

### Regra de Isolamento
```
Kernel NÃO conhece:
  ❌ mobile
  ❌ GPU
  ❌ AR
  ❌ VR
  
Kernel SÓ conhece:
  ✅ matemática
  ✅ geometria
  ✅ topologia
  ✅ semântica BIM
```

---

## 14. GAPS AINDA NÃO RESOLVIDOS

### 14.1 Robustez Numérica
- [ ] Robust predicates (orientation3D)
- [ ] Epsilon hierárquico (não constante)
- [ ] Exact arithmetic para casos críticos
- [ ] Interval arithmetic para CSG

### 14.2 Topologia Robusta
- [ ] Manifold enforcement
- [ ] Edge welding tolerante
- [ ] Mesh repair automático
- [ ] Euler characteristic validation

### 14.3 Semântica IFC Completa
- [ ] IfcLocalPlacement chains
- [ ] Boolean trees profundas
- [ ] Material layers
- [ ] Openings complexos

### 14.4 GPU Data Model
- [ ] Buffer layouts otimizados
- [ ] Quantização adaptativa
- [ ] Streaming progressivo
- [ ] Instancing avançado

### 14.5 AR/VR Interação
- [ ] Picking volumétrico semântico
- [ ] Snapping em VR
- [ ] Medições precisas em espaço imersivo
- [ ] Oclusão AR avançada

---

## 15. PRÓXIMOS PASSOS

### Fase 1: Consolidação (AGORA)
1. **Definir tipos canônicos** do kernel
2. **Congelar pipeline** de processamento
3. **Documentar invariantes** matemáticos
4. **Estabelecer formato binário** `.avxb`

### Fase 2: Implementação Core
1. **avx-math-core** (tipos fundamentais)
2. **avx-geometry** (primitivas + interseções)
3. **avx-topology** (half-edge + validação)
4. **avx-csg** (BSP + boolean robusto)

### Fase 3: IFC Integration
1. **avx-ifc-kernel** (parsing semântico)
2. **avx-ifc-pipeline** (resolução completa)
3. **avx-ifc-export** (→ runtime format)

### Fase 4: Mobile Runtime
1. **avx-runtime-core** (scene graph + LOD)
2. **avx-runtime-mobile** (streaming + AR)
3. **avx-runtime-wasm** (web mobile)

---

## 16. MODELO MENTAL CORRETO

```
Mobile ≠ Mini Desktop

Mobile = Terminal Geométrico Inteligente
```

### Mobile Consome
- Geometria pré-resolvida
- Malhas otimizadas
- Metadados estruturados
- Índices espaciais

### Mobile Filtra
- Por distância
- Por frustum
- Por LOD
- Por disciplina

### Mobile Apresenta
- Com precisão float32
- Com floating origin
- Com shader clipping
- Com AR tracking

### Mobile Interage
- Ray casting
- Picking semântico
- Medições locais
- Anotações AR

---

## CONCLUSÃO

**Você já tem**:
- ✅ Containers
- ✅ Parsing
- ✅ IO
- ✅ Codecs

**Você precisa**:
- 🎯 Kernel canônico formal
- 🎯 Pipeline congelado
- 🎯 Formato binário mobile
- 🎯 Runtime mobile científico

**Você NÃO precisa**:
- ❌ Reinventar math básico
- ❌ Duplicar infraestrutura
- ❌ Features especulativas

---

## REFERÊNCIAS TÉCNICAS

### Geometria Computacional
- Robust Geometric Predicates (Shewchuk, 1997)
- Computational Geometry: Algorithms and Applications (de Berg et al.)
- Real-Time Collision Detection (Ericson, 2004)

### Mobile Graphics
- ARM Mali GPU Best Practices
- Qualcomm Adreno Optimization Guide
- Apple Metal Best Practices

### BIM/IFC
- ISO 16739:2018 (IFC 4.3)
- BuildingSMART Technical Documentation
- IFC Implementation Handbook

---

**Documento mantido por**: Vizzio Core Team  
**Última atualização**: 2025-12-18  
**Status**: 🟡 Em consolidação (Fase 1)
