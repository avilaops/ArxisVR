# 📱 ArxisVR Mobile - iOS & Android

## Aplicativos Mobile com Realidade Aumentada

Este diretório contém a estrutura para aplicativos mobile multiplataforma do ArxisVR com suporte completo para AR (Realidade Aumentada).

## 🎯 Funcionalidades

### iOS (Apple)
- ✅ **ARKit** - Rastreamento de superfícies
- ✅ **LiDAR** - Escaneamento de ambientes (iPhone Pro)
- ✅ **Câmera AR** - Visualização de modelos IFC no mundo real
- ✅ **Gestos** - Pinça, rotação, arrastar
- ✅ **Medições AR** - Medir distâncias no mundo real

### Android
- ✅ **ARCore** - Detecção de planos e rastreamento
- ✅ **Câmera AR** - Sobreposição de modelos 3D
- ✅ **Multi-plataforma** - Android 7.0+
- ✅ **Otimizado** - Funciona em dispositivos médios

## 🏗️ Arquitetura Recomendada

### Opção 1: .NET MAUI (Multiplataforma)
```
✅ Vantagens:
- Código C# compartilhado com desktop
- UI nativa para iOS/Android
- Integração com ARKit/ARCore
- Desenvolvimento mais rápido

📦 Stack:
- .NET MAUI para UI
- SkiaSharp para 2D
- Silk.NET ou OpenGL ES para 3D
- Xamarin.Essentials para AR
```

### Opção 2: Unity (Game Engine)
```
✅ Vantagens:
- AR Foundation (ARKit + ARCore unificado)
- Renderização 3D de alta qualidade
- Asset Store com recursos prontos
- Cross-platform build

📦 Stack:
- Unity 2022 LTS
- AR Foundation
- Universal Render Pipeline (URP)
- C# scripts
```

### Opção 3: Nativo (Máxima Performance)
```
✅ Vantagens:
- Máximo desempenho
- Acesso completo a recursos do sistema
- Melhor integração com ARKit/ARCore

📦 Stack iOS:
- Swift/SwiftUI
- ARKit
- SceneKit/Metal
- RealityKit

📦 Stack Android:
- Kotlin
- ARCore
- Jetpack Compose
- Sceneform
```

## 🚀 Implementação Recomendada: .NET MAUI

Vou criar a estrutura completa para .NET MAUI, pois mantém o código C# e compartilha a lógica com o desktop.

### Estrutura de Diretórios
```
Mobile/
├── README.md (este arquivo)
├── MAUI/
│   ├── ArxisVR.MAUI.csproj
│   ├── MauiProgram.cs
│   ├── App.xaml
│   ├── AppShell.xaml
│   ├── Platforms/
│   │   ├── iOS/
│   │   │   ├── AppDelegate.cs
│   │   │   ├── Info.plist
│   │   │   └── ARKitManager.cs
│   │   └── Android/
│   │       ├── MainActivity.cs
│   │       ├── AndroidManifest.xml
│   │       └── ARCoreManager.cs
│   ├── Services/
│   │   ├── ARService.cs
│   │   ├── IFCLoaderService.cs
│   │   └── CameraService.cs
│   ├── ViewModels/
│   │   ├── ARViewModel.cs
│   │   ├── ModelViewerViewModel.cs
│   │   └── MeasurementViewModel.cs
│   └── Views/
│       ├── ARView.xaml
│       ├── ModelListView.xaml
│       └── MeasurementView.xaml
├── Unity/ (alternativa)
│   └── UnityProject/
└── Native/ (alternativa)
    ├── iOS/
    └── Android/
```

## 📋 Requisitos

### Para iOS
- macOS com Xcode 14+
- iPhone/iPad com iOS 12+ (ARKit 2.0+)
- Certificado de desenvolvedor Apple
- Dispositivo físico (simulador não suporta AR)

### Para Android
- Android Studio
- Dispositivo com ARCore support
- Android 7.0+ (API 24+)
- Google Play Services para AR

## 🔧 Como Começar

### Passo 1: Criar projeto MAUI
```bash
dotnet new maui -n ArxisVR.Mobile
cd ArxisVR.Mobile
```

### Passo 2: Adicionar dependências AR
```bash
# Para iOS
dotnet add package Xamarin.iOS.ARKit

# Para Android
dotnet add package Xamarin.Google.ARCore

# Para ambos (abstração)
dotnet add package Xamarin.Essentials
dotnet add package SkiaSharp.Views.Maui
```

### Passo 3: Compartilhar código do core
```bash
# Referenciar o projeto principal
dotnet add reference ../../ArxisVR.csproj
```

## 💡 Casos de Uso AR

1. **Visualização de Projeto no Local**
   - Carregar arquivo IFC
   - Posicionar modelo no chão
   - Escalar para tamanho real
   - Caminhar ao redor

2. **Medições em AR**
   - Medir paredes reais
   - Comparar com modelo BIM
   - Detectar discrepâncias

3. **Inspeção de Qualidade**
   - Sobrepor modelo 3D na construção real
   - Identificar erros de construção
   - Documentar com fotos AR

4. **Apresentação para Clientes**
   - Mostrar projeto no terreno vazio
   - Visualizar diferentes opções de design
   - Interação em tempo real

## 📱 Próximos Passos

1. ✅ Definir arquitetura (MAUI recomendado)
2. ⏳ Criar projeto MAUI base
3. ⏳ Implementar ARKit para iOS
4. ⏳ Implementar ARCore para Android
5. ⏳ Portar parser IFC para mobile
6. ⏳ Criar UI otimizada para touch
7. ⏳ Implementar gestos AR
8. ⏳ Adicionar medições AR
9. ⏳ Testar em dispositivos reais
10. ⏳ Publicar nas lojas (App Store e Play Store)

## 📞 Suporte

Para questões específicas de mobile/AR, consulte:
- [Documentação MAUI](https://docs.microsoft.com/dotnet/maui/)
- [ARKit Apple](https://developer.apple.com/arkit/)
- [ARCore Google](https://developers.google.com/ar)

---

**Nota**: Esta é a estrutura base. Os arquivos de implementação serão criados nas próximas etapas.
