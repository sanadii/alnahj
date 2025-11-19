# Real-Time Updates - Troubleshooting Guide

## Common Issues and Solutions

### Issue: WebSocket Connection Error (Code 1006)

**Symptoms:**
- Console error: `[WebSocket] Connection error`
- Console warning: `[WebSocket] Disconnected (code: 1006, reason: Abnormal closure)`
- WebSocket status indicator shows red/disconnected
- Error message: "Connection failed. Is the WebSocket server running?"

**Possible Causes:**

1. **Backend Server Not Running**
   - Django backend is not started
   - ASGI server (Daphne) is not running
   - Server crashed or stopped

2. **Wrong Port/URL**
   - Frontend trying to connect to wrong port
   - Backend running on different port than expected
   - URL mismatch between frontend and backend

3. **Redis Not Running** (if using Redis channel layer)
   - Redis server is not started
   - Redis connection failed
   - Redis configuration incorrect

4. **ASGI Configuration Issue**
   - ASGI application not properly configured
   - WebSocket routing not set up
   - Channel layers not configured

5. **Network/Firewall Issue**
   - Firewall blocking WebSocket connections
   - Network connectivity issue
   - CORS configuration blocking connection

**Solutions:**

#### 1. Check Backend Server Status

```bash
# Check if Django server is running
# In backend directory
python manage.py runserver

# Or with Daphne (for production)
daphne -b 0.0.0.0 -p 8000 core.asgi:application
```

**Verify:**
- Server starts without errors
- Server is listening on port 8000 (or configured port)
- No import errors or configuration issues

#### 2. Check WebSocket URL Configuration

**Frontend URL** (`frontend/src/helpers/websocket/websocketClient.ts`):
```typescript
// Should be: ws://localhost:8000/ws/election-updates/
// Or: wss://your-domain.com/ws/election-updates/ (for production)
```

**Backend Routing** (`backend/core/routing.py`):
```python
websocket_urlpatterns = [
    path('ws/election-updates/', ElectionUpdatesConsumer.as_asgi()),
]
```

