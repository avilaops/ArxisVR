# Vizzio - IFC Viewer with 3D Visualization and VR/AR Support

A powerful .NET 10 application for viewing and interacting with IFC (Industry Foundation Classes) files in 3D, with support for Virtual Reality (VR) and Augmented Reality (AR).

## 🎯 Features

### Core Functionality
- **IFC File Support**: Load and parse IFC files (IFC2x3, IFC4, IFC4x3)
- **3D Visualization**: OpenGL-based real-time 3D rendering
- **Element Organization**: Automatic categorization by IFC element types
- **Color Coding**: Intelligent color assignment based on element types
- **Property Extraction**: Complete IFC properties, quantities, and metadata
- **Interactive Selection**: Click-to-select elements with ray picking
- **Professional UI**: ImGui-based interface with multiple panels

### Navigation & Controls
- **FPS-Style Camera**: WASD keyboard movement with mouse look
- **Variable Speed**: Adjustable camera movement speed
- **Focus Mode**: Automatically frame the loaded model
- **Zoom**: Mouse scroll wheel support
- **Element Selection**: Left-click to select, hover to highlight

### User Interface (NEW! 🆕)
- **Element List Panel**: Search, filter by type, quick selection
- **Properties Panel**: View and edit element properties
- **Statistics Panel**: Real-time model metrics
- **VR Settings Panel**: Configure IPD and VR parameters
- **Main Menu**: File, View, VR/AR, Help menus

### VR/AR Support
- **VR Mode**: Stereoscopic rendering for VR headsets
- **OpenXR Integration**: Ready for real VR hardware
- **AR Mode**: Integration hooks for AR devices
- **Device Tracking**: Head and controller tracking support
- **Configurable Settings**: IPD, head height, comfort options

### Rendering Features
- **Advanced Lighting**: Configurable directional lighting
- **GLSL Shaders**: Modern vertex and fragment shaders
- **Culling**: Back-face culling for performance
- **Depth Testing**: Proper 3D depth rendering
- **Selection Highlight**: Visual feedback for selected elements

## 📦 Requirements

- .NET 10 SDK
- Windows, Linux, or macOS
- Graphics card with OpenGL 3.3+ support
- For VR: VR headset with OpenXR support (optional)
- For AR: Compatible AR device (optional)

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/avilaops/vizzio2.git
cd vizzio2
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Build the project:
```bash
dotnet build
```

4. Run the application:
```bash
dotnet run
```

## 📖 Usage

### Loading IFC Files

**Method 1: Drag and Drop** (Recommended)
- Drag an IFC file from your file explorer and drop it onto the viewer window

**Method 2: Menu**
- Use File > Open IFC... (Ctrl+O) - Coming soon

### Controls

#### Camera Movement
- **W/A/S/D**: Move forward/left/backward/right
- **Space**: Move up
- **Left Shift**: Move down
- **+/-**: Increase/decrease movement speed

#### Camera View
- **Right-Click**: Capture mouse for looking around
- **Mouse Movement**: Look around (when captured)
- **Mouse Scroll**: Zoom in/out
- **ESC**: Release mouse (when captured) or exit application

#### Element Interaction (NEW! 🆕)
- **Left-Click**: Select element
- **Hover**: Highlight element
- **Delete**: Clear selection

#### View Options
- **F**: Focus camera on model
- **R**: Reset camera to default position
- **L**: Toggle lighting on/off
- **F11**: Toggle fullscreen

#### VR/AR
- **F2**: Toggle VR mode
- **F3**: Toggle AR mode

#### Help
- **F1**: Show controls help in console

## 🎨 User Interface

### Element List Panel
- Search elements by name or type
- Filter by element type (walls, beams, columns, etc.)
- Quick selection with visual feedback
- Element count per type

### Properties Panel
- Complete IFC properties display
- Organized by property sets
- Color editor
- Visibility toggle
- Geometry information

### Statistics Panel
- Model filename
- Total elements count
- Element types breakdown
- Vertex and triangle counts
- Model center and size

### VR Settings Panel
- IPD (Interpupillary Distance) adjustment
- Head height configuration
- VR device status
- Runtime information

## 🏗️ Architecture

### Project Structure
```
Vizzio/
├── Models/
│   ├── IfcGeometry.cs      # Vertex and mesh data structures
│   ├── IfcElement.cs       # IFC element model
│   └── IfcModel.cs         # Complete model container
├── Services/
│   └── IfcParser.cs        # IFC file parsing service
├── Rendering/
│   ├── Camera.cs           # 3D camera with FPS controls
│   ├── Mesh.cs             # Mesh management
│   └── Renderer3D.cs       # OpenGL renderer
├── UI/                     # NEW! 🆕
│   ├── ImGuiController.cs  # ImGui OpenGL renderer
│   └── UIManager.cs        # UI panels and layout
├── Interaction/            # NEW! 🆕
│   └── SelectionManager.cs # Ray picking and selection
├── VR/
│   ├── VRManager.cs        # VR/AR integration
│   └── OpenXRManager.cs    # OpenXR implementation
├── Application/
│   └── IfcViewer.cs        # Main application controller
└── Program.cs              # Entry point
```

