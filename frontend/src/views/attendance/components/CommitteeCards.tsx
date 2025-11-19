/**
 * CommitteeCards Component
 * Shows committees as cards on mobile when "All Committees" is selected
 * Similar style to single committee attendance cards
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Stack,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { IconBuilding, IconUsers, IconCheck } from '@tabler/icons-react';
import { RootState } from 'store';
import { getAttendanceStatisticsRequest } from 'store/attendance/actions';

interface CommitteeCardsProps {
  committees: any[];
  onCommitteeSelect: (committeeCode: string) => void;
}

const CommitteeCards: React.FC<CommitteeCardsProps> = ({ committees, onCommitteeSelect }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const { statistics } = useSelector((state: RootState) => state.attendance);
  
  // Store statistics for each committee
  const [committeeStats, setCommitteeStats] = useState<Record<string, any>>({});

  // Load statistics for all committees
  useEffect(() => {
    if (committees.length > 0) {
      committees.forEach((committee) => {
        dispatch(getAttendanceStatisticsRequest(committee.code));
      });
    }
  }, [dispatch, committees]);

  // Update committee stats when statistics change
  useEffect(() => {
    if (statistics) {
      setCommitteeStats((prev) => ({
        ...prev,
        [statistics.committee_code]: statistics
      }));
    }
  }, [statistics]);

  if (!isMobile) {
    return null; // Only show on mobile
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Committees
      </Typography>
      <Stack spacing={2}>
        {committees.map((committee) => {
          const stats = committeeStats[committee.code];
          const attendanceCount = stats?.total_attended || 0;
          const totalElectors = stats?.total_electors || committee.electorCount || 0;
          const percentage = totalElectors > 0 ? Math.round((attendanceCount / totalElectors) * 100) : 0;
          const accentColor = theme.palette.primary.main;

          return (
            <Paper
              key={committee.code}
              elevation={2}
              onClick={() => onCommitteeSelect(committee.code)}
              sx={{
                p: 2,
                width: '100%',
                background:
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(103, 58, 183, 0.1) 0%, rgba(63, 81, 181, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(103, 58, 183, 0.05) 0%, rgba(63, 81, 181, 0.05) 100%)',
                borderLeft: `4px solid ${accentColor}`,
                borderRadius: 2,
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateX(-4px)',
                  boxShadow: theme.shadows[4]
                }
              }}
            >
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconBuilding size={20} color={accentColor} />
                  <Typography variant="h6" fontWeight={600}>
                    {committee.code}
                  </Typography>
                </Stack>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {committee.name}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Chip
                    label={`${attendanceCount} attended`}
                    size="small"
                    sx={{
                      backgroundColor: accentColor,
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                  <Chip
                    label={`${percentage}%`}
                    size="small"
                    color={percentage >= 75 ? 'success' : percentage >= 50 ? 'warning' : 'error'}
                  />
                </Stack>

                <Typography variant="caption" color="text.secondary">
                  {totalElectors} total electors
                </Typography>
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
};

export default CommitteeCards;

