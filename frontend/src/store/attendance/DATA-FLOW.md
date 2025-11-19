# Attendance Data Flow

## Redux State Structure

```typescript
state.attendance = {
  // Data
  items: Attendance[];              // List of all attendance records
  item: Attendance | null;          // Single attendance record
  searchResult: ElectorSearchResult | null;  // Search result
  statistics: AttendanceStatistics | null;   // Committee statistics
  committeeList: CommitteeAttendanceList | null;  // Full committee data
  
  // Loading states
  loading: boolean;                 // General loading (list, delete)
  searchLoading: boolean;           // Search in progress
  markingLoading: boolean;          // Marking attendance in progress
  statsLoading: boolean;            // Stats loading
  
  // Error states
  error: string | null;             // General error
  searchError: string | null;       // Search error
  
  // Metadata
  totalCount: number;               // Total count of items
}
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER ACTION                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  COMPONENT                                                       │
│  - AttendanceSearch: dispatch(searchElectorRequest({koc_id}))  │
│  - AttendanceList: dispatch(getAttendancesRequest({}))         │
│  - AttendanceStats: dispatch(getAttendanceStatisticsRequest()) │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  ACTION                                                          │
│  { type: 'SEARCH_ELECTOR_REQUEST', payload: { koc_id } }       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  REDUCER (sets loading state)                                   │
│  state.searchLoading = true                                     │
│  state.searchError = null                                       │
│  state.searchResult = null                                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  SAGA (watches for action)                                      │
│  searchElectorSaga()                                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  API CALL                                                        │
│  GET /api/attendees/search-elector/?koc_id=64003               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND RESPONSE                                                │
│  {                                                               │
│    data: {                                                       │
│      found: true,                                               │
│      elector: {                                                 │
│        koc_id: "64003",                                         │
│        full_name: "...",                                        │
│        has_attended: false,                                     │
│        ...                                                      │
│      }                                                          │
│    },                                                           │
│    message: "..."                                               │
│  }                                                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  SAGA PROCESSES RESPONSE                                         │
│  yield put(actions.searchElectorSuccess(response.data))        │
│  // response.data = { found: true, elector: {...} }            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  ACTION                                                          │
│  { type: 'SEARCH_ELECTOR_SUCCESS',                             │
│    payload: { found: true, elector: {...} } }                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  REDUCER (updates state)                                        │
│  state.searchLoading = false                                    │
│  state.searchResult = action.payload                           │
│  state.searchError = null                                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  COMPONENT RE-RENDERS                                           │
│  const { searchResult } = useSelector(state => state.attendance)│
│  // searchResult = { found: true, elector: {...} }             │
└─────────────────────────────────────────────────────────────────┘
```

## How to Access Data in Components

### Option 1: Direct State Access (Currently Used)
```typescript
import { useSelector } from 'react-redux';
import { RootState } from 'store';

const Component = () => {
  const { items, loading, error } = useSelector(
    (state: RootState) => state.attendance
  );
  
  // Access data
  console.log(items);  // Attendance[]
  console.log(loading);  // boolean
  console.log(error);  // string | null
};
```

### Option 2: Using Selector (Alternative)
```typescript
import { useSelector } from 'react-redux';
import { attendanceSelector } from 'selectors';

const Component = () => {
  const { items, loading, error } = useSelector(attendanceSelector);
  
  // Same result as Option 1
};
```

## Current Component Usage

### AttendanceSearch
```typescript
const { searchResult, searchLoading, markingLoading, searchError } = 
  useSelector((state: RootState) => state.attendance);

// Accesses:
// - searchResult: { found: boolean, elector?: {...}, error?: string }
// - searchLoading: boolean
// - markingLoading: boolean
// - searchError: string | null
```

### AttendanceList
```typescript
const { items, loading, error } = 
  useSelector((state: RootState) => state.attendance);

// Accesses:
// - items: Attendance[]
// - loading: boolean
// - error: string | null
```

### AttendanceStats
```typescript
const { statistics, statsLoading, error } = 
  useSelector((state: RootState) => state.attendance);

// Accesses:
// - statistics: AttendanceStatistics | null
// - statsLoading: boolean
// - error: string | null
```

## Data Updates

