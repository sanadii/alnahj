/**
 * AttendanceStats Component
 * Compact statistics display for right sidebar
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, CardContent, Typography, LinearProgress, Stack, IconButton, Chip, Alert } from '@mui/material';
import { IconRefresh } from '@tabler/icons-react';
import { RootState } from 'store';
import { getAttendanceStatisticsRequest, refreshAttendanceStatisticsRequest } from 'store/attendance/actions';
import { LoadingState } from 'shared/components';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface AttendanceStatsProps {
  selectedCommittee: string;
}

const AttendanceStats: React.FC<AttendanceStatsProps> = ({ selectedCommittee }) => {
  const dispatch = useDispatch();
  const { statistics, statsLoading, error } = useSelector((state: RootState) => state.attendance);

  // Load statistics when committee changes
  useEffect(() => {
    if (selectedCommittee) {
      dispatch(getAttendanceStatisticsRequest(selectedCommittee));
    }
  }, [dispatch, selectedCommittee]);

  // Handle refresh
  const handleRefresh = () => {
    if (selectedCommittee) {
      dispatch(refreshAttendanceStatisticsRequest(selectedCommittee));
    }
  };

  // Calculate percentage
  const percentage = statistics?.attendance_percentage || 0;

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6">Statistics</Typography>
          {selectedCommittee && (
            <IconButton onClick={handleRefresh} disabled={statsLoading} title="Refresh Statistics" size="small">
              <IconRefresh size={18} />
            </IconButton>
          )}
        </Stack>

        {/* Loading State */}
        {statsLoading && !statistics && <LoadingState message="Loading statistics..." compact size={24} />}

        {/* No Committee Selected */}
        {!selectedCommittee && !statsLoading && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="caption">Statistics will be available once committee is assigned</Typography>
          </Alert>
        )}

        {/* Error Message */}
        {error && !statistics && selectedCommittee && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="caption">{error}</Typography>
          </Alert>
        )}

        {/* Statistics Display */}
        {statistics && !statsLoading && selectedCommittee && (
          <>
            {/* Committee Name */}
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
              Committee: {statistics.committee_code}
            </Typography>

            {/* Main Stats */}
            <Stack spacing={1.5} sx={{ mb: 2 }}>
              {/* Total */}
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    Total Electors
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {statistics.total_electors}
                  </Typography>
                </Stack>
              </Box>

              {/* Attended */}
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Attended
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      {statistics.total_attended}
                    </Typography>
                    <Chip
                      label={`${percentage.toFixed(0)}%`}
                      size="small"
                      color={percentage >= 75 ? 'success' : percentage >= 50 ? 'warning' : 'error'}
                      sx={{ height: 18, fontSize: '0.7rem' }}
                    />
                  </Stack>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    height: 6,
                    borderRadius: 1,
                    backgroundColor: 'grey.300',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: percentage >= 75 ? 'success.main' : percentage >= 50 ? 'warning.main' : 'error.main',
                      borderRadius: 1
                    }
                  }}
                />
              </Box>

              {/* Pending */}
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    Pending
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="warning.main">
                    {statistics.pending_count}
                  </Typography>
                </Stack>
              </Box>
            </Stack>

            {/* Last Updated */}
            {statistics.last_updated && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right' }}>
                Updated: {new Date(statistics.last_updated).toLocaleTimeString()}
              </Typography>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceStats;
