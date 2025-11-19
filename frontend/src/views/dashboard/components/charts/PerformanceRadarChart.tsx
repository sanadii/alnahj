/**
 * Performance Radar Chart
 * Multi-dimensional performance visualization
 */

import React, { useMemo } from 'react';
import { Paper, Typography, Box, Stack, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Chart from 'react-apexcharts';

interface PerformanceRadarChartProps {
  committee?: {
    code: string;
    name: string;
    metrics: {
      attendance: number;
      voting: number;
      engagement: number;
      efficiency: number;
      turnout: number;
    };
  };
  height?: number;
}

const defaultData = {
  code: 'C-101',
  name: 'Central Committee',
  metrics: {
    attendance: 85,
    voting: 92,
    engagement: 78,
    efficiency: 88,
    turnout: 80
  }
};

export const PerformanceRadarChart: React.FC<PerformanceRadarChartProps> = ({ committee, height = 350 }) => {
  const theme = useTheme();

  // Use default data if committee is not provided or is missing metrics
  const committeeData = committee?.metrics ? committee : defaultData;

  const series = useMemo(
    () => [
      {
        name: committeeData.code,
        data: [
          committeeData.metrics.attendance,
          committeeData.metrics.voting,
          committeeData.metrics.engagement,
          committeeData.metrics.efficiency,
          committeeData.metrics.turnout
        ]
      }
    ],
    [committeeData]
  );

  const chartOptions = useMemo(
    () => ({
      chart: {
        toolbar: {
          show: false
        },
        dropShadow: {
          enabled: true,
          blur: 1,
          left: 1,
          top: 1,
          opacity: 0.2
        }
      },
      colors: [theme.palette.primary.main],
      stroke: {
        width: 2
      },
      fill: {
        opacity: 0.2
      },
      markers: {
        size: 4,
        colors: [theme.palette.primary.main],
        strokeColors: theme.palette.background.paper,
        strokeWidth: 2,
        hover: {
          size: 6
        }
      },
      xaxis: {
        categories: ['Attendance', 'Voting Rate', 'Engagement', 'Efficiency', 'Turnout'],
        labels: {
          style: {
            colors: [
              theme.palette.text.secondary,
              theme.palette.text.secondary,
              theme.palette.text.secondary,
              theme.palette.text.secondary,
              theme.palette.text.secondary
            ],
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        max: 100,
        tickAmount: 5,
        labels: {
          formatter: (val: number) => `${val}%`,
          style: {
            colors: theme.palette.text.secondary
          }
        }
      },
      tooltip: {
        theme: theme.palette.mode,
        y: {
          formatter: (val: number) => `${val}%`
        }
      }
    }),
    [theme]
  );

  const averageScore = useMemo(() => {
    const values = Object.values(committeeData.metrics);
    return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
  }, [committeeData.metrics]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'success';
    if (score >= 70) return 'info';
    if (score >= 50) return 'warning';
    return 'error';
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack spacing={2}>
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h5" fontWeight={600}>
                Performance Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Multi-dimensional metrics
              </Typography>
            </Box>
            <Chip label={`Overall: ${averageScore}%`} color={getScoreColor(averageScore)} sx={{ fontWeight: 700, fontSize: '0.875rem' }} />
          </Stack>
        </Box>

        <Box sx={{ textAlign: 'center', py: 1 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {committeeData.code} - {committeeData.name}
          </Typography>
        </Box>

        <Box>
          <Chart options={chartOptions} series={series} type="radar" height={height} />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 1.5,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        >
          {Object.entries(committeeData.metrics).map(([key, value]) => (
            <Box key={key} sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight={700} color={getScoreColor(value)}>
                {value}%
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                {key}
              </Typography>
            </Box>
          ))}
        </Box>
      </Stack>
    </Paper>
  );
};

export default PerformanceRadarChart;
