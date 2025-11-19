/**
 * Group Performance Table with API Integration
 * Fetches guarantee group performance metrics and renders the analytics table.
 */
import React from 'react';
import { Paper, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { useGroupPerformance } from 'hooks/dashboard/useDashboardData';
import GroupPerformanceTable from './GroupPerformanceTable';

interface GroupPerformanceTableWithAPIProps {
  electionId: number;
}

const pickNumber = (...values: Array<number | null | undefined>): number => {
  for (const value of values) {
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return 0;
};

const GroupPerformanceTableWithAPI: React.FC<GroupPerformanceTableWithAPIProps> = ({ electionId }) => {
  const { data, loading, error, refetch } = useGroupPerformance(electionId);

  if (loading) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading group performance data...
        </Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'error.light' }}>
        <Alert
          severity="error"
          action={
            <Button size="small" onClick={refetch}>
              Retry
            </Button>
          }
        >
          <Typography variant="body2" fontWeight={600}>
            Failed to load group performance data
          </Typography>
          <Typography variant="caption">{error}</Typography>
        </Alert>
      </Paper>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Alert severity="info">
          <Typography variant="body2">No guarantee groups configured yet.</Typography>
          <Typography variant="caption">Create groups to track guarantee team performance.</Typography>
        </Alert>
      </Paper>
    );
  }

  const transformedGroups = data.map((group: any) => {
    const totalGuarantees = pickNumber(group.guaranteesCount, group.guarantees_count);
    const attendedCount = pickNumber(group.attendedCount, group.attended_count);
    const strongCount = pickNumber(group.strongCount, group.highCount, group.guaranteedCount, group.guaranteed_count);
    const mediumCount = pickNumber(group.mediumCount, group.medium_count);
    const weakExplicit = pickNumber(group.weakCount, group.weak_count);
    const weakComposite =
      pickNumber(group.pendingCount, group.pending_count) + pickNumber(group.notAvailableCount, group.not_available_count);
    const weakCount = weakExplicit > 0 ? weakExplicit : weakComposite;

    return {
      id: group.id,
      name: group.name,
      leaderId: group.leaderId ?? group.leader_id ?? null,
      leaderName: group.leader,
      color: `#${Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, '0')}`,
      totalGuarantees,
      attendedCount,
      strongCount,
      mediumCount,
      weakCount,
      attendanceRate: group.attendanceRate ?? group.attendance_rate ?? 0,
      conversionRate: group.conversionRate ?? group.conversion_rate ?? 0,
      status: group.status
    };
  });

  return <GroupPerformanceTable groups={transformedGroups} />;
};

export default GroupPerformanceTableWithAPI;

