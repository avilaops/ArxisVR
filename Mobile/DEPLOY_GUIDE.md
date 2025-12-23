# 🚀 Guia de Deploy Mobile - Vizzio IFC/BIM/AR

**Stack**: React Native + Rust (via Tauri Mobile)
**Target**: iOS 14+ / Android 10+ (API 29+)
**AR**: ARKit 3.0+ / ARCore 1.20+

---

## ARQUITETURA MOBILE

### Visão Geral

```
┌─────────────────────────────────────────┐
│         BACKEND (Railway/Cloud)         │
│  ┌───────────────────────────────────┐  │
│  │  IFC Processing Pipeline          │  │
│  │  - Parse STEP files               │  │
│  │  - Resolve CSG/Boolean ops        │  │
│  │  - Generate optimized meshes      │  │
│  │  - Create LOD levels              │  │
│  └───────────────┬───────────────────┘  │
│                  │ gRPC/Protobuf        │
└──────────────────┼──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│         MOBILE APP (Device)             │
│  ┌───────────────────────────────────┐  │
│  │  React Native UI Layer            │  │
│  │  - Project browser                │  │
│  │  - 3D viewport controls           │  │
│  │  - AR mode toggle                 │  │
│  │  - Measurement tools              │  │
│  └───────────────┬───────────────────┘  │
│                  │ Bridge               │
│  ┌───────────────▼───────────────────┐  │
│  │  Rust Core (avx-mobile-core)     │  │
│  │  - Geometry loading               │  │
│  │  - Mesh management                │  │
│  │  - Spatial indexing               │  │
│  │  - Frustum culling                │  │
│  └───────────────┬───────────────────┘  │
│                  │ FFI                  │
│  ┌───────────────▼───────────────────┐  │
│  │  Renderer Native (Metal/Vulkan)  │  │
│  │  - PBR shading                    │  │
│  │  - Shadow mapping                 │  │
│  │  - AR compositing                 │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## FASE 1: SETUP INICIAL

### 1.1 Criar Projeto React Native

```bash
# Instalar CLI
npm install -g react-native-cli

# Criar projeto
npx react-native@latest init VizzioBIM
cd VizzioBIM

# Estrutura
mkdir -p src/{components,screens,services,utils}
mkdir -p rust-mobile
```

### 1.2 Configurar Tauri Mobile

```bash
# Adicionar Tauri mobile plugin
npm install @tauri-apps/api
npm install -D @tauri-apps/cli

# Criar rust workspace mobile
cd rust-mobile
cargo init --lib
```

**rust-mobile/Cargo.toml**:

```toml
[package]
name = "avx-mobile-core"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["staticlib", "cdylib"]

[dependencies]
# Deps internas (subset do backend)
avx-geometry = { path = "../../backend/avx-geometry" }
avx-linalg = { path = "../../backend/avx-linalg" }
avx-spatial = { path = "../../backend/avx-spatial" }
avx-primitives = { path = "../../backend/avx-primitives" }

# Mobile essentials
tauri = { version = "2.0", features = ["mobile"] }

[target.'cfg(target_os = "ios")'.dependencies]
metal = "0.27"
core-graphics = "0.23"

[target.'cfg(target_os = "android")'.dependencies]
ndk = "0.8"
ndk-glue = "0.8"
```

### 1.3 Bridge React Native ↔ Rust

```typescript
// src/services/RustBridge.ts
import { invoke } from '@tauri-apps/api/core';

export class RustBridge {
  static async loadModel(url: string): Promise<string> {
    return invoke('load_ifc_model', { url });
  }

  static async getMeshData(entityId: string): Promise<Float32Array> {
    const buffer = await invoke('get_mesh_data', { entityId });
    return new Float32Array(buffer);
  }

  static async performRaycast(
    origin: [number, number, number],
    direction: [number, number, number]
  ): Promise<{ hit: boolean; point?: [number, number, number] }> {
    return invoke('raycast', { origin, direction });
  }
}
```

**rust-mobile/src/lib.rs**:

```rust
use tauri::command;
use avx_geometry::mesh::TriangleMesh;
use avx_spatial::rtree::RTree;

