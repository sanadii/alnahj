# Frontend API Response Handling

## Problem Statement

The backend API responses are **NOT** following the documented standard format (see `backend/RESPONSE-STRUCTURE-AUDIT.md`). This creates inconsistency in frontend code.

### Backend Issues:
1. ❌ No `status` field on responses
2. ❌ No `meta` object with timestamp/request_id  
3. ❌ Inconsistent wrapping - some endpoints return data directly, others wrap it
4. ❌ Error format uses `error` instead of `errors`

### Examples of Actual Backend Responses:

#### Direct Data (Most Common):
```json
{
  "id": 1,
  "name": "Kuwait Election 2025",
  "status": "ACTIVE"
}
```

#### Wrapped Data (Some Endpoints):
```json
{
  "data": {...},
  "message": "Success"
}
```

#### Custom Format (Auth Endpoints):
```json
{
  "access": "token...",
  "refresh": "token...",
  "user": {...}
}
```

#### Error Format:
```json
{
  "error": "Invalid token"
}
```

## Solution: Response Normalizer

We've created `responseNormalizer.ts` to handle these inconsistencies in ONE place.

### How It Works:

```typescript
import { wrapResponse, wrapListResponse } from './responseNormalizer';

// For single objects
export const getElection = async (id: number) => {
  const response = await axios.get(`/api/elections/${id}/`);
  return wrapResponse<Election>(response.data);
  // ✅ Always returns: {data: Election, message?: string}
};

// For lists/pagination
export const getElections = async (filters?: any) => {
  const response = await axios.get('/api/elections/', { params: filters });
  return wrapListResponse<Election>(response.data);
  // ✅ Always returns: {data: {results: Election[], count: number}, message?: string}
};
```

### Benefits:

1. **Consistency**: All API functions return same format regardless of backend
2. **Single Point of Change**: When backend is fixed, update one file
3. **Type Safety**: TypeScript enforces `APIResponse<T>` everywhere
4. **Backward Compatible**: Works with current AND future backend format

## Implementation Status

### ✅ Completed:
- Created `responseNormalizer.ts` utility
- Updated `elections.ts` getCurrentElection
- Updated `elections.ts` getElections
- Updated `elections.ts` getElection

### 🔄 In Progress:
- Updating other election endpoints
- Updating attendance endpoints
- Updating voting endpoints
- Updating guarantees endpoints

### ⏳ TODO:
- Update all remaining API helpers
- Add comprehensive tests
- Document when backend is fixed

## Usage Guidelines

### For New API Endpoints:

```typescript
// DON'T DO THIS:
export const myEndpoint = async () => {
  const response = await axios.get('/api/my-endpoint/');
  return response.data; // ❌ May be inconsistent
};

// DO THIS:
export const myEndpoint = async () => {
  const response = await axios.get('/api/my-endpoint/');
  return wrapResponse<MyType>(response.data); // ✅ Always consistent
};
```

### For List Endpoints:

```typescript
export const myListEndpoint = async () => {
  const response = await axios.get('/api/my-list/');
  return wrapListResponse<MyType>(response.data); // ✅ Handles pagination
};
```

### In Sagas:

```typescript
function* myS aga() {
  try {
    const response: APIResponse<MyType> = yield call(myEndpoint);
    
    // ✅ response.data always exists
    yield put(mySuccess(response.data));
    
    // ✅ response.message always safe to access
    if (response.message) {
      toast.success(response.message);
    }
  } catch (error) {
    // Handle error
  }
}
```

## Response Normalizer API

### `wrapResponse<T>(data, message?)`
Wraps any response into APIResponse format.

**Handles:**
- Direct objects → wraps them
- Already wrapped → returns as-is
- Has status field → returns as-is (future-proof)

### `wrapListResponse<T>(data, message?)`
Wraps list responses with pagination.

**Handles:**
- DRF pagination: `{count, results, next, previous}`
- Direct arrays: `[...]`
- Already wrapped: `{data: {results, count}}`

### `normalizeErrorResponse(error)`
Normalizes error responses.

**Handles:**
- `{error: "..."}` → `{data: null, message: "..."}`
- `{detail: "..."}` → `{data: null, message: "..."}`
- `{message: "..."}` → `{data: null, message: "..."}`

## Console Logging

The normalizer adds helpful logs:
- `✅ [ResponseNormalizer] Response already wrapped`
- `✅ [ResponseNormalizer] Response has status field (compliant)`
- `🔄 [ResponseNormalizer] Wrapping direct response`
- `🔄 [ResponseNormalizer] Wrapping DRF paginated response`

This helps track which endpoints are compliant and which aren't.

## Future: When Backend is Fixed

When backend implements the standard format with `status` and `meta`:

1. The normalizer will automatically detect and pass through compliant responses
2. No changes needed in API helpers
3. Only update needed: Remove temporary wrapping if desired

## Related Files

- `backend/RESPONSE-STRUCTURE-AUDIT.md` - Detailed backend analysis
- `frontend/src/helpers/api/responseNormalizer.ts` - Implementation
- `frontend/src/types/api.ts` - APIResponse type definition

## Testing

Check browser console for normalization logs when making API calls:

```
🌐 [API] Calling /api/elections/current/
🌐 [API] Raw response: {id: 1, name: "..."}
🔄 [ResponseNormalizer] Wrapping direct response
🌐 [API] Normalized response: {data: {id: 1, ...}, message: "..."}
```

---

**Last Updated**: October 25, 2025
**Status**: In Progress
**Next Review**: When backend standardization is complete



