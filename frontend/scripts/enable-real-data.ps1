# Script to enable real data mode in frontend
# This updates the .env file to disable mock data

Write-Host "🔧 Configuring frontend to use real backend data..." -ForegroundColor Cyan
Write-Host ""

$envFile = Join-Path $PSScriptRoot ".." ".env"

# Check if .env exists
if (!(Test-Path $envFile)) {
    Write-Host "⚠️  .env file not found. Creating new .env file..." -ForegroundColor Yellow
    New-Item -Path $envFile -ItemType File -Force | Out-Null
}

# Read existing .env content
$envContent = Get-Content $envFile -ErrorAction SilentlyContinue

# Remove any existing MOCK_DASHBOARD settings
$envContent = $envContent | Where-Object { 
    $_ -notmatch '^VITE_USE_MOCK_DASHBOARD=' -and 
    $_ -notmatch '^REACT_APP_USE_MOCK_DASHBOARD=' 
}

# Add the new setting
$envContent += ""
$envContent += "# Dashboard Data Source"
$envContent += "# Set to 'false' to use real backend data, 'true' for mock data"
$envContent += "VITE_USE_MOCK_DASHBOARD=false"

# Write back to .env
$envContent | Set-Content $envFile

Write-Host "✅ Frontend configured to use REAL backend data!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Updated: $envFile" -ForegroundColor Gray
Write-Host "   VITE_USE_MOCK_DASHBOARD=false" -ForegroundColor Gray
Write-Host ""
Write-Host "🔄 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Restart your frontend dev server (npm run start / yarn start)" -ForegroundColor White
Write-Host "   2. Navigate to the dashboard" -ForegroundColor White
Write-Host "   3. Check browser console for any errors" -ForegroundColor White
Write-Host ""
Write-Host "🎉 You're all set!" -ForegroundColor Green

