# Frontend Migration Guide - API Response Structure Change

**Date:** October 25, 2025  
**Version:** 2.0  
**Status:** 🔴 **BREAKING CHANGES**

---

## 📋 Overview

The backend API has been updated to use a **standardized response structure** across ALL endpoints. This is a **breaking change** that requires frontend updates.

### What Changed?

**Before (Old Format):**
```javascript
// Mixed formats - inconsistent!
response.data  // Sometimes direct data
{access: "...", refresh: "...", user: {...}}  // Sometimes custom objects
{message: "...", user: {...}}  // Sometimes hybrid
```

**After (New Standard Format):**
```javascript
// ALWAYS the same structure!
{
  "status": "success",           // NEW: Always present
  "data": {...},                  // ALWAYS present (moved from root)
  "message": "...",              // Optional user message
  "meta": {                       // NEW: Always present
    "timestamp": "2025-10-24T12:00:00Z",
    "request_id": "abc123-..."
  }
}
```

---

## 🚨 Critical Changes Required

### 1. **Access Pattern Change**

**OLD WAY (❌ BROKEN):**
```typescript
// Login
const response = await api.post('/auth/login/', data);
const {access, refresh, user} = response.data;

// Get user
const response = await api.get('/users/me/');
const user = response.data;

// List items
const response = await api.get('/electors/');
const electors = response.data;
```

**NEW WAY (✅ CORRECT):**
```typescript
// Login
const response = await api.post('/auth/login/', data);
const {access, refresh, user} = response.data.data;  // Extra .data!
const status = response.data.status;  // "success"
const timestamp = response.data.meta.timestamp;

// Get user
const response = await api.get('/users/me/');
const user = response.data.data;  // Extra .data!

// List items
const response = await api.get('/electors/');
const electors = response.data.data;  // Extra .data!
```

### 2. **Error Handling Change**

**OLD WAY (❌ BROKEN):**
```typescript
try {
  const response = await api.post('/endpoint/', data);
  // Handle response
} catch (error) {
  const message = error.response.data.error || error.response.data.message;
  // Show error
}
```

**NEW WAY (✅ CORRECT):**
```typescript
try {
  const response = await api.post('/endpoint/', data);
  // Check status
  if (response.data.status === 'error') {
    // Handle error
    console.error(response.data.message);
  } else {
    // Handle success
    const result = response.data.data;
  }
} catch (error) {
  // Network error or DRF validation error
  const message = error.response.data.message;
  const errors = error.response.data.errors;  // Field-level errors
  // Show errors
}
```

---

## 🔧 Step-by-Step Migration

### **Step 1: Update API Helper/Client**

Update your API client to automatically extract `data` from responses:

