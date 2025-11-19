// ==============================|| USERS ACTIONS ||============================== //
// Election Management System - Users Management

import * as types from './actionTypes';
import type { User, UserFormData, UserFilters, UserStats, PasswordChangeData, BulkUserOperation } from 'types/users-management';

// ============================================================================
// LIST USERS
// ============================================================================

export const getUsersRequest = (filters?: UserFilters) => ({
  type: types.GET_USERS_REQUEST,
  payload: { filters }
});

export const getUsersSuccess = (data: { users: User[]; totalCount: number }) => ({
  type: types.GET_USERS_SUCCESS,
  payload: data
});

export const getUsersError = (error: string) => ({
  type: types.GET_USERS_FAILURE,
  payload: error
});

// ============================================================================
// GET SINGLE USER
// ============================================================================

export const getUserRequest = (id: number) => ({
  type: types.GET_USER_REQUEST,
  payload: { id }
});

export const getUserSuccess = (user: User) => ({
  type: types.GET_USER_SUCCESS,
  payload: user
});

export const getUserError = (error: string) => ({
  type: types.GET_USER_FAILURE,
  payload: error
});

// ============================================================================
// CREATE USER
// ============================================================================

export const createUserRequest = (data: UserFormData) => ({
  type: types.CREATE_USER_REQUEST,
  payload: data
});

export const createUserSuccess = (user: User) => ({
  type: types.CREATE_USER_SUCCESS,
  payload: user
});

export const createUserError = (error: string) => ({
  type: types.CREATE_USER_FAILURE,
  payload: error
});

// ============================================================================
// UPDATE USER
// ============================================================================

export const updateUserRequest = (id: number, data: Partial<UserFormData>) => ({
  type: types.UPDATE_USER_REQUEST,
  payload: { id, data }
});

export const updateUserSuccess = (user: User) => ({
  type: types.UPDATE_USER_SUCCESS,
  payload: user
});

export const updateUserError = (error: string) => ({
  type: types.UPDATE_USER_FAILURE,
  payload: error
});

// ============================================================================
// DELETE USER
// ============================================================================

export const deleteUserRequest = (id: number) => ({
  type: types.DELETE_USER_REQUEST,
  payload: { id }
});

export const deleteUserSuccess = (id: number) => ({
  type: types.DELETE_USER_SUCCESS,
  payload: id
});

export const deleteUserError = (error: string) => ({
  type: types.DELETE_USER_FAILURE,
  payload: error
});

// ============================================================================
// CHANGE PASSWORD
// ============================================================================

export const changePasswordRequest = (id: number, data: PasswordChangeData) => ({
  type: types.CHANGE_PASSWORD_REQUEST,
  payload: { id, data }
});

export const changePasswordSuccess = () => ({
  type: types.CHANGE_PASSWORD_SUCCESS
});

export const changePasswordError = (error: string) => ({
  type: types.CHANGE_PASSWORD_FAILURE,
  payload: error
});

// ============================================================================
// GET USER STATS
// ============================================================================

export const getUserStatsRequest = (id: number) => ({
  type: types.GET_USER_STATS_REQUEST,
  payload: { id }
});

export const getUserStatsSuccess = (stats: UserStats) => ({
  type: types.GET_USER_STATS_SUCCESS,
  payload: stats
});

export const getUserStatsError = (error: string) => ({
  type: types.GET_USER_STATS_FAILURE,
  payload: error
});

// ============================================================================
// ACTIVATE/DEACTIVATE USER
// ============================================================================

export const activateUserRequest = (id: number) => ({
  type: types.ACTIVATE_USER_REQUEST,
  payload: { id }
});

export const activateUserSuccess = (user: User) => ({
  type: types.ACTIVATE_USER_SUCCESS,
  payload: user
});

export const deactivateUserRequest = (id: number) => ({
  type: types.DEACTIVATE_USER_REQUEST,
  payload: { id }
});

export const deactivateUserSuccess = (user: User) => ({
  type: types.DEACTIVATE_USER_SUCCESS,
  payload: user
});

// ============================================================================
// BULK OPERATIONS
// ============================================================================

export const bulkUserOperationRequest = (operation: BulkUserOperation) => ({
  type: types.BULK_USER_OPERATION_REQUEST,
  payload: operation
});

export const bulkUserOperationSuccess = (result: { success: number; failed: number }) => ({
  type: types.BULK_USER_OPERATION_SUCCESS,
  payload: result
});

export const bulkUserOperationError = (error: string) => ({
  type: types.BULK_USER_OPERATION_FAILURE,
  payload: error
});

// ============================================================================
// FILTERS
// ============================================================================

export const setUserFilters = (filters: UserFilters) => ({
  type: types.SET_USER_FILTERS,
  payload: filters
});

export const clearUserFilters = () => ({
  type: types.CLEAR_USER_FILTERS
});

// ============================================================================
// UTILITIES
// ============================================================================

export const clearUserError = () => ({
  type: types.CLEAR_USER_ERROR
});

export const setCurrentUser = (user: User) => ({
  type: types.SET_CURRENT_USER,
  payload: user
});

export const clearCurrentUser = () => ({
  type: types.CLEAR_CURRENT_USER
});
