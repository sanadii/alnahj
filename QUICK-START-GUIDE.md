# Quick Start Guide - WebSocket Real-Time Updates

## ✅ Current Status

- ✅ Redis 7.4.7 is running in Docker
- ✅ Backend configured to use Redis for WebSocket channel layer
- ✅ WebSocket endpoint ready: `ws://localhost:8000/ws/election-updates/`

## 🚀 Next Steps

### Step 1: Restart Your Backend Server

Since we just configured Redis, you need to restart your backend server:

1. **Stop the current backend** (if running):
   - Press `Ctrl+C` in the terminal where the backend is running

2. **Start the backend with Daphne**:
   ```powershell
   cd backend
   .\start-server.ps1
   ```

   OR from project root:
   ```powershell
   .\start-services.ps1
   ```

### Step 2: Verify Backend Started Successfully

In the backend terminal, you should see:
```
Starting server at tcp:port=8000:interface=0.0.0.0
Listening on: http://0.0.0.0:8000
```

**No Redis errors should appear** (if Redis is properly configured).

### Step 3: Verify WebSocket Connection

1. **Open your frontend** (should be running on http://localhost:3000)
2. **Open browser console** (F12)
3. **Look for these messages**:
   ```
   [WebSocket] Attempting to connect to: ws://localhost:8000/ws/election-updates/
   [WebSocket] Connected successfully
   [useWebSocket] Connected to real-time updates
   ```
4. **Check the WebSocket status indicator** in the header:
   - ✅ Green = Connected
   - ❌ Red = Disconnected

### Step 4: Test Real-Time Updates

1. **Open two browser windows/tabs**
2. **Log in to both** with different users (or same user)
3. **In Window 1**: Create a guarantee
4. **In Window 2**: You should see the guarantee appear automatically without refresh!

## 🔍 Troubleshooting

### If Backend Won't Start

**Check if Redis is running:**
```powershell
docker ps | findstr redis
```

**Test Redis connection:**
```powershell
docker exec redis-server redis-cli ping
# Should return: PONG
```

### If WebSocket Still Doesn't Connect

**Check backend logs for errors:**
- Look for Redis connection errors
- Look for channel layer errors

**Check browser console:**
- Look for connection errors
- Check the WebSocket URL is correct

### If You Get "BZPOPMIN" Error

This means Redis version is too old. But since you have Redis 7.4.7, this shouldn't happen.

If it does:
1. The system will automatically fall back to InMemoryChannelLayer
2. Restart the backend
3. It should work with InMemoryChannelLayer

## ✅ Success Checklist

- [ ] Backend server is running with Daphne
- [ ] Redis is running (or using InMemoryChannelLayer)
- [ ] Frontend is running
- [ ] Browser console shows "WebSocket Connected successfully"
- [ ] WebSocket status indicator is green
- [ ] Real-time updates work (test with two windows)

## 📝 What's Next?

Once everything is working:

1. **Test all real-time update types:**
   - ✅ Guarantee create/update/delete
   - ✅ Attendance marking
   - ✅ Vote count entry
   - ✅ Dashboard statistics

2. **Monitor connection health:**
   - Check WebSocket status indicator
   - Watch for disconnection/reconnection events

3. **Production deployment:**
   - Use Redis 7.x for production
   - Configure proper Redis persistence
   - Set up monitoring

## 🆘 Need Help?

If something isn't working:
1. Check the **WEBSOCKET-FIX-GUIDE.md** for common issues
2. Check the **REALTIME-TROUBLESHOOTING.md** for detailed troubleshooting
3. Review backend logs for errors
4. Check browser console for frontend errors

---

**You're all set!** Just restart your backend and test the WebSocket connection. 🎉

