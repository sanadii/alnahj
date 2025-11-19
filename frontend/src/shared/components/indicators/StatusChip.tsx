import React from 'react';
import { Chip, alpha, useTheme, SxProps, Theme, Box } from '@mui/material';
import { ReactNode } from 'react';

export type StatusType =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'completed'
  | 'failed'
  | 'warning'
  | 'info'
  | 'success'
  | 'error'
  | 'draft'
  | 'published'
  | 'archived'
  | 'cancelled'
  | 'processing'
  | 'approved'
  | 'rejected';

export interface StatusChipProps {
  status: StatusType;
  label?: string;
  size?: 'small' | 'medium';
  variant?: 'filled' | 'outlined' | 'soft';
  showIcon?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  onDelete?: () => void;
  className?: string;
  sx?: SxProps<Theme>;
}

const StatusChip: React.FC<StatusChipProps> = ({
  status,
  label,
  size = 'small',
  variant = 'filled',
  showIcon = false,
  icon,
  onClick,
  onDelete,
  className,
  sx
}) => {
  const theme = useTheme();

  const getStatusConfig = (statusType: StatusType) => {
    const configs = {
      active: {
        color: 'success' as const,
        label: 'Active',
        icon: '●'
      },
      inactive: {
        color: 'default' as const,
        label: 'Inactive',
        icon: '○'
      },
      pending: {
        color: 'warning' as const,
        label: 'Pending',
        icon: '⏳'
      },
      completed: {
        color: 'success' as const,
        label: 'Completed',
        icon: '✓'
      },
      failed: {
        color: 'error' as const,
        label: 'Failed',
        icon: '✗'
      },
      warning: {
        color: 'warning' as const,
        label: 'Warning',
        icon: '⚠'
      },
      info: {
        color: 'info' as const,
        label: 'Info',
        icon: 'ℹ'
      },
      success: {
        color: 'success' as const,
        label: 'Success',
        icon: '✓'
      },
      error: {
        color: 'error' as const,
        label: 'Error',
        icon: '✗'
      },
      draft: {
        color: 'default' as const,
        label: 'Draft',
        icon: '📝'
      },
      published: {
        color: 'success' as const,
        label: 'Published',
        icon: '📢'
      },
      archived: {
        color: 'default' as const,
        label: 'Archived',
        icon: '📦'
      },
      cancelled: {
        color: 'error' as const,
        label: 'Cancelled',
        icon: '✗'
      },
      processing: {
        color: 'info' as const,
        label: 'Processing',
        icon: '⚙'
      },
      approved: {
        color: 'success' as const,
        label: 'Approved',
        icon: '✓'
      },
      rejected: {
        color: 'error' as const,
        label: 'Rejected',
        icon: '✗'
      }
    };

    return configs[statusType] || configs.active;
  };

  const statusConfig = getStatusConfig(status);
  const displayLabel = label || statusConfig.label;
  const displayIcon = icon || (showIcon ? statusConfig.icon : undefined);

  const getVariantStyles = (): SxProps<Theme> => {
    const color = statusConfig.color;
    const colorPalette = theme.palette[color];

    switch (variant) {
      case 'outlined':
        return {
          borderColor: colorPalette.main,
          color: colorPalette.main,
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: alpha(colorPalette.main, 0.04)
          }
        };
      case 'soft':
        return {
          backgroundColor: alpha(colorPalette.main, 0.1),
          color: colorPalette.dark,
          border: 'none',
          '&:hover': {
            backgroundColor: alpha(colorPalette.main, 0.15)
          }
        };
      case 'filled':
      default:
        return {
          backgroundColor: colorPalette.main,
          color: colorPalette.contrastText,
          border: 'none',
          '&:hover': {
            backgroundColor: colorPalette.dark
          }
        };
    }
  };

  const chipStyles: SxProps<Theme> = {
    fontWeight: 600,
    borderRadius: 2,
    textTransform: 'none',
    transition: theme.transitions.create(['all'], {
      duration: theme.transitions.duration.short
    }),
    ...getVariantStyles(),
    ...sx
  };

  return (
    <Box className={className}>
      <Chip
        label={displayLabel}
        icon={displayIcon ? <Box sx={{ fontSize: '0.75rem' }}>{displayIcon}</Box> : undefined}
        size={size}
        variant={variant === 'outlined' ? 'outlined' : 'filled'}
        onClick={onClick}
        onDelete={onDelete}
        sx={chipStyles}
      />
    </Box>
  );
};

export default StatusChip;
