import React from 'react';
import { Box, CircularProgress, Typography, alpha, useTheme, SxProps, Theme } from '@mui/material';

export interface LoadingSpinnerProps {
  size?: number;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  message?: string;
  overlay?: boolean;
  position?: 'center' | 'top' | 'bottom';
  className?: string;
  sx?: SxProps<Theme>;
}

/**
 * LoadingSpinner - A premium loading spinner component
 *
 * Features:
 * - Custom size and color
 * - Optional message
 * - Overlay mode
 * - Position variants
 * - Premium styling
 *
 * @example
 * ```tsx
 * <LoadingSpinner size={40} message="Loading..." />
 * <LoadingSpinner overlay message="Please wait..." />
 * ```
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  color = 'primary',
  message,
  overlay = false,
  position = 'center',
  className,
  sx
}) => {
  const theme = useTheme();

  const getPositionStyles = (): SxProps<Theme> => {
    const baseStyles: SxProps<Theme> = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2
    };

    if (overlay) {
      return {
        ...baseStyles,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: theme.zIndex.modal,
        backgroundColor: alpha(theme.palette.background.default, 0.8),
        backdropFilter: 'blur(4px)'
      };
    }

    switch (position) {
      case 'center':
        return {
          ...baseStyles,
          minHeight: 200
        };
      case 'top':
        return {
          ...baseStyles,
          paddingTop: 4
        };
      case 'bottom':
        return {
          ...baseStyles,
          paddingBottom: 4
        };
      default:
        return baseStyles;
    }
  };

  const containerStyles: SxProps<Theme> = {
    ...getPositionStyles(),
    ...sx
  };

  const spinnerStyles: SxProps<Theme> = {
    color: theme.palette[color].main,
    '& .MuiCircularProgress-circle': {
      strokeLinecap: 'round'
    }
  };

  const messageStyles: SxProps<Theme> = {
    color: 'text.secondary',
    fontSize: '0.875rem',
    fontWeight: 500
  };

  return (
    <Box className={className} sx={containerStyles}>
      <CircularProgress size={size} sx={spinnerStyles} />
      {message && <Typography sx={messageStyles}>{message}</Typography>}
    </Box>
  );
};

export default LoadingSpinner;
