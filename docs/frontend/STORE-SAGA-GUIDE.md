# Redux Saga Architecture Guide

**Version:** Draft (Nov 17, 2025)  
**Scope:** Frontend store patterns for reducers, actions, selectors, and sagas.

---

## 1. Goals

- Provide consistent naming and folder structure across `frontend/src/store`.
- Standardize async state handling (loading/error) without migrating to RTK slices.
- Improve saga readability (watcher patterns, error handling, cancellation).
- Simplify testing via shared utilities.

---

## 2. Directory Structure

```
store/
  guarantees/
    actionTypes.ts
    actions.ts
    reducer.ts
    saga.ts
    selectors.ts (optional)
    types.ts
```

- **Action types:** `MODULE/ACTION_NAME` format (`GUARANTEES/FETCH_REQUEST`).
- **Actions:** grouped by intent (fetch, update, UI state).
- **Reducer:** default export, typed state interface lives in `types.ts`.
- **Saga:** export watcher (`function* guaranteesSaga()`) + helper worker generators.

---

## 3. Naming Conventions

| Concept | Pattern | Example |
|---------|---------|---------|
| Action type | `MODULE/EVENT_PHASE` | `GUARANTEES/FETCH_REQUEST` |
| Action creator | `doSomethingRequest(payload)` | `fetchGuaranteesRequest(params)` |
| Worker saga | `function* handleFetchGuarantees(action)` | |
| Watcher saga | `function* watchFetchGuarantees()` using `takeLatest` | |
| Root saga export | `export default function* guaranteesSaga()` | |
| Selector | `moduleSelector(state)` or `selectModuleProp(state)` | |

---

## 4. Async State Helpers

Shared utilities for managing loading and error states consistently across reducers.

### Location
`frontend/src/store/utils/asyncState.ts`

### Basic Usage

**Simple async state (single loading/error):**

```typescript
import { asyncRequest, asyncSuccess, asyncFailure, createAsyncState } from 'store/utils/asyncState';

// Initial state
const initialState = {
  items: [],
  ...createAsyncState() // { loading: false, error: null }
};

// Reducer
case types.GET_ITEMS_REQUEST:
  return {
    ...state,
    ...asyncRequest(state) // Sets loading: true, error: null
  };

case types.GET_ITEMS_SUCCESS:
  return {
    ...state,
    items: action.payload,
    ...asyncSuccess(state) // Sets loading: false, error: null
  };

case types.GET_ITEMS_FAILURE:
  return {
    ...state,
    ...asyncFailure(state, action.payload) // Sets loading: false, error: message
  };
```

### Granular Loading States

For operations that need separate loading flags (e.g., `searchLoading`, `statsLoading`):

```typescript
import { granularAsyncRequest, granularAsyncSuccess, granularAsyncFailure } from 'store/utils/asyncState';

case types.SEARCH_ELECTORS_REQUEST:
  return {
    ...state,
    ...granularAsyncRequest(state, 'searchLoading')
  };

case types.SEARCH_ELECTORS_SUCCESS:
  return {
    ...state,
    searchResults: action.payload,
    ...granularAsyncSuccess(state, 'searchLoading')
  };

case types.SEARCH_ELECTORS_FAILURE:
  return {
    ...state,
    ...granularAsyncFailure(state, 'searchLoading', action.payload, 'searchError')
  };
```

### Available Helpers

| Helper | Purpose | Usage |
|--------|---------|-------|
| `createAsyncState()` | Initial async state | `{ loading: false, error: null }` |
| `asyncRequest(state)` | REQUEST action update | Sets `loading: true`, clears error |
| `asyncSuccess(state)` | SUCCESS action update | Sets `loading: false`, clears error |
| `asyncFailure(state, error)` | FAILURE action update | Sets `loading: false`, sets error message |
| `granularAsyncRequest(state, key)` | Granular REQUEST | Sets `key: true`, clears error |
| `granularAsyncSuccess(state, key)` | Granular SUCCESS | Sets `key: false`, clears error |
| `granularAsyncFailure(state, key, error, errorKey?)` | Granular FAILURE | Sets `key: false`, sets error in `errorKey` |