### When Search is Performed
```
1. User types KOC ID → "64003"
2. User clicks Search
3. dispatch(searchElectorRequest({ koc_id: "64003" }))
4. Reducer: state.searchLoading = true
5. Saga: API call to /api/attendees/search-elector/?koc_id=64003
6. API returns: { data: { found: true, elector: {...} } }
7. Saga: dispatch(searchElectorSuccess(response.data))
8. Reducer: state.searchResult = { found: true, elector: {...} }
9. Component re-renders with searchResult
```

### When Attendance is Marked
```
1. User clicks "Mark Attended"
2. dispatch(markAttendanceRequest({ koc_id, committee_code, notes }))
3. Reducer: state.markingLoading = true
4. Saga: API call to /api/attendees/mark/
5. API returns: { data: { id: 1, elector_koc_id: "64003", ... } }
6. Saga: dispatch(markAttendanceSuccess(response.data))
7. Reducer: 
   - state.items = [newAttendance, ...state.items]
   - state.searchResult = null (cleared)
   - state.markingLoading = false
8. Components re-render:
   - AttendanceSearch: search cleared
   - AttendanceList: new item appears at top
   - AttendanceStats: count updates
```

### When List is Loaded
```
1. Component mounts
2. useEffect(() => dispatch(getAttendancesRequest({})), [])
3. Reducer: state.loading = true
4. Saga: API call to /api/attendees/
5. API returns: { data: [{...}, {...}, ...] }
6. Saga: dispatch(getAttendancesSuccess(response.data))
7. Reducer:
   - state.items = response.data
   - state.totalCount = response.data.length
   - state.loading = false
8. Component re-renders with items
```

## Debugging Tips

### Check Redux DevTools
```javascript
// In browser console:
store.getState().attendance

// Should show:
// {
//   items: [...],
//   searchResult: {...},
//   loading: false,
//   ...
// }
```

### Add Console Logs
```typescript
// In component:
const attendance = useSelector((state: RootState) => state.attendance);
console.log('📊 Attendance State:', attendance);
console.log('📋 Items:', attendance.items);
console.log('🔍 Search Result:', attendance.searchResult);
```

### Check Saga Logs
Look for these console logs in the browser:
```
📋 [AttendanceSaga] Initializing attendance saga watchers
✅ [AttendanceSaga] Attendance saga watchers registered
```

### Check Network Tab
1. Open DevTools → Network tab
2. Search for elector
3. Check request:
   - URL: http://127.0.0.1:8000/api/attendees/search-elector/?koc_id=64003
   - Method: GET
   - Status: 200 (should be successful)
4. Check response:
   ```json
   {
     "data": {
       "found": true,
       "elector": { ... }
     }
   }
   ```

## Common Issues

### 1. Data is undefined
**Problem**: `state.attendance.items` is `undefined`
**Solution**: Check if reducer is registered in `rootReducer.ts`

### 2. Loading never stops
**Problem**: `loading` stays `true`
**Solution**: Check if saga is dispatching success/error actions

### 3. Search result is null
**Problem**: `searchResult` is always `null`
**Solution**: 
- Check API response format
- Check saga is calling `searchElectorSuccess(response.data)`
- Check reducer is setting `searchResult: action.payload`

### 4. Items not updating after mark
**Problem**: List doesn't show new attendance
**Solution**: Check reducer `MARK_ATTENDANCE_SUCCESS` adds to `items` array

## File Locations

- **Types**: `frontend/src/types/attendance.ts`
- **Reducer**: `frontend/src/store/attendance/reducer.ts`
- **Actions**: `frontend/src/store/attendance/actions.ts`
- **Saga**: `frontend/src/store/attendance/saga.ts`
- **Selector**: `frontend/src/selectors/attendanceSelector.ts`
- **Components**: `frontend/src/views/attendance/components/`
- **API**: `frontend/src/helpers/api/attendance.ts`

## Quick Reference

```typescript
// Dispatch actions
dispatch(searchElectorRequest({ koc_id: '64003' }))
dispatch(markAttendanceRequest({ koc_id, committee_code, notes }))
dispatch(getAttendancesRequest({}))
dispatch(getAttendanceStatisticsRequest('EK-II'))

// Access state
const { items, searchResult, statistics, loading } = 
  useSelector((state: RootState) => state.attendance);
```



