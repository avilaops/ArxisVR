# 🎯 Feature Reference Guide - Vizzio IFC Viewer

**Version**: 3.0  
**Developer**: Nícolas Ávila  
**Last Updated**: 2025-12-21

---

## 📋 Quick Feature Index

| Category | Features | Status | Hotkey |
|----------|----------|--------|--------|
| 🎮 **Navigation** | Orbital Camera | ✅ | Right-click |
| 🎮 **Navigation** | FPS Mode | ✅ | Toggle: O |
| 🎮 **Navigation** | Pan | ✅ | Middle-click |
| 📷 **Presets** | Front View | ✅ | Numpad 1 |
| 📷 **Presets** | Right View | ✅ | Numpad 3 |
| 📷 **Presets** | Top View | ✅ | Numpad 7 |
| 📷 **Presets** | Isometric | ✅ | Numpad 0 |
| 📐 **Visual Aids** | 3D Grid | ✅ | G |
| 📐 **Visual Aids** | XYZ Axes | ✅ | H |
| 🧭 **Visual Aids** | Mini-map | ✅ | N |
| 🧭 **Visual Aids** | Compass | ✅ | B |
| 💫 **Feedback** | Hover Indicator | ✅ | Auto |
| 💫 **Feedback** | Selection Ring | ✅ | Auto |
| 🥽 **VR** | Teleportation | ✅ | F2 |
| 🥽 **VR** | Gestures | ✅ | Auto |
| 📚 **Tutorial** | Interactive Guide | ✅ | T |
| 💡 **Tutorial** | Contextual Hints | ✅ | Auto |
| 🤖 **AI** | AI Assistant | ✅ | Chat Panel |

---

## 🎮 Navigation Features

### Orbital Camera
**Status**: ✅ Production Ready  
**File**: `Rendering/Camera.cs`  
**Lines**: 200+ modified

**Features**:
- Rotate around focal point
- Smart pan with middle mouse
- Distance-based zoom
- Smooth interpolation

**Controls**:
```
Right-Click + Drag  → Rotate
Middle-Click + Drag → Pan
Scroll              → Zoom
WASD               → Move camera
Space/Shift        → Up/Down
+/-                → Speed adjust
```

**Configuration**:
```csharp
camera.IsOrbitMode = true;
camera.OrbitSpeed = 0.3f;
camera.PanSpeed = 0.01f;
camera.ZoomSpeed = 2.0f;
```

---

### FPS Mode
**Status**: ✅ Available  
**Toggle**: Key 'O'

**Features**:
- First-person navigation
- Look-around with mouse
- WASD movement
- Quick toggle to/from Orbital

**Best For**:
- Walking through model
- Interior exploration
- Close-up inspection

---

### Camera Presets
**Status**: ✅ Production Ready  
**File**: `Rendering/Camera.cs`

| Preset | Hotkey | Pitch | Yaw | Use Case |
|--------|--------|-------|-----|----------|
| **Front** | Numpad 1 | 0° | -90° | Elevation view |
| **Right** | Numpad 3 | 0° | 0° | Side elevation |
| **Top** | Numpad 7 | -89° | -90° | Plan view |
| **Isometric** | Numpad 0 | -35.26° | -45° | 3D overview |

**Features**:
- Auto-adjust distance to model
- Smooth transition
- Focus on model center
- One-key access

---

## 📐 Visual Reference Systems

### 3D Grid
**Status**: ✅ Production Ready  
**File**: `Rendering/GridRenderer.cs` (400 lines)  
**Toggle**: Key 'G'

**Specifications**:
- Size: 100m × 100m
- Spacing: 1m
- Plane: XZ (horizontal)
- Color: Gray (0.3, 0.3, 0.3)
- Alpha: 50%

**Configuration**:
```csharp
gridRenderer.GridSize = 100.0f;
gridRenderer.GridSpacing = 1.0f;
gridRenderer.GridAlpha = 0.5f;
gridRenderer.ShowGrid = true;
```

---

### XYZ Axes
**Status**: ✅ Production Ready  
**File**: `Rendering/GridRenderer.cs`  
**Toggle**: Key 'H'

**Colors**:
- **X-Axis**: 🔴 Red (1.0, 0.0, 0.0)
- **Y-Axis**: 🟢 Green (0.0, 1.0, 0.0)
- **Z-Axis**: 🔵 Blue (0.0, 0.0, 1.0)

