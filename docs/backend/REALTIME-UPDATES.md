# Real-Time Updates Implementation

## Overview

The Election Management System now supports real-time updates using **Django Channels** (WebSockets) and **Redis**. When one user makes changes (creates/updates/deletes guarantees, marks attendance, or updates voting data), all other connected users see these changes immediately without refreshing their browser.

## Architecture

### Backend (Django Channels)

1. **WebSocket Consumer** (`apps/utils/consumers.py`)
   - Handles WebSocket connections with JWT authentication
   - Broadcasts updates to all connected clients
   - Supports ping/pong for connection health

2. **Django Signals** (`apps/utils/signals.py`)
   - Automatically triggers on model changes:
     - `Guarantee` (create, update, delete)
     - `Attendance` (create, update)
     - `VoteCount` (create, update)
     - `ElectionResults` (generate, update)

3. **Channel Layer** (Redis)
   - Uses Redis as the message broker
   - Falls back to InMemoryChannelLayer if Redis is unavailable (development only)

### Frontend (React)

1. **WebSocket Client** (`frontend/src/helpers/websocket/websocketClient.ts`)
   - Singleton WebSocket client
   - Automatic reconnection with exponential backoff
   - Ping/pong keepalive

2. **React Hook** (`frontend/src/hooks/useWebSocket.ts`)
   - Manages WebSocket connection lifecycle
   - Integrates with Redux to update state
   - Shows notifications for real-time updates

3. **Integration** (`frontend/src/contexts/JWTContext.tsx`)
   - Hook is called in `JWTProvider` to connect when user logs in

## Setup Instructions

### 1. Backend Setup

#### Install Dependencies

Dependencies are already in `requirements.txt`:
- `channels==4.0.0`
- `channels-redis==4.1.0`
- `redis==5.0.1`

#### Configure Redis

**Development (with Redis):**
```bash
# Install Redis (if not already installed)
# Windows: Download from https://redis.io/download
# Mac: brew install redis
# Linux: sudo apt-get install redis-server

# Start Redis
redis-server
```

**Development (without Redis - fallback):**
The system automatically falls back to `InMemoryChannelLayer` if Redis is unavailable. This works for single-server development but won't work across multiple processes.

**Production:**
Ensure Redis is running and accessible. Update `REDIS_HOST` and `REDIS_PORT` in `.env` if needed.

#### Run Django with ASGI

**Development:**
```bash
# Option 1: Use daphne (recommended for WebSocket support)
pip install daphne
daphne -b 0.0.0.0 -p 8000 core.asgi:application

# Option 2: Use runserver (basic WebSocket support, not recommended for production)
python manage.py runserver
```

**Production:**
```bash
# Use daphne or uvicorn with gunicorn
daphne -b 0.0.0.0 -p 8000 core.asgi:application
# OR
gunicorn core.asgi:application -k uvicorn.workers.UvicornWorker
```

### 2. Frontend Setup

No additional setup required! The WebSocket client is automatically initialized when the user logs in.

### 3. Environment Variables

**Backend `.env`:**
```env
# Redis Configuration (optional - defaults shown)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379/0
```

## How It Works

### Message Flow

1. **User Action**: User creates/updates/deletes a guarantee
2. **Django Signal**: Signal fires (`post_save`, `post_delete`)
3. **Broadcast**: Signal handler sends message to channel layer
4. **WebSocket**: Consumer receives message and broadcasts to all connected clients
5. **Frontend**: WebSocket client receives message
6. **Redux Update**: Hook dispatches Redux action to update state
7. **UI Update**: React re-renders with new data

### Message Types

