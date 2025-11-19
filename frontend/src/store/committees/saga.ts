// ==============================|| COMMITTEES SAGA ||============================== //
// Election Management System - Committees Management

import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as actions from './actions';
import * as types from './actionTypes';
import * as committeesApi from 'helpers/api/committees';
import type { APIResponse } from 'types/api';
import type { Committee, CommitteeListResponse, CommitteeStatistics } from 'types/elections';
import { openSnackbar } from 'store/snackbar/actions';

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
 * Saga: Get Committees List
 */
type GetCommitteesAction = ReturnType<typeof actions.getCommitteesRequest>;
type GetCommitteeAction = ReturnType<typeof actions.getCommitteeRequest>;
type CreateCommitteeAction = ReturnType<typeof actions.createCommitteeRequest>;
type UpdateCommitteeAction = ReturnType<typeof actions.updateCommitteeRequest>;
type DeleteCommitteeAction = ReturnType<typeof actions.deleteCommitteeRequest>;
type AssignUsersAction = ReturnType<typeof actions.assignUsersRequest>;
type GetCommitteeStatisticsAction = ReturnType<typeof actions.getCommitteeStatisticsRequest>;

function* getCommitteesSaga({ payload }: GetCommitteesAction): Generator<any, void, APIResponse<CommitteeListResponse>> {
  try {
    const response = yield call(committeesApi.getCommittees, payload.filters);

    // Handle both paginated and non-paginated responses
    const committees = response.data?.results || response.data || [];
    const totalCount = response.data?.count || committees.length;


    yield put(
      actions.getCommitteesSuccess({
        committees: committees,
        totalCount: totalCount
      })
    );
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to fetch committees');
    console.error('❌ Committees fetch error:', error);
    yield put(actions.getCommitteesError(message));
    yield* showSnackbar(message, 'error');
  }
}

/**
 * Saga: Get Single Committee
 */
function* getCommitteeSaga({ payload }: GetCommitteeAction): Generator<any, void, APIResponse<Committee>> {
  try {
    const response = yield call(committeesApi.getCommittee, payload.id);

    yield put(actions.getCommitteeSuccess(response.data));
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to fetch committee');
    yield put(actions.getCommitteeError(message));
    yield* showSnackbar(message, 'error');
  }
}

/**
 * Saga: Create Committee
 */
function* createCommitteeSaga({ payload }: CreateCommitteeAction): Generator<any, void, APIResponse<Committee>> {
  try {
    const response = yield call(committeesApi.createCommittee, payload);

    yield put(actions.createCommitteeSuccess(response.data));
    yield* showSnackbar(response.message || 'Committee created successfully', 'success');
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to create committee');
    yield put(actions.createCommitteeError(message));
    yield* showSnackbar(message, 'error');
  }
}

/**
 * Saga: Update Committee
 */
function* updateCommitteeSaga({ payload }: UpdateCommitteeAction): Generator<any, void, APIResponse<Committee>> {
  try {
    const { id, data } = payload;
    const response = yield call(committeesApi.updateCommittee, id, data);

    yield put(actions.updateCommitteeSuccess(response.data));
    yield* showSnackbar(response.message || 'Committee updated successfully', 'success');
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to update committee');
    yield put(actions.updateCommitteeError(message));
    yield* showSnackbar(message, 'error');
  }
}

/**
 * Saga: Delete Committee
 */
function* deleteCommitteeSaga({ payload }: DeleteCommitteeAction): Generator<any, void, APIResponse<null>> {
  try {
    const response = yield call(committeesApi.deleteCommittee, payload.id);

    yield put(actions.deleteCommitteeSuccess(payload.id));
    yield* showSnackbar(response.message || 'Committee deleted successfully', 'success');
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to delete committee');
    yield put(actions.deleteCommitteeError(message));
    yield* showSnackbar(message, 'error');
  }
}

/**
 * Saga: Assign Users to Committee
 */
function* assignUsersSaga({ payload }: AssignUsersAction): Generator<any, void, APIResponse<Committee>> {
  try {
    const { id, data } = payload;
    const response = yield call(committeesApi.assignUsersToCommittee, id, data);

    yield put(actions.assignUsersSuccess(response.data));
    yield* showSnackbar(response.message || 'Users assigned successfully', 'success');
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to assign users');
    yield put(actions.assignUsersError(message));
    yield* showSnackbar(message, 'error');
  }
}

/**
 * Saga: Get Committee Statistics
 */
function* getCommitteeStatisticsSaga({
  payload
}: GetCommitteeStatisticsAction): Generator<any, void, APIResponse<CommitteeStatistics>> {
  try {
    const response = yield call(committeesApi.getCommitteeStatistics, payload.id);

    yield put(actions.getCommitteeStatisticsSuccess(response.data));
  } catch (error) {
    const message = getErrorMessage(error, 'Failed to fetch statistics');
    yield put(actions.getCommitteeStatisticsError(message));
    yield* showSnackbar(message, 'error');
  }
}

/**
 * Root Saga: Watch all committee actions
 */
export function* watchCommitteesList() {
  yield takeLatest(types.GET_COMMITTEES_REQUEST, getCommitteesSaga);
}

export function* watchCommitteeDetails() {
  yield takeLatest(types.GET_COMMITTEE_REQUEST, getCommitteeSaga);
}

export function* watchCommitteeCreate() {
  yield takeLatest(types.CREATE_COMMITTEE_REQUEST, createCommitteeSaga);
}

export function* watchCommitteeUpdate() {
  yield takeLatest(types.UPDATE_COMMITTEE_REQUEST, updateCommitteeSaga);
  yield takeLatest(types.ASSIGN_USERS_REQUEST, assignUsersSaga);
}

export function* watchCommitteeDelete() {
  yield takeLatest(types.DELETE_COMMITTEE_REQUEST, deleteCommitteeSaga);
}

export function* watchCommitteeStats() {
  yield takeLatest(types.GET_COMMITTEE_STATISTICS_REQUEST, getCommitteeStatisticsSaga);
}

export default function* committeesSaga(): Generator<any, void, any> {
  yield all([
    watchCommitteesList(),
    watchCommitteeDetails(),
    watchCommitteeCreate(),
    watchCommitteeUpdate(),
    watchCommitteeDelete(),
    watchCommitteeStats()
  ]);
}
