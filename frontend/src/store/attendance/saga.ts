/**
 * Attendance Saga
 * Redux saga for handling attendance side effects and API calls
 */

import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as actions from './actions';
import * as types from './actionTypes';
import {
  getAttendances,
  getAttendance,
  markAttendance,
  deleteAttendance,
  searchElector,
  getCommitteeAttendance,
  getAttendanceStatistics,
  refreshAttendanceStatistics,
  addPendingElector
} from 'helpers/api/attendance';
import type { APIResponse } from 'types/api';
import type { Attendance, AttendanceStatistics, CommitteeAttendanceList, ElectorSearchResult } from 'types/attendance';
import { openSnackbar } from 'store/snackbar/actions';
import { getErrorMessage } from 'utils/apiError';

type SnackbarColor = 'success' | 'error';

function* showSnackbar(message: string, color: SnackbarColor) {
  yield put(
    openSnackbar({
      open: true,
      message,
      variant: 'alert',
      alert: { color },
      close: true
    })
  );
}

type GetAttendancesAction = ReturnType<typeof actions.getAttendancesRequest>;
type GetAttendanceAction = ReturnType<typeof actions.getAttendanceRequest>;
type SearchElectorAction = ReturnType<typeof actions.searchElectorRequest>;
type MarkAttendanceAction = ReturnType<typeof actions.markAttendanceRequest>;
type DeleteAttendanceAction = ReturnType<typeof actions.deleteAttendanceRequest>;
type GetCommitteeAttendanceAction = ReturnType<typeof actions.getCommitteeAttendanceRequest>;
type GetAttendanceStatisticsAction = ReturnType<typeof actions.getAttendanceStatisticsRequest>;
type RefreshAttendanceStatisticsAction = ReturnType<typeof actions.refreshAttendanceStatisticsRequest>;
type AddPendingElectorAction = ReturnType<typeof actions.addPendingElectorRequest>;

// ============================================================================
// GET ALL ATTENDANCES
// ============================================================================

export function* getAttendancesSaga({ payload }: GetAttendancesAction): Generator<any, void, APIResponse<Attendance[]>> {
  try {
    // Add pagination params if provided
    const params: any = { ...payload.filters };
    if (payload.page) params.page = payload.page;
    if (payload.pageSize) params.page_size = payload.pageSize;
    
    const response = yield call(getAttendances, params);
    
    // Handle paginated response
    const data = response.data;
    if (data && typeof data === 'object' && 'results' in data) {
      // Paginated response
      yield put(actions.getAttendancesSuccess({
        results: data.results,
        count: data.count || data.results.length,
        currentPage: payload.page || 1,
        pageSize: payload.pageSize || 20
      }));
    } else {
      // Non-paginated response (array)
      yield put(actions.getAttendancesSuccess(Array.isArray(data) ? data : []));
    }
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to fetch attendance records');
    yield put(actions.getAttendancesError(message));
    yield* showSnackbar(message, 'error');
  }
}

// ============================================================================
// GET SINGLE ATTENDANCE
// ============================================================================

function* getAttendanceSaga({ payload }: GetAttendanceAction): Generator<any, void, APIResponse<Attendance>> {
  try {
    const response = yield call(getAttendance, payload.id);
    yield put(actions.getAttendanceSuccess(response.data));
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to fetch attendance record');
    yield put(actions.getAttendanceError(message));
    yield* showSnackbar(message, 'error');
  }
}

// ============================================================================
// SEARCH ELECTOR
// ============================================================================

function* searchElectorSaga({ payload }: SearchElectorAction): Generator<any, void, APIResponse<ElectorSearchResult>> {
  try {
    const response = yield call(searchElector, payload);
    // Response.data now contains the elector data directly (following standards)
    yield put(actions.searchElectorSuccess(response.data));

    // Don't show toast for search - let component handle the UI feedback
  } catch (error: any) {
    // 404 = elector not found (valid case, not an error)
    if (error.response?.status === 404) {
      const message = error.response?.data?.message || `Elector with KOC ID ${payload.koc_id} not found`;
      yield put(actions.searchElectorError(message));
      // Don't show toast for not found - component will show "Add Elector" button
    } else {
      // Other errors = actual errors
      const message = getErrorMessage(error, 'Failed to search elector');
      yield put(actions.searchElectorError(message));
      yield* showSnackbar(message, 'error'); // Only show toast for real errors
    }
  }
}

// ============================================================================
// MARK ATTENDANCE
// ============================================================================

export function* markAttendanceSaga({ payload }: MarkAttendanceAction): Generator<any, void, APIResponse<Attendance>> {
  try {
    const response = yield call(markAttendance, payload);
    yield put(actions.markAttendanceSuccess(response.data));
    yield* showSnackbar(response.message || 'Attendance marked successfully', 'success');

    // Refresh the list after marking (filter by committee code)
    if (payload.committee_code) {
      yield put(actions.getAttendancesRequest({ committee__code: payload.committee_code }));
      yield put(actions.getAttendanceStatisticsRequest(payload.committee_code));
    }
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to mark attendance');
    yield put(actions.markAttendanceError(message));
    yield* showSnackbar(message, 'error');
  }
}