#### Guarantee Updates
```json
{
  "type": "guarantee_update",
  "action": "created" | "updated" | "deleted",
  "data": { /* Guarantee object */ },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### Attendance Updates
```json
{
  "type": "attendance_update",
  "action": "created" | "updated",
  "data": { /* Attendance object */ },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### Voting Updates
```json
{
  "type": "voting_update",
  "action": "created" | "updated",
  "data": {
    "vote_count": { /* VoteCount object */ },
    "action_type": "results_generated" | "results_updated",
    "committee_id": 123
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### Dashboard Updates
```json
{
  "type": "dashboard_update",
  "dashboard_type": "personal" | "supervisor" | "admin",
  "data": { /* Dashboard statistics */ },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Testing

### Test WebSocket Connection

1. **Start backend with ASGI:**
   ```bash
   daphne -b 0.0.0.0 -p 8000 core.asgi:application
   ```

2. **Start frontend:**
   ```bash
   cd frontend
   yarn start
   ```

3. **Open browser console** and look for:
   ```
   [WebSocket] Connected
   [useWebSocket] Connected to real-time updates
   ```

4. **Test real-time updates:**
   - Open two browser windows/tabs
   - Log in to both
   - In one window, create/update a guarantee
   - In the other window, you should see the update immediately

### Debug WebSocket Issues

**Backend:**
```python
# Check Django logs for WebSocket connection messages
# Look for: "WebSocket connected: User ..."
```

**Frontend:**
```javascript
// Open browser console
// Look for WebSocket messages:
// - [WebSocket] Connected
// - [WebSocket] Disconnected
// - [WebSocket] Error: ...
```

## Troubleshooting

### WebSocket Connection Fails

1. **Check Redis is running:**
   ```bash
   redis-cli ping
   # Should return: PONG
   ```

2. **Check Django Channels configuration:**
   - Verify `CHANNEL_LAYERS` in `settings.py`
   - Check `ASGI_APPLICATION` is set

3. **Check CORS settings:**
   - WebSocket connections need CORS configured
   - Verify `CORS_ALLOWED_ORIGINS` includes your frontend URL

4. **Check authentication:**
   - WebSocket requires valid JWT token
   - Token is passed in query string: `?token=...`

### Updates Not Appearing

1. **Check signals are registered:**
   - Verify `apps.utils.apps.UtilsConfig.ready()` imports signals
   - Check Django logs for signal execution

2. **Check channel layer:**
   - Verify Redis is accessible
   - Check channel layer configuration

3. **Check frontend WebSocket connection:**
   - Open browser console
   - Verify connection is established
   - Check for error messages

### Performance Considerations

1. **Redis Memory:**
   - Monitor Redis memory usage
   - Configure Redis maxmemory policy if needed

2. **Connection Limits:**
   - Each user maintains one WebSocket connection
   - Consider connection pooling for high-traffic scenarios

3. **Message Volume:**
   - Current implementation broadcasts to all connected users
   - For large deployments, consider user-specific channels

## Future Enhancements

1. **User-Specific Channels:**
   - Broadcast only to relevant users (e.g., same committee)
   - Reduce unnecessary message traffic

2. **Presence System:**
   - Track which users are online
   - Show "User X is viewing this page"

3. **Typing Indicators:**
   - Show when users are editing guarantees/notes

4. **Conflict Resolution:**
   - Handle simultaneous edits
   - Show conflict warnings

5. **Selective Updates:**
   - Allow users to subscribe to specific update types
   - Reduce frontend processing

## Files Modified/Created

### Backend
- `backend/core/settings.py` - Added Channels configuration
- `backend/core/asgi.py` - Updated for WebSocket routing
- `backend/core/routing.py` - WebSocket URL routing
- `backend/apps/utils/consumers.py` - WebSocket consumer
- `backend/apps/utils/signals.py` - Django signals for broadcasting
- `backend/apps/utils/apps.py` - Register signals

### Frontend
- `frontend/src/helpers/websocket/websocketClient.ts` - WebSocket client
- `frontend/src/hooks/useWebSocket.ts` - React hook
- `frontend/src/contexts/JWTContext.tsx` - Integration point
- `frontend/src/store/guarantees/actions.ts` - Added success actions for WebSocket

## Security Considerations

1. **JWT Authentication:**
   - WebSocket connections require valid JWT token
   - Token is validated on connection

2. **CORS:**
   - WebSocket connections respect CORS settings
   - Configure `CORS_ALLOWED_ORIGINS` properly

3. **Rate Limiting:**
   - Consider adding rate limiting for WebSocket connections
   - Prevent connection spam

4. **Message Validation:**
   - All broadcasted messages are validated
   - Only authorized data is sent

## Support

For issues or questions:
1. Check Django logs for backend errors
2. Check browser console for frontend errors
3. Verify Redis is running and accessible
4. Ensure all dependencies are installed

