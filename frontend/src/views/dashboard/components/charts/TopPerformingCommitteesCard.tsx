/**
 * Top Performing Committees Card
 * Inspired by Berry's PopularCard - Shows top committees with performance indicators
 */

import React, { useMemo } from 'react';
import { Avatar, Button, CardActions, CardContent, Divider, Grid, Typography, Stack, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconTrendingUp, IconTrendingDown, IconChevronRight, IconAward } from '@tabler/icons-react';
import { Paper } from '@mui/material';

interface Committee {
  id: number;
  code: string;
  name: string;
  electorCount: number;
  attendanceCount: number;
  voteCount: number;
  gender: 'MALE' | 'FEMALE' | 'MIXED';
}

interface TopPerformingCommitteesCardProps {
  committees: Committee[];
  onViewAll?: () => void;
}

export const TopPerformingCommitteesCard: React.FC<TopPerformingCommitteesCardProps> = ({ committees, onViewAll }) => {
  const theme = useTheme();

  // Calculate performance metrics and get top 5
  const topCommittees = useMemo(() => {
    return committees
      .map((committee) => {
        const attendanceRate = committee.electorCount > 0 ? (committee.attendanceCount / committee.electorCount) * 100 : 0;
        const votingRate = committee.attendanceCount > 0 ? (committee.voteCount / committee.attendanceCount) * 100 : 0;
        const performanceScore = (attendanceRate * 0.6 + votingRate * 0.4) / 100; // 0-1 scale

        return {
          ...committee,
          attendanceRate,
          votingRate,
          performanceScore
        };
      })
      .sort((a, b) => b.performanceScore - a.performanceScore)
      .slice(0, 5);
  }, [committees]);

  const averagePerformance = useMemo(() => {
    if (topCommittees.length === 0) return 0;
    return topCommittees.reduce((sum, c) => sum + c.performanceScore, 0) / topCommittees.length;
  }, [topCommittees]);

  const getPerformanceColor = (score: number) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'info';
    if (score >= 0.4) return 'warning';
    return 'error';
  };

  const isAboveAverage = (score: number) => score > averagePerformance;

  if (topCommittees.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          No committee data available
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" fontWeight={600}>
                Top Performing Committees
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <IconAward size={20} color={theme.palette.primary.main} />
                <Typography variant="body2" color="text.secondary">
                  By participation rate
                </Typography>
              </Stack>
            </Stack>
          </Grid>

          <Grid size={12}>
            {topCommittees.map((committee, index) => {
              const performanceColor = getPerformanceColor(committee.performanceScore);
              const isTop = isAboveAverage(committee.performanceScore);

              return (
                <Box key={committee.id}>
                  <Grid container direction="column">
                    <Grid>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Typography
                            variant="h6"
                            sx={{
                              width: 24,
                              height: 24,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: index < 3 ? `${performanceColor}.lighter` : 'background.default',
                              color: index < 3 ? `${performanceColor}.dark` : 'text.secondary',
                              borderRadius: 1,
                              fontSize: '0.875rem',
                              fontWeight: 700
                            }}
                          >
                            {index + 1}
                          </Typography>
                          <Box>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="subtitle1" fontWeight={600}>
                                {committee.code}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {committee.name}
                              </Typography>
                            </Stack>
                          </Box>
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="subtitle1" fontWeight={600}>
                            {(committee.performanceScore * 100).toFixed(1)}%
                          </Typography>
                          <Avatar
                            variant="rounded"
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '5px',
                              bgcolor: isTop ? 'success.lighter' : 'error.lighter',
                              color: isTop ? 'success.dark' : 'error.dark'
                            }}
                          >
                            {isTop ? <IconTrendingUp size={14} /> : <IconTrendingDown size={14} />}
                          </Avatar>
                        </Stack>
                      </Stack>
                    </Grid>

                    <Grid>
                      <Stack direction="row" spacing={2} sx={{ mt: 0.5, ml: 4 }}>
                        <Typography variant="caption" color="text.secondary">
                          <strong>Attendance:</strong> {committee.attendanceRate.toFixed(1)}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          <strong>Voting:</strong> {committee.votingRate.toFixed(1)}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          <strong>Electors:</strong> {committee.electorCount}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>

                  {index < topCommittees.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
              );
            })}
          </Grid>
        </Grid>
      </CardContent>

      {onViewAll && (
        <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
          <Button size="small" onClick={onViewAll} endIcon={<IconChevronRight size={16} />}>
            View All Committees
          </Button>
        </CardActions>
      )}
    </Paper>
  );
};

export default TopPerformingCommitteesCard;
