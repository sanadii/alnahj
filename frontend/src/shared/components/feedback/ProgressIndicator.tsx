import React from 'react';
import { LinearProgress, CircularProgress, Box, Typography, alpha, useTheme, SxProps, Theme } from '@mui/material';

export interface ProgressIndicatorProps {
  type?: 'linear' | 'circular';
  value?: number;
  max?: number;
  size?: number;
  thickness?: number;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  variant?: 'determinate' | 'indeterminate' | 'buffer';
  showLabel?: boolean;
  label?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  className?: string;
  sx?: SxProps<Theme>;
}

/**
 * ProgressIndicator - A premium progress indicator component
 *
 * Features:
 * - Linear and circular variants
 * - Gradient styling
 * - Label support
 * - Multiple positions
 * - Custom colors
 * - Premium animations
 *
 * @example
 * ```tsx
 * <ProgressIndicator
 *   type="linear"
 *   value={65}
 *   showLabel
 *   label="Loading..."
 *   position="top"
 * />
 *
 * <ProgressIndicator
 *   type="circular"
 *   value={75}
 *   size={60}
 *   thickness={4}
 *   showLabel
 *   position="center"
 * />
 * ```
 */
const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  type = 'linear',
  value = 0,
  max = 100,
  size = 40,
  thickness = 3.6,
  color = 'primary',
  variant = 'determinate',
  showLabel = false,
  label,
  position = 'bottom',
  className,
  sx
}) => {
  const theme = useTheme();

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const containerStyles: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    ...(type === 'linear' && position === 'top' && { flexDirection: 'column', gap: 1 }),
    ...(type === 'linear' && position === 'bottom' && { flexDirection: 'column-reverse', gap: 1 }),
    ...(type === 'linear' && position === 'left' && { flexDirection: 'row', gap: 2 }),
    ...(type === 'linear' && position === 'right' && { flexDirection: 'row-reverse', gap: 2 }),
    ...(type === 'circular' &&
      position === 'center' && {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        minHeight: size + 40
      }),
    ...sx
  };

  const progressStyles: SxProps<Theme> = {
    ...(type === 'linear' && {
      height: 8,
      borderRadius: 4,
      backgroundColor: alpha(theme.palette[color].main, 0.1),
      '& .MuiLinearProgress-bar': {
        borderRadius: 4,
        background: `linear-gradient(90deg, ${theme.palette[color].main} 0%, ${theme.palette[color].dark} 100%)`
      }
    }),
    ...(type === 'circular' && {
      color: theme.palette[color].main,
      '& .MuiCircularProgress-circle': {
        strokeLinecap: 'round'
      }
    })
  };

  const labelStyles: SxProps<Theme> = {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'text.secondary',
    ...(type === 'circular' &&
      position === 'center' && {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '0.75rem'
      })
  };

  const renderLabel = () => {
    if (!showLabel) return null;

    const displayLabel = label || (variant === 'determinate' ? `${Math.round(percentage)}%` : 'Loading...');

    return <Typography sx={labelStyles}>{displayLabel}</Typography>;
  };

  return (
    <Box className={className} sx={containerStyles}>
      {type === 'linear' ? (
        <>
          {position === 'top' && renderLabel()}
          {position === 'left' && renderLabel()}

          <Box sx={{ flex: 1, minWidth: 200 }}>
            <LinearProgress
              variant={variant}
              value={variant === 'determinate' ? percentage : undefined}
              color={color}
              sx={progressStyles}
            />
          </Box>

          {position === 'right' && renderLabel()}
          {position === 'bottom' && renderLabel()}
        </>
      ) : (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            variant={variant}
            value={variant === 'determinate' ? percentage : undefined}
            size={size}
            thickness={thickness}
            color={color}
            sx={progressStyles}
          />
          {(position === 'center' || showLabel) && (
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {renderLabel()}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProgressIndicator;
