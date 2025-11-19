/**
 * Attendance Timeline Chart
 * Real-time line chart showing attendance progression
 */

import React, { useMemo } from 'react';
import { Paper, Typography, Box, Stack, Chip, IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconDownload, IconRefresh } from '@tabler/icons-react';
import Chart from 'react-apexcharts';
import { getLineChartOptions } from 'utils/charts/chartDefaults';
import { exportChartAsPNG } from 'utils/charts/exportChart';

interface AttendanceDataPoint {
  time: string;
  maleAttendance: number;
  femaleAttendance: number;
  totalAttendance: number;
}

interface AttendanceTimelineChartProps {
  data: AttendanceDataPoint[];
  target: number;
  height?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const AttendanceTimelineChart: React.FC<AttendanceTimelineChartProps> = ({
  data,
  target,
  height = 400,
  autoRefresh = false,
  refreshInterval = 30
}) => {
  const theme = useTheme();

  const chartOptions = useMemo(
    () => ({
      ...getLineChartOptions(theme),
      chart: {
        ...getLineChartOptions(theme).chart,
        type: 'line',
        zoom: {
          enabled: true
        }
      },
      colors: [theme.palette.primary.main, theme.palette.info.main, theme.palette.secondary.main],
      stroke: {
        curve: 'smooth',
        width: [3, 2, 2]
      },
      xaxis: {
        type: 'datetime',
        categories: data.map((d) => d.time),
        labels: {
          format: 'HH:mm',
          style: {
            colors: theme.palette.text.secondary
          }
        }
      },
      yaxis: {
        title: {
          text: 'Attendance Count',
          style: {
            color: theme.palette.text.primary,
            fontWeight: 600
          }
        },
        labels: {
          style: {
            colors: theme.palette.text.secondary
          }
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        labels: {
          colors: theme.palette.text.primary
        }
      },
      tooltip: {
        theme: theme.palette.mode,
        x: {
          format: 'HH:mm'
        }
      },
      annotations: {
        yaxis: [
          {
            y: target,
            borderColor: theme.palette.error.main,
            strokeDashArray: 5,
            label: {
              text: `Target: ${target}`,
              style: {
                color: '#fff',
                background: theme.palette.error.main
              }
            }
          }
        ]
      }
    }),
    [data, target, theme]
  );

  const series = useMemo(
    () => [
      {
        name: 'Total Attendance',
        data: data.map((d) => d.totalAttendance)
      },
      {
        name: 'Male Committees',
        data: data.map((d) => d.maleAttendance)
      },
      {
        name: 'Female Committees',
        data: data.map((d) => d.femaleAttendance)
      }
    ],
    [data]
  );

  const currentTotal = data[data.length - 1]?.totalAttendance || 0;
  const progressToTarget = target > 0 ? Math.round((currentTotal / target) * 100) : 0;

  const handleExport = () => {
    exportChartAsPNG('attendance-timeline-chart', 'Attendance-Timeline');
  };

  if (data.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          No attendance timeline data available
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Live Attendance Timeline
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time attendance tracking by gender
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={`${progressToTarget}% of Target`}
            color={progressToTarget >= 100 ? 'success' : progressToTarget >= 75 ? 'warning' : 'error'}
            size="small"
          />
          {autoRefresh && (
            <Chip icon={<IconRefresh size={14} />} label={`Refreshes every ${refreshInterval}s`} size="small" variant="outlined" />
          )}
          <Tooltip title="Export as PNG">
            <IconButton size="small" onClick={handleExport}>
              <IconDownload size={20} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      <Box id="attendance-timeline-chart" sx={{ mt: 2 }}>
        <Chart options={chartOptions} series={series} type="line" height={height} />
      </Box>
    </Paper>
  );
};

export default AttendanceTimelineChart;
