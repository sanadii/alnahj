/**
 * Sorting (Vote Counting) Page
 * Election Management System - Vote entry and results viewing
 */

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store';

// material-ui
import { Box, Grid, Card, CardContent, Typography, Tab, Tabs, Alert, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// icons
import {
  Assessment as AssessmentIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  HowToVote as VoteIcon,
  WarningAmber as WarningAmberIcon
} from '@mui/icons-material';

// project imports
import { PremiumCard, PremiumPageHeader } from 'shared/components';
import type { HeaderAction } from 'shared/components';
import { IconChartBar, IconRefresh, IconEdit } from '@tabler/icons-react';
import { getVoteCountsRequest, getCandidatesRequest, getPartiesRequest, getVotingStatisticsRequest } from 'store/voting';
import { votingSelector, selectVotingCompletionMetrics } from 'store/voting/selectors';
import { electionsSelector } from 'selectors/electionsSelector';

// components
import VoteEntryTab from './VoteEntryTab';
import ResultsViewTab from './ResultsViewTab';
import AuditTrailTab from './AuditTrailTab';

// ============================================================================
// TAB PANEL COMPONENT
// ============================================================================

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`sorting-tabpanel-${index}`} aria-labelledby={`sorting-tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

// ============================================================================
// STATISTICS CARD COMPONENT
// ============================================================================

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h2" sx={{ my: 1, color }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}15`,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Sorting: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  // Local state
  const [currentTab, setCurrentTab] = useState(0);

  // Redux state
  const { statistics, loading } = useAppSelector(votingSelector);
  const votingMetrics = useAppSelector(selectVotingCompletionMetrics);
  const { currentElection } = useAppSelector(electionsSelector);

  // Fetch data on mount
  useEffect(() => {
    if (currentElection) {
      dispatch(getVotingStatisticsRequest(currentElection.id));
      dispatch(getCandidatesRequest(currentElection.id));
      dispatch(getPartiesRequest(currentElection.id));
      dispatch(getVoteCountsRequest({ election: currentElection.id }));
    }
  }, [dispatch, currentElection]);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Refresh handler
  const handleRefresh = () => {
    if (currentElection) {
      dispatch(getVotingStatisticsRequest(currentElection.id));
      dispatch(getCandidatesRequest(currentElection.id));
      dispatch(getPartiesRequest(currentElection.id));
      dispatch(getVoteCountsRequest({ election: currentElection.id }));
    }
  };

  // Header actions
  const headerActions: HeaderAction[] = [
    {
      label: 'Refresh',
      icon: <IconRefresh />,
      onClick: handleRefresh,
      tooltip: 'Refresh voting statistics',
      type: 'iconButton',
      disabled: loading
    }
  ];

  // Show alert if no election is active
  if (!currentElection) {
    return (
      <PremiumCard variant="elevated" padding={0}>
        <PremiumPageHeader
          title="Vote Counting (Sorting)"
          subtitle="Enter and track vote counts for election committees"
          icon={<IconChartBar />}
        />
        <Box sx={{ p: (theme) => theme.layoutSpacing?.shell?.padding?.md ?? theme.spacing(3) }}>
          <Alert severity="warning">No active election found. Please create or activate an election to start vote counting.</Alert>
        </Box>
      </PremiumCard>
    );
  }

  const completionPercentLabel = `${(votingMetrics.committeeCompletion * 100).toFixed(0)}% complete`;
  const verificationRateLabel = `${(votingMetrics.verificationRate * 100).toFixed(0)}% verified`;
  const disputeRateLabel = `${(votingMetrics.disputeRate * 100).toFixed(1)}% disputed`;

  return (
    <PremiumCard variant="elevated" padding={0}>
      {/* Premium Header */}
      <PremiumPageHeader
        title="Vote Counting (Sorting)"
        subtitle="Enter and track vote counts for election committees"
        icon={<IconChartBar />}
        actions={headerActions}
        chips={
          statistics
            ? [
                { label: `Total: ${statistics.total_committees}`, background: 'rgba(255, 255, 255, 0.25)' },
                { label: `Completed: ${statistics.committees_completed}`, background: 'rgba(76, 175, 80, 0.3)' },
                { label: `Coverage: ${completionPercentLabel}`, background: 'rgba(33, 150, 243, 0.3)' },
                { label: `Ballots: ${statistics.total_ballots_cast.toLocaleString()}`, background: 'rgba(255, 255, 255, 0.15)' }
              ]
            : undefined
        }
      />

      <Box sx={{ p: (theme) => theme.layoutSpacing?.shell?.padding?.md ?? theme.spacing(3) }}>
        {/* Statistics Dashboard */}
        {statistics && (
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                  title="Total Committees"
                  value={statistics.total_committees}
                  icon={<VoteIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />}
                  color={theme.palette.primary.main}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                  title="Completed"
                  value={statistics.committees_completed}
                  icon={<CheckCircleIcon sx={{ fontSize: 32, color: theme.palette.success.main }} />}
                  color={theme.palette.success.main}
                  subtitle={`${statistics.committees_pending} pending • ${completionPercentLabel}`}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                  title="Total Ballots Cast"
                  value={statistics.total_ballots_cast.toLocaleString()}
                  icon={<AssessmentIcon sx={{ fontSize: 32, color: theme.palette.info.main }} />}
                  color={theme.palette.info.main}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                  title="Verified Entries"
                  value={statistics.verified_entries}
                  icon={<PendingIcon sx={{ fontSize: 32, color: theme.palette.warning.main }} />}
                  color={theme.palette.warning.main}
                  subtitle={`${statistics.pending_entries} pending • ${verificationRateLabel}`}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard
                  title="Disputed Entries"
                  value={statistics.disputed_entries}
                  icon={<WarningAmberIcon sx={{ fontSize: 32, color: theme.palette.error.main }} />}
                  color={theme.palette.error.main}
                  subtitle={disputeRateLabel}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="sorting tabs">
            <Tab
              icon={<IconEdit size={20} />}
              iconPosition="start"
              label="Vote Entry"
              id="sorting-tab-0"
              aria-controls="sorting-tabpanel-0"
            />
            <Tab icon={<AssessmentIcon />} iconPosition="start" label="Results" id="sorting-tab-1" aria-controls="sorting-tabpanel-1" />
            <Tab icon={<HistoryIcon />} iconPosition="start" label="Audit Trail" id="sorting-tab-2" aria-controls="sorting-tabpanel-2" />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={currentTab} index={0}>
          <VoteEntryTab />
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <ResultsViewTab />
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <AuditTrailTab />
        </TabPanel>

        {/* Loading Overlay */}
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              zIndex: 1000
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>
    </PremiumCard>
  );
};

export default Sorting;
