/**
 * Attendance URL Constants
 * Election Management System - Attendance Tracking Endpoints
 */

// ============================================================================
// BASE ENDPOINTS
// ============================================================================

export const ATTENDANCE_LIST = '/api/attendees/';
export const ATTENDANCE_MARK = '/api/attendees/mark/';
export const ATTENDANCE_SEARCH_ELECTOR = '/api/attendees/search-elector/';
export const ATTENDANCE_STATISTICS = '/api/attendees/statistics/';
export const attendanceStatistics = (committeeCode: string) => `/api/attendees/statistics/${committeeCode}/`;
export const attendanceRefreshStatistics = (committeeCode: string) => `/api/attendees/statistics/${committeeCode}/refresh/`;
export const ATTENDANCE_ADD_PENDING = '/api/attendees/add-pending-elector/';
export const ATTENDANCE_BULK_MARK = '/api/attendees/bulk-mark/';
export const ATTENDANCE_EXPORT_CSV = '/api/attendees/export/csv/';
export const ATTENDANCE_EXPORT_PDF = '/api/attendees/export/pdf/';

// ============================================================================
// INDIVIDUAL ATTENDANCE ENDPOINTS
// ============================================================================

export const attendanceDetail = (id: number) => `/api/attendees/${id}/`;
export const attendanceDelete = (id: number) => `/api/attendees/${id}/`;

// ============================================================================
// COMMITTEE ATTENDANCE ENDPOINTS
// ============================================================================

export const committeeAttendance = (committeeCode: string) => `/api/attendees/committee/${committeeCode}/`;

