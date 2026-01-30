# 🚀 سكريبت شامل لرفع Frontend على Hostinger
# Complete Frontend Deployment Script for Hostinger

param(
    [string]$ServerUser = "u646739138",
    [string]$ServerIP = "92.112.189.198",
    [string]$ServerPath = "~/domains/damahomerealty.com/public_html/backend/frontend",
    [switch]$SkipUpload = $false,
    [switch]$SkipBuild = $false
)

Write-Host "🚀 بدء عملية النشر على Hostinger..." -ForegroundColor Cyan
Write-Host ""

$frontendPath = "backend\frontend"
$outputFile = "frontend-build-ready.tar.gz"
$remotePath = "$ServerUser@$ServerIP:$ServerPath"

# الخطوة 1: بناء المشروع (إن لم يكن مبني)
if (-not $SkipBuild) {
    Write-Host "📦 الخطوة 1: التحقق من البناء..." -ForegroundColor Yellow
    
    if (-not (Test-Path "$frontendPath\.next")) {
        Write-Host "⚠️  مجلد .next غير موجود. بدء البناء..." -ForegroundColor Yellow
        Set-Location $frontendPath
        
        Write-Host "   تشغيل npm run build..." -ForegroundColor Cyan
        npm run build
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ فشل البناء!" -ForegroundColor Red
            exit 1
        }
        
        Set-Location ..\..
        Write-Host "✅ تم البناء بنجاح!" -ForegroundColor Green
    } else {
        Write-Host "✅ مجلد .next موجود" -ForegroundColor Green
    }
} else {
    Write-Host "⏭️  تخطي البناء (SkipBuild)" -ForegroundColor Yellow
}

# الخطوة 2: ضغط الملفات
Write-Host ""
Write-Host "📦 الخطوة 2: ضغط الملفات..." -ForegroundColor Yellow

# حذف الملف القديم إن وجد
if (Test-Path $outputFile) {
    Remove-Item $outputFile -Force
    Write-Host "   🗑️  تم حذف الملف القديم" -ForegroundColor Gray
}

# التحقق من وجود الملفات المطلوبة
$requiredFiles = @(
    "$frontendPath\.next",
    "$frontendPath\public",
    "$frontendPath\package.json",
    "$frontendPath\next.config.js"
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "❌ خطأ: الملف $file غير موجود!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "   ضغط الملفات..." -ForegroundColor Cyan

# بناء قائمة الملفات للضغط
$tarFiles = ".next public package.json next.config.js"

# إضافة ecosystem.config.cjs إن وجد
if (Test-Path "$frontendPath\ecosystem.config.cjs") {
    $tarFiles += " ecosystem.config.cjs"
    Write-Host "   ✓ إضافة ecosystem.config.cjs" -ForegroundColor Gray
}

# تغيير المجلد والضغط
Set-Location $frontendPath
$tarCommand = "tar -czf ..\..\$outputFile $tarFiles"
Invoke-Expression $tarCommand
Set-Location ..\..

if (Test-Path $outputFile) {
    $fileSize = (Get-Item $outputFile).Length / 1MB
    Write-Host "✅ تم ضغط الملفات بنجاح!" -ForegroundColor Green
    Write-Host "   📁 الملف: $outputFile" -ForegroundColor Cyan
    Write-Host "   📊 الحجم: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Cyan
} else {
    Write-Host "❌ فشل ضغط الملفات!" -ForegroundColor Red
    exit 1
}

# الخطوة 3: رفع الملف على السيرفر
if (-not $SkipUpload) {
    Write-Host ""
    Write-Host "📤 الخطوة 3: رفع الملف على السيرفر..." -ForegroundColor Yellow
    
    # التحقق من وجود SCP
    $scpPath = Get-Command scp -ErrorAction SilentlyContinue
    if (-not $scpPath) {
        Write-Host "⚠️  SCP غير متوفر. يجب رفع الملف يدوياً:" -ForegroundColor Yellow
        Write-Host "   $outputFile" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "   ثم نفذ على السيرفر:" -ForegroundColor Yellow
        Write-Host "   cd $ServerPath" -ForegroundColor Cyan
        Write-Host "   tar -xzf frontend-build-ready.tar.gz" -ForegroundColor Cyan
        Write-Host "   rm frontend-build-ready.tar.gz" -ForegroundColor Cyan
        Write-Host "   pm2 restart nextjs" -ForegroundColor Cyan
        exit 0
    }
    
    Write-Host "   رفع الملف إلى $remotePath..." -ForegroundColor Cyan
    $scpCommand = "scp $outputFile ${remotePath}/"
    
    try {
        Invoke-Expression $scpCommand
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ تم رفع الملف بنجاح!" -ForegroundColor Green
        } else {
            Write-Host "❌ فشل رفع الملف. تحقق من الاتصال والصلاحيات." -ForegroundColor Red
            Write-Host "   يمكنك رفع الملف يدوياً ثم تشغيل السكريبت على السيرفر." -ForegroundColor Yellow
            exit 1
        }
    } catch {
        Write-Host "❌ خطأ في الرفع: $_" -ForegroundColor Red
        Write-Host "   يمكنك رفع الملف يدوياً ثم تشغيل السكريبت على السيرفر." -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host ""
    Write-Host "⏭️  تخطي الرفع (SkipUpload)" -ForegroundColor Yellow
    Write-Host "   ارفع الملف يدوياً: $outputFile" -ForegroundColor Cyan
}

# الخطوة 4: فك الضغط وتشغيل على السيرفر
Write-Host ""
Write-Host "🔧 الخطوة 4: إعداد السيرفر..." -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 نفذ الأوامر التالية على السيرفر:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   # الاتصال بالسيرفر" -ForegroundColor White
Write-Host "   ssh $ServerUser@$ServerIP" -ForegroundColor Gray
Write-Host ""
Write-Host "   # الانتقال إلى مجلد Frontend" -ForegroundColor White
Write-Host "   cd $ServerPath" -ForegroundColor Gray
Write-Host ""
Write-Host "   # فك الضغط" -ForegroundColor White
Write-Host "   tar -xzf frontend-build-ready.tar.gz" -ForegroundColor Gray
Write-Host ""
Write-Host "   # حذف الملف المضغوط" -ForegroundColor White
Write-Host "   rm frontend-build-ready.tar.gz" -ForegroundColor Gray
Write-Host ""
Write-Host "   # إعادة تشغيل PM2" -ForegroundColor White
Write-Host "   pm2 restart nextjs" -ForegroundColor Gray
Write-Host "   # أو" -ForegroundColor Gray
Write-Host "   pm2 restart dama-frontend" -ForegroundColor Gray
Write-Host ""
Write-Host "   # التحقق من الحالة" -ForegroundColor White
Write-Host "   pm2 status" -ForegroundColor Gray
Write-Host "   pm2 logs nextjs" -ForegroundColor Gray
Write-Host ""

Write-Host "✅ اكتملت العملية!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 نصيحة: يمكنك استخدام السكريبت deploy_on_server.sh على السيرفر لتشغيل الخطوات تلقائياً" -ForegroundColor Yellow

