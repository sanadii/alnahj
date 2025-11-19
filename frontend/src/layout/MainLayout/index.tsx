import { Outlet } from 'react-router-dom';

// material-ui
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// project imports
import Footer from './Footer';
import Header from './Header';
import MainContentStyled from './MainContentStyled';
import MobileBottomMenu from './MobileBottomMenu';
import Customization from '../Customization';
import Loader from 'ui-component/Loader';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';

import useConfig from 'hooks/useConfig';
import { useGetMenuMaster } from '../../helpers/menu_api_helper';

// ==============================|| MAIN LAYOUT ||============================== //

export default function MainLayout() {
  const { borderRadius, menuOrientation } = useConfig();
  const { menuMasterLoading } = useGetMenuMaster();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const shellSpacing = theme.layoutSpacing?.shell;
  const headerShadow = theme.customShadows?.z8 ?? theme.shadows[4];

  if (menuMasterLoading) return <Loader />;

  return (
    <Box sx={{ display: 'flex' }}>
      {/* header */}
      {!isMobile && (
        <AppBar
          enableColorOnDark
          position="fixed"
          color="inherit"
          elevation={0}
          sx={{
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderBottom: `1px solid ${theme.palette.divider}`,
            boxShadow: headerShadow,
            backdropFilter: 'blur(10px)',
            zIndex: theme.zIndex.drawer + 1
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              minHeight: 64,
              px: shellSpacing?.marginX.md ?? theme.spacing(2.5),
              py: shellSpacing?.padding.sm ?? theme.spacing(1.5)
            }}
          >
            <Header />
          </Toolbar>
        </AppBar>
      )}

      {/* main content */}
      <MainContentStyled {...{ borderRadius, menuOrientation, open: false, hasAppBar: !isMobile }}>
        {/* breadcrumb */}
        <Breadcrumbs />
        <Outlet />
        <Footer />
      </MainContentStyled>
      <Customization />
      <MobileBottomMenu />
    </Box>
  );
}
