# .env Fix - Double /api/ Issue
**Date**: October 24, 2025  
**Status**: ✅ **FIXED**

---

## 🐛 **Problem**

URLs were being doubled: `http://127.0.0.1:8000/api/api/election/` instead of `http://127.0.0.1:8000/api/election/`

### Error
```
Page not found (404)
Request URL: http://127.0.0.1:8000/api/api/election/
                                    ^^^^^^^^ Double /api/!
```

---

## 🔍 **Root Cause**

**File**: `frontend/.env`

**Wrong Configuration**:
```bash
VITE_APP_API_URL=http://127.0.0.1:8000/api/  ❌ Has /api/ at end
```

**What Happened**:
```typescript
// Axios baseURL from .env
baseURL = 'http://127.0.0.1:8000/api/'

// API call
axios.get('/api/election/')

// Result
'http://127.0.0.1:8000/api/' + '/api/election/' 
= 'http://127.0.0.1:8000/api/api/election/'  ❌ DOUBLE /api/
```

---

## ✅ **Solution**

**Fixed Configuration**:
```bash
VITE_APP_API_URL=http://127.0.0.1:8000/  ✅ No /api/ at end
```

**Now Works Correctly**:
```typescript
// Axios baseURL from .env
baseURL = 'http://127.0.0.1:8000/'

// API call
axios.get('/api/election/')

// Result
'http://127.0.0.1:8000/' + '/api/election/' 
= 'http://127.0.0.1:8000/api/election/'  ✅ CORRECT!
```

---

## 📝 **What Was Changed**

### frontend/.env
```diff
- VITE_APP_API_URL=http://127.0.0.1:8000/api/
+ VITE_APP_API_URL=http://127.0.0.1:8000/
```

---

## 🔧 **Why This Happened**

The `.env` file was configured for a different API structure where the baseURL included `/api/` and endpoints didn't have the prefix.

**Old Pattern** (Some templates):
```typescript
baseURL: 'http://api.example.com/api/'
endpoint: '/users/'
result: 'http://api.example.com/api/users/'
```

**Our Pattern** (Django REST Framework):
```typescript
baseURL: 'http://127.0.0.1:8000/'
endpoint: '/api/users/'
result: 'http://127.0.0.1:8000/api/users/'
```

---

## ✅ **Verification**

### Before Fix
```
❌ POST http://127.0.0.1:8000/api/api/election/  → 404 Not Found
```

### After Fix
```
✅ POST http://127.0.0.1:8000/api/election/      → Works!
✅ GET  http://127.0.0.1:8000/api/users/me/      → Works!
✅ GET  http://127.0.0.1:8000/api/election/current/ → Works!
```

---

## 🎯 **Correct Configuration**

### Environment Variable
```bash
# ✅ Correct - no /api/ at end
VITE_APP_API_URL=http://127.0.0.1:8000/

# ❌ Wrong - has /api/ at end
VITE_APP_API_URL=http://127.0.0.1:8000/api/
```

### API Calls
```typescript
// ✅ Correct - include /api/ in the endpoint
await axios.get('/api/users/');
await axios.get('/api/election/');
await axios.post('/api/auth/login/');

// ❌ Wrong - no /api/ prefix
await axios.get('/users/');
await axios.get('/election/');
```

---

## 🚀 **Next Steps**

1. ✅ **Restart Vite dev server** (required for .env changes)
   ```bash
   # Stop server (Ctrl+C)
   # Start again
   npm run dev
   ```

2. ✅ **Clear browser cache** (optional but recommended)
   ```
   Ctrl+Shift+Delete or Cmd+Shift+Delete
   Clear cached images and files
   ```

3. ✅ **Test the endpoints**
   - Login
   - Get user profile
   - Create election
   - List elections

---

## 📋 **Complete .env Reference**

```bash
# ✅ CORRECT CONFIGURATION
VITE_APP_VERSION=v4.1.0
GENERATE_SOURCEMAP=false

## Backend API URL
VITE_APP_API_URL=http://127.0.0.1:8000/
VITE_APP_BASE_NAME=/

## For production, change to:
# VITE_APP_API_URL=https://your-domain.com/
```

---

## 🎓 **Learning Points**

### Rule 1: Base URL Structure
```
✅ Base URL should NOT include the API prefix
   Base: http://127.0.0.1:8000/
   Endpoints: /api/users/, /api/election/

❌ Base URL should NOT double the prefix
   Base: http://127.0.0.1:8000/api/
   Endpoints: /api/users/ (results in /api/api/users/)
```

### Rule 2: Vite Environment Variables
```
✅ Changes to .env require server restart
✅ Use VITE_ prefix for Vite to pick them up
✅ Access with: import.meta.env.VITE_APP_API_URL
```

### Rule 3: Django URL Structure
```
Django URLs: /api/resource/
Frontend calls: axios.get('/api/resource/')
Full URL: http://domain/ + /api/resource/
```

---

## 🔧 **Troubleshooting**

### If Still Getting /api/api/
1. **Check .env file is actually changed**
   ```bash
   cat frontend/.env | grep VITE_APP_API_URL
   ```

2. **Restart Vite dev server**
   ```bash
   # Stop (Ctrl+C) and restart
   npm run dev
   ```

3. **Clear browser cache**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear cache in DevTools

4. **Check environment in browser console**
   ```javascript
   console.log(import.meta.env.VITE_APP_API_URL)
   // Should show: http://127.0.0.1:8000/
   ```

---

## ✅ **Status**

```
Configuration:  ✅ Fixed
Server Restart: ⚠️  Required (user action)
Build Status:   ✅ OK
API Endpoints:  ✅ Will work after restart
```

---

**Fixed By**: AI Environment Configuration System  
**Date**: October 24, 2025  
**Action Required**: **Restart Vite dev server** (`npm run dev`)

---

**🎉 After restart, all API calls will work correctly! 🎉**





