# Django Development Server Startup Script with WebSocket Support
# Run this from the backend directory
# Uses Daphne (ASGI) for WebSocket support

Write-Host "================================" -ForegroundColor Cyan
Write-Host " Django Development Server" -ForegroundColor Cyan
Write-Host "  (With WebSocket Support)" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if virtual environment is activated
if (-not $env:VIRTUAL_ENV) {
    Write-Host "Activating virtual environment..." -ForegroundColor Yellow
    & ..\venv\Scripts\Activate.ps1
}

# Check if daphne is installed
$daphneInstalled = python -c "import daphne" 2>$null
if (-not $daphneInstalled) {
    Write-Host "Daphne not found. Installing..." -ForegroundColor Yellow
    pip install daphne
}

Write-Host "Starting Django server with ASGI (Daphne)..." -ForegroundColor Green
Write-Host ""
Write-Host "Server will be available at:" -ForegroundColor White
Write-Host "  http://localhost:8000" -ForegroundColor Cyan
Write-Host "  http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "WebSocket endpoint:" -ForegroundColor White
Write-Host "  ws://localhost:8000/ws/election-updates/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Admin panel:" -ForegroundColor White
Write-Host "  http://localhost:8000/admin" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start Django server with Daphne (ASGI) for WebSocket support
daphne -b 0.0.0.0 -p 8000 core.asgi:application

