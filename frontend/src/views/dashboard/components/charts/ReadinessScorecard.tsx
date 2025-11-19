/**
 * Readiness Scorecard
 * Visual scorecard showing election readiness metrics
 */

import React, { useMemo } from 'react';
import { Paper, Typography, Box, Stack, Grid, LinearProgress, Chip } from '@mui/material';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { useTheme } from '@mui/material/styles';
import Chart from 'react-apexcharts';
import { getRadialBarOptions } from 'utils/charts/chartDefaults';

interface ReadinessMetric {
  label: string;
  current: number;
  target: number;
  weight: number; // 0-1 for overall score
}

interface ReadinessScorecardProps {
  partiesConfigured: number;
  totalPartiesNeeded: number;
  candidatesAssigned: number;
  totalCandidatesNeeded: number;
  committeesSetup: number;
  totalCommitteesNeeded: number;
  electorsImported: number;
  totalElectorsExpected: number;
}

export const ReadinessScorecard: React.FC<ReadinessScorecardProps> = ({
  partiesConfigured,
  totalPartiesNeeded,
  candidatesAssigned,
  totalCandidatesNeeded,
  committeesSetup,
  totalCommitteesNeeded,
  electorsImported,
  totalElectorsExpected
}) => {
  const theme = useTheme();

  const metrics: ReadinessMetric[] = useMemo(
    () => [
      {
        label: 'Parties Configured',
        current: partiesConfigured,
        target: totalPartiesNeeded,
        weight: 0.2
      },
      {
        label: 'Candidates Assigned',
        current: candidatesAssigned,
        target: totalCandidatesNeeded,
        weight: 0.25
      },
      {
        label: 'Committees Setup',
        current: committeesSetup,
        target: totalCommitteesNeeded,
        weight: 0.25
      },
      {
        label: 'Electors Imported',
        current: electorsImported,
        target: totalElectorsExpected,
        weight: 0.3
      }
    ],
    [
      partiesConfigured,
      totalPartiesNeeded,
      candidatesAssigned,
      totalCandidatesNeeded,
      committeesSetup,
      totalCommitteesNeeded,
      electorsImported,
      totalElectorsExpected
    ]
  );

  const overallScore = useMemo(() => {
    const weightedSum = metrics.reduce((sum, metric) => {
      const percentage = metric.target > 0 ? (metric.current / metric.target) * 100 : 0;
      return sum + percentage * metric.weight;
    }, 0);
    return Math.min(100, Math.round(weightedSum));
  }, [metrics]);

  const chartOptions = useMemo(
    () => ({
      ...getRadialBarOptions(theme),
      plotOptions: {
        radialBar: {
          hollow: {
            size: '65%'
          },
          track: {
            background: theme.palette.grey[300]
          },
          dataLabels: {
            show: true,
            name: {
              show: true,
              fontSize: '16px',
              fontWeight: 600,
              color: theme.palette.text.primary,
              offsetY: -10
            },
            value: {
              show: true,
              fontSize: '36px',
              fontWeight: 700,
              color: theme.palette.text.primary,
              offsetY: 10,
              formatter: (val: number) => `${val}%`
            }
          }
        }
      },
      labels: ['Readiness'],
      colors: [
        overallScore >= 90
          ? theme.palette.success.main
          : overallScore >= 70
            ? theme.palette.info.main
            : overallScore >= 50
              ? theme.palette.warning.main
              : theme.palette.error.main
      ]
    }),
    [theme, overallScore]
  );

  const series = [overallScore];

  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return 'success';
    if (percentage >= 75) return 'info';
    if (percentage >= 50) return 'warning';
    return 'error';
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Election Readiness Scorecard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configuration completeness and setup progress
      </Typography>

      <Grid container spacing={3}>
        {/* Radial Score */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Chart options={chartOptions} series={series} type="radialBar" height={250} />
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
              {overallScore >= 90 ? (
                <Chip icon={<IconCheck size={16} />} label="Ready for Election" color="success" />
              ) : (
                <Chip icon={<IconAlertCircle size={16} />} label="Setup in Progress" color="warning" />
              )}
            </Stack>
          </Box>
        </Grid>

        {/* Metrics Breakdown */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={2.5}>
            {metrics.map((metric) => {
              const percentage = metric.target > 0 ? (metric.current / metric.target) * 100 : 0;
              const statusColor = getStatusColor(percentage);
              const isComplete = percentage >= 100;

              return (
                <Box key={metric.label}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {isComplete && <IconCheck size={18} color={theme.palette.success.main} />}
                      <Typography variant="body2" fontWeight={600}>
                        {metric.label}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {metric.current} / {metric.target}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, percentage)}
                    color={statusColor}
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {percentage.toFixed(1)}% complete
                    </Typography>
                    {!isComplete && metric.target > metric.current && (
                      <Typography variant="caption" color="text.secondary">
                        {metric.target - metric.current} remaining
                      </Typography>
                    )}
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ReadinessScorecard;
