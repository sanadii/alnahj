import { useState } from 'react';
import { Link, useLocation, matchPath } from 'react-router-dom';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconMenu2, IconX } from '@tabler/icons-react';
import { useSelector } from 'react-redux';

// project imports
import menuItems from 'menu-items';
import type { RootState } from 'store';
import { canAccessDashboard } from 'utils/roleBasedNavigation';

// ==============================|| INLINE MENU ||============================== //

export default function InlineMenu() {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const currentUserRole = useSelector(
    (state: RootState) => state.auth?.user?.role || state.auth?.user?.role_display || ''
  );
  const normalizedRole = (currentUserRole || '').toUpperCase();
  const allowDashboard = canAccessDashboard(normalizedRole);

  // Flatten menu items - show only actual items (not groups)
  const flattenedItems = menuItems.items.flatMap((item) => {
    if (item.type === 'group' && item.children) {
      // Return children of groups
      return item.children;
    } else if (item.type === 'item') {
      // Return direct items
      return [item];
    }
    return [];
  });

  const unavailableUrls = ['/sorting'];

  const menuContent = flattenedItems
    .filter((item) => item.icon) // Only show items with icons
    .filter((item) => (item.id === 'dashboard' ? allowDashboard : true))
    .map((item) => {
      const Icon = item.icon!;
      const isActive = item.url ? !!matchPath({ path: item.url, end: false }, location.pathname) : false;

      return {
        ...item,
        Icon,
        isActive,
        unavailable: item.url ? unavailableUrls.includes(item.url) : false
      };
    });

  // Mobile drawer
  if (isMobile) {
    return (
      <>
        <IconButton onClick={handleDrawerToggle} sx={{ ml: 1 }}>
          <IconMenu2 />
        </IconButton>
        <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
          <Box sx={{ width: 250, pt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, pb: 2 }}>
              <IconButton onClick={handleDrawerToggle}>
                <IconX />
              </IconButton>
            </Box>
            <List>
              {menuContent.map((item) => (
                <ListItemButton
                  key={item.id}
                  component={item.unavailable ? 'div' : Link}
                  to={item.unavailable ? undefined : item.url || '/'}
                  selected={item.isActive}
                  onClick={
                    item.unavailable
                      ? (e: React.MouseEvent) => {
                          e.preventDefault();
                        }
                      : () => handleDrawerToggle()
                  }
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    mb: 0.5,
                    opacity: item.unavailable ? 0.5 : 1,
                    cursor: item.unavailable ? 'not-allowed' : 'pointer'
                  }}
                  disabled={item.unavailable}
                >
                  <ListItemIcon>
                    <item.Icon stroke={1.5} size="20px" color={item.unavailable ? theme.palette.error.main : undefined} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    secondary={item.unavailable ? 'Coming soon' : undefined}
                    primaryTypographyProps={{ color: item.unavailable ? theme.palette.error.main : undefined }}
                    secondaryTypographyProps={{ color: theme.palette.text.secondary, fontSize: '0.75rem' }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Drawer>
      </>
    );
  }

  // Desktop inline menu
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      {menuContent.map((item) => (
        <Button
          key={item.id}
          component={item.unavailable ? 'button' : Link}
          to={item.unavailable ? undefined : item.url || '/'}
          startIcon={<item.Icon stroke={1.5} size="20px" />}
          sx={{
            color: item.unavailable
              ? theme.palette.error.main
              : item.isActive
              ? 'primary.main'
              : 'text.primary',
            bgcolor: item.unavailable
              ? `${theme.palette.error.lighter}`
              : item.isActive
              ? 'primary.lighter'
              : 'transparent',
            px: 2,
            py: 1,
            borderRadius: 1,
            textTransform: 'none',
            fontSize: '0.875rem',
            fontWeight: item.isActive ? 500 : 400,
            cursor: item.unavailable ? 'not-allowed' : 'pointer',
            '&:hover': {
              bgcolor: item.unavailable
                ? `${theme.palette.error.lighter}`
                : item.isActive
                ? 'primary.lighter'
                : theme.palette.mode === 'dark'
                ? 'dark.main'
                : 'secondary.light'
            }
          }}
          onClick={item.unavailable ? (e) => e.preventDefault() : undefined}
          disabled={item.unavailable}
        >
          <Box display="flex" flexDirection="column" alignItems="flex-start" lineHeight={1.2}>
            <Typography variant="body2" fontWeight={item.unavailable ? 600 : item.isActive ? 600 : 500}>
              {item.title}
            </Typography>
            {item.unavailable && (
              <Typography variant="caption" color={theme.palette.error.dark} fontSize="0.7rem">
                Coming soon
              </Typography>
            )}
          </Box>
        </Button>
      ))}
    </Box>
  );
}
