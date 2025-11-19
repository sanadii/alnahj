/**
 * Premium Page Header Component
 * Reusable gradient header with icon, title, actions, and metadata chips
 */

import React from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  alpha,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconDotsVertical } from '@tabler/icons-react';
import {
  HeaderActionConfig,
  HeaderActionInput,
  resolveHeaderAction
} from './headerActions';

export interface HeaderChip {
  label: string;
  icon?: React.ReactNode;
  color?: string;
  background?: string;
}

export interface PremiumPageHeaderProps {
  /** Page title */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Icon to display in the header */
  icon: React.ReactNode;
  /** Action buttons to display on the right */
  actions?: HeaderActionInput[];
  /** Metadata chips to display below title */
  chips?: HeaderChip[];
  /** Custom gradient colors (default: purple gradient) */
  gradient?: string;
  /** Semantic color shortcut for gradient */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error' | 'neutral';
  /** Whether to show pattern overlay */
  showPattern?: boolean;
  /** Pattern opacity */
  patternOpacity?: number;
  /** Show subtitle on mobile */
  showSubtitleOnMobile?: boolean;
  /** Additional sx props */
  sx?: SxProps<Theme>;
}

const PremiumPageHeader: React.FC<PremiumPageHeaderProps> = ({
  title,
  subtitle,
  icon,
  actions = [],
  chips = [],
  gradient,
  color = 'primary',
  showPattern = true,
  patternOpacity = 0.4,
  showSubtitleOnMobile = false,
  sx
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const resolvedActions = actions
    .map((action) => resolveHeaderAction(action))
    .filter((action): action is HeaderActionConfig => action !== null);

  const getGradientFromColor = () => {
    if (gradient) return gradient;
    const palette =
      color === 'neutral'
        ? { main: theme.palette.grey[500], dark: theme.palette.grey[700] }
        : theme.palette[color];

    return `linear-gradient(135deg, ${alpha(palette.main, 0.95)} 0%, ${alpha(palette.dark, 0.85)} 100%)`;
  };

  const resolvedGradient = getGradientFromColor();

  const getActionColors = (actionColor?: HeaderActionConfig['color']) => {
    if (!actionColor) {
      return {
        palette: undefined,
        colorProp: undefined as undefined
      };
    }
    if (actionColor === 'inherit') {
      return {
        palette: undefined,
        colorProp: 'inherit' as const
      };
    }

    return {
      palette: theme.palette[actionColor],
      colorProp: actionColor
    };
  };

  const renderAction = (action: HeaderActionConfig, index: number) => {
    if (action.show === false) return null;
    const { palette, colorProp } = getActionColors(action.color);
    const isContained = (action.variant || 'contained') === 'contained';
    const actionLabel = action.label || action.tooltip || action.preset || 'Action';

    if (action.type === 'iconButton') {
      if (!action.icon) return null;
      const button = (
        <IconButton
          key={index}
          size="small"
          onClick={action.onClick}
          disabled={action.disabled}
          sx={{
            color: palette ? palette.main : 'white',
            backgroundColor: palette ? alpha(palette.light, 0.2) : 'rgba(255, 255, 255, 0.2)',
            '&:hover': {
              backgroundColor: palette ? alpha(palette.light, 0.3) : 'rgba(255, 255, 255, 0.3)'
            },
            '&.Mui-disabled': {
              color: 'rgba(255, 255, 255, 0.5)'
            }
          }}
        >
          {action.icon}
        </IconButton>
      );

      return action.tooltip ? (
        <Tooltip key={index} title={action.tooltip}>
          {button}
        </Tooltip>
      ) : (
        button
      );
    }

    const button = (
      <Button
        key={index}
        variant={action.variant || 'contained'}
        startIcon={action.icon}
        onClick={action.onClick}
        disabled={action.disabled}
        color={colorProp}
        sx={{
          ...(isContained && !palette
            ? {
                background: 'rgba(255, 255, 255, 0.25)',
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.35)'
                }
              }
            : {}),
          ...(action.variant === 'outlined' && !palette
            ? {
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.8)',
                  background: 'rgba(255, 255, 255, 0.15)'
                }
              }
            : {}),
          ...(action.variant === 'text' && !palette
            ? {
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.15)'
                }
              }
            : {}),
          ...(action.underline
            ? {
                textDecoration: 'underline'
              }
            : {}),
          '&.Mui-disabled': {
            color: 'rgba(255, 255, 255, 0.5)',
            background: isContained ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            borderColor: action.variant === 'outlined' ? 'rgba(255, 255, 255, 0.2)' : undefined
          }
        }}
      >
        {actionLabel}
      </Button>
    );

    return action.tooltip ? (
      <Tooltip key={index} title={action.tooltip}>
        {button}
      </Tooltip>
    ) : (
      button
    );
  };

  const renderMobileActions = () => {
    if (resolvedActions.length === 0) return null;

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => setMenuAnchor(event.currentTarget);
    const handleClose = () => setMenuAnchor(null);

    return (
      <>
        <IconButton
          size="small"
          onClick={handleOpen}
          sx={{
            color: 'white',
            background: 'rgba(255, 255, 255, 0.2)',
            '&:hover': { background: 'rgba(255, 255, 255, 0.3)' }
          }}
        >
          <IconDotsVertical size={18} />
        </IconButton>
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleClose}>
          {resolvedActions
            .filter((action) => action.show !== false)
            .map((action, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  action.onClick?.();
                  handleClose();
                }}
                disabled={action.disabled}
              >
                {action.icon && <ListItemIcon sx={{ minWidth: 32 }}>{action.icon}</ListItemIcon>}
                <ListItemText primary={action.label || action.tooltip || action.preset || 'Action'} />
              </MenuItem>
            ))}
        </Menu>
      </>
    );
  };

  const resolvedSubtitleDisplay = showSubtitleOnMobile ? 'block' : { xs: 'none', md: 'block' };

  return (
    <Box
      sx={{
        background: resolvedGradient,
        position: 'relative',
        overflow: 'hidden',
        p: { xs: 2, md: 3 },
        borderRadius: { xs: 0, md: '12px 12px 0 0' },
        ...sx,
        '&::before': showPattern
          ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              opacity: patternOpacity,
              pointerEvents: 'none'
            }
          : {}
      }}
    >
      <Stack spacing={{ xs: 2, md: 2.5 }} sx={{ position: 'relative', zIndex: 1 }}>
        {/* Title and Actions Row */}
        <Stack
          direction={{ xs: 'row', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'center', md: 'flex-start' }}
          justifyContent="space-between"
        >
          {/* Left: Icon + Title + Subtitle */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, pr: { xs: 1, md: 0 } }}>
            <Box
              sx={{
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            >
              {React.isValidElement(icon)
                ? React.cloneElement(icon as React.ReactElement<any>, {
                    style: { color: 'white' },
                    size: 28
                  })
                : icon}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  mb: subtitle ? 0.5 : 0,
                  fontSize: { xs: '1.3rem', md: '1.75rem' }
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    display: resolvedSubtitleDisplay
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Stack>

          {/* Right: Actions */}
          {actions.length > 0 &&
            (isMobile ? (
              renderMobileActions()
            ) : (
              <Stack direction="row" spacing={1} alignItems="center">
          {resolvedActions.map((action, index) => renderAction(action, index))}
              </Stack>
            ))}
        </Stack>

        {/* Chips */}
        {chips.length > 0 && (
          <Stack
            direction="row"
            flexWrap="wrap"
            gap={1}
            sx={{
              '& .MuiChip-root': {
                height: 28,
                borderRadius: 14,
                fontSize: '0.75rem',
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                }
              }
            }}
          >
            {chips.map((chip, index) => (
              <Chip
                key={index}
                icon={chip.icon ? (React.isValidElement(chip.icon) ? chip.icon : undefined) : undefined}
                label={chip.label}
                sx={{
                  background: chip.background || 'rgba(255, 255, 255, 0.25)',
                  color: chip.color || 'white',
                  '& .MuiChip-icon': { color: chip.color || 'white' }
                }}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default PremiumPageHeader;
