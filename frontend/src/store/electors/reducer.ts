// ==============================|| ELECTORS REDUCER ||============================== //
// Election Management System - Electors Management

import * as types from './actionTypes';
import type { Elector, ElectorFilters } from 'types/electors';

// ============================================================================
// STATE INTERFACE
// ============================================================================

export interface ElectorsState {
  // Data
  electors: Elector[];
  currentElector: Elector | null;
  electorStats: any | null;
  groups: any[] | null;

  // Pagination
  totalCount: number;
  currentPage: number;
  pageSize: number;

  // UI State
  loading: boolean;
  error: string | null;

  // Filters
  filters: ElectorFilters;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: ElectorsState = {
  // Data
  electors: [],
  currentElector: null,
  electorStats: null,
  groups: null,

  // Pagination
  totalCount: 0,
  currentPage: 1,
  pageSize: 25,

  // UI State
  loading: false,
  error: null,

  // Filters
  filters: {
    search: '',
    gender: '',
    committee: undefined,
    department: undefined,
    team: undefined,
    section: undefined,
    nameFirst: undefined,
    nameSecond: undefined,
    nameThird: undefined,
    nameFourth: undefined,
    subFamilyName: undefined,
    familyName: undefined,
    page: 1,
    pageSize: 25
  }
};

// ============================================================================
// REDUCER
// ============================================================================

const electorsReducer = (state = initialState, action: any): ElectorsState => {
  switch (action.type) {
    // ========== GET ELECTORS ==========
    case types.GET_ELECTORS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.GET_ELECTORS_SUCCESS:

      return {
        ...state,
        loading: false,
        electors: action.payload.electors,
        totalCount: action.payload.totalCount,
        groups: action.payload.groups || state.groups,
        error: null
      };

    case types.GET_ELECTORS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== GET SINGLE ELECTOR ==========
    case types.GET_ELECTOR_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.GET_ELECTOR_SUCCESS:
      return {
        ...state,
        loading: false,
        currentElector: action.payload,
        error: null
      };

    case types.GET_ELECTOR_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== CREATE ELECTOR ==========
    case types.CREATE_ELECTOR_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.CREATE_ELECTOR_SUCCESS:
      return {
        ...state,
        loading: false,
        electors: [...state.electors, action.payload],
        totalCount: state.totalCount + 1,
        error: null
      };

    case types.CREATE_ELECTOR_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== UPDATE ELECTOR ==========
    case types.UPDATE_ELECTOR_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.UPDATE_ELECTOR_SUCCESS:
      return {
        ...state,
        loading: false,
        electors: state.electors.map((elector) => (elector.kocId === action.payload.kocId ? action.payload : elector)),
        currentElector: state.currentElector?.kocId === action.payload.kocId ? action.payload : state.currentElector,
        error: null
      };

    case types.UPDATE_ELECTOR_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== DELETE ELECTOR ==========
    case types.DELETE_ELECTOR_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.DELETE_ELECTOR_SUCCESS:
      return {
        ...state,
        loading: false,
        electors: state.electors.filter((elector) => elector.kocId !== action.payload),
        totalCount: state.totalCount - 1,
        error: null
      };

    case types.DELETE_ELECTOR_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== IMPORT ELECTORS ==========
    case types.IMPORT_ELECTORS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.IMPORT_ELECTORS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
        // After import, trigger a refresh of electors list
      };

    case types.IMPORT_ELECTORS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== EXPORT ELECTORS ==========
    case types.EXPORT_ELECTORS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.EXPORT_ELECTORS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };

    case types.EXPORT_ELECTORS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== GET STATS ==========
    case types.GET_ELECTOR_STATS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.GET_ELECTOR_STATS_SUCCESS:
      return {
        ...state,
        loading: false,
        electorStats: action.payload,
        error: null
      };

    case types.GET_ELECTOR_STATS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== FILTERS ==========
    case types.SET_ELECTOR_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };

    case types.CLEAR_ELECTOR_FILTERS:
      return {
        ...state,
        filters: initialState.filters
      };

    // ========== UTILITIES ==========
    case types.CLEAR_ELECTOR_FAILURE:
      return {
        ...state,
        error: null
      };

    case types.SET_CURRENT_ELECTOR:
      return {
        ...state,
        currentElector: action.payload
      };

    case types.CLEAR_CURRENT_ELECTOR:
      return {
        ...state,
        currentElector: null
      };

    case types.UPDATE_ELECTOR_GUARANTEE_STATUS:
      const updatedElectors = state.electors.map((elector) => {
        if (elector.kocId === action.payload.kocId) {
          const updated = {
            ...elector,
            isGuarantee: !!action.payload.guaranteeStatus,
            guaranteeStatus: action.payload.guaranteeStatus ?? null
          };
          return updated;
        }
        return elector;
      });

      return {
        ...state,
        electors: updatedElectors,
        currentElector:
          state.currentElector?.kocId === action.payload.kocId
            ? {
                ...state.currentElector,
                isGuarantee: !!action.payload.guaranteeStatus,
                guaranteeStatus: action.payload.guaranteeStatus ?? null
              }
            : state.currentElector
      };

    default:
      return state;
  }
};

export default electorsReducer;
