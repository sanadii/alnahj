/**
 * Guarantees Redux Saga
 * Election Management System
 */

import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from './actionTypes';
import * as types from './types';
import * as api from 'helpers/api/guarantees';
import { openSnackbar } from 'store/snackbar/actions';

type SnackbarVariant = 'success' | 'error';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!error) return fallback;
  if (typeof error === 'string') return error;
  const responseMessage = (error as { response?: { data?: { message?: string; error?: string } } })?.response?.data;
  if (responseMessage) {
    if (typeof responseMessage === 'string') return responseMessage;
    if (typeof responseMessage.message === 'string') return responseMessage.message;
    if (typeof responseMessage.error === 'string') return responseMessage.error;
  }
  const message = (error as { message?: string })?.message;
  return message || fallback;
};

function* showSnackbar(message: string, variant: SnackbarVariant) {
  yield put(
    openSnackbar({
      open: true,
      message,
      variant,
      close: true
    })
  );
}

// ============================================================================
// GUARANTEES SAGAS
// ============================================================================

export function* getGuaranteesSaga(action: types.GetGuaranteesRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.getGuarantees>> = yield call(api.getGuarantees, action.payload);

    const guarantees = response.data.guarantees || [];
    const statistics = response.data.statistics;
    const groups = response.data.groups || [];
    const pagination = response.meta?.pagination || {};
    const totalCount = pagination.count ?? guarantees.length;

    yield put<types.GetGuaranteesSuccessAction>({
      type: actionTypes.GET_GUARANTEES_SUCCESS,
      payload: {
        guarantees,
        count: totalCount,
        statistics,
        groups,
        pagination,
        skipMeta: action.payload?._skipMeta === true
      }
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to load guarantees');
    console.error('[GuaranteesSaga] Error loading guarantees:', error);
    yield put<types.GetGuaranteesFailureAction>({
      type: actionTypes.GET_GUARANTEES_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

function* createGuaranteeSaga(action: types.CreateGuaranteeRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.createGuarantee>> = yield call(api.createGuarantee, action.payload);

    yield put<types.CreateGuaranteeSuccessAction>({
      type: actionTypes.CREATE_GUARANTEE_SUCCESS,
      payload: response.message || 'Guarantee created successfully'
    });

    yield* showSnackbar(response.message || 'Guarantee created successfully', 'success');

    // Reload to get new guarantee and update statistics
    yield put<types.GetGuaranteesRequestAction>({
      type: actionTypes.GET_GUARANTEES_REQUEST,
      payload: {}
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to create guarantee');
    yield put<types.CreateGuaranteeFailureAction>({
      type: actionTypes.CREATE_GUARANTEE_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

function* updateGuaranteeSaga(action: types.UpdateGuaranteeRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.updateGuarantee>> = yield call(
      api.updateGuarantee,
      action.payload.id,
      action.payload.data
    );

    yield put<types.UpdateGuaranteeSuccessAction>({
      type: actionTypes.UPDATE_GUARANTEE_SUCCESS,
      payload: {
        id: action.payload.id,
        data: response.data,
        message: response.message || 'Guarantee updated successfully'
      }
    });

    yield* showSnackbar(response.message || 'Guarantee updated successfully', 'success');

    // ✅ NO REFETCH - Optimistic update handles it
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to update guarantee');
    yield put<types.UpdateGuaranteeFailureAction>({
      type: actionTypes.UPDATE_GUARANTEE_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

function* deleteGuaranteeSaga(action: types.DeleteGuaranteeRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.deleteGuarantee>> = yield call(api.deleteGuarantee, action.payload);

    yield put<types.DeleteGuaranteeSuccessAction>({
      type: actionTypes.DELETE_GUARANTEE_SUCCESS,
      payload: {
        id: action.payload,
        message: response.message || 'Guarantee deleted successfully'
      }
    });

    yield* showSnackbar(response.message || 'Guarantee deleted successfully', 'success');

    // ✅ NO REFETCH - Optimistic delete handles it
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to delete guarantee');
    yield put<types.DeleteGuaranteeFailureAction>({
      type: actionTypes.DELETE_GUARANTEE_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

function* quickUpdateGuaranteeSaga(action: types.QuickUpdateGuaranteeRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.quickUpdateGuarantee>> = yield call(
      api.quickUpdateGuarantee,
      action.payload.id,
      action.payload.guaranteeStatus
    );

    yield put<types.QuickUpdateGuaranteeSuccessAction>({
      type: actionTypes.QUICK_UPDATE_GUARANTEE_SUCCESS,
      payload: {
        id: action.payload.id,
        guaranteeStatus: action.payload.guaranteeStatus,
        message: response.message || 'Status updated successfully'
      }
    });

    yield* showSnackbar(response.message || 'Status updated successfully', 'success');

    // ✅ NO REFETCH - Optimistic update handles it
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to update status');
    yield put<types.QuickUpdateGuaranteeFailureAction>({
      type: actionTypes.QUICK_UPDATE_GUARANTEE_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

function* bulkUpdateGuaranteesSaga(action: types.BulkUpdateGuaranteesRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.bulkUpdateGuarantees>> = yield call(api.bulkUpdateGuarantees, action.payload);

    yield put<types.BulkUpdateGuaranteesSuccessAction>({
      type: actionTypes.BULK_UPDATE_GUARANTEES_SUCCESS,
      payload: response.message || 'Guarantees updated successfully'
    });

    yield* showSnackbar(response.message || 'Guarantees updated successfully', 'success');

    // Reload guarantees data (includes statistics and groups)
    yield put<types.GetGuaranteesRequestAction>({
      type: actionTypes.GET_GUARANTEES_REQUEST,
      payload: {}
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to bulk update guarantees');
    yield put<types.BulkUpdateGuaranteesFailureAction>({
      type: actionTypes.BULK_UPDATE_GUARANTEES_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

// ============================================================================
// STATISTICS SAGAS
// ============================================================================

function* getStatisticsSaga() {
  try {
    const response: Awaited<ReturnType<typeof api.getGuaranteeStatistics>> = yield call(api.getGuaranteeStatistics);

    yield put<types.GetStatisticsSuccessAction>({
      type: actionTypes.GET_STATISTICS_SUCCESS,
      payload: response.data
    });
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to load statistics';
    yield put<types.GetStatisticsFailureAction>({
      type: actionTypes.GET_STATISTICS_FAILURE,
      payload: errorMessage
    });
  }
}

// ============================================================================
// GROUPS SAGAS
// ============================================================================

function* getGroupsSaga() {
  try {
    const response: Awaited<ReturnType<typeof api.getGuaranteeGroups>> = yield call(api.getGuaranteeGroups);

    yield put<types.GetGroupsSuccessAction>({
      type: actionTypes.GET_GROUPS_SUCCESS,
      payload: response.data
    });
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to load groups';
    yield put<types.GetGroupsFailureAction>({
      type: actionTypes.GET_GROUPS_FAILURE,
      payload: errorMessage
    });
  }
}

function* createGroupSaga(action: types.CreateGroupRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.createGuaranteeGroup>> = yield call(api.createGuaranteeGroup, action.payload);

    yield put<types.CreateGroupSuccessAction>({
      type: actionTypes.CREATE_GROUP_SUCCESS,
      payload: response.message || 'Group created successfully'
    });

    yield* showSnackbar(response.message || 'Group created successfully', 'success');

    // ✅ NO REFETCH - Groups will be reloaded separately if needed
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to create group');
    yield put<types.CreateGroupFailureAction>({
      type: actionTypes.CREATE_GROUP_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

function* updateGroupSaga(action: types.UpdateGroupRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.updateGuaranteeGroup>> = yield call(
      api.updateGuaranteeGroup,
      action.payload.id,
      action.payload.data
    );

    yield put<types.UpdateGroupSuccessAction>({
      type: actionTypes.UPDATE_GROUP_SUCCESS,
      payload: response.message || 'Group updated successfully'
    });

    yield* showSnackbar(response.message || 'Group updated successfully', 'success');

    // ✅ NO REFETCH - Groups will be reloaded separately if needed
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to update group');
    yield put<types.UpdateGroupFailureAction>({
      type: actionTypes.UPDATE_GROUP_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

function* deleteGroupSaga(action: types.DeleteGroupRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.deleteGuaranteeGroup>> = yield call(api.deleteGuaranteeGroup, action.payload);

    yield put<types.DeleteGroupSuccessAction>({
      type: actionTypes.DELETE_GROUP_SUCCESS,
      payload: {
        id: action.payload,
        message: response.message || 'Group deleted successfully'
      }
    });

    yield* showSnackbar(response.message || 'Group deleted successfully', 'success');

    // ✅ NO REFETCH - Groups will be reloaded separately if needed
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to delete group');
    yield put<types.DeleteGroupFailureAction>({
      type: actionTypes.DELETE_GROUP_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

// ============================================================================
// NOTES SAGAS
// ============================================================================

function* addNoteSaga(action: types.AddNoteRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.addGuaranteeNote>> = yield call(
      api.addGuaranteeNote,
      action.payload.guaranteeId,
      action.payload.data
    );

    yield put<types.AddNoteSuccessAction>({
      type: actionTypes.ADD_NOTE_SUCCESS,
      payload: response.message || 'Note added successfully'
    });

    yield* showSnackbar(response.message || 'Note added successfully', 'success');

    // ✅ NO REFETCH - Note added doesn't affect list view significantly
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to add note');
    yield put<types.AddNoteFailureAction>({
      type: actionTypes.ADD_NOTE_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

// ============================================================================
// CONFIRMATION SAGAS
// ============================================================================

function* confirmGuaranteeSaga(action: types.ConfirmGuaranteeRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.confirmGuarantee>> = yield call(
      api.confirmGuarantee,
      action.payload.id,
      action.payload.data
    );

    yield put<types.ConfirmGuaranteeSuccessAction>({
      type: actionTypes.CONFIRM_GUARANTEE_SUCCESS,
      payload: {
        id: action.payload.id,
        data: response.data,
        message: response.message || 'Guarantee confirmed successfully'
      }
    });

    yield* showSnackbar(response.message || 'Guarantee confirmed successfully', 'success');

    // ✅ NO REFETCH - Optimistic update handles it
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to confirm guarantee');
    yield put<types.ConfirmGuaranteeFailureAction>({
      type: actionTypes.CONFIRM_GUARANTEE_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

function* bulkConfirmGuaranteesSaga(action: types.BulkConfirmGuaranteesRequestAction) {
  try {
    const response: Awaited<ReturnType<typeof api.bulkConfirmGuarantees>> = yield call(api.bulkConfirmGuarantees, action.payload);

    yield put<types.BulkConfirmGuaranteesSuccessAction>({
      type: actionTypes.BULK_CONFIRM_GUARANTEES_SUCCESS,
      payload: {
        updatedCount: response.data.updated_count,
        message: response.message || `Successfully confirmed ${response.data.updated_count} guarantees`
      }
    });

    yield* showSnackbar(response.message || `Successfully confirmed ${response.data.updated_count} guarantees`, 'success');

    // Refetch to get updated list
    yield put<types.GetGuaranteesRequestAction>({
      type: actionTypes.GET_GUARANTEES_REQUEST,
      payload: {}
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Failed to confirm guarantees');
    yield put<types.BulkConfirmGuaranteesFailureAction>({
      type: actionTypes.BULK_CONFIRM_GUARANTEES_FAILURE,
      payload: errorMessage
    });
    yield* showSnackbar(errorMessage, 'error');
  }
}

// ============================================================================
// ROOT SAGA
// ============================================================================

export function* watchGuaranteeList() {
  yield takeLatest(actionTypes.GET_GUARANTEES_REQUEST, getGuaranteesSaga);
}

export function* watchGuaranteeCreate() {
  yield takeLatest(actionTypes.CREATE_GUARANTEE_REQUEST, createGuaranteeSaga);
}

export function* watchGuaranteeUpdate() {
  yield takeLatest(actionTypes.UPDATE_GUARANTEE_REQUEST, updateGuaranteeSaga);
}

export function* watchGuaranteeDelete() {
  yield takeLatest(actionTypes.DELETE_GUARANTEE_REQUEST, deleteGuaranteeSaga);
}

export function* watchGuaranteeQuickUpdate() {
  yield takeLatest(actionTypes.QUICK_UPDATE_GUARANTEE_REQUEST, quickUpdateGuaranteeSaga);
}

export function* watchGuaranteeBulkUpdate() {
  yield takeLatest(actionTypes.BULK_UPDATE_GUARANTEES_REQUEST, bulkUpdateGuaranteesSaga);
}

export function* watchGuaranteeStats() {
  yield takeLatest(actionTypes.GET_STATISTICS_REQUEST, getStatisticsSaga);
}

export function* watchGuaranteeGroups() {
  yield takeLatest(actionTypes.GET_GROUPS_REQUEST, getGroupsSaga);
  yield takeLatest(actionTypes.CREATE_GROUP_REQUEST, createGroupSaga);
  yield takeLatest(actionTypes.UPDATE_GROUP_REQUEST, updateGroupSaga);
  yield takeLatest(actionTypes.DELETE_GROUP_REQUEST, deleteGroupSaga);
}

export function* watchGuaranteeNotes() {
  yield takeLatest(actionTypes.ADD_NOTE_REQUEST, addNoteSaga);
}

export function* watchGuaranteeConfirmations() {
  yield takeLatest(actionTypes.CONFIRM_GUARANTEE_REQUEST, confirmGuaranteeSaga);
  yield takeLatest(actionTypes.BULK_CONFIRM_GUARANTEES_REQUEST, bulkConfirmGuaranteesSaga);
}

export default function* guaranteeSaga() {
  yield all([
    watchGuaranteeList(),
    watchGuaranteeCreate(),
    watchGuaranteeUpdate(),
    watchGuaranteeDelete(),
    watchGuaranteeQuickUpdate(),
    watchGuaranteeBulkUpdate(),
    watchGuaranteeStats(),
    watchGuaranteeGroups(),
    watchGuaranteeNotes(),
    watchGuaranteeConfirmations()
  ]);
}
