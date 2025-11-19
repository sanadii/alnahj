/**
 * Guarantees Redux Actions
 * Election Management System
 */

import type {
  GuaranteeFilters,
  GuaranteeCreateData,
  GuaranteeUpdateData,
  GuaranteeBulkUpdateData,
  GuaranteeGroupFormData,
  GuaranteeNoteCreateData,
  GuaranteeConfirmData,
  GuaranteeBulkConfirmData,
  GuaranteeStatus
} from 'types/guarantees';
import * as actionTypes from './actionTypes';
import * as types from './types';

// ============================================================================
// GUARANTEES ACTIONS
// ============================================================================

export const getGuaranteesRequest = (filters: GuaranteeFilters = {}): types.GetGuaranteesRequestAction => ({
  type: actionTypes.GET_GUARANTEES_REQUEST,
  payload: filters
});

export const createGuaranteeRequest = (data: GuaranteeCreateData): types.CreateGuaranteeRequestAction => ({
  type: actionTypes.CREATE_GUARANTEE_REQUEST,
  payload: data
});

export const updateGuaranteeRequest = (id: number, data: GuaranteeUpdateData): types.UpdateGuaranteeRequestAction => ({
  type: actionTypes.UPDATE_GUARANTEE_REQUEST,
  payload: { id, data }
});

export const deleteGuaranteeRequest = (id: number): types.DeleteGuaranteeRequestAction => ({
  type: actionTypes.DELETE_GUARANTEE_REQUEST,
  payload: id
});

export const quickUpdateGuaranteeRequest = (
  id: number,
  guaranteeStatus: GuaranteeStatus
): types.QuickUpdateGuaranteeRequestAction => ({
  type: actionTypes.QUICK_UPDATE_GUARANTEE_REQUEST,
  payload: { id, guaranteeStatus }
});

export const bulkUpdateGuaranteesRequest = (data: GuaranteeBulkUpdateData): types.BulkUpdateGuaranteesRequestAction => ({
  type: actionTypes.BULK_UPDATE_GUARANTEES_REQUEST,
  payload: data
});

// ============================================================================
// STATISTICS ACTIONS
// ============================================================================

export const getStatisticsRequest = (): types.GetStatisticsRequestAction => ({
  type: actionTypes.GET_STATISTICS_REQUEST
});

// ============================================================================
// GROUPS ACTIONS
// ============================================================================

export const getGroupsRequest = (): types.GetGroupsRequestAction => ({
  type: actionTypes.GET_GROUPS_REQUEST
});

export const createGroupRequest = (data: GuaranteeGroupFormData): types.CreateGroupRequestAction => ({
  type: actionTypes.CREATE_GROUP_REQUEST,
  payload: data
});

export const updateGroupRequest = (id: number, data: Partial<GuaranteeGroupFormData>): types.UpdateGroupRequestAction => ({
  type: actionTypes.UPDATE_GROUP_REQUEST,
  payload: { id, data }
});

export const deleteGroupRequest = (id: number): types.DeleteGroupRequestAction => ({
  type: actionTypes.DELETE_GROUP_REQUEST,
  payload: id
});

// ============================================================================
// NOTES ACTIONS
// ============================================================================

export const addNoteRequest = (guaranteeId: number, data: GuaranteeNoteCreateData): types.AddNoteRequestAction => ({
  type: actionTypes.ADD_NOTE_REQUEST,
  payload: { guaranteeId, data }
});

// ============================================================================
// CONFIRMATION ACTIONS
// ============================================================================

export const confirmGuaranteeRequest = (id: number, data: GuaranteeConfirmData): types.ConfirmGuaranteeRequestAction => ({
  type: actionTypes.CONFIRM_GUARANTEE_REQUEST,
  payload: { id, data }
});

export const bulkConfirmGuaranteesRequest = (data: GuaranteeBulkConfirmData): types.BulkConfirmGuaranteesRequestAction => ({
  type: actionTypes.BULK_CONFIRM_GUARANTEES_REQUEST,
  payload: data
});

// ============================================================================
// UTILITY ACTIONS
// ============================================================================

export const setGuaranteeFilters = (filters: GuaranteeFilters): types.SetGuaranteeFiltersAction => ({
  type: actionTypes.SET_GUARANTEE_FILTERS,
  payload: filters
});

export const clearGuaranteeError = (): types.ClearGuaranteeErrorAction => ({
  type: actionTypes.CLEAR_GUARANTEE_ERROR
});

// ============================================================================
// SUCCESS ACTIONS (for WebSocket updates)
// ============================================================================

export const updateGuaranteeSuccess = (payload: { id: number; data: any }): types.UpdateGuaranteeSuccessAction => ({
  type: actionTypes.UPDATE_GUARANTEE_SUCCESS,
  payload: { ...payload, message: 'Guarantee updated' }
});

export const deleteGuaranteeSuccess = (payload: { id: number }): types.DeleteGuaranteeSuccessAction => ({
  type: actionTypes.DELETE_GUARANTEE_SUCCESS,
  payload
});