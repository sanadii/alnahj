// material-ui
import { styled } from '@mui/material/styles';

// project imports
import { MenuOrientation, ThemeMode } from 'config';
import { drawerWidth } from 'store/constant';

interface MainStyleProps {
  open: boolean;
  menuOrientation: MenuOrientation;
  borderRadius: number;
  hasAppBar: boolean;
}

// ==============================|| MAIN LAYOUT - STYLED ||============================== //

const MainContentStyled = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'menuOrientation' && prop !== 'borderRadius' && prop !== 'hasAppBar'
})<MainStyleProps>(({ theme, open, menuOrientation, borderRadius, hasAppBar }) => {
  const isHorizontalMenu = menuOrientation === MenuOrientation.HORIZONTAL;
  const isVerticalMenu = menuOrientation === MenuOrientation.VERTICAL;

  const shellSpacing = theme.layoutSpacing?.shell ?? {
    padding: {
      base: theme.spacing(2.5),
      xs: theme.spacing(0),
      sm: theme.spacing(2),
      md: theme.spacing(3)
    },
    marginX: {
      base: theme.spacing(1.5),
      xs: theme.spacing(0),
      sm: theme.spacing(1),
      md: theme.spacing(2.5)
    },
    paddingBottom: {
      base: theme.spacing(8),
      xs: theme.spacing(10),
      sm: theme.spacing(10),
      md: theme.spacing(8)
    }
  };

  const toolbarMinHeight =
    typeof theme.mixins.toolbar?.minHeight === 'number'
      ? `${theme.mixins.toolbar.minHeight}px`
      : (theme.mixins.toolbar?.minHeight as string) || '64px';
  const toolbarActualHeight = '88px'; // Actual toolbar height including padding
  const mobileBottomOffset = `calc(${shellSpacing.paddingBottom.xs} + ${theme.spacing(7)})`;

  // Calculate top margin to match horizontal margins at each breakpoint
  const baseTopMargin = hasAppBar ? `calc(${toolbarMinHeight} + ${shellSpacing.marginX.base})` : shellSpacing.marginX.base;
  const smTopMargin = hasAppBar ? `calc(${toolbarMinHeight} + ${shellSpacing.marginX.sm})` : shellSpacing.marginX.sm;
  // Desktop: use actual toolbar height (88px) + margin (20px = spacing(2.5))
  const mdTopMargin = hasAppBar ? `calc(${toolbarActualHeight} + ${shellSpacing.marginX.md})` : shellSpacing.marginX.md;
  const horizontalOpenOffset = `calc(${toolbarMinHeight} + ${theme.spacing(7)})`;

  return {
    backgroundColor: theme.palette.background.default,
    minWidth: '1%',
    width: '100%',
    minHeight: 'calc(100vh - 88px)',
    flexGrow: 1,
    padding: shellSpacing.padding.base,
    marginTop: baseTopMargin,
    marginLeft: shellSpacing.marginX.base,
    marginRight: shellSpacing.marginX.base,
    borderRadius: `${borderRadius}px`,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingBottom: hasAppBar ? shellSpacing.paddingBottom.base : mobileBottomOffset,
    transition: theme.transitions.create(['margin', 'padding'], {
      easing: open ? theme.transitions.easing.easeOut : theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter + 200
    }),
    [theme.breakpoints.down('sm')]: {
      padding: shellSpacing.padding.xs,
      paddingBottom: hasAppBar ? shellSpacing.paddingBottom.xs : mobileBottomOffset,
      marginLeft: shellSpacing.marginX.xs,
      marginRight: shellSpacing.marginX.xs,
      marginTop: hasAppBar ? `calc(${toolbarMinHeight} + ${shellSpacing.marginX.xs})` : shellSpacing.marginX.xs
    },
    [theme.breakpoints.only('sm')]: {
      padding: shellSpacing.padding.sm,
      paddingBottom: hasAppBar ? shellSpacing.paddingBottom.sm : mobileBottomOffset,
      marginLeft: shellSpacing.marginX.sm,
      marginRight: shellSpacing.marginX.sm,
      marginTop: smTopMargin
    },
    [theme.breakpoints.up('md')]: {
      padding: shellSpacing.padding.md,
      marginRight: shellSpacing.marginX.md,
      marginLeft: open && !isHorizontalMenu ? 0 : shellSpacing.marginX.md,
      marginTop: isHorizontalMenu && open ? horizontalOpenOffset : mdTopMargin,
      width: `calc(100% - ${drawerWidth}px)`,
      ...(isVerticalMenu &&
        !open && {
          marginLeft: -(drawerWidth - 72)
        }),
      paddingBottom: shellSpacing.paddingBottom.md
    }
  };
});

export default MainContentStyled;
