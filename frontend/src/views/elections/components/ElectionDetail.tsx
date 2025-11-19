/**
 * Election Detail Page
 * Election Management System - View election details with committees, candidates, and parties
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Chip,
  Grid,
  Stack,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  IconEdit,
  IconCalendarEvent,
  IconSettings,
  IconUsersGroup,
  IconUserCheck,
  IconFlag,
  IconPlus,
  IconTrash
} from '@tabler/icons-react';
import PremiumCard from 'shared/components/cards/PremiumCard';
import { getElectionRequest } from 'store/elections';
import { getCommitteesRequest } from 'store/committees';
import { ElectionStatusLabels, VotingModeLabels, getElectionStatusColor, formatElectionDate } from 'types/elections';
import CommitteesTable from './CommitteesTable';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`election-tabpanel-${index}`} aria-labelledby={`election-tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ElectionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);

  const { currentElection, loading } = useSelector((state: any) => state.elections);
  const { committees } = useSelector((state: any) => state.committees);

  useEffect(() => {
    if (id) {
      dispatch(getElectionRequest(parseInt(id)));
      dispatch(getCommitteesRequest({ election: parseInt(id) }));
    }
  }, [dispatch, id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <MainCard title="Election Details">
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      </MainCard>
    );
  }

  if (!currentElection) {
    return (
      <MainCard title="Election Details">
        <Typography>Election not found</Typography>
      </MainCard>
    );
  }

  return (
    <MainCard
      title="Election Details"
      secondary={
        <Button variant="contained" startIcon={<IconEdit size={18} />} onClick={() => navigate(`/elections/edit/${id}`)}>
          Edit Election
        </Button>
      }
    >
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <PremiumCard title="Basic Information" icon={<IconCalendarEvent size={20} />} color="info" variant="elevated">
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <Box>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  fontWeight={600}
                  sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                >
                  Election Name
                </Typography>
                <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 600 }}>
                  {currentElection.name}
                </Typography>
              </Box>

              {currentElection.description && (
                <Box>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    fontWeight={600}
                    sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                  >
                    Description
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {currentElection.description}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  fontWeight={600}
                  sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                >
                  Status
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={ElectionStatusLabels[currentElection.status]}
                    sx={{
                      backgroundColor: getElectionStatusColor(currentElection.status),
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </Box>
              </Box>
            </Stack>
          </PremiumCard>
        </Grid>

        {/* Voting Configuration */}
        <Grid size={{ xs: 12, md: 6 }}>
          <PremiumCard title="Voting Configuration" icon={<IconSettings size={20} />} color="success" variant="elevated">
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <Box>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  fontWeight={600}
                  sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                >
                  Voting Mode
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                  {VotingModeLabels[currentElection.votingMode]}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  fontWeight={600}
                  sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                >
                  Max Candidates Per Ballot
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                  {currentElection.maxCandidatesPerBallot}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  fontWeight={600}
                  sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                >
                  Allow Partial Voting
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={currentElection.allowPartialVoting ? 'Yes' : 'No'}
                    size="small"
                    color={currentElection.allowPartialVoting ? 'success' : 'default'}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  fontWeight={600}
                  sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                >
                  Minimum Votes Required
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                  {currentElection.minimumVotesRequired}
                </Typography>
              </Box>
            </Stack>
          </PremiumCard>
        </Grid>

        {/* Important Dates */}
        <Grid size={12}>
          <PremiumCard title="Important Dates" icon={<IconCalendarEvent size={20} />} color="warning" variant="elevated">
            <Grid container spacing={3} sx={{ mt: 0.5 }}>
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(46, 125, 50, 0.08)',
                    border: '1px solid rgba(46, 125, 50, 0.2)',
                    height: '100%'
                  }}
                >
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    fontWeight={600}
                    sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                  >
                    Election Date
                  </Typography>
                  <Typography variant="h6" fontWeight={600} sx={{ mt: 1 }} color="success.main">
                    {formatElectionDate(currentElection.electionDate)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </PremiumCard>
        </Grid>

        {/* Tabs for Committees, Candidates, Parties */}
        <Grid size={12}>
          <PremiumCard variant="elevated" padding={0}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="election management tabs"
                sx={{
                  px: 3,
                  '& .MuiTab-root': {
                    minHeight: 64,
                    fontSize: '1rem',
                    fontWeight: 600
                  }
                }}
              >
                <Tab icon={<IconUsersGroup size={20} />} iconPosition="start" label={`Committees (${committees.length})`} />
                <Tab icon={<IconUserCheck size={20} />} iconPosition="start" label="Candidates (0)" />
                <Tab icon={<IconFlag size={20} />} iconPosition="start" label="Parties (0)" />
              </Tabs>
            </Box>

            {/* Committees Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ px: 3, pb: 3 }}>
                <CommitteesTable committees={committees} electionId={parseInt(id || '0')} />
              </Box>
            </TabPanel>

            {/* Candidates Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ px: 3, pb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h5">Manage Candidates</Typography>
                  <Button variant="contained" startIcon={<IconPlus size={18} />} onClick={() => navigate('/candidates/create')}>
                    Add Candidate
                  </Button>
                </Stack>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Number</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Party</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="textSecondary" gutterBottom>
                            No candidates added yet
                          </Typography>
                          <Button variant="outlined" startIcon={<IconPlus />} onClick={() => navigate('/candidates/create')} sx={{ mt: 1 }}>
                            Add First Candidate
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </TabPanel>

            {/* Parties Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ px: 3, pb: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h5">Manage Parties</Typography>
                  <Button variant="contained" startIcon={<IconPlus size={18} />} onClick={() => navigate('/parties/create')}>
                    Add Party
                  </Button>
                </Stack>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Color</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Abbreviation</TableCell>
                        <TableCell>Candidates</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="textSecondary" gutterBottom>
                            No parties added yet
                          </Typography>
                          <Button variant="outlined" startIcon={<IconPlus />} onClick={() => navigate('/parties/create')} sx={{ mt: 1 }}>
                            Add First Party
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </TabPanel>
          </PremiumCard>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default ElectionDetail;
