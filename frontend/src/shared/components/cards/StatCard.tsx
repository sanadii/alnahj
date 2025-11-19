/**
 * StatCard Component
 * Compact statistic card with gradient background and trend indicator
 *
 * @component StatCard
 * @description A beautiful, compact card for displaying key statistics with gradient backgrounds,
 * trend indicators, and optional click handlers. Perfect for dashboards and analytics views.
 *
 * @example
 * ```tsx
 * <StatCard
 *   icon={<IconUsers size={32} />}
 *   value="1,234"
 *   label="Total Users"
 *   gradient={StatCardGradients.primary}
 *   trend={{ value: "+12%", isPositive: true }}
 *   subtitle="vs last month"
 * />
 * ```
 */

import React from 'react';
import { Paper, Stack, Box, Typography, Chip, alpha, SxProps, Theme, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';

export interface StatCardProps {
  /** Icon to display in the card header */
  icon: React.ReactNode;
  /** Main statistic value (number or formatted string) */
  value: string | number;
  /** Label describing the statistic */
  label: string;
  /** CSS gradient background (use StatCardGradients presets or custom) */
  gradient: string;
  /** Optional trend indicator with value and direction */
  trend?: {
    value: string;
    isPositive: boolean;
  };
  /** Optional subtitle text (e.g., "vs last month") */
  subtitle?: string;
  /** Optional click handler to make card interactive */
  onClick?: () => void;
  /** Optional Material-UI sx prop for custom styling */
  sx?: SxProps<Theme>;
}

/**
 * StatCard Component
 *
 * Features:
 * - Beautiful gradient backgrounds
 * - Trend indicators with up/down arrows
 * - Hover effects with elevation
 * - Optional click handlers
 * - Fully customizable via sx prop
 * - Theme-aware typography
 */
const StatCard: React.FC<StatCardProps> = ({ icon, value, label, gradient, trend, subtitle, onClick, sx }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper
      onClick={onClick}
      sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        background: gradient,
        color: 'white',
        borderRadius: { xs: 1.5, sm: 2 },
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        boxShadow: { xs: 2, sm: 4 },
        '&:hover': {
          transform: onClick ? (isMobile ? 'scale(0.98)' : 'translateY(-4px)') : 'none',
          boxShadow: onClick ? (isMobile ? 3 : 6) : (isMobile ? 2 : 4)
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
          pointerEvents: 'none'
        },
        ...sx
      }}
    >
      <Stack spacing={{ xs: 0.75, sm: 1 }} sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 }, flex: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: 40, sm: 44, md: 48 },
                height: { xs: 40, sm: 44, md: 48 },
                borderRadius: { xs: 1.25, sm: 1.5 },
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                flexShrink: 0,
                '& svg': {
                  fontSize: { xs: 20, sm: 24, md: 28 }
                }
              }}
            >
              {icon}
            </Box>
            <Stack spacing={{ xs: 0.25, sm: 0.5 }} sx={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
              <Typography
                variant={isMobile ? 'h4' : 'h3'}
                fontWeight={700}
                sx={{
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                }}
              >
                {value}
              </Typography>
              <Typography
                variant={isMobile ? 'caption' : 'body2'}
                sx={{
                  color: alpha('#fff', 0.95),
                  fontWeight: 500,
                  letterSpacing: { xs: 0.25, sm: 0.5 },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: { xs: '0.7rem', sm: '0.875rem' }
                }}
              >
                {label}
              </Typography>
            </Stack>
          </Box>
          {trend && (
            <Chip
              icon={trend.isPositive ? <IconArrowUpRight size={isMobile ? 14 : 16} /> : <IconArrowDownRight size={isMobile ? 14 : 16} />}
              label={trend.value}
              size="small"
              sx={{
                bgcolor: trend.isPositive ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)',
                color: 'white',
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                flexShrink: 0,
                height: { xs: 20, sm: 24 },
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                '& .MuiChip-icon': {
                  color: 'white',
                  marginLeft: { xs: '4px', sm: '6px' }
                },
                '& .MuiChip-label': {
                  padding: { xs: '0 6px', sm: '0 8px' }
                }
              }}
            />
          )}
        </Box>

        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              color: alpha('#fff', 0.75),
              mt: { xs: 0.25, sm: 0.5 },
              fontSize: { xs: '0.65rem', sm: '0.75rem' }
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

export default StatCard;

/**
 * StatCard Gradient Presets
 *
 * Pre-defined beautiful gradient combinations for consistent design.
 * Use these for quick styling or create your own custom gradients.
 *
 * @example
 * ```tsx
 * <StatCard
 *   gradient={StatCardGradients.primary}
 *   // ... other props
 * />
 * ```
 */
export const StatCardGradients = {
  // Primary colors
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',

  // Status colors
  success: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  info: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  warning: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  error: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',

  // Theme colors
  purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  pink: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  blue: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  orange: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  green: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  teal: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  indigo: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
  coral: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  sunset: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
  ocean: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)'
} as const;
