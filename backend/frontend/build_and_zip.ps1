# PowerShell Deployment Script for Next.js Frontend
# This script prepares the Next.js app for Hostinger deployment

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next.js Frontend Build & Zip Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory (backend/frontend)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "[1/6] Setting Environment Variables for Production Build..." -ForegroundColor Yellow

# Set environment variables for production build
$env:NEXT_PUBLIC_API_URL = "https://damahomerealty.com/api"
$env:NEXT_PUBLIC_STORAGE_URL = "https://damahomerealty.com/storage"
$env:NEXT_PUBLIC_SITE_URL = "https://damahomerealty.com"

Write-Host "  [OK] NEXT_PUBLIC_API_URL = $env:NEXT_PUBLIC_API_URL" -ForegroundColor Green
Write-Host "  [OK] NEXT_PUBLIC_STORAGE_URL = $env:NEXT_PUBLIC_STORAGE_URL" -ForegroundColor Green
Write-Host "  [OK] NEXT_PUBLIC_SITE_URL = $env:NEXT_PUBLIC_SITE_URL" -ForegroundColor Green
Write-Host ""

Write-Host '[2/6] Cleaning and Installing Dependencies...' -ForegroundColor Yellow

# Remove .next folder if it exists
if (Test-Path ".next") {
    Write-Host "  Removing .next folder..." -ForegroundColor Gray
    Remove-Item -Recurse -Force ".next"
    Write-Host "  [OK] .next folder removed" -ForegroundColor Green
}

# Remove frontend-build.zip if it exists
if (Test-Path "frontend-build.zip") {
    Write-Host "  Removing existing frontend-build.zip..." -ForegroundColor Gray
    Remove-Item -Force "frontend-build.zip"
    Write-Host "  [OK] Existing zip removed" -ForegroundColor Green
}

# Run npm install with legacy peer deps to handle dependency conflicts
Write-Host "  Running npm install (with --legacy-peer-deps)..." -ForegroundColor Gray
npm install --legacy-peer-deps
if ($LASTEXITCODE -ne 0) {
    Write-Host "  [ERROR] npm install failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  [OK] Dependencies installed" -ForegroundColor Green
Write-Host ""

Write-Host '[3/6] Enabling Standalone Mode and Building...' -ForegroundColor Yellow

# Enable standalone mode in next.config.js temporarily
$nextConfigPath = "next.config.js"
$nextConfigContent = Get-Content $nextConfigPath -Raw

# Check if standalone is already enabled (not commented out)
# Look for uncommented output: 'standalone' (line doesn't start with //)
$standaloneEnabled = $nextConfigContent -match "(?m)^(?!\s*//).*output:\s*['`"]standalone['`"]"
# Look for commented output: 'standalone'
$standaloneCommented = $nextConfigContent -match "(?m)^\s*//.*output.*standalone"

if (-not $standaloneEnabled) {
    Write-Host "  Enabling standalone mode in next.config.js..." -ForegroundColor Gray
    
    # Create a backup
    $backupPath = "next.config.js.backup"
    if (Test-Path $backupPath) {
        Remove-Item $backupPath -Force
    }
    Copy-Item $nextConfigPath $backupPath
    
    # Enable standalone mode - uncomment if commented, or add if missing
    $modifiedContent = $nextConfigContent
    if ($standaloneCommented) {
        # Uncomment the existing line - handle different comment patterns
        $modifiedContent = $nextConfigContent -replace "(?m)^(\s*)//\s*(output:\s*['`"]standalone['`"],)", "`$1`$2"
        if ($modifiedContent -eq $nextConfigContent) {
            # Try another pattern
            $modifiedContent = $nextConfigContent -replace "(?m)(\s*)//\s*(output:\s*['`"]standalone['`"])", "`$1`$2"
        }
    }
    
    # If still not modified or wasn't commented, add it
    if ($modifiedContent -eq $nextConfigContent) {
        # Add standalone mode after reactStrictMode
        $modifiedContent = $nextConfigContent -replace "(reactStrictMode:\s*true,)", "`$1`r`n  output: 'standalone',"
    }
    
    Set-Content -Path $nextConfigPath -Value $modifiedContent -NoNewline -Encoding UTF8
    Write-Host "  [OK] Standalone mode enabled" -ForegroundColor Green
    $restoreConfig = $true
} else {
    Write-Host "  [OK] Standalone mode already enabled" -ForegroundColor Green
    $restoreConfig = $false
}

# Run npm build
# Set environment variable for Windows PowerShell
$env:NEXT_PRIVATE_SKIP_TURBO = "1"
Write-Host "  Running next build with webpack..." -ForegroundColor Gray
npx next build --webpack
if ($LASTEXITCODE -ne 0) {
    Write-Host "  [ERROR] Build failed!" -ForegroundColor Red
    # Restore config if modified
    if ($restoreConfig) {
        Move-Item -Force $backupPath $nextConfigPath
    }
    exit 1
}
Write-Host "  [OK] Build completed successfully" -ForegroundColor Green
Write-Host ""

Write-Host "[4/6] Preparing Standalone Directory..." -ForegroundColor Yellow

# Verify standalone directory exists
if (-not (Test-Path ".next\standalone")) {
    Write-Host "  [ERROR] .next\standalone directory not found!" -ForegroundColor Red
    Write-Host "  Please ensure standalone mode is enabled in next.config.js" -ForegroundColor Red
    exit 1
}

# Detect the actual standalone structure
# Next.js creates the standalone output with the relative path from outputFileTracingRoot
# Since we're in backend/frontend, it should create backend/frontend structure
$possiblePaths = @(
    ".next\standalone\backend\frontend",
    ".next\standalone\frontend",
    ".next\standalone"
)

$standaloneRoot = $null
foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        # Check if server.js exists (confirms this is the right path)
        if (Test-Path "$path\server.js") {
            $standaloneRoot = $path
            Write-Host "  Found standalone root at: $path" -ForegroundColor Gray
            break
        }
    }
}

