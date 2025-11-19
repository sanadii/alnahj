import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const LandingPage = () => (
  <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 12 }}>
    <Container maxWidth="lg">
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <Typography variant="h2" fontWeight={700}>
              Premium Election Command Center
            </Typography>
            <Typography color="text.secondary">
              Manage turnout, guarantees, committees, and live vote entry from one cohesive workspace. This landing page
              acts as a placeholder until the public marketing site is ready.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button component={RouterLink} to="/login" variant="contained" size="large">
                Launch app
              </Button>
              <Button variant="outlined" size="large">
                Schedule demo
              </Button>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              bgcolor: 'primary.light',
              borderRadius: 4,
              height: 320,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.contrastText',
              fontSize: 24,
              fontWeight: 600
            }}
          >
            Hero Illustration Placeholder
          </Box>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default LandingPage;
'use client';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// project imports
import Customization from 'layout/Customization';
import AppBar from 'ui-component/extended/AppBar';
import HeaderSection from './HeaderSection';
import CardSection from './CardSection';
import FeatureSection from './FeatureSection';
import PeopleSection from './PeopleSection';
import FrameworkSection from './FrameworkSection';
import FooterSection from './FooterSection';
import CustomizeSection from './CustomizeSection';
import PreBuildDashBoard from './PreBuildDashBoard';
import StartupProjectSection from './StartupProjectSection';
//import IncludeSection from './IncludeSection';
//import RtlInfoSection from './RtlInfoSection';

import { ThemeMode } from 'config';

// =============================|| LANDING MAIN ||============================= //

export default function Landing() {
  const theme = useTheme();

  return (
    <>
      {/* 1. header and hero section */}
      <Box
        id="home"
        sx={{
          overflowX: 'hidden',
          overflowY: 'clip',
          background:
            theme.palette.mode === ThemeMode.DARK
              ? theme.palette.background.default
              : `linear-gradient(360deg, ${theme.palette.grey[100]} 1.09%, ${theme.palette.background.paper} 100%)`
        }}
      >
        <AppBar />
        <HeaderSection />
      </Box>

      {/* 2. card section */}
      <Box sx={{ py: 12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.dark' : 'background.default' }}>
        <CardSection />
      </Box>

      {/* 4. Developer Experience section */}
      <Box sx={{ py: 12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'grey.100' }}>
        <CustomizeSection />
      </Box>

      {/* 3. about section */}
      <Box sx={{ py: 12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.dark' : 'background.default' }}>
        <FeatureSection />
      </Box>

      {/* 4. Apps */}
      <Box sx={{ py: 12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'grey.100' }}>
        <PreBuildDashBoard />
      </Box>

      {/* 5. people section */}
      <Box sx={{ py: 12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.dark' : 'background.default' }}>
        <PeopleSection />
      </Box>

      {/* 6. startup section */}
      <Box sx={{ py: 0 }}>
        <StartupProjectSection />
      </Box>

      {/* multi-language section */}
      {/*  <Box sx={{ py: 0 }}>
                <RtlInfoSection />
            </Box> */}

      {/* framework section */}
      <Box sx={{ py: 12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.dark' : 'background.default' }}>
        <FrameworkSection />
      </Box>

      {/* 7. inculde section */}
      {/* <Box sx={{ py: 12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.dark' : 'background.default' }}>
                <IncludeSection />
            </Box> */}

      {/* footer section */}
      <Box sx={{ py: 12.5, bgcolor: theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'dark.900', pb: 0 }}>
        <FooterSection />
      </Box>
      <Customization />
    </>
  );
}
