# Script PowerShell to compress frontend folder
$ErrorActionPreference = 'Stop'

Write-Host "Starting compression..." -ForegroundColor Cyan
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

$zipFile = Join-Path $scriptPath "frontend-build-new.zip"
$sourceDir = Join-Path $scriptPath "backend\frontend"

if (Test-Path $zipFile) {
    Write-Host "Deleting old file..." -ForegroundColor Yellow
    try {
        Remove-Item $zipFile -Force -ErrorAction Stop
        Start-Sleep -Seconds 1
    } catch {
        Write-Host "Cannot delete old file (may be open)" -ForegroundColor Yellow
        exit 1
    }
}

if (-not (Test-Path $sourceDir)) {
    Write-Host "Frontend folder not found: $sourceDir" -ForegroundColor Red
    exit 1
}

Write-Host "Compressing backend\frontend..." -ForegroundColor Cyan
Write-Host "This may take a few minutes..." -ForegroundColor Gray
Write-Host ""

$excludeDirs = @('.next', 'node_modules', '.pnp', '.vercel', 'coverage', 'test-results', '.playwright', 'playwright-report', '.git')
$sourcePath = Resolve-Path $sourceDir
$fileCount = 0
$totalSize = 0

$files = Get-ChildItem -Path $sourcePath -Recurse -File | Where-Object {
    $file = $_
    $relativePath = $file.FullName.Substring($sourcePath.Path.Length + 1)
    $skip = $false
    foreach ($ex in $excludeDirs) {
        if ($relativePath -like "*\$ex\*" -or $relativePath -like "*\$ex") {
            $skip = $true
            break
        }
    }
    if (-not $skip) {
        $fileCount++
        $totalSize += $file.Length
    }
    -not $skip
}

Write-Host "Found $fileCount files (~$([math]::Round($totalSize/1MB, 2)) MB)" -ForegroundColor Gray
Write-Host "Compressing..." -ForegroundColor Gray

$compressed = 0
$files | ForEach-Object {
    try {
        $relativePath = $_.FullName.Substring($sourcePath.Path.Length + 1).Replace('\', '/')
        Compress-Archive -Path $_.FullName -DestinationPath $zipFile -Update -CompressionLevel Optimal -ErrorAction SilentlyContinue
        $compressed++
        if ($compressed % 50 -eq 0) {
            Write-Host "Compressed $compressed of $fileCount files..." -ForegroundColor Gray
        }
    } catch {
    }
}

if (Test-Path $zipFile) {
    $zipSize = (Get-Item $zipFile).Length
    $zipSizeMB = [math]::Round($zipSize / 1MB, 2)
    
    Write-Host ""
    Write-Host "Created: frontend-build.zip" -ForegroundColor Green
    Write-Host "Size: $zipSizeMB MB" -ForegroundColor Green
    Write-Host "Files: $compressed" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "Failed to create zip file!" -ForegroundColor Red
    exit 1
}
