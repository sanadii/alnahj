# Frontend-Backend Response Standardization
**Date**: October 26, 2025  
**Status**: ✅ **IMPLEMENTED**

---

## 🎯 **Overview**

All backend API responses now follow a standardized format. Frontend reducers and sagas have been updated to properly extract data from this structure.

---

## 📦 **Backend Response Format**

### Standard Success Response
```json
{
  "status": "success",
  "data": {
    // Actual response data here
  },
  "message": "Operation successful",
  "meta": {
    "timestamp": "2025-10-26T16:00:12.722789+00:00",
    "request_id": "42cbe1f1-2ff0-447d-b15e-93eb405c2a87"
  }
}
```

### Example: Login Response
```json
{
  "status": "success",
  "data": {
    "access": "eyJhbGciOi...",
    "refresh": "eyJhbGciOi...",
    "user": {
      "id": 1,
      "email": "admin@admin.com",
      "first_name": "Admin",
      "last_name": "admin",
      "full_name": "Admin admin",
      "phone": "",
      "role": "SUPER_ADMIN",
      "role_display": "Super Admin",
      "supervisor": null,
      "supervisor_name": null,
      "teams": [],
      "committees": [],
      "is_active": true,
      "date_joined": "2025-10-24T19:42:15.914613+03:00",
      "last_login": "2025-10-26T19:00:12.712472+03:00",
      "supervised_users_count": 0
    }
  },
  "message": "Login successful",
  "meta": {
    "timestamp": "2025-10-26T16:00:12.722789+00:00",
    "request_id": "42cbe1f1-2ff0-447d-b15e-93eb405c2a87"
  }
}
```

### Error Response
```json
{
  "status": "error",
  "data": null,
  "message": "Invalid credentials",
  "errors": {
    "email": ["Invalid email format"],
    "password": ["Password too short"]
  },
  "meta": {
    "timestamp": "2025-10-26T16:00:12.722789+00:00",
    "request_id": "42cbe1f1-2ff0-447d-b15e-93eb405c2a87"
  }
}
```

---

## 🔧 **How Axios Wraps Responses**

When using Axios, the backend response is wrapped in `response.data`:

```typescript
// Backend returns:
{
  "status": "success",
  "data": { "user": {...} },
  "message": "Success"
}

// In your saga after axios call:
const response = yield call(apiFunction);

// response.data contains the backend response:
response.data = {
  status: "success",
  data: { user: {...} },
  message: "Success"
}

// So to get the actual data:
const backendResponse = response.data;
const actualData = backendResponse.data;
```

---

## 📝 **Pattern for Sagas**

### ✅ Correct Pattern

```typescript
function* exampleSaga({ payload }: any): Generator<any, void, any> {
  try {
    // 1. Call API
    const response = yield call(apiFunction, payload);
    
    // 2. Extract backend response from axios wrapper
    const backendResponse = response.data;
    
    // 3. Check status
    if (backendResponse && backendResponse.status === 'success') {
      // 4. Extract actual data
      const actualData = backendResponse.data;
      
      // 5. Dispatch to reducer (send only the data, not the wrapper)
      yield put(successAction(actualData));
      
      // 6. Show success message
      toast.success(backendResponse.message || 'Success');
    } else {
      yield put(errorAction({ message: 'Operation failed' }));
      toast.error('Operation failed');
    }
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Operation failed';
    yield put(errorAction({ message: errorMessage }));
    toast.error(errorMessage);
  }
}
```

### ❌ Wrong Pattern (Old Way)

```typescript
function* oldExampleSaga({ payload }: any): Generator<any, void, any> {
  try {
    const response = yield call(apiFunction, payload);
    
    // ❌ Sending wrapped response to reducer
    yield put(successAction(response.data));
    
    // ❌ Trying to access message incorrectly
    toast.success(response.message);
  } catch (error: any) {
    yield put(errorAction(error));
  }
}
```

---

## 📋 **Pattern for Reducers**

### ✅ Correct Pattern

```typescript
case ACTION_SUCCESS:
  // ✅ Payload contains ONLY the actual data (not wrapped)
  // Saga has already extracted backendResponse.data
  return {
    ...state,
    data: action.payload,  // Direct assignment
    loading: false,
    error: null
  };
```

