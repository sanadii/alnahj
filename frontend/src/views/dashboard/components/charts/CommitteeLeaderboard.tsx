/**
 * Committee Leaderboard
 * Ranked table of committees by attendance performance
 */

import React, { useMemo } from 'react';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import { IconDownload } from '@tabler/icons-react';
import { exportDataAsExcel } from 'utils/charts/exportChart';

interface Committee {
  id: number;
  code: string;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'MIXED';
  electorCount: number;
  electorAttendanceCount: number;
  guaranteeCount: number;
  guaranteeAttendanceCount: number;
}

interface CommitteeLeaderboardProps {
  committees: Committee[];
}

export const CommitteeLeaderboard: React.FC<CommitteeLeaderboardProps> = ({ committees }) => {
  const enhancedCommittees = useMemo(() => {
    return [...committees]
      .map((c) => ({
        ...c,
        electorAttendancePercentage: c.electorCount > 0 ? (c.electorAttendanceCount / c.electorCount) * 100 : 0,
        guaranteeAttendancePercentage: c.guaranteeCount > 0 ? (c.guaranteeAttendanceCount / c.guaranteeCount) * 100 : 0
      }))
      .sort((a, b) => {
        const codeCompare = a.code.localeCompare(b.code, undefined, { sensitivity: 'base' });
        if (codeCompare !== 0) return codeCompare;
        return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
      });
  }, [committees]);

  const handleExport = () => {
    const exportData = enhancedCommittees.map((c) => ({
      Code: c.code,
      Name: c.name,
      Gender: c.gender,
      Electors: c.electorCount,
      'Elector Attendance': c.electorAttendanceCount,
      'Elector Attendance %': c.electorAttendancePercentage.toFixed(2),
      'Guarantees (subset)': c.guaranteeCount,
      'Guarantee Attendance': c.guaranteeAttendanceCount,
      'Guarantee Attendance %': c.guaranteeAttendancePercentage.toFixed(2)
    }));

    exportDataAsExcel(exportData, 'Committee-Leaderboard', 'Rankings');
  };

  const getMedalIcon = (rank: number) => {
    if (rank === 0) return <IconAward size={20} color="#FFD700" />; // Gold
    if (rank === 1) return <IconAward size={20} color="#C0C0C0" />; // Silver
    if (rank === 2) return <IconAward size={20} color="#CD7F32" />; // Bronze
    return null;
  };

  if (committees.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          No committees data available
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Committee Attendance Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sorted by committee code • Guarantees are a subset of electors
          </Typography>
        </Box>
        <Tooltip title="Export to Excel">
          <IconButton size="small" onClick={handleExport}>
            <IconDownload size={20} />
          </IconButton>
        </Tooltip>
      </Stack>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Committee</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell align="right">Electors</TableCell>
              <TableCell align="right">Guarantees</TableCell>
              <TableCell align="center">Elector Attendance</TableCell>
              <TableCell align="center">Guarantee Attendance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enhancedCommittees.map((committee) => (
              <TableRow
                key={committee.id}
                sx={{
                  '&:hover': { bgcolor: 'action.selected' }
                }}
              >
                <TableCell>
                  <Stack>
                    <Typography variant="body2" fontWeight={600}>
                      {committee.code}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {committee.name}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip
                    label={committee.gender}
                    size="small"
                    color={committee.gender === 'MALE' ? 'info' : committee.gender === 'FEMALE' ? 'secondary' : 'default'}
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">{committee.electorCount.toLocaleString()}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">{committee.guaranteeCount.toLocaleString()}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ minWidth: 160 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {committee.electorAttendanceCount} / {committee.electorCount}
                      </Typography>
                      <Typography variant="caption" fontWeight={700}>
                        {committee.electorAttendancePercentage.toFixed(1)}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={committee.electorAttendancePercentage}
                      color={
                        committee.electorAttendancePercentage >= 80
                          ? 'success'
                          : committee.electorAttendancePercentage >= 50
                            ? 'warning'
                            : 'error'
                      }
                      sx={{ height: 6, borderRadius: 1 }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ minWidth: 160 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {committee.guaranteeAttendanceCount} / {committee.guaranteeCount}
                      </Typography>
                      <Typography variant="caption" fontWeight={700}>
                        {committee.guaranteeAttendancePercentage.toFixed(1)}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={committee.guaranteeAttendancePercentage}
                      color={
                        committee.guaranteeAttendancePercentage >= 80
                          ? 'success'
                          : committee.guaranteeAttendancePercentage >= 50
                            ? 'warning'
                            : 'error'
                      }
                      sx={{ height: 6, borderRadius: 1 }}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CommitteeLeaderboard;
