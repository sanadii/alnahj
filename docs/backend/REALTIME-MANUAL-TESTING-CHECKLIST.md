# Real-Time Updates - Manual Testing Checklist

## Overview

This checklist is used to manually verify that real-time updates work correctly across the system.

## Prerequisites

### Backend Setup
- [ ] Django backend is running (on port 8000)
- [ ] Redis server is running (or using InMemory channel layer)
- [ ] ASGI server is configured (Daphne or Django runserver)
- [ ] WebSocket routing is configured (`/ws/election-updates/`)
- [ ] JWT authentication is working

### Frontend Setup
- [ ] Frontend is running (on port 3000)
- [ ] User is logged in with valid JWT token
- [ ] WebSocket client is initialized
- [ ] Browser console is open for debugging

## Test Environment Setup

### Test Users
- [ ] User 1: Admin/Supervisor (Window 1)
- [ ] User 2: Regular User (Window 2)
- [ ] Both users logged in simultaneously

### Browser Windows
- [ ] Window 1: User 1 (Chrome/Edge)
- [ ] Window 2: User 2 (Firefox/Incognito)
- [ ] Both windows on same machine or different machines

## Test Scenarios

### 1. WebSocket Connection

#### 1.1 Initial Connection
- [ ] **Window 1**: Login as User 1
  - [ ] Check browser console for: `[WebSocket] Attempting to connect to: ws://...`
  - [ ] Check browser console for: `[WebSocket] Connected successfully`
  - [ ] Check WebSocket status indicator in header (should show green/connected)
  - [ ] Verify connection confirmation message received

#### 1.2 Connection on Login
- [ ] **Window 1**: Logout
  - [ ] Verify WebSocket disconnects
  - [ ] Check console for disconnect message
- [ ] **Window 1**: Login again
  - [ ] Verify WebSocket reconnects automatically
  - [ ] Check connection success message

#### 1.3 Connection Failure Handling
- [ ] **Window 1**: Stop backend server
  - [ ] Verify error message: "Connection failed. Is the WebSocket server running?"
  - [ ] Check WebSocket status indicator (should show red/disconnected)
- [ ] **Window 1**: Start backend server
  - [ ] Verify automatic reconnection (if implemented)
  - [ ] Or verify manual reconnection works

### 2. Guarantee Updates

#### 2.1 Create Guarantee
- [ ] **Window 1**: Create a new guarantee
  - [ ] Fill in guarantee form
  - [ ] Submit guarantee
- [ ] **Window 2**: Verify real-time update
  - [ ] Check guarantee list updates automatically
  - [ ] Check snackbar notification: "New guarantee added"
  - [ ] Verify guarantee appears in list without page refresh

#### 2.2 Update Guarantee
- [ ] **Window 1**: Update an existing guarantee
  - [ ] Change guarantee status (e.g., PENDING → GUARANTEED)
  - [ ] Or update mobile number
  - [ ] Save changes
- [ ] **Window 2**: Verify real-time update
  - [ ] Check guarantee card/row updates automatically
  - [ ] Verify status change is reflected
  - [ ] No page refresh needed

#### 2.3 Delete Guarantee
- [ ] **Window 1**: Delete a guarantee
  - [ ] Click delete button
  - [ ] Confirm deletion
- [ ] **Window 2**: Verify real-time update
  - [ ] Check guarantee disappears from list automatically
  - [ ] Verify list count updates
  - [ ] No page refresh needed

### 3. Attendance Updates

#### 3.1 Mark Attendance
- [ ] **Window 1**: Mark attendance for an elector
  - [ ] Navigate to Attendance page
  - [ ] Select committee
  - [ ] Mark elector as present
- [ ] **Window 2**: Verify real-time update
  - [ ] Check attendance list updates automatically
  - [ ] Check snackbar notification: "New attendance recorded" or "Attendance updated"
  - [ ] Verify statistics update (if on statistics view)
  - [ ] No page refresh needed

#### 3.2 Multiple Attendance Marks
- [ ] **Window 1**: Mark attendance for 5 electors quickly
- [ ] **Window 2**: Verify all updates received
  - [ ] Check all 5 electors appear in list
  - [ ] Verify no duplicate entries
  - [ ] Check statistics update correctly

### 4. Voting Updates

#### 4.1 Enter Vote Count
- [ ] **Window 1**: Enter vote count for a candidate
  - [ ] Navigate to Voting/Sorting page
  - [ ] Enter vote count
  - [ ] Save vote count
- [ ] **Window 2**: Verify real-time update
  - [ ] Check vote counts list updates automatically
  - [ ] Check snackbar notification: "New vote count recorded" or "Vote count updated"
  - [ ] Verify statistics update (if on statistics view)
  - [ ] No page refresh needed

#### 4.2 Generate Results
- [ ] **Window 1**: Generate election results
  - [ ] Click "Generate Results" button
  - [ ] Wait for results generation
- [ ] **Window 2**: Verify real-time update
  - [ ] Check snackbar notification: "Election results updated"
  - [ ] Verify results page updates (if open)
  - [ ] Verify statistics refresh

### 5. Dashboard Updates

#### 5.1 Statistics Update
- [ ] **Window 1**: Make changes that affect dashboard statistics
  - [ ] Create guarantee
  - [ ] Mark attendance
  - [ ] Enter vote count
- [ ] **Window 2**: Verify dashboard update
  - [ ] Check snackbar notification: "Dashboard statistics updated"
  - [ ] Navigate to dashboard
  - [ ] Verify statistics are updated (may need manual refresh)

