/**
 * Hourly Attendance Chart
 * Column chart showing attendance by hour
 */

import React, { useMemo } from 'react';
import { Paper, Typography, Box, Stack, Chip, IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconDownload, IconClock } from '@tabler/icons-react';
import Chart from 'react-apexcharts';
import { getBarChartOptions } from 'utils/charts/chartDefaults';
import { exportChartAsPNG } from 'utils/charts/exportChart';

interface HourlyData {
  hour: string; // "08:00", "09:00", etc.
  count: number;
  cumulative: number;
}

interface HourlyAttendanceChartProps {
  data: HourlyData[];
  height?: number;
}

export const HourlyAttendanceChart: React.FC<HourlyAttendanceChartProps> = ({ data, height = 400 }) => {
  const theme = useTheme();

  const peakHour = useMemo(() => {
    if (data.length === 0) return null;
    return data.reduce((max, current) => (current.count > max.count ? current : max));
  }, [data]);

  const totalToday = useMemo(() => {
    return data.reduce((sum, d) => sum + d.count, 0);
  }, [data]);

  const chartOptions = useMemo(
    () => ({
      ...getBarChartOptions(theme),
      chart: {
        ...getBarChartOptions(theme).chart,
        type: 'bar'
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          dataLabels: {
            position: 'top'
          },
          columnWidth: '60%'
        }
      },
      colors: [theme.palette.primary.main],
      dataLabels: {
        enabled: true,
        formatter: (val: number) => (val > 0 ? `${val}` : ''),
        offsetY: -20,
        style: {
          fontSize: '12px',
          fontWeight: 600,
          colors: [theme.palette.text.primary]
        }
      },
      xaxis: {
        categories: data.map((d) => d.hour),
        labels: {
          style: {
            colors: theme.palette.text.secondary
          }
        },
        title: {
          text: 'Hour',
          style: {
            color: theme.palette.text.primary,
            fontWeight: 600
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
      tooltip: {
        theme: theme.palette.mode,
        y: {
          formatter: (val: number, { dataPointIndex }: any) => {
            const cumulative = data[dataPointIndex]?.cumulative || 0;
            return `${val} attendees (Cumulative: ${cumulative})`;
          }
        }
      }
    }),
    [data, theme]
  );

  const series = useMemo(
    () => [
      {
        name: 'Attendance',
        data: data.map((d) => d.count)
      }
    ],
    [data]
  );

  const handleExport = () => {
    exportChartAsPNG('hourly-attendance-chart', 'Hourly-Attendance');
  };

  if (data.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          No hourly data available yet
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Hourly Attendance Breakdown
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Attendance distribution throughout the day
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          {peakHour && (
            <Chip icon={<IconClock size={14} />} label={`Peak: ${peakHour.hour} (${peakHour.count})`} size="small" color="primary" />
          )}
          <Chip label={`Total: ${totalToday}`} size="small" variant="outlined" />
          <Tooltip title="Export as PNG">
            <IconButton size="small" onClick={handleExport}>
              <IconDownload size={20} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      <Box id="hourly-attendance-chart" sx={{ mt: 2 }}>
        <Chart options={chartOptions} series={series} type="bar" height={height} />
      </Box>
    </Paper>
  );
};

export default HourlyAttendanceChart;
