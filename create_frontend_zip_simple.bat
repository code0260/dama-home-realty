@echo off
REM ============================================
REM Script بسيط لضغط مجلد frontend كامل
REM ============================================

echo 📦 بدء ضغط مجلد frontend...
echo.

cd /d "%~dp0"

REM حذف الملف القديم
if exist "frontend-build.zip" (
    echo 🗑️  حذف الملف القديم...
    timeout /t 2 /nobreak >nul
    del /f /q "frontend-build.zip"
    timeout /t 1 /nobreak >nul
)

echo 📦 ضغط مجلد backend\frontend...
echo    (هذا قد يستغرق بضع دقائق...)
echo.

REM استخدام 7-Zip إذا كان موجوداً، وإلا استخدام PowerShell
where 7z >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo    استخدام 7-Zip...
    7z a -tzip -mx=9 "frontend-build.zip" "backend\frontend\*" -xr!"backend\frontend\.next" -xr!"backend\frontend\node_modules" -xr!"backend\frontend\.pnp" -xr!"backend\frontend\.vercel" -xr!"backend\frontend\coverage" -xr!"backend\frontend\test-results" -xr!"backend\frontend\.playwright" -xr!"backend\frontend\playwright-report" >nul
) else (
    echo    استخدام PowerShell...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$source = 'backend\frontend'; $dest = Join-Path (Get-Location) 'frontend-build.zip'; $exclude = @('.next', 'node_modules', '.pnp', '.vercel', 'coverage', 'test-results', '.playwright', 'playwright-report'); if (Test-Path $dest) { Remove-Item $dest -Force }; $files = @(); Get-ChildItem -Path $source -Recurse -File | ForEach-Object { $fullPath = $_.FullName; $relativePath = $fullPath.Replace((Resolve-Path $source).Path + '\', ''); $skip = $false; foreach ($ex in $exclude) { if ($relativePath -like \"*\$ex*\") { $skip = $true; break } }; if (-not $skip) { $files += $_ } }; if ($files.Count -gt 0) { $files | Compress-Archive -DestinationPath $dest -CompressionLevel Optimal -Force }"
)

if exist "frontend-build.zip" (
    for %%A in ("frontend-build.zip") do set size=%%~zA
    set /a sizeMB=!size! / 1048576
    echo.
    echo ✅ تم إنشاء: frontend-build.zip
    echo    الحجم: ~!sizeMB! MB
    echo.
    echo 📋 التعليمات:
    echo    1. ارفع الملف: frontend-build.zip
    echo    2. على السيرفر:
    echo       cd ~/domains/damahomerealty.com/public_html
    echo       unzip -o frontend-build.zip -d backend/
    echo       cd backend/frontend
    echo       rm -rf .next node_modules
    echo       npm install --omit=dev --legacy-peer-deps
    echo       NEXT_PRIVATE_SKIP_TURBO=1 npm run build
    echo       pm2 restart nextjs
    echo.
) else (
    echo ❌ فشل إنشاء الملف المضغوط!
    pause
    exit /b 1
)

pause

