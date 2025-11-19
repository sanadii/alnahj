import React from 'react';
import { Box, Typography, Button, Stack, alpha, useTheme, SxProps, Theme } from '@mui/material';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'contained' | 'outlined' | 'text';
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  };
  size?: 'small' | 'medium' | 'large';
  className?: string;
  sx?: SxProps<Theme>;
}

/**
 * EmptyState - A premium empty state component
 *
 * Features:
 * - Custom icon support
 * - Title and description
 * - Optional action button
 * - Size variants
 * - Premium styling
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<IconInbox />}
 *   title="No data found"
 *   description="There are no items to display at the moment."
 *   action={{
 *     label: "Add New Item",
 *     onClick: handleAdd,
 *     variant: "contained"
 *   }}
 * />
 * ```
 */
const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action, size = 'medium', className, sx }) => {
  const theme = useTheme();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: 3,
          iconSize: 48,
          titleVariant: 'h6' as const,
          descriptionVariant: 'body2' as const
        };
      case 'large':
        return {
          padding: 6,
          iconSize: 96,
          titleVariant: 'h4' as const,
          descriptionVariant: 'body1' as const
        };
      case 'medium':
      default:
        return {
          padding: 4,
          iconSize: 64,
          titleVariant: 'h5' as const,
          descriptionVariant: 'body2' as const
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const containerStyles: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    p: sizeStyles.padding,
    minHeight: 200,
    background: `linear-gradient(135deg, ${alpha(theme.palette.grey[50], 0.5)} 0%, ${alpha(theme.palette.grey[50], 0.3)} 100%)`,
    borderRadius: 3,
    border: `1px solid ${alpha(theme.palette.grey[200], 0.5)}`,
    ...sx
  };

  const iconStyles: SxProps<Theme> = {
    color: 'text.secondary',
    opacity: 0.6,
    mb: 2,
    width: sizeStyles.iconSize,
    height: sizeStyles.iconSize,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const titleStyles: SxProps<Theme> = {
    color: 'text.primary',
    fontWeight: 600,
    mb: description ? 1 : 3
  };

  const descriptionStyles: SxProps<Theme> = {
    color: 'text.secondary',
    mb: action ? 3 : 0,
    maxWidth: 400
  };

  return (
    <Box className={className} sx={containerStyles}>
      {icon && <Box sx={iconStyles}>{icon}</Box>}

      <Typography variant={sizeStyles.titleVariant} sx={titleStyles}>
        {title}
      </Typography>

      {description && (
        <Typography variant={sizeStyles.descriptionVariant} sx={descriptionStyles}>
          {description}
        </Typography>
      )}

      {action && (
        <Button
          variant={action.variant || 'contained'}
          color={action.color || 'primary'}
          onClick={action.onClick}
          sx={{
            minWidth: 120,
            background:
              action.variant === 'contained'
                ? `linear-gradient(135deg, ${theme.palette[action.color || 'primary'].main} 0%, ${theme.palette[action.color || 'primary'].dark} 100%)`
                : undefined
          }}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
