# ArxisVR - Implementation Roadmap

**Last Updated**: January 19, 2026  
**Current Version**: v0.2.0  
**Next Release**: v0.3.0 (Target: February 2026)

---

## 🎯 Implementation Status

### ✅ Completed (v0.2.0)
- [x] Core 3D Engine (Three.js + AVX WASM)
- [x] IFC Support (IFC 2x3, IFC4, IFC4.3)
- [x] VR Mode (WebXR)
- [x] Performance Systems (LOD, Culling, Instancing, Batching)
- [x] ECS Architecture (Entity-Component-System)
- [x] Test Infrastructure (Vitest, 11 tests)
- [x] BIM Module Structure (placeholders for 4D/5D/6D)
- [x] Documentation (ARCHITECTURE, CONTRIBUTING, CHANGELOG)
- [x] Engine Reorganization (core/, runtime/)
- [x] Barrel Exports (all modules)

---

## 🚀 Next Sprint (v0.3.0 - Week 1-2)

### Priority 1: Critical Fixes & Improvements

#### 1. **Sections & Clipping - 3D Geometry Implementation**
**Status**: 🔴 Not Started  
**Complexity**: High  
**Time Estimate**: 5-7 days  
**Dependencies**: None

**Tasks**:
- [ ] Create `ClippingGeometry.ts` in `src/engine/geometry/`
- [ ] Implement clipping plane shader
- [ ] Integrate with existing UI (LeftPanel Sections tab)
- [ ] Add visual feedback (section lines, fill)
- [ ] Support multiple clipping planes
- [ ] Performance optimization (GPU-based clipping)
- [ ] Add tests

**Files to Create**:
```
src/engine/geometry/
├── ClippingGeometry.ts
├── SectionPlane.ts
├── ClippingShader.ts
└── index.ts
```

**Acceptance Criteria**:
- [ ] Clipping planes work in all 3 axes (X, Y, Z)
- [ ] Section lines visible and customizable
- [ ] Performance: No FPS drop with multiple planes
- [ ] UI buttons functional

---

#### 2. **IFC Inspector - Migration to BIM Module**
**Status**: 🟡 Partial (UI exists, needs migration)  
**Complexity**: Medium  
**Time Estimate**: 3-4 days  
**Dependencies**: None

**Tasks**:
- [ ] Move IFC Inspector logic from `ui/` to `bim/inspector/`
- [ ] Create `IFCInspector.ts` class
- [ ] Create `PropertyExtractor.ts` (extract IFC properties)
- [ ] Create `PropertyFormatter.ts` (format for display)
- [ ] Update UI to use new BIM module
- [ ] Add property search/filter
- [ ] Add export to CSV/JSON
- [ ] Add tests

**Files to Create/Modify**:
```
src/bim/inspector/
├── IFCInspector.ts        ← NEW
├── PropertyExtractor.ts   ← NEW
├── PropertyFormatter.ts   ← NEW
├── PropertyTypes.ts       ← NEW
└── index.ts               ← UPDATE

src/ui/layout/LeftPanel.ts ← UPDATE (use bim/inspector)
```

**Acceptance Criteria**:
- [ ] All IFC properties displayed correctly
- [ ] Search and filter working
- [ ] Export to CSV/JSON functional
- [ ] Performance: <100ms to load properties

---

#### 3. **Advanced Selection System**
**Status**: 🔴 Not Started  
**Complexity**: Medium  
**Time Estimate**: 3-4 days  
**Dependencies**: IFC Inspector

**Tasks**:
- [ ] Selection by IFC type (all walls, all windows, etc)
- [ ] Selection by property (all elements with X=value)
- [ ] Selection by layer
- [ ] Selection by bounding box
- [ ] Invert selection
- [ ] Save/load selection sets
- [ ] Add tests

**Files to Create**:
```
src/tools/selection/
├── AdvancedSelectionTool.ts
├── SelectionFilters.ts
├── SelectionSets.ts
└── index.ts
```

**Acceptance Criteria**:
- [ ] Can select all elements of a type
- [ ] Can filter by property values
- [ ] Selection sets can be saved
- [ ] Performance: <500ms for 1000 elements

---

## 📅 Upcoming Sprints (v0.4.0 - v0.6.0)

### Sprint 2: BIM 4D Foundation (v0.4.0 - Week 3-4)

#### 4. **BIM 4D - Schedule Data Model**
**Status**: 🔴 Not Started  
**Complexity**: High  
**Time Estimate**: 5-7 days

**Tasks**:
- [ ] Define Task/Schedule TypeScript interfaces (complete)
- [ ] Create `ScheduleManager.ts`
- [ ] Create `TaskLinkResolver.ts` (link tasks ↔ IFC elements)
- [ ] Import MS Project XML
- [ ] Import Primavera P6 XML
- [ ] Import CSV schedules
- [ ] Add tests

**Files to Create**:
```
src/bim/4d/
├── ScheduleManager.ts
├── TaskLinkResolver.ts
├── ScheduleImporter.ts
├── parsers/
│   ├── MSProjectParser.ts
│   ├── PrimaveraParser.ts
│   └── CSVParser.ts
└── __tests__/
    └── schedule.test.ts
```

---

#### 5. **BIM 4D - Timeline Visualization**
**Status**: 🔴 Not Started  
**Complexity**: Medium  
**Time Estimate**: 4-5 days  
**Dependencies**: Schedule Data Model

