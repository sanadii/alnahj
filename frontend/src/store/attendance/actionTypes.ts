/**
 * Attendance Action Types
 * Redux action type constants for attendance operations
 */

// ============================================================================
// GET ALL ATTENDANCES
// ============================================================================
export const GET_ATTENDANCES_REQUEST = 'attendance/GET_ATTENDANCES_REQUEST';
export const GET_ATTENDANCES_SUCCESS = 'attendance/GET_ATTENDANCES_SUCCESS';
export const GET_ATTENDANCES_FAILURE = 'attendance/GET_ATTENDANCES_FAILURE';

// ============================================================================
// GET SINGLE ATTENDANCE
// ============================================================================
export const GET_ATTENDANCE_REQUEST = 'attendance/GET_ATTENDANCE_REQUEST';
export const GET_ATTENDANCE_SUCCESS = 'attendance/GET_ATTENDANCE_SUCCESS';
export const GET_ATTENDANCE_FAILURE = 'attendance/GET_ATTENDANCE_FAILURE';

// ============================================================================
// SEARCH ELECTOR
// ============================================================================
export const SEARCH_ELECTOR_REQUEST = 'attendance/SEARCH_ELECTOR_REQUEST';
export const SEARCH_ELECTOR_SUCCESS = 'attendance/SEARCH_ELECTOR_SUCCESS';
export const SEARCH_ELECTOR_FAILURE = 'attendance/SEARCH_ELECTOR_FAILURE';
export const CLEAR_SEARCH_RESULT = 'attendance/CLEAR_SEARCH_RESULT';

// ============================================================================
// MARK ATTENDANCE
// ============================================================================
export const MARK_ATTENDANCE_REQUEST = 'attendance/MARK_ATTENDANCE_REQUEST';
export const MARK_ATTENDANCE_SUCCESS = 'attendance/MARK_ATTENDANCE_SUCCESS';
export const MARK_ATTENDANCE_FAILURE = 'attendance/MARK_ATTENDANCE_FAILURE';

// ============================================================================
// DELETE ATTENDANCE
// ============================================================================
export const DELETE_ATTENDANCE_REQUEST = 'attendance/DELETE_ATTENDANCE_REQUEST';
export const DELETE_ATTENDANCE_SUCCESS = 'attendance/DELETE_ATTENDANCE_SUCCESS';
export const DELETE_ATTENDANCE_FAILURE = 'attendance/DELETE_ATTENDANCE_FAILURE';

// ============================================================================
// COMMITTEE ATTENDANCE
// ============================================================================
export const GET_COMMITTEE_ATTENDANCE_REQUEST = 'attendance/GET_COMMITTEE_ATTENDANCE_REQUEST';
export const GET_COMMITTEE_ATTENDANCE_SUCCESS = 'attendance/GET_COMMITTEE_ATTENDANCE_SUCCESS';
export const GET_COMMITTEE_ATTENDANCE_FAILURE = 'attendance/GET_COMMITTEE_ATTENDANCE_FAILURE';

// ============================================================================
// ATTENDANCE STATISTICS
// ============================================================================
export const GET_ATTENDANCE_STATISTICS_REQUEST = 'attendance/GET_ATTENDANCE_STATISTICS_REQUEST';
export const GET_ATTENDANCE_STATISTICS_SUCCESS = 'attendance/GET_ATTENDANCE_STATISTICS_SUCCESS';
export const GET_ATTENDANCE_STATISTICS_FAILURE = 'attendance/GET_ATTENDANCE_STATISTICS_FAILURE';

export const REFRESH_ATTENDANCE_STATISTICS_REQUEST = 'attendance/REFRESH_ATTENDANCE_STATISTICS_REQUEST';
export const REFRESH_ATTENDANCE_STATISTICS_SUCCESS = 'attendance/REFRESH_ATTENDANCE_STATISTICS_SUCCESS';
export const REFRESH_ATTENDANCE_STATISTICS_FAILURE = 'attendance/REFRESH_ATTENDANCE_STATISTICS_FAILURE';

// ============================================================================
// ADD PENDING ELECTOR
// ============================================================================
export const ADD_PENDING_ELECTOR_REQUEST = 'attendance/ADD_PENDING_ELECTOR_REQUEST';
export const ADD_PENDING_ELECTOR_SUCCESS = 'attendance/ADD_PENDING_ELECTOR_SUCCESS';
export const ADD_PENDING_ELECTOR_FAILURE = 'attendance/ADD_PENDING_ELECTOR_FAILURE';

// ============================================================================
// CLEAR ERRORS
// ============================================================================
export const CLEAR_ATTENDANCE_ERROR = 'attendance/CLEAR_ATTENDANCE_ERROR';
export const CLEAR_SEARCH_ERROR = 'attendance/CLEAR_SEARCH_ERROR';
