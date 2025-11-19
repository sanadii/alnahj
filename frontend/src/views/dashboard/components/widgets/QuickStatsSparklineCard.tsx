/**
 * Quick Stats Sparkline Card
 * Inspired by Berry's BajajAreaChartCard - Compact sparkline visualization
 */

import React, { useMemo } from 'react';
import { Card, Grid, Typography, Box, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Chart from 'react-apexcharts';

interface QuickStatsSparklineCardProps {
  title: string;
  value: string | number;
  trend: 'up' | 'down';
  percentage: number;
  sparklineData: number[];
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

export const QuickStatsSparklineCard: React.FC<QuickStatsSparklineCardProps> = ({
  title,
  value,
  trend,
  percentage,
  sparklineData,
  color = 'primary'
}) => {
  const theme = useTheme();

  const chartColor = useMemo(() => {
    switch (color) {
      case 'secondary':
        return theme.palette.secondary.main;
      case 'success':
        return theme.palette.success.main;
      case 'error':
        return theme.palette.error.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'info':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  }, [color, theme]);

  const chartOptions = useMemo(
    () => ({
      chart: {
        sparkline: {
          enabled: true
        },
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth' as const,
        width: 2
      },
      colors: [chartColor],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.5,
          gradientToColors: [chartColor],
          inverseColors: false,
          opacityFrom: 0.6,
          opacityTo: 0.1,
          stops: [0, 100]
        }
      },
      tooltip: {
        theme: theme.palette.mode,
        fixed: {
          enabled: false
        },
        x: {
          show: false
        },
        y: {
          title: {
            formatter: () => ''
          }
        },
        marker: {
          show: false
        }
      }
    }),
    [chartColor, theme.palette.mode]
  );

  const series = [
    {
      name: title,
      data: sparklineData
    }
  ];

  return (
    <Card
      sx={{
        bgcolor: `${color}.lighter`,
        border: '1px solid',
        borderColor: `${color}.light`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
          borderColor: `${color}.main`
        }
      }}
    >
      <Grid container sx={{ p: 2.5 }}>
        <Grid size={12}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid>
              <Typography variant="subtitle2" color={`${color}.dark`}>
                {title}
              </Typography>
            </Grid>
            <Grid>
              <Chip
                label={`${trend === 'up' ? '↑' : '↓'} ${percentage}%`}
                size="small"
                sx={{
                  bgcolor: trend === 'up' ? 'success.main' : 'error.main',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.75rem'
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12} sx={{ mt: 1 }}>
          <Typography variant="h4" fontWeight={700} color={`${color}.dark`}>
            {value}
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ mt: -2 }}>
        <Chart options={chartOptions} series={series} type="area" height={80} />
      </Box>
    </Card>
  );
};

export default QuickStatsSparklineCard;
