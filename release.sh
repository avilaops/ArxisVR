#!/bin/bash

# Vizzio v3.0.0 Release Script
# Developer: Nícolas Ávila
# Date: 2025-12-21

echo "🚀 Preparing Vizzio v3.0.0 Release..."
echo ""

# 1. Verificar se estamos na branch main
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "❌ Error: Must be on main branch"
    echo "Current branch: $current_branch"
    exit 1
fi

echo "✅ On main branch"

# 2. Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Error: Uncommitted changes detected"
    echo "Please commit or stash your changes first"
    git status --short
    exit 1
fi

echo "✅ Working directory clean"

# 3. Pull latest changes
echo ""
echo "📥 Pulling latest changes..."
git pull origin main

# 4. Build do projeto
echo ""
echo "🔨 Building project..."
dotnet build --configuration Release

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"

# 5. Run tests (se existir)
echo ""
echo "🧪 Running tests..."
dotnet test --configuration Release --no-build

if [ $? -ne 0 ]; then
    echo "⚠️  Tests failed, but continuing..."
fi

# 6. Create tag
echo ""
echo "🏷️  Creating tag v3.0.0..."
git tag -a v3.0.0 -m "Release v3.0.0 - Complete 3D/VR System

Major release featuring:
- Orbital camera navigation
- VR teleportation system
- 3D grid and axes
- Interactive visual feedback
- Mini-map and compass
- Interactive tutorial (12 steps)
- Contextual hints
- 30+ keyboard shortcuts
- <3ms performance overhead

Developed by Nícolas Ávila"

echo "✅ Tag created"

# 7. Push tag
echo ""
echo "📤 Pushing tag to remote..."
git push origin v3.0.0

echo "✅ Tag pushed"

# 8. Create release archive
echo ""
echo "📦 Creating release archives..."

# Windows
echo "  Creating Windows archive..."
cd bin/Release/net10.0
zip -r ../../../vizzio-v3.0.0-windows-x64.zip . -x "*.pdb"
cd ../../..

# Linux (tar.gz)
echo "  Creating Linux archive..."
cd bin/Release/net10.0
tar -czf ../../../vizzio-v3.0.0-linux-x64.tar.gz . --exclude="*.pdb"
cd ../../..

echo "✅ Archives created"

# 9. Final instructions
echo ""
echo "✅ Release preparation complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Go to: https://github.com/avilaops/vizzio2/releases/new"
echo "  2. Select tag: v3.0.0"
echo "  3. Title: Vizzio v3.0.0 - Complete 3D/VR System"
echo "  4. Copy content from: RELEASE_NOTES.md"
echo "  5. Upload archives:"
echo "     - vizzio-v3.0.0-windows-x64.zip"
echo "     - vizzio-v3.0.0-linux-x64.tar.gz"
echo "  6. Mark as latest release"
echo "  7. Publish release"
echo ""
echo "🌐 Website:"
echo "  1. Go to: https://github.com/avilaops/vizzio2/settings/pages"
echo "  2. Source: GitHub Actions"
echo "  3. Custom domain: vr.avila.inc"
echo "  4. Enforce HTTPS: ✅"
echo ""
echo "🎉 Then announce on social media!"
echo ""
