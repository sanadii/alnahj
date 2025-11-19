import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  alpha,
  useTheme,
  useMediaQuery,
  SxProps,
  Theme
} from '@mui/material';
import { IconDotsVertical } from '@tabler/icons-react';
import {
  HeaderActionConfig,
  HeaderActionInput,
  resolveHeaderAction
} from '../layout/headerActions';

export interface PremiumCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  hover?: boolean;
  padding?: number | string;
  borderRadius?: number;
  className?: string;
  sx?: SxProps<Theme>;
  onClick?: () => void;
  disabled?: boolean;
  // Header props (integrated from PremiumHeader)
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerActions?: HeaderActionInput[] | React.ReactNode;
  headerPadding?: number | string;
}

/**
 * PremiumCard - A reusable card component with premium design system
 *
 * Features:
 * - Gradient backgrounds with theme colors
 * - Integrated header with gradient background
 * - Icon integration with consistent styling
 * - Preset action buttons with smart defaults
 * - Hover effects with elevation
 * - Consistent padding and spacing
 * - Theme-aware colors
 * - Responsive design
 * - Clickable support
 *
 * @example
 * ```tsx
 * // Basic card
 * <PremiumCard>
 *   <Typography>Card content</Typography>
 * </PremiumCard>
 *
 * // Card with header and preset actions
 * <PremiumCard
 *   title="Client Info"
 *   icon={<IconUser />}
 *   color="primary"
 *   headerActions={['viewAll', 'add', 'print']}
 * >
 *   <Typography>Card content</Typography>
 * </PremiumCard>
 *
 * // Card with preset actions and overrides
 * <PremiumCard
 *   title="Appointments"
 *   headerActions={[
 *     { preset: 'viewAll', onClick: handleView },
 *     { preset: 'add', onClick: handleAdd, show: canAdd },
 *     'print'
 *   ]}
 * >
 *   <Typography>Card content</Typography>
 * </PremiumCard>
 *
 * // Card with custom actions
 * <PremiumCard
 *   title="Custom"
 *   headerActions={[
 *     {
 *       type: 'button',
 *       label: 'Custom Action',
 *       variant: 'contained',
 *       onClick: handleCustom
 *     }
 *   ]}
 * >
 *   <Typography>Card content</Typography>
 * </PremiumCard>
 * ```
 */
