/**
 * Guarantees Redux Reducer
 * Election Management System
 */

import * as types from './actionTypes';
import type { GuaranteeState, GuaranteeActionTypes } from './types';
import { asyncRequest, asyncSuccess, asyncFailure } from 'store/utils/asyncState';

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: GuaranteeState = {
  guarantees: [],
  groups: [],
  statistics: null,
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,
  filters: {
    search: '',
    guaranteeStatus: '',
    group: '',
    confirmationStatus: '',
    page: 1,
    pageSize: 10
  }
};

// ============================================================================
// REDUCER
// ============================================================================

const guaranteeReducer = (state = initialState, action: GuaranteeActionTypes): GuaranteeState => {
  switch (action.type) {
    // Get Guarantees (includes statistics and groups)
    case types.GET_GUARANTEES_REQUEST:
      return {
        ...state,
        ...asyncRequest(state)
      };

    case types.GET_GUARANTEES_SUCCESS:
      return {
        ...state,
        ...asyncSuccess(state),
        guarantees: action.payload.guarantees,
        totalCount: action.payload.count,
        statistics: action.payload.skipMeta ? state.statistics : action.payload.statistics,
        groups: action.payload.skipMeta ? state.groups : action.payload.groups
      };

    case types.GET_GUARANTEES_FAILURE:
      return {
        ...state,
        ...asyncFailure(state, action.payload)
      };

    // Create Guarantee
    case types.CREATE_GUARANTEE_REQUEST:
      return {
        ...state,
        ...asyncRequest(state)
      };

    case types.CREATE_GUARANTEE_SUCCESS:
      return {
        ...state,
        ...asyncSuccess(state)
      };

    case types.CREATE_GUARANTEE_FAILURE:
      return {
        ...state,
        ...asyncFailure(state, action.payload)
      };

    // Update Guarantee
    case types.UPDATE_GUARANTEE_REQUEST:
      return {
        ...state,
        // ✅ DON'T set loading:true - prevents list flicker
        error: null // Only clear error
      };

    case types.UPDATE_GUARANTEE_SUCCESS:
      return {
        ...state,
        ...asyncSuccess(state),
        guarantees: state.guarantees.map((g) =>
          g.id === action.payload.id ? { ...g, ...action.payload.data } : g
        )
      };

    case types.UPDATE_GUARANTEE_FAILURE:
      return {
        ...state,
        // ✅ Don't change loading state - prevents list flicker
        error: typeof action.payload === 'string' ? action.payload : action.payload?.message || 'Update failed'
      };

    // Delete Guarantee
    case types.DELETE_GUARANTEE_REQUEST:
      return {
        ...state,
        // ✅ DON'T set loading:true - prevents list flicker
        error: null
      };

    case types.DELETE_GUARANTEE_SUCCESS:
      return {
        ...state,
        loading: false,
        guarantees: state.guarantees.filter((g) => g.id !== action.payload.id),
        totalCount: state.totalCount - 1,
        error: null
      };

    case types.DELETE_GUARANTEE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Quick Update
    case types.QUICK_UPDATE_GUARANTEE_REQUEST:
      return {
        ...state,
        // ✅ DON'T set loading:true - prevents list flicker
        error: null
      };

    case types.QUICK_UPDATE_GUARANTEE_SUCCESS: {
      const previousGuarantee = state.guarantees.find((g) => g.id === action.payload.id);
      const updatedGuarantees = state.guarantees.map((g) =>
        g.id === action.payload.id ? { ...g, guaranteeStatus: action.payload.guaranteeStatus } : g
      );

      let updatedStatistics = state.statistics;
      if (updatedStatistics && previousGuarantee && previousGuarantee.guaranteeStatus !== action.payload.guaranteeStatus) {
        const nextStats = { ...updatedStatistics };
        if (previousGuarantee.guaranteeStatus === 'PENDING') {
          nextStats.pending_count = Math.max(0, (nextStats.pending_count || 0) - 1);
        }
        if (previousGuarantee.guaranteeStatus === 'GUARANTEED') {
          nextStats.guaranteed_count = Math.max(0, (nextStats.guaranteed_count || 0) - 1);
        }
        if (action.payload.guaranteeStatus === 'PENDING') {
          nextStats.pending_count = (nextStats.pending_count || 0) + 1;
        }
        if (action.payload.guaranteeStatus === 'GUARANTEED') {
          nextStats.guaranteed_count = (nextStats.guaranteed_count || 0) + 1;
        }
        updatedStatistics = nextStats;
      }

      return {
        ...state,
        loading: false,
        guarantees: updatedGuarantees,
        statistics: updatedStatistics,
        error: null
      };
    }

    case types.QUICK_UPDATE_GUARANTEE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Bulk Update
    case types.BULK_UPDATE_GUARANTEES_REQUEST:
      return {
        ...state,
        ...asyncRequest(state)
      };

    case types.BULK_UPDATE_GUARANTEES_SUCCESS:
      return {
        ...state,
        ...asyncSuccess(state)
      };

    case types.BULK_UPDATE_GUARANTEES_FAILURE:
      return {
        ...state,
        ...asyncFailure(state, action.payload)
      };

    // Confirmation
    case types.CONFIRM_GUARANTEE_REQUEST:
      return {
        ...state,
        error: null
      };

    case types.CONFIRM_GUARANTEE_SUCCESS:
      return {
        ...state,
        loading: false,
        guarantees: state.guarantees.map((g) => (g.id === action.payload.id ? action.payload.data : g)),
        error: null
      };

    case types.CONFIRM_GUARANTEE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case types.BULK_CONFIRM_GUARANTEES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.BULK_CONFIRM_GUARANTEES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };

    case types.BULK_CONFIRM_GUARANTEES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Statistics
    case types.GET_STATISTICS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.GET_STATISTICS_SUCCESS:
      return {
        ...state,
        loading: false,
        statistics: action.payload,
        error: null
      };

    case types.GET_STATISTICS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Groups
    case types.GET_GROUPS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.GET_GROUPS_SUCCESS:
      return {
        ...state,
        loading: false,
        groups: action.payload,
        error: null
      };

    case types.GET_GROUPS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Create Group
    case types.CREATE_GROUP_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.CREATE_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };

    case types.CREATE_GROUP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Update Group
    case types.UPDATE_GROUP_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.UPDATE_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };

    case types.UPDATE_GROUP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Delete Group
    case types.DELETE_GROUP_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.DELETE_GROUP_SUCCESS:
      return {
        ...state,
        loading: false,
        groups: state.groups.filter((g) => g.id !== action.payload.id),
        error: null
      };

    case types.DELETE_GROUP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Add Note
    case types.ADD_NOTE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.ADD_NOTE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };

    case types.ADD_NOTE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Filters
    case types.SET_GUARANTEE_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        },
        currentPage: action.payload.page ?? state.currentPage,
        pageSize: action.payload.pageSize ?? state.pageSize
      };

    // Clear Error
    case types.CLEAR_GUARANTEE_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

export default guaranteeReducer;