### ❌ Wrong Pattern (Old Way)

```typescript
case ACTION_SUCCESS:
  // ❌ Trying to extract from payload in reducer
  const actualData = action.payload.data || action.payload;
  return {
    ...state,
    data: actualData,
    loading: false,
    error: null
  };
```

**Rule**: Sagas handle extraction, reducers receive clean data.

---

## ✅ **Updated Modules**

### Auth Module
**File**: `frontend/src/store/auth/saga.ts`

#### Login Saga
```typescript
function* loginUserSaga({ payload: { user } }: any): Generator<any, void, any> {
  try {
    const response = yield call(login, {
      email: user.email,
      password: user.password
    });

    // ✅ Extract backend response
    const backendResponse = response.data;
    
    if (backendResponse && backendResponse.status === 'success') {
      // ✅ Extract actual auth data
      const authData = backendResponse.data;
      
      // Store tokens
      sessionStorage.setItem('authUser', JSON.stringify({
        access_token: authData.access,
        accessToken: authData.access,
        refreshToken: authData.refresh,
        user: authData.user
      }));

      if (authData.access) {
        localStorage.setItem('accessToken', authData.access);
        localStorage.setItem('refreshToken', authData.refresh);
        axios.defaults.headers.common.Authorization = `Bearer ${authData.access}`;
      }

      // ✅ Send only user data to reducer
      yield put(loginSuccess(authData.user));
      
      toast.success(backendResponse.message || 'Login successful');
    }
  } catch (error: any) {
    // Error handling...
  }
}
```

#### Register Saga
```typescript
function* registerUserSaga({ payload: { user } }: any): Generator<any, void, any> {
  try {
    const response = yield call(register, user);
    
    // ✅ Extract backend response
    const backendResponse = response.data;
    
    if (backendResponse && backendResponse.status === 'success') {
      // ✅ Extract user data
      const userData = backendResponse.data;
      
      // ✅ Send only user data to reducer
      yield put(registerSuccess(userData));
      toast.success(backendResponse.message || 'Registration successful');
    }
  } catch (error: any) {
    // Error handling...
  }
}
```

#### Profile Update Saga
```typescript
function* profileUpdateSaga({ payload: { user } }: any): Generator<any, void, any> {
  try {
    const response = yield call(updateProfile, user);
    
    // ✅ Extract backend response
    const backendResponse = response.data;
    
    if (backendResponse && backendResponse.status === 'success') {
      // ✅ Extract user data
      const userData = backendResponse.data;
      
      // ✅ Send only user data to reducer
      yield put(profileSuccess(userData));
      toast.success(backendResponse.message || 'Profile updated successfully');
    }
  } catch (error: any) {
    // Error handling...
  }
}
```

**File**: `frontend/src/store/auth/reducer.ts`

```typescript
case AUTH_LOGIN_SUCCESS:
  // ✅ Payload contains user object from backend: { id, email, first_name, ... }
  return {
    ...state,
    user: action.payload,  // Clean user data, no extraction needed
    isLoggedIn: true,
    loginLoading: false,
    error: false,
    loginError: null
  };

case AUTH_PROFILE_SUCCESS:
  // ✅ Payload contains user object from backend: { id, email, first_name, ... }
  return {
    ...state,
    profileLoading: false,
    user: action.payload,  // Clean user data, no extraction needed
    profileSuccess: true,
    profileMessage: 'Profile updated successfully',
    profileError: null
  };
```

---

## 🔄 **Modules to Update**

Apply this pattern to all existing modules:

### Pending Updates
- [ ] User Module (`store/user/`)
- [ ] Users Management Module (`store/users/`)
- [ ] Elections Module (`store/elections/`)
- [ ] Committees Module (`store/committees/`)
- [ ] Future modules...

---

## 📚 **Implementation Checklist**

When updating a module:

### Saga Updates
- [ ] Import response types correctly
- [ ] Extract `const backendResponse = response.data;` after API call
- [ ] Check `backendResponse.status === 'success'`
- [ ] Extract actual data: `const actualData = backendResponse.data;`
- [ ] Pass only actual data to success action: `yield put(successAction(actualData));`
- [ ] Use `backendResponse.message` for toast notifications
- [ ] Handle errors from `error?.response?.data?.message`

