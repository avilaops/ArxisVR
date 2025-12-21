@echo off
echo ╔═══════════════════════════════════════════════════════╗
echo ║          VIZZIO - AI Quick Commands                   ║
echo ╚═══════════════════════════════════════════════════════╝
echo.
echo Choose an option:
echo.
echo  [1] Setup AI (Install Ollama + Model)
echo  [2] Test AI Connection
echo  [3] List Installed Models
echo  [4] Download More Models
echo  [5] Start Ollama Service
echo  [6] Stop Ollama Service
echo  [7] Run VIZZIO
echo  [8] Run AI Examples
echo  [9] View AI Logs
echo  [0] Exit
echo.
set /p choice="Enter option (0-9): "

if "%choice%"=="1" goto setup
if "%choice%"=="2" goto test
if "%choice%"=="3" goto list_models
if "%choice%"=="4" goto download
if "%choice%"=="5" goto start_service
if "%choice%"=="6" goto stop_service
if "%choice%"=="7" goto run_vizzio
if "%choice%"=="8" goto run_examples
if "%choice%"=="9" goto view_logs
if "%choice%"=="0" goto end
goto invalid

:setup
echo.
echo Running Ollama setup...
call setup-ollama.bat
goto menu

:test
echo.
echo Testing AI connection...
call test-ai.bat
goto menu

:list_models
echo.
echo ═══════════════════════════════════════════════════════
echo  Installed Models
echo ═══════════════════════════════════════════════════════
ollama list
echo.
pause
goto menu

:download
echo.
echo ═══════════════════════════════════════════════════════
echo  Available Models to Download
echo ═══════════════════════════════════════════════════════
echo.
echo  Small Models (8GB RAM):
echo    [1] llama3.2:3b      (~2GB)   - Recommended
echo    [2] phi3:mini         (~2.3GB) - Fast
echo.
echo  Medium Models (16GB RAM):
echo    [3] llama3:8b         (~4.7GB) - Better quality
echo    [4] mistral:7b        (~4GB)   - Good for Portuguese
echo.
echo  Specialized:
echo    [5] codellama:7b      (~4GB)   - Code analysis
echo    [6] llama3-uncensored (~4.7GB) - No filters
echo.
echo  [0] Back to menu
echo.
set /p model="Choose model (0-6): "

if "%model%"=="1" (
    ollama pull llama3.2:3b
) else if "%model%"=="2" (
    ollama pull phi3:mini
) else if "%model%"=="3" (
    ollama pull llama3:8b
) else if "%model%"=="4" (
    ollama pull mistral:7b
) else if "%model%"=="5" (
    ollama pull codellama:7b
) else if "%model%"=="6" (
    ollama pull llama3-uncensored
) else if "%model%"=="0" (
    goto menu
) else (
    echo Invalid option!
    pause
    goto download
)
echo.
pause
goto menu

:start_service
echo.
echo Starting Ollama service...
start "" /B ollama serve
timeout /t 3 /nobreak >nul
echo ✅ Ollama service started!
echo.
pause
goto menu

:stop_service
echo.
echo Stopping Ollama service...
taskkill /IM ollama.exe /F >nul 2>&1
echo ✅ Ollama service stopped!
echo.
pause
goto menu

:run_vizzio
echo.
echo Running VIZZIO...
call run.bat
goto menu

:run_examples
echo.
echo Running AI Examples...
echo.
echo NOTE: Add this line to Program.cs:
echo await Vizzio.Examples.AIExamples.RunAllExamplesAsync();
echo.
pause
goto menu

:view_logs
echo.
echo ═══════════════════════════════════════════════════════
echo  Recent AI Activity
echo ═══════════════════════════════════════════════════════
echo.
curl -s http://localhost:11434/api/tags
echo.
pause
goto menu

:invalid
echo.
echo ❌ Invalid option!
pause
goto menu

:menu
cls
echo ╔═══════════════════════════════════════════════════════╗
echo ║          VIZZIO - AI Quick Commands                   ║
echo ╚═══════════════════════════════════════════════════════╝
echo.
echo Choose an option:
echo.
echo  [1] Setup AI (Install Ollama + Model)
echo  [2] Test AI Connection
echo  [3] List Installed Models
echo  [4] Download More Models
echo  [5] Start Ollama Service
echo  [6] Stop Ollama Service
echo  [7] Run VIZZIO
echo  [8] Run AI Examples
echo  [9] View AI Logs
echo  [0] Exit
echo.
set /p choice="Enter option (0-9): "
if "%choice%"=="1" goto setup
if "%choice%"=="2" goto test
if "%choice%"=="3" goto list_models
if "%choice%"=="4" goto download
if "%choice%"=="5" goto start_service
if "%choice%"=="6" goto stop_service
if "%choice%"=="7" goto run_vizzio
if "%choice%"=="8" goto run_examples
if "%choice%"=="9" goto view_logs
if "%choice%"=="0" goto end
goto invalid

:end
echo.
echo Thanks for using VIZZIO! 🚀
echo.
exit /b 0
