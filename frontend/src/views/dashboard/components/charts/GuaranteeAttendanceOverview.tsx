import React, { useMemo, useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Stack,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { GuaranteeUserAttendance, GuaranteeGroupAttendance, GuaranteeUserGroupDetail } from '../hooks/useAttendanceDashboard';

interface GuaranteeAttendanceOverviewProps {
  users: GuaranteeUserAttendance[];
  groups: GuaranteeGroupAttendance[];
  userGroups: GuaranteeUserGroupDetail[];
}

const renderProgress = (total: number, attended: number, percentage: number) => (
  <Box sx={{ minWidth: 160 }}>
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
      <Typography variant="caption" color="text.secondary">
        {attended.toLocaleString()} / {total.toLocaleString()}
      </Typography>
      <Typography variant="caption" fontWeight={700}>
        {percentage.toFixed(1)}%
      </Typography>
    </Stack>
    <LinearProgress
      variant="determinate"
      value={percentage}
      color={percentage >= 80 ? 'success' : percentage >= 50 ? 'warning' : 'error'}
      sx={{ height: 6, borderRadius: 1 }}
    />
  </Box>
);

export const GuaranteeAttendanceOverview: React.FC<GuaranteeAttendanceOverviewProps> = ({ users, groups, userGroups }) => {
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

  const totals = useMemo(() => {
    const totalGuarantees = users.reduce((sum, item) => sum + item.totalGuarantees, 0);
    const totalAttended = users.reduce((sum, item) => sum + item.attended, 0);
    const percentage = totalGuarantees > 0 ? (totalAttended / totalGuarantees) * 100 : 0;
    return {
      totalGuarantees,
      totalAttended,
      percentage
    };
  }, [users]);

  const handleAccordionChange = (userId: number | null) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedUserId(isExpanded ? userId : null);
  };

  useEffect(() => {
    if (expandedUserId !== null && !users.find((u) => u.userId === expandedUserId)) {
      setExpandedUserId(null);
    }
  }, [expandedUserId, users]);

  const getGroupsForUser = (userId: number | null) => {
    const detail = userGroups.find((entry) => entry.userId === userId);
    if (detail) {
      return detail.groups;
    }

    // Fallback: if no per-user groups supplied, use global groups when userId is null (unassigned)
    if (userId === null) {
      return groups.filter((group) => group.groupName === 'Ungrouped');
    }

    return [] as GuaranteeGroupAttendance[];
  };

  const renderGroupTable = (groupList: GuaranteeGroupAttendance[]) => {
    if (groupList.length === 0) {
      return (
        <Box sx={{ p: 2.5, textAlign: 'center', borderRadius: 1, border: '1px dashed', borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary">
            No guarantee groups recorded for this collector
          </Typography>
        </Box>
      );
    }

    return (
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Group</TableCell>
            <TableCell align="right">Total Guarantees</TableCell>
            <TableCell align="center">Attendance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groupList.map((group) => (
            <TableRow key={`${group.groupId}-${group.groupName}`}>
              <TableCell>
                <Typography variant="body2" fontWeight={600}>
                  {group.groupName}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2">{group.totalGuarantees.toLocaleString()}</Typography>
              </TableCell>
              <TableCell align="center">{renderProgress(group.totalGuarantees, group.attended, group.attendancePercentage)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={1}
        >
          <Box>
            <Typography variant="h5" fontWeight={600}>
              Guarantees Attendance Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click a collector to see their guarantee groups
            </Typography>
          </Box>
          {totals.totalGuarantees > 0 && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Total guarantees: <strong>{totals.totalGuarantees.toLocaleString()}</strong>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Attended: <strong>{totals.totalAttended.toLocaleString()}</strong> ({totals.percentage.toFixed(1)}%)
              </Typography>
            </Stack>
          )}
        </Stack>

        <Stack spacing={1.5}>
          {users.map((user) => {
            const groupList = getGroupsForUser(user.userId);
            const isExpanded = expandedUserId === user.userId;

            return (
              <Accordion
                key={user.userId ?? 'unassigned'}
                expanded={isExpanded}
                onChange={handleAccordionChange(user.userId)}
                disableGutters
                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, '&:before': { display: 'none' } }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2.5, py: 2 }}>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={{ xs: 1.5, md: 3 }}
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    sx={{ width: '100%' }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" fontWeight={600}>
                        {user.userName || 'Unassigned'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.totalGuarantees.toLocaleString()} guarantees collected
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: { xs: '100%', md: 200 } }}>
                      {renderProgress(user.totalGuarantees, user.attended, user.attendancePercentage)}
                    </Box>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ px: { xs: 2.5, md: 3 }, pb: 3 }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                    Guarantee Groups
                  </Typography>
                  {renderGroupTable(groupList)}
                </AccordionDetails>
              </Accordion>
            );
          })}

          {users.length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center', borderRadius: 1, border: '1px dashed', borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                No guarantee collectors found
              </Typography>
            </Box>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default GuaranteeAttendanceOverview;
