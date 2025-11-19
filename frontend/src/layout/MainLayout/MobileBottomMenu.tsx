import { useMemo } from 'react';
import type { ComponentType } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { Box, Paper, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';

// project imports
import menuItems from 'menu-items';
import type { RootState } from 'store';
import { canAccessDashboard } from 'utils/roleBasedNavigation';

const flattenMenuItems = () =>
  menuItems.items.flatMap((item) => {
    if (item.type === 'group' && item.children) {
      return item.children;
    }
    if (item.type === 'item') {
      return [item];
    }
    return [];
  });

type NavItem = {
  id: string;
  title?: string;
  url?: string;
  icon: ComponentType<any>;
  isActive: boolean;
  unavailable: boolean;
};

const DISABLED_ROUTES = ['/sorting'];

export default function MobileBottomMenu() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const shellSpacing = theme.layoutSpacing?.shell;
  const currentUserRole = useSelector(
    (state: RootState) => state.auth?.user?.role || state.auth?.user?.role_display || ''
  );
  const normalizedRole = (currentUserRole || '').toUpperCase();
  const allowDashboard = canAccessDashboard(normalizedRole);

  const menuContent = useMemo(() => {
    const flattenedItems = flattenMenuItems();
    const navOrder = [
      ...(allowDashboard ? ['dashboard'] : []),
      'guarantees',
      'attendance',
      'sorting',
      'electors'
    ];

    return navOrder
      .map((id) => flattenedItems.find((item) => item.id === id && item.icon))
      .filter(Boolean)
      .map<NavItem>((item) => {
        const Icon = item!.icon!;
        const isActive = item!.url ? !!matchPath({ path: item!.url, end: false }, location.pathname) : false;
        return {
          ...item!,
          icon: Icon,
          isActive,
          unavailable: item!.url ? DISABLED_ROUTES.includes(item!.url) : false
        };
      });
  }, [location.pathname, allowDashboard]);

  if (!isMobile) return null;

  const renderNavItem = (item: NavItem, options?: { highlight?: boolean; subdued?: boolean; noAction?: boolean }) => {
    const { highlight, subdued, noAction } = options || {};
    const isDisabled = item.unavailable || noAction;
    const linkProps = !isDisabled ? { component: Link, to: item.url || '/' } : {};
    return (
      <Box
        key={item.id}
        {...(linkProps as any)}
        sx={{
          flex: highlight ? 1.2 : 1,
          textDecoration: 'none',
          color: item.unavailable
            ? theme.palette.error.main
            : highlight && item.isActive
              ? theme.palette.primary.main
              : subdued
                ? theme.palette.text.disabled
                : item.isActive
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.4,
          py: 0.5,
          transition: 'color 0.2s ease',
          position: 'relative',
          cursor: item.unavailable || noAction ? 'default' : 'pointer',
          pointerEvents: item.unavailable || noAction ? 'none' : 'auto',
          opacity: subdued ? 0.6 : 1
        }}
        onClick={(e) => (item.unavailable || noAction) && e.preventDefault()}
        aria-disabled={item.unavailable || noAction}
      >
        {highlight && (
          <Box
            sx={{
              position: 'absolute',
              top: 4,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: theme.palette.primary.main,
              opacity: item.isActive ? 0.9 : 0
            }}
          />
        )}
        <Box
          sx={{
            width: highlight ? 44 : 36,
            height: highlight ? 44 : 36,
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: item.unavailable
              ? theme.palette.error.light
              : highlight
                ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 80%)`
                : item.isActive
                  ? `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.light} 100%)`
                  : theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.04)'
                    : 'rgba(15,23,42,0.04)',
            color: item.unavailable ? theme.palette.error.dark : highlight ? '#fff' : 'inherit',
            border: highlight ? 'none' : `1px solid ${theme.palette.divider}`,
            transition: 'background 0.2s ease, color 0.2s ease',
            boxShadow: highlight
              ? '0 12px 25px rgba(15, 23, 42, 0.25)'
              : item.isActive
                ? '0 8px 16px rgba(15, 23, 42, 0.12)'
                : 'none'
          }}
        >
          <item.icon stroke={1.5} size={highlight ? '24px' : '20px'} />
        </Box>
      </Box>
    );
  };

  const getNavItem = (id: string) => menuContent.find((item) => item.id === id);

  const dashboardItem = getNavItem('dashboard');
  const attendanceItem = getNavItem('attendance');
  const sortingItem = getNavItem('sorting');
  const guaranteesItem = getNavItem('guarantees');
  const electorsItem = getNavItem('electors');

  const horizontalInset = shellSpacing?.marginX.xs ?? theme.spacing(2);
  const bottomInset = shellSpacing?.marginX.xs ?? theme.spacing(2);
  const surfacePadding = shellSpacing?.padding.xs ?? theme.spacing(0.75);
  const surfaceShadow = theme.customShadows?.z20 ?? theme.shadows[8];

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'fixed',
        left: horizontalInset,
        right: horizontalInset,
        bottom: bottomInset,
        margin: '0 auto',
        maxWidth: 560,
        p: surfacePadding,
        borderRadius: 999,
        display: 'flex',
        justifyContent: 'space-around',
        zIndex: theme.zIndex.drawer + 2,
        border: `1px solid ${theme.palette.divider}`,
        background: theme.palette.mode === 'dark' ? 'rgba(22, 28, 36, 0.95)' : 'rgba(255,255,255,0.9)',
        boxShadow: surfaceShadow,
        backdropFilter: 'blur(18px)'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          gap: 1,
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {dashboardItem && renderNavItem(dashboardItem)}
        {attendanceItem && renderNavItem(attendanceItem)}
        {guaranteesItem && renderNavItem(guaranteesItem, { highlight: true })}
        {sortingItem && renderNavItem(sortingItem, { subdued: true })}
        {electorsItem && renderNavItem(electorsItem, { noAction: true })}
      </Box>
    </Paper>
  );
}