// ============================================================================
// DELETE ATTENDANCE
// ============================================================================

function* deleteAttendanceSaga({ payload }: DeleteAttendanceAction): Generator<any, void, APIResponse<null>> {
  try {
    const response = yield call(deleteAttendance, payload.id);
    yield put(actions.deleteAttendanceSuccess(payload.id));
    yield* showSnackbar(response.message || 'Attendance deleted successfully', 'success');
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to delete attendance');
    yield put(actions.deleteAttendanceError(message));
    yield* showSnackbar(message, 'error');
  }
}

// ============================================================================
// COMMITTEE ATTENDANCE
// ============================================================================

function* getCommitteeAttendanceSaga({ payload }: GetCommitteeAttendanceAction): Generator<any, void, APIResponse<CommitteeAttendanceList>> {
  try {
    const response = yield call(getCommitteeAttendance, payload.committeeCode);
    yield put(actions.getCommitteeAttendanceSuccess(response.data));

    if (response.message) {
      yield* showSnackbar(response.message, 'success');
    }
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to fetch committee attendance');
    yield put(actions.getCommitteeAttendanceError(message));
    yield* showSnackbar(message, 'error');
  }
}

// ============================================================================
// ATTENDANCE STATISTICS
// ============================================================================

function* getAttendanceStatisticsSaga({ payload }: GetAttendanceStatisticsAction): Generator<any, void, APIResponse<AttendanceStatistics>> {
  try {
    const response = yield call(getAttendanceStatistics, payload.committeeCode);
    yield put(actions.getAttendanceStatisticsSuccess(response.data));
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to fetch attendance statistics');
    yield put(actions.getAttendanceStatisticsError(message));
    yield* showSnackbar(message, 'error');
  }
}

function* refreshAttendanceStatisticsSaga({
  payload
}: RefreshAttendanceStatisticsAction): Generator<any, void, APIResponse<AttendanceStatistics>> {
  try {
    const response = yield call(refreshAttendanceStatistics, payload.committeeCode);
    yield put(actions.refreshAttendanceStatisticsSuccess(response.data));
    yield* showSnackbar(response.message || 'Statistics refreshed successfully', 'success');
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to refresh statistics');
    yield put(actions.refreshAttendanceStatisticsError(message));
    yield* showSnackbar(message, 'error');
  }
}

// ============================================================================
// ADD PENDING ELECTOR
// ============================================================================

function* addPendingElectorSaga({ payload }: AddPendingElectorAction): Generator<any, void, APIResponse<any>> {
  try {
    const response = yield call(addPendingElector, payload);
    yield put(actions.addPendingElectorSuccess(response.data));
    yield* showSnackbar(response.message || 'Elector added successfully (pending approval)', 'success');
    
    // Re-search to show the newly added elector
    if (payload.committee_code) {
      yield put(actions.getAttendancesRequest({ committee__code: payload.committee_code }));
    } else {
      yield put(actions.getAttendancesRequest({}));
    }
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to add elector');
    yield put(actions.addPendingElectorError(message));
    yield* showSnackbar(message, 'error');
  }
}

// ============================================================================
// ROOT SAGA
// ============================================================================

export function* watchAttendanceList() {
  yield takeLatest(types.GET_ATTENDANCES_REQUEST, getAttendancesSaga);
}

export function* watchAttendanceDetails() {
  yield takeLatest(types.GET_ATTENDANCE_REQUEST, getAttendanceSaga);
}

export function* watchAttendanceSearch() {
  yield takeLatest(types.SEARCH_ELECTOR_REQUEST, searchElectorSaga);
}

export function* watchAttendanceMarking() {
  yield takeLatest(types.MARK_ATTENDANCE_REQUEST, markAttendanceSaga);
}

export function* watchAttendanceDeletion() {
  yield takeLatest(types.DELETE_ATTENDANCE_REQUEST, deleteAttendanceSaga);
}

export function* watchCommitteeAttendance() {
  yield takeLatest(types.GET_COMMITTEE_ATTENDANCE_REQUEST, getCommitteeAttendanceSaga);
}

export function* watchAttendanceStatistics() {
  yield takeLatest(types.GET_ATTENDANCE_STATISTICS_REQUEST, getAttendanceStatisticsSaga);
  yield takeLatest(types.REFRESH_ATTENDANCE_STATISTICS_REQUEST, refreshAttendanceStatisticsSaga);
}

export function* watchAddPendingElector() {
  yield takeLatest(types.ADD_PENDING_ELECTOR_REQUEST, addPendingElectorSaga);
}

export default function* attendanceSaga(): Generator<any, void, any> {
  yield all([
    watchAttendanceList(),
    watchAttendanceDetails(),
    watchAttendanceSearch(),
    watchAttendanceMarking(),
    watchAttendanceDeletion(),
    watchCommitteeAttendance(),
    watchAttendanceStatistics(),
    watchAddPendingElector()
  ]);
}
