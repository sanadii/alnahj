// ==============================|| ELECTIONS SAGA ||============================== //
// Election Management System - Elections Management

import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as actions from './actions';
import * as types from './actionTypes';
import * as electionsApi from 'helpers/api/elections';
import * as votingApi from 'helpers/api/voting';
import { openSnackbar } from 'store/snackbar/actions';
import type { APIResponse } from 'types/api';
import type { Election, ElectionListResponse } from 'types/elections';

type SnackbarColor = 'success' | 'error';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!error) return fallback;
  if (typeof error === 'string') return error;
  const responseData = (error as { response?: { data?: { message?: string } } })?.response?.data;
  if (responseData?.message) {
    return typeof responseData.message === 'string' ? responseData.message : JSON.stringify(responseData.message);
  }
  const message = (error as { message?: string })?.message;
  return message || fallback;
};

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

/**
 * Saga: Get Elections List
 */
type GetElectionsAction = ReturnType<typeof actions.getElectionsRequest>;
type GetElectionAction = ReturnType<typeof actions.getElectionRequest>;
type GetCurrentElectionAction = ReturnType<typeof actions.getCurrentElectionRequest>;
type CreateElectionAction = ReturnType<typeof actions.createElectionRequest>;
type UpdateElectionAction = ReturnType<typeof actions.updateElectionRequest>;
type DeleteElectionAction = ReturnType<typeof actions.deleteElectionRequest>;
type UpdateElectionStatusAction = ReturnType<typeof actions.updateElectionStatusRequest>;
type GetElectionStatisticsAction = ReturnType<typeof actions.getElectionStatisticsRequest>;

function* getElectionsSaga({ payload }: GetElectionsAction): Generator<any, void, any> {
  try {
    const response = yield call(electionsApi.getElections, payload.filters);

    // ✅ Backend response: { status, data: { results, count }, message, meta }
    const backendResponse = response.data;

    if (backendResponse && backendResponse.status === 'success') {
      const listData = backendResponse.data;

      yield put(
        actions.getElectionsSuccess({
          elections: listData.results,
          totalCount: listData.count
        })
      );
    } else {
      const message = 'Failed to fetch elections';
      yield put(actions.getElectionsError(message));
      yield* showSnackbar(message, 'error');
    }
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to fetch elections');
    yield put(actions.getElectionsError(message));
    yield* showSnackbar(message, 'error');
  }
}

/**
 * Saga: Get Single Election
 */
function* getElectionSaga({ payload }: GetElectionAction): Generator<any, void, any> {
  try {
    const response = yield call(electionsApi.getElection, payload.id);

    // ✅ Backend response: { status, data: { election }, message, meta }
    const backendResponse = response.data;

    if (backendResponse && backendResponse.status === 'success') {
      yield put(actions.getElectionSuccess(backendResponse.data));
    } else {
      const message = 'Failed to fetch election';
      yield put(actions.getElectionError(message));
      yield* showSnackbar(message, 'error');
    }
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to fetch election');
    yield put(actions.getElectionError(message));
    yield* showSnackbar(message, 'error');
  }
}

/**
 * Saga: Get Current Election
 */
function* getCurrentElectionSaga(): Generator<any, void, any> {
  try {
    const response = yield call(electionsApi.getCurrentElection);

    // ✅ Backend response: { status, data: { election }, message, meta }
    const backendResponse = response;

    if (backendResponse && backendResponse.status === 'success') {
      yield put(actions.getCurrentElectionSuccess(backendResponse.data));
    } else {
      console.error('❌ [ElectionsSaga] Status check failed. backendResponse:', backendResponse);
      const message = 'Failed to fetch current election';
      yield put(actions.getCurrentElectionError(message));
      yield* showSnackbar(message, 'error');
    }
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to fetch current election');
    yield put(actions.getCurrentElectionError(message));
    yield* showSnackbar(message, 'error');
  }
}

/**
 * Saga: Create Election
 */
