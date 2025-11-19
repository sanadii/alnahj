import { ReactNode, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar, { AvatarProps } from '@mui/material/Avatar';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';

// project imports
import { ThemeDirection, ThemeMode } from 'config';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import { drawerWidth, gridSpacing } from 'store/constant';
import useConfig from 'hooks/useConfig';

// assets
import {
  IconAccessPoint,
  IconCalendar,
  IconDatabase,
  IconUsers,
  IconTrendingUp,
  IconTarget,
  IconSparkles,
  IconPackage,
  IconBrandWhatsapp,
  IconBox,
  IconHome,
  IconSettings,
  IconBriefcase,
  IconChecklist,
  IconTicket,
  IconGift
} from '@tabler/icons-react';

interface HeaderAvatarProps extends AvatarProps {
  children: ReactNode;
}

function HeaderAvatar({ children, sx, ref, ...others }: HeaderAvatarProps) {
  const theme = useTheme();

  return (
    <Avatar
      ref={ref}
      sx={{
        ...theme.typography.commonAvatar,
        ...theme.typography.mediumAvatar,
        display: { xs: 'none', md: 'flex' },
        bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'secondary.light',
        color: theme.palette.mode === ThemeMode.DARK ? 'secondary.main' : 'secondary.dark',
        '&:hover': {
          bgcolor: theme.palette.mode === ThemeMode.DARK ? 'secondary.main' : 'secondary.dark',
          color: theme.palette.mode === ThemeMode.DARK ? 'secondary.light' : 'secondary.light'
        }
      }}
      {...others}
    >
      {children}
    </Avatar>
  );
}

const linkList = [
  {
    id: 'main-apps',
    label: 'Main Applications',
    children: [
      {
        link: '/application/booking/calendar',
        label: 'Calendar',
        icon: IconCalendar
      },
      {
        link: '/application/crm/dashboard',
        label: 'CRM',
        icon: IconDatabase
      },
      {
        link: '/application/hr/dashboard',
        label: 'HR',
        icon: IconUsers,
        badge: 'Soon'
      },
      {
        link: '/application/finance/dashboard',
        label: 'Finance',
        icon: IconTrendingUp
      },
      {
        link: '/application/marketing/campaigns',
        label: 'Campaigns',
        icon: IconTarget
      },
      {
        link: '/application/ai-assistant/dashboard',
        label: 'AI Assistant',
        icon: IconSparkles
      }
    ]
  },
  {
    id: 'business-apps',
    label: 'Business Applications',
    children: [
      {
        link: '/application/packages',
        label: 'Packages',
        icon: IconGift
      },
      {
        link: '/application/whatsapp-crm',
        label: 'WhatsApp CRM',
        icon: IconBrandWhatsapp
      },
      {
        link: '/application/products',
        label: 'Products',
        icon: IconPackage
      },
      {
        link: '/application/stock/dashboard',
        label: 'Stock',
        icon: IconBox
      },
      {
        link: '/application/resources',
        label: 'Resources',
        icon: IconHome
      }
    ]
  },
  {
    id: 'other-apps',
    label: 'Other Applications',
    children: [
      {
        link: '/application/services',
        label: 'Services',
        icon: IconSettings,
        badge: 'Soon'
      },
      {
        link: '/application/projects',
        label: 'Projects',
        icon: IconBriefcase,
        badge: 'Soon'
      },
      {
        link: '/application/tasks',
        label: 'Tasks',
        icon: IconChecklist,
        badge: 'Soon'
      },
      {
        link: '/application/staff',
        label: 'Staff',
        icon: IconUsers,
        badge: 'Soon'
      },
      {
        link: '/application/vouchers',
        label: 'Vouchers',
        icon: IconTicket,
        badge: 'Soon'
      }
    ]
  }
];

// ==============================|| SEARCH INPUT - MEGA MENu||============================== //

export default function MegaMenuSection() {
  const theme = useTheme();
  const { themeDirection } = useConfig();

  const [open, setOpen] = useState(false);
  const anchorRef = useRef<any>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<HTMLDivElement> | MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <HeaderAvatar
        variant="rounded"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <IconAccessPoint stroke={1.5} size="20px" />
      </HeaderAvatar>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        sx={{ ...(themeDirection === ThemeDirection.RTL && { right: { md: '-170px !important', lg: '-300px !important' } }) }}
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [150, 20]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper
                sx={{
                  width: {
                    md: `calc(100vw - 100px)`,
                    lg: `calc(100vw - ${drawerWidth + 100}px)`,
                    xl: `calc(100vw - ${drawerWidth + 140}px)`
                  },
                  maxWidth: { xl: 900, md: 764 }
                }}
              >
                {open && (
                  <MainCard
                    border={false}
                    elevation={16}
                    content={false}
                    boxShadow
                    shadow={theme.shadows[16]}
                    sx={{ overflow: { p: 1, xs: 'visible', md: 'hidden' } }}
                  >
                    <Grid container spacing={gridSpacing}>
                      <Grid size={{ md: 12 }}>
                        <Grid
                          container
                          spacing={gridSpacing}
                          sx={{
                            pt: 3,
                            pb: 2,
                            px: 2,
                            '& .MuiListItemButton-root:hover': {
                              bgcolor: 'secondary.light',
                              '& .MuiTypography-root': {
                                color: 'secondary.main'
                              },
                              '& .MuiSvgIcon-root': {
                                color: 'secondary.main'
                              }
                            },
                            '& .MuiListItemIcon-root': {
                              minWidth: 32
                            }
                          }}
                        >
                          {linkList.map((links, index) => (
                            <Grid key={index} size={4}>
                              <List
                                component="nav"
                                aria-labelledby={`list-${links.id}`}
                                subheader={
                                  <ListSubheader id={`list-${links.id}`} sx={{ bgcolor: 'transparent' }}>
                                    <Typography variant="subtitle1" color="textPrimary" fontWeight={600}>
                                      {links.label}
                                    </Typography>
                                  </ListSubheader>
                                }
                              >
                                {links.children.map((items, itemIndex) => {
                                  const IconComponent = items.icon;
                                  return (
                                    <ListItemButton component={Link} to={items.link} key={itemIndex} sx={{ borderRadius: 1 }}>
                                      <ListItemIcon>{IconComponent && <IconComponent size={20} stroke={1.5} />}</ListItemIcon>
                                      <ListItemText
                                        primary={
                                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {items.label}
                                            {items.badge && (
                                              <Typography
                                                component="span"
                                                variant="caption"
                                                sx={{
                                                  bgcolor: 'warning.light',
                                                  color: 'warning.dark',
                                                  px: 0.75,
                                                  py: 0.25,
                                                  borderRadius: 0.5,
                                                  fontSize: '0.625rem',
                                                  fontWeight: 600
                                                }}
                                              >
                                                {items.badge}
                                              </Typography>
                                            )}
                                          </Typography>
                                        }
                                      />
                                    </ListItemButton>
                                  );
                                })}
                              </List>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
}
