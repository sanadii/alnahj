/**
 * Attendance Reducer
 * Redux state reducer for attendance operations
 */

import type { AttendanceState } from 'types/attendance';
import * as types from './actionTypes';

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: AttendanceState = {
  items: [],
  item: null,
  searchResult: null,
  statistics: null,
  committeeList: null,
  loading: false,
  searchLoading: false,
  markingLoading: false,
  statsLoading: false,
  error: null,
  searchError: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 20, // Reasonable page size for sidebar list
  hasMore: false
};

// ============================================================================
// REDUCER
// ============================================================================

const attendanceReducer = (state = initialState, action: any): AttendanceState => {
  switch (action.type) {
    // ========================================================================
    // GET ALL ATTENDANCES
    // ========================================================================
    case types.GET_ATTENDANCES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.GET_ATTENDANCES_SUCCESS:
      // Handle paginated response
      const payload = action.payload;
      const newItems = Array.isArray(payload?.results) ? payload.results : (Array.isArray(payload) ? payload : []);
      const totalCount = payload?.count || newItems.length;
      const currentPage = payload?.currentPage || state.currentPage;
      const pageSize = payload?.pageSize || state.pageSize;
      
      // If it's a new page (page > 1), append items; otherwise replace
      const items = currentPage > 1 && currentPage > state.currentPage 
        ? [...state.items, ...newItems] 
        : newItems;
      
      return {
        ...state,
        loading: false,
        items: items,
        totalCount: totalCount,
        currentPage: currentPage,
        pageSize: pageSize,
        hasMore: items.length < totalCount,
        error: null
      };

    case types.GET_ATTENDANCES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========================================================================
    // GET SINGLE ATTENDANCE
    // ========================================================================
    case types.GET_ATTENDANCE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.GET_ATTENDANCE_SUCCESS:
      return {
        ...state,
        loading: false,
        item: action.payload,
        error: null
      };

    case types.GET_ATTENDANCE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========================================================================
    // SEARCH ELECTOR
    // ========================================================================
    case types.SEARCH_ELECTOR_REQUEST:
      return {
        ...state,
        searchLoading: true,
        searchError: null,
        searchResult: null
      };

    case types.SEARCH_ELECTOR_SUCCESS:
      return {
        ...state,
        searchLoading: false,
        searchResult: action.payload,
        searchError: null
      };

    case types.SEARCH_ELECTOR_FAILURE:
      return {
        ...state,
        searchLoading: false,
        searchError: action.payload
      };

    case types.CLEAR_SEARCH_RESULT:
      return {
        ...state,
        searchResult: null,
        searchError: null
      };

    // ========================================================================
    // MARK ATTENDANCE
    // ========================================================================
    case types.MARK_ATTENDANCE_REQUEST:
      return {
        ...state,
        markingLoading: true,
        error: null
      };

    case types.MARK_ATTENDANCE_SUCCESS:
      return {
        ...state,
        markingLoading: false,
        items: [action.payload, ...state.items],
        totalCount: state.totalCount + 1,
        searchResult: null, // Clear search after successful mark
        error: null
      };

    case types.MARK_ATTENDANCE_FAILURE:
      return {
        ...state,
        markingLoading: false,
        error: action.payload
      };

    // ========================================================================
    // DELETE ATTENDANCE
    // ========================================================================
    case types.DELETE_ATTENDANCE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.DELETE_ATTENDANCE_SUCCESS:
      return {
        ...state,
        loading: false,
        items: state.items.filter((item) => item.id !== action.payload),
        totalCount: state.totalCount - 1,
        error: null
      };

    case types.DELETE_ATTENDANCE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========================================================================
    // COMMITTEE ATTENDANCE
    // ========================================================================
    case types.GET_COMMITTEE_ATTENDANCE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.GET_COMMITTEE_ATTENDANCE_SUCCESS:
      return {
        ...state,
        loading: false,
        committeeList: action.payload,
        items: action.payload.attendance,
        totalCount: action.payload.attendance.length,
        error: null
      };

    case types.GET_COMMITTEE_ATTENDANCE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========================================================================
    // ATTENDANCE STATISTICS
    // ========================================================================
    case types.GET_ATTENDANCE_STATISTICS_REQUEST:
    case types.REFRESH_ATTENDANCE_STATISTICS_REQUEST:
      return {
        ...state,
        statsLoading: true,
        error: null
      };

    case types.GET_ATTENDANCE_STATISTICS_SUCCESS:
    case types.REFRESH_ATTENDANCE_STATISTICS_SUCCESS:
      return {
        ...state,
        statsLoading: false,
        statistics: action.payload,
        error: null
      };

    case types.GET_ATTENDANCE_STATISTICS_FAILURE:
    case types.REFRESH_ATTENDANCE_STATISTICS_FAILURE:
      return {
        ...state,
        statsLoading: false,
        error: action.payload
      };

    // ========================================================================
    // ADD PENDING ELECTOR
    // ========================================================================
    case types.ADD_PENDING_ELECTOR_REQUEST:
      return {
        ...state,
        markingLoading: true,
        error: null
      };

    case types.ADD_PENDING_ELECTOR_SUCCESS:
      return {
        ...state,
        markingLoading: false,
        error: null
      };

    case types.ADD_PENDING_ELECTOR_FAILURE:
      return {
        ...state,
        markingLoading: false,
        error: action.payload
      };

    // ========================================================================
    // CLEAR ERRORS
    // ========================================================================
    case types.CLEAR_ATTENDANCE_ERROR:
      return {
        ...state,
        error: null
      };

    case types.CLEAR_SEARCH_ERROR:
      return {
        ...state,
        searchError: null
      };

    // ========================================================================
    // DEFAULT
    // ========================================================================
    default:
      return state;
  }
};

export default attendanceReducer;
