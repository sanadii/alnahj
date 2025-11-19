import React from 'react';
import { Box, Typography, Stack, alpha, useTheme, SxProps, Theme } from '@mui/material';

export interface PremiumHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  actions?: React.ReactNode;
  onAction?: () => void;
  className?: string;
  sx?: SxProps<Theme>;
  padding?: number | string;
  borderRadius?: number;
}

/**
 * PremiumHeader - A reusable header component with premium gradient design
 *
 * Features:
 * - Gradient background with theme colors
 * - Icon integration with consistent styling
 * - Action buttons support
 * - Consistent typography
 * - Responsive layout
 * - Theme-aware colors
 *
 * @example
 * ```tsx
 * // Basic header
 * <PremiumHeader title="Section Title" />
 *
 * // Header with icon and actions
 * <PremiumHeader
 *   title="Products Summary"
 *   subtitle="Manage your product inventory"
 *   icon={<IconPackage />}
 *   color="primary"
 *   actions={
 *     <Button variant="contained" startIcon={<IconPlus />}>
 *       Add Product
 *     </Button>
 *   }
 * />
 *
 * // Success colored header
 * <PremiumHeader
 *   title="Success Message"
 *   color="success"
 *   icon={<IconCheck />}
 * />
 * ```
 */
const PremiumHeader: React.FC<PremiumHeaderProps> = ({
  title,
  subtitle,
  icon,
  color = 'primary',
  actions,
  onAction,
  className,
  sx,
  padding = 3,
  borderRadius = 2
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

  const headerStyles: SxProps<Theme> = {
    p: padding,
    background: `linear-gradient(135deg, ${alpha(colorValues.main, 0.08)} 0%, ${alpha(colorValues.light, 0.05)} 100%)`,
    borderBottom: `1px solid ${alpha(colorValues.main, 0.1)}`,
    borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
    mb: 0,
    ...sx
  };

  const iconStyles: SxProps<Theme> = {
    width: 32,
    height: 32,
    borderRadius: 2,
    background: `linear-gradient(135deg, ${colorValues.main} 0%, ${colorValues.dark} 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.shadows[2],
    color: 'white'
  };

  return (
    <Box className={className} sx={headerStyles}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left side: Icon + Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {icon && (
            <Box sx={iconStyles}>
              {React.cloneElement(icon as React.ReactElement, {
                color: 'white',
                style: { color: 'white' }
              })}
            </Box>
          )}
          <Box>
            <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: subtitle ? 0.5 : 0 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Right side: Actions */}
        {actions && (
          <Box>
            {typeof actions === 'string' ? (
              <Typography variant="body2" color="text.secondary">
                {actions}
              </Typography>
            ) : (
              <Stack direction="row" spacing={1}>
                {actions}
              </Stack>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

PremiumHeader.displayName = 'PremiumHeader';

export default PremiumHeader;
