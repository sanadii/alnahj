/**
 * Auth Redux Selectors
 * Election Management System
 */

import { createSelector } from 'reselect';
import type { RootState } from 'store';
import type { AuthState } from './types';

// ============================================================================
// BASE SELECTOR
// ============================================================================

const selectAuthState = (state: RootState): AuthState => state.auth;

// ============================================================================
// MAIN SELECTOR
// ============================================================================

export const authSelector = createSelector(selectAuthState, (authState) => ({
  user: authState.user,
  isLoggedIn: authState.isLoggedIn,

  // Loading states
  loading: authState.loading,
  loginLoading: authState.loginLoading,
  registerLoading: authState.registerLoading,
  forgotPasswordLoading: authState.forgotPasswordLoading,
  profileLoading: authState.profileLoading,

  // Error states
  error: authState.error,
  errorMsg: authState.errorMsg,
  loginError: authState.loginError,
  registerError: authState.registerError,
  forgotPasswordError: authState.forgotPasswordError,
  profileError: authState.profileError,

  // Status flags
  isUserLogout: authState.isUserLogout,
  registerSuccess: authState.registerSuccess,
  registerMessage: authState.registerMessage,
  forgotPasswordSuccess: authState.forgotPasswordSuccess,
  forgotPasswordMessage: authState.forgotPasswordMessage,
  profileSuccess: authState.profileSuccess,
  profileMessage: authState.profileMessage
}));

// ============================================================================
// INDIVIDUAL SELECTORS
// ============================================================================

export const selectAuthUser = createSelector([selectAuthState], (state) => state.user);
export const selectIsLoggedIn = createSelector([selectAuthState], (state) => state.isLoggedIn);

export const selectAuthLoading = createSelector([selectAuthState], (state) => state.loading);
export const selectAuthLoginLoading = createSelector([selectAuthState], (state) => state.loginLoading);
export const selectAuthRegisterLoading = createSelector([selectAuthState], (state) => state.registerLoading);
export const selectAuthForgotPasswordLoading = createSelector([selectAuthState], (state) => state.forgotPasswordLoading);
export const selectAuthProfileLoading = createSelector([selectAuthState], (state) => state.profileLoading);

export const selectAuthError = createSelector([selectAuthState], (state) => state.error);
export const selectAuthErrorMessage = createSelector([selectAuthState], (state) => state.errorMsg);
export const selectAuthLoginError = createSelector([selectAuthState], (state) => state.loginError);
export const selectAuthRegisterError = createSelector([selectAuthState], (state) => state.registerError);
export const selectAuthForgotPasswordError = createSelector([selectAuthState], (state) => state.forgotPasswordError);
export const selectAuthProfileError = createSelector([selectAuthState], (state) => state.profileError);

export const selectIsUserLogout = createSelector([selectAuthState], (state) => state.isUserLogout);
export const selectRegisterSuccess = createSelector([selectAuthState], (state) => state.registerSuccess);
export const selectRegisterMessage = createSelector([selectAuthState], (state) => state.registerMessage);
export const selectForgotPasswordSuccess = createSelector([selectAuthState], (state) => state.forgotPasswordSuccess);
export const selectForgotPasswordMessage = createSelector([selectAuthState], (state) => state.forgotPasswordMessage);
export const selectProfileSuccess = createSelector([selectAuthState], (state) => state.profileSuccess);
export const selectProfileMessage = createSelector([selectAuthState], (state) => state.profileMessage);

