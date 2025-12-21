# Contributing to Vizzio IFC Viewer

First off, thank you for considering contributing to Vizzio! 🎉

## 🌟 How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check the existing issues. When creating a bug report, include as many details as possible:

**Bug Report Template**:
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. Windows 11]
 - .NET Version: [e.g. 10.0]
 - Vizzio Version: [e.g. 3.0.0]
 - GPU: [e.g. NVIDIA RTX 3060]

**Additional context**
Any other context about the problem.
```

### Suggesting Enhancements ✨

Enhancement suggestions are welcome! Please provide:

- **Clear description** of the enhancement
- **Use case** - why is this needed?
- **Examples** from other software (if applicable)
- **Mockups** or diagrams (if visual changes)

### Pull Requests 🔀

1. **Fork** the repository
2. **Create a branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Test thoroughly**
5. **Commit** (`git commit -m 'Add amazing feature'`)
6. **Push** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

## 📝 Development Guidelines

### Code Style

- Follow **C# naming conventions**
- Use **meaningful variable names**
- Add **XML documentation** for public APIs
- Keep methods **focused and small**
- Use **async/await** for I/O operations

**Example**:
```csharp
/// <summary>
/// Loads an IFC file asynchronously.
/// </summary>
/// <param name="filePath">Path to the IFC file</param>
/// <returns>Parsed IFC model or null if failed</returns>
public async Task<IfcModel?> LoadIfcFileAsync(string filePath)
{
    // Implementation
}
```

### Project Structure

```
Vizzio/
├── AI/              # AI Assistant components
├── Application/     # Main application
├── Interaction/     # User interaction
├── Models/          # Data models
├── Rendering/       # 3D rendering
├── Services/        # Business logic
├── Tools/           # Utility tools
├── UI/              # User interface
└── VR/              # VR/AR support
```

### Testing

- Add **unit tests** for new features
- Ensure **existing tests pass**
- Test on **multiple platforms** if possible
- Include **performance tests** for critical paths

### Documentation

- Update **README.md** if adding major features
- Add to **CHANGELOG.md** following format
- Create/update **docs/** for complex features
- Add **code comments** for non-obvious logic

## 🎯 Areas Needing Help

### High Priority
- [ ] Real OpenXR controller integration
- [ ] Complete IFC geometry tessellation
- [ ] Performance optimization for large models
- [ ] Cross-platform testing (Linux, macOS)

### Medium Priority
- [ ] UI/UX improvements
- [ ] Additional measurement tools
- [ ] Section cuts and clipping planes
- [ ] Export functionality (screenshots, models)

### Nice to Have
- [ ] Multiplayer VR features
- [ ] Cloud storage integration
- [ ] Mobile VR support
- [ ] Advanced lighting (SSAO, shadows)
- [ ] Localization (i18n)

## 🔧 Development Setup

### Prerequisites
```bash
# Required
- .NET 10 SDK
- Git
- Visual Studio 2022 or VS Code

# Optional
- Ollama (for AI features)
- VR Headset (for VR testing)
```

### Setup Steps
```bash
# Clone repository
git clone https://github.com/avilaops/vizzio2.git
cd vizzio2

# Restore packages
dotnet restore

# Build
dotnet build

# Run
dotnet run
```

### Environment Setup
```bash
# Copy .env.example to .env
cp .env.example .env

# Configure if using AI
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b
```

## 📐 Architecture Overview

### Key Components

**Rendering Pipeline**:
```
IfcParser → IfcModel → Renderer3D → OpenGL
```

**User Input**:
```
Input → SelectionManager → UIManager → Renderer
```

**VR System**:
```
OpenXRManager → VRManager → VRNavigation → Camera
```

### Design Patterns

- **MVC**: Separation of concerns
- **Observer**: Event-driven updates
- **Singleton**: Managers (VRManager, etc.)
- **Factory**: Geometry creation
- **Strategy**: Different camera modes

## 🧪 Testing Guidelines

### Manual Testing Checklist
- [ ] Load small IFC file (<100 elements)
- [ ] Load large IFC file (>1000 elements)
- [ ] Test all camera presets
- [ ] Test VR mode (if hardware available)
- [ ] Test UI panels
- [ ] Test selection
- [ ] Test measurements
- [ ] Test tutorial
- [ ] Check performance (FPS)

### Automated Testing
```bash
# Run tests
dotnet test

# With coverage
dotnet test /p:CollectCoverage=true
```

## 📊 Performance Guidelines

### Targets
- **Desktop**: 60+ FPS
- **VR**: 90 FPS minimum
- **Large Models**: 30+ FPS acceptable

### Best Practices
- Use **VBO/EBO** for static geometry
- Implement **LOD** for complex models
- **Batch rendering** when possible
- **Culling** for off-screen objects
- Profile with **dotnet-trace**

## 🎨 UI/UX Guidelines

### Principles
- **Intuitive**: Easy to learn
- **Consistent**: Follow patterns
- **Responsive**: Immediate feedback
- **Accessible**: Clear visual hierarchy

### Colors
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)
- Info: Cyan (#06B6D4)

## 📝 Commit Message Format

Use conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Example**:
```bash
feat(vr): add teleportation system

Implemented physics-based teleport arc with validation.
Includes visual feedback and smooth animation.

Closes #42
```

## 🔍 Code Review Process

### For Reviewers
- Check code quality and style
- Verify tests are included
- Ensure documentation is updated
- Test the feature locally
- Be constructive and respectful

### For Contributors
- Respond to feedback promptly
- Make requested changes
- Keep PR scope focused
- Be open to suggestions

## 🎓 Learning Resources

### C# and .NET
- [C# Documentation](https://docs.microsoft.com/en-us/dotnet/csharp/)
- [.NET 10 What's New](https://docs.microsoft.com/en-us/dotnet/core/whats-new/dotnet-10)

### OpenGL
- [LearnOpenGL](https://learnopengl.com/)
- [OpenGL Tutorial](http://www.opengl-tutorial.org/)

### IFC
- [buildingSMART](https://www.buildingsmart.org/)
- [IFC Specifications](https://technical.buildingsmart.org/standards/ifc/)

### VR/AR
- [OpenXR](https://www.khronos.org/openxr/)
- [VR Best Practices](https://developer.oculus.com/resources/publish-mobile-best-practices/)

## 🌍 Community

### Communication
- **GitHub Issues**: Bug reports and features
- **GitHub Discussions**: General questions
- **Pull Requests**: Code contributions

### Code of Conduct
- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- No harassment or discrimination

## 🏆 Recognition

Contributors are recognized in:
- README.md Contributors section
- Release notes
- GitHub contributors page

## 📧 Questions?

If you have questions, please:
1. Check existing [documentation](docs/)
2. Search [closed issues](https://github.com/avilaops/vizzio2/issues?q=is%3Aissue+is%3Aclosed)
3. Open a [new issue](https://github.com/avilaops/vizzio2/issues/new)

---

**Thank you for contributing to Vizzio!** 🙏

Every contribution, no matter how small, makes a difference.

**Developed with ❤️ by the Vizzio community**
