import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// project imports
import useAuth from 'hooks/useAuth';
import { GuardProps } from 'types';

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * Redirects unauthenticated users to login page
 * @param {PropTypes.node} children children element/node
 */
export default function AuthGuard({ children }: GuardProps) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      // User is not logged in, redirect to login
      navigate('login', { replace: true });
    } else {
      // If user is on login page but isLoggedIn is true, redirect to default landing
      const currentPath = window.location.pathname;
      if (currentPath === '/login' || currentPath === '/') {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isLoggedIn, navigate]);

  return children;
}
