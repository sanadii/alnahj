import React, { useMemo, useState } from 'react';
import { Box, Paper, Stack, Typography, Tabs, Tab } from '@mui/material';
import {
  IconChartBar,
  IconUsers,
  IconShield,
  IconCheckbox,
  IconChecks,
  IconUsersGroup
} from '@tabler/icons-react';
import { useDashboardOverview, useElectorDemographics } from 'hooks/dashboard/useDashboardData';
import TabPanel from '../shared/TabPanel';
import OverviewTab from './tabs/OverviewTab';
import ElectorsTab from './tabs/ElectorsTab';
import GuaranteesTab from './tabs/GuaranteesTab';
import AttendanceTab from './tabs/AttendanceTab';
import VotingTab from './tabs/VotingTab';
import ResultsTab from './tabs/ResultsTab';

interface DashboardViewProps {
  election: any;
  parties: any[];
  candidates: any[];
  committees: any[];
  onEditElection: () => void;
  onManageEntities: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  election,
  parties,
  candidates,
  committees,
  onEditElection,
  onManageEntities
}) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [showAttendanceInElectors, setShowAttendanceInElectors] = useState(false);
  const [attendanceView, setAttendanceView] = useState<'committees' | 'guarantees'>('committees');

  const {
    data: dashboardOverview,
    loading: overviewLoading,
    error: overviewError
  } = useDashboardOverview(election?.id ?? null);

  // Fallback: Fetch demographics separately if not in overview or if empty
  const overviewDemographics = dashboardOverview?.demographics;
  const hasDemographicsInOverview = useMemo(() => {
    if (!overviewDemographics) return false;
    const teams = overviewDemographics.byTeam ?? overviewDemographics.by_team ?? [];
    const departments = overviewDemographics.byDepartment ?? overviewDemographics.by_department ?? [];
    const areas = overviewDemographics.byArea ?? overviewDemographics.by_area ?? [];
    const families = overviewDemographics.byFamily ?? overviewDemographics.by_family ?? [];
    return (
      (Array.isArray(teams) && teams.length > 0) ||
      (Array.isArray(departments) && departments.length > 0) ||
      (Array.isArray(areas) && areas.length > 0) ||
      (Array.isArray(families) && families.length > 0)
    );
  }, [overviewDemographics]);

  const {
    data: fallbackDemographics,
    loading: demographicsLoading
  } = useElectorDemographics(election?.id ?? null, {
    autoFetch: !hasDemographicsInOverview && !!election?.id && !overviewLoading
  });

  // Use demographics from overview if available and non-empty, otherwise use fallback
  const electorDemographics = useMemo(() => {
    if (hasDemographicsInOverview && overviewDemographics) {
      // Ensure it's properly mapped
      return overviewDemographics;
    }
    // Always prefer fallback if available, as it's from the dedicated endpoint
    if (fallbackDemographics) {
      return fallbackDemographics;
    }
    return overviewDemographics ?? null;
  }, [hasDemographicsInOverview, overviewDemographics, fallbackDemographics]);
  const attendanceDashboard = dashboardOverview;

  const totalParties = parties.length;
  const totalCandidates = candidates.length;
  const totalCommittees = committees.length;

  const totalElectors = useMemo(
    () => committees.reduce((sum: number, committee: any) => sum + (committee.electorCount || 0), 0),
    [committees]
  );
  const totalAttendance = useMemo(
    () => committees.reduce((sum: number, committee: any) => sum + (committee.attendanceCount || 0), 0),
    [committees]
  );
  const totalVotes = useMemo(
    () => committees.reduce((sum: number, committee: any) => sum + (committee.voteCount || 0), 0),
    [committees]
  );

  const attendancePercentage = totalElectors > 0 ? Math.round((totalAttendance / totalElectors) * 100) : 0;
  const votingPercentage = totalAttendance > 0 ? Math.round((totalVotes / totalAttendance) * 100) : 0;
  const participationRate = totalElectors > 0 ? Math.round((totalVotes / totalElectors) * 100) : 0;

  const teamsData = useMemo(() => {
    if (!electorDemographics) return [];
    const teams = electorDemographics.byTeam ?? electorDemographics.by_team ?? [];
    if (!Array.isArray(teams) || teams.length === 0) return [];
    return teams.map((team: any) => ({
      code: team.code ?? '',
      name: team.name ?? '',
      totalElectors: team.totalElectors ?? team.total_electors ?? 0,
      attended: team.attended ?? 0,
      attendancePercentage: team.attendancePercentage ?? team.attendance_percentage ?? 0,
      male: team.male ?? 0,
      female: team.female ?? 0
    }));
  }, [electorDemographics]);

  const departmentsData = useMemo(() => {
    if (!electorDemographics) return [];
    const departments = electorDemographics.byDepartment ?? electorDemographics.by_department ?? [];
    if (!Array.isArray(departments) || departments.length === 0) return [];
    return departments.map((department: any) => ({
      code: department.code ?? '',
      name: department.name ?? '',
      totalElectors: department.totalElectors ?? department.total_electors ?? 0,
      attended: department.attended ?? 0,
      attendancePercentage: department.attendancePercentage ?? department.attendance_percentage ?? 0,
      male: department.male ?? 0,
      female: department.female ?? 0
    }));
  }, [electorDemographics]);

  const areasData = useMemo(() => {
    if (!electorDemographics) return [];
    const areas = electorDemographics.byArea ?? electorDemographics.by_area ?? [];
    if (!Array.isArray(areas) || areas.length === 0) return [];
    return areas.map((area: any) => ({
      code: area.code ?? '',
      name: area.name ?? '',
      totalElectors: area.totalElectors ?? area.total_electors ?? 0,
      attended: area.attended ?? 0,
      attendancePercentage: area.attendancePercentage ?? area.attendance_percentage ?? 0,
      male: area.male ?? 0,
      female: area.female ?? 0
    }));
  }, [electorDemographics]);

  const familiesData = useMemo(() => {
    if (!electorDemographics) return [];
    const families = electorDemographics.byFamily ?? electorDemographics.by_family ?? [];
    if (!Array.isArray(families) || families.length === 0) return [];
    return families.map((family: any) => ({
      code: (family.familyName ?? family.family_name ?? 'N/A').toString().slice(0, 10).toUpperCase(),
      name: family.familyName ?? family.family_name ?? 'Unspecified',
      totalElectors: family.count ?? 0,
      attended: 0,
      attendancePercentage: 0,
      male: family.male ?? 0,
      female: family.female ?? 0
    }));
  }, [electorDemographics]);

  const totalGuarantees = useMemo(() => {
    if (!attendanceDashboard?.committees) return 0;
    return attendanceDashboard.committees.reduce((sum: number, committee: any) => sum + (committee.guaranteeCount || 0), 0);
  }, [attendanceDashboard]);

  const totalGuaranteeAttendance = useMemo(() => {
    if (!attendanceDashboard?.committees) return 0;
    return attendanceDashboard.committees.reduce(
      (sum: number, committee: any) => sum + (committee.guaranteeAttendanceCount || 0),
      0
    );
  }, [attendanceDashboard]);

  const guaranteeAttendancePercentage = useMemo(() => {
    if (totalGuarantees === 0) return 0;
    return Math.round((totalGuaranteeAttendance / totalGuarantees) * 1000) / 10;
  }, [totalGuarantees, totalGuaranteeAttendance]);

  const handleTabChange = (_event: React.SyntheticEvent, value: number) => setCurrentTab(value);
  const handleAttendanceTabChange = (_event: React.SyntheticEvent, value: 'committees' | 'guarantees') =>
    setAttendanceView(value);

  return (
    <Box>
      <Stack spacing={3}>
        <Paper sx={{ overflow: 'hidden' }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              px: 2,
              '& .MuiTab-root': {
                minHeight: 64,
                fontSize: '1rem',
                fontWeight: 600
              }
            }}
          >
            <Tab icon={<IconChartBar size={18} />} iconPosition="start" label="Overview" />
            <Tab icon={<IconUsers size={18} />} iconPosition="start" label="Electors" />
            <Tab icon={<IconShield size={18} />} iconPosition="start" label="Guarantees" />
            <Tab icon={<IconCheckbox size={18} />} iconPosition="start" label="Attendance" />
            <Tab icon={<IconChecks size={18} />} iconPosition="start" label="Voting" />
            <Tab icon={<IconUsersGroup size={18} />} iconPosition="start" label="Results" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            <TabPanel value={currentTab} index={0}>
              <OverviewTab
                totalParties={totalParties}
                totalCandidates={totalCandidates}
                totalElectors={totalElectors}
                totalCommittees={totalCommittees}
                totalGuarantees={totalGuarantees}
                guaranteeAttendancePercentage={guaranteeAttendancePercentage}
                totalAttendance={totalAttendance}
                attendancePercentage={attendancePercentage}
                parties={parties}
                committees={committees}
              />
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
              <ElectorsTab
                election={election}
                electorDemographics={electorDemographics}
                overviewLoading={overviewLoading}
                demographicsLoading={demographicsLoading}
                teamsData={teamsData}
                departmentsData={departmentsData}
                areasData={areasData}
                familiesData={familiesData}
                showAttendanceInElectors={showAttendanceInElectors}
                onToggleAttendance={setShowAttendanceInElectors}
              />
            </TabPanel>

            <TabPanel value={currentTab} index={2}>
              <GuaranteesTab
                election={election}
                totalGuarantees={totalGuarantees}
                totalGuaranteeAttendance={totalGuaranteeAttendance}
                guaranteeAttendancePercentage={guaranteeAttendancePercentage}
              />
            </TabPanel>

            <TabPanel value={currentTab} index={3}>
              <AttendanceTab
                election={election}
                attendanceDashboard={attendanceDashboard}
                overviewLoading={overviewLoading}
                demographicsLoading={demographicsLoading}
                overviewError={overviewError}
                totalGuarantees={totalGuarantees}
                totalGuaranteeAttendance={totalGuaranteeAttendance}
                attendanceView={attendanceView}
                onAttendanceViewChange={handleAttendanceTabChange}
              />
            </TabPanel>

            <TabPanel value={currentTab} index={4}>
              <VotingTab />
            </TabPanel>

            <TabPanel value={currentTab} index={5}>
              <ResultsTab />
            </TabPanel>
          </Box>
        </Paper>
      </Stack>
    </Box>
  );
};

export default DashboardView;
