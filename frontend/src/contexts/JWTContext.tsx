import React, { createContext, useEffect, useReducer, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// WebSocket hook for real-time updates
import { useWebSocket } from 'hooks/useWebSocket';

// third party

import { jwtDecode } from 'jwt-decode';

// reducer - state management
import { authReducer, authInitialState, AUTH_CONTEXT_LOGIN, AUTH_CONTEXT_LOGOUT } from './authReducer';

// project imports
import Loader from 'ui-component/Loader';
import axios from 'utils/axios';

// types
import { KeyedObject } from 'types';
import { JWTContextType } from 'types/auth';
import { ACCOUNT_PROFILE } from 'helpers/urls/account';

// Import Redux auth actions
import { AUTH_LOGIN_SUCCESS, AUTH_LOGOUT_SUCCESS } from 'store/auth/actionTypes';

function verifyToken(accessToken: string): boolean {
  if (!accessToken) {
    return false;
  }

  const decoded: KeyedObject = jwtDecode(accessToken);

  // Ensure 'exp' exists and compare it to the current timestamp
  if (!decoded.exp) {
    throw new Error("Token does not contain 'exp' property.");
  }

  return decoded.exp > Date.now() / 1000;
}

function setSession(accessToken?: string | null): void {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
}

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext<JWTContextType | null>(null);

export default JWTContext;

export function JWTProvider({ children }: { children: React.ReactElement }) {
  const [state, dispatch] = useReducer(authReducer, authInitialState);

  // Redux dispatch for updating store
  const dispatchRedux = useDispatch();

  // Get auth state from Redux store
  const reduxAuthState = useSelector((state: any) => state.auth);

  // Initialize WebSocket connection for real-time updates
  useWebSocket();

  // Ref to track if we've already synced to prevent duplicate dispatches
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    const init = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        const authUser = sessionStorage.getItem('authUser');

        let accessTokenValid = false;
        if (accessToken) {
          try {
            accessTokenValid = verifyToken(accessToken);
          } catch (error) {
            accessTokenValid = false;
          }
        }

        if (accessToken && accessTokenValid) {
          setSession(accessToken);

          // Get user info from sessionStorage instead of API call
          if (authUser) {
            const userData = JSON.parse(authUser);

            if (userData.user) {
              dispatch({
                type: AUTH_CONTEXT_LOGIN,
                payload: {
                  user: userData.user
                }
              });
              return;
            }
          }

          // Fallback to API call only if no user data in storage

          const response = await axios.get(ACCOUNT_PROFILE);
          const user = response?.data?.data;
          dispatch({
            type: AUTH_CONTEXT_LOGIN,
            payload: {
              user
            }
          });
        } else {
          dispatch({
            type: AUTH_CONTEXT_LOGOUT
          });
        }
      } catch (err) {
        dispatch({
          type: AUTH_CONTEXT_LOGOUT
        });
      }
    };

    init();
  }, []);

  // Check for user data in sessionStorage when Redux state changes (after login saga completes)
  useEffect(() => {
    // Only check if JWT context is not logged in but Redux shows login success
    if (!state.isLoggedIn && reduxAuthState.isLoggedIn) {
      const authUser = sessionStorage.getItem('authUser');
      if (authUser) {
        try {
          const userData = JSON.parse(authUser);

        if (userData.user) {
          dispatch({
            type: AUTH_CONTEXT_LOGIN,
            payload: {
              user: userData.user
            }
          });
        }
        } catch (error) {}
      }
    }
  }, [reduxAuthState.isLoggedIn, state.isLoggedIn]); // Run when Redux login state changes

  // Update Redux auth state when JWT Context changes (one-way sync)
  useEffect(() => {
    // Only sync if there's actually a difference to avoid duplicate dispatches
    if (state.isLoggedIn && state.user && !reduxAuthState.isLoggedIn && !hasSyncedRef.current) {
      hasSyncedRef.current = true;
      dispatchRedux({ type: AUTH_LOGIN_SUCCESS, payload: state.user });
    } else if (!state.isLoggedIn && reduxAuthState.isLoggedIn) {
      hasSyncedRef.current = false;
      dispatchRedux({ type: AUTH_LOGOUT_SUCCESS });
    }
  }, [state.isLoggedIn, state.user, reduxAuthState.isLoggedIn]);

  const logout = () => {
    // Clear all storage
    sessionStorage.removeItem('authUser');
    localStorage.removeItem('accessToken');

    // Clear session
    setSession(null);

    // Clear axios authorization header
    delete axios.defaults.headers.common.Authorization;

    // Reset sync flag
    hasSyncedRef.current = false;

    // Update JWT context
    dispatch({ type: AUTH_CONTEXT_LOGOUT });

    // Update Redux store
    dispatchRedux({ type: AUTH_LOGOUT_SUCCESS });
  };

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return <JWTContext value={{ ...state, logout }}>{children}</JWTContext>;
}
