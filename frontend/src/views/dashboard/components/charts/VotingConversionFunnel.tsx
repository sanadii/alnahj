/**
 * Voting Conversion Funnel
 * Shows the conversion from attendance to voting
 */

import React, { useMemo } from 'react';
import { Paper, Typography, Box, Stack, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface VotingConversionFunnelProps {
  totalElectors: number;
  totalAttendance: number;
  totalVotes: number;
  height?: number;
}

export const VotingConversionFunnel: React.FC<VotingConversionFunnelProps> = ({
  totalElectors,
  totalAttendance,
  totalVotes,
  height = 400
}) => {
  const theme = useTheme();

  const stages = useMemo(() => {
    const attendanceRate = totalElectors > 0 ? (totalAttendance / totalElectors) * 100 : 0;
    const votingRate = totalAttendance > 0 ? (totalVotes / totalAttendance) * 100 : 0;
    const overallRate = totalElectors > 0 ? (totalVotes / totalElectors) * 100 : 0;

    return [
      {
        name: 'Total Electors',
        count: totalElectors,
        percentage: 100,
        width: 100,
        color: theme.palette.grey[400],
        dropOff: 0
      },
      {
        name: 'Attended',
        count: totalAttendance,
        percentage: attendanceRate,
        width: attendanceRate,
        color: theme.palette.info.main,
        dropOff: totalElectors - totalAttendance
      },
      {
        name: 'Voted',
        count: totalVotes,
        percentage: votingRate,
        width: (totalVotes / totalElectors) * 100,
        color: theme.palette.success.main,
        dropOff: totalAttendance - totalVotes
      }
    ];
  }, [totalElectors, totalAttendance, totalVotes, theme]);

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Voting Conversion Funnel
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Track elector journey from registration to voting
      </Typography>

      <Box sx={{ py: 2 }}>
        <Stack spacing={2}>
          {stages.map((stage, index) => (
            <Box key={stage.name}>
              {/* Stage Bar */}
              <Box
                sx={{
                  width: `${stage.width}%`,
                  mx: 'auto',
                  bgcolor: stage.color,
                  p: 2,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scaleY(1.05)',
                    boxShadow: 2
                  }
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" fontWeight={700} color="white">
                    {stage.name}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h6" fontWeight={700} color="white">
                      {stage.count.toLocaleString()}
                    </Typography>
                    {index > 0 && (
                      <Chip
                        label={`${stage.percentage.toFixed(1)}%`}
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: 'white' }}
                      />
                    )}
                  </Stack>
                </Stack>
              </Box>

              {/* Drop-off Indicator */}
              {index < stages.length - 1 && stage.dropOff > 0 && (
                <Box sx={{ textAlign: 'center', py: 1 }}>
                  <Chip
                    label={`↓ ${stage.dropOff.toLocaleString()} drop-off (${((stage.dropOff / stage.count) * 100).toFixed(1)}%)`}
                    size="small"
                    color="error"
                    variant="outlined"
                  />
                </Box>
              )}
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Summary Stats */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
        <Stack direction="row" spacing={3} justifyContent="space-around">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={700} color="info.main">
              {totalElectors > 0 ? ((totalAttendance / totalElectors) * 100).toFixed(1) : 0}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Attendance Rate
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={700} color="success.main">
              {totalAttendance > 0 ? ((totalVotes / totalAttendance) * 100).toFixed(1) : 0}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Voting Rate
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={700} color="primary">
              {totalElectors > 0 ? ((totalVotes / totalElectors) * 100).toFixed(1) : 0}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Overall Participation
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

export default VotingConversionFunnel;
