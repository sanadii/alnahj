/**
 * Group Performance Table
 * Comprehensive comparison of guarantee groups
 */

import React, { useMemo, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Stack,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Collapse,
  Divider
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IconDownload } from '@tabler/icons-react';
import { exportDataAsExcel } from 'utils/charts/exportChart';

interface GuaranteeGroup {
  id: number;
  name: string;
  color: string;
  leaderId: number | null;
  leaderName: string;
  totalGuarantees: number;
  attendedCount: number;
  strongCount: number;
  mediumCount: number;
  weakCount: number;
  attendanceRate: number;
  conversionRate: number;
  status?: string;
}

interface GroupPerformanceTableProps {
  groups: GuaranteeGroup[];
}

interface CollectorSummary {
  leaderId: number | null;
  leaderName: string;
  groupsCount: number;
  totalGuarantees: number;
  attendedCount: number;
  strongCount: number;
  mediumCount: number;
  weakCount: number;
  attendanceRate: number;
  performanceScore: number;
  groupsDetail: GuaranteeGroup[];
}

const getPerformanceGrade = (score: number): { grade: string; color: 'success' | 'info' | 'warning' | 'error' } => {
  if (score >= 2.5) return { grade: 'A', color: 'success' };
  if (score >= 2.0) return { grade: 'B', color: 'info' };
  if (score >= 1.5) return { grade: 'C', color: 'warning' };
  return { grade: 'D', color: 'error' };
};

const calculateGroupScore = (group: GuaranteeGroup) => {
  const qualityRatio =
    group.totalGuarantees > 0 ? (group.strongCount * 3 + group.mediumCount * 2 + group.weakCount) / group.totalGuarantees : 0;

  const attendanceComponent = (group.attendanceRate / 100) * 3; // normalize to 0-3 range
  const conversionComponent = (group.conversionRate / 100) * 3; // normalize to 0-3 range

  return qualityRatio * 0.4 + attendanceComponent * 0.4 + conversionComponent * 0.2;
};

const renderDistribution = (strong: number, medium: number, weak: number) => (
  <Stack direction="row" spacing={0.5} justifyContent="center">
    <Chip label={strong} size="small" sx={{ bgcolor: 'success.main', color: 'white', minWidth: 36 }} />
    <Chip label={medium} size="small" sx={{ bgcolor: 'warning.main', color: 'white', minWidth: 36 }} />
    <Chip label={weak} size="small" sx={{ bgcolor: 'error.main', color: 'white', minWidth: 36 }} />
  </Stack>
);

const renderAttendance = (attendanceRate: number | undefined, attended: number | undefined, total: number | undefined) => {
  const safeTotal = total ?? 0;
  const safeAttended = attended ?? 0;
  const safeRate = attendanceRate ?? (safeTotal > 0 ? (safeAttended / safeTotal) * 100 : 0);

  return (
    <Box sx={{ minWidth: 140 }}>
      <Typography variant="body2" fontWeight={600}>
        {safeRate.toFixed(1)}%
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {safeAttended.toLocaleString()} of {safeTotal.toLocaleString()}
      </Typography>
      <LinearProgress variant="determinate" value={safeRate} color="info" sx={{ height: 4, borderRadius: 1, mt: 0.5 }} />
    </Box>
  );
};

