import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { http } from 'utils/axios';

// Import consolidated action types
import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGOUT_REQUEST,
  AUTH_SOCIAL_LOGIN_REQUEST,
  AUTH_REGISTER_REQUEST,
  AUTH_FORGOT_PASSWORD_REQUEST,
  AUTH_PROFILE_REQUEST
} from './actionTypes';

// Import consolidated actions
import {
  loginRequest,
  loginSuccess,
  loginError,
  logoutSuccess,
  logoutError,
  socialLoginRequest,
  socialLoginSuccess,
  socialLoginError,
  registerRequest,
  registerSuccess,
  registerError,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordError,
  profileRequest,
  profileSuccess,
  profileError
} from './actions';

// Import new API helpers
import { login, logout, socialLogin, register, forgotPassword, updateProfile, clearAuthData } from 'helpers/api/auth';

// Firebase support
import { getFirebaseBackend } from 'helpers/firebase_helper';
import { APP_AUTH } from 'config';
import { APIResponse } from 'types/api';
import { openSnackbar } from 'store/snackbar/actions';
import { getErrorMessage } from 'utils/apiError';

type SnackbarColor = 'success' | 'error';

function* showSnackbar(message: string, color: SnackbarColor) {
  yield put(
    openSnackbar({
      open: true,
      message,
      variant: 'alert',
      alert: { color },
      close: true
    })
  );
}

type LoginRequestAction = ReturnType<typeof loginRequest>;
type SocialLoginRequestAction = ReturnType<typeof socialLoginRequest>;
type RegisterRequestAction = ReturnType<typeof registerRequest>;
type ForgotPasswordRequestAction = ReturnType<typeof forgotPasswordRequest>;
type ProfileRequestAction = ReturnType<typeof profileRequest>;

// ============================================================================
// LOGIN SAGA
// ============================================================================

/**
 * Login User - Supports Firebase & JWT
 */
function* loginUserSaga({ payload: { user } }: LoginRequestAction): Generator<any, void, any> {
  try {
    if (APP_AUTH === 'firebase') {
      // Firebase Login
      const fireBaseBackend = getFirebaseBackend();
      if (fireBaseBackend) {
        const response = yield call(fireBaseBackend.loginUser, user.email, user.password);
        if (response) {
          sessionStorage.setItem('authUser', JSON.stringify(response));
          yield put(loginSuccess(response));
          yield* showSnackbar('Login successful', 'success');
        } else {
          yield put(loginError({ message: 'Login failed' }));
          yield* showSnackbar('Login failed', 'error');
        }
      }
    } else if (APP_AUTH === 'jwt') {
      // JWT Login with new API helper
      const response: any = yield call(login, {
        email: user.email,
        password: user.password
      });

      // ✅ Backend wraps response: { status, data: { access, refresh, user }, message, meta }
      // ✅ Axios wraps it in response.data
      const backendResponse = response.data;

      if (backendResponse && backendResponse.status === 'success') {
        // Extract the actual data (access, refresh, user)
        const authData = backendResponse.data;

        // Store auth data in sessionStorage for JWTContext
        sessionStorage.setItem(
          'authUser',
          JSON.stringify({
            access_token: authData.access,
            accessToken: authData.access,
            refreshToken: authData.refresh,
            user: authData.user
          })
        );

        // Store access token in localStorage for axios
        if (authData.access) {
          localStorage.setItem('accessToken', authData.access);
          localStorage.setItem('refreshToken', authData.refresh);
          // Set axios default authorization header
          http.axios.defaults.headers.common.Authorization = `Bearer ${authData.access}`;
        }

        // Send user data to reducer
        yield put(loginSuccess(authData.user));

        // Show success message
        yield* showSnackbar(backendResponse.message || 'Login successful', 'success');
      } else {
        yield put(loginError(backendResponse || { message: 'Login failed' }));
        yield* showSnackbar('Login failed', 'error');
      }
    }
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Login failed');
    const errorData = {
      message: errorMessage,
      status: error?.response?.status,
      data: error?.response?.data
    };
    yield put(loginError(errorData));
    yield* showSnackbar(errorMessage, 'error');
  }
}

// ============================================================================
// LOGOUT SAGA
// ============================================================================

/**
 * Logout User
 */
function* logoutUserSaga(): Generator<any, void, APIResponse<null>> {
  try {
    // Call Django logout API
    if (APP_AUTH === 'jwt') {
      try {
        const response = yield call(logout);
        if (response.message) {
          toast.success(response.message);
        }
      } catch (djangoError) {
        // Continue with logout even if API call fails
      }
    }

    // Clean up all storage using new helper
    clearAuthData();

    // Remove axios authorization header
    delete http.axios.defaults.headers.common.Authorization;

    // Firebase logout
    if (APP_AUTH === 'firebase') {
      const fireBaseBackend = getFirebaseBackend();
      if (fireBaseBackend) {
        yield call(fireBaseBackend.logout);
      }
    }

    yield put(logoutSuccess());
    yield* showSnackbar('Logged out successfully', 'success');
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Logout failed');
    const errorData = {
      message: errorMessage,
      status: error?.response?.status,
      data: error?.response?.data
    };
    yield put(logoutError(errorData));
    yield* showSnackbar(errorMessage, 'error');
  }
}

// ============================================================================
// SOCIAL LOGIN SAGA
// ============================================================================

/**
 * Social Login (Google, Facebook, etc.)
 */
function* socialLoginSaga({ payload: { type } }: SocialLoginRequestAction): Generator<any, void, any> {
  try {
    if (APP_AUTH === 'firebase') {
      // Firebase Social Login
      const fireBaseBackend = getFirebaseBackend();
      if (fireBaseBackend) {
        const response = yield call(fireBaseBackend.socialLoginUser, type);
        if (response) {
          sessionStorage.setItem('authUser', JSON.stringify(response));
          yield put(socialLoginSuccess(response));
          yield* showSnackbar('Login successful', 'success');
        } else {
          yield put(socialLoginError({ message: 'Social login failed' }));
          yield* showSnackbar('Social login failed', 'error');
        }
      }
    } else {
      // Django Social Login with new API helper
      const response: any = yield call(socialLogin, {
        provider: type,
        access_token: '' // This should be passed from the payload
      });

      // ✅ Backend wraps response: { status, data: { access, refresh, user }, message, meta }
      const backendResponse = response.data;

      if (backendResponse && backendResponse.status === 'success') {
        const authData = backendResponse.data;

        // Store auth data in sessionStorage
        sessionStorage.setItem(
          'authUser',
          JSON.stringify({
            access_token: authData.access,
            accessToken: authData.access,
            refreshToken: authData.refresh,
            user: authData.user
          })
        );

        // Send user data to reducer
        yield put(socialLoginSuccess(authData.user));
        yield* showSnackbar(backendResponse.message || 'Login successful', 'success');
      } else {
        yield put(socialLoginError({ message: 'Social login failed' }));
        yield* showSnackbar('Social login failed', 'error');
      }
    }
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Social login failed');
    const errorData = {
      message: errorMessage,
      status: error?.response?.status,
      data: error?.response?.data
    };
    yield put(socialLoginError(errorData));
    yield* showSnackbar(errorMessage, 'error');
  }
}

// ============================================================================
// REGISTER SAGA
// ============================================================================

/**
 * Register New User
 */
function* registerUserSaga({ payload: { user } }: RegisterRequestAction): Generator<any, void, any> {
  try {
    const response = yield call(register, user);

    // ✅ Backend wraps response: { status, data: { user }, message, meta }
    const backendResponse = response.data;

    if (backendResponse && backendResponse.status === 'success') {
      const userData = backendResponse.data;

      // Send user data to reducer
      yield put(registerSuccess(userData));
      yield* showSnackbar(backendResponse.message || 'Registration successful', 'success');
    } else {
      yield put(registerError({ message: 'Registration failed' }));
      yield* showSnackbar('Registration failed', 'error');
    }
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Registration failed');
    const errorData = {
      message: errorMessage,
      status: error?.response?.status,
      data: error?.response?.data
    };
    yield put(registerError(errorData));
    yield* showSnackbar(errorMessage, 'error');

    // Handle field-specific errors
    const errors = error?.response?.data?.errors;
    if (errors) {
      for (const [field, messages] of Object.entries(errors)) {
        for (const msg of messages as string[]) {
          yield* showSnackbar(`${field}: ${msg}`, 'error');
        }
      }
    }
  }
}

// ============================================================================
// FORGOT PASSWORD SAGA
// ============================================================================

/**
 * Forgot Password Request
 */
function* forgotPasswordSaga({ payload: { email } }: ForgotPasswordRequestAction): Generator<any, void, any> {
  try {
    if (APP_AUTH === 'firebase') {
      // Firebase Forgot Password
      const fireBaseBackend = getFirebaseBackend();
      if (fireBaseBackend) {
        const response = yield call(fireBaseBackend.forgetPassword, email);
        if (response) {
          const message = 'Reset link sent to your email';
          yield put(forgotPasswordSuccess(message));
          yield* showSnackbar(message, 'success');
        }
      }
    } else if (APP_AUTH === 'jwt') {
      // JWT Forgot Password with new API helper
      const response: any = yield call(forgotPassword, { email });

      // ✅ Backend wraps response: { status, data, message, meta }
      const backendResponse = response.data;
      const message = backendResponse.message || 'Reset link sent to your email';

      yield put(forgotPasswordSuccess(message));
      yield* showSnackbar(message, 'success');
    }
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Forgot password request failed');
    const errorData = {
      message: errorMessage,
      status: error?.response?.status,
      data: error?.response?.data
    };
    yield put(forgotPasswordError(errorData));
    yield* showSnackbar(errorMessage, 'error');
  }
}

// ============================================================================
// PROFILE SAGA
// ============================================================================

/**
 * Update User Profile
 */
function* profileUpdateSaga({ payload: { user } }: ProfileRequestAction): Generator<any, void, any> {
  try {
    const response = yield call(updateProfile, user);

    // ✅ Backend wraps response: { status, data: { user }, message, meta }
    const backendResponse = response.data;

    if (backendResponse && backendResponse.status === 'success') {
      const userData = backendResponse.data;

      // Send user data to reducer
      yield put(profileSuccess(userData));
      yield* showSnackbar(backendResponse.message || 'Profile updated successfully', 'success');
    } else {
      yield put(profileError({ message: 'Profile update failed' }));
      yield* showSnackbar('Profile update failed', 'error');
    }
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Profile update failed');
    const errorData = {
      message: errorMessage,
      status: error?.response?.status,
      data: error?.response?.data
    };
    yield put(profileError(errorData));
    yield* showSnackbar(errorMessage, 'error');
  }
}

// ============================================================================
// ROOT AUTH SAGA
// ============================================================================

/**
 * Root Auth Saga - Register all watchers
 */
export function* watchAuthLogin() {
  yield takeEvery(AUTH_LOGIN_REQUEST, loginUserSaga);
}

export function* watchAuthLogout() {
  yield takeEvery(AUTH_LOGOUT_REQUEST, logoutUserSaga);
}

export function* watchAuthSocialLogin() {
  yield takeLatest(AUTH_SOCIAL_LOGIN_REQUEST, socialLoginSaga);
}

export function* watchAuthRegistration() {
  yield takeEvery(AUTH_REGISTER_REQUEST, registerUserSaga);
}

export function* watchAuthForgotPassword() {
  yield takeEvery(AUTH_FORGOT_PASSWORD_REQUEST, forgotPasswordSaga);
}

export function* watchAuthProfile() {
  yield takeEvery(AUTH_PROFILE_REQUEST, profileUpdateSaga);
}

export default function* authSaga(): Generator<any, void, any> {
  yield all([
    watchAuthLogin(),
    watchAuthLogout(),
    watchAuthSocialLogin(),
    watchAuthRegistration(),
    watchAuthForgotPassword(),
    watchAuthProfile()
  ]);
}