**Tasks**:
- [ ] Create timeline UI component
- [ ] Implement play/pause/scrub controls
- [ ] Color code elements by task status (planned, in-progress, complete)
- [ ] Show construction progress over time
- [ ] Export timeline to video (optional)
- [ ] Add tests

**Files to Create**:
```
src/ui/bim4d/
├── Timeline.ts
├── TimelineControls.ts
├── ProgressSimulator.ts
└── index.ts
```

---

### Sprint 3: BIM 5D Foundation (v0.5.0 - Week 5-6)

#### 6. **BIM 5D - Quantification Engine**
**Status**: 🔴 Not Started  
**Complexity**: High  
**Time Estimate**: 6-8 days

**Tasks**:
- [ ] Automatic takeoff from IFC geometry
- [ ] Quantity rules engine
- [ ] Manual measurement tools
- [ ] Quantity templates (walls, slabs, etc)
- [ ] Export to Excel/CSV
- [ ] Add tests

---

#### 7. **BIM 5D - Cost Management**
**Status**: 🔴 Not Started  
**Complexity**: High  
**Time Estimate**: 6-8 days

**Tasks**:
- [ ] Price database integration (SINAPI, CYPE)
- [ ] Cost item management
- [ ] Link costs ↔ IFC elements
- [ ] Budget vs actual tracking
- [ ] Cost reports
- [ ] Add tests

---

### Sprint 4: Quality & Infrastructure (v0.6.0 - Week 7-8)

#### 8. **Query Engine for IFC**
**Status**: 🔴 Not Started  
**Complexity**: High  
**Time Estimate**: 5-7 days

**Tasks**:
- [ ] Design query language (SQL-like)
- [ ] Implement query parser
- [ ] Execute queries on IFC data
- [ ] Query builder UI
- [ ] Save/load queries
- [ ] Add tests

---

#### 9. **CI/CD Pipeline**
**Status**: 🔴 Not Started  
**Complexity**: Medium  
**Time Estimate**: 2-3 days

**Tasks**:
- [ ] Create `.github/workflows/ci.yml`
- [ ] Setup automated testing on push
- [ ] Setup build verification
- [ ] Code coverage reporting
- [ ] Automated deployments (Azure/Netlify)

**File to Create**:
```yaml
.github/workflows/
├── ci.yml
├── deploy.yml
└── release.yml
```

---

#### 10. **E2E Testing with Playwright**
**Status**: 🔴 Not Started  
**Complexity**: Medium  
**Time Estimate**: 3-4 days

**Tasks**:
- [ ] Install Playwright
- [ ] Create E2E test suite
- [ ] Test critical user flows:
  - [ ] Load IFC file
  - [ ] Navigate scene
  - [ ] Select objects
  - [ ] Use measurement tools
  - [ ] Export data
- [ ] Visual regression tests
- [ ] Add to CI pipeline

---

## 🔮 Future (v0.7.0+)

### BIM 6D - Facilities Management
- [ ] Asset management
- [ ] Maintenance scheduling
- [ ] Work order system
- [ ] Equipment tracking
- [ ] Integration with building systems

### Advanced Features
- [ ] Explode view by systems
- [ ] Clash detection
- [ ] 4D simulation with constraints
- [ ] Real-time collaboration
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)

---

## 🐛 Known Issues

### High Priority
- None currently

### Medium Priority
- [ ] Line endings (CRLF vs LF) - Git warning on commit
- [ ] Theme system needs more themes
- [ ] Performance: Large models (>10M polygons) slow down

### Low Priority
- [ ] UI polish (animations, transitions)
- [ ] Accessibility (keyboard navigation, screen readers)
- [ ] Internationalization (i18n)

---

## 📊 Technical Debt

1. **TODO Comments** (5 found)
   - `AppController.ts:667` - Get render quality from settings
   - More TODOs to be catalogued

2. **Test Coverage** (Current: ~30%, Target: 80%)
   - Need tests for: managers, tools, loaders, systems

3. **Documentation**
   - Need TSDoc comments in all public APIs
   - Need inline documentation for complex algorithms

---

## 🎯 Success Metrics

### v0.3.0 Goals
- [ ] Sections & Clipping working (3D geometry)
- [ ] IFC Inspector migrated to BIM module
- [ ] Advanced selection implemented
- [ ] Test coverage: 40%+
- [ ] Build time: <25s
- [ ] All tests passing

### v0.4.0 Goals
- [ ] BIM 4D schedule import working
- [ ] Timeline visualization functional
- [ ] Test coverage: 50%+

### v0.5.0 Goals
- [ ] BIM 5D quantification working
- [ ] Cost management functional
- [ ] Test coverage: 60%+

### v0.6.0 Goals
- [ ] Query engine implemented
- [ ] CI/CD pipeline running
- [ ] E2E tests in place
- [ ] Test coverage: 70%+

---

## 🚦 Decision Log

### 2026-01-19
- ✅ Decided to use Vitest over Jest (faster, Vite integration)
- ✅ Decided to reorganize engine into core/, runtime/ structure
- ✅ Decided to create dedicated BIM module (not in UI)
- ✅ Decided on semantic commit messages (Conventional Commits)

---

## 📞 Stakeholder Communication

### Weekly Status Reports
- Post in GitHub Discussions every Friday
- Include: completed tasks, blockers, next week's plan

### Monthly Releases
- Tag release on last day of month
- Update CHANGELOG.md
- Create GitHub Release with notes

---

**Maintained by**: Nícolas Ávila  
**Contact**: nicolas@avila.inc  
**Repository**: https://github.com/avilaops/ArxisVR

---

**Next Review**: January 26, 2026
