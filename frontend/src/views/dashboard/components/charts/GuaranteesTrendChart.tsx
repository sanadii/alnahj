/**
 * Guarantees Trend Chart
 * Area chart showing guarantee collection over time by strength
 */

import React, { useMemo, useState } from 'react';
import { Paper, Typography, Box, Stack, ButtonGroup, Button, Chip, IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconDownload } from '@tabler/icons-react';
import Chart from 'react-apexcharts';
import { getAreaChartOptions } from 'utils/charts/chartDefaults';
import { exportChartAsPNG } from 'utils/charts/exportChart';
import { subDays } from 'date-fns';

interface GuaranteeTrendData {
  date: string;
  strong: number;
  medium: number;
  weak: number;
  total: number;
}

interface GuaranteesTrendChartProps {
  data: GuaranteeTrendData[];
  height?: number;
}

export const GuaranteesTrendChart: React.FC<GuaranteesTrendChartProps> = ({ data, height = 400 }) => {
  const theme = useTheme();
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // Filter data based on period
  const filteredData = useMemo(() => {
    if (period === 'all' || data.length === 0) return data;

    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const cutoffDate = subDays(new Date(), days);

    return data.filter((d) => new Date(d.date) >= cutoffDate);
  }, [data, period]);

  const chartOptions = useMemo(
    () => ({
      ...getAreaChartOptions(theme),
      chart: {
        ...getAreaChartOptions(theme).chart,
        type: 'area',
        stacked: true
      },
      colors: [theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main],
      xaxis: {
        type: 'datetime',
        categories: filteredData.map((d) => d.date),
        labels: {
          format: 'MMM dd',
          style: {
            colors: theme.palette.text.secondary
          }
        }
      },
      yaxis: {
        title: {
          text: 'Guarantees',
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
          format: 'dd MMM yyyy'
        }
      }
    }),
    [filteredData, theme]
  );

  const series = useMemo(
    () => [
      {
        name: 'Strong',
        data: filteredData.map((d) => d.strong)
      },
      {
        name: 'Medium',
        data: filteredData.map((d) => d.medium)
      },
      {
        name: 'Weak',
        data: filteredData.map((d) => d.weak)
      }
    ],
    [filteredData]
  );

  const latestData = filteredData[filteredData.length - 1];

  const handleExport = () => {
    exportChartAsPNG('guarantees-trend-chart', 'Guarantees-Trend');
  };

  if (data.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          No guarantees trend data available
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Guarantees Collection Trend
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Guarantee collection over time by strength level
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <ButtonGroup size="small">
            <Button variant={period === '7d' ? 'contained' : 'outlined'} onClick={() => setPeriod('7d')}>
              7D
            </Button>
            <Button variant={period === '30d' ? 'contained' : 'outlined'} onClick={() => setPeriod('30d')}>
              30D
            </Button>
            <Button variant={period === '90d' ? 'contained' : 'outlined'} onClick={() => setPeriod('90d')}>
              90D
            </Button>
            <Button variant={period === 'all' ? 'contained' : 'outlined'} onClick={() => setPeriod('all')}>
              ALL
            </Button>
          </ButtonGroup>
          <Tooltip title="Export as PNG">
            <IconButton size="small" onClick={handleExport}>
              <IconDownload size={20} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Quick Stats */}
      {latestData && (
        <Stack direction="row" spacing={2} sx={{ mb: 2 }} flexWrap="wrap">
          <Chip label={`Total: ${latestData.total}`} color="primary" />
          <Chip label={`Strong: ${latestData.strong}`} sx={{ bgcolor: 'success.main', color: 'white' }} />
          <Chip label={`Medium: ${latestData.medium}`} sx={{ bgcolor: 'warning.main', color: 'white' }} />
          <Chip label={`Weak: ${latestData.weak}`} sx={{ bgcolor: 'error.main', color: 'white' }} />
        </Stack>
      )}

      <Box id="guarantees-trend-chart">
        <Chart options={chartOptions} series={series} type="area" height={height} />
      </Box>
    </Paper>
  );
};

export default GuaranteesTrendChart;
