// ========================================
// ACCOUNT - Authentication & User Management
// ✅ STANDARDIZED: Auth at /api/auth/, Users at /api/users/
// ========================================

// Authentication - ✅ UPDATED to /api/auth/
export const ACCOUNT_LOGIN = '/api/auth/login/';
export const ACCOUNT_REGISTER = '/api/auth/register/';
export const ACCOUNT_SIGN_UP = '/api/auth/register/'; // ✅ Use standard register endpoint
export const ACCOUNT_LOGOUT = '/api/auth/logout/';
export const ACCOUNT_REFRESH = '/api/auth/refresh/';
export const ACCOUNT_VERIFY_TOKEN = '/api/auth/verify/';
export const ACCOUNT_SIGN_IN_WITH_TOKEN = '/api/auth/sign-in-with-token/';
export const ACCOUNT_SOCIAL_LOGIN = '/api/auth/social/';

// Email Verification - ✅ UPDATED to /api/auth/
export const ACCOUNT_VERIFY_EMAIL = '/api/auth/verify-email/';

// Password Management - ✅ UPDATED to /api/auth/
export const ACCOUNT_PASSWORD_CHANGE = '/api/auth/password/change/';
export const ACCOUNT_PASSWORD_RESET = '/api/auth/password/reset/';
export const ACCOUNT_PASSWORD_RESET_CONFIRM = '/api/auth/password/reset/confirm/';
export const ACCOUNT_FORGOT_PASSWORD = '/api/auth/forgot-password/';
export const ACCOUNT_RESET_PASSWORD = '/api/auth/reset-password/';

// Two-Factor Authentication - ✅ UPDATED to /api/auth/
export const ACCOUNT_2FA_SETUP = '/api/auth/2fa/setup/';
export const ACCOUNT_2FA_VERIFY = '/api/auth/2fa/verify/';

// Profile Management - ✅ UPDATED to /api/users/
export const ACCOUNT_PROFILE = '/api/users/me/';
export const ACCOUNT_PROFILE_UPDATE = '/api/users/me/';
export const ACCOUNT_CURRENT_USER = '/api/users/me/';

// User Management - ✅ UPDATED to /api/users/
export const ACCOUNT_USERS = '/api/users/';
export const ACCOUNT_USERS_CREATE = '/api/users/';
export const ACCOUNT_USERS_UPDATE = (id: number) => `/api/users/${id}/`;
export const ACCOUNT_USERS_DELETE = (id: number) => `/api/users/${id}/`;
export const ACCOUNT_USER_BY_ID = (id: number) => `/api/users/${id}/`;
export const ACCOUNT_USER_BY_EMAIL = (email: string) => `/api/users/?email=${email}`;
export const ACCOUNT_USER_DETAILS = '/api/users/me/';
export const ACCOUNT_UPDATE_USER_PROFILE = '/api/users/me/';
export const ACCOUNT_CHANGE_USER_PASSWORD = '/api/users/me/change-password/';

// Group Management
export const ACCOUNT_GROUPS = '/api/account/groups/';
export const ACCOUNT_GROUPS_CREATE = '/api/account/groups/create/';
export const ACCOUNT_GROUPS_UPDATE = (id: number) => `/api/account/groups/${id}/update/`;
export const ACCOUNT_GROUPS_DELETE = (id: number) => `/api/account/groups/${id}/delete/`;

// Moderator Functions
export const ACCOUNT_GET_MODERATOR_USERS = '/api/account/getModeratorUsers/';
export const ACCOUNT_GET_CAMPAIGN_MODERATORS = '/api/account/getCampaignModerators/';

// Legacy endpoints (kept for compatibility)
export const GET_USERS = '/api/account/getUsers';
export const GET_CURRENT_USER = '/api/account/getCurrentUser';
export const ADD_USER = '/api/account/addUser';
export const DELETE_USER = '/api/account/deleteUser';