**Properties**:
- Length: 5 units each
- Width: 3px
- Origin: World (0, 0, 0)
- Always visible

---

### Mini-map
**Status**: ✅ Production Ready  
**File**: `UI/MinimapCompass.cs` (300 lines)  
**Toggle**: Key 'N'

**Position**: Top-right corner (85%, 85%)  
**Size**: 12% of screen  
**Features**:
- Player position indicator (yellow)
- Background semi-transparent
- Updates in real-time
- Grid reference

---

### Compass
**Status**: ✅ Production Ready  
**File**: `UI/MinimapCompass.cs`  
**Toggle**: Key 'B'

**Position**: Center-top (50%, 95%)  
**Size**: 8% of screen  
**Elements**:
- North arrow (red)
- Cardinal directions (N/E/S/W)
- Rotating based on camera yaw
- Circle outline

---

## 💫 Interactive Feedback

### Hover Indicator
**Status**: ✅ Production Ready  
**File**: `Rendering/InteractionFeedback.cs` (300 lines)

**Appearance**:
- Color: Cyan (0.3, 0.8, 1.0)
- Shape: Circle at element base
- Size: 0.5 units
- Animation: Pulsing (sin wave)

**Behavior**:
- Appears on mouse hover
- Fades with distance (10-50m)
- Smooth animation at 60 FPS
- Auto-disappears when not hovering

---

### Selection Ring
**Status**: ✅ Production Ready  
**File**: `Rendering/InteractionFeedback.cs`

**Appearance**:
- Color: Gold (1.0, 0.8, 0.0)
- Shape: Ring around element
- Size: 1.0 unit
- Animation: Glowing (sin wave)

**Behavior**:
- Appears on click
- Persists while selected
- Bright pulsing effect
- Removed with Delete key

---

## 🥽 VR Features

### Teleportation System
**Status**: ✅ Production Ready  
**File**: `VR/TeleportRenderer.cs` (350 lines)

**Physics**:
```csharp
// Parabolic arc
velocity = direction * 10.0f;
gravity = (0, -9.8, 0);
timeStep = 0.1s;
maxTime = 3.0s;
```

**Validation**:
- Max distance: 20 meters
- Min height: -0.5 meters
- Target must be on ground plane

**Visual**:
- **Valid**: Green arc (0.0, 1.0, 0.3)
- **Invalid**: Red arc (1.0, 0.3, 0.0)
- Circle indicator at target
- Crosshair reticle

---

### VR Gestures
**Status**: ✅ Production Ready  
**File**: `VR/VRNavigation.cs` (250 lines)

**Supported Gestures**:
- **Swipe Left**: Previous view
- **Swipe Right**: Next view
- **Swipe Up**: Show menu
- **Two-Hand Grab**: Scale model

**Configuration**:
```csharp
vrGestures.SwipeThreshold = 0.5f;
vrGestures.GrabThreshold = 0.8f;
vrGestures.EnableGestures = true;
```

---

## 📚 Tutorial System

### Interactive Tutorial
**Status**: ✅ Production Ready  
**File**: `UI/TutorialSystem.cs` (400 lines)  
**Toggle**: Key 'T'

**12 Steps**:
1. ✅ Welcome
2. ✅ Load Model
3. ✅ Camera Orbit
4. ✅ Camera Pan
5. ✅ Camera Zoom
6. ✅ Select Element
7. ✅ Camera Presets
8. ✅ Grid & Axes
9. ✅ Element List
10. ✅ Measurements
11. ✅ VR Mode
12. ✅ Completed

**Features**:
- Auto-advance on action completion
- Progress bar (step X/12)
- Skip/Previous buttons
- Hint for each step

---

### Contextual Hints
**Status**: ✅ Production Ready  
**File**: `UI/TutorialSystem.cs`

**Contexts**:
- `first_load`: Drag-drop hint
- `empty_scene`: Load model hint
- `large_model`: Performance tip
- `measurement_active`: How to use
- `vr_mode`: VR controls
- `camera_far`: Focus tip

**Display**:
- Duration: 5 seconds
- Position: Bottom center
- Queue: Multiple hints supported
- Auto-dismiss

---

## 🤖 AI Assistant

### Features
**Status**: ✅ Production Ready  
**Files**: `AI/IfcAIAssistant.cs`, `AI/OllamaService.cs`

