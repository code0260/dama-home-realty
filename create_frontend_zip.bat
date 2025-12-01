@echo off
REM ============================================
REM Script لضغط مجلد frontend كامل للرفع
REM ============================================

echo 📦 بدء ضغط مجلد frontend...
echo.

REM الانتقال إلى مجلد المشروع
cd /d "%~dp0"

REM حذف الملف القديم إن وجد
if exist "frontend-build.zip" (
    echo 🗑️  حذف الملف القديم...
    del /f "frontend-build.zip"
)

REM ضغط مجلد frontend (بدون .next و node_modules)
echo 📦 ضغط مجلد backend\frontend...
powershell -Command "$exclude = @('.next', 'node_modules', '.pnp', '.vercel', 'coverage', 'test-results', '.playwright', 'playwright-report'); Get-ChildItem -Path 'backend\frontend' -Exclude $exclude | Compress-Archive -DestinationPath 'frontend-build.zip' -Force"

if exist "frontend-build.zip" (
    echo.
    echo ✅ تم إنشاء: frontend-build.zip
    echo.
    echo 📋 التعليمات:
    echo    1. ارفع الملف: frontend-build.zip
    echo    2. على السيرفر:
    echo       cd ~/domains/damahomerealty.com/public_html
    echo       unzip -o frontend-build.zip -d backend/frontend/
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

