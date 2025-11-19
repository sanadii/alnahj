/**
 * Attendance API Helper
 * Election Management System - Attendance Tracking Operations
 *
 * @module helpers/api/attendance
 */

import axios from 'utils/axios';
import type { APIResponse } from 'types/api';
import * as URL from '../urls/attendance';
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
// ATTENDANCE OPERATIONS
// ============================================================================

/**
 * Get all attendance records with optional filters
 *
 * @param filters - Committee, date range, search filters
 * @returns Promise<APIResponse<Attendance[]>>
 */
export const getAttendances = async (filters?: AttendanceFilterParams): Promise<APIResponse<Attendance[]>> => {
  const response = await axios.get(URL.ATTENDANCE_LIST, { params: filters });
  return response.data;
};

/**
 * Get single attendance record by ID
 *
 * @param id - Attendance ID
 * @returns Promise<APIResponse<Attendance>>
 */
export const getAttendance = async (id: number): Promise<APIResponse<Attendance>> => {
  const response = await axios.get(URL.attendanceDetail(id));
  return response.data;
};

/**
 * Mark attendance for an elector
 *
 * @param data - Mark attendance request data
 * @returns Promise<APIResponse<Attendance>>
 */
export const markAttendance = async (data: MarkAttendanceRequest): Promise<APIResponse<Attendance>> => {
  const response = await axios.post(URL.ATTENDANCE_MARK, data);
  return response.data;
};

/**
 * Delete attendance record (admin only)
 *
 * @param id - Attendance ID
 * @returns Promise<APIResponse<null>>
 */
export const deleteAttendance = async (id: number): Promise<APIResponse<null>> => {
  const response = await axios.delete(URL.attendanceDelete(id));
  return response.data;
};

// ============================================================================
// ELECTOR SEARCH
// ============================================================================

/**
 * Search for an elector before marking attendance
 * Validates if elector exists, is assigned to committee, and hasn't attended
 *
 * @param params - KOC ID and optional committee code
 * @returns Promise<APIResponse<ElectorSearchResult>>
 */
export const searchElector = async (params: SearchElectorRequest): Promise<APIResponse<ElectorSearchResult>> => {
  const response = await axios.get(URL.ATTENDANCE_SEARCH_ELECTOR, { params });
  return response.data;
};

// ============================================================================
// COMMITTEE ATTENDANCE
// ============================================================================

/**
 * Get attendance list for a specific committee
 * Includes statistics and full attendance records
 *
 * @param committeeCode - Committee code (e.g., "EK-II")
 * @returns Promise<APIResponse<CommitteeAttendanceList>>
 */
export const getCommitteeAttendance = async (committeeCode: string): Promise<APIResponse<CommitteeAttendanceList>> => {
  const response = await axios.get(`/api/attendees/committee/${committeeCode}/`);
  return response.data;
};

// ============================================================================
// ATTENDANCE STATISTICS
// ============================================================================

/**
 * Get attendance statistics for a committee
 * Includes totals, percentages, and hourly breakdown
 *
 * @param committeeCode - Committee code (e.g., "EK-II")
 * @returns Promise<APIResponse<AttendanceStatistics>>
 */
export const getAttendanceStatistics = async (committeeCode: string): Promise<APIResponse<AttendanceStatistics>> => {
  const response = await axios.get(URL.attendanceStatistics(committeeCode));
  return response.data;
};

/**
 * Refresh attendance statistics for a committee (admin only)
 * Forces recalculation of cached statistics
 *
 * @param committeeCode - Committee code (e.g., "EK-II")
 * @returns Promise<APIResponse<AttendanceStatistics>>
 */
export const refreshAttendanceStatistics = async (committeeCode: string): Promise<APIResponse<AttendanceStatistics>> => {
  const response = await axios.post(URL.attendanceRefreshStatistics(committeeCode));
  return response.data;
};

// ============================================================================
// QUICK ADD ELECTOR
// ============================================================================

/**
 * Add a pending elector when not found during attendance
 * Simplified: only requires KOC ID, full name, and committee code
 * Gender is determined from committee
 *
 * @param data - Elector data to create
 * @returns Promise<APIResponse<any>>
 */
export const addPendingElector = async (data: {
  koc_id: string;
  full_name: string;
  committee_code: string;
  notes?: string;
}): Promise<APIResponse<any>> => {
  const response = await axios.post(URL.ATTENDANCE_ADD_PENDING, data);
  return response.data;
};

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * Bulk mark attendance for multiple electors
 *
 * @param data - Array of mark attendance requests
 * @returns Promise<APIResponse<{ success: number; failed: number; results: any[] }>>
 */
export const bulkMarkAttendance = async (
  data: MarkAttendanceRequest[]
): Promise<APIResponse<{ success: number; failed: number; results: any[] }>> => {
  const response = await axios.post(URL.ATTENDANCE_BULK_MARK, { attendances: data });
  return response.data;
};

// ============================================================================
// EXPORT
// ============================================================================

/**
 * Export attendance records to CSV
 *
 * @param filters - Optional filters (committee_code, date_from, date_to)
 * @returns Promise<Blob>
 */
export const exportAttendanceCSV = async (filters?: {
  committee_code?: string;
  date_from?: string; // YYYY-MM-DD
  date_to?: string; // YYYY-MM-DD
}): Promise<Blob> => {
  const response = await axios.get(URL.ATTENDANCE_EXPORT_CSV, {
    params: filters,
    responseType: 'blob'
  });
  return response.data;
};

/**
 * Export attendance records to PDF
 *
 * @param filters - Optional filters (committee_code, date_from, date_to)
 * @returns Promise<Blob>
 */
export const exportAttendancePDF = async (filters?: {
  committee_code?: string;
  date_from?: string; // YYYY-MM-DD
  date_to?: string; // YYYY-MM-DD
}): Promise<Blob> => {
  const response = await axios.get(URL.ATTENDANCE_EXPORT_PDF, {
    params: filters,
    responseType: 'blob'
  });
  return response.data;
};
