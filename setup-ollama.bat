@echo off
echo ===================================
echo VIZZIO - Ollama AI Setup
echo ===================================
echo.

REM Check if Ollama is installed
where ollama >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Ollama not found!
    echo.
    echo Please install Ollama first:
    echo   Option 1: Download from https://ollama.ai/download
    echo   Option 2: Run: winget install Ollama.Ollama
    echo.
    pause
    exit /b 1
)

echo ✅ Ollama is installed!
echo.

REM Check if Ollama is running
echo Checking if Ollama service is running...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo 🚀 Starting Ollama service...
    start "" /B ollama serve
    timeout /t 5 /nobreak >nul
)

echo ✅ Ollama service is running!
echo.

REM Check if recommended model is installed
echo Checking for recommended model (llama3.2:3b)...
ollama list | findstr "llama3.2:3b" >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo 📦 Downloading recommended model (llama3.2:3b - ~2GB)...
    echo This may take a few minutes depending on your internet speed...
    echo.
    ollama pull llama3.2:3b
    if %errorlevel% neq 0 (
        echo.
        echo ❌ Failed to download model!
        pause
        exit /b 1
    )
) else (
    echo ✅ Model already installed!
)

echo.
echo ===================================
echo ✅ Ollama Setup Complete!
echo ===================================
echo.
echo Available commands:
echo   ollama list          - List installed models
echo   ollama pull [model]  - Download a model
echo   ollama rm [model]    - Remove a model
echo   ollama serve         - Start Ollama service
echo.
echo Alternative models to try:
echo   ollama pull phi3:mini          (~2.3GB, fast)
echo   ollama pull llama3:8b          (~4.7GB, more capable)
echo   ollama pull codellama:7b       (~4GB, specialized for code)
echo   ollama pull llama3-uncensored  (~4.7GB, no filters)
echo.
echo Now you can run VIZZIO with AI support!
echo.
pause
