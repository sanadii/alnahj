/**
 * Committees URL Constants
 * Election Management System - Committees Management Endpoints
 */

// ============================================================================
// BASE ENDPOINTS
// ============================================================================

export const COMMITTEES_LIST = '/api/elections/committees/';
export const COMMITTEES_CREATE = '/api/elections/committees/';
export const COMMITTEES_BULK_CREATE = '/api/elections/committees/bulk-create/';
export const COMMITTEES_BULK_DELETE = '/api/elections/committees/bulk-delete/';
export const COMMITTEES_SEARCH = '/api/elections/committees/search/';
export const COMMITTEES_EXPORT_CSV = '/api/elections/committees/export-csv/';

// ============================================================================
// INDIVIDUAL COMMITTEE ENDPOINTS
// ============================================================================

export const committeeDetail = (id: number) => `/api/elections/committees/${id}/`;
export const committeeUpdate = (id: number) => `/api/elections/committees/${id}/`;
export const committeeDelete = (id: number) => `/api/elections/committees/${id}/`;
export const committeeStatistics = (id: number) => `/api/elections/committees/${id}/statistics/`;
export const committeeAssignUsers = (id: number) => `/api/elections/committees/${id}/assign-users/`;
export const committeeRemoveUser = (id: number) => `/api/elections/committees/${id}/remove-user/`;
export const committeeStaff = (id: number) => `/api/elections/committees/${id}/staff/`;
export const committeeElectors = (id: number) => `/api/elections/committees/${id}/electors/`;
export const committeeAssignElectors = (id: number) => `/api/elections/committees/${id}/assign-electors/`;
export const committeeAttendance = (id: number) => `/api/elections/committees/${id}/attendance/`;
export const committeeVoteCounts = (id: number) => `/api/elections/committees/${id}/vote-counts/`;
export const committeeExportPDF = (id: number) => `/api/elections/committees/${id}/export-pdf/`;
export const electionAutoAssignElectors = (id: number) => `/api/elections/${id}/auto-assign-electors/`;