if (-not $standaloneRoot) {
    # Try to find server.js recursively
    $serverJs = Get-ChildItem -Path ".next\standalone" -Filter "server.js" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($serverJs) {
        $standaloneRoot = $serverJs.DirectoryName
        Write-Host "  Found standalone root at: $standaloneRoot" -ForegroundColor Gray
    } else {
        Write-Host "  [ERROR] Could not find server.js in standalone directory!" -ForegroundColor Red
        Write-Host "  Standalone structure may be incorrect." -ForegroundColor Red
        exit 1
    }
}

# Calculate relative path from standalone root to determine target structure
$standaloneFullPath = (Resolve-Path $standaloneRoot).Path
$currentFullPath = (Get-Location).Path
$relativePath = $standaloneFullPath.Replace($currentFullPath, "").TrimStart('\', '/')

# Target directories - use the detected structure
$standalonePublicPath = Join-Path $standaloneRoot "public"
$standaloneStaticPath = Join-Path $standaloneRoot ".next\static"

# Create necessary directories
Write-Host "  Creating directory structure..." -ForegroundColor Gray
New-Item -ItemType Directory -Force -Path $standalonePublicPath | Out-Null
New-Item -ItemType Directory -Force -Path $standaloneStaticPath | Out-Null
Write-Host "  [OK] Directory structure created" -ForegroundColor Green

# Copy public folder
if (Test-Path "public") {
    Write-Host "  Copying public folder to standalone..." -ForegroundColor Gray
    Copy-Item -Recurse -Force "public\*" $standalonePublicPath
    Write-Host "  [OK] public folder copied" -ForegroundColor Green
} else {
    Write-Host "  [WARNING] public folder not found" -ForegroundColor Yellow
}

# Copy .next/static folder
if (Test-Path ".next\static") {
    Write-Host "  Copying .next\static folder to standalone..." -ForegroundColor Gray
    Copy-Item -Recurse -Force ".next\static\*" $standaloneStaticPath
    Write-Host "  [OK] .next\static folder copied" -ForegroundColor Green
} else {
    Write-Host "  [WARNING] .next\static folder not found" -ForegroundColor Yellow
}
Write-Host ""

# Store restoreConfig status before restoring (we need it later for ZIP)
$needToRestoreConfig = $restoreConfig

# Restore config if modified (after standalone is prepared)
if ($needToRestoreConfig) {
    Write-Host "  Restoring original next.config.js..." -ForegroundColor Gray
    Move-Item -Force $backupPath $nextConfigPath
    Write-Host "  [OK] Config restored" -ForegroundColor Green
    Write-Host ""
}

Write-Host "[5/6] Creating Ecosystem File..." -ForegroundColor Yellow

# Calculate the server.js path for ecosystem config
# Convert Windows path to Linux path format for the server
# $standaloneRoot is already a relative path like ".next\standalone\backend\frontend"
$relativeStandalonePath = $standaloneRoot.Replace('\', '/')
$serverJsPath = "/home/u646739138/domains/damahomerealty.com/public_html/frontend/$relativeStandalonePath/server.js"

$ecosystemContent = @"
module.exports = {
  apps: [
    {
      name: "nextjs",
      script: "$serverJsPath",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1"
      }
    }
  ]
}
"@

Set-Content -Path "ecosystem.config.cjs" -Value $ecosystemContent
Write-Host "  [OK] ecosystem.config.cjs created" -ForegroundColor Green
Write-Host "  Server path: $serverJsPath" -ForegroundColor Gray
Write-Host ""

Write-Host "[6/6] Creating ZIP Archive..." -ForegroundColor Yellow

# Create zip file
$zipPath = "frontend-build.zip"

# Remove existing zip if any
if (Test-Path $zipPath) {
    Remove-Item -Force $zipPath
}

Write-Host "  Adding files to zip..." -ForegroundColor Gray

# Create a temporary folder for organizing files
$tempZipDir = "temp_zip_$(Get-Date -Format 'yyyyMMddHHmmss')"
New-Item -ItemType Directory -Force -Path $tempZipDir | Out-Null

try {
    # Copy files to temp directory
    Write-Host "    - Copying .next folder..." -ForegroundColor Gray
    Copy-Item -Recurse -Force ".next" "$tempZipDir\.next"
    
    Write-Host "    - Copying public folder..." -ForegroundColor Gray
    Copy-Item -Recurse -Force "public" "$tempZipDir\public"
    
    Write-Host "    - Copying package.json..." -ForegroundColor Gray
    Copy-Item -Force "package.json" "$tempZipDir\package.json"
    
    Write-Host "    - Copying next.config.js..." -ForegroundColor Gray
    # Copy original config if backup exists (standalone was enabled), otherwise copy current
    if ($needToRestoreConfig -and (Test-Path "next.config.js.backup")) {
        Copy-Item -Force "next.config.js.backup" "$tempZipDir\next.config.js"
    } else {
        Copy-Item -Force "next.config.js" "$tempZipDir\next.config.js"
    }
    
    Write-Host "    - Copying ecosystem.config.cjs..." -ForegroundColor Gray
    Copy-Item -Force "ecosystem.config.cjs" "$tempZipDir\ecosystem.config.cjs"
    
    # Create zip using Compress-Archive
    Write-Host "    - Compressing files..." -ForegroundColor Gray
    Compress-Archive -Path "$tempZipDir\*" -DestinationPath $zipPath -Force
    
    Write-Host "  [OK] ZIP archive created: $zipPath" -ForegroundColor Green
} finally {
    # Clean up temp directory
    if (Test-Path $tempZipDir) {
        Remove-Item -Recurse -Force $tempZipDir
    }
}

# Get file size
$zipSize = (Get-Item $zipPath).Length / 1MB
Write-Host "  [OK] File size: $([math]::Round($zipSize, 2)) MB" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host 'Build and ZIP Complete!' -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ready to upload: frontend-build.zip" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Upload frontend-build.zip to Hostinger" -ForegroundColor White
Write-Host "  2. Extract to: /home/u646739138/domains/damahomerealty.com/public_html/frontend/" -ForegroundColor White
Write-Host '  3. Run: pm2 start ecosystem.config.cjs' -ForegroundColor White
Write-Host ""

