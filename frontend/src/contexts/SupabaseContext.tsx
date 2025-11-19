import { useMemo, useEffect, useReducer, useCallback, ReactElement, createContext } from 'react';

// third party
import { createClient } from '@supabase/supabase-js';

// project imports
import { authReducer, authInitialState, AUTH_CONTEXT_LOGIN, AUTH_CONTEXT_LOGOUT } from './authReducer';

// types
import { SupabaseContextType } from 'types/auth';

// supabase initialize
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function setSession(accessToken?: string | null): void {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  } else {
    localStorage.removeItem('accessToken');
  }
}

// ==============================|| SUPABASE CONTEXT & PROVIDER ||============================== //

const SupabaseContext = createContext<SupabaseContextType | null>(null);

export function SupabseProvider({ children }: { children: ReactElement }) {
  const [state, dispatch] = useReducer(authReducer, authInitialState);

  const initialize = useCallback(async () => {
    try {
      const {
        data: { session },
        error
      } = await supabase.auth.getSession();

      if (error) {
        dispatch({ type: AUTH_CONTEXT_LOGOUT });

        throw error;
      }

      if (session?.user) {
        dispatch({ type: AUTH_CONTEXT_LOGIN, payload: { user: session?.user } });
      } else {
        dispatch({ type: AUTH_CONTEXT_LOGOUT });
      }
    } catch (error) {
      dispatch({ type: AUTH_CONTEXT_LOGOUT });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      dispatch({ type: AUTH_CONTEXT_LOGOUT });

      throw error;
    } else {
      setSession(data.session.accessToken);
      dispatch({
        type: AUTH_CONTEXT_LOGIN,
        payload: {
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata.display_name
          }
        }
      });
    }
  }, []);

  // REGISTER
  const register = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: `${firstName} ${lastName}`
        }
      }
    });

    if (error) {
      throw error;
    }
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    dispatch({
      type: AUTH_CONTEXT_LOGOUT
    });
  }, []);

  // FORGOT PASSWORD
  const forgotPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `/code-verification`
    });

    if (error) {
      throw error;
    }
  }, []);

  const memoizedValue = useMemo(
    () => ({
      user: { ...state.user },
      ...state,
      login,
      register,
      logout,
      forgotPassword
    }),
    [forgotPassword, login, logout, register, state]
  );

  return <SupabaseContext value={memoizedValue}>{children}</SupabaseContext>;
}

export default SupabaseContext;
