# Quick Test Script for Startup Init Endpoint
# Run this to test the optimized endpoint

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Startup Init Endpoint Test Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Django server is running
Write-Host "1. Checking if Django server is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/startup/init/" -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✓ Server is running" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 401 -or $_.Exception.Response.StatusCode -eq 403) {
        Write-Host "   ✓ Server is running (authentication required)" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Server not responding. Start it with:" -ForegroundColor Red
        Write-Host "     cd backend" -ForegroundColor Gray
        Write-Host "     .\venv\Scripts\Activate.ps1" -ForegroundColor Gray
        Write-Host "     python manage.py runserver" -ForegroundColor Gray
        exit 1
    }
}

Write-Host ""
Write-Host "2. Checking if Redis is running..." -ForegroundColor Yellow
try {
    $redisCheck = Get-Process redis-server -ErrorAction SilentlyContinue
    if ($redisCheck) {
        Write-Host "   ✓ Redis is running (PID: $($redisCheck.Id))" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ Redis not running. Caching will not work." -ForegroundColor Yellow
        Write-Host "     Start Redis with: redis-server" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ⚠ Could not check Redis status" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "To test the endpoint, you need an authentication token:" -ForegroundColor White
Write-Host ""

Write-Host "Option 1: Get token from Django Admin" -ForegroundColor Yellow
Write-Host "  1. Go to http://127.0.0.1:8000/admin/" -ForegroundColor Gray
Write-Host "  2. Login with your credentials" -ForegroundColor Gray
Write-Host "  3. Find your authentication token" -ForegroundColor Gray

Write-Host ""
Write-Host "Option 2: Get token from frontend localStorage" -ForegroundColor Yellow
Write-Host "  1. Open your app in browser (F12 for DevTools)" -ForegroundColor Gray
Write-Host "  2. Go to Application → Local Storage" -ForegroundColor Gray
Write-Host "  3. Find 'token' or 'auth_token' key" -ForegroundColor Gray

Write-Host ""
Write-Host "Option 3: Login via API" -ForegroundColor Yellow
Write-Host "  Run this command with your credentials:" -ForegroundColor Gray
Write-Host '  $loginData = @{ email = "your@email.com"; password = "yourpassword" } | ConvertTo-Json' -ForegroundColor DarkGray
Write-Host '  $response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/auth/login/" -Method POST -Body $loginData -ContentType "application/json"' -ForegroundColor DarkGray
Write-Host '  $token = $response.token' -ForegroundColor DarkGray
Write-Host '  Write-Host "Your token: $token"' -ForegroundColor DarkGray

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Once you have a token, test the endpoint:" -ForegroundColor White
Write-Host ""
Write-Host '$token = "YOUR_TOKEN_HERE"' -ForegroundColor Cyan
Write-Host ''
Write-Host '# Test 1: Full data (cold - no cache)' -ForegroundColor Green
Write-Host 'Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/startup/init/?no_cache=true" `' -ForegroundColor White
Write-Host '  -Headers @{"Authorization"="Bearer $token"} `' -ForegroundColor White
Write-Host '  -UseBasicParsing | ConvertFrom-Json | ConvertTo-Json -Depth 3' -ForegroundColor White

Write-Host ''
Write-Host '# Test 2: Cached response (should be 95% faster!)' -ForegroundColor Green
Write-Host 'Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/startup/init/" `' -ForegroundColor White
Write-Host '  -Headers @{"Authorization"="Bearer $token"} `' -ForegroundColor White
Write-Host '  -UseBasicParsing | ConvertFrom-Json | Select-Object -ExpandProperty meta' -ForegroundColor White

Write-Host ''
Write-Host '# Test 3: Light mode (minimal data)' -ForegroundColor Green
Write-Host 'Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/startup/init/?light=true" `' -ForegroundColor White
Write-Host '  -Headers @{"Authorization"="Bearer $token"} `' -ForegroundColor White
Write-Host '  -UseBasicParsing | ConvertFrom-Json | Select-Object -ExpandProperty data | Select-Object -ExpandProperty PSObject | Select-Object -ExpandProperty Properties | Select-Object Name' -ForegroundColor White

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📚 Full testing guide: docs/guides/testing/startup-init-endpoint-testing.md" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Cyan


