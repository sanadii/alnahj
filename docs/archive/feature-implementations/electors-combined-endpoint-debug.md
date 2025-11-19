# Debugging Combined Endpoint

## ✅ What's Working

1. **Backend Endpoint**: ✅ Tested and working
   ```
   GET /api/electors/?page=1&page_size=5&include=groups
   
   Response:
   - Status: success
   - Data keys: electors, groups
   - Electors count: 50
   - Groups count: 3
   ```

2. **Backend Fix**: ✅ Removed `.annotate()` conflict with property

## 🔍 Debug Flow to Check

### Browser Console Logs (Expected Order):

```javascript
1. Component Mount:
🔄 [ElectorsList] Mounting component - fetching electors with groups

2. Redux Action Dispatch:
🔄 [Saga] getElectorsSaga - Include groups: true
📦 [Saga] Using combined endpoint with groups

3. API Call:
🔄 [API Combined] Fetching electors with filters: {...} include: ['groups']
📦 [API Combined] Including related data: ['groups']
📤 [API Combined] Sending request with params: {...}

4. API Response:
📥 [API Combined] Raw response: {...}
✅ [API Combined] Normalized response: {...}
📊 [API Combined] Electors: 50 Groups: 3

5. Saga Processing:
✅ [Saga] getElectorsSaga - Full Response: {...}
📦 [Saga] getElectorsSaga - COMBINED FORMAT detected
✅ [Saga] Combined response - electors: 50 groups: 3 total: 8719
🎯 [Saga] Dispatching success with: {electorsCount: 50, totalCount: 8719, groupsCount: 3}

6. Reducer Update:
🔄 [Reducer] GET_ELECTORS_SUCCESS received
📦 [Reducer] Payload: {...}
📊 [Reducer] Electors count: 50
📊 [Reducer] Total count: 8719
📊 [Reducer] Groups count: 3

7. Component Update:
🔍 [ElectorsList] State updated:
  - Electors: 50
  - Total Count: 8719
  - Loading: false
  - Error: null
  - Groups: 3
```

## 🔧 If Table is Empty, Check:

### 1. Browser Console
Look for error messages or unexpected data structure

### 2. Redux DevTools (if installed)
Check `state.electors`:
```javascript
{
  electors: [...],  // Should have data
  groups: [...],    // Should have data
  totalCount: 8719,
  loading: false,
  error: null
}
```

### 3. Network Tab
Check the request:
```
GET /api/electors/?is_active=true&page=1&page_size=25&include=groups
```

Response should have:
```json
{
  "status": "success",
  "data": {
    "electors": [...],
    "groups": [...]
  }
}
```

### 4. Common Issues:

❌ **If you see old format (array):**
- Browser cache issue
- Hard refresh: Ctrl+Shift+R

❌ **If groups are undefined:**
- Token might be invalid
- User might not have groups

❌ **If electors are empty:**
- Check saga is dispatching with correct payload
- Check reducer is receiving correct action

## 🚀 Quick Test Commands

### Test Backend:
```bash
cd backend
.\venv\Scripts\python.exe manage.py shell -c "from apps.guarantees.models import GuaranteeGroup; print(GuaranteeGroup.objects.count(), 'groups in database')"
```

### Test Endpoint:
```powershell
$token = "YOUR_TOKEN_HERE"
$headers = @{Authorization = "Bearer $token"}
$response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/electors/?page=1&page_size=5&include=groups" -Headers $headers
Write-Host "Electors: $($response.data.electors.Count)"
Write-Host "Groups: $($response.data.groups.Count)"
```

## 📋 Checklist

- [ ] Backend returns combined data (✅ VERIFIED)
- [ ] Frontend calls combined endpoint with `includeGroups: true`
- [ ] Saga detects combined format
- [ ] Saga dispatches with groups
- [ ] Reducer stores electors and groups
- [ ] Component receives data from selector
- [ ] Table displays electors
- [ ] Dialog shows groups

## 🎯 Next Steps

1. Open `http://localhost:3001/electors`
2. Open browser console (F12)
3. Look for the log sequence above
4. Check for any error messages
5. Report which step is failing

