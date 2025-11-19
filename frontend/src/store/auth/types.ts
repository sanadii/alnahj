// ===== AUTH STATE INTERFACES =====

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role?: string;
  settings?: any;
  shortcuts?: string[];
  [key: string]: any;
}

export interface AuthState {
  // User data
  user: AuthUser | {};
  isLoggedIn: boolean;

  // Loading states
  loading: boolean;
  loginLoading: boolean;
  registerLoading: boolean;
  forgotPasswordLoading: boolean;
  profileLoading: boolean;

  // Error states
  error: boolean;
  errorMsg: string;
  loginError: any;
  registerError: any;
  forgotPasswordError: any;
  profileError: any;

  // Login specific
  isUserLogout: boolean;

  // Register specific
  registerSuccess: boolean;
  registerMessage: string | null;

  // Forgot password specific
  forgotPasswordSuccess: boolean;
  forgotPasswordMessage: string | null;

  // Profile specific
  profileSuccess: boolean;
  profileMessage: string | null;
}

// ===== ACTION PAYLOAD INTERFACES =====

export interface LoginRequestPayload {
  user: {
    email: string;
    password: string;
  };
}

export interface LoginSuccessPayload {
  status: string;
  message: string;
  user: AuthUser;
  accessToken: string;
  tokens?: any;
}

export interface RegisterRequestPayload {
  user: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    [key: string]: any;
  };
}

export interface ForgotPasswordRequestPayload {
  email: string;
}

export interface ProfileRequestPayload {
  user: {
    id?: string;
    email?: string;
    displayName?: string;
    photoURL?: string;
    [key: string]: any;
  };
}

// ===== ACTION INTERFACES =====

export interface AuthAction {
  type: string;
  payload?: any;
}

export interface LoginRequestAction extends AuthAction {
  type: 'AUTH_LOGIN_REQUEST';
  payload: LoginRequestPayload;
}

export interface LoginSuccessAction extends AuthAction {
  type: 'AUTH_LOGIN_SUCCESS';
  payload: LoginSuccessPayload;
}

export interface LoginErrorAction extends AuthAction {
  type: 'AUTH_LOGIN_FAILURE';
  payload: {
    message: string;
    status?: number;
    data?: any;
  };
}

export interface LogoutRequestAction extends AuthAction {
  type: 'AUTH_LOGOUT_REQUEST';
}

export interface LogoutSuccessAction extends AuthAction {
  type: 'AUTH_LOGOUT_SUCCESS';
}

export interface LogoutErrorAction extends AuthAction {
  type: 'AUTH_LOGOUT_REQUEST';
  payload: {
    message: string;
    status?: number;
    data?: any;
  };
}

export interface RegisterRequestAction extends AuthAction {
  type: 'AUTH_REGISTER_REQUEST';
  payload: RegisterRequestPayload;
}

export interface RegisterSuccessAction extends AuthAction {
  type: 'AUTH_REGISTER_SUCCESS';
  payload: AuthUser;
}

export interface RegisterErrorAction extends AuthAction {
  type: 'AUTH_REGISTER_FAILURE';
  payload: {
    message: string;
    status?: number;
    data?: any;
  };
}

export interface ForgotPasswordRequestAction extends AuthAction {
  type: 'AUTH_FORGOT_PASSWORD_REQUEST';
  payload: ForgotPasswordRequestPayload;
}

export interface ForgotPasswordSuccessAction extends AuthAction {
  type: 'AUTH_FORGOT_PASSWORD_SUCCESS';
  payload: string;
}

export interface ForgotPasswordErrorAction extends AuthAction {
  type: 'AUTH_FORGOT_PASSWORD_FAILURE';
  payload: {
    message: string;
    status?: number;
    data?: any;
  };
}

export interface ProfileRequestAction extends AuthAction {
  type: 'AUTH_PROFILE_REQUEST';
  payload: ProfileRequestPayload;
}

export interface ProfileSuccessAction extends AuthAction {
  type: 'AUTH_PROFILE_SUCCESS';
  payload: AuthUser;
}

export interface ProfileErrorAction extends AuthAction {
  type: 'AUTH_PROFILE_FAILURE';
  payload: {
    message: string;
    status?: number;
    data?: any;
  };
}

// ===== SAGA INTERFACES =====

export interface LoginSagaPayload {
  payload: LoginRequestPayload;
}

export interface RegisterSagaPayload {
  payload: RegisterRequestPayload;
}

export interface ForgotPasswordSagaPayload {
  payload: ForgotPasswordRequestPayload;
}

export interface ProfileSagaPayload {
  payload: ProfileRequestPayload;
}

// ===== COMPONENT PROPS INTERFACES =====

export interface AuthFormProps {
  onSubmit: (values: any) => void;
  loading?: boolean;
  error?: string | null;
  success?: string | null;
}

export interface LoginFormProps extends AuthFormProps {
  onSubmit: (values: { email: string; password: string }) => void;
}

export interface RegisterFormProps extends AuthFormProps {
  onSubmit: (values: { email: string; password: string; firstName?: string; lastName?: string }) => void;
}

export interface ForgotPasswordFormProps extends AuthFormProps {
  onSubmit: (values: { email: string }) => void;
}

export interface ProfileFormProps extends AuthFormProps {
  user?: AuthUser;
  onSubmit: (values: Partial<AuthUser>) => void;
}

// ===== API RESPONSE INTERFACES =====

export interface ApiResponse<T = any> {
  status: string;
  message: string;
  data?: T;
  errors?: any;
}

export interface LoginApiResponse extends ApiResponse {
  user: AuthUser;
  accessToken: string;
  tokens?: any;
}

export interface RegisterApiResponse extends ApiResponse {
  user: AuthUser;
}

export interface ForgotPasswordApiResponse extends ApiResponse {
  message: string;
}

export interface ProfileApiResponse extends ApiResponse {
  user: AuthUser;
}

// ===== ROOT STATE INTERFACE =====

export interface RootState {
  auth: AuthState;
  [key: string]: any;
}
