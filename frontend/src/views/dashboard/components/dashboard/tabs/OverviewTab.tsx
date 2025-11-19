import React from 'react';
import { Stack, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { IconFlag, IconUsers, IconShield, IconCheckbox } from '@tabler/icons-react';
import { StatCard, StatCardGradients, ScrollableCardContainer } from 'shared/components';
import { PartyComparisonChart, CandidateDistributionChart, CommitteePerformanceChart } from '../../charts';

const MuiGrid = Grid as unknown as React.ComponentType<any>;

interface OverviewTabProps {
  totalParties: number;
  totalCandidates: number;
  totalElectors: number;
  totalCommittees: number;
  totalGuarantees: number;
  guaranteeAttendancePercentage: number;
  totalAttendance: number;
  attendancePercentage: number;
  parties: any[];
  committees: any[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  totalParties,
  totalCandidates,
  totalElectors,
  totalCommittees,
  totalGuarantees,
  guaranteeAttendancePercentage,
  totalAttendance,
  attendancePercentage,
  parties,
  committees
}) => {
  return (
    <Stack spacing={3}>
      <ScrollableCardContainer>
        <StatCard
          icon={<IconFlag size={26} />}
          value={totalParties}
          label="Political Parties"
          gradient={StatCardGradients.purple}
          subtitle={`${totalCandidates} candidates`}
        />
        <StatCard
          icon={<IconUsers size={26} />}
          value={totalElectors.toLocaleString()}
          label="Total Electors"
          gradient={StatCardGradients.pink}
          subtitle={`${totalCommittees} committees`}
        />
        <StatCard
          icon={<IconShield size={26} />}
          value={totalGuarantees.toLocaleString()}
          label="Guarantees"
          gradient={StatCardGradients.blue}
          subtitle={
            <>
              {guaranteeAttendancePercentage.toFixed(1)}%
              <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
                {' '}attendance
              </Box>
            </>
          }
        />
        <StatCard
          icon={<IconCheckbox size={26} />}
          value={totalAttendance.toLocaleString()}
          label="Attendance"
          gradient={StatCardGradients.green}
          subtitle={`${attendancePercentage}% turnout`}
        />
      </ScrollableCardContainer>
      <MuiGrid container spacing={2}>
        <MuiGrid size={{ xs: 12, md: 6 }}>
          <PartyComparisonChart parties={parties} totalCandidates={totalCandidates} />
        </MuiGrid>
        <MuiGrid size={{ xs: 12, md: 6 }}>
          <CandidateDistributionChart parties={parties} />
        </MuiGrid>
      </MuiGrid>

      <CommitteePerformanceChart committees={committees} />
    </Stack>
  );
};

export default OverviewTab;

