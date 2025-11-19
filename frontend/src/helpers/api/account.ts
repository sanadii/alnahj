// ========================================
// ACCOUNT API - Authentication & User Management
// ========================================

import { APIClient } from '../api_helper';
import * as URL from '../urls/account';
import { wrapResponse, wrapListResponse } from './responseNormalizer';

const api = new APIClient();

// ==============================|| AUTHENTICATION ||============================== //

/**
 * Login User
 */
export const login = (data: { email: string; password: string }) => api.post(URL.ACCOUNT_LOGIN, data);

/**
 * Register User
 */
export const register = (data: any) => api.post(URL.ACCOUNT_REGISTER, data);

/**
 * Sign Up User
 */
export const signUp = (data: any) => api.post(URL.ACCOUNT_SIGN_UP, data);

/**
 * Logout User
 */
export const logout = () => api.post(URL.ACCOUNT_LOGOUT, {});

/**
 * Refresh Token
 */
export const refreshToken = (data: { refresh: string }) => api.post(URL.ACCOUNT_REFRESH, data);

/**
 * Verify Token
 */
export const verifyToken = (data: { token: string }) => api.post(URL.ACCOUNT_VERIFY_TOKEN, data);

/**
 * Sign In with Token
 */
export const signInWithToken = (data: { token: string }) => api.post(URL.ACCOUNT_SIGN_IN_WITH_TOKEN, data);

// ==============================|| EMAIL VERIFICATION ||============================== //

/**
 * Verify Email
 */
export const verifyEmail = (data: { token: string }) => api.post(URL.ACCOUNT_VERIFY_EMAIL, data);

// ==============================|| PASSWORD MANAGEMENT ||============================== //

/**
 * Change Password
 */
export const changePassword = (data: { old_password: string; new_password: string; confirm_password: string }) =>
  api.post(URL.ACCOUNT_PASSWORD_CHANGE, data);

/**
 * Reset Password Request
 */
export const resetPasswordRequest = (data: { email: string }) => api.post(URL.ACCOUNT_PASSWORD_RESET, data);

/**
 * Reset Password Confirm
 */
export const resetPasswordConfirm = (data: { token: string; password: string; confirm_password: string }) =>
  api.post(URL.ACCOUNT_PASSWORD_RESET_CONFIRM, data);

/**
 * Forgot Password
 */
export const forgotPassword = (data: { email: string }) => api.post(URL.ACCOUNT_FORGOT_PASSWORD, data);

/**
 * Reset Password (Alternative)
 */
export const resetPassword = (data: { token: string; password: string }) => api.post(URL.ACCOUNT_RESET_PASSWORD, data);

// ==============================|| TWO-FACTOR AUTHENTICATION ||============================== //

/**
 * Setup 2FA
 */
export const setup2FA = () => api.post(URL.ACCOUNT_2FA_SETUP, {});

/**
 * Verify 2FA
 */
export const verify2FA = (data: { code: string }) => api.post(URL.ACCOUNT_2FA_VERIFY, data);

// ==============================|| PROFILE MANAGEMENT ||============================== //

/**
 * Get Current User Profile
 */
export const getCurrentUser = () => api.get(URL.ACCOUNT_CURRENT_USER);

/**
 * Get User Profile
 */
export const getProfile = () => api.get(URL.ACCOUNT_PROFILE);

/**
 * Update Profile
 */
export const updateProfile = (data: any) => api.put(URL.ACCOUNT_PROFILE_UPDATE, data);

/**
 * Patch Profile
 */
export const patchProfile = (data: any) => api.patch(URL.ACCOUNT_PROFILE, data);

/**
 * Get User Details
 */
export const getUserDetails = () => api.get(URL.ACCOUNT_USER_DETAILS);

/**
 * Update User Profile
 */
export const updateUserProfile = (data: any) => api.put(URL.ACCOUNT_UPDATE_USER_PROFILE, data);

/**
 * Change User Password
 */
export const changeUserPassword = (data: any) => api.put(URL.ACCOUNT_CHANGE_USER_PASSWORD, data);

// ==============================|| USER MANAGEMENT ||============================== //

/**
 * Get Users
 */
export const getUsers = (params?: { search?: string; role?: string; is_active?: boolean }) => {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.role) queryParams.append('role', params.role);
  if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());

  const queryString = queryParams.toString();
  return api.get(`${URL.ACCOUNT_USERS}${queryString ? `?${queryString}` : ''}`);
};

/**
 * Get User by ID
 */
export const getUserById = (id: number) => api.get(URL.ACCOUNT_USER_BY_ID(id));

/**
 * Get User by Email
 */
export const getUserByEmail = (email: string) => api.get(URL.ACCOUNT_USER_BY_EMAIL(email));

/**
 * Create User
 */
export const createUser = (data: any) => api.post(URL.ACCOUNT_USERS_CREATE, data);

/**
 * Add User (Legacy)
 */
export const addUser = (data: any) => api.post(URL.ADD_USER, data);

/**
 * Update User
 */
export const updateUser = (id: number, data: any) => api.put(URL.ACCOUNT_USERS_UPDATE(id), data);

/**
 * Delete User
 */
export const deleteUser = (id: number) => api.delete(URL.ACCOUNT_USERS_DELETE(id));

// ==============================|| GROUP MANAGEMENT ||============================== //

/**
 * Get Groups
 */
export const getGroups = () => api.get(URL.ACCOUNT_GROUPS);

/**
 * Create Group
 */
export const createGroup = (data: any) => api.post(URL.ACCOUNT_GROUPS_CREATE, data);

/**
 * Update Group
 */
export const updateGroup = (id: number, data: any) => api.put(URL.ACCOUNT_GROUPS_UPDATE(id), data);

/**
 * Delete Group
 */
export const deleteGroup = (id: number) => api.delete(URL.ACCOUNT_GROUPS_DELETE(id));

// ==============================|| MODERATOR FUNCTIONS ||============================== //

/**
 * Get Moderator Users
 */
export const getModeratorUsers = () => api.get(URL.ACCOUNT_GET_MODERATOR_USERS);

/**
 * Get Campaign Moderators
 */
export const getCampaignModerators = () => api.get(URL.ACCOUNT_GET_CAMPAIGN_MODERATORS);
