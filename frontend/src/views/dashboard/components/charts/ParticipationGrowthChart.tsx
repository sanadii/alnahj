/**
 * Participation Growth Chart
 * Inspired by Berry's TotalGrowthBarChart - Shows election participation trends
 */

import React, { useState, useMemo } from 'react';
import { Paper, Grid, Typography, MenuItem, TextField, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Chart from 'react-apexcharts';
import { getBarChartOptions } from 'utils/charts/chartDefaults';

interface ParticipationGrowthChartProps {
  data?: {
    daily?: number[];
    weekly?: number[];
    monthly?: number[];
  };
  height?: number;
}

const defaultData = {
  daily: [45, 52, 38, 45, 48, 60, 42, 38, 55, 48, 52, 58],
  weekly: [180, 200, 165, 190, 195, 220, 175],
  monthly: [650, 750, 680, 720, 780, 850]
};

const periods = [
  { value: 'daily', label: 'Last 12 Hours' },
  { value: 'weekly', label: 'Last 7 Days' },
  { value: 'monthly', label: 'Last 6 Months' }
];

export const ParticipationGrowthChart: React.FC<ParticipationGrowthChartProps> = ({ data = defaultData, height = 400 }) => {
  const theme = useTheme();
  const [period, setPeriod] = useState('daily');

  const series = useMemo(() => {
    const periodData = data[period as keyof typeof data] || defaultData.daily;

    return [
      {
        name: 'Attendance',
        data: periodData.map((v) => Math.round(v * 0.85))
      },
      {
        name: 'Votes Cast',
        data: periodData.map((v) => Math.round(v * 0.7))
      },
      {
        name: 'Guarantees',
        data: periodData.map((v) => Math.round(v * 0.45))
      }
    ];
  }, [data, period]);

  const categories = useMemo(() => {
    if (period === 'daily') return ['1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', '11h', '12h'];
    if (period === 'weekly') return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  }, [period]);

  const totalGrowth = useMemo(() => {
    const periodData = data[period as keyof typeof data] || defaultData.daily;
    return periodData.reduce((sum, val) => sum + val, 0);
  }, [data, period]);

  const chartOptions = useMemo(
    () => ({
      ...getBarChartOptions(theme),
      chart: {
        ...getBarChartOptions(theme).chart,
        type: 'bar',
        stacked: false
      },
      colors: [theme.palette.primary.main, theme.palette.info.main, theme.palette.success.main],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 4
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories,
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
        show: true,
        position: 'top',
        horizontalAlign: 'right',
        labels: {
          colors: theme.palette.text.secondary
        }
      },
      tooltip: {
        theme: theme.palette.mode,
        y: {
          formatter: (val: number) => `${val} participants`
        }
      }
    }),
    [theme, categories]
  );

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Participation Growth
              </Typography>
              <Typography variant="h3" fontWeight={700} color="primary">
                {totalGrowth.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total in selected period
              </Typography>
            </Grid>
            <Grid>
              <TextField select value={period} onChange={(e) => setPeriod(e.target.value)} size="small" sx={{ minWidth: 150 }}>
                {periods.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12}>
          <Box sx={{ mt: 2 }}>
            <Chart options={chartOptions} series={series} type="bar" height={height} />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ParticipationGrowthChart;
