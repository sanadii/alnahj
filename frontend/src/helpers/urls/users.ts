/**
 * Users URL Constants
 * Election Management System - Users Management Endpoints
 */

// ============================================================================
// BASE ENDPOINTS
// ============================================================================

export const USERS_LIST = '/api/users/';
export const USERS_CREATE = '/api/users/';
export const USERS_SEARCH = '/api/users/search/';
export const USERS_BULK_OPERATION = '/api/users/bulk-operation/';
export const USERS_EXPORT_CSV = '/api/users/export-csv/';

// ============================================================================
// INDIVIDUAL USER ENDPOINTS
// ============================================================================

export const userDetail = (id: number) => `/api/users/${id}/`;
export const userUpdate = (id: number) => `/api/users/${id}/`;
export const userDelete = (id: number) => `/api/users/${id}/`;
export const userProfile = (id: number) => `/api/users/${id}/profile/`;
export const userActivate = (id: number) => `/api/users/${id}/activate/`;
export const userDeactivate = (id: number) => `/api/users/${id}/deactivate/`;
export const userChangePassword = (id: number) => `/api/users/${id}/change-password/`;
export const userResetPassword = (id: number) => `/api/users/${id}/reset-password/`;
export const userStats = (id: number) => `/api/users/${id}/stats/`;
export const userAssignTeams = (id: number) => `/api/users/${id}/assign-teams/`;
export const userAssignCommittees = (id: number) => `/api/users/${id}/assign-committees/`;
export const userAssignSupervisor = (id: number) => `/api/users/${id}/assign-supervisor/`;
export const userTeamMembers = (id: number) => `/api/users/${id}/team-members/`;
export const USERS_EXPORT_EXCEL = '/api/users/export-excel/';

// ============================================================================
// CURRENT USER ENDPOINTS
// ============================================================================

export const CURRENT_USER = '/api/users/me/';
export const CURRENT_USER_UPDATE = '/api/users/me/';
export const CURRENT_USER_CHANGE_PASSWORD = '/api/users/me/change-password/';

