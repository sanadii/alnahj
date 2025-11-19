import { Box, Stack, Typography, Skeleton } from '@mui/material';
import { ReactNode } from 'react';

/**
 * MetricCard Component
 *
 * Displays a metric/statistic with label, value, icon, and optional trend
 * Used in: SummaryTab, Dashboard, Analytics
 *
 * Replaces duplicate metric card implementations across client tabs
 */

export interface MetricCardProps {
  /** Label/title of the metric */
  label: string;
  /** Main value to display */
  value: string | number;
  /** Icon to display (MUI Icon component) */
  icon?: ReactNode;
  /** Icon background color */
  iconColor?: string;
  /** Change/trend value (e.g., "+12%") */
  trend?: string | number;
  /** Trend direction for color */
  trendDirection?: 'up' | 'down' | 'neutral';
  /** Subtitle/description */
  subtitle?: string;
  /** Loading state */
  loading?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Custom background color */
  backgroundColor?: string;
  /** Value color */
  valueColor?: string;
  /** Value font size */
  valueSize?: 'small' | 'medium' | 'large';
}

const MetricCard = ({
  label,
  value,
  icon,
  iconColor = 'primary.main',
  trend,
  trendDirection = 'neutral',
  subtitle,
  loading = false,
  onClick,
  backgroundColor,
  valueColor = 'text.primary',
  valueSize = 'large'
}: MetricCardProps) => {
  // Value font sizes
  const valueFontSize = {
    small: '1.5rem',
    medium: '2rem',
    large: '2.5rem'
  }[valueSize];

  // Trend colors
  const trendColor = {
    up: 'success.main',
    down: 'error.main',
    neutral: 'text.secondary'
  }[trendDirection];

  if (loading) {
    return (
      <Box
        sx={{
          p: 2.5,
          bgcolor: backgroundColor || 'background.paper',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          height: '100%'
        }}
      >
        <Stack spacing={1.5}>
          <Skeleton variant="circular" width={48} height={48} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" height={40} />
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      onClick={onClick}
      sx={{
        p: 2.5,
        bgcolor: backgroundColor || 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick
          ? {
              borderColor: 'primary.main',
              boxShadow: 1,
              transform: 'translateY(-2px)'
            }
          : {}
      }}
    >
      <Stack spacing={1.5}>
        {/* Icon */}
        {icon && (
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 1.5,
              bgcolor: iconColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            {icon}
          </Box>
        )}

        {/* Label */}
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>

        {/* Value and Trend */}
        <Stack direction="row" alignItems="baseline" spacing={1}>
          <Typography
            variant="h3"
            color={valueColor}
            sx={{
              fontWeight: 600,
              fontSize: valueFontSize,
              lineHeight: 1
            }}
          >
            {value}
          </Typography>

          {trend && (
            <Typography variant="body2" color={trendColor} sx={{ fontWeight: 500 }}>
              {trend}
            </Typography>
          )}
        </Stack>

        {/* Subtitle */}
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default MetricCard;
