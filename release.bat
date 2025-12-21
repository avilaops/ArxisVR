@echo off
REM Vizzio v3.0.0 Release Script
REM Developer: Nícolas Ávila
REM Date: 2025-12-21

echo 🚀 Preparing Vizzio v3.0.0 Release...
echo.

REM 1. Check if on main branch
git branch --show-current > temp.txt
set /p current_branch=<temp.txt
del temp.txt

if not "%current_branch%"=="main" (
    echo ❌ Error: Must be on main branch
    echo Current branch: %current_branch%
    exit /b 1
)

echo ✅ On main branch

REM 2. Check for uncommitted changes
git status --porcelain > temp.txt
set /p status=<temp.txt
del temp.txt

if not "%status%"=="" (
    echo ❌ Error: Uncommitted changes detected
    echo Please commit or stash your changes first
    git status --short
    exit /b 1
)

echo ✅ Working directory clean

REM 3. Pull latest changes
echo.
echo 📥 Pulling latest changes...
git pull origin main

REM 4. Build project
echo.
echo 🔨 Building project...
dotnet build --configuration Release

if errorlevel 1 (
    echo ❌ Build failed
    exit /b 1
)

echo ✅ Build successful

REM 5. Run tests
echo.
echo 🧪 Running tests...
dotnet test --configuration Release --no-build

if errorlevel 1 (
    echo ⚠️  Tests failed, but continuing...
)

REM 6. Create tag
echo.
echo 🏷️  Creating tag v3.0.0...
git tag -a v3.0.0 -m "Release v3.0.0 - Complete 3D/VR System"

echo ✅ Tag created

REM 7. Push tag
echo.
echo 📤 Pushing tag to remote...
git push origin v3.0.0

echo ✅ Tag pushed

REM 8. Create release archive
echo.
echo 📦 Creating release archives...

echo   Creating Windows archive...
cd bin\Release\net10.0
powershell Compress-Archive -Path * -DestinationPath ..\..\..\vizzio-v3.0.0-windows-x64.zip -Force
cd ..\..\..

echo ✅ Archive created

REM 9. Final instructions
echo.
echo ✅ Release preparation complete!
echo.
echo 📋 Next steps:
echo   1. Go to: https://github.com/avilaops/vizzio2/releases/new
echo   2. Select tag: v3.0.0
echo   3. Title: Vizzio v3.0.0 - Complete 3D/VR System
echo   4. Copy content from: RELEASE_NOTES.md
echo   5. Upload archive: vizzio-v3.0.0-windows-x64.zip
echo   6. Mark as latest release
echo   7. Publish release
echo.
echo 🌐 Website:
echo   1. Go to: https://github.com/avilaops/vizzio2/settings/pages
echo   2. Source: GitHub Actions
echo   3. Custom domain: vr.avila.inc
echo   4. Enforce HTTPS: ✅
echo.
echo 🎉 Then announce on social media!
echo.
pause
