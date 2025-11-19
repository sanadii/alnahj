# RioWorkspace Service Starter
Write-Host "Starting RioWorkspace Services..." -ForegroundColor Green
Write-Host ""

# Get the current directory
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend (Django) in a new window with WebSocket support
Write-Host "Starting Backend (Django with WebSocket support)..." -ForegroundColor Yellow
$backendScript = @"
cd '$projectRoot\backend'
.\venv\Scripts\activate
# Use Daphne (ASGI) for WebSocket support
daphne -b 0.0.0.0 -p 8000 core.asgi:application
pause
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendScript -WindowStyle Normal

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Frontend (React) in a new window
Write-Host "Starting Frontend (React)..." -ForegroundColor Yellow
$frontendScript = @"
cd '$projectRoot\frontend'
yarn start
pause
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendScript -WindowStyle Normal

Write-Host ""
Write-Host "Both services are starting..." -ForegroundColor Green
Write-Host "Backend will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 