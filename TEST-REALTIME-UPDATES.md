# Test Real-Time Updates - Step by Step Guide

## ✅ Your WebSocket is Connected!

You're seeing:
- ✅ `[WebSocket] Connected successfully`
- ✅ `[useWebSocket] Connected to real-time updates`
- ✅ WebSocket status indicator should be green

## 🧪 Test Real-Time Updates

### Test 1: Guarantee Updates (Easiest to Test)

**Step 1:** Open Two Browser Windows/Tabs
- **Window 1**: Keep your current tab open (http://localhost:3000)
- **Window 2**: Open a new incognito/private window or different browser
  - Go to http://localhost:3000
  - Log in with a different user (or same user is fine)

**Step 2:** Navigate to Guarantees Page
- In both windows, go to the **Guarantees** page
- You should see the guarantees list in both windows

**Step 3:** Create a Guarantee in Window 1
- In **Window 1**, click "Add Guarantee" or "Create Guarantee"
- Fill in the form:
  - Select an elector
  - Select a committee
  - Save the guarantee

**Step 4:** Watch Window 2
- In **Window 2**, you should see:
  - ✅ A snackbar notification: "New guarantee added"
  - ✅ The guarantee appears in the list **automatically** (no refresh needed!)
  - ✅ The list updates in real-time

**Expected Result:**
- Guarantee appears in Window 2 immediately
- No page refresh needed
- Notification appears at the top

---

### Test 2: Update Guarantee

**Step 1:** Update a Guarantee in Window 1
- In **Window 1**, click on an existing guarantee
- Change the status (e.g., PENDING → GUARANTEED)
- Or update mobile number
- Save the changes

**Step 2:** Watch Window 2
- In **Window 2**, you should see:
  - ✅ The guarantee card/row updates automatically
  - ✅ Status change is reflected immediately
  - ✅ No refresh needed

**Expected Result:**
- Changes appear instantly in Window 2
- Real-time synchronization works

---

### Test 3: Delete Guarantee

**Step 1:** Delete a Guarantee in Window 1
- In **Window 1**, click delete on a guarantee
- Confirm the deletion

**Step 2:** Watch Window 2
- In **Window 2**, you should see:
  - ✅ The guarantee disappears from the list automatically
  - ✅ List count updates
  - ✅ No refresh needed

**Expected Result:**
- Guarantee is removed from Window 2 immediately

---

### Test 4: Attendance Updates

**Step 1:** Go to Attendance Page in Both Windows
- Navigate to **Attendance** page in both windows

**Step 2:** Mark Attendance in Window 1
- In **Window 1**, mark an elector as present
- Select committee if needed
- Save

**Step 3:** Watch Window 2
- In **Window 2**, you should see:
  - ✅ Snackbar notification: "New attendance recorded" or "Attendance updated"
  - ✅ Attendance list updates automatically
  - ✅ Statistics refresh if you're on statistics view

**Expected Result:**
- Attendance updates appear in real-time

---

### Test 5: Voting Updates

**Step 1:** Go to Voting/Sorting Page in Both Windows
- Navigate to **Voting** or **Sorting** page in both windows

**Step 2:** Enter Vote Count in Window 1
- In **Window 1**, enter vote count for a candidate
- Save

**Step 3:** Watch Window 2
- In **Window 2**, you should see:
  - ✅ Snackbar notification: "New vote count recorded" or "Vote count updated"
  - ✅ Vote counts list updates automatically
  - ✅ Statistics refresh

**Expected Result:**
- Voting updates appear in real-time

---

## ✅ Success Indicators

### In Browser Console (F12)
You should see these messages:
```
[WebSocket] Connected successfully
[useWebSocket] Connected to real-time updates
```

When updates happen:
```
[WebSocket] Message received: {type: "guarantee_update", action: "created", ...}
```

### In Backend Terminal
When updates happen, you should see:
```
INFO ... consumers WebSocket connected: User ...
```

When broadcasting:
```
INFO ... signals Broadcasting guarantee_update to election_updates group
```

### In UI
- ✅ WebSocket status indicator is **green** (connected)
- ✅ Snackbar notifications appear when updates happen
- ✅ Lists update automatically without refresh
- ✅ No errors in browser console

---

## 🔍 Monitoring Connection

### Check WebSocket Status
Look at the header - there should be a WebSocket status indicator:
- 🟢 **Green** = Connected (good!)
- 🔴 **Red** = Disconnected (check backend)
- 🟡 **Yellow** = Connecting (wait a moment)

### Connection Metrics
You can check connection health in browser console:
```javascript
// In browser console
const wsClient = require('./helpers/websocket/websocketClient').getWebSocketClient();
console.log('Metrics:', wsClient.getMetrics());
console.log('Health:', wsClient.getHealthStatus());
```

---

## 🐛 Troubleshooting

### If Updates Don't Appear

**Check 1:** Verify WebSocket is Connected
- Look at status indicator (should be green)
- Check browser console for connection messages

**Check 2:** Check Backend Logs
- Look for broadcasting messages
- Check for errors

**Check 3:** Verify Both Windows are Logged In
- Both users need to be logged in
- Both should have active WebSocket connections

### If Connection Drops

**Check 1:** Backend Still Running?
- Verify backend terminal shows it's running
- No errors in backend logs

**Check 2:** Check Browser Console
- Look for disconnect messages
- Check for reconnection attempts

**Check 3:** Refresh Frontend
- Sometimes a refresh helps
- WebSocket will reconnect automatically

---

## 🎉 You're Done!

Once you've tested these scenarios and they all work:
- ✅ Real-time guarantee updates work
- ✅ Real-time attendance updates work  
- ✅ Real-time voting updates work
- ✅ WebSocket connection is stable
- ✅ No errors in logs

**Your real-time updates system is fully functional!** 🚀

---

## 📚 What's Next?

### Explore More Features
1. **Test with Multiple Users** (3-4 windows)
2. **Test Rapid Updates** (make many changes quickly)
3. **Test Connection Resilience** (disconnect/reconnect network)
4. **Monitor Performance** (check browser console for metrics)

### Production Deployment
When ready for production:
- Set up Redis 7.x (for multiple server instances)
- Configure SSL/TLS (WSS instead of WS)
- Set up monitoring and alerting
- Configure rate limiting

### Learn More
- Check `REALTIME-UPDATES-PLAN.md` for architecture details
- Check `REALTIME-TROUBLESHOOTING.md` for advanced troubleshooting
- Check `REALTIME-MANUAL-TESTING-CHECKLIST.md` for comprehensive tests

---

**Last Updated**: 2024-11-19  
**Status**: ✅ Ready for Testing