function* createElectionSaga({ payload }: CreateElectionAction): Generator<any, void, any> {
  try {
    const response = yield call(electionsApi.createElection, payload);

    // ✅ Backend response: { status, data: { election }, message, meta }
    const backendResponse = response.data;

    if (backendResponse && backendResponse.status === 'success') {
      yield put(actions.createElectionSuccess(backendResponse.data));
      yield* showSnackbar(backendResponse.message || 'Election created successfully', 'success');

      // Refresh the elections list
      yield put(actions.getElectionsRequest({}));
    }
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to create election');
    yield put(actions.createElectionError(message));
    yield* showSnackbar(message, 'error');
  }
}

/**
 * Saga: Update Election
 */
function* updateElectionSaga({ payload }: UpdateElectionAction): Generator<any, void, any> {
  try {
    const { id, data } = payload;
    const response = yield call(electionsApi.updateElection, id, data);


    // ✅ Backend response: { status, data: { election }, message, meta }
    // API helper already returns response.data, so response is the backend response
    const backendResponse = response;

    if (backendResponse && backendResponse.status === 'success') {
      yield put(actions.updateElectionSuccess(backendResponse.data));
      yield* showSnackbar(backendResponse.message || 'Election updated successfully', 'success');
    } else {
      const message = 'Failed to update election';
      yield put(actions.updateElectionError(message));
      yield* showSnackbar(message, 'error');
    }
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to update election');
    yield put(actions.updateElectionError(message));
    yield* showSnackbar(message, 'error');
  }
}

/**
 * Saga: Delete Election
 */
function* deleteElectionSaga({ payload }: DeleteElectionAction): Generator<any, void, any> {
  try {
    const response = yield call(electionsApi.deleteElection, payload.id);

    // ✅ Backend response: { status, data: null, message, meta }
    const backendResponse = response.data;

    if (backendResponse && backendResponse.status === 'success') {
      yield put(actions.deleteElectionSuccess(payload.id));
      yield* showSnackbar(backendResponse.message || 'Election deleted successfully', 'success');
    }
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to delete election');
    yield put(actions.deleteElectionError(message));
    yield* showSnackbar(message, 'error');
  }
}

/**
 * Saga: Update Election Status
 */
function* updateElectionStatusSaga({ payload }: UpdateElectionStatusAction): Generator<any, void, any> {
  try {
    const { id, status } = payload;
    const response = yield call(electionsApi.updateElectionStatus, id, status);

    // ✅ Backend response: { status, data: { election }, message, meta }
    const backendResponse = response.data;

    if (backendResponse && backendResponse.status === 'success') {
      yield put(actions.updateElectionStatusSuccess(backendResponse.data));
      yield* showSnackbar(backendResponse.message || 'Election status updated successfully', 'success');
    }
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to update election status');
    yield put(actions.updateElectionStatusError(message));
    yield* showSnackbar(message, 'error');
  }
}

/**
 * Saga: Get Election Statistics
 */
function* getElectionStatisticsSaga({ payload }: GetElectionStatisticsAction): Generator<any, void, any> {
  try {
    const response = yield call(electionsApi.getElectionStatistics, payload.id);

    // ✅ Backend response: { status, data: { statistics }, message, meta }
    const backendResponse = response.data;

    if (backendResponse && backendResponse.status === 'success') {
      yield put(actions.getElectionStatisticsSuccess(backendResponse.data));
    }
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to fetch statistics');
    yield put(actions.getElectionStatisticsError(message));
    yield* showSnackbar(message, 'error');
  }
}

// ============================================================================
// CANDIDATES SAGAS (Moved from voting module)
// ============================================================================

type GetCandidatesAction = { payload?: any };
type CreateCandidateAction = { payload: any };
type UpdateCandidateAction = { payload: { id: number; data: any } };
type DeleteCandidateAction = { payload: number };
type GetPartiesAction = { payload?: any };

function* getCandidatesSaga(action: GetCandidatesAction): Generator<any, void, any> {
  try {
    const response = yield call(votingApi.getCandidates, action.payload);
    yield put({ type: types.GET_CANDIDATES_SUCCESS, payload: response.data.results || response.data });
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to load candidates');
    yield put({ type: types.GET_CANDIDATES_FAILURE, payload: errorMessage });
    yield* showSnackbar(errorMessage, 'error');
  }
}

