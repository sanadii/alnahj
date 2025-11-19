import { InitialLoginContextProps } from 'types/auth';

export const AUTH_CONTEXT_LOGIN = 'AUTH_CONTEXT_LOGIN';
export const AUTH_CONTEXT_LOGOUT = 'AUTH_CONTEXT_LOGOUT';
export const AUTH_CONTEXT_INITIALIZE = 'AUTH_CONTEXT_INITIALIZE';

export type AuthContextAction =
  | { type: typeof AUTH_CONTEXT_LOGIN; payload: { user: InitialLoginContextProps['user'] } }
  | { type: typeof AUTH_CONTEXT_LOGOUT }
  | { type: typeof AUTH_CONTEXT_INITIALIZE; payload?: Partial<InitialLoginContextProps> };

export const authInitialState: InitialLoginContextProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

export function authReducer(state: InitialLoginContextProps, action: AuthContextAction): InitialLoginContextProps {
  switch (action.type) {
    case AUTH_CONTEXT_INITIALIZE: {
      const isLoggedIn = action.payload?.isLoggedIn ?? Boolean(action.payload?.user);
      return {
        ...state,
        isInitialized: true,
        isLoggedIn,
        user: action.payload?.user ?? null
      };
    }
    case AUTH_CONTEXT_LOGIN:
      return {
        ...state,
        isInitialized: true,
        isLoggedIn: true,
        user: action.payload.user
      };
    case AUTH_CONTEXT_LOGOUT:
      return {
        ...state,
        isInitialized: true,
        isLoggedIn: false,
        user: null
      };
    default:
      return state;
    }
}

