# Start Backend (Django) in background with WebSocket support
Write-Host "Starting Backend (Django with WebSocket support)..."
Start-Job -ScriptBlock {
    Set-Location $using:PWD\backend
    & .\venv\Scripts\activate
    # Use Daphne (ASGI) for WebSocket support
    daphne -b 0.0.0.0 -p 8000 core.asgi:application
} | Out-Null

# Start Frontend (React) in background  
Write-Host "Starting Frontend (React)..."
Start-Job -ScriptBlock {
    Set-Location $using:PWD\frontend
    yarn start
} | Out-Null

Write-Host "Both services are starting..."
Write-Host "Backend will be available at: http://localhost:8000"
Write-Host "Frontend will be available at: http://localhost:3000"
Write-Host ""
Write-Host "To stop both services, run: Get-Job | Stop-Job; Get-Job | Remove-Job"
Write-Host "To see job status, run: Get-Job" 