@echo off
echo ===================================
echo VIZZIO - Build and Run Script
echo ===================================
echo.

echo [1/5] Cleaning...
dotnet clean
if errorlevel 1 goto error

echo.
echo [2/5] Restoring packages...
dotnet restore
if errorlevel 1 goto error

echo.
echo [3/5] Building...
dotnet build
if errorlevel 1 goto error

echo.
echo [4/5] Checking for errors...
dotnet build --no-restore > build.log 2>&1
findstr /C:"error" build.log
if not errorlevel 1 (
    echo.
    echo ❌ BUILD ERRORS FOUND!
    echo Check build.log for details
    type build.log
    goto error
)

echo.
echo [5/5] Running...
dotnet run
goto end

:error
echo.
echo ===================================
echo ❌ FAILED! Check the output above
echo ===================================
pause
exit /b 1

:end
echo.
echo ===================================
echo ✅ SUCCESS!
echo ===================================
pause