**File:** `frontend/src/helpers/api_client.ts`

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to extract data
apiClient.interceptors.response.use(
  (response) => {
    // If response has standard structure, extract data
    if (response.data && response.data.status) {
      // Store meta for debugging if needed
      if (response.data.meta) {
        console.debug('Request ID:', response.data.meta.request_id);
      }
      
      // Return wrapped response with easy access
      return {
        ...response,
        data: response.data.data,  // Extract data
        message: response.data.message,
        status: response.data.status,
        meta: response.data.meta,
        _raw: response.data  // Keep original for special cases
      };
    }
    return response;
  },
  (error) => {
    // Handle error response
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      
      // Standardize error
      if (errorData.status === 'error') {
        error.message = errorData.message;
        error.errors = errorData.errors;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

**With this interceptor**, your existing code will mostly work! But you should still update it for clarity.

---

### **Step 2: Update Authentication**

**File:** `frontend/src/helpers/api/account.ts`

**OLD:**
```typescript
export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/api/auth/login/', {email, password});
  return response.data;  // {access, refresh, user}
};
```

**NEW:**
```typescript
export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/api/auth/login/', {email, password});
  // With interceptor, response.data is already extracted
  return response.data;  // Still works!
  
  // Or be explicit:
  return {
    access: response.data.access,
    refresh: response.data.refresh,
    user: response.data.user,
    message: response.message  // "Login successful"
  };
};

export const logout = async (refresh: string) => {
  const response = await apiClient.post('/api/auth/logout/', {refresh});
  return response.message;  // "Successfully logged out"
};

export const getCurrentUser = async () => {
  const response = await apiClient.get('/api/users/me/');
  return response.data;  // User object
};
```

---

### **Step 3: Update Redux Actions**

**File:** `frontend/src/store/auth/actions.ts` (or similar)

**OLD:**
```typescript
export const loginUser = (email: string, password: string) => async (dispatch) => {
  try {
    const response = await api.post('/api/auth/login/', {email, password});
    const {access, refresh, user} = response.data;
    
    dispatch({type: 'LOGIN_SUCCESS', payload: {access, refresh, user}});
  } catch (error) {
    dispatch({type: 'LOGIN_FAIL', payload: error.response.data.error});
  }
};
```

**NEW:**
```typescript
export const loginUser = (email: string, password: string) => async (dispatch) => {
  try {
    const response = await api.post('/api/auth/login/', {email, password});
    
    // Check status (if not using interceptor)
    if (response.data.status === 'error') {
      dispatch({type: 'LOGIN_FAIL', payload: response.data.message});
      return;
    }
    
    // With interceptor, response.data is clean
    const {access, refresh, user} = response.data;
    
    dispatch({
      type: 'LOGIN_SUCCESS', 
      payload: {access, refresh, user},
      message: response.message  // Show toast: "Login successful"
    });
  } catch (error) {
    dispatch({
      type: 'LOGIN_FAIL', 
      payload: error.response.data.message || 'Login failed'
    });
  }
};
```

---

### **Step 4: Update List/Pagination Handling**

**OLD:**
```typescript
const fetchElectors = async () => {
  const response = await api.get('/api/electors/');
  // DRF pagination: {count, next, previous, results}
  setElectors(response.data.results || response.data);
  setPagination({
    count: response.data.count,
    next: response.data.next,
    previous: response.data.previous
  });
};
```

**NEW:**
```typescript
const fetchElectors = async () => {
  const response = await api.get('/api/electors/');
  
  // New structure: {status, data, meta: {pagination}}
  setElectors(response.data);  // Direct array with interceptor
  
  // Pagination now in meta
  if (response.meta && response.meta.pagination) {
    setPagination({
      count: response.meta.pagination.count,
      next: response.meta.pagination.next,
      previous: response.meta.pagination.previous
    });
  }
};
```

---

### **Step 5: Update Error Display**

**Component Example:**

**OLD:**
```typescript
const handleSubmit = async (data) => {
  try {
    const response = await api.post('/api/endpoint/', data);
    toast.success('Success!');
  } catch (error) {
    toast.error(error.response.data.error || 'Failed');
  }
};
```

**NEW:**
```typescript
const handleSubmit = async (data) => {
  try {
    const response = await api.post('/api/endpoint/', data);
    
    // Show message from backend
    if (response.message) {
      toast.success(response.message);
    } else {
      toast.success('Success!');
    }
  } catch (error) {
    // Show standardized error message
    const message = error.response?.data?.message || 'Operation failed';
    toast.error(message);
    
    // Show field errors if present
    if (error.response?.data?.errors) {
      Object.entries(error.response.data.errors).forEach(([field, errors]) => {
        toast.error(`${field}: ${errors[0]}`);
      });
    }
  }
};
```

---

### **Step 6: Update Reducers** (if using Redux)

**File:** `frontend/src/store/elections/reducer.ts`

**OLD:**
```typescript
case 'FETCH_ELECTIONS_SUCCESS':
  return {
    ...state,
    elections: action.payload,  // Direct array or {results}
    loading: false
  };
```

**NEW:**
```typescript
case 'FETCH_ELECTIONS_SUCCESS':
  return {
    ...state,
    elections: action.payload.data || action.payload,  // Handle both formats during migration
    meta: action.payload.meta,  // Store metadata
    loading: false
  };
```

---

## 📝 Complete Example: Full Flow

### Before Migration:
```typescript
// Login Component (OLD)
const handleLogin = async (email, password) => {
  try {
    const response = await axios.post('/api/auth/login/', {email, password});
    const {access, refresh, user} = response.data;
    
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    setUser(user);
    
    toast.success('Login successful!');
    navigate('/dashboard');
  } catch (error) {
    toast.error(error.response.data.error || 'Login failed');
  }
};
```

### After Migration:
```typescript
// Login Component (NEW)
const handleLogin = async (email, password) => {
  try {
    const response = await axios.post('/api/auth/login/', {email, password});
    
    // Extract from standard structure
    const {access, refresh, user} = response.data.data;
    const message = response.data.message;  // "Login successful"
    
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    setUser(user);
    
    toast.success(message);  // Use backend message
    navigate('/dashboard');
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed';
    toast.error(message);
  }
};
```

---

## 🎯 Migration Checklist

### Core Files to Update:

- [ ] **API Client/Helper** (`helpers/api_client.ts`)
  - Add response interceptor
  - Extract `data` from standard structure

- [ ] **Authentication** (`helpers/api/account.ts`, `store/auth/`)
  - Update login/logout/register
  - Update token refresh
  - Update user profile fetching

- [ ] **Elections** (`helpers/api/elections.ts`, `store/elections/`)
  - Update CRUD operations
  - Update list fetching with pagination

- [ ] **Electors** (`helpers/api/electors.ts`)
  - Update elector operations
  - Update search/filter

- [ ] **Attendance** (`helpers/api/attendance.ts`)
  - Update mark attendance
  - Update statistics fetching

- [ ] **Voting** (`helpers/api/voting.ts`)
  - Update vote entry
  - Update results fetching

- [ ] **Guarantees** (`helpers/api/guarantees.ts`)
  - Update guarantee operations
  - Update statistics

- [ ] **Reports** (`helpers/api/reports.ts`)
  - Update dashboard data fetching
  - Update report generation

### Components to Test:

- [ ] Login/Logout
- [ ] Dashboard (all user roles)
- [ ] Elector Management
- [ ] Attendance Marking
- [ ] Vote Entry
- [ ] Guarantee Collection
- [ ] Reports Generation
- [ ] All forms (create/update)
- [ ] All list views (pagination)
- [ ] Error handling

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot read property 'X' of undefined"

**Cause:** Trying to access `response.data.X` directly

**Solution:**
```typescript
// OLD: response.data.user
// NEW: response.data.data.user
```

### Issue 2: Pagination not working

**Cause:** Looking for pagination in `response.data` instead of `response.data.meta`

**Solution:**
```typescript
// OLD: response.data.count
// NEW: response.data.meta.pagination.count
```

### Issue 3: Error messages not showing

**Cause:** Looking for `error.response.data.error` instead of `error.response.data.message`

**Solution:**
```typescript
// OLD: error.response.data.error
// NEW: error.response.data.message
```

---

## ✅ Testing Strategy

### 1. **Unit Tests**
Update API call mocks to return new structure:

```typescript
// OLD mock
jest.mock('api', () => ({
  get: jest.fn(() => Promise.resolve({data: {id: 1, name: 'Test'}}))
}));

// NEW mock
jest.mock('api', () => ({
  get: jest.fn(() => Promise.resolve({
    data: {
      status: 'success',
      data: {id: 1, name: 'Test'},
      meta: {
        timestamp: '2025-10-24T12:00:00Z',
        request_id: 'test-123'
      }
    }
  }))
}));
```

### 2. **Integration Tests**
Test full flows:
- Login → Dashboard → Logout
- Create Elector → List Electors → Update → Delete
- Mark Attendance → View Statistics
- Enter Votes → Generate Results

### 3. **Manual Testing**
Use browser DevTools Network tab:
- Verify all responses have `status` field
- Verify all responses have `meta` field
- Verify error responses have `message` field

---

## 🎉 Benefits of New Structure

1. **✅ Consistency:** Every endpoint returns the same structure
2. **✅ Status Checking:** Easy to distinguish success/error
3. **✅ User Messages:** Backend provides user-friendly messages
4. **✅ Request Tracking:** Every request has unique ID and timestamp
5. **✅ Better Debugging:** Metadata helps track issues
6. **✅ Future-Proof:** Easy to add more metadata without breaking changes

---

## 📞 Need Help?

If you encounter issues during migration:

1. **Check Response Structure:** Use browser DevTools to inspect actual API responses
2. **Check Interceptor:** Ensure interceptor is processing responses correctly
3. **Check Error Handling:** Verify error responses match new format
4. **Test Incrementally:** Update one module at a time, test thoroughly

---

## 🚀 Deployment Strategy

### Option 1: Big Bang (Recommended for Small Apps)
1. Update all frontend code
2. Test thoroughly in development
3. Deploy backend + frontend together

### Option 2: Gradual (For Large Apps)
1. Deploy backend first (new responses)
2. Add response interceptor to handle both formats
3. Update frontend modules one by one
4. Remove compatibility layer once all updated

---

**Migration Complete!** 🎊

Once you've updated all API calls and tested thoroughly, your frontend will be fully compatible with the new standardized backend responses!

