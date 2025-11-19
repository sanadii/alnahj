# Clear Vite Cache Script
# Run this when you get "Failed to fetch dynamically imported module" errors

Write-Host "Clearing Vite cache..." -ForegroundColor Yellow

# Check if .vite folder exists
if (Test-Path "node_modules\.vite") {
    Write-Host "Found .vite cache folder. Removing..." -ForegroundColor Cyan
    Remove-Item -Recurse -Force "node_modules\.vite"
    Write-Host "✓ Vite cache cleared successfully!" -ForegroundColor Green
} else {
    Write-Host "No .vite cache folder found." -ForegroundColor Gray
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Stop your dev server if it's running (Ctrl+C)" -ForegroundColor White
Write-Host "2. Run: npm run start" -ForegroundColor White
Write-Host ""
Write-Host "Or run with force flag: npm run start -- --force" -ForegroundColor Cyan

