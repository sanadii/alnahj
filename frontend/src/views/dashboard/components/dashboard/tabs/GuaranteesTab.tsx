import React from 'react';
import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { GuaranteeDistributionExplorer, GroupPerformanceTableWithAPI, GuaranteesTrendChartWithAPI } from '../../charts';
import { MetricSummaryCard } from '../../cards';

const MuiGrid = Grid as unknown as React.ComponentType<any>;

interface GuaranteesTabProps {
  election: any;
  totalGuarantees: number;
  totalGuaranteeAttendance: number;
  guaranteeAttendancePercentage: number;
}

const GuaranteesTab: React.FC<GuaranteesTabProps> = ({
  election,
  totalGuarantees,
  totalGuaranteeAttendance,
  guaranteeAttendancePercentage
}) => {
  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>
        Guarantees Dashboard
      </Typography>

      <GuaranteeDistributionExplorer electionId={election.id} height={360} />

      <MuiGrid container spacing={2}>
        <MuiGrid item xs={12} md={4}>
          <MetricSummaryCard value={totalGuarantees} label="Total Guarantees" color="primary" />
        </MuiGrid>
        <MuiGrid item xs={12} md={4}>
          <MetricSummaryCard value={totalGuaranteeAttendance} label="Attended" color="success" />
        </MuiGrid>
        <MuiGrid item xs={12} md={4}>
          <MetricSummaryCard
            value={`${guaranteeAttendancePercentage.toFixed(1)}%`}
            label="Guarantee Attendance Rate"
            color="secondary"
          />
        </MuiGrid>
      </MuiGrid>

      <GroupPerformanceTableWithAPI electionId={election.id} />
      <GuaranteesTrendChartWithAPI electionId={election.id} height={360} />
    </Stack>
  );
};

export default GuaranteesTab;