export const GroupPerformanceTable: React.FC<GroupPerformanceTableProps> = ({ groups }) => {
  const [expandedCollector, setExpandedCollector] = useState<number | null>(null);

  const summaries = useMemo<CollectorSummary[]>(() => {
    const map = new Map<number | null, CollectorSummary>();

    groups.forEach((group) => {
      const key = group.leaderId;
      if (!map.has(key)) {
        map.set(key, {
          leaderId: key,
          leaderName: group.leaderName || 'Unassigned',
          groupsCount: 0,
          totalGuarantees: 0,
          attendedCount: 0,
          strongCount: 0,
          mediumCount: 0,
          weakCount: 0,
          attendanceRate: 0,
          performanceScore: 0,
          groupsDetail: []
        });
      }

      const entry = map.get(key)!;
      entry.groupsCount += 1;
      entry.totalGuarantees += group.totalGuarantees;
      entry.attendedCount += group.attendedCount;
      entry.strongCount += group.strongCount;
      entry.mediumCount += group.mediumCount;
      entry.weakCount += group.weakCount;
      entry.groupsDetail.push(group);

      const groupScore = calculateGroupScore(group);
      entry.performanceScore += groupScore * group.totalGuarantees;
    });

    return Array.from(map.values())
      .map((entry) => ({
        ...entry,
        attendanceRate: entry.totalGuarantees > 0 ? (entry.attendedCount / entry.totalGuarantees) * 100 : 0,
        performanceScore: entry.totalGuarantees > 0 ? entry.performanceScore / entry.totalGuarantees : 0,
        groupsDetail: entry.groupsDetail.sort((a, b) => a.name.localeCompare(b.name))
      }))
      .sort((a, b) => a.leaderName.localeCompare(b.leaderName));
  }, [groups]);

  const totals = useMemo(() => {
    const totalGroups = groups.length;
    const totalGuarantees = groups.reduce((sum, group) => sum + group.totalGuarantees, 0);
    const totalAttended = groups.reduce((sum, group) => sum + group.attendedCount, 0);
    const avgAttendance = totalGuarantees > 0 ? (totalAttended / totalGuarantees) * 100 : 0;

    return { totalGroups, totalGuarantees, totalAttended, avgAttendance };
  }, [groups]);

  const totalsSubtitle = useMemo(
    () =>
      `${totals.totalGuarantees.toLocaleString()} guarantees • ${totals.totalAttended.toLocaleString()} attended (${totals.avgAttendance.toFixed(1)}%)`,
    [totals]
  );

  const handleExport = () => {
    const exportData = summaries.map((entry) => ({
      Collector: entry.leaderName,
      Groups: entry.groupsCount,
      'Total Guarantees': entry.totalGuarantees,
      Strong: entry.strongCount,
      Medium: entry.mediumCount,
      Weak: entry.weakCount,
      'Attendance Rate': `${entry.attendanceRate.toFixed(1)}%`,
      'Attended Guarantees': entry.attendedCount,
      'Performance Score': entry.performanceScore.toFixed(2)
    }));

    exportDataAsExcel(exportData, 'Guarantee-Collectors', 'Collectors Overview');
  };

  const handleToggle = (leaderId: number | null) => () => {
    setExpandedCollector((prev) => (prev === leaderId ? null : leaderId));
  };

  if (groups.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          No guarantee groups data available
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Group Performance Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Collector-level view of guarantee performance
          </Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }}>
          <Chip label={`${totals.totalGroups} Groups`} size="small" color="primary" />
          <Typography variant="caption" color="text.secondary">
            {totalsSubtitle}
          </Typography>
          <Tooltip title="Export to Excel">
            <IconButton size="small" onClick={handleExport}>
              <IconDownload size={20} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Collector</TableCell>
            <TableCell align="center">Groups</TableCell>
            <TableCell align="right">Guarantees</TableCell>
            <TableCell align="center">Distribution</TableCell>
            <TableCell align="center">Attendance</TableCell>
            <TableCell align="center">Performance</TableCell>
            <TableCell align="center">Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {summaries.map((entry) => {
            const { grade, color } = getPerformanceGrade(entry.performanceScore);
            const isExpanded = expandedCollector === entry.leaderId;

            return (
              <React.Fragment key={entry.leaderId ?? 'unassigned'}>
                <TableRow hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {entry.leaderName}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={600}>
                      {entry.groupsCount}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={700}>
                      {entry.totalGuarantees.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{renderDistribution(entry.strongCount, entry.mediumCount, entry.weakCount)}</TableCell>
                  <TableCell align="center">{renderAttendance(entry.attendanceRate, entry.attendedCount, entry.totalGuarantees)}</TableCell>
                  <TableCell align="center">
                    <Stack spacing={0.5} alignItems="center">
                      <Chip label={`Grade ${grade}`} size="small" color={color} sx={{ fontWeight: 700, minWidth: 60 }} />
                      <Typography variant="caption" color="text.secondary">
                        {entry.performanceScore.toFixed(2)}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={handleToggle(entry.leaderId)}>
                      {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={7} sx={{ p: 0, borderBottom: isExpanded ? '1px solid' : 'none', borderColor: 'divider' }}>
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Box sx={{ px: 3, pb: 3 }}>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                          Groups managed by {entry.leaderName}
                        </Typography>
                        {entry.groupsDetail.length > 0 ? (
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Group</TableCell>
                                <TableCell align="right">Guarantees</TableCell>
                                <TableCell align="center">Distribution</TableCell>
                                <TableCell align="center">Attendance</TableCell>
                                <TableCell align="center">Performance</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {entry.groupsDetail.map((group) => {
                                const groupScore = calculateGroupScore(group);
                                const { grade: groupGrade, color: groupColor } = getPerformanceGrade(groupScore);

                                return (
                                  <TableRow key={group.id} hover>
                                    <TableCell>
                                      <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Box
                                          sx={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: '50%',
                                            bgcolor: group.color,
                                            border: '2px solid',
                                            borderColor: 'background.paper'
                                          }}
                                        />
                                        <Typography variant="body2" fontWeight={600}>
                                          {group.name}
                                        </Typography>
                                      </Stack>
                                    </TableCell>
                                    <TableCell align="right">
                                      <Typography variant="body2" fontWeight={600}>
                                        {group.totalGuarantees.toLocaleString()}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      {renderDistribution(group.strongCount, group.mediumCount, group.weakCount)}
                                    </TableCell>
                                    <TableCell align="center">
                                      {renderAttendance(group.attendanceRate, group.attendedCount, group.totalGuarantees)}
                                    </TableCell>
                                    <TableCell align="center">
                                      <Stack spacing={0.5} alignItems="center">
                                        <Chip
                                          label={`Grade ${groupGrade}`}
                                          size="small"
                                          color={groupColor}
                                          sx={{ fontWeight: 700, minWidth: 60 }}
                                        />
                                        <Typography variant="caption" color="text.secondary">
                                          {groupScore.toFixed(2)}
                                        </Typography>
                                      </Stack>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        ) : (
                          <Box sx={{ p: 2.5, borderRadius: 1, border: '1px dashed', borderColor: 'divider' }}>
                            <Typography variant="body2" color="text.secondary">
                              No guarantee groups recorded for this collector.
                            </Typography>
                          </Box>
                        )}
                        <Divider sx={{ mt: 2 }} />
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600} gutterBottom>
          Performance Grading:
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          <Chip label="A: Excellent (≥2.5)" size="small" color="success" />
          <Chip label="B: Good (2.0-2.4)" size="small" color="info" />
          <Chip label="C: Fair (1.5-1.9)" size="small" color="warning" />
          <Chip label="D: Needs Improvement (<1.5)" size="small" color="error" />
        </Stack>
      </Box>
    </Paper>
  );
};

export default GroupPerformanceTable;
