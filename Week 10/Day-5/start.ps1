# Quick Start Script for Windows PowerShell

Write-Host "Starting Assignment Evaluation System..." -ForegroundColor Green

# Check if MongoDB is running
Write-Host "`nChecking MongoDB connection..." -ForegroundColor Yellow
try {
    $mongoCheck = mongo --eval "db.version()" 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Warning: MongoDB might not be running. Please start MongoDB first." -ForegroundColor Red
        Write-Host "Run: mongod" -ForegroundColor Yellow
    } else {
        Write-Host "MongoDB is running!" -ForegroundColor Green
    }
} catch {
    Write-Host "Warning: Cannot check MongoDB. Make sure it's running." -ForegroundColor Yellow
}

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend
Write-Host "`nStarting Backend Server..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$scriptDir\backend'; Write-Host 'Backend Server Starting...' -ForegroundColor Cyan; pnpm run start:dev"

# Wait a bit for backend to initialize
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$scriptDir\frontend'; Write-Host 'Frontend Server Starting...' -ForegroundColor Cyan; pnpm run dev"

# Wait a bit more
Start-Sleep -Seconds 2

Write-Host "`n======================================" -ForegroundColor Green
Write-Host "Servers are starting!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host "`nBackend: http://localhost:4000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C in each terminal window to stop the servers." -ForegroundColor Yellow
Write-Host "`nCheck the terminal windows for any errors." -ForegroundColor Yellow
