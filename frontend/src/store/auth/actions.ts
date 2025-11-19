import {
  // New consolidated action types
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_LOGOUT_REQUEST,
  AUTH_LOGOUT_SUCCESS,
  AUTH_SOCIAL_LOGIN_REQUEST,
  AUTH_SOCIAL_LOGIN_SUCCESS,
  AUTH_SOCIAL_LOGIN_FAILURE,
  AUTH_REGISTER_REQUEST,
  AUTH_REGISTER_SUCCESS,
  AUTH_REGISTER_FAILURE,
  AUTH_FORGOT_PASSWORD_REQUEST,
  AUTH_FORGOT_PASSWORD_SUCCESS,
  AUTH_FORGOT_PASSWORD_FAILURE,
  AUTH_PROFILE_REQUEST,
  AUTH_PROFILE_SUCCESS,
  AUTH_PROFILE_FAILURE,
  AUTH_RESET_LOGIN_FLAG,
  AUTH_RESET_REGISTER_FLAG,
  AUTH_RESET_FORGOT_PASSWORD_FLAG,
  AUTH_RESET_PROFILE_FLAG
} from './actionTypes';

import { LoginRequestAction, LoginSuccessPayload, LoginSuccessAction, LoginErrorAction } from './types';

// ===== NEW CONSOLIDATED ACTIONS =====

// Login Actions
export const loginRequest = (user: { email: string; password: string }): LoginRequestAction => ({
  type: AUTH_LOGIN_REQUEST,
  payload: { user }
});

export const loginSuccess = (user: LoginSuccessPayload): LoginSuccessAction => ({
  type: AUTH_LOGIN_SUCCESS,
  payload: user
});

export const loginError = (error: { message: string; status?: number; data?: any }): LoginErrorAction => ({
  type: AUTH_LOGIN_FAILURE,
  payload: error
});

// Logout Actions
export const logoutRequest = () => ({
  type: AUTH_LOGOUT_REQUEST
});

export const logoutSuccess = () => ({
  type: AUTH_LOGOUT_SUCCESS
});

export const logoutError = (error: any) => ({
  type: AUTH_LOGOUT_REQUEST, // Using same type for error handling
  payload: error
});

// Social Login Actions
export const socialLoginRequest = (type: string) => ({
  type: AUTH_SOCIAL_LOGIN_REQUEST,
  payload: { type }
});

export const socialLoginSuccess = (user: any) => ({
  type: AUTH_SOCIAL_LOGIN_SUCCESS,
  payload: user
});

export const socialLoginError = (error: any) => ({
  type: AUTH_SOCIAL_LOGIN_FAILURE,
  payload: error
});

// Register Actions
export const registerRequest = (user: any) => ({
  type: AUTH_REGISTER_REQUEST,
  payload: { user }
});

export const registerSuccess = (user: any) => ({
  type: AUTH_REGISTER_SUCCESS,
  payload: user
});

export const registerError = (error: any) => ({
  type: AUTH_REGISTER_FAILURE,
  payload: error
});

// Forgot Password Actions
export const forgotPasswordRequest = (email: string) => ({
  type: AUTH_FORGOT_PASSWORD_REQUEST,
  payload: { email }
});

export const forgotPasswordSuccess = (message: string) => ({
  type: AUTH_FORGOT_PASSWORD_SUCCESS,
  payload: message
});

export const forgotPasswordError = (error: any) => ({
  type: AUTH_FORGOT_PASSWORD_FAILURE,
  payload: error
});

// Profile Actions
export const profileRequest = (user: any) => ({
  type: AUTH_PROFILE_REQUEST,
  payload: { user }
});

export const profileSuccess = (user: any) => ({
  type: AUTH_PROFILE_SUCCESS,
  payload: user
});

export const profileError = (error: any) => ({
  type: AUTH_PROFILE_FAILURE,
  payload: error
});

// Reset Flag Actions
export const resetLoginFlag = () => ({
  type: AUTH_RESET_LOGIN_FLAG
});

export const resetRegisterFlag = () => ({
  type: AUTH_RESET_REGISTER_FLAG
});

export const resetForgotPasswordFlag = () => ({
  type: AUTH_RESET_FORGOT_PASSWORD_FLAG
});

export const resetProfileFlag = () => ({
  type: AUTH_RESET_PROFILE_FLAG
});
