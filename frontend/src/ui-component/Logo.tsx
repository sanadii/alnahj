// material-ui
import { useTheme } from '@mui/material/styles';

// project imports
import { ThemeMode } from 'config';
import logoDark from 'assets/images/logo-dark.svg';
import logo from 'assets/images/logo.svg';
import brandLogo1x from 'assets/images/brands/logo-150x150.svg';
import brandLogo2x from 'assets/images/brands/logo-300x100.svg';

// ==============================|| LOGO ||============================== //

export default function Logo() {
  const theme = useTheme();
  const isDark = theme.palette.mode === ThemeMode.DARK;

  // Prefer new brand SVGs; fall back to theme SVGs if an error occurs
  return (
    <img
      src={brandLogo1x}
      srcSet={`${brandLogo1x} 1x, ${brandLogo2x} 2x`}
      alt="Logo"
      style={{ height: 32 }}
      onError={(e) => {
        const target = e.currentTarget as HTMLImageElement;
        target.onerror = null;
        target.src = isDark ? logoDark : logo;
        // @ts-ignore - ignore srcset property case
        target.srcset = '';
      }}
    />
  );
}