### Key Technologies
- **Xbim.Essentials**: IFC file parsing and metadata extraction
- **Xbim.Geometry.Engine.Interop**: Geometry processing
- **Silk.NET**: Cross-platform OpenGL bindings and windowing
- **Silk.NET.OpenXR**: OpenXR VR integration
- **ImGui.NET**: Immediate mode GUI
- **System.Numerics**: Vector and matrix mathematics

## 📊 Performance

### Optimization Features
- Efficient vertex buffer objects (VBO)
- Index buffer objects (EBO) for shared vertices
- Bounding box culling for ray picking
- Batch rendering of all meshes
- ImGui optimized rendering

### Statistics Display
The viewer displays real-time statistics:
- Total elements loaded
- Element types and counts
- Vertex count
- Triangle count
- Frames per second (FPS)

## 🥽 VR/AR Integration

### Current Status
The application includes:
- **OpenXR Framework**: Ready for VR hardware integration
- **Stereoscopic Rendering**: Separate views for each eye
- **IPD Configuration**: Adjustable interpupillary distance
- **Simulation Mode**: Works without VR hardware for testing

### Supported Platforms
- **OpenXR** - Cross-platform VR/AR standard
- **SteamVR** (via OpenXR)
- **Oculus/Meta Quest** (via OpenXR)
- **Windows Mixed Reality** (via OpenXR)

### Using VR Mode
1. Connect your VR headset
2. Ensure OpenXR runtime is installed (SteamVR, Oculus, etc.)
3. Press **F2** to enable VR mode
4. If no headset is detected, simulation mode activates

## 📝 Sample IFC Files

You can test the viewer with free IFC sample files from:
- [buildingSMART Sample Files](https://github.com/buildingSMART/Sample-Test-Files)
- [IFC Examples Repository](https://www.ifcwiki.org/index.php?title=KIT_IFC_Examples)

## 🐛 Troubleshooting

### OpenGL Errors
- Ensure your graphics drivers are up to date
- Verify OpenGL 3.3+ support

### IFC Loading Issues
- Verify the IFC file is valid
- Check console output for specific error messages
- Try with sample IFC files first

### Performance Issues
- Use type filters to hide unnecessary elements
- Close other GPU-intensive applications
- Check FPS counter in the UI

### UI Not Appearing
- Ensure OpenGL 3.3+ is supported
- Check console for initialization errors
- Verify ImGui.NET dependencies are installed

## 🎓 Documentation

- **Quick Start Guide**: See [GUIA_RAPIDO.md](GUIA_RAPIDO.md)
- **Improvements Log**: See [MELHORIAS.md](MELHORIAS.md)
- **Full README**: This file

## 🚀 Future Enhancements

### Planned Features
- [ ] File dialog for opening IFC files
- [ ] Multi-model support
- [ ] Measurement tools
- [ ] Section cuts and clipping planes
- [ ] Animation and walkthroughs
- [ ] Clash detection
- [ ] Export screenshots and videos
- [ ] Cloud storage integration
- [ ] Collaboration features
- [ ] Full OpenXR hardware integration

### Geometry
- [ ] Complete tessellation using Xbim.Geometry
- [ ] Level of Detail (LOD) support
- [ ] Materials and textures
- [ ] Transparency support

## 🤝 Contributing

Contributions are welcome! Areas where help is needed:
- Full OpenXR VR hardware integration
- Complete IFC geometry tessellation
- UI/UX improvements
- Performance optimizations
- Additional IFC schema support
- Documentation and tutorials

## 📄 License

This project is licensed under the MIT License.

## 🙏 Credits

- **Xbim Toolkit**: For IFC parsing capabilities
- **Silk.NET**: For OpenGL and OpenXR bindings
- **ImGui.NET**: For immediate mode GUI
- **buildingSMART**: For IFC standards

## 📧 Contact

For questions or support:
- **GitHub Issues**: [https://github.com/avilaops/vizzio2/issues](https://github.com/avilaops/vizzio2/issues)
- **Quick Guide**: See GUIA_RAPIDO.md for detailed usage
- **Improvements**: See MELHORIAS.md for technical details

---

**Made with ❤️ for the AEC industry**

*Visualize your BIM models with ease! 🏗️✨*