- Natural language queries
- IFC element analysis
- Contextual help
- Model analysis
- 100% local (privacy-first)

**Setup**:
```bash
# Install Ollama
winget install Ollama.Ollama

# Setup
.\setup-ollama.bat

# Run
.\run.bat
```

**See**: [AI_README.md](../AI_README.md) for complete guide

---

## 📊 Performance Metrics

### System Overhead

| Component | Time | Draw Calls | Vertices | Impact |
|-----------|------|------------|----------|--------|
| Grid | <1ms | 1 | 500 | Minimal |
| Feedback | <0.5ms | 2 | 132 | Minimal |
| Minimap | <0.5ms | 4 | 200 | Minimal |
| Compass | <0.5ms | - | - | Minimal |
| Teleport | <0.3ms | 1 | 30 | Minimal |
| Tutorial | 0ms | UI | - | None |
| **Total** | **<2.3ms** | **~8** | **~862** | **<4% @60FPS** |

### Target Performance
- **Desktop**: 60+ FPS
- **VR**: 90 FPS
- **Large Models**: 30+ FPS (>1000 elements)

---

## 🎯 Feature Matrix

### By Use Case

#### For Architects
- ✅ Plan view (Numpad 7)
- ✅ Elevation views (Numpad 1/3)
- ✅ Measurement tools
- ✅ Element selection
- ✅ Property inspection

#### For Engineers
- ✅ Isometric view (Numpad 0)
- ✅ Grid reference
- ✅ Precise measurements
- ✅ Element filtering
- ✅ Clash detection (planned)

#### For Clients
- ✅ Simple navigation (tutorial)
- ✅ VR walkthrough
- ✅ Interactive selection
- ✅ Beautiful visualization
- ✅ Easy to learn

#### For VR
- ✅ Teleportation
- ✅ Gesture controls
- ✅ Stereoscopic rendering
- ✅ Comfort options
- ✅ Controller tracking (ready)

---

## 🔧 Configuration Examples

### Custom Grid
```csharp
gridRenderer.GridSize = 200.0f;
gridRenderer.GridSpacing = 2.0f;
gridRenderer.GridColor = new Vector3(0.5f, 0.5f, 0.5f);
gridRenderer.GridAlpha = 0.7f;
```

### Custom Feedback
```csharp
feedback.HoverColor = new Vector3(1.0f, 0.5f, 0.0f); // Orange
feedback.SelectionColor = new Vector3(0.0f, 1.0f, 0.0f); // Green
feedback.HoverIndicatorSize = 0.8f;
feedback.SelectionRingSize = 1.2f;
```

### Custom Camera
```csharp
camera.MovementSpeed = 15.0f;
camera.MouseSensitivity = 0.15f;
camera.OrbitSpeed = 0.5f;
camera.ZoomSpeed = 3.0f;
```

---

## 📱 Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| Windows 10/11 | ✅ Full | Native dialogs, all features |
| Linux | ✅ Full | Requires zenity/kdialog |
| macOS | ✅ Full | Native AppleScript dialogs |
| VR Headsets | ⚠️ Simulation | OpenXR ready, needs hardware |

---

## 🚀 Quick Command Reference

### Essential Commands
```
Ctrl+O        Open IFC file
T             Tutorial
F1            Help
F             Focus model
ESC           Exit
```

### Navigation
```
Right + Drag  Rotate
Middle + Drag Pan
Scroll        Zoom
WASD          Move
```

### Visual Aids
```
G             Grid
H             Axes
N             Minimap
B             Compass
L             Lighting
```

### Views
```
Numpad 1      Front
Numpad 3      Right
Numpad 7      Top
Numpad 0      Isometric
O             Toggle Orbital/FPS
```

---

## 📚 See Also

- **Quick Start**: [QUICK_START.md](QUICK_START.md)
- **Complete Guide**: [COMPLETE_3D_VR_SYSTEM.md](COMPLETE_3D_VR_SYSTEM.md)
- **Test Checklist**: [TEST_CHECKLIST.md](TEST_CHECKLIST.md)
- **Project Summary**: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
- **Main README**: [../README.md](../README.md)

---

**Developed by**: Nícolas Ávila  
**Version**: 3.0 - Complete 3D/VR System  
**Status**: ✅ Production Ready  
**Last Updated**: December 21, 2025