const PremiumCard: React.FC<PremiumCardProps> = ({
  children,
  variant = 'default',
  color = 'neutral',
  hover = true,
  padding = 3,
  borderRadius = 2,
  className,
  sx,
  onClick,
  disabled = false,
  // Header props
  title,
  subtitle,
  icon,
  headerActions,
  headerPadding = 2
}) => {
  const theme = useTheme();

  // Get color values based on color prop
  const getColorValues = () => {
    if (color === 'neutral') {
      return {
        main: theme.palette.grey[500],
        light: theme.palette.grey[300],
        dark: theme.palette.grey[700]
      };
    }
    return theme.palette[color];
  };

  const colorValues = getColorValues();

  // Base card styles
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [actionMenuAnchor, setActionMenuAnchor] = React.useState<null | HTMLElement>(null);

  const baseStyles: SxProps<Theme> = {
    borderRadius,
    transition: theme.transitions.create(['transform', 'boxShadow'], {
      duration: theme.transitions.duration.short
    }),
    cursor: onClick ? 'pointer' : 'default',
    opacity: disabled ? 0.6 : 1,
    '&:hover':
      hover && !disabled
        ? {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[8]
          }
        : {},
    ...(isMobile && {
      borderRadius: 0
    }),
    ...sx
  };

  // Variant-specific styles
  const getVariantStyles = (): SxProps<Theme> => {
    switch (variant) {
      case 'outlined':
        return {
          border: `1px solid ${alpha(colorValues.main, 0.2)}`,
          backgroundColor: 'transparent',
          '&:hover':
            hover && !disabled
              ? {
                  backgroundColor: alpha(colorValues.main, 0.04),
                  borderColor: alpha(colorValues.main, 0.3)
                }
              : {}
        };

      case 'elevated':
        return {
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[4],
          '&:hover':
            hover && !disabled
              ? {
                  boxShadow: theme.shadows[12]
                }
              : {}
        };

      case 'default':
      default:
        return {
          background: `linear-gradient(135deg, ${alpha(colorValues.main, 0.08)} 0%, ${alpha(colorValues.light, 0.05)} 100%)`,
          border: `1px solid ${alpha(colorValues.main, 0.15)}`,
          boxShadow: theme.shadows[2],
          '&:hover':
            hover && !disabled
              ? {
                  background: `linear-gradient(135deg, ${alpha(colorValues.main, 0.12)} 0%, ${alpha(colorValues.light, 0.08)} 100%)`,
                  borderColor: alpha(colorValues.main, 0.25)
                }
              : {}
        };
    }
  };

  const variantStyles = getVariantStyles();
  const combinedStyles = { ...baseStyles, ...variantStyles };

  // Header styles (only if title is provided)
  const headerStyles: SxProps<Theme> = {
    p: headerPadding,
    background: `linear-gradient(135deg, ${alpha(colorValues.main, 0.08)} 0%, ${alpha(colorValues.light, 0.05)} 100%)`,
    borderBottom: `1px solid ${alpha(colorValues.main, 0.1)}`,
    mb: 0
  };

  const iconStyles: SxProps<Theme> = {
    width: { xs: 36, md: 32 },
    height: { xs: 36, md: 32 },
    borderRadius: 2,
    background: `linear-gradient(135deg, ${colorValues.main} 0%, ${colorValues.dark} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.shadows[2],
    color: 'white'
  };

  // Render a single action button
  const renderAction = (action: HeaderActionConfig, index: number) => {
    // Check if action should be shown
    if (action.show === false) return null;

    const { type, label, variant, icon: actionIcon, color: actionColor, onClick, disabled, tooltip, underline } = action;

    if (type === 'iconButton') {
      const button = (
        <IconButton
          key={index}
          size="small"
          onClick={onClick}
          disabled={disabled}
          sx={{
            color: actionColor ? `${actionColor}.main` : 'text.primary'
          }}
        >
          {actionIcon}
        </IconButton>
      );

      return tooltip ? (
        <Tooltip key={index} title={tooltip}>
          {button}
        </Tooltip>
      ) : (
        button
      );
    }

    // type === 'button'
    return (
      <Button
        key={index}
        size="small"
        variant={variant || 'text'}
        startIcon={actionIcon}
        onClick={onClick}
        disabled={disabled}
        color={actionColor}
        sx={
          underline
            ? {
                textDecoration: 'underline',
                color: 'primary.main'
              }
            : undefined
        }
      >
        {label}
      </Button>
    );
  };

  // Render header actions
  const renderHeaderActions = () => {
    if (!headerActions) return null;

    // If it's ReactNode (backward compatibility), render as-is
    if (!Array.isArray(headerActions)) {
      return typeof headerActions === 'string' ? (
        <Typography variant="body2" color="text.secondary">
          {headerActions}
        </Typography>
      ) : (
        <Stack direction="row" spacing={1}>
          {headerActions}
        </Stack>
      );
    }

    // Process array of actions
    const resolvedActions = headerActions
      .map((action) => resolveHeaderAction(action))
      .filter((action): action is HeaderActionConfig => action !== null && action.show !== false);

    if (resolvedActions.length === 0) return null;

    if (isMobile) {
      const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setActionMenuAnchor(event.currentTarget);
      };

      const handleMenuClose = () => setActionMenuAnchor(null);

      const renderMenuItem = (action: HeaderActionConfig, index: number) => {
        const label = action.label || action.tooltip || (action.preset ? action.preset : 'Action');
        const iconNode = action.icon && React.isValidElement(action.icon) ? action.icon : null;

        return (
          <MenuItem
            key={index}
            onClick={() => {
              action.onClick?.();
              handleMenuClose();
            }}
            disabled={action.disabled}
          >
            {iconNode && <ListItemIcon sx={{ minWidth: 32 }}>{iconNode}</ListItemIcon>}
            <ListItemText primary={label} />
          </MenuItem>
        );
      };

      return (
        <>
          <IconButton size="small" onClick={handleMenuOpen}>
            <IconDotsVertical size={20} />
          </IconButton>
          <Menu anchorEl={actionMenuAnchor} open={Boolean(actionMenuAnchor)} onClose={handleMenuClose}>
            {resolvedActions.map(renderMenuItem)}
          </Menu>
        </>
      );
    }

    return (
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        flexWrap={{ sm: 'wrap' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        sx={{
          '& .MuiButton-root, & .MuiIconButton-root': {
            width: { xs: '100%', sm: 'auto' }
          }
        }}
      >
        {resolvedActions.map((action, index) => renderAction(action, index))}
      </Stack>
    );
  };

  // Render header if title is provided
  const renderHeader = () => {
    if (!title) return null;

    return (
      <Box sx={headerStyles}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left side: Icon + Title */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {icon && (
              <Box sx={iconStyles}>
                {React.isValidElement(icon)
                  ? React.cloneElement(icon as React.ReactElement<any>, {
                      style: { color: 'white' }
                    })
                  : icon}
              </Box>
            )}
            <Box>
              <Typography
                variant="h6"
                fontWeight={600}
                color="text.primary"
                sx={{
                  mb: subtitle ? 0.5 : 0,
                  fontSize: { xs: '1.15rem', md: '1.25rem' }
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 500, fontSize: { xs: '0.85rem', md: '0.95rem' } }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Right side: Actions */}
          {headerActions && <Box>{renderHeaderActions()}</Box>}
        </Box>
      </Box>
    );
  };

  return (
    <Card className={className} sx={combinedStyles} onClick={disabled ? undefined : onClick}>
      {renderHeader()}
      <CardContent sx={{ p: padding, '&:last-child': { pb: padding } }}>{children}</CardContent>
    </Card>
  );
};

export default PremiumCard;
