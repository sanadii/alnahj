/**
 * Committee Performance Chart
 * Grouped bar chart comparing committees across multiple metrics
 */

import React, { useMemo, useState } from 'react';
import { Paper, Typography, Box, Stack, Chip, ToggleButtonGroup, ToggleButton, IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconDownload } from '@tabler/icons-react';
import Chart from 'react-apexcharts';
import { getBarChartOptions } from 'utils/charts/chartDefaults';
import { exportChartAsPNG } from 'utils/charts/exportChart';

interface Committee {
  id: number;
  code: string;
  name: string;
  electorCount: number;
  attendanceCount: number;
  voteCount: number;
  gender: 'MALE' | 'FEMALE' | 'MIXED';
}

interface CommitteePerformanceChartProps {
  committees: Committee[];
  height?: number;
}

export const CommitteePerformanceChart: React.FC<CommitteePerformanceChartProps> = ({ committees, height = 400 }) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState<'grouped' | 'stacked'>('grouped');

  const chartOptions = useMemo(
    () => ({
      ...getBarChartOptions(theme),
      chart: {
        ...getBarChartOptions(theme).chart,
        type: 'bar',
        stacked: chartType === 'stacked'
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 8,
          columnWidth: '70%'
        }
      },
      colors: [theme.palette.primary.main, theme.palette.info.main, theme.palette.success.main],
      xaxis: {
        categories: committees.map((c) => c.code),
        labels: {
          style: {
            colors: theme.palette.text.secondary
          }
        }
      },
      yaxis: {
        title: {
          text: 'Count',
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
        horizontalAlign: 'right',
        labels: {
          colors: theme.palette.text.primary
        }
      },
      tooltip: {
        theme: theme.palette.mode,
        y: {
          formatter: (val: number) => `${val} electors`
        }
      }
    }),
    [committees, chartType, theme]
  );

  const series = useMemo(
    () => [
      {
        name: 'Total Electors',
        data: committees.map((c) => c.electorCount)
      },
      {
        name: 'Attendance',
        data: committees.map((c) => c.attendanceCount)
      },
      {
        name: 'Votes',
        data: committees.map((c) => c.voteCount)
      }
    ],
    [committees]
  );

  const handleExport = () => {
    exportChartAsPNG('committee-performance-chart', 'Committee-Performance');
  };

  if (committees.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          No committees data available
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Committee Performance Comparison
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Electors, attendance, and votes by committee
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <ToggleButtonGroup value={chartType} exclusive onChange={(e, newType) => newType && setChartType(newType)} size="small">
            <ToggleButton value="grouped">Grouped</ToggleButton>
            <ToggleButton value="stacked">Stacked</ToggleButton>
          </ToggleButtonGroup>
          <Tooltip title="Export as PNG">
            <IconButton size="small" onClick={handleExport}>
              <IconDownload size={20} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      <Box id="committee-performance-chart">
        <Chart options={chartOptions} series={series} type="bar" height={height} />
      </Box>
    </Paper>
  );
};

export default CommitteePerformanceChart;