### Error Handling

The `asyncFailure` helper automatically extracts error messages from various formats:
- String: `"Error message"`
- Error object: `new Error("message")`
- API response: `{ message: "...", error: "..." }`
- Null: Clears error

---

## 5. Saga Patterns

### Watchers

```ts
function* watchFetchGuarantees() {
  yield takeLatest(FETCH_GUARANTEES_REQUEST, handleFetchGuarantees);
}

export default function* guaranteesSaga() {
  yield all([watchFetchGuarantees(), watchUpdateGuarantee()]);
}
```

### Workers

```ts
function* handleFetchGuarantees({ payload }: ReturnType<typeof fetchGuaranteesRequest>) {
  try {
    const response: AxiosResponse<ApiList<Guarantee>> = yield call(api.fetchGuarantees, payload);
    yield put(fetchGuaranteesSuccess(response.data));
  } catch (error) {
    const message = getErrorMessage(error);
    yield put(fetchGuaranteesFailure(message));
    yield call(reportSagaError, 'guarantees', 'fetch', message);
  }
}
```

### Shared HTTP Client & Error Normalization

All network calls must go through the typed client in `src/utils/httpClient.ts` (re-exported as `utils/axios`). Benefits:

- Automatic auth headers + CSRF token
- Single-flight refresh requests (prevents refresh stampede)
- Consistent storage helpers (`persistAuthTokens`, `clearStoredAuth`)
- Normalized errors via `normalizeApiError` / `getErrorMessage`

#### Usage inside sagas

```ts
import { getErrorMessage } from 'utils/apiError';
import axios from 'utils/axios';

function* handleFetchGuarantees({ payload }: ReturnType<typeof fetchGuaranteesRequest>) {
  try {
    const response = yield call(api.fetchGuarantees, payload);
    yield put(fetchGuaranteesSuccess(response.data));
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to fetch guarantees');
    yield put(fetchGuaranteesFailure(message));
    yield call(reportSagaError, 'guarantees', 'fetch', message);
  }
}
```

`reportSagaError` can dispatch a snackbar, log to monitoring, or both.

#### Lint guardrail

An ESLint rule prevents importing bare `axios` or hard-coding `/api/...` strings. Use URL constants under `helpers/urls/` and the shared client. The rule is disabled only inside the URL constants directory where endpoint strings are defined intentionally.

---

## 6. Typed Hooks

In `store/index.ts`:

```ts
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

Components must replace `useDispatch`/`useSelector` with typed hooks when touching updated modules.

---

## 7. Testing Guidance

1. **Reducers:** use plain Jest/Vitest tests with sample actions and initial state from `types.ts`. `createTestStore` in `store/testUtils.ts` boots a real reducer tree if needed.
2. **Sagas:** leverage `recordSaga` from `store/testUtils.ts` (wraps `runSaga`) to execute a worker saga and capture dispatched actions. Combine with `mockHttpClient()` to stub network calls.

```ts
it('handles fetch success', () => {
  const iterator = handleFetchGuarantees(fetchGuaranteesRequest(params));
  expect(iterator.next().value).toEqual(call(api.fetchGuarantees, params));
  expect(iterator.next(response).value).toEqual(put(fetchGuaranteesSuccess(response.data)));
});
```

3. **Selectors:** test via mock `RootState` objects (see `selectors/__tests__` for examples). Utility functions live directly next to selectors for type reuse.

---

## 8. Rollout Checklist

- [ ] Module inventoried (actions/reducer/saga/selector typed).
- [ ] Action types follow `MODULE/EVENT` naming.
- [ ] Reducer uses async helpers for loading/error.
- [ ] Saga watchers/workers follow standard pattern.
- [ ] Error handling routes through shared helper/snackbar.
- [ ] Typed hooks adopted in relevant components.
- [ ] Tests added/updated (reducers + sagas + selectors).
- [ ] Documentation (this guide + plan) updated with status.

---

## 9. Next Steps

1. Populate the inventory table (Phase 2 Task 1).
2. Apply these conventions to `strategic` module as pilot.
3. Iterate on guide with lessons learned per module.