**Verify:**
- Frontend URL matches backend routing
- Port numbers match (frontend: 3000, backend: 8000)
- Protocol matches (ws:// for http, wss:// for https)

#### 3. Check Redis Status (if using Redis)

```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# Check Redis connection from Django
python manage.py shell
>>> from channels.layers import get_channel_layer
>>> channel_layer = get_channel_layer()
>>> channel_layer  # Should not be None
```

**If Redis is not available:**
- Development: Django will fall back to InMemory channel layer
- Production: Redis is required

#### 4. Check ASGI Configuration

**File**: `backend/core/asgi.py`

```python
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(websocket_urlpatterns)
        )
    ),
})
```

**Verify:**
- ASGI application is properly configured
- WebSocket routing is included
- No import errors

#### 5. Check Channel Layers Configuration

**File**: `backend/core/settings.py`

```python
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('localhost', 6379)],
        },
    },
}
```

**Verify:**
- Channel layers are configured
- Redis host/port are correct
- Fallback to InMemory works in development

#### 6. Check Browser Console

**Look for:**
- Connection attempt log: `[WebSocket] Attempting to connect to: ws://...`
- Error details in console
- Network tab showing WebSocket connection attempt

**Common Console Messages:**
- `[WebSocket] Connection error: Connection failed. Check if WebSocket server is running.`
  - → Backend server is not running
- `[WebSocket] Authentication error`
  - → Token is invalid or expired
- `[WebSocket] Disconnected (code: 1006)`
  - → Connection failed (server down or network issue)

#### 7. Test WebSocket Connection Manually

**Using Browser Console:**
```javascript
// Test WebSocket connection
const token = localStorage.getItem('accessToken');
const ws = new WebSocket(`ws://localhost:8000/ws/election-updates/?token=${token}`);

ws.onopen = () => console.log('Connected!');
ws.onerror = (error) => console.error('Error:', error);
ws.onclose = (event) => console.log('Closed:', event.code, event.reason);
```

**Expected:**
- `onopen` fires if connection succeeds
- `onerror` or `onclose` with code 1006 if connection fails

## Issue: Authentication Errors (Code 4001, 4003)

**Symptoms:**
- Console error: `[WebSocket] Authentication error`
- Connection closes with code 4001 or 4003
- Error message: "Authentication failed" or "Token expired"

**Solutions:**

1. **Check Token Validity**
   ```javascript
   // In browser console
   const token = localStorage.getItem('accessToken');
   console.log('Token:', token ? 'Present' : 'Missing');
   ```

2. **Refresh Token**
   - Logout and login again
   - Token should refresh automatically

3. **Check Token Format**
   - Token should be a valid JWT
   - Token should not be expired
   - Token should be sent in query string: `?token=...`

## Issue: Connection Drops Frequently

**Symptoms:**
- Connection establishes but drops after a few seconds
- Frequent reconnection attempts
- Error: "Abnormal closure" or "Going away"

**Solutions:**

1. **Check Ping/Pong Mechanism**
   - WebSocket client should send ping every 30 seconds
   - Server should respond with pong
   - Check console for ping/pong messages

2. **Check Server Timeout Settings**
   - Nginx: `proxy_read_timeout 86400;`
   - Django: No specific timeout (uses default)

3. **Check Network Stability**
   - Test on stable network
   - Check for network interruptions
   - Verify firewall isn't closing idle connections

## Issue: Updates Not Received

**Symptoms:**
- Connection is established
- No real-time updates received
- Updates only appear after page refresh

**Solutions:**

1. **Check Signal Handlers**
   ```bash
   # Verify signals are registered
   python manage.py shell
   >>> from django.db.models.signals import post_save
   >>> from apps.guarantees.models import Guarantee
   >>> # Create a guarantee and check if signal fires
   ```

2. **Check Broadcasting**
   - Verify `broadcast_to_group()` is called
   - Check Django logs for broadcast errors
   - Verify channel layer is working

3. **Check Frontend Handlers**
   - Verify message handlers are registered
   - Check browser console for received messages
   - Verify Redux actions are dispatched

## Issue: Performance Issues

**Symptoms:**
- Slow updates
- High CPU usage
- Memory leaks
- Browser freezing

**Solutions:**

1. **Check Message Frequency**
   - Reduce update frequency if too high
   - Batch updates if possible
   - Filter messages by user/committee

2. **Check Connection Count**
   - Limit connections per user
   - Close unused connections
   - Monitor connection metrics

3. **Check Message Size**
   - Reduce payload size
   - Send only necessary data
   - Use pagination for large lists

## Debugging Steps

### 1. Enable Detailed Logging

**Backend** (`backend/core/settings.py`):
```python
LOGGING = {
    'version': 1,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'apps.utils.consumers': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
        'apps.utils.signals': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

**Frontend** (Browser Console):
- Already enabled with `console.log` statements
- Check for `[WebSocket]` prefixed messages

### 2. Test WebSocket Endpoint

**Using curl (for HTTP endpoint):**
```bash
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/utils/websocket/health/
```

**Using wscat (for WebSocket):**
```bash
npm install -g wscat
wscat -c "ws://localhost:8000/ws/election-updates/?token=<token>"
```

### 3. Monitor Connections

**Backend Health Endpoint:**
```bash
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/utils/websocket/health/
```

**Response:**
```json
{
  "status": "healthy",
  "channel_layer": "available",
  "connections": 0
}
```

### 4. Check Django Logs

```bash
# In backend directory
python manage.py runserver
# Watch for WebSocket-related log messages
```

## Quick Checklist

When troubleshooting WebSocket issues, check:

- [ ] Backend server is running
- [ ] Redis is running (if using Redis)
- [ ] WebSocket URL is correct
- [ ] Token is valid and not expired
- [ ] ASGI configuration is correct
- [ ] Channel layers are configured
- [ ] Browser console shows connection attempt
- [ ] Network/firewall allows WebSocket connections
- [ ] No CORS issues
- [ ] Django logs show no errors

## Getting Help

If issues persist:

1. **Collect Information:**
   - Browser console logs
   - Django server logs
   - Network tab screenshots
   - Error messages

2. **Check Documentation:**
   - `REALTIME-UPDATES-PLAN.md`
   - `REALTIME-BACKEND-IMPROVEMENTS.md`
   - `REALTIME-NEXT-STEPS-PLAN.md`

3. **Test Environment:**
   - Backend version
   - Frontend version
   - Django version
   - Channels version
   - Redis version (if applicable)

---

**Last Updated**: 2024-11-19  
**Version**: 1.0.0