### Reducer Updates
- [ ] Remove any `action.payload.data || action.payload` fallbacks
- [ ] Use `action.payload` directly (data is already extracted)
- [ ] Add comments documenting expected payload structure

### Testing
- [ ] Test success flow
- [ ] Test error handling
- [ ] Check browser console for data structure
- [ ] Verify toast messages appear
- [ ] Check Redux DevTools for clean payload

---

## 🎯 **Benefits**

### Before (Inconsistent)
```typescript
// Some sagas did this:
yield put(successAction(response.data));

// Others did this:
yield put(successAction(response.data.data));

// Reducers had fallbacks:
const data = action.payload.data || action.payload;
```

### After (Consistent) ✅
```typescript
// All sagas extract consistently:
const backendResponse = response.data;
const actualData = backendResponse.data;
yield put(successAction(actualData));

// Reducers receive clean data:
return { ...state, data: action.payload };
```

---

## 🔍 **Debugging Tips**

### Check Response Structure
```typescript
function* debugSaga() {
  const response = yield call(apiFunction);
  
  console.log('1. Full axios response:', response);
  console.log('2. Backend response:', response.data);
  console.log('3. Status:', response.data.status);
  console.log('4. Actual data:', response.data.data);
  console.log('5. Message:', response.data.message);
  console.log('6. Meta:', response.data.meta);
}
```

### Check Reducer Payload
```typescript
case ACTION_SUCCESS:
  console.log('Reducer received payload:', action.payload);
  console.log('Type:', typeof action.payload);
  console.log('Keys:', Object.keys(action.payload));
  return { ...state, data: action.payload };
```

---

## 📖 **Examples**

### List Response
```typescript
// Backend returns:
{
  "status": "success",
  "data": {
    "count": 100,
    "next": "...",
    "previous": null,
    "results": [...]
  }
}

// Saga:
const backendResponse = response.data;
const listData = backendResponse.data;  // { count, next, previous, results }
yield put(getListSuccess(listData));

// Reducer:
case GET_LIST_SUCCESS:
  return {
    ...state,
    list: action.payload.results,    // Array of items
    count: action.payload.count,      // Total count
    next: action.payload.next,        // Next page URL
    previous: action.payload.previous // Previous page URL
  };
```

### Create/Update Response
```typescript
// Backend returns:
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Item",
    "created_at": "..."
  },
  "message": "Item created successfully"
}

// Saga:
const backendResponse = response.data;
const itemData = backendResponse.data;  // { id, name, created_at }
yield put(createItemSuccess(itemData));
toast.success(backendResponse.message);

// Reducer:
case CREATE_ITEM_SUCCESS:
  return {
    ...state,
    items: [...state.items, action.payload],  // Add new item
    loading: false
  };
```

---

## ✅ **Status**

```
Auth Module:        ✅ Updated (Login, Register, Profile, Social Login)
User Module:        ⚠️  Pending review
Users Module:       ⚠️  Pending review
Elections Module:   ⚠️  Pending review
Committees Module:  ⚠️  Pending review
```

---

## 🚀 **Next Steps**

1. ✅ **Auth Module** - Complete
2. ⏳ **Review other modules** - Check if they follow the pattern
3. ⏳ **Update inconsistent modules** - Apply the standardization
4. ⏳ **Add TypeScript types** - Strong typing for responses
5. ⏳ **Update documentation** - Keep patterns documented

---

**Pattern Established**: October 26, 2025  
**Auth Module Updated**: October 26, 2025  
**Status**: ✅ **Ready for other modules to follow**

---

## 📞 **Questions?**

If you're implementing this pattern and unsure:
1. Check the Auth module saga as reference
2. Follow the checklist above
3. Test thoroughly in browser DevTools
4. Check Redux DevTools for payload structure

**Remember**: 
- **Sagas extract** → Clean data to reducer
- **Reducers receive** → Direct assignment, no extraction
- **Always check** → `backendResponse.status === 'success'`
- **Always use** → `backendResponse.message` for toasts