function* createCandidateSaga(action: CreateCandidateAction): Generator<any, void, any> {
  try {
    const response = yield call(votingApi.createCandidate, action.payload);
    yield put({ type: types.CREATE_CANDIDATE_SUCCESS, payload: response.data });
    yield* showSnackbar(response.message || 'Candidate created successfully', 'success');
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to create candidate');
    yield put({ type: types.CREATE_CANDIDATE_FAILURE, payload: errorMessage });
    yield* showSnackbar(errorMessage, 'error');
  }
}

function* updateCandidateSaga(action: UpdateCandidateAction): Generator<any, void, any> {
  try {
    const response = yield call(votingApi.updateCandidate, action.payload.id, action.payload.data);
    yield put({ type: types.UPDATE_CANDIDATE_SUCCESS, payload: response.data });
    yield* showSnackbar(response.message || 'Candidate updated successfully', 'success');
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to update candidate');
    yield put({ type: types.UPDATE_CANDIDATE_FAILURE, payload: errorMessage });
    yield* showSnackbar(errorMessage, 'error');
  }
}

function* deleteCandidateSaga(action: DeleteCandidateAction): Generator<any, void, any> {
  try {
    const response = yield call(votingApi.deleteCandidate, action.payload);
    yield put({ type: types.DELETE_CANDIDATE_SUCCESS, payload: { id: action.payload, message: response.message } });
    yield* showSnackbar(response.message || 'Candidate deleted successfully', 'success');
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to delete candidate');
    yield put({ type: types.DELETE_CANDIDATE_FAILURE, payload: errorMessage });
    yield* showSnackbar(errorMessage, 'error');
  }
}

// ============================================================================
// PARTIES SAGAS (Moved from voting module)
// ============================================================================

function* getPartiesSaga(action: GetPartiesAction): Generator<any, void, any> {
  try {
    const response = yield call(votingApi.getParties, action.payload);
    yield put({ type: types.GET_PARTIES_SUCCESS, payload: response.data.results || response.data });
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to load parties');
    yield put({ type: types.GET_PARTIES_FAILURE, payload: errorMessage });
    yield* showSnackbar(errorMessage, 'error');
  }
}

/**
 * Root Saga: Watch all election actions
 */
export function* watchElectionList() {
  yield takeLatest(types.GET_ELECTIONS_REQUEST, getElectionsSaga);
}

export function* watchElectionDetails() {
  yield takeLatest(types.GET_ELECTION_REQUEST, getElectionSaga);
  yield takeLatest(types.GET_CURRENT_ELECTION_REQUEST, getCurrentElectionSaga);
}

export function* watchElectionCreate() {
  yield takeLatest(types.CREATE_ELECTION_REQUEST, createElectionSaga);
}

export function* watchElectionUpdate() {
  yield takeLatest(types.UPDATE_ELECTION_REQUEST, updateElectionSaga);
  yield takeLatest(types.UPDATE_ELECTION_STATUS_REQUEST, updateElectionStatusSaga);
}

export function* watchElectionDelete() {
  yield takeLatest(types.DELETE_ELECTION_REQUEST, deleteElectionSaga);
}

export function* watchElectionStatistics() {
  yield takeLatest(types.GET_ELECTION_STATISTICS_REQUEST, getElectionStatisticsSaga);
}

export function* watchCandidates() {
  yield takeLatest(types.GET_CANDIDATES_REQUEST, getCandidatesSaga);
  yield takeLatest(types.CREATE_CANDIDATE_REQUEST, createCandidateSaga);
  yield takeLatest(types.UPDATE_CANDIDATE_REQUEST, updateCandidateSaga);
  yield takeLatest(types.DELETE_CANDIDATE_REQUEST, deleteCandidateSaga);
}

export function* watchParties() {
  yield takeLatest(types.GET_PARTIES_REQUEST, getPartiesSaga);
}

export default function* electionsSaga(): Generator<any, void, any> {
  yield all([
    watchElectionList(),
    watchElectionDetails(),
    watchElectionCreate(),
    watchElectionUpdate(),
    watchElectionDelete(),
    watchElectionStatistics(),
    watchCandidates(),
    watchParties()
  ]);
}
