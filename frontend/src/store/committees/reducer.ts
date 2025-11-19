// ==============================|| COMMITTEES REDUCER ||============================== //
// Election Management System - Committees Management

import * as types from './actionTypes';
import type { CommitteesState } from 'types/elections';

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: CommitteesState = {
  // Data
  committees: [],
  currentCommittee: null,
  committeeStatistics: null,

  // Pagination
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,

  // UI State
  loading: false,
  error: null,

  // Filters
  filters: {
    election: undefined,
    gender: '',
    search: '',
    ordering: 'code',
    page: 1,
    pageSize: 10
  }
};

// ============================================================================
// REDUCER
// ============================================================================

const committeesReducer = (state = initialState, action: any): CommitteesState => {
  switch (action.type) {
    // ========== GET COMMITTEES ==========
    case types.GET_COMMITTEES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.GET_COMMITTEES_SUCCESS:
      return {
        ...state,
        loading: false,
        committees: action.payload.committees,
        totalCount: action.payload.totalCount,
        error: null
      };

    case types.GET_COMMITTEES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== GET SINGLE COMMITTEE ==========
    case types.GET_COMMITTEE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.GET_COMMITTEE_SUCCESS:
      return {
        ...state,
        loading: false,
        currentCommittee: action.payload,
        error: null
      };

    case types.GET_COMMITTEE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== CREATE COMMITTEE ==========
    case types.CREATE_COMMITTEE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.CREATE_COMMITTEE_SUCCESS:
      return {
        ...state,
        loading: false,
        committees: [action.payload, ...state.committees],
        totalCount: state.totalCount + 1,
        error: null
      };

    case types.CREATE_COMMITTEE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== UPDATE COMMITTEE ==========
    case types.UPDATE_COMMITTEE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.UPDATE_COMMITTEE_SUCCESS:
      return {
        ...state,
        loading: false,
        committees: state.committees.map((committee) => (committee.id === action.payload.id ? action.payload : committee)),
        currentCommittee: state.currentCommittee?.id === action.payload.id ? action.payload : state.currentCommittee,
        error: null
      };

    case types.UPDATE_COMMITTEE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== DELETE COMMITTEE ==========
    case types.DELETE_COMMITTEE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.DELETE_COMMITTEE_SUCCESS:
      return {
        ...state,
        loading: false,
        committees: state.committees.filter((committee) => committee.id !== action.payload),
        totalCount: state.totalCount - 1,
        currentCommittee: state.currentCommittee?.id === action.payload ? null : state.currentCommittee,
        error: null
      };

    case types.DELETE_COMMITTEE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== ASSIGN USERS ==========
    case types.ASSIGN_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.ASSIGN_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        committees: state.committees.map((committee) => (committee.id === action.payload.id ? action.payload : committee)),
        currentCommittee: state.currentCommittee?.id === action.payload.id ? action.payload : state.currentCommittee,
        error: null
      };

    case types.ASSIGN_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== GET COMMITTEE STATISTICS ==========
    case types.GET_COMMITTEE_STATISTICS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.GET_COMMITTEE_STATISTICS_SUCCESS:
      return {
        ...state,
        loading: false,
        committeeStatistics: action.payload,
        error: null
      };

    case types.GET_COMMITTEE_STATISTICS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== FILTERS ==========
    case types.SET_COMMITTEE_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };

    case types.CLEAR_COMMITTEE_FILTERS:
      return {
        ...state,
        filters: initialState.filters
      };

    // ========== UTILITIES ==========
    case types.CLEAR_COMMITTEE_FAILURE:
      return {
        ...state,
        error: null
      };

    case types.SET_CURRENT_COMMITTEE:
      return {
        ...state,
        currentCommittee: action.payload
      };

    case types.CLEAR_CURRENT_COMMITTEE:
      return {
        ...state,
        currentCommittee: null
      };

    default:
      return state;
  }
};

export default committeesReducer;
