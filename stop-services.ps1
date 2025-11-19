# RioWorkspace Service Stopper
Write-Host "Stopping RioWorkspace Services..." -ForegroundColor Red
Write-Host ""

# Stop Python processes (Django backend)
$pythonProcesses = Get-Process | Where-Object {$_.ProcessName -like "*python*" -and $_.MainWindowTitle -like "*RioWorkspace*"}
if ($pythonProcesses) {
    Write-Host "Stopping Django backend..." -ForegroundColor Yellow
    $pythonProcesses | Stop-Process -Force
    Write-Host "Django backend stopped." -ForegroundColor Green
} else {
    Write-Host "No Django backend process found." -ForegroundColor Gray
}

# Stop Node.js processes (React frontend)
$nodeProcesses = Get-Process | Where-Object {$_.ProcessName -like "*node*" -and $_.MainWindowTitle -like "*RioWorkspace*"}
if ($nodeProcesses) {
    Write-Host "Stopping React frontend..." -ForegroundColor Yellow
    $nodeProcesses | Stop-Process -Force
    Write-Host "React frontend stopped." -ForegroundColor Green
} else {
    Write-Host "No React frontend process found." -ForegroundColor Gray
}

# Alternative: Stop all Python and Node processes (use with caution)
Write-Host ""
Write-Host "Alternative: Stop all Python and Node processes?" -ForegroundColor Yellow
$response = Read-Host "Type 'yes' to stop all Python and Node processes (use with caution)"
if ($response -eq "yes") {
    Get-Process | Where-Object {$_.ProcessName -like "*python*" -or $_.ProcessName -like "*node*"} | Stop-Process -Force
    Write-Host "All Python and Node processes stopped." -ForegroundColor Green
}

Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 