// material-ui
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// project imports
import LogoSection from '../LogoSection';
import InlineMenu from './InlineMenu';
import NotificationSection from './NotificationSection';
import FullScreenSection from './FullScreenSection';
import ProfileSection from './ProfileSection';
import { WebSocketStatus } from 'shared/components';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      {/* logo */}
      <Box sx={{ width: { xs: 'auto', md: 228 }, display: 'flex' }}>
        <Box component="span" sx={{ flexGrow: 1 }}>
          <LogoSection />
        </Box>
      </Box>

      {/* desktop inline menu */}
      {!isMobile && (
        <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
          <InlineMenu />
        </Box>
      )}

      {/* spacer */}
      <Box sx={{ flexGrow: 1 }} />

      {/* WebSocket status indicator */}
      <Box sx={{ display: { xs: 'none', sm: 'flex' }, mr: 1 }}>
        <WebSocketStatus variant="icon" size="small" />
      </Box>

      {/* notification */}
      <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
        <NotificationSection />
      </Box>

      {/* full screen toggler */}
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <FullScreenSection />
      </Box>

      {/* profile */}
      <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
        <ProfileSection />
      </Box>
    </>
  );
}
