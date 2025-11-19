import React from 'react';
import { Box, Paper, Stack, Typography, Switch, FormControlLabel } from '@mui/material';
import Grid from '@mui/material/Grid';
import { IconUsers, IconUsersGroup, IconMap } from '@tabler/icons-react';
import { StatCard, StatCardGradients, ScrollableCardContainer } from 'shared/components';
import { FamilyDistributionChart, ElectorDataVisualization } from '../../charts';

const MuiGrid = Grid as unknown as React.ComponentType<any>;

interface ElectorsTabProps {
  election: any;
  electorDemographics: any;
  overviewLoading: boolean;
  demographicsLoading: boolean;
  teamsData: any[];
  departmentsData: any[];
  areasData: any[];
  familiesData: any[];
  showAttendanceInElectors: boolean;
  onToggleAttendance: (checked: boolean) => void;
}

const ElectorsTab: React.FC<ElectorsTabProps> = ({
  election,
  electorDemographics,
  overviewLoading,
  demographicsLoading,
  teamsData,
  departmentsData,
  areasData,
  familiesData,
  showAttendanceInElectors,
  onToggleAttendance
}) => {
  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>
        Elector Demographics
      </Typography>

      {!(overviewLoading || demographicsLoading) && electorDemographics ? (
        <ScrollableCardContainer>
          {electorDemographics.byGender?.map((genderData: any) => (
            <StatCard
              key={genderData.gender}
              icon={<IconUsers size={32} />}
              value={genderData.count.toLocaleString()}
              label={`${genderData.gender} Electors`}
              gradient={genderData.gender === 'Male' ? StatCardGradients.blue : StatCardGradients.pink}
              subtitle={`${genderData.percentage}% of total`}
            />
          ))}
          <StatCard
            icon={<IconUsersGroup size={32} />}
            value={electorDemographics.byFamily?.length ?? 0}
            label="Top Families"
            gradient={StatCardGradients.green}
            subtitle="Most represented"
          />
          <StatCard
            icon={<IconMap size={32} />}
            value={electorDemographics.byArea?.length ?? 0}
            label="Areas"
            gradient={StatCardGradients.orange}
            subtitle={`${electorDemographics.byTeam?.length ?? 0} teams`}
          />
        </ScrollableCardContainer>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {overviewLoading || demographicsLoading ? 'Loading elector demographics...' : 'No elector demographics available'}
          </Typography>
        </Paper>
      )}

      <MuiGrid container spacing={3}>
        <MuiGrid size={{ xs: 12 }}>
          {!(overviewLoading || demographicsLoading) && election?.id ? (
            <FamilyDistributionChart electionId={election.id} height={520} />
          ) : (
            <Paper sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary">
                {overviewLoading || demographicsLoading ? 'Loading elector distribution...' : 'No elector data available'}
              </Typography>
            </Paper>
          )}
        </MuiGrid>
      </MuiGrid>

      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={600}>
            Teams & Areas Analysis
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={showAttendanceInElectors}
                onChange={(event) => onToggleAttendance(event.target.checked)}
                color="primary"
              />
            }
            label={<Typography>{showAttendanceInElectors ? 'Show Attendance' : 'Show Elector Data'}</Typography>}
          />
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {showAttendanceInElectors
            ? 'Viewing attendance performance metrics'
            : 'Viewing elector counts and demographics'}
        </Typography>
      </Box>

      <ElectorDataVisualization
        teams={teamsData}
        departments={departmentsData}
        areas={areasData}
        families={familiesData}
        height={480}
        showAttendance={showAttendanceInElectors}
      />
    </Stack>
  );
};

export default ElectorsTab;

