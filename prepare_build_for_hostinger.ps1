# سكريبت ضغط ملفات البناء للرفع على Hostinger
# PowerShell Script to prepare build files for Hostinger

Write-Host "📦 تحضير ملفات البناء للرفع على Hostinger..." -ForegroundColor Cyan

$frontendPath = "backend\frontend"
$outputFile = "frontend-build-ready.tar.gz"

# التحقق من وجود مجلد .next
if (-not (Test-Path "$frontendPath\.next")) {
    Write-Host "❌ خطأ: مجلد .next غير موجود. يجب بناء المشروع أولاً!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ مجلد .next موجود" -ForegroundColor Green

# حذف الملف القديم إن وجد
if (Test-Path $outputFile) {
    Remove-Item $outputFile -Force
    Write-Host "🗑️  تم حذف الملف القديم" -ForegroundColor Yellow
}

Write-Host "📦 ضغط الملفات المطلوبة..." -ForegroundColor Cyan

# استخدام tar (متوفر في Windows 10+)
# ضغط: .next, public, package.json, next.config.js, .env.local (إن وجد)
$filesToCompress = @(
    "$frontendPath\.next",
    "$frontendPath\public",
    "$frontendPath\package.json",
    "$frontendPath\next.config.js",
    "$frontendPath\ecosystem.config.cjs"
)

# إضافة .env.local إن وجد
if (Test-Path "$frontendPath\.env.local") {
    $filesToCompress += "$frontendPath\.env.local"
}

# استخدام tar لضغط الملفات
$tarCommand = "tar -czf `"$outputFile`" -C `"$frontendPath`" .next public package.json next.config.js ecosystem.config.cjs"
if (Test-Path "$frontendPath\.env.local") {
    $tarCommand += " .env.local"
}

Invoke-Expression $tarCommand

if (Test-Path $outputFile) {
    $fileSize = (Get-Item $outputFile).Length / 1MB
    Write-Host "✅ تم ضغط الملفات بنجاح!" -ForegroundColor Green
    Write-Host "📁 الملف: $outputFile" -ForegroundColor Cyan
    Write-Host "📊 الحجم: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🚀 الخطوات التالية:" -ForegroundColor Yellow
    Write-Host "1. ارفع الملف $outputFile إلى السيرفر باستخدام:" -ForegroundColor White
    Write-Host "   scp $outputFile u646739138@92.112.189.198:~/domains/damahomerealty.com/public_html/backend/frontend/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "2. على السيرفر، نفذ:" -ForegroundColor White
    Write-Host "   cd ~/domains/damahomerealty.com/public_html/backend/frontend" -ForegroundColor Cyan
    Write-Host "   tar -xzf frontend-build-ready.tar.gz" -ForegroundColor Cyan
    Write-Host "   rm frontend-build-ready.tar.gz" -ForegroundColor Cyan
    Write-Host "   pm2 restart nextjs" -ForegroundColor Cyan
} else {
    Write-Host "❌ فشل ضغط الملفات!" -ForegroundColor Red
    exit 1
}

