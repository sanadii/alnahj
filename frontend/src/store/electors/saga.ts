// ==============================|| ELECTORS SAGA ||============================== //
// Election Management System - Electors Management

import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as types from './actionTypes';
import * as actions from './actions';
import * as api from 'helpers/api/electors';
import { openSnackbar } from 'store/snackbar/actions';

// ============================================================================
// GET ELECTORS
// ============================================================================

type SnackbarColor = 'success' | 'error';

function getErrorMessage(error: unknown, fallback: string) {
  if (!error) return fallback;
  if (typeof error === 'string') return error;
  const responseMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
  if (typeof responseMessage === 'string') return responseMessage;
  const message = (error as { message?: string })?.message;
  return message || fallback;
}

function* showAlert(message: string, color: SnackbarColor) {
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

type GetElectorsAction = ReturnType<typeof actions.getElectorsRequest>;
type GetElectorAction = ReturnType<typeof actions.getElectorRequest>;
type CreateElectorAction = ReturnType<typeof actions.createElectorRequest>;
type UpdateElectorAction = ReturnType<typeof actions.updateElectorRequest>;
type DeleteElectorAction = ReturnType<typeof actions.deleteElectorRequest>;
type ImportElectorsAction = ReturnType<typeof actions.importElectorsRequest>;
type ExportElectorsAction = ReturnType<typeof actions.exportElectorsRequest>;

export function* getElectorsSaga(action: GetElectorsAction) {
  try {

    // Use combined endpoint if includeGroups is true
    let response;
    if (action.payload?.includeGroups) {
      response = yield call(api.getElectorsCombined, action.payload?.filters, ['groups']);
    } else {
      response = yield call(api.getElectors, action.payload?.filters);
    }


    // Handle normalized response format
    if (response.data) {
      let electors: any[] = [];
      let totalCount = 0;
      let groups: any[] | undefined;

      // NEW: Check if it's the combined format first
      if (typeof response.data === 'object' && 'electors' in response.data) {
        electors = response.data.electors || [];
        groups = response.data.groups;
        totalCount = response.pagination?.count || response.meta?.pagination?.count || electors.length;
      }
      // Check if data has results (paginated format)
      else if (response.data.results && Array.isArray(response.data.results)) {
        electors = response.data.results;
        totalCount = response.pagination?.count || response.data.count || 0;
      }
      // Check if data is array directly
      else if (Array.isArray(response.data)) {
        electors = response.data;
        totalCount = response.data.length;
      } else {
        console.error('❌ [Saga] getElectorsSaga - Unexpected data format:', response.data);
        throw new Error('Invalid response format: data is not an array or paginated result');
      }

      yield put(
        actions.getElectorsSuccess({
          electors,
          totalCount,
          groups
        })
      );
    } else {
      console.error('❌ [Saga] getElectorsSaga - No data in response');
      throw new Error('Invalid response format: no data field');
    }
  } catch (error) {
    console.error('❌ [Saga] getElectorsSaga - Error:', error);
    const errorMessage = getErrorMessage(error, 'Failed to fetch electors');
    yield put(actions.getElectorsError(errorMessage));
    yield* showAlert(errorMessage, 'error');
  }
}

// ============================================================================
// GET SINGLE ELECTOR
// ============================================================================

function* getElectorSaga(action: GetElectorAction) {
  try {

    const response = yield call(api.getElector, action.payload.kocId);

    if (response.data) {
      yield put(actions.getElectorSuccess(response.data));
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('❌ [Saga] getElectorSaga - Error:', error);
    const errorMessage = getErrorMessage(error, 'Failed to fetch elector');
    yield put(actions.getElectorError(errorMessage));
    yield* showAlert(errorMessage, 'error');
  }
}

// ============================================================================
// CREATE ELECTOR
// ============================================================================

export function* createElectorSaga(action: CreateElectorAction) {
  try {

    const response = yield call(api.createElector, action.payload);

    if (response.data) {
      yield put(actions.createElectorSuccess(response.data));
      yield* showAlert('Elector created successfully', 'success');
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('❌ [Saga] createElectorSaga - Error:', error);
    const errorMessage = getErrorMessage(error, 'Failed to create elector');
    yield put(actions.createElectorError(errorMessage));
    yield* showAlert(errorMessage, 'error');
  }
}

// ============================================================================
// UPDATE ELECTOR
// ============================================================================

function* updateElectorSaga(action: UpdateElectorAction) {
  try {

    const response = yield call(api.updateElector, action.payload.kocId, action.payload.data);

    if (response.data) {
      yield put(actions.updateElectorSuccess(response.data));
      yield* showAlert('Elector updated successfully', 'success');
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('❌ [Saga] updateElectorSaga - Error:', error);
    const errorMessage = getErrorMessage(error, 'Failed to update elector');
    yield put(actions.updateElectorError(errorMessage));
    yield* showAlert(errorMessage, 'error');
  }
}

// ============================================================================
// DELETE ELECTOR
// ============================================================================

function* deleteElectorSaga(action: DeleteElectorAction) {
  try {

    yield call(api.deleteElector, action.payload.kocId);

    yield put(actions.deleteElectorSuccess(action.payload.kocId));
    yield* showAlert('Elector deleted successfully', 'success');
  } catch (error) {
    console.error('❌ [Saga] deleteElectorSaga - Error:', error);
    const errorMessage = getErrorMessage(error, 'Failed to delete elector');
    yield put(actions.deleteElectorError(errorMessage));
    yield* showAlert(errorMessage, 'error');
  }
}

// ============================================================================
// IMPORT ELECTORS
// ============================================================================

function* importElectorsSaga(action: ImportElectorsAction) {
  try {

    const response = yield call(api.importElectorsCsv, action.payload.file, action.payload.updateExisting);

    if (response.data) {
      yield put(actions.importElectorsSuccess(response.data));
      yield* showAlert(`Import complete: ${response.data.created} created, ${response.data.updated} updated`, 'success');

      // Refresh electors list after import
      yield put(actions.getElectorsRequest());
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('❌ [Saga] importElectorsSaga - Error:', error);
    const errorMessage = getErrorMessage(error, 'Failed to import electors');
    yield put(actions.importElectorsError(errorMessage));
    yield* showAlert(errorMessage, 'error');
  }
}

// ============================================================================
// EXPORT ELECTORS
// ============================================================================

function* exportElectorsSaga(action: ExportElectorsAction) {
  try {

    const blob =
      action.payload.format === 'excel'
        ? yield call(api.exportElectorsExcel, action.payload.filters)
        : yield call(api.exportElectorsCsv, action.payload.filters);

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `electors_export_${new Date().toISOString().split('T')[0]}.${action.payload.format === 'excel' ? 'xlsx' : 'csv'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    yield put(actions.exportElectorsSuccess());
    yield* showAlert('Electors exported successfully', 'success');
  } catch (error) {
    console.error('❌ [Saga] exportElectorsSaga - Error:', error);
    const errorMessage = getErrorMessage(error, 'Failed to export electors');
    yield put(actions.exportElectorsError(errorMessage));
    yield* showAlert(errorMessage, 'error');
  }
}

// ============================================================================
// GET ELECTOR STATISTICS
// ============================================================================

function* getElectorStatsSaga() {
  try {

    const response = yield call(api.getElectorStats);

    if (response.data) {
      yield put(actions.getElectorStatsSuccess(response.data));
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('❌ [Saga] getElectorStatsSaga - Error:', error);
    const errorMessage = getErrorMessage(error, 'Failed to fetch statistics');
    yield put(actions.getElectorStatsError(errorMessage));
  }
}

// ============================================================================
// WATCHER SAGA
// ============================================================================

export function* watchElectorList() {
  yield takeLatest(types.GET_ELECTORS_REQUEST, getElectorsSaga);
}

export function* watchElectorDetails() {
  yield takeLatest(types.GET_ELECTOR_REQUEST, getElectorSaga);
}

export function* watchElectorCreate() {
  yield takeLatest(types.CREATE_ELECTOR_REQUEST, createElectorSaga);
}

export function* watchElectorUpdate() {
  yield takeLatest(types.UPDATE_ELECTOR_REQUEST, updateElectorSaga);
}

export function* watchElectorDelete() {
  yield takeLatest(types.DELETE_ELECTOR_REQUEST, deleteElectorSaga);
}

export function* watchElectorImport() {
  yield takeLatest(types.IMPORT_ELECTORS_REQUEST, importElectorsSaga);
}

export function* watchElectorExport() {
  yield takeLatest(types.EXPORT_ELECTORS_REQUEST, exportElectorsSaga);
}

export function* watchElectorStats() {
  yield takeLatest(types.GET_ELECTOR_STATS_REQUEST, getElectorStatsSaga);
}

export default function* electorsSaga() {
  yield all([
    watchElectorList(),
    watchElectorDetails(),
    watchElectorCreate(),
    watchElectorUpdate(),
    watchElectorDelete(),
    watchElectorImport(),
    watchElectorExport(),
    watchElectorStats()
  ]);
}
