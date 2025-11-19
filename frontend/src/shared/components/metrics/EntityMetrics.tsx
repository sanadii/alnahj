import React from 'react';
import { Grid, Box, Typography, Button, useTheme, alpha } from '@mui/material';

export interface MetricItem {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  sublabel?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'contained' | 'outlined' | 'text';
  };
}

interface EntityMetricsProps {
  metrics: MetricItem[];
  columns?: { xs?: number; sm?: number; md?: number; lg?: number };
}

/**
 * Reusable metrics display component
 * Can be used to show key statistics for any entity
 *
 * @example
 * ```typescript
 * <EntityMetrics
 *   metrics={[
 *     { label: "Total Orders", value: 45, icon: <IconShoppingCart />, color: "primary" },
 *     { label: "Revenue", value: "$12,450", icon: <IconCurrencyDollar />, color: "success" },
 *     { label: "Last Visit", value: "2 days ago", sublabel: "Oct 7, 2025" }
 *   ]}
 *   columns={{ xs: 12, sm: 6, md: 4, lg: 3 }}
 * />
 * ```
 */
const EntityMetrics: React.FC<EntityMetricsProps> = ({ metrics, columns = { xs: 12, sm: 6, md: 4, lg: 3 } }) => {
  const theme = useTheme();

  const getColorValue = (color?: string) => {
    if (!color) return theme.palette.primary.main;
    return theme.palette[color as keyof typeof theme.palette]?.main || theme.palette.primary.main;
  };

  return (
    <Grid container spacing={2}>
      {metrics.map((metric, index) => {
        const colorValue = getColorValue(metric.color);

        return (
          <Grid size={columns} key={index}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                border: `1px solid ${alpha(colorValue, 0.15)}`,
                background: `linear-gradient(135deg, ${alpha(colorValue, 0.08)} 0%, ${alpha(theme.palette[metric.color || 'primary']?.light || colorValue, 0.05)} 100%)`,
                height: '100%',
                boxShadow: theme.shadows[3],
                transition: theme.transitions.create(['transform', 'boxShadow'], {
                  duration: theme.transitions.duration.short
                }),
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[6]
                }
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Top Row: Icon + Value/Label + Action */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  {/* Icon */}
                  {metric.icon && (
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${colorValue} 0%, ${theme.palette[metric.color || 'primary']?.dark || colorValue} 100%)`,
                        color: 'white',
                        boxShadow: theme.shadows[4],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {metric.icon}
                    </Box>
                  )}

                  {/* Value + Label */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h3" fontWeight={700} color={`${metric.color || 'primary'}.main`}>
                      {metric.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {metric.label}
                    </Typography>
                  </Box>

                  {/* Action Button */}
                  {metric.action && (
                    <Box>
                      <Button
                        size="small"
                        variant={metric.action.variant || 'outlined'}
                        onClick={(e) => {
                          e.stopPropagation();
                          metric.action!.onClick();
                        }}
                        sx={{
                          minWidth: 'auto',
                          px: 1.5,
                          py: 0.5,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          borderColor: colorValue,
                          color: colorValue,
                          '&:hover': {
                            borderColor: theme.palette[metric.color || 'primary']?.dark || colorValue,
                            backgroundColor: alpha(colorValue, 0.04)
                          }
                        }}
                      >
                        {metric.action.label}
                      </Button>
                    </Box>
                  )}
                </Box>

                {/* Sublabel */}
                {metric.sublabel && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {metric.sublabel}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default EntityMetrics;
