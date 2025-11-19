import { ReactElement, createContext, useEffect, useReducer } from 'react';

// third party
import { CognitoUser, CognitoUserPool, CognitoUserSession, CognitoUserAttribute, AuthenticationDetails } from 'amazon-cognito-identity-js';

// reducer - state management
import { authReducer, authInitialState, AUTH_CONTEXT_LOGIN, AUTH_CONTEXT_LOGOUT } from './authReducer';

// project imports
import Loader from 'ui-component/Loader';

// types
import { AWSCognitoContextType } from 'types/auth';

const initialState = authInitialState;

export const userPool = new CognitoUserPool({
  UserPoolId: import.meta.env.VITE_APP_AWS_POOL_ID || '',
  ClientId: import.meta.env.VITE_APP_AWS_APP_CLIENT_ID || ''
});

function setSession(accessToken?: string | null) {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  } else {
    localStorage.removeItem('accessToken');
  }
}

// ==============================|| AWS Cognito CONTEXT & PROVIDER ||============================== //

const AWSCognitoContext = createContext<AWSCognitoContextType | null>(null);

export function AWSCognitoProvider({ children }: { children: ReactElement }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        if (accessToken) {
          setSession(accessToken);
          dispatch({
            type: AUTH_CONTEXT_LOGIN,
            payload: {
              user: {
                name: 'Betty'
              }
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

  const login = async (email: string, password: string): Promise<void> => {
    const usr = new CognitoUser({
      Username: email,
      Pool: userPool
    });

    const authData = new AuthenticationDetails({
      Username: email,
      Password: password
    });

    await new Promise<void>((resolve, reject) => {
      usr.authenticateUser(authData, {
        onSuccess: (session: CognitoUserSession) => {
          setSession(session.getAccessToken().getJwtToken());
          dispatch({
            type: AUTH_CONTEXT_LOGIN,
            payload: {
              user: {
                email: authData.getUsername(),
                name: 'John AWS'
              }
            }
          });
          resolve();
        },
        onFailure: (err) => {
          reject(err);
        }
      });
    });
  };

  const register = async (email: string, password: string, firstName: string, lastName: string): Promise<void> => {
    await new Promise<void>((resolve, reject) => {
      userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({ Name: 'email', Value: email }),
          new CognitoUserAttribute({ Name: 'name', Value: `${firstName} ${lastName}` })
        ],
        [],
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          localStorage.setItem('email', email);
          resolve();
        }
      );
    });
  };

  const logout = () => {
    const loggedInUser = userPool.getCurrentUser();
    if (loggedInUser) {
      setSession(null);
      loggedInUser.signOut();
      dispatch({ type: AUTH_CONTEXT_LOGOUT });
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    const user = new CognitoUser({
      Username: email,
      Pool: userPool
    });
    user.forgotPassword({
      onSuccess: () => {},
      onFailure: () => {}
    });
  };

  const awsResetPassword = async (verificationCode: string, newPassword: string): Promise<void> => {
    const email = localStorage.getItem('email');
    const user = new CognitoUser({
      Username: email as string,
      Pool: userPool
    });
    await new Promise<void>((resolve, reject) => {
      user.confirmPassword(verificationCode, newPassword, {
        onSuccess: () => {
          localStorage.removeItem('email');
          resolve();
        },
        onFailure: (error) => {
          reject(error.message);
        }
      });
    });
  };

  const codeVerification = async (verificationCode: string): Promise<void> => {
    const email = localStorage.getItem('email');
    if (!email) {
      throw new Error('Username and Pool information are required');
    }

    const user = new CognitoUser({
      Username: email as string,
      Pool: userPool
    });

    await new Promise<void>((resolve, reject) => {
      user.confirmRegistration(verificationCode, true, (error) => {
        if (error) {
          reject(error.message || JSON.stringify(error));
        } else {
          localStorage.removeItem('email');
          resolve();
        }
      });
    });
  };

  const resendConfirmationCode = async (): Promise<void> => {
    const email = localStorage.getItem('email');
    if (!email) {
      throw new Error('Username and Pool information are required');
    }

    const user = new CognitoUser({
      Username: email as string,
      Pool: userPool
    });

    await new Promise<void>((resolve, reject) => {
      user.resendConfirmationCode((error) => {
        if (error) {
          reject(error.message || JSON.stringify(error));
        } else {
          resolve();
        }
      });
    });
  };

  const updateProfile = () => {};

  if (!state.isInitialized) {
    return <Loader />;
  }

  return (
    <AWSCognitoContext
      value={{
        ...state,
        login,
        logout,
        register,
        forgotPassword,
        awsResetPassword,
        updateProfile,
        codeVerification,
        resendConfirmationCode
      }}
    >
      {children}
    </AWSCognitoContext>
  );
}

export default AWSCognitoContext;
