/**
 * Users Management API Helper
 * Election Management System - User CRUD Operations
 *
 * @module helpers/api/users
 */

import axios from 'utils/axios';
import type { APIResponse } from 'types/api';
import { wrapResponse, wrapListResponse } from './responseNormalizer';
import * as URL from '../urls/users';
import type {
  User,
  UserFormData,
  UserFilters,
  UserListResponse,
  PasswordChangeData,
  UserStats,
  UserProfileExtended,
  BulkUserOperation
} from 'types/users-management';

// ============================================================================
// USER CRUD OPERATIONS
// ============================================================================

/**
 * Get all users with optional filters and pagination
 *
 * @param filters - Search, role, status filters, and pagination
 * @returns Promise<APIResponse<UserListResponse>>
 */
export const getUsers = async (filters?: UserFilters): Promise<APIResponse<UserListResponse>> => {
  const response = await axios.get(URL.USERS_LIST, { params: filters });
  return wrapResponse(response.data);
};

/**
 * Get single user by ID
 *
 * @param id - User ID
 * @returns Promise<APIResponse<User>>
 */
export const getUser = async (id: number): Promise<APIResponse<User>> => {
  const response = await axios.get(URL.userDetail(id));
  return wrapResponse(response.data);
};

/**
 * Get extended user profile (with stats, activities, assignments)
 *
 * @param id - User ID
 * @returns Promise<APIResponse<UserProfileExtended>>
 */
export const getUserProfile = async (id: number): Promise<APIResponse<UserProfileExtended>> => {
  const response = await axios.get(URL.userProfile(id));
  return wrapResponse(response.data);
};

/**
 * Create new user
 *
 * @param data - User creation data (email, password, firstName, lastName, role, etc.)
 * @returns Promise<APIResponse<User>>
 */
export const createUser = async (data: UserFormData): Promise<APIResponse<User>> => {
  const response = await axios.post(URL.USERS_CREATE, data);
  return wrapResponse(response.data);
};

/**
 * Update existing user (PATCH for partial update)
 *
 * @param id - User ID
 * @param data - Partial user data to update
 * @returns Promise<APIResponse<User>>
 */
export const updateUser = async (id: number, data: Partial<UserFormData>): Promise<APIResponse<User>> => {
  const response = await axios.patch(URL.userUpdate(id), data);
  return wrapResponse(response.data);
};

/**
 * Delete user
 *
 * @param id - User ID
 * @returns Promise<APIResponse<null>>
 */
export const deleteUser = async (id: number): Promise<APIResponse<null>> => {
  const response = await axios.delete(URL.userDelete(id));
  return wrapResponse(response.data);
};

// ============================================================================
// PASSWORD MANAGEMENT
// ============================================================================

/**
 * Change user password
 *
 * @param id - User ID
 * @param data - Current and new password
 * @returns Promise<APIResponse<null>>
 */
export const changeUserPassword = async (id: number, data: PasswordChangeData): Promise<APIResponse<null>> => {
  const response = await axios.post(URL.userChangePassword(id), {
    old_password: data.currentPassword,
    new_password: data.newPassword
  });
  return wrapResponse(response.data);
};

/**
 * Reset user password (Admin only)
 *
 * @param id - User ID
 * @param newPassword - New password
 * @returns Promise<APIResponse<null>>
 */
export const resetUserPassword = async (id: number, newPassword: string): Promise<APIResponse<null>> => {
  const response = await axios.post(URL.userResetPassword(id), {
    new_password: newPassword
  });
  return wrapResponse(response.data);
};

// ============================================================================
// USER STATISTICS
// ============================================================================

/**
 * Get user statistics (guarantees, follow-ups, etc.)
 *
 * @param id - User ID
 * @returns Promise<APIResponse<UserStats>>
 */
export const getUserStats = async (id: number): Promise<APIResponse<UserStats>> => {
  const response = await axios.get(URL.userStats(id));
  return wrapResponse(response.data);
};

// ============================================================================
// USER STATUS MANAGEMENT
// ============================================================================

/**
 * Activate user
 *
 * @param id - User ID
 * @returns Promise<APIResponse<User>>
 */
export const activateUser = async (id: number): Promise<APIResponse<User>> => {
  const response = await axios.post(URL.userActivate(id));
  return wrapResponse(response.data);
};

