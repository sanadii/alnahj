// ==============================|| USERS REDUCER ||============================== //
// Election Management System - Users Management

import * as types from './actionTypes';
import type { UsersState } from 'types/users-management';

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: UsersState = {
  // Data
  users: [],
  currentUser: null,
  userStats: null,

  // Pagination
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,

  // UI State
  loading: false,
  error: null,

  // Filters
  filters: {
    search: '',
    role: '',
    isActive: null,
    supervisor: null,
    team: undefined,
    ordering: '-created_at',
    page: 1,
    pageSize: 10
  }
};

// ============================================================================
// REDUCER
// ============================================================================

const usersReducer = (state = initialState, action: any): UsersState => {
  switch (action.type) {
    // ========== GET USERS ==========
    case types.GET_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.GET_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload.users,
        totalCount: action.payload.totalCount,
        error: null
      };

    case types.GET_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== GET SINGLE USER ==========
    case types.GET_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.GET_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        currentUser: action.payload,
        error: null
      };

    case types.GET_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== CREATE USER ==========
    case types.CREATE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.CREATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: [action.payload, ...state.users],
        totalCount: state.totalCount + 1,
        error: null
      };

    case types.CREATE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== UPDATE USER ==========
    case types.UPDATE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.UPDATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.map((user) => (user.id === action.payload.id ? action.payload : user)),
        currentUser: state.currentUser?.id === action.payload.id ? action.payload : state.currentUser,
        error: null
      };

    case types.UPDATE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== DELETE USER ==========
    case types.DELETE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.DELETE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.filter((user) => user.id !== action.payload),
        totalCount: state.totalCount - 1,
        currentUser: state.currentUser?.id === action.payload ? null : state.currentUser,
        error: null
      };

    case types.DELETE_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== CHANGE PASSWORD ==========
    case types.CHANGE_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };

    case types.CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== GET USER STATS ==========
    case types.GET_USER_STATS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.GET_USER_STATS_SUCCESS:
      return {
        ...state,
        loading: false,
        userStats: action.payload,
        error: null
      };

    case types.GET_USER_STATS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== ACTIVATE/DEACTIVATE USER ==========
    case types.ACTIVATE_USER_REQUEST:
    case types.DEACTIVATE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.ACTIVATE_USER_SUCCESS:
    case types.DEACTIVATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.map((user) => (user.id === action.payload.id ? action.payload : user)),
        currentUser: state.currentUser?.id === action.payload.id ? action.payload : state.currentUser,
        error: null
      };

    // ========== BULK OPERATIONS ==========
    case types.BULK_USER_OPERATION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.BULK_USER_OPERATION_SUCCESS:
      // Refresh the list after bulk operation
      return {
        ...state,
        loading: false,
        error: null
      };

    case types.BULK_USER_OPERATION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== FILTERS ==========
    case types.SET_USER_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };

    case types.CLEAR_USER_FILTERS:
      return {
        ...state,
        filters: initialState.filters
      };

    // ========== UTILITIES ==========
    case types.CLEAR_USER_FAILURE:
      return {
        ...state,
        error: null
      };

    case types.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload
      };

    case types.CLEAR_CURRENT_USER:
      return {
        ...state,
        currentUser: null
      };

    default:
      return state;
  }
};

export default usersReducer;
