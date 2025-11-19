# WebSocket Connection Fix Guide

## Issue
WebSocket connection fails with error code 1006 because the Django backend is running with `python manage.py runserver`, which doesn't support WebSockets.

## Solution
The backend must run with **Daphne** (ASGI server) instead of the regular Django development server to support WebSockets.

## Quick Fix

### Step 1: Stop the Current Backend Server
If you have a Django server running, stop it (Ctrl+C in the terminal).

### Step 2: Install Daphne (if not already installed)
```powershell
cd backend
.\venv\Scripts\activate
pip install daphne
```

**Note:** Daphne should already be in `requirements.txt`, so if you've installed dependencies, it should be available.

### Step 3: Start Backend with Daphne

#### Option A: Use the Backend Startup Script (Recommended)
```powershell
cd backend
.\start-server.ps1
```

#### Option B: Start Manually
```powershell
cd backend
.\venv\Scripts\activate
daphne -b 0.0.0.0 -p 8000 core.asgi:application
```

#### Option C: Use the Updated Startup Scripts
The root-level startup scripts have been updated:
- `start-services.ps1` - PowerShell script (Windows)
- `start-services.bat` - Batch script (Windows)

Run from the project root:
```powershell
.\start-services.ps1
```

### Step 4: Verify Connection
Once the backend is running with Daphne, you should see output like:
```
Starting server at tcp:port=8000:interface=0.0.0.0
HTTP/2 support not enabled (install the http2 and tls Twisted extras)
Listening on: http://0.0.0.0:8000
```

The WebSocket connection should now work automatically when you refresh your frontend.

## What Changed

### 1. Startup Scripts Updated
All startup scripts have been updated to use Daphne instead of `runserver`:
- ✅ `start-services.ps1` - Now uses Daphne
- ✅ `start-services.bat` - Now uses Daphne  
- ✅ `start.ps1` - Now uses Daphne
- ✅ `backend/start-server.ps1` - Already uses Daphne (unchanged)

### 2. Channel Layer Configuration Fixed
- ✅ **Default to InMemoryChannelLayer for development** - No Redis required by default
- ✅ **Automatic fallback** - If Redis is unavailable or incompatible, automatically falls back to InMemory
- ✅ **Redis version checking** - Checks if Redis 5.0+ is available before using it
- ✅ **BZPOPMIN command test** - Tests if Redis supports required commands

**Note:** By default, the backend now uses **InMemoryChannelLayer** which doesn't require Redis. This works perfectly for development with a single server instance. For production with multiple server instances, you'll need Redis 5.0+.

## Verification

### Backend is Running Correctly
You should see in the backend terminal:
```
Starting server at tcp:port=8000:interface=0.0.0.0
HTTP/2 support not enabled (install the http2 and tls Twisted extras)
Listening on: http://0.0.0.0:8000
```

### WebSocket Connection Works
In your browser console, you should see:
```
[WebSocket] Attempting to connect to: ws://localhost:8000/ws/election-updates/?token=***
[WebSocket] Connected successfully to: ws://localhost:8000/ws/election-updates/
[useWebSocket] Connected to real-time updates
```

### Connection Status Indicator
The WebSocket status indicator in the header should show green (connected) instead of red (disconnected).

## Troubleshooting

### If Daphne Command Not Found
```powershell
# Make sure virtual environment is activated
cd backend
.\venv\Scripts\activate

# Install Daphne
pip install daphne

# Verify installation
daphne --version
```

### If Port 8000 is Already in Use
Stop any other Django servers running on port 8000, or change the port:
```powershell
daphne -b 0.0.0.0 -p 8001 core.asgi:application
```

Then update the frontend WebSocket URL accordingly.

### If WebSocket Still Doesn't Connect
1. **Check Backend Logs**: Look for any errors in the backend terminal
2. **Check Browser Console**: Look for connection errors
3. **Verify ASGI Configuration**: Ensure `backend/core/asgi.py` is properly configured
4. **Channel Layer**: By default, the system uses InMemoryChannelLayer (no Redis needed)

### If You Get "BZPOPMIN" Error
This means Redis is too old (< 5.0). The system will automatically fall back to InMemoryChannelLayer for development. If you see this error:
- **For Development**: Just restart the backend - it will automatically use InMemory (no action needed)
- **For Production**: Update Redis to version 5.0 or higher

### To Force Use InMemory Channel Layer (No Redis)
The system now defaults to InMemoryChannelLayer. If you want to explicitly use Redis for development:
1. Set `USE_REDIS_FOR_CHANNELS=True` in your `.env` file
2. Ensure Redis 5.0+ is running
3. Restart the backend

### To Use Redis (Production)
1. Install Redis 5.0+ (required for `BZPOPMIN` command)
2. Set `USE_REDIS_FOR_CHANNELS=True` in your `.env` file
3. Set `REDIS_HOST` and `REDIS_PORT` if different from defaults
4. Restart the backend

## Differences: runserver vs Daphne

| Feature | runserver | Daphne (ASGI) |
|---------|-----------|---------------|
| HTTP/HTTPS | ✅ Yes | ✅ Yes |
| WebSockets | ❌ No | ✅ Yes |
| Real-time Updates | ❌ No | ✅ Yes |
| Production Ready | ❌ No | ✅ Yes |

**For this project**: Always use **Daphne** to support WebSocket real-time updates.

## Next Steps

After fixing the connection:
1. ✅ WebSocket should connect automatically on login
2. ✅ Real-time updates should work for guarantees, attendance, and voting
3. ✅ Connection status indicator should show green
4. ✅ Test by opening two browser windows and making changes in one window

---

**Last Updated**: 2024-01-XX  
**Status**: ✅ Fixed - All startup scripts updated to use Daphne

