/**
 * Committee Comparison Card
 * Side-by-side committee comparison with metrics
 */

import React from 'react';
import { Paper, Grid, Typography, Box, Stack, LinearProgress, Divider, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconUsers, IconUserCheck, IconCheckbox, IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';

interface Committee {
  id: number;
  code: string;
  name: string;
  electorCount: number;
  attendanceCount: number;
  voteCount: number;
  gender: 'MALE' | 'FEMALE' | 'MIXED';
}

interface CommitteeComparisonCardProps {
  committee1: Committee;
  committee2: Committee;
}

export const CommitteeComparisonCard: React.FC<CommitteeComparisonCardProps> = ({ committee1, committee2 }) => {
  const theme = useTheme();

  const calculateMetrics = (committee: Committee) => {
    const attendanceRate = committee.electorCount > 0 ? (committee.attendanceCount / committee.electorCount) * 100 : 0;
    const votingRate = committee.attendanceCount > 0 ? (committee.voteCount / committee.attendanceCount) * 100 : 0;
    const participationRate = committee.electorCount > 0 ? (committee.voteCount / committee.electorCount) * 100 : 0;
    return { attendanceRate, votingRate, participationRate };
  };

  const metrics1 = calculateMetrics(committee1);
  const metrics2 = calculateMetrics(committee2);

  const renderCommittee = (committee: Committee, metrics: ReturnType<typeof calculateMetrics>, position: 'left' | 'right') => {
    const isWinner = (metric: number, otherMetric: number) => metric > otherMetric;

    return (
      <Box>
        <Stack spacing={2}>
          {/* Header */}
          <Box sx={{ textAlign: position === 'left' ? 'left' : 'right' }}>
            <Chip
              label={committee.code}
              color={committee.gender === 'MALE' ? 'info' : committee.gender === 'FEMALE' ? 'secondary' : 'default'}
              sx={{ fontWeight: 700, mb: 1 }}
            />
            <Typography variant="h6" fontWeight={600}>
              {committee.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {committee.electorCount} electors
            </Typography>
          </Box>

          {/* Metrics */}
          <Stack spacing={1.5}>
            {/* Attendance */}
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconUserCheck size={16} color={theme.palette.info.main} />
                  <Typography variant="caption" fontWeight={600}>
                    Attendance
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography variant="body2" fontWeight={700}>
                    {metrics.attendanceRate.toFixed(1)}%
                  </Typography>
                  {isWinner(metrics.attendanceRate, position === 'left' ? metrics2.attendanceRate : metrics1.attendanceRate) && (
                    <IconTrendingUp size={14} color={theme.palette.success.main} />
                  )}
                </Stack>
              </Stack>
              <LinearProgress variant="determinate" value={metrics.attendanceRate} color="info" sx={{ height: 6, borderRadius: 1 }} />
            </Box>

            {/* Voting */}
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconCheckbox size={16} color={theme.palette.success.main} />
                  <Typography variant="caption" fontWeight={600}>
                    Voting Rate
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography variant="body2" fontWeight={700}>
                    {metrics.votingRate.toFixed(1)}%
                  </Typography>
                  {isWinner(metrics.votingRate, position === 'left' ? metrics2.votingRate : metrics1.votingRate) && (
                    <IconTrendingUp size={14} color={theme.palette.success.main} />
                  )}
                </Stack>
              </Stack>
              <LinearProgress variant="determinate" value={metrics.votingRate} color="success" sx={{ height: 6, borderRadius: 1 }} />
            </Box>

            {/* Participation */}
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconUsers size={16} color={theme.palette.primary.main} />
                  <Typography variant="caption" fontWeight={600}>
                    Participation
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography variant="body2" fontWeight={700}>
                    {metrics.participationRate.toFixed(1)}%
                  </Typography>
                  {isWinner(metrics.participationRate, position === 'left' ? metrics2.participationRate : metrics1.participationRate) && (
                    <IconTrendingUp size={14} color={theme.palette.success.main} />
                  )}
                </Stack>
              </Stack>
              <LinearProgress variant="determinate" value={metrics.participationRate} color="primary" sx={{ height: 6, borderRadius: 1 }} />
            </Box>
          </Stack>

          {/* Stats Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 1,
              bgcolor: 'background.default',
              p: 1.5,
              borderRadius: 1
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight={700} color="primary">
                {committee.electorCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Electors
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight={700} color="info.main">
                {committee.attendanceCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Present
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight={700} color="success.main">
                {committee.voteCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Voted
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>
    );
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Committee Comparison
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Side-by-side performance comparison
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>{renderCommittee(committee1, metrics1, 'left')}</Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <Stack
            sx={{
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Divider orientation="vertical" sx={{ height: '80%', display: { xs: 'none', md: 'block' } }} />
            <Divider sx={{ width: '80%', display: { xs: 'block', md: 'none' } }} />
            <Typography variant="h6" fontWeight={700} color="text.secondary" sx={{ my: 2 }}>
              VS
            </Typography>
            <Divider orientation="vertical" sx={{ height: '80%', display: { xs: 'none', md: 'block' } }} />
            <Divider sx={{ width: '80%', display: { xs: 'block', md: 'none' } }} />
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>{renderCommittee(committee2, metrics2, 'right')}</Grid>
      </Grid>
    </Paper>
  );
};

export default CommitteeComparisonCard;
