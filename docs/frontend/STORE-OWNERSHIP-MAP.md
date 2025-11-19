# Store Ownership Map

**Purpose:** provide a quick reference linking feature views to their store modules, selectors, and API helpers. Use this to understand cross-feature dependencies before refactoring or writing tests.

## Feature-to-Store Matrix

| Feature / Route | Store Module(s) | Key Selectors | Primary API Helpers | Notes |
|-----------------|-----------------|---------------|---------------------|-------|
| `views/auth/*`, header profile menu, route guards | `store/auth` | `authSelector`, `selectAuthUser`, `selectIsLoggedIn` | `helpers/api/auth` | Used by contexts (`JWTContext`, `SupabaseContext`, etc.) and login/register views. |
| `views/users/*` (admin user management) | `store/users` | `usersSelector`, `selectUsers`, `selectUsersFilters` | `helpers/api/users` | Controls invite flows and dashboard counts. |
| `views/electors/*`, `ViewElectorDialog`, global search | `store/electors` | `electorsSelector`, `selectElectorsSortedByName`, `selectElectorsBySearch`, `electorsGroupsSelector` | `helpers/api/electors`, `helpers/api/guarantees` | Guarantees dialog piggybacks on electors data for inline actions. |
| `views/guarantees/*`, guardian dialogs | `store/guarantees` | `guaranteesSelector`, `selectGuaranteesByStatus`, `selectGuaranteesGroupedByCommittee` | `helpers/api/guarantees`, `helpers/api/electors` | Shared selectors power dashboard stats and coverage indicators. |
| `views/attendance/Attendance.tsx` | `store/attendance` | `attendanceSelector`, `selectAttendanceStatistics` | `helpers/api/attendance` | Saga handles search + mark/delete attendance with snackbars. |
| `views/sorting/*` (vote counting dashboard) | `store/voting` | `votingSelector`, `selectVotingCompletionMetrics` | `helpers/api/voting`, `helpers/api/elections`, `helpers/api/committees` | Sorting view renders completion metrics + statistics. |
| `views/dashboard/Dashboard.tsx`, election management dialogs | `store/elections`, `store/committees` | `electionsSelector`, `committeesSelector` | `helpers/api/elections`, `helpers/api/committees`, `helpers/api/users` | Dashboard orchestrates committees, parties, and members. |
| `views/strategic/Strategic.tsx` | `store/strategic` | `strategicSelector` | `helpers/api/strategic` | Provides KPI snapshots for leadership. |
| `views/layout/*` (header/footer/menu) | `store/snackbar`, `store/constant` | n/a | n/a | Snackbar reducer handles global notifications triggered by sagas. |

### How to use

1. **Adding a feature:** locate the target route here and extend the row with new selectors or API helpers before writing code.
2. **Refactoring a module:** scan the table to find all consumers before changing reducer or saga contracts.
3. **Writing tests:** pair this map with `store/testUtils.ts` (see below) to quickly bootstrap reducer/saga tests with mocked HTTP + snackbar assertions.

---

## Testing Utilities

See `frontend/src/store/testUtils.ts` for helper functions:

| Helper | Description |
|--------|-------------|
| `createTestStore(preloadedState?)` | Spin up a Redux store with the root reducer for reducer-level tests. |
| `recordSaga(saga, action, options)` | Executes a saga with mocked `dispatch`/`getState`, returning the dispatched actions for assertions. |
| `mockHttpClient()` | Creates spies for `http.axios.{get,post,put,patch,delete}`. Use `restore()` to clean up between tests. |
| `getSnackbarActions(actions)` | Filter recorded saga actions down to snackbar events (`SNACKBAR_OPEN`). |

Usage example:

```ts
import { recordSaga, mockHttpClient, getSnackbarActions } from 'store/testUtils';
import { handleFetchGuarantees } from 'store/guarantees/saga';
import { fetchGuaranteesRequest } from 'store/guarantees/actions';

const httpMock = mockHttpClient();
httpMock.get.mockResolvedValue({ data: { status: 'success', data: [] } });

const actions = await recordSaga(handleFetchGuarantees, fetchGuaranteesRequest({}));
expect(getSnackbarActions(actions)).toHaveLength(0);
httpMock.restore();
```

