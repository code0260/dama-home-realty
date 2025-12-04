@echo off
setlocal enabledelayedexpansion
REM ============================================
REM Script محسّن لضغط مجلد frontend كامل
REM ============================================

echo 📦 بدء ضغط مجلد frontend...
echo.

cd /d "%~dp0"

REM حذف الملف القديم
if exist "frontend-build.zip" (
    echo 🗑️  حذف الملف القديم...
    del /f /q "frontend-build.zip" 2>nul
    timeout /t 1 /nobreak >nul
)

echo 📦 ضغط مجلد backend\frontend...
echo    (هذا قد يستغرق بضع دقائق حسب حجم الملفات...)
echo.

REM استخدام PowerShell لضغط الملفات بشكل صحيح
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
"$ErrorActionPreference = 'Stop'; ^
$source = Resolve-Path 'backend\frontend'; ^
$dest = Join-Path (Get-Location) 'frontend-build.zip'; ^
if (Test-Path $dest) { Remove-Item $dest -Force }; ^
$excludeDirs = @('.next', 'node_modules', '.pnp', '.vercel', 'coverage', 'test-results', '.playwright', 'playwright-report', '.git'); ^
$count = 0; ^
Get-ChildItem -Path $source -Recurse -File | ForEach-Object { ^
    $file = $_; ^
    $relativePath = $file.FullName.Substring($source.Path.Length + 1); ^
    $skip = $false; ^
    foreach ($ex in $excludeDirs) { ^
        if ($relativePath -like \"*\$ex*\") { $skip = $true; break } ^
    }; ^
    if (-not $skip) { ^
        try { ^
            $entryPath = $relativePath.Replace('\', '/'); ^
            Compress-Archive -Path $file.FullName -DestinationPath $dest -Update -CompressionLevel Optimal -ErrorAction SilentlyContinue; ^
            $count++; ^
            if ($count %% 100 -eq 0) { Write-Host \"   تم ضغط $count ملف...\" } ^
        } catch { } ^
    } ^
}; ^
Write-Host \"   تم ضغط $count ملف بنجاح\""

if exist "frontend-build.zip" (
    for %%A in ("frontend-build.zip") do (
        set size=%%~zA
        set /a sizeMB=!size! / 1048576
        set /a sizeKB=!size! / 1024
    )
    echo.
    echo ✅ تم إنشاء: frontend-build.zip
    if !sizeMB! GTR 0 (
        echo    الحجم: ~!sizeMB! MB
    ) else (
        echo    الحجم: ~!sizeKB! KB
    )
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

