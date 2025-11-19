@echo off
echo Starting RioWorkspace Services...
echo.

REM Start Backend (Django) in a new window with WebSocket support
echo Starting Backend (Django with WebSocket support)...
start "RioWorkspace Backend" cmd /k "cd /d %~dp0backend && venv\Scripts\activate && daphne -b 0.0.0.0 -p 8000 core.asgi:application"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start Frontend (React) in a new window
echo Starting Frontend (React)...
start "RioWorkspace Frontend" cmd /k "cd /d %~dp0frontend && yarn start"

echo.
echo Both services are starting...
echo Backend will be available at: http://localhost:8000
echo Frontend will be available at: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul 