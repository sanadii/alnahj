import {
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

// Consolidated initial state
const initialState = {
  // User data
  user: {},
  isLoggedIn: false,

  // Loading states
  loading: false,
  loginLoading: false,
  registerLoading: false,
  forgotPasswordLoading: false,
  profileLoading: false,

  // Error states
  error: false,
  errorMsg: '',
  loginError: null,
  registerError: null,
  forgotPasswordError: null,
  profileError: null,

  // Login specific
  isUserLogout: false,

  // Register specific
  registerSuccess: false,
  registerMessage: null,

  // Forgot password specific
  forgotPasswordSuccess: false,
  forgotPasswordMessage: null,

  // Profile specific
  profileSuccess: false,
  profileMessage: null
};

const authReducer = (state = initialState, action: any) => {
  switch (action.type) {
    // ===== NEW CONSOLIDATED ACTIONS =====

    // Login Actions
    case AUTH_LOGIN_REQUEST:
      return {
        ...state,
        loginLoading: true,
        error: false,
        errorMsg: '',
        loginError: null
      };

    case AUTH_LOGIN_SUCCESS:
      // ✅ Payload contains user object from backend: { id, email, first_name, ... }
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true,
        loginLoading: false,
        error: false,
        errorMsg: '',
        loginError: null,
        isUserLogout: false
      };

    case AUTH_LOGIN_FAILURE:
      return {
        ...state,
        loginLoading: false,
        error: true,
        errorMsg: action.payload?.data || action.payload?.message || 'An error occurred',
        loginError: action.payload
      };

    // Logout Actions
    case AUTH_LOGOUT_REQUEST:
      return {
        ...state,
        isUserLogout: false,
        loading: true
      };

    case AUTH_LOGOUT_SUCCESS:
      return {
        ...state,
        isUserLogout: true,
        loading: false,
        user: {},
        isLoggedIn: false
      };

    // Social Login Actions
    case AUTH_SOCIAL_LOGIN_REQUEST:
      return {
        ...state,
        loginLoading: true,
        error: false,
        errorMsg: '',
        loginError: null
      };

    case AUTH_SOCIAL_LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true,
        loginLoading: false,
        error: false,
        errorMsg: '',
        loginError: null
      };

    case AUTH_SOCIAL_LOGIN_FAILURE:
      return {
        ...state,
        loginLoading: false,
        error: true,
        errorMsg: action.payload?.message || 'Social login failed',
        loginError: action.payload
      };

    // Register Actions
    case AUTH_REGISTER_REQUEST:
      return {
        ...state,
        registerLoading: true,
        registerError: null,
        registerSuccess: false
      };

    case AUTH_REGISTER_SUCCESS:
      return {
        ...state,
        registerLoading: false,
        user: action.payload,
        registerSuccess: true,
        registerError: null,
        registerMessage: 'Registration successful'
      };

    case AUTH_REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        registerLoading: false,
        registerError: action.payload,
        registerSuccess: false,
        error: true
      };

    // Forgot Password Actions
    case AUTH_FORGOT_PASSWORD_REQUEST:
      return {
        ...state,
        forgotPasswordLoading: true,
        forgotPasswordError: null,
        forgotPasswordSuccess: false
      };

    case AUTH_FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        forgotPasswordLoading: false,
        forgotPasswordSuccess: true,
        forgotPasswordMessage: action.payload,
        forgotPasswordError: null
      };

    case AUTH_FORGOT_PASSWORD_FAILURE:
      return {
        ...state,
        forgotPasswordLoading: false,
        forgotPasswordError: action.payload,
        forgotPasswordSuccess: false
      };

    // Profile Actions
    case AUTH_PROFILE_REQUEST:
      return {
        ...state,
        profileLoading: true,
        profileError: null,
        profileSuccess: false
      };

    case AUTH_PROFILE_SUCCESS: {
      const updatedUser = {
        ...(state.user || {}),
        ...action.payload,
        email: action.payload.email,
        role: action.payload.role_display ?? action.payload.role ?? state.user?.role
      };
      return {
        ...state,
        profileLoading: false,
        user: updatedUser,
        profileSuccess: true,
        profileMessage: 'Profile updated successfully',
        profileError: null
      };
    }

    case AUTH_PROFILE_FAILURE:
      return {
        ...state,
        profileLoading: false,
        profileError: action.payload,
        profileSuccess: false
      };

    // Reset Flag Actions
    case AUTH_RESET_LOGIN_FLAG:
      return {
        ...state,
        errorMsg: '',
        loginLoading: false,
        error: false,
        loginError: null
      };

    case AUTH_RESET_REGISTER_FLAG:
      return {
        ...state,
        registerSuccess: false,
        registerError: null,
        error: false
      };

    case AUTH_RESET_FORGOT_PASSWORD_FLAG:
      return {
        ...state,
        forgotPasswordSuccess: false,
        forgotPasswordError: null
      };

    case AUTH_RESET_PROFILE_FLAG:
      return {
        ...state,
        profileSuccess: false,
        profileError: null
      };

    default:
      return { ...state };
  }
};

export default authReducer;