#[command]
async fn load_ifc_model(url: String) -> Result<String, String> {
    // Download pre-processed model from backend
    // Parse and load into memory
    Ok("model_id_12345".to_string())
}

#[command]
async fn get_mesh_data(entity_id: String) -> Result<Vec<f32>, String> {
    // Retrieve mesh data for entity
    // Return as flat float array for JS
    Ok(vec![/* vertex data */])
}

#[command]
async fn raycast(
    origin: [f64; 3],
    direction: [f64; 3]
) -> Result<serde_json::Value, String> {
    // Perform raycast against spatial index
    Ok(serde_json::json!({
        "hit": true,
        "point": [1.0, 2.0, 3.0]
    }))
}
```

---

## FASE 2: RENDERIZAÇÃO 3D

### 2.1 iOS - Metal Renderer

```bash
cd ios
pod install  # ARKit + MetalKit
```

**ios/Renderer/MetalRenderer.swift**:

```swift
import Metal
import MetalKit
import ARKit

class VizzioRenderer: NSObject, MTKViewDelegate {
    let device: MTLDevice
    let commandQueue: MTLCommandQueue
    var pipelineState: MTLRenderPipelineState!

    func loadMesh(vertices: [Float]) {
        // Create Metal buffers from Rust data
    }

    func draw(in view: MTKView) {
        // Render loop
        // - Update camera from ARFrame
        // - Frustum culling
        // - Draw meshes
        // - Composite AR
    }
}
```

### 2.2 Android - Vulkan Renderer

```kotlin
// android/app/src/main/kotlin/VizzioRenderer.kt
import android.view.Surface
import org.lwjgl.vulkan.*

class VizzioRenderer(private val surface: Surface) {
    private lateinit var instance: VkInstance
    private lateinit var device: VkDevice

    fun loadMesh(vertices: FloatArray) {
        // Create Vulkan buffers from Rust data
    }

    fun render() {
        // Vulkan render loop
        // - ARCore camera matrix
        // - Submit command buffers
    }
}
```

---

## FASE 3: AR INTEGRATION

### 3.1 ARKit (iOS)

```swift
// ios/AR/ARViewController.swift
import ARKit

class VizzioARView: UIViewController, ARSessionDelegate {
    var arSession: ARSession!
    var renderer: VizzioRenderer!

    override func viewDidLoad() {
        super.viewDidLoad()

        arSession = ARSession()
        arSession.delegate = self

        let config = ARWorldTrackingConfiguration()
        config.planeDetection = [.horizontal, .vertical]
        arSession.run(config)
    }

    func session(_ session: ARSession, didUpdate frame: ARFrame) {
        // Update renderer with AR frame
        renderer.updateCamera(frame.camera.transform)
        renderer.render()
    }
}
```

### 3.2 ARCore (Android)

```kotlin
// android/app/src/main/kotlin/ARActivity.kt
import com.google.ar.core.*

class VizzioARActivity : AppCompatActivity() {
    private lateinit var session: Session
    private lateinit var renderer: VizzioRenderer

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        session = Session(this)
        val config = Config(session).apply {
            planeFindingMode = Config.PlaneFindingMode.HORIZONTAL_AND_VERTICAL
        }
        session.configure(config)
    }

    fun onDrawFrame() {
        val frame = session.update()
        renderer.updateCamera(frame.camera.displayOrientedPose)
        renderer.render()
    }
}
```

---

## FASE 4: COMUNICAÇÃO BACKEND

### 4.1 gRPC Client

```bash
npm install @grpc/grpc-js @grpc/proto-loader
```

**src/services/BackendClient.ts**:

```typescript
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

export class BackendClient {
  private client: any;

  constructor() {
    const packageDefinition = protoLoader.loadSync('vizzio.proto');
    const proto = grpc.loadPackageDefinition(packageDefinition);

    this.client = new proto.VizzioService(
      'backend.railway.app:443',
      grpc.credentials.createSsl()
    );
  }

