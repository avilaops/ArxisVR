@echo off
echo ===================================
echo VIZZIO - AI Test
echo ===================================
echo.

echo Testing Ollama connection...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Ollama is not running!
    echo.
    echo Please start Ollama:
    echo   1. Run: ollama serve
    echo   2. Or run: .\setup-ollama.bat
    echo.
    pause
    exit /b 1
)

echo ✅ Ollama is running!
echo.

echo Testing model availability...
ollama list | findstr "llama3.2:3b" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Model llama3.2:3b not found!
    echo.
    echo Run: .\setup-ollama.bat
    echo.
    pause
    exit /b 1
)

echo ✅ Model is installed!
echo.

echo Testing simple generation...
echo.
curl -s http://localhost:11434/api/generate -d "{\"model\":\"llama3.2:3b\",\"prompt\":\"Say hello in one word\",\"stream\":false}" | findstr "response" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Model test failed!
    pause
    exit /b 1
)

echo ✅ Model is working!
echo.

echo ===================================
echo ✅ All tests passed!
echo ===================================
echo.
echo You can now use VIZZIO with AI support.
echo Run: .\run.bat
echo.
pause
