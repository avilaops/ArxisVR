# Changelog - Vizzio IFC Viewer

## [1.1.0] - 2025-01-XX

### ✨ Added
- **File Open Dialog**: Implementado diálogo nativo de seleção de arquivo
  - Menu **File > Open IFC...** para abrir arquivos
  - Atalho **Ctrl+O** para acesso rápido
  - Suporte cross-platform (Windows, Linux, macOS)
  - Diálogos nativos do sistema operacional
  - Filtro automático para arquivos .ifc

### 🔧 Technical Details
- Novo arquivo `UI/FileDialog.cs` com suporte multi-plataforma
- Windows: Usa PowerShell + System.Windows.Forms
- Linux: Usa zenity ou kdialog
- macOS: Usa osascript
- Evento `OnOpenFileRequested` no UIManager
- Integração completa com IfcViewer

### 📚 Documentation
- Atualizado README.md com novo método de carregamento
- Atualizado GUIA_RAPIDO.md com instruções
- Adicionado Ctrl+O aos atalhos de teclado

---

## [1.0.0] - 2025-01-XX

### 🎉 Initial Release

#### Core Features
- Carregamento e parsing de arquivos IFC (IFC2x3, IFC4, IFC4x3)
- Visualização 3D em tempo real com OpenGL
- Extração completa de propriedades IFC
- Organização automática por tipos de elementos
- Colorização inteligente por categoria

#### User Interface
- Interface gráfica com ImGui
- Painel de lista de elementos com busca e filtros
- Painel de propriedades detalhadas
- Painel de estatísticas do modelo
- Painel de configurações VR/AR
- Menu principal completo

#### Interaction
- Sistema de seleção com ray picking (Möller–Trumbore)
- Click para selecionar elementos
- Hover para highlight
- Navegação FPS-style (WASD + mouse)
- Drag & drop de arquivos IFC

#### VR/AR Support
- Framework OpenXR integrado
- Renderização estereoscópica
- Configurações de IPD
- Modo simulado funcional
- Preparado para hardware real

#### Rendering
- Shaders GLSL modernos
- Sistema de iluminação configurável
- Culling e otimizações
- Camera com controles avançados

#### Documentation
- README.md completo
- GUIA_RAPIDO.md com tutorial
- MELHORIAS.md com detalhes técnicos
- Código documentado com XML comments

### 🏗️ Technical Stack
- .NET 10
- Silk.NET (OpenGL, OpenXR, Input, Windowing)
- ImGui.NET
- Xbim.Essentials
- Xbim.Geometry.Engine.Interop
- System.Numerics

### 📦 Project Structure
```
Vizzio/
├── Models/         - Data structures
├── Services/       - IFC parsing
├── Rendering/      - 3D rendering engine
├── UI/             - ImGui interface
├── Interaction/    - Selection system
├── VR/             - VR/AR integration
└── Application/    - Main app controller
```

### 🎯 Statistics
- 18 arquivos de código
- +3,794 linhas
- 100% build success
- Cross-platform support

---

## Coming Soon

### Planned Features
- [ ] Geometria IFC precisa (tesselação completa)
- [ ] Integração completa com hardware VR
- [ ] Medições 3D
- [ ] Cortes de seção
- [ ] Animações de câmera
- [ ] Clash detection
- [ ] Export de screenshots/vídeos
- [ ] Múltiplos modelos simultâneos
- [ ] Colaboração em tempo real
- [ ] Cloud storage integration

### Improvements
- [ ] Performance otimizations para modelos grandes
- [ ] Level of Detail (LOD) support
- [ ] Materiais e texturas
- [ ] Suporte a transparência
- [ ] Anotações no modelo
- [ ] Histórico Undo/Redo

---

## Notes

### Known Limitations
- Geometria usa placeholders (bounding boxes) ao invés de tesselação completa
- OpenXR em modo placeholder (requer hardware para funcionalidade completa)
- Warning do pacote Xbim.Geometry.Engine.Interop (.NET Framework)

### Platform Support
- ✅ Windows 10/11
- ✅ Linux (com zenity ou kdialog)
- ✅ macOS
- ✅ OpenGL 3.3+

### License
MIT License

### Contributors
- Desenvolvido com ❤️ para a indústria AEC
