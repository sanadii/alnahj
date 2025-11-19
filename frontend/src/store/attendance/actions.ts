/**
 * Attendance Actions
 * Redux action creators for attendance operations
 */

import * as types from './actionTypes';
import type {
  Attendance,
  AttendanceStatistics,
  CommitteeAttendanceList,
  ElectorSearchResult,
  MarkAttendanceRequest,
  SearchElectorRequest,
  AttendanceFilterParams
} from 'types/attendance';

// ============================================================================
// GET ALL ATTENDANCES
// ============================================================================

export const getAttendancesRequest = (filters?: AttendanceFilterParams, page?: number, pageSize?: number) => ({
  type: types.GET_ATTENDANCES_REQUEST,
  payload: { filters, page, pageSize }
});

export const getAttendancesSuccess = (data: Attendance[]) => ({
  type: types.GET_ATTENDANCES_SUCCESS,
  payload: data
});

export const getAttendancesError = (error: string) => ({
  type: types.GET_ATTENDANCES_FAILURE,
  payload: error
});

// ============================================================================
// GET SINGLE ATTENDANCE
// ============================================================================

export const getAttendanceRequest = (id: number) => ({
  type: types.GET_ATTENDANCE_REQUEST,
  payload: { id }
});

export const getAttendanceSuccess = (data: Attendance) => ({
  type: types.GET_ATTENDANCE_SUCCESS,
  payload: data
});

export const getAttendanceError = (error: string) => ({
  type: types.GET_ATTENDANCE_FAILURE,
  payload: error
});

// ============================================================================
// SEARCH ELECTOR
// ============================================================================

export const searchElectorRequest = (params: SearchElectorRequest) => ({
  type: types.SEARCH_ELECTOR_REQUEST,
  payload: params
});

export const searchElectorSuccess = (data: ElectorSearchResult) => ({
  type: types.SEARCH_ELECTOR_SUCCESS,
  payload: data
});

export const searchElectorError = (error: string) => ({
  type: types.SEARCH_ELECTOR_FAILURE,
  payload: error
});

export const clearSearchResult = () => ({
  type: types.CLEAR_SEARCH_RESULT
});

// ============================================================================
// MARK ATTENDANCE
// ============================================================================

export const markAttendanceRequest = (data: MarkAttendanceRequest) => ({
  type: types.MARK_ATTENDANCE_REQUEST,
  payload: data
});

export const markAttendanceSuccess = (data: Attendance) => ({
  type: types.MARK_ATTENDANCE_SUCCESS,
  payload: data
});

export const markAttendanceError = (error: string) => ({
  type: types.MARK_ATTENDANCE_FAILURE,
  payload: error
});

// ============================================================================
// DELETE ATTENDANCE
// ============================================================================

export const deleteAttendanceRequest = (id: number) => ({
  type: types.DELETE_ATTENDANCE_REQUEST,
  payload: { id }
});

export const deleteAttendanceSuccess = (id: number) => ({
  type: types.DELETE_ATTENDANCE_SUCCESS,
  payload: id
});

export const deleteAttendanceError = (error: string) => ({
  type: types.DELETE_ATTENDANCE_FAILURE,
  payload: error
});

// ============================================================================
// COMMITTEE ATTENDANCE
// ============================================================================

export const getCommitteeAttendanceRequest = (committeeCode: string) => ({
  type: types.GET_COMMITTEE_ATTENDANCE_REQUEST,
  payload: { committeeCode }
});

export const getCommitteeAttendanceSuccess = (data: CommitteeAttendanceList) => ({
  type: types.GET_COMMITTEE_ATTENDANCE_SUCCESS,
  payload: data
});

export const getCommitteeAttendanceError = (error: string) => ({
  type: types.GET_COMMITTEE_ATTENDANCE_FAILURE,
  payload: error
});

// ============================================================================
// ATTENDANCE STATISTICS
// ============================================================================

export const getAttendanceStatisticsRequest = (committeeCode: string) => ({
  type: types.GET_ATTENDANCE_STATISTICS_REQUEST,
  payload: { committeeCode }
});

export const getAttendanceStatisticsSuccess = (data: AttendanceStatistics) => ({
  type: types.GET_ATTENDANCE_STATISTICS_SUCCESS,
  payload: data
});

export const getAttendanceStatisticsError = (error: string) => ({
  type: types.GET_ATTENDANCE_STATISTICS_FAILURE,
  payload: error
});

export const refreshAttendanceStatisticsRequest = (committeeCode: string) => ({
  type: types.REFRESH_ATTENDANCE_STATISTICS_REQUEST,
  payload: { committeeCode }
});

export const refreshAttendanceStatisticsSuccess = (data: AttendanceStatistics) => ({
  type: types.REFRESH_ATTENDANCE_STATISTICS_SUCCESS,
  payload: data
});

export const refreshAttendanceStatisticsError = (error: string) => ({
  type: types.REFRESH_ATTENDANCE_STATISTICS_FAILURE,
  payload: error
});

// ============================================================================
// ADD PENDING ELECTOR
// ============================================================================

export const addPendingElectorRequest = (data: {
  koc_id: string;
  full_name: string;
  committee_code: string;
  notes?: string;
}) => ({
  type: types.ADD_PENDING_ELECTOR_REQUEST,
  payload: data
});

export const addPendingElectorSuccess = (data: any) => ({
  type: types.ADD_PENDING_ELECTOR_SUCCESS,
  payload: data
});

export const addPendingElectorError = (error: string) => ({
  type: types.ADD_PENDING_ELECTOR_FAILURE,
  payload: error
});

// ============================================================================
// CLEAR ERRORS
// ============================================================================

export const clearAttendanceError = () => ({
  type: types.CLEAR_ATTENDANCE_FAILURE
});

export const clearSearchError = () => ({
  type: types.CLEAR_SEARCH_FAILURE
});
