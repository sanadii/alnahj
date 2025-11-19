import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// project imports
import useAuth from 'hooks/useAuth';
import { GuardProps } from 'types';
import type { RootState } from 'store';
import { getDefaultLandingPath } from 'utils/roleBasedNavigation';

// ==============================|| GUEST GUARD ||============================== //

/**
 * Guest guard for routes having no auth required
 * @param {PropTypes.node} children children element/node
 */

export default function GuestGuard({ children }: GuardProps) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const currentUserRole = useSelector(
    (state: RootState) => state.auth?.user?.role || state.auth?.user?.role_display || ''
  );

  useEffect(() => {
    if (isLoggedIn) {
      navigate(getDefaultLandingPath(currentUserRole), { replace: true });
    }
  }, [isLoggedIn, navigate, currentUserRole]);

  return children;
}
