/**
 * Gender Distribution Chart
 * Pie chart showing male vs female elector distribution
 */

import React, { useMemo } from 'react';
import { Paper, Typography, Box, Stack, Chip, IconButton, Tooltip, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconDownload } from '@tabler/icons-react';
import Chart from 'react-apexcharts';
import { getPieChartOptions } from 'utils/charts/chartDefaults';
import { exportChartAsPNG } from 'utils/charts/exportChart';

interface GenderDistributionChartProps {
  maleCount: number;
  femaleCount: number;
  height?: number;
}

export const GenderDistributionChart: React.FC<GenderDistributionChartProps> = ({ maleCount, femaleCount, height = 350 }) => {
  const theme = useTheme();

  const total = maleCount + femaleCount;
  const malePercentage = total > 0 ? ((maleCount / total) * 100).toFixed(1) : '0';
  const femalePercentage = total > 0 ? ((femaleCount / total) * 100).toFixed(1) : '0';

  const chartOptions = useMemo(
    () => ({
      ...getPieChartOptions(theme),
      labels: ['Male', 'Female'],
      colors: [theme.palette.info.main, theme.palette.secondary.main],
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '18px',
                fontWeight: 600,
                color: theme.palette.text.primary
              },
              value: {
                show: true,
                fontSize: '28px',
                fontWeight: 700,
                color: theme.palette.text.primary,
                formatter: (val: string) => val
              },
              total: {
                show: true,
                label: 'Total Electors',
                fontSize: '14px',
                fontWeight: 600,
                color: theme.palette.text.secondary,
                formatter: () => total.toLocaleString()
              }
            }
          }
        }
      },
      tooltip: {
        theme: theme.palette.mode,
        y: {
          formatter: (val: number) => {
            const percentage = total > 0 ? ((val / total) * 100).toFixed(1) : '0';
            return `${val.toLocaleString()} electors (${percentage}%)`;
          }
        }
      }
    }),
    [maleCount, femaleCount, total, theme]
  );

  const series = useMemo(() => [maleCount, femaleCount], [maleCount, femaleCount]);

  const handleExport = () => {
    exportChartAsPNG('gender-distribution-chart', 'Gender-Distribution');
  };

  if (total === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          No elector data available
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Gender Distribution
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Male vs Female elector breakdown
          </Typography>
        </Box>
        <Tooltip title="Export as PNG">
          <IconButton size="small" onClick={handleExport}>
            <IconDownload size={20} />
          </IconButton>
        </Tooltip>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
            <Typography variant="body2" color="info.dark" fontWeight={600}>
              Male Electors
            </Typography>
            <Typography variant="h4" color="info.dark" fontWeight={700}>
              {maleCount.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="info.dark">
              {malePercentage}% of total
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ p: 2, bgcolor: 'secondary.lighter', borderRadius: 1 }}>
            <Typography variant="body2" color="secondary.dark" fontWeight={600}>
              Female Electors
            </Typography>
            <Typography variant="h4" color="secondary.dark" fontWeight={700}>
              {femaleCount.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="secondary.dark">
              {femalePercentage}% of total
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box id="gender-distribution-chart">
        <Chart options={chartOptions} series={series} type="donut" height={height} />
      </Box>
    </Paper>
  );
};

export default GenderDistributionChart;
