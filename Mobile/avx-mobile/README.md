# avx-mobile

Terminal Geométrico Mobile - 100% Rust

## Filosofia

**Mobile NÃO é engine completa.**
Mobile é **cliente de geometria pré-processada**.

### O que mobile FAZ

- ✅ Recebe geometria triangulada do backend
- ✅ Carrega e cacheia meshes
- ✅ Frustum culling e LOD selection
- ✅ Rendering Metal (iOS) / Vulkan (Android)
- ✅ AR tracking (ARKit/ARCore)
- ✅ Touch input e camera controls

### O que mobile NÃO faz

- ❌ Parse IFC
- ❌ Resolve CSG
- ❌ Executa BSP
- ❌ Extrusões paramétricas
- ❌ Layers estruturais

## Arquitetura

```
Backend (Server)            Mobile (Cliente)
───────────────────────────────────────────────
IFC Parser
CSG Resolver
BSP Generator
Extrusão/Revolução
Triangulation
LOD Generation
Instancing
Compression
                           ↓ gRPC/Protobuf
                           GeometryManager
                           Frustum Culling
                           LOD Selection
                           Renderer (Metal/Vulkan)
                           AR Session
```

## Dependências

**ZERO dependências externas** (exceto avx-* internas):

```toml
[dependencies]
avx-geometry = { path = "../../backend/avx-geometry" }
avx-linalg = { path = "../../backend/avx-linalg" }
avx-spatial = { path = "../../backend/avx-spatial" }
avx-ifc-core = { path = "../../backend/avx-ifc-core" }
# ... todas path dependencies
```

## Build

### iOS

```bash
cargo build --target aarch64-apple-ios --release
cargo build --target x86_64-apple-ios --release  # Simulator

# Output: target/{arch}/release/libavx_mobile.a
```

### Android

```bash
cargo install cargo-ndk

cargo ndk -t arm64-v8a build --release
cargo ndk -t armeabi-v7a build --release

# Output: target/{arch}/release/libavx_mobile.so
```

## FFI

### iOS (Swift)

```swift
let ctx = avx_mobile_create()
let handle = avx_mobile_load_geometry(ctx, buffer.baseAddress, buffer.count)
avx_mobile_add_instance(ctx, handle, transformPtr)
avx_mobile_render(ctx, viewPtr, projPtr)
avx_mobile_destroy(ctx)
```

### Android (Kotlin)

```kotlin
// TODO: JNI bindings
```

## Binary Format

Geometria do backend em formato binário:

```
u32 version (1)
u32 lod_count
for each LOD:
  f32 distance
  u32 vertex_count
  u32 index_count
  [f32; vertex_count * 8] vertices  // x,y,z, nx,ny,nz, u,v
  [u32; index_count] indices
```

## Performance

### Target

- 60 FPS (non-AR)
- 30+ FPS (AR mode)
- < 500 MB RAM
- < 2s startup

### LOD Distances

- LOD 0: < 10m (máxima qualidade)
- LOD 1: < 25m (alta)
- LOD 2: < 50m (média)
- LOD 3: < 100m (baixa)
- LOD 4: > 100m (mínima)

## Status

- [x] Estrutura base
- [x] GeometryManager
- [x] Binary loader
- [x] LOD selection
- [x] Frustum culling (stub)
- [x] Renderer trait
- [x] Metal/Vulkan stubs
- [x] AR abstractions
- [x] Camera controls
- [x] iOS FFI
- [ ] Implementar raycast real
- [ ] Implementar frustum culling real
- [ ] Implementar Metal renderer
- [ ] Implementar Vulkan renderer
- [ ] Implementar ARKit integration
- [ ] Implementar ARCore integration
- [ ] Android JNI
- [ ] Gesture recognition
- [ ] Memory profiling
