import React from 'react';
import { Fab, Tooltip, alpha, useTheme, SxProps, Theme } from '@mui/material';

export interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  color?: 'primary' | 'secondary';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  tooltip?: string;
  disabled?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
}

/**
 * FloatingActionButton - A premium floating action button
 *
 * Features:
 * - Gradient background
 * - Hover animations
 * - Tooltip support
 * - Position customization
 * - Disabled state
 *
 * @example
 * ```tsx
 * <FloatingActionButton
 *   icon={<IconPlus />}
 *   onClick={handleAdd}
 *   tooltip="Add new item"
 *   position="bottom-right"
 * />
 * ```
 */
const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onClick,
  color = 'primary',
  position = 'bottom-right',
  tooltip,
  disabled = false,
  className,
  sx
}) => {
  const theme = useTheme();

  const getPositionStyles = (): SxProps<Theme> => {
    const basePosition = {
      position: 'fixed',
      zIndex: theme.zIndex.speedDial
    };

    switch (position) {
      case 'bottom-right':
        return { ...basePosition, bottom: 24, right: 24 };
      case 'bottom-left':
        return { ...basePosition, bottom: 24, left: 24 };
      case 'top-right':
        return { ...basePosition, top: 24, right: 24 };
      case 'top-left':
        return { ...basePosition, top: 24, left: 24 };
      default:
        return { ...basePosition, bottom: 24, right: 24 };
    }
  };

  const fabStyles: SxProps<Theme> = {
    ...getPositionStyles(),
    background: `linear-gradient(135deg, ${theme.palette[color].main} 0%, ${theme.palette[color].dark} 100%)`,
    boxShadow: theme.shadows[8],
    '&:hover': {
      boxShadow: theme.shadows[12],
      transform: 'scale(1.05)'
    },
    transition: theme.transitions.create(['transform', 'boxShadow'], {
      duration: theme.transitions.duration.short
    }),
    ...sx
  };

  const fab = (
    <Fab className={className} color={color} onClick={onClick} disabled={disabled} sx={fabStyles}>
      {icon}
    </Fab>
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip} placement="left">
        {fab}
      </Tooltip>
    );
  }

  return fab;
};

export default FloatingActionButton;
