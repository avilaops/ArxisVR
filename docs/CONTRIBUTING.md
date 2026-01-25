# Contributing to ArxisVR

Thank you for your interest in contributing to ArxisVR! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Commit Messages](#commit-messages)

---

## 🤝 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Prioritize project goals over personal preferences

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git**
- Basic knowledge of TypeScript, Three.js, and BIM concepts

### First Steps

1. **Fork the repository**
   ```sh
   # Click "Fork" on GitHub
   ```

2. **Clone your fork**
   ```sh
   git clone https://github.com/YOUR_USERNAME/ArxisVR.git
   cd ArxisVR
   ```

3. **Install dependencies**
   ```sh
   npm install
   ```

4. **Create a branch**
   ```sh
   git checkout -b feature/your-feature-name
   ```

---

## 🛠️ Development Setup

### Run Development Server
```sh
npm run dev
```
Open http://localhost:5173

### Build for Production
```sh
npm run build
```

### Run Tests
```sh
npm test              # Watch mode
npm run test:run      # Single run
npm run test:coverage # With coverage
```

### Lint Code
```sh
npm run lint          # Check
npm run lint:fix      # Auto-fix
```

---

## 📁 Project Structure

```
ArxisVR/
├── src/
│   ├── core/          # Foundation (EventBus, AppState)
│   ├── engine/        # 3D engine (ECS, systems, optimization)
│   ├── bim/           # BIM features (4D, 5D, 6D)
│   ├── app/           # Application logic (managers)
│   ├── ui/            # User interface
│   ├── tools/         # Interaction tools
│   ├── loaders/       # Asset loaders
│   ├── vr/            # VR features
│   ├── network/       # Multiplayer
│   ├── ai/            # AI features
│   └── __tests__/     # Tests
├── public/            # Static assets
├── docs/              # Documentation
└── Examples-files/    # Example IFC files
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture.

---

## 💻 Coding Standards

### TypeScript

#### **1. Use Strong Typing**
```typescript
// ✅ Good
interface IFCProperty {
  name: string;
  value: string | number;
  type: PropertyType;
}

// ❌ Bad
interface IFCProperty {
  name: any;
  value: any;
}
```

#### **2. Avoid `any`**
```typescript
// ✅ Good
function processElement(element: IFCElement): void { }

// ❌ Bad
function processElement(element: any): void { }
```

#### **3. Use Enums for Constants**
```typescript
// ✅ Good
enum ToolType {
  SELECTION = 'selection',
  NAVIGATION = 'navigation',
}

// ❌ Bad
const TOOL_SELECTION = 'selection';
```

### Code Style

#### **1. Naming Conventions**
- **Classes**: `PascalCase` (e.g., `SelectionManager`)
- **Interfaces**: `IPascalCase` or `PascalCase` (e.g., `IFCElement`)
- **Functions**: `camelCase` (e.g., `loadModel`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_ENTITIES`)
- **Private fields**: `_camelCase` or `#camelCase` (e.g., `_camera`)

#### **2. File Organization**
```typescript
// 1. Imports (external first, then internal)
import * as THREE from 'three';
import { EventBus } from '../core/EventBus';

// 2. Types & Interfaces
interface Props { }

// 3. Constants
const MAX_SIZE = 100;

// 4. Class/Function
export class MyClass { }
```

#### **3. Comments**
```typescript
/**
 * Load an IFC model from file
 * @param file - IFC file to load
 * @param options - Loading options
 * @returns Promise resolving to loaded model
 */
async function loadIFC(file: File, options?: LoadOptions): Promise<IFCModel> {
  // Implementation
}
```

### Architecture Patterns

#### **1. Dependency Injection**
```typescript
// ✅ Good - Inject dependencies
class SelectionManager {
  constructor(
    private scene: THREE.Scene,
    private camera: THREE.Camera
  ) {}
}

// ❌ Bad - Global dependencies
class SelectionManager {
  constructor() {
    this.scene = window.globalScene;
  }
}
```

#### **2. EventBus for Communication**
```typescript
// ✅ Good
eventBus.emit(EventType.OBJECT_SELECTED, { id: elementId });

// ❌ Bad - Direct coupling
selectionManager.onObjectSelected(elementId);
```

#### **3. Single Responsibility**
```typescript
// ✅ Good - One responsibility per class
class IFCLoader { }
class IFCValidator { }

// ❌ Bad - Multiple responsibilities
class IFCManager {
  load() { }
  validate() { }
  render() { }
}
```

---

## 🧪 Testing

### Test Structure
```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('SelectionManager', () => {
  let manager: SelectionManager;

  beforeEach(() => {
    manager = new SelectionManager(mockScene, mockCamera);
  });

  it('should select object by ID', () => {
    const result = manager.selectById('element-123');
    expect(result).toBe(true);
  });
});
```

### Test Coverage
- **Unit Tests**: All managers, systems, utilities
- **Integration Tests**: Cross-module interactions
- **E2E Tests**: Critical user flows

**Target**: 80%+ coverage

### Running Tests
```sh
# Watch mode (recommended for development)
npm test

# Single run
npm run test:run

# With coverage report
npm run test:coverage
```

---

## 📝 Pull Request Process

### 1. Before Opening PR

- ✅ Tests passing (`npm test`)
- ✅ Build successful (`npm run build`)
- ✅ Linter passing (`npm run lint`)
- ✅ Code formatted
- ✅ Documentation updated (if API changed)

### 2. PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Checklist
- [ ] Tests pass
- [ ] Build succeeds
- [ ] Documentation updated
- [ ] No console errors
```

### 3. Review Process

1. At least **1 approval** required
2. All CI checks must pass
3. No unresolved conversations
4. Squash commits if necessary

---

## 📜 Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructure
- `test`: Tests
- `chore`: Maintenance

### Examples

```sh
# Feature
feat(bim): add BIM 4D schedule viewer

Implemented timeline visualization for construction schedules
with play/pause controls and progress tracking.

Closes #123

# Bug fix
fix(engine): resolve memory leak in LODSystem

Fixed entity disposal not releasing GPU resources.

# Breaking change
feat(engine)!: migrate to ECS architecture

BREAKING CHANGE: Old scene graph API removed.
Migrate to new EntityManager API.
```

---

## 🎯 Areas to Contribute

### 🟢 Good First Issues
- Documentation improvements
- UI polish
- Bug fixes
- Test coverage

### 🟡 Intermediate
- New tools (measurement, annotation)
- Performance optimizations
- UI components

### 🔴 Advanced
- BIM 4D/5D/6D features
- WebXR enhancements
- Multiplayer features
- AI integration

---

## 🐛 Reporting Bugs

Use GitHub Issues with:
1. **Environment**: OS, browser, Node version
2. **Steps to reproduce**
3. **Expected behavior**
4. **Actual behavior**
5. **Screenshots/videos** (if applicable)
6. **IFC file** (if model-specific)

---

## 💡 Requesting Features

Use GitHub Discussions for:
- Feature proposals
- Architecture discussions
- Performance ideas

---

## ❓ Questions

- **Technical questions**: GitHub Discussions
- **Bug reports**: GitHub Issues
- **Security issues**: nicolas@avila.inc (private)

---

## 📚 Resources

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [README.md](./README.md) - Project overview
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Three.js Docs](https://threejs.org/docs/)
- [BuildingSMART IFC](https://www.buildingsmart.org/standards/bsi-standards/industry-foundation-classes/)

---

## 🙏 Thank You!

Every contribution makes ArxisVR better. Thank you for being part of this project! 🚀

---

**Questions?** Open a discussion on GitHub or reach out to nicolas@avila.inc