/**
 * Deactivate user
 *
 * @param id - User ID
 * @returns Promise<APIResponse<User>>
 */
export const deactivateUser = async (id: number): Promise<APIResponse<User>> => {
  const response = await axios.post(URL.userDeactivate(id));
  return wrapResponse(response.data);
};

// ============================================================================
// TEAM & COMMITTEE MANAGEMENT
// ============================================================================

/**
 * Assign user to teams
 *
 * @param id - User ID
 * @param teams - Array of team names
 * @returns Promise<APIResponse<User>>
 */
export const assignUserTeams = async (id: number, teams: string[]): Promise<APIResponse<User>> => {
  const response = await axios.post(URL.userAssignTeams(id), { teams });
  return wrapResponse(response.data);
};

/**
 * Assign user to committees
 *
 * @param id - User ID
 * @param committeeIds - Array of committee IDs
 * @returns Promise<APIResponse<User>>
 */
export const assignUserCommittees = async (id: number, committeeIds: number[]): Promise<APIResponse<User>> => {
  const response = await axios.post(URL.userAssignCommittees(id), {
    committees: committeeIds
  });
  return wrapResponse(response.data);
};

/**
 * Assign supervisor to user
 *
 * @param id - User ID
 * @param supervisorId - Supervisor user ID
 * @returns Promise<APIResponse<User>>
 */
export const assignSupervisor = async (id: number, supervisorId: number | null): Promise<APIResponse<User>> => {
  const response = await axios.post(URL.userAssignSupervisor(id), {
    supervisor: supervisorId
  });
  return wrapResponse(response.data);
};

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * Bulk user operations (activate, deactivate, delete, assign)
 *
 * @param operation - Bulk operation data
 * @returns Promise<APIResponse<{ success: number; failed: number }>>
 */
export const bulkUserOperation = async (operation: BulkUserOperation): Promise<APIResponse<{ success: number; failed: number }>> => {
  const response = await axios.post(URL.USERS_BULK_OPERATION, operation);
  return wrapResponse(response.data);
};

// ============================================================================
// SEARCH & FILTER
// ============================================================================

/**
 * Search users by name or email
 *
 * @param query - Search query
 * @returns Promise<APIResponse<User[]>>
 */
export const searchUsers = async (query: string): Promise<APIResponse<User[]>> => {
  const response = await axios.get(URL.USERS_SEARCH, {
    params: { q: query }
  });
  return wrapResponse(response.data);
};

/**
 * Get users by role
 *
 * @param role - User role
 * @returns Promise<APIResponse<User[]>>
 */
export const getUsersByRole = async (role: string): Promise<APIResponse<User[]>> => {
  const response = await axios.get('/api/users/', {
    params: { role }
  });
  return wrapResponse(response.data);
};

/**
 * Get supervisors list (for dropdown selection)
 *
 * @returns Promise<APIResponse<User[]>>
 */
export const getSupervisors = async (): Promise<APIResponse<User[]>> => {
  const response = await axios.get('/api/users/', {
    params: { role: 'SUPERVISOR' }
  });
  return wrapResponse(response.data);
};

/**
 * Get team members for a supervisor
 *
 * @param supervisorId - Supervisor user ID
 * @returns Promise<APIResponse<User[]>>
 */
export const getTeamMembers = async (supervisorId: number): Promise<APIResponse<User[]>> => {
  const response = await axios.get(URL.userTeamMembers(supervisorId));
  return wrapResponse(response.data);
};

// ============================================================================
// EXPORT
// ============================================================================

/**
 * Export users to CSV
 *
 * @param filters - Optional filters to apply
 * @returns Promise<Blob>
 */
export const exportUsersCSV = async (filters?: UserFilters): Promise<Blob> => {
  const response = await axios.get(URL.USERS_EXPORT_CSV, {
    params: filters,
    responseType: 'blob'
  });
  return wrapResponse(response.data);
};

/**
 * Export users to Excel
 *
 * @param filters - Optional filters to apply
 * @returns Promise<Blob>
 */
export const exportUsersExcel = async (filters?: UserFilters): Promise<Blob> => {
  const response = await axios.get(URL.USERS_EXPORT_EXCEL, {
    params: filters,
    responseType: 'blob'
  });
  return wrapResponse(response.data);
};
