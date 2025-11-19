/**
 * Authentication API Helper - Workspace
 * Handles all authentication-related API calls
 */

import { APIClient } from '../api_helper';
import * as URL from '../urls/account';
import { wrapResponse, wrapListResponse } from './responseNormalizer';

const api = new APIClient();

// ============================================================================
// AUTHENTICATION
// ============================================================================

/**
 * Login with email and password (JWT)
 */
export const login = (data: { email: string; password: string }) => api.create(URL.ACCOUNT_LOGIN, data);

/**
 * Register new user
 */
export const register = (data: { email: string; password: string; first_name?: string; last_name?: string }) =>
  api.create(URL.ACCOUNT_REGISTER, data);

/**
 * Logout current user
 */
export const logout = () => api.create(URL.ACCOUNT_LOGOUT, {});

/**
 * Forgot password - request reset email
 */
export const forgotPassword = (data: { email: string }) => api.create(URL.ACCOUNT_FORGOT_PASSWORD, data);

/**
 * Reset password with token
 */
export const resetPassword = (data: { token: string; password: string }) =>
  api.create(URL.ACCOUNT_PASSWORD_RESET_CONFIRM, data);

/**
 * Get current authenticated user profile
 */
export const getCurrentUser = () => api.get(URL.ACCOUNT_CURRENT_USER, null);

/**
 * Refresh access token
 */
export const refreshToken = (data: { refresh: string }) => api.create(URL.ACCOUNT_REFRESH, data);

/**
 * Verify token validity
 */
export const verifyToken = (data: { token: string }) => api.create(URL.ACCOUNT_VERIFY_TOKEN, data);

/**
 * Social login (Google, Facebook, etc.)
 */
export const socialLogin = (data: { provider: string; access_token: string }) => api.create(URL.ACCOUNT_SOCIAL_LOGIN, data);

/**
 * Update user profile
 */
export const updateProfile = (data: any) => api.update(URL.ACCOUNT_PROFILE_UPDATE, data);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get logged in user from local storage
 */
export const getLoggedInUser = (): any | null => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      return JSON.parse(user);
    } catch (e) {
      return null;
    }
  }
  return null;
};

/**
 * Check if user is authenticated
 */
export const isUserAuthenticated = (): boolean => {
  return getLoggedInUser() !== null && localStorage.getItem('accessToken') !== null;
};

/**
 * Clear authentication data
 */
export const clearAuthData = (): void => {
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('authUser');
};
