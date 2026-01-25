# Changelog

All notable changes to ArxisVR will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### 🎯 Roadmap
- BIM 4D: Schedule integration (MS Project, Primavera P6)
- BIM 5D: Cost management system
- Sections & Clipping 3D geometry
- E2E tests with Playwright
- CI/CD with GitHub Actions

---

## [0.2.0] - 2026-01-19

### ✨ Added
- **BIM Module** (`src/bim/`)
  - `inspector/` - IFC property inspection framework
  - `4d/` - Temporal planning interfaces (Task, Schedule)
  - `5d/` - Cost management interfaces (CostItem, Budget)
  - `6d/` - Facilities management interfaces (Asset, Maintenance)
  - Complete documentation in `bim/README.md`

- **Test Infrastructure**
  - Vitest configuration with jsdom environment
  - 11 unit tests (100% passing)
  - Test suite for core, engine, and BIM modules
  - Coverage configuration (v8 provider)
  - Test scripts: `test`, `test:run`, `test:ui`, `test:coverage`
  - `__tests__/README.md` with testing guidelines

- **Barrel Exports**
  - `src/loaders/index.ts` - Loader module exports
  - `src/systems/index.ts` - Systems module exports
  - All modules now properly export through index files

- **Documentation**
  - `ARCHITECTURE.md` - Complete system architecture
  - `CONTRIBUTING.md` - Contribution guidelines
  - `CHANGELOG.md` - This file
  - Enhanced README in `src/__tests__/`
  - Enhanced README in `src/bim/`

### 🔧 Changed
- **Engine Reorganization**
  - Created `src/engine/core/` subdirectory
  - Moved `EngineLoop.ts`, `Engine.ts`, `Time.ts` to `engine/core/`
  - Renamed `engine/runtime-systems/` → `engine/runtime/`
  - Updated all import paths across codebase
  - Added `engine/core/index.ts` barrel export

- **Code Quality**
  - Fixed UTF-8 BOM encoding in 197 TypeScript files
  - Removed syntax error in `UI.ts` (duplicate closing brace)
  - Updated all system imports to use new engine structure
  - Standardized file encoding to UTF-8 without BOM

### 🗑️ Removed
- **Deprecated Code**
  - `src/controls/` - Empty directory
  - `src/utils/` - Empty directory
  - `src/main.ts.backup` - Use Git for version control
  - `src/systems/LODSystem.ts` - Legacy duplicate of `engine/systems/LODSystem.ts`

### 🐛 Fixed
- Build errors due to incorrect import paths
- Missing barrel exports in `engine/ecs/index.ts`
- File creation in wrong directories (path resolution issue)
- All TypeScript compilation errors

### 📊 Metrics
- **Files**: 197 → 206 (+9)
- **Test Coverage**: 0% → ~30% (+30%)
- **Build Time**: ~20s (optimized)
- **Test Suite**: 11/11 passing ✅

---

## [0.1.0] - 2025-12-28

### ✨ Initial Release

- **Core 3D Engine**
  - Three.js integration
  - AVX Render (Rust WASM) support
  - WebXR/VR mode
  - Camera controls (Fly, Orbit, Walk)

- **IFC Support**
  - IFC 2x3, IFC4, IFC4.3 loading
  - web-ifc-three integration
  - Progressive streaming loader
  - Property inspection

- **Performance Systems**
  - LOD (Level of Detail)
  - Frustum culling
  - GPU instancing
  - Batching system
  - Asset streaming (512MB LRU cache)

- **ECS Architecture**
  - Entity-Component-System
  - EntityManager
  - Transform, Mesh, LOD components

- **UI System**
  - TopBar (File, Edit, View, Help)
  - LeftPanel (BIM Info, Inspector, Sections)
  - RightInspector (Properties)
  - BottomDock (Tools)
  - Theme system (6 themes)

- **Tools**
  - Selection tool
  - Navigation tool
  - Measurement tool
  - Layer tool

- **VR Features**
  - WebXR support
  - 6DOF controllers
  - VR UI (menus, panels)
  - In-headset editing

- **Advanced Features**
  - Hot-reload system (dev loop <2s)
  - Project serialization (save/load)
  - Version control (snapshots)
  - Command pattern (undo/redo)
  - Multiplayer (WebSocket + VoIP)
  - AI assistant with chat UI
  - Pathfinding (A*)

---

## Version History

- **0.2.0** - 2026-01-19 - Architecture refactor + BIM + Tests
- **0.1.0** - 2025-12-28 - Initial release

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

Proprietary - See [LICENSE](./LICENSE) for details.

---

**Maintained by**: Nícolas Ávila (nicolas@avila.inc)  
**Repository**: https://github.com/avilaops/ArxisVR