  async uploadIFC(file: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = this.client.UploadIFC();

      stream.on('data', (response) => {
        resolve(response.modelId);
      });

      stream.on('error', reject);

      // Stream file chunks
      const chunkSize = 1024 * 64; // 64KB
      // ... stream implementation
    });
  }

  async getProcessedGeometry(modelId: string): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      this.client.GetGeometry({ modelId }, (err, response) => {
        if (err) reject(err);
        else resolve(response.data);
      });
    });
  }
}
```

---

## FASE 5: BUILD & DEPLOY

### 5.1 Build iOS

```bash
# Compilar Rust para iOS
cd rust-mobile
cargo build --release --target aarch64-apple-ios
cargo build --release --target x86_64-apple-ios  # Simulator

# Copiar libs
cp target/aarch64-apple-ios/release/libavx_mobile_core.a ../ios/
cp target/x86_64-apple-ios/release/libavx_mobile_core.a ../ios/

# Build React Native
cd ..
npx react-native run-ios --configuration Release
```

**Xcode Configuration**:

- Add `libavx_mobile_core.a` to Link Binary With Libraries
- Set `Other Linker Flags`: `-lc++ -lresolv`
- Enable ARKit capability
- Set deployment target: iOS 14.0+

### 5.2 Build Android

```bash
# Compilar Rust para Android
cd rust-mobile
cargo install cargo-ndk
cargo ndk -t arm64-v8a -t armeabi-v7a -o ../android/app/src/main/jniLibs build --release

# Build React Native
cd ..
cd android
./gradlew assembleRelease
```

**android/app/build.gradle**:

```groovy
android {
    defaultConfig {
        ndk {
            abiFilters 'arm64-v8a', 'armeabi-v7a'
        }
    }

    packagingOptions {
        pickFirst 'lib/arm64-v8a/libavx_mobile_core.so'
        pickFirst 'lib/armeabi-v7a/libavx_mobile_core.so'
    }
}
```

### 5.3 TestFlight (iOS)

```bash
# Archive no Xcode
# Product → Archive
# Upload to App Store Connect
# TestFlight → Add Internal Testers
```

### 5.4 Google Play Internal Testing

```bash
cd android
./gradlew bundleRelease

# Upload .aab to Play Console
# Release → Testing → Internal testing
# Create release
```

---

## ESTRUTURA FINAL

```
VizzioBIM/
├── package.json
├── tsconfig.json
├── metro.config.js
├── src/
│   ├── components/
│   │   ├── ModelViewer.tsx
│   │   ├── ARView.tsx
│   │   └── MeasurementTools.tsx
│   ├── screens/
│   │   ├── ProjectBrowser.tsx
│   │   ├── ModelView3D.tsx
│   │   └── ARMode.tsx
│   ├── services/
│   │   ├── RustBridge.ts
│   │   ├── BackendClient.ts
│   │   └── CacheManager.ts
│   └── utils/
│       ├── geometryUtils.ts
│       └── arUtils.ts
├── rust-mobile/
│   ├── Cargo.toml
│   └── src/
│       ├── lib.rs
│       ├── geometry.rs
│       ├── renderer.rs
│       └── spatial.rs
├── ios/
│   ├── Podfile
│   ├── VizzioBIM/
│   │   ├── AppDelegate.mm
│   │   └── Info.plist
│   └── Renderer/
│       ├── MetalRenderer.swift
│       └── ARViewController.swift
└── android/
    ├── app/
    │   ├── build.gradle
    │   └── src/main/
    │       ├── kotlin/
    │       │   ├── MainActivity.kt
    │       │   ├── VizzioRenderer.kt
    │       │   └── ARActivity.kt
    │       └── jniLibs/
    └── gradle.properties
```

---

## COMANDOS RÁPIDOS

```bash
# Setup
npm install
cd rust-mobile && cargo build
cd ios && pod install

# Desenvolvimento
npm run android  # Android emulator
npm run ios      # iOS simulator

# Build Release
npm run build:android
npm run build:ios

# Deploy
npm run deploy:testflight
npm run deploy:playstore
```

---

## PRÓXIMOS PASSOS

1. ✅ Criar projeto React Native
2. ✅ Configurar Rust mobile workspace
3. ✅ Implementar bridge RN ↔ Rust
4. ✅ Renderer Metal (iOS) / Vulkan (Android)
5. ✅ Integração ARKit / ARCore
6. ✅ gRPC client para backend
7. ✅ Build pipelines iOS/Android
8. 🔄 TestFlight / Internal Testing
9. 🔄 App Store / Play Store submission
