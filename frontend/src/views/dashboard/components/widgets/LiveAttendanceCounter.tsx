/**
 * Live Attendance Counter Widget
 * Real-time attendance tracking with animations and predictions
 */

import React from 'react';
import { Paper, Typography, Box, Stack, LinearProgress, Chip, keyframes } from '@mui/material';
import { IconUsers, IconTarget, IconClock, IconTrendingUp } from '@tabler/icons-react';
import { useTheme } from '@mui/material/styles';

// Animation for progress bars
const progressAnimation = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

// Pulse animation for main numbers
const pulseAnimation = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
`;

interface LiveAttendanceCounterProps {
  totalElectors: number;
  electorAttendance: number;
  totalGuarantees: number;
  guaranteeAttendance: number;
  targetPercentage?: number;
  timeRemaining?: number; // minutes
}

export const LiveAttendanceCounter: React.FC<LiveAttendanceCounterProps> = ({
  totalElectors,
  electorAttendance,
  totalGuarantees,
  guaranteeAttendance,
  targetPercentage = 75,
  timeRemaining
}) => {
  const theme = useTheme();

  // Calculate elector metrics
  const electorPercentage = totalElectors > 0 ? (electorAttendance / totalElectors) * 100 : 0;
  const electorTargetCount = Math.round((totalElectors * targetPercentage) / 100);
  const electorRemaining = Math.max(0, electorTargetCount - electorAttendance);

  // Calculate guarantee metrics
  const guaranteePercentage = totalGuarantees > 0 ? (guaranteeAttendance / totalGuarantees) * 100 : 0;
  const guaranteeTargetCount = Math.round((totalGuarantees * targetPercentage) / 100);
  const guaranteeRemaining = Math.max(0, guaranteeTargetCount - guaranteeAttendance);

  // Overall status
  const electorOnTrack = electorAttendance >= electorTargetCount;
  const guaranteeOnTrack = guaranteeAttendance >= guaranteeTargetCount;

  const getStatusColor = () => {
    if (electorOnTrack && guaranteeOnTrack) return 'success';
    if (electorPercentage >= targetPercentage * 0.5 || guaranteePercentage >= targetPercentage * 0.5) return 'warning';
    return 'error';
  };

  const statusColor = getStatusColor();

  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 3,
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.2)' : 'rgba(25, 118, 210, 0.2)',
        background:
          theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, #1e3a5f 0%, #2a5298 50%, #1e3a5f 100%)`
            : `linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #1976d2 100%)`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(25, 118, 210, 0.3)'
      }}
    >
      {/* Decorative background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }}
      />
      {/* Mesh gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255, 255, 255, 0.03) 10px,
            rgba(255, 255, 255, 0.03) 20px
          )`,
          pointerEvents: 'none'
        }}
      />

      <Stack spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
        {/* Title */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={700} sx={{ textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            Attendance Tracking
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.95, mt: 0.5, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
            Real-time attendance for electors and guarantees
          </Typography>
        </Box>

        {/* Two-Column Layout */}
        <Stack
          direction="row"
          spacing={3}
          divider={
            <Box
              sx={{
                width: 2,
                bgcolor: 'rgba(255,255,255,0.25)',
                alignSelf: 'stretch',
                borderRadius: 1,
                boxShadow: '0 0 8px rgba(255,255,255,0.2)',
                flexShrink: 0
              }}
            />
          }
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            width: '100%'
          }}
        >
          {/* ELECTORS Column */}
          <Box sx={{ flex: '1 1 50%', minWidth: 0 }}>
            <Stack spacing={2}>
              {/* Elector Counter */}
              <Box sx={{ textAlign: 'center' }}>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5}>
                  <IconUsers
                    size={36}
                    style={{
                      filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
                      opacity: 0.9
                    }}
                  />
                  <Typography
                    variant="h2"
                    fontWeight={700}
                    sx={{
                      fontSize: { xs: '2.5rem', md: '3rem' },
                      textShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      animation: `${pulseAnimation} 3s ease-in-out infinite`
                    }}
                  >
                    {electorAttendance.toLocaleString()}
                  </Typography>
                </Stack>
                <Typography variant="h6" sx={{ opacity: 0.95, mt: 0.5, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
                  Electors
                  <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
                    {' '}Attendance
                  </Box>
                </Typography>
              </Box>

              {/* Elector Progress */}
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Progress
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {electorPercentage.toFixed(1)}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, electorPercentage)}
                  sx={{
                    height: 10,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.25)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'white',
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(255,255,255,0.4)',
                      background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,1) 100%)'
                    }
                  }}
                />
              </Box>

              {/* Elector Stats */}
              <Stack direction="row" spacing={2} justifyContent="space-around">
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight={700}>
                    {totalElectors.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Total
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight={700}>
                    {electorTargetCount.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Target
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight={700}>
                    {electorRemaining.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Remaining
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>

          {/* GUARANTEES Column */}
          <Box sx={{ flex: '1 1 50%', minWidth: 0 }}>
            <Stack spacing={2}>
              {/* Guarantee Counter */}
              <Box sx={{ textAlign: 'center' }}>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5}>
                  <IconTarget
                    size={36}
                    style={{
                      filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
                      opacity: 0.9
                    }}
                  />
                  <Typography
                    variant="h2"
                    fontWeight={700}
                    sx={{
                      fontSize: { xs: '2.5rem', md: '3rem' },
                      textShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      animation: `${pulseAnimation} 3s ease-in-out infinite 0.2s`
                    }}
                  >
                    {guaranteeAttendance.toLocaleString()}
                  </Typography>
                </Stack>
                <Typography variant="h6" sx={{ opacity: 0.95, mt: 0.5, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
                  Guarantees
                  <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
                    {' '}Attendance
                  </Box>
                </Typography>
              </Box>

              {/* Guarantee Progress */}
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Progress
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {guaranteePercentage.toFixed(1)}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, guaranteePercentage)}
                  sx={{
                    height: 10,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.25)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'white',
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(255,255,255,0.4)',
                      background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,1) 100%)'
                    }
                  }}
                />
              </Box>

              {/* Guarantee Stats */}
              <Stack direction="row" spacing={2} justifyContent="space-around">
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight={700}>
                    {totalGuarantees.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Total
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight={700}>
                    {guaranteeTargetCount.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Target
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight={700}>
                    {guaranteeRemaining.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Remaining
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Stack>

        {/* Status Message */}
        <Box
          sx={{
            bgcolor: electorOnTrack && guaranteeOnTrack ? 'rgba(76, 175, 80, 0.25)' : 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            p: 2.5,
            borderRadius: 2,
            textAlign: 'center',
            border: '1px solid',
            borderColor: electorOnTrack && guaranteeOnTrack ? 'rgba(76, 175, 80, 0.4)' : 'rgba(255,255,255,0.2)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" flexWrap="wrap">
            <IconTrendingUp size={22} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            <Typography variant="body1" fontWeight={600} sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              {electorOnTrack && guaranteeOnTrack
                ? '🎉 Both targets achieved! Excellent work!'
                : electorOnTrack
                  ? `✅ Electors on track • 📊 ${guaranteeRemaining.toLocaleString()} more guarantees needed`
                  : guaranteeOnTrack
                    ? `📊 ${electorRemaining.toLocaleString()} more electors needed • ✅ Guarantees on track`
                    : `📊 ${electorRemaining.toLocaleString()} electors and ${guaranteeRemaining.toLocaleString()} guarantees needed to reach targets`}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

export default LiveAttendanceCounter;