### 6. Connection Resilience

#### 6.1 Network Interruption
- [ ] **Window 1**: Disconnect network (disable WiFi/Ethernet)
  - [ ] Verify WebSocket disconnects
  - [ ] Check error message in console
  - [ ] Check WebSocket status indicator (red/disconnected)
- [ ] **Window 1**: Reconnect network
  - [ ] Verify automatic reconnection (if implemented)
  - [ ] Or verify manual reconnection works
  - [ ] Check connection success message

#### 6.2 Token Refresh
- [ ] **Window 1**: Wait for token to expire (or manually expire)
  - [ ] Make an action that triggers WebSocket message
  - [ ] Verify token refresh happens automatically
  - [ ] Verify connection remains active after refresh
  - [ ] Check no error messages

#### 6.3 Server Restart
- [ ] **Window 1**: Restart backend server
  - [ ] Verify WebSocket disconnects
  - [ ] Check disconnect message
- [ ] **Window 1**: Wait for server to restart
  - [ ] Verify automatic reconnection (if implemented)
  - [ ] Or verify manual reconnection works
  - [ ] Test that updates still work after reconnection

### 7. Multiple Users

#### 7.1 Concurrent Updates
- [ ] **Window 1 & 2**: Both users make updates simultaneously
  - [ ] Window 1: Create guarantee
  - [ ] Window 2: Mark attendance (at same time)
  - [ ] Verify both updates are received in both windows
  - [ ] Verify no conflicts or data loss

#### 7.2 High Frequency Updates
- [ ] **Window 1**: Make 10 rapid updates (create/update guarantees)
- [ ] **Window 2**: Verify all updates received
  - [ ] Check all 10 updates appear
  - [ ] Verify no missing updates
  - [ ] Verify correct order (if order matters)

### 8. Error Handling

#### 8.1 Invalid Token
- [ ] **Window 1**: Manually set invalid token in localStorage
  - [ ] Refresh page
  - [ ] Verify connection fails with appropriate error
  - [ ] Check error message: "Authentication failed" or similar

#### 8.2 Server Error
- [ ] **Window 1**: Trigger server error (e.g., invalid data)
  - [ ] Verify error is handled gracefully
  - [ ] Check error message in console
  - [ ] Verify connection remains active

### 9. Performance

#### 9.1 Large Data Updates
- [ ] **Window 1**: Create/update large number of records (50+)
- [ ] **Window 2**: Verify updates are received
  - [ ] Check performance (no lag/freezing)
  - [ ] Verify all updates processed
  - [ ] Check memory usage (no leaks)

#### 9.2 Long-Running Connection
- [ ] **Window 1**: Keep connection open for 1 hour
  - [ ] Make periodic updates
  - [ ] Verify connection remains stable
  - [ ] Check for memory leaks
  - [ ] Verify ping/pong keeps connection alive

## Test Results Template

### Test Date: _______________
### Tester: _______________
### Environment: _______________

| Test # | Test Case | Status | Notes |
|--------|-----------|--------|-------|
| 1.1 | Initial Connection | ⬜ Pass / ⬜ Fail | |
| 1.2 | Connection on Login | ⬜ Pass / ⬜ Fail | |
| 1.3 | Connection Failure | ⬜ Pass / ⬜ Fail | |
| 2.1 | Create Guarantee | ⬜ Pass / ⬜ Fail | |
| 2.2 | Update Guarantee | ⬜ Pass / ⬜ Fail | |
| 2.3 | Delete Guarantee | ⬜ Pass / ⬜ Fail | |
| 3.1 | Mark Attendance | ⬜ Pass / ⬜ Fail | |
| 3.2 | Multiple Attendance | ⬜ Pass / ⬜ Fail | |
| 4.1 | Enter Vote Count | ⬜ Pass / ⬜ Fail | |
| 4.2 | Generate Results | ⬜ Pass / ⬜ Fail | |
| 5.1 | Dashboard Update | ⬜ Pass / ⬜ Fail | |
| 6.1 | Network Interruption | ⬜ Pass / ⬜ Fail | |
| 6.2 | Token Refresh | ⬜ Pass / ⬜ Fail | |
| 6.3 | Server Restart | ⬜ Pass / ⬜ Fail | |
| 7.1 | Concurrent Updates | ⬜ Pass / ⬜ Fail | |
| 7.2 | High Frequency | ⬜ Pass / ⬜ Fail | |
| 8.1 | Invalid Token | ⬜ Pass / ⬜ Fail | |
| 8.2 | Server Error | ⬜ Pass / ⬜ Fail | |
| 9.1 | Large Data | ⬜ Pass / ⬜ Fail | |
| 9.2 | Long-Running | ⬜ Pass / ⬜ Fail | |

## Known Issues

List any issues found during testing:

1. **Issue**: _______________
   - **Steps to Reproduce**: _______________
   - **Expected**: _______________
   - **Actual**: _______________
   - **Severity**: ⬜ Critical / ⬜ High / ⬜ Medium / ⬜ Low

2. **Issue**: _______________
   - **Steps to Reproduce**: _______________
   - **Expected**: _______________
   - **Actual**: _______________
   - **Severity**: ⬜ Critical / ⬜ High / ⬜ Medium / ⬜ Low

## Notes

Additional observations or recommendations:

---

**Last Updated**: 2024-11-19  
**Version**: 1.0.0

