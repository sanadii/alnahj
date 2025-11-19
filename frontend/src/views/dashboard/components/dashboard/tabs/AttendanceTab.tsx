import React from 'react';
import { Paper, Stack, Typography, Tabs, Tab } from '@mui/material';
import Grid from '@mui/material/Grid';
import { IconAlertCircle } from '@tabler/icons-react';
import { CommitteeLeaderboard, GuaranteeAttendanceOverview, HourlyAttendanceChartWithAPI } from '../../charts';
import { LiveAttendanceCounter } from '../../widgets';
import { MetricSummaryCard } from '../../cards';

const MuiGrid = Grid as unknown as React.ComponentType<any>;

interface AttendanceTabProps {
  election: any;
  attendanceDashboard: any;
  overviewLoading: boolean;
  demographicsLoading: boolean;
  overviewError: string | null;
  totalGuarantees: number;
  totalGuaranteeAttendance: number;
  attendanceView: 'committees' | 'guarantees';
  onAttendanceViewChange: (event: React.SyntheticEvent, value: 'committees' | 'guarantees') => void;
}

const AttendanceTab: React.FC<AttendanceTabProps> = ({
  election,
  attendanceDashboard,
  overviewLoading,
  demographicsLoading,
  overviewError,
  totalGuarantees,
  totalGuaranteeAttendance,
  attendanceView,
  onAttendanceViewChange
}) => {
  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>
        Attendance Dashboard
      </Typography>

      {overviewLoading || demographicsLoading ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Loading attendance data...
          </Typography>
        </Paper>
      ) : overviewError ? (
        <Paper sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconAlertCircle size={18} color="var(--mui-palette-error-main)" />
            <Typography variant="body2" color="error">
              {overviewError}
            </Typography>
          </Stack>
        </Paper>
      ) : attendanceDashboard ? (
        <>
          <LiveAttendanceCounter
            totalElectors={attendanceDashboard.summary.totalElectors}
            electorAttendance={attendanceDashboard.summary.totalAttendance}
            totalGuarantees={totalGuarantees}
            guaranteeAttendance={totalGuaranteeAttendance}
            targetPercentage={75}
          />

          <MuiGrid container spacing={2}>
            <MuiGrid item xs={12} md={6}>
              <MetricSummaryCard
                value={`${attendanceDashboard.summary.attendancePercentage}%`}
                label="Attendance Rate"
                sublabel={`${attendanceDashboard.summary.totalAttendance.toLocaleString()} of ${attendanceDashboard.summary.totalElectors.toLocaleString()} electors`}
                color="primary"
              />
            </MuiGrid>
            <MuiGrid item xs={12} md={6}>
              <MetricSummaryCard
                value={`${attendanceDashboard.summary.participationRate}%`}
                label="Overall Participation"
                sublabel={`${attendanceDashboard.summary.totalVotes.toLocaleString()} votes`}
                color="secondary"
              />
            </MuiGrid>
          </MuiGrid>

          <Tabs
            value={attendanceView}
            onChange={onAttendanceViewChange}
            sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab value="committees" label="Committees" />
            <Tab value="guarantees" label="Guarantees & Groups" />
          </Tabs>

          {attendanceView === 'committees' ? (
            <CommitteeLeaderboard committees={attendanceDashboard.committees as any} />
          ) : (
            <GuaranteeAttendanceOverview
              users={attendanceDashboard.guaranteeBreakdown.byUser}
              groups={attendanceDashboard.guaranteeBreakdown.byGroup}
              userGroups={attendanceDashboard.guaranteeBreakdown.byUserGroups}
            />
          )}

          <HourlyAttendanceChartWithAPI electionId={election.id} height={340} />
        </>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary">
            No attendance data available.
          </Typography>
        </Paper>
      )}
    </Stack>
  );
};

export default AttendanceTab;

