/**
 * Voting Redux Saga
 * Election Management System
 */

import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from './actionTypes';
import * as types from './types';
import * as api from 'helpers/api/voting';
import { openSnackbar } from 'store/snackbar/actions';

type SnackbarColor = 'success' | 'error';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!error) return fallback;
  if (typeof error === 'string') return error;
  const responseData = (error as { response?: { data?: { message?: string; error?: string } } })?.response?.data;
  if (responseData) {
    if (typeof responseData === 'string') return responseData;
    if (typeof responseData.message === 'string') return responseData.message;
    if (typeof responseData.error === 'string') return responseData.error;
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

// ============================================================================
// VOTE COUNTS SAGAS
// ============================================================================

export function* getVoteCountsSaga(action: types.GetVoteCountsRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.getVoteCounts>> = yield call(api.getVoteCounts, action.payload);

    yield put<types.GetVoteCountsSuccessAction>({
      type: actionTypes.GET_VOTE_COUNTS_SUCCESS,
      payload: {
        voteCounts: response.data.results || response.data,
        count: response.data.count || response.data.length
      }
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to load vote counts');
    yield put<types.GetVoteCountsFailureAction>({
      type: actionTypes.GET_VOTE_COUNTS_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

export function* createVoteCountSaga(action: types.CreateVoteCountRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.createVoteCount>> = yield call(api.createVoteCount, action.payload);

    yield put<types.CreateVoteCountSuccessAction>({
      type: actionTypes.CREATE_VOTE_COUNT_SUCCESS,
      payload: response.message || 'Vote count recorded successfully'
    });

    yield* showSnackbar(response.message || 'Vote count recorded successfully', 'success');

    // Reload vote counts and statistics
    yield put<types.GetVoteCountsRequestAction>({
      type: actionTypes.GET_VOTE_COUNTS_REQUEST,
      payload: {}
    });
    yield put<types.GetVotingStatisticsRequestAction>({
      type: actionTypes.GET_VOTING_STATISTICS_REQUEST
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to record vote count');
    yield put<types.CreateVoteCountFailureAction>({
      type: actionTypes.CREATE_VOTE_COUNT_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

function* updateVoteCountSaga(action: types.UpdateVoteCountRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.updateVoteCount>> = yield call(
      api.updateVoteCount,
      action.payload.id,
      action.payload.data
    );

    yield put<types.UpdateVoteCountSuccessAction>({
      type: actionTypes.UPDATE_VOTE_COUNT_SUCCESS,
      payload: response.message || 'Vote count updated successfully'
    });

    yield* showSnackbar(response.message || 'Vote count updated successfully', 'success');

    // Reload vote counts
    yield put<types.GetVoteCountsRequestAction>({
      type: actionTypes.GET_VOTE_COUNTS_REQUEST,
      payload: {}
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to update vote count');
    yield put<types.UpdateVoteCountFailureAction>({
      type: actionTypes.UPDATE_VOTE_COUNT_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

function* deleteVoteCountSaga(action: types.DeleteVoteCountRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.deleteVoteCount>> = yield call(api.deleteVoteCount, action.payload);

    yield put<types.DeleteVoteCountSuccessAction>({
      type: actionTypes.DELETE_VOTE_COUNT_SUCCESS,
      payload: {
        id: action.payload,
        message: response.message || 'Vote count deleted successfully'
      }
    });

    yield* showSnackbar(response.message || 'Vote count deleted successfully', 'success');
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to delete vote count');
    yield put<types.DeleteVoteCountFailureAction>({
      type: actionTypes.DELETE_VOTE_COUNT_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

function* verifyVoteCountSaga(action: types.VerifyVoteCountRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.verifyVoteCount>> = yield call(api.verifyVoteCount, action.payload);

    yield put<types.VerifyVoteCountSuccessAction>({
      type: actionTypes.VERIFY_VOTE_COUNT_SUCCESS,
      payload: response.message || 'Vote count verified successfully'
    });

    yield* showSnackbar(response.message || 'Vote count verified successfully', 'success');

    // Reload vote counts
    yield put<types.GetVoteCountsRequestAction>({
      type: actionTypes.GET_VOTE_COUNTS_REQUEST,
      payload: {}
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to verify vote count');
    yield put<types.VerifyVoteCountFailureAction>({
      type: actionTypes.VERIFY_VOTE_COUNT_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

function* bulkVoteEntrySaga(action: types.BulkVoteEntryRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.bulkVoteEntry>> = yield call(api.bulkVoteEntry, action.payload);

    yield put<types.BulkVoteEntrySuccessAction>({
      type: actionTypes.BULK_VOTE_ENTRY_SUCCESS,
      payload: response.message || 'Votes recorded successfully'
    });

    yield* showSnackbar(response.message || 'Votes recorded successfully', 'success');

    // Reload vote counts and statistics
    yield put<types.GetVoteCountsRequestAction>({
      type: actionTypes.GET_VOTE_COUNTS_REQUEST,
      payload: {}
    });
    yield put<types.GetVotingStatisticsRequestAction>({
      type: actionTypes.GET_VOTING_STATISTICS_REQUEST
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to record votes');
    yield put<types.BulkVoteEntryFailureAction>({
      type: actionTypes.BULK_VOTE_ENTRY_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

// ============================================================================
// CANDIDATES SAGAS
// ============================================================================

function* getCandidatesSaga(action: types.GetCandidatesRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.getCandidates>> = yield call(api.getCandidates, action.payload);

    yield put<types.GetCandidatesSuccessAction>({
      type: actionTypes.GET_CANDIDATES_SUCCESS,
      payload: response.data.results || response.data
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to load candidates');
    yield put<types.GetCandidatesFailureAction>({
      type: actionTypes.GET_CANDIDATES_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

function* createCandidateSaga(action: types.CreateCandidateRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.createCandidate>> = yield call(api.createCandidate, action.payload);

    yield put<types.CreateCandidateSuccessAction>({
      type: actionTypes.CREATE_CANDIDATE_SUCCESS,
      payload: response.data
    });

    yield* showSnackbar(response.message || 'Candidate created successfully', 'success');
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to create candidate');
    yield put<types.CreateCandidateFailureAction>({
      type: actionTypes.CREATE_CANDIDATE_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

function* updateCandidateSaga(action: types.UpdateCandidateRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.updateCandidate>> = yield call(
      api.updateCandidate,
      action.payload.id,
      action.payload.data
    );

    yield put<types.UpdateCandidateSuccessAction>({
      type: actionTypes.UPDATE_CANDIDATE_SUCCESS,
      payload: response.data
    });

    yield* showSnackbar(response.message || 'Candidate updated successfully', 'success');
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to update candidate');
    yield put<types.UpdateCandidateFailureAction>({
      type: actionTypes.UPDATE_CANDIDATE_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

function* deleteCandidateSaga(action: types.DeleteCandidateRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.deleteCandidate>> = yield call(api.deleteCandidate, action.payload);

    yield put<types.DeleteCandidateSuccessAction>({
      type: actionTypes.DELETE_CANDIDATE_SUCCESS,
      payload: { id: action.payload, message: response.message || 'Candidate deleted successfully' }
    });

    yield* showSnackbar(response.message || 'Candidate deleted successfully', 'success');
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to delete candidate');
    yield put<types.DeleteCandidateFailureAction>({
      type: actionTypes.DELETE_CANDIDATE_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

// ============================================================================
// PARTIES SAGAS
// ============================================================================

function* getPartiesSaga(action: types.GetPartiesRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.getParties>> = yield call(api.getParties, action.payload);

    yield put<types.GetPartiesSuccessAction>({
      type: actionTypes.GET_PARTIES_SUCCESS,
      payload: response.data.results || response.data
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to load parties');
    yield put<types.GetPartiesFailureAction>({
      type: actionTypes.GET_PARTIES_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

// ============================================================================
// ELECTION RESULTS SAGAS
// ============================================================================

function* getElectionResultsSaga(action: types.GetElectionResultsRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.getElectionResults>> = yield call(api.getElectionResults, action.payload);

    yield put<types.GetElectionResultsSuccessAction>({
      type: actionTypes.GET_ELECTION_RESULTS_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to load election results');
    yield put<types.GetElectionResultsFailureAction>({
      type: actionTypes.GET_ELECTION_RESULTS_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

function* generateResultsSaga(action: types.GenerateResultsRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.generateResults>> = yield call(api.generateResults, action.payload);

    yield put<types.GenerateResultsSuccessAction>({
      type: actionTypes.GENERATE_RESULTS_SUCCESS,
      payload: response.message || 'Results generated successfully'
    });

    yield* showSnackbar(response.message || 'Results generated successfully', 'success');

    // Reload election results
    yield put<types.GetElectionResultsRequestAction>({
      type: actionTypes.GET_ELECTION_RESULTS_REQUEST,
      payload: action.payload
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to generate results');
    yield put<types.GenerateResultsFailureAction>({
      type: actionTypes.GENERATE_RESULTS_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

// ============================================================================
// STATISTICS SAGAS
// ============================================================================

function* getVotingStatisticsSaga(action: types.GetVotingStatisticsRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.getVotingStatistics>> = yield call(api.getVotingStatistics, action.payload);

    yield put<types.GetVotingStatisticsSuccessAction>({
      type: actionTypes.GET_VOTING_STATISTICS_SUCCESS,
      payload: response.data
    });
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to load statistics';
    yield put<types.GetVotingStatisticsFailureAction>({
      type: actionTypes.GET_VOTING_STATISTICS_FAILURE,
      payload: errorMessage
    });
  }
}

// ============================================================================
// COMMITTEE ENTRIES SAGAS
// ============================================================================

function* getCommitteeEntriesSaga(action: types.GetCommitteeEntriesRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.getCommitteeEntries>> = yield call(api.getCommitteeEntries, action.payload);

    yield put<types.GetCommitteeEntriesSuccessAction>({
      type: actionTypes.GET_COMMITTEE_ENTRIES_SUCCESS,
      payload: response.data.results || response.data
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to load committee entries');
    yield put<types.GetCommitteeEntriesFailureAction>({
      type: actionTypes.GET_COMMITTEE_ENTRIES_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

// ============================================================================
// ROOT SAGA
// ============================================================================

export function* watchVoteCounts() {
  yield takeLatest(actionTypes.GET_VOTE_COUNTS_REQUEST, getVoteCountsSaga);
}

export function* watchVoteCountCreation() {
  yield takeLatest(actionTypes.CREATE_VOTE_COUNT_REQUEST, createVoteCountSaga);
}

export function* watchVoteCountUpdates() {
  yield takeLatest(actionTypes.UPDATE_VOTE_COUNT_REQUEST, updateVoteCountSaga);
  yield takeLatest(actionTypes.VERIFY_VOTE_COUNT_REQUEST, verifyVoteCountSaga);
}

export function* watchVoteCountDeletion() {
  yield takeLatest(actionTypes.DELETE_VOTE_COUNT_REQUEST, deleteVoteCountSaga);
}

export function* watchBulkVoteEntry() {
  yield takeLatest(actionTypes.BULK_VOTE_ENTRY_REQUEST, bulkVoteEntrySaga);
}

export function* watchCandidates() {
  yield takeLatest(actionTypes.GET_CANDIDATES_REQUEST, getCandidatesSaga);
  yield takeLatest(actionTypes.CREATE_CANDIDATE_REQUEST, createCandidateSaga);
  yield takeLatest(actionTypes.UPDATE_CANDIDATE_REQUEST, updateCandidateSaga);
  yield takeLatest(actionTypes.DELETE_CANDIDATE_REQUEST, deleteCandidateSaga);
}

export function* watchParties() {
  yield takeLatest(actionTypes.GET_PARTIES_REQUEST, getPartiesSaga);
}

export function* watchElectionResults() {
  yield takeLatest(actionTypes.GET_ELECTION_RESULTS_REQUEST, getElectionResultsSaga);
  yield takeLatest(actionTypes.GENERATE_RESULTS_REQUEST, generateResultsSaga);
}

export function* watchVotingStatistics() {
  yield takeLatest(actionTypes.GET_VOTING_STATISTICS_REQUEST, getVotingStatisticsSaga);
}

export function* watchCommitteeEntries() {
  yield takeLatest(actionTypes.GET_COMMITTEE_ENTRIES_REQUEST, getCommitteeEntriesSaga);
}

export default function* votingSaga() {
  yield all([
    watchVoteCounts(),
    watchVoteCountCreation(),
    watchVoteCountUpdates(),
    watchVoteCountDeletion(),
    watchBulkVoteEntry(),
    watchCandidates(),
    watchParties(),
    watchElectionResults(),
    watchVotingStatistics(),
    watchCommitteeEntries()
  ]);
}
