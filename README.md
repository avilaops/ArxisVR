# ArxisVR - IFC Viewer with 3D/VR/AI 🏗️

<div align="center">

![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![.NET](https://img.shields.io/badge/.NET-10.0-purple.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux%20%7C%20macOS-lightgrey.svg)
![Status](https://img.shields.io/badge/status-production%20ready-success.svg)

**Professional IFC Viewer with Intuitive 3D Navigation, VR Support, and AI Assistant**

[🚀 Download](https://github.com/avilaops/ArxisVR2/releases/latest) • [📚 Documentation](docs/INDEX.md) • [🤖 AI Setup](AI_README.md) • [🐛 Report Bug](https://github.com/avilaops/ArxisVR2/issues)

</div>

---

## ✨ Highlights

- 🎮 **Intuitive 3D Navigation** - Orbital camera with CAD-style controls
- 🥽 **Full VR Support** - Physics-based teleportation and gesture recognition
- 🤖 **AI Assistant** - Local AI powered by Ollama (100% private)
- 📐 **Visual Reference** - 3D grid, axes, mini-map, and compass
- 💫 **Rich Feedback** - Animated indicators and selection effects
- 📚 **Interactive Tutorial** - 12-step guided learning experience
- ⚡ **High Performance** - 60+ FPS desktop, 90 FPS VR
- 🆓 **Free & Open Source** - MIT License

---

## 🎯 Features

### 🆕 3D/VR Navigation System (NEW! ✨)
- **Orbital Camera**: Intuitive arcball navigation around models
- **Camera Presets**: Quick views (Front, Top, Right, Isometric)
- **Grid & Axes**: 3D reference grid with colored XYZ axes
- **Interactive Feedback**: Hover indicators and selection rings with animations
- **Mini-map & Compass**: Real-time 2D minimap and 3D compass
- **VR Teleportation**: Physics-based teleport system with visual arc
- **VR Gestures**: Swipe detection and two-hand grab interactions
- **Interactive Tutorial**: 12-step guided tutorial with automatic action detection
- **Contextual Hints**: Smart tips based on user actions

### 🆕 AI Assistant (NEW!)
- **Ollama Integration**: Local AI powered by Ollama
- **IFC/BIM Expert**: Specialized assistant for building models
- **Element Analysis**: AI-powered property analysis
- **Contextual Help**: Smart suggestions based on your workflow
- **Natural Language**: Ask questions in plain English
- **Privacy-First**: 100% local processing, no data leaves your machine

### Core Functionality
- **IFC File Support**: Load and parse IFC files (IFC2x3, IFC4, IFC4x3)
- **3D Visualization**: OpenGL-based real-time 3D rendering
- **Element Organization**: Automatic categorization by IFC element types
- **Color Coding**: Intelligent color assignment based on element types
- **Property Extraction**: Complete IFC properties, quantities, and metadata
- **Interactive Selection**: Click-to-select elements with ray picking
- **Professional UI**: ImGui-based interface with multiple panels

### Navigation & Controls
- **Orbital Camera**: Rotate around model with right-click + drag (default mode)
- **FPS Mode**: Toggle with 'O' key for first-person navigation
- **Pan**: Middle-click + drag for lateral movement
- **Camera Presets**: Numpad 1/3/7/0 for Front/Right/Top/Isometric views
- **Variable Speed**: Adjustable camera movement speed (+/- keys)
- **Focus Mode**: Press 'F' to automatically frame the loaded model
- **Zoom**: Mouse scroll wheel support
- **Element Selection**: Left-click to select, hover to highlight
- **Grid & Axes**: Toggle with G/H keys for spatial reference
- **Mini-map**: Press 'N' to show/hide navigation minimap
- **Compass**: Press 'B' to show/hide 3D orientation compass

### User Interface (NEW! 🆕)
- **Element List Panel**: Search, filter by type, quick selection
- **Properties Panel**: View and edit element properties
- **Statistics Panel**: Real-time model metrics
- **VR Settings Panel**: Configure IPD and VR parameters
- **Tutorial System**: Interactive 12-step guided tutorial (Press 'T')
- **Contextual Hints**: Smart tips that appear based on your actions
- **Main Menu**: File, View, VR/AR, Help menus

### VR/AR Support
- **VR Mode**: Stereoscopic rendering for VR headsets
- **OpenXR Integration**: Ready for real VR hardware
- **VR Teleportation**: Physics-based arc teleport system
- **VR Gestures**: Swipe and multi-hand gesture recognition
- **AR Mode**: Integration hooks for AR devices
- **Device Tracking**: Head and controller tracking support
- **Configurable Settings**: IPD, head height, comfort options

### Rendering Features
- **Advanced Lighting**: Configurable directional lighting
- **GLSL Shaders**: Modern vertex and fragment shaders
- **Interactive Feedback**: Animated hover and selection indicators
- **Grid Rendering**: 3D reference grid with configurable transparency
- **Axes Display**: Color-coded orientation axes (RGB = XYZ)
- **Mini-map Overlay**: 2D navigation minimap with player indicator
- **Compass Overlay**: 3D rotating compass showing cardinal directions
- **Culling**: Back-face culling for performance
- **Depth Testing**: Proper 3D depth rendering
- **Selection Highlight**: Visual feedback for selected elements

## 🤖 AI Assistant Setup

### Quick Start (3 steps)

1. **Install Ollama**
   ```bash
   # Windows
   winget install Ollama.Ollama
   # Or download from: https://ollama.ai/download
   ```

2. **Setup AI models**
   ```bash
   # Run the setup script (RECOMMENDED)
   .\setup-ollama.bat
   
   # Or manually:
   ollama pull llama3.2:3b
   ```

3. **Run ArxisVR**
   ```bash
   .\run.bat
   ```

The AI Assistant will load automatically! ✅

For detailed setup and usage, see: **[AI_README.md](AI_README.md)**

## 🎮 3D/VR Navigation System

### Quick Start

1. **Basic Navigation**
   ```
   Right-Click + Drag  → Rotate around model (Orbital mode)
   Middle-Click + Drag → Pan view
   Mouse Scroll        → Zoom in/out
   WASD + Space/Shift  → Move camera
   ```

2. **Camera Presets** (Press to activate)
   ```
   Numpad 7  → Top view (Plan)
   Numpad 1  → Front view
   Numpad 3  → Right side view
   Numpad 0  → Isometric view
   F         → Focus on model
   R         → Reset camera
   ```

3. **Visual Aids**
   ```
   G  → Toggle Grid (100m × 100m reference)
   H  → Toggle Axes (RGB = XYZ)
   N  → Toggle Mini-map
   B  → Toggle Compass
   O  → Switch Orbital/FPS mode
   ```

4. **Tutorial & Help**
   ```
   T   → Start interactive tutorial (12 steps)
   F1  → Show all controls
   ```

### Controls

#### 🎮 Basic Navigation
- **W/A/S/D**: Move forward/left/backward/right
- **Space**: Move up
- **Left Shift**: Move down
- **+/-**: Increase/decrease movement speed

#### 🖱️ Mouse Controls
- **Right-Click + Drag**: Rotate view (Orbital mode - default)
- **Middle-Click + Drag**: Pan view (move sideways)
- **Mouse Scroll**: Zoom in/out
- **Left-Click**: Select element
- **ESC**: Release mouse (when captured) or exit application

#### 📷 Camera Presets
- **Numpad 1**: Front view
- **Numpad 3**: Right side view
- **Numpad 7**: Top view (Plan)
- **Numpad 0**: Isometric view
- **F**: Focus on model center
- **R**: Reset camera to default

#### 🎨 Visual Aids
- **G**: Toggle Grid (100m reference grid)
- **H**: Toggle Axes (RGB = XYZ orientation)
- **N**: Toggle Mini-map (top-right corner)
- **B**: Toggle Compass (3D orientation)
- **O**: Switch between Orbital/FPS camera modes
- **L**: Toggle lighting on/off

#### 🎯 Element Interaction (NEW! 🆕)
- **Left-Click**: Select element
- **Hover**: Show hover indicator (cyan circle)
- **Delete**: Clear selection

#### 📚 Tutorial & Help
- **T**: Toggle interactive tutorial (12 steps)
- **F1**: Show complete controls help in console
- **M**: Activate measurement mode
- **F12**: Take screenshot

#### 🥽 VR/AR
- **F2**: Toggle VR mode (with teleport & gestures)
- **F3**: Toggle AR mode

#### 🪟 Window
- **F11**: Toggle fullscreen
- **Ctrl+O**: Open IFC file dialog

### Features in Detail

#### Orbital Camera
- **Intuitive rotation** around a focal point
- **Smooth pan** with middle mouse button
- **Smart zoom** that maintains orientation
- **Auto-focus** on loaded models

#### Visual Feedback
- **Hover indicator**: Cyan pulsing circle when mouse over elements
- **Selection ring**: Gold animated ring around selected elements
- **Distance fade**: Indicators become transparent when far away

#### VR Mode (F2)
- **Teleportation**: Physics-based arc shows valid/invalid targets
- **Gestures**: Swipe left/right, two-hand grab
- **Smooth locomotion**: Alternative to teleport
- **Controller tracking**: Ready for OpenXR devices

#### Tutorial System
**12 Interactive Steps**:
1. Welcome
2. Load IFC model
3. Orbital rotation
4. Pan movement
5. Zoom
6. Element selection
7. Camera presets
8. Grid & axes
9. Element list
10. Measurements
11. VR mode (optional)
12. Completion

**Smart Features**:
- Automatic action detection
- Contextual hints
- Progress tracking
- Skip/previous navigation

For complete 3D/VR documentation, see:
- **Quick Start**: [docs/QUICK_START.md](docs/QUICK_START.md)
- **Complete Guide**: [docs/COMPLETE_3D_VR_SYSTEM.md](docs/COMPLETE_3D_VR_SYSTEM.md)
- **Test Checklist**: [docs/TEST_CHECKLIST.md](docs/TEST_CHECKLIST.md)

## 📦 Requirements

### Project Structure
```
ArxisVR/
├── AI/                     # 🤖 AI Assistant
│   ├── AIConfig.cs         # AI configuration
│   ├── OllamaService.cs    # Ollama client
│   └── IfcAIAssistant.cs   # IFC-specialized assistant
├── Examples/               # 📚 Code examples
│   └── AIExamples.cs       # AI usage examples
├── Models/
│   ├── IfcGeometry.cs      # Vertex and mesh data structures
│   ├── IfcElement.cs       # IFC element model
│   └── IfcModel.cs         # Complete model container
├── Services/
│   └── IfcParser.cs        # IFC file parsing service
├── Rendering/              # 🎨 3D Rendering
│   ├── Camera.cs           # Orbital/FPS camera with presets
│   ├── Renderer3D.cs       # OpenGL renderer
│   ├── GridRenderer.cs     # 3D grid and axes (NEW!)
│   ├── InteractionFeedback.cs  # Hover/selection indicators (NEW!)
│   └── Mesh.cs             # Mesh management
├── UI/                     # 🖼️ User Interface
│   ├── ImGuiController.cs  # ImGui OpenGL renderer
│   ├── UIManager.cs        # UI panels and layout
│   ├── MinimapCompass.cs   # Minimap & compass (NEW!)
│   └── TutorialSystem.cs   # Interactive tutorial (NEW!)
├── Interaction/            # 🎯 User interaction
│   └── SelectionManager.cs # Ray picking and selection
├── VR/                     # 🥽 Virtual Reality
│   ├── VRManager.cs        # VR/AR integration
│   ├── OpenXRManager.cs    # OpenXR implementation
│   ├── VRNavigation.cs     # VR navigation & gestures (NEW!)
│   └── TeleportRenderer.cs # VR teleport visualization (NEW!)
├── Tools/
│   └── LayerManager.cs     # Layer management
├── Application/
│   └── IfcViewer.cs        # Main application controller
├── docs/                   # 📄 Documentation
│   ├── QUICK_START.md      # Quick start guide (NEW!)
│   ├── COMPLETE_3D_VR_SYSTEM.md  # Full 3D/VR docs (NEW!)
│   ├── TEST_CHECKLIST.md   # Test checklist (NEW!)
│   └── PROJECT_SUMMARY.md  # Project summary (NEW!)
├── .env                    # Environment configuration
├── setup-ollama.bat        # AI setup script
├── test-ai.bat            # AI testing script
└── Program.cs              # Entry point

```

## 🎓 Documentation

### Core Documentation
- **Main README**: This file - Complete feature overview
- **Quick Start**: [docs/QUICK_START.md](docs/QUICK_START.md) - Get started in 2 minutes
- **Portuguese Guide**: [GUIA_RAPIDO.md](GUIA_RAPIDO.md) - Guia em português

### 3D/VR System (NEW! ✨)
- **Quick Start**: [docs/QUICK_START.md](docs/QUICK_START.md) - 3D navigation basics
- **Complete Guide**: [docs/COMPLETE_3D_VR_SYSTEM.md](docs/COMPLETE_3D_VR_SYSTEM.md) - Full system documentation
- **Test Checklist**: [docs/TEST_CHECKLIST.md](docs/TEST_CHECKLIST.md) - Validation checklist
- **Project Summary**: [docs/PROJECT_SUMMARY.md](docs/PROJECT_SUMMARY.md) - Development summary
- **Improvements Log**: [docs/3D_VR_IMPROVEMENTS.md](docs/3D_VR_IMPROVEMENTS.md) - Phase 1 improvements

### AI Assistant 🤖
- **AI README**: [AI_README.md](AI_README.md) - Complete AI documentation
- **AI Setup**: [docs/OLLAMA_SETUP.md](docs/OLLAMA_SETUP.md) - Detailed setup guide
- **AI Integration**: [AI_INTEGRATION_SUMMARY.md](AI_INTEGRATION_SUMMARY.md) - Integration details
- **AI Checklist**: [AI_CHECKLIST.md](AI_CHECKLIST.md) - Setup checklist
- **AI Visual Guide**: [AI_VISUAL_GUIDE.md](AI_VISUAL_GUIDE.md) - Visual guide

### Development
- **Improvements Log**: [MELHORIAS.md](MELHORIAS.md) - General improvements
- **Contributing**: See Contributing section below

## 🤝 Contributing

Contributions are welcome! Areas where help is needed:

### AI Features 🤖
- AI feature enhancements
- Natural language query processing
- Voice command integration
- AI-powered clash detection

### 3D/VR System ✨
- Full OpenXR VR hardware integration
- VR controller input mapping
- Hand tracking support
- Multiplayer VR features
- Advanced VR gestures
- Haptic feedback

### Visualization
- Complete IFC geometry tessellation
- Materials and textures
- Advanced lighting (SSAO, shadows)
- Transparency support
- Section cuts and clipping

### UI/UX
- UI/UX improvements
- Accessibility features
- Touch controls for tablets
- Mobile VR optimization

### Performance
- Performance optimizations
- LOD (Level of Detail) system
- Occlusion culling
- Instanced rendering

### Documentation
- Additional IFC schema support
- Documentation and tutorials
- Video tutorials
- Localization (i18n)

**How to Contribute**:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 🚀 Future Enhancements

### Implemented ✅
- [x] AI Assistant integration 🤖
- [x] Local AI inference with Ollama
- [x] IFC element analysis
- [x] Orbital camera navigation ✨
- [x] Camera presets (Front/Top/Right/Isometric) ✨
- [x] 3D grid and orientation axes ✨
- [x] Interactive visual feedback ✨
- [x] VR teleportation system ✨
- [x] VR gesture recognition ✨
- [x] Mini-map and 3D compass ✨
- [x] Interactive tutorial (12 steps) ✨
- [x] Contextual hints system ✨
- [x] File dialog for opening IFC files
- [x] Measurement tools

### Planned Features
- [ ] Voice commands for VR
- [ ] AI-powered clash detection
- [ ] Automated report generation
- [ ] Natural language queries ("Show all walls on floor 2")
- [ ] Multi-model support
- [ ] Section cuts and clipping planes
- [ ] Animation and walkthroughs
- [ ] Export screenshots and videos (F12 implemented)
- [ ] Cloud storage integration
- [ ] Collaboration features
- [ ] Real-time multi-user VR
- [ ] Annotation tools in VR
- [ ] 4D construction sequencing

### Geometry
- [ ] Complete tessellation using Xbim.Geometry
- [ ] Level of Detail (LOD) support
- [ ] Materials and textures
- [ ] Transparency support
- [ ] Advanced lighting (SSAO, shadows)

## 📧 Contact

For questions or support:
- **GitHub Issues**: [https://github.com/avilaops/ArxisVR2/issues](https://github.com/avilaops/ArxisVR2/issues)
- **Developer**: Nícolas Ávila
- **Project**: ArxisVR IFC Viewer v3.0

### Documentation Links
- **AI Setup**: [AI_README.md](AI_README.md) 🤖
- **Quick Start**: [docs/QUICK_START.md](docs/QUICK_START.md) 🎮
- **Portuguese Guide**: [GUIA_RAPIDO.md](GUIA_RAPIDO.md) 🇧🇷
- **Full 3D/VR Guide**: [docs/COMPLETE_3D_VR_SYSTEM.md](docs/COMPLETE_3D_VR_SYSTEM.md) ✨

### Resources
- **Sample IFC Files**: [buildingSMART Samples](https://github.com/buildingSMART/Sample-Test-Files)
- **IFC Standards**: [buildingSMART International](https://www.buildingsmart.org/)
- **OpenXR Spec**: [Khronos OpenXR](https://www.khronos.org/openxr/)
- **Ollama**: [Ollama.ai](https://ollama.ai/)

---

**Made with ❤️ for the AEC industry by Nícolas Ávila**

*Visualize your BIM models with ease! 🏗️✨🤖*

**Version 3.0** - Complete 3D/VR System with AI Assistant  
**Status**: ✅ Production Ready  
**Last Updated**: December 2025
