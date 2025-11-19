import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

// material-ui
import Link from '@mui/material/Link';

// project imports
import Logo from 'ui-component/Logo';
import type { RootState } from 'store';
import { getDefaultLandingPath } from 'utils/roleBasedNavigation';

// ==============================|| MAIN LOGO ||============================== //

export default function LogoSection() {
  const currentUserRole = useSelector(
    (state: RootState) => state.auth?.user?.role || state.auth?.user?.role_display || ''
  );
  const targetPath = getDefaultLandingPath(currentUserRole);

  return (
    <Link component={RouterLink} to={targetPath} aria-label="theme-logo">
      <Logo />
    </Link>
  );
}
