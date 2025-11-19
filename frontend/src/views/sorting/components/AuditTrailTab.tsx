/**
 * Audit Trail Tab Component
 * View history and audit logs of vote counts
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TablePagination,
  TextField,
  MenuItem,
  Grid,
  Stack
} from '@mui/material';

// icons
import { CheckCircle as VerifiedIcon, Pending as PendingIcon, Error as DisputedIcon, Person as PersonIcon } from '@mui/icons-material';

// project imports
import { RootState } from 'store';
import { getVoteCountsRequest, setVoteCountFilters } from 'store/voting';
import { getCommitteesRequest } from 'store/committees';
import { formatVoteCount, getStatusBadgeProps } from 'types/voting';

// ============================================================================
// AUDIT TRAIL TAB COMPONENT
// ============================================================================

const AuditTrailTab: React.FC = () => {
  const dispatch = useDispatch();

  // Redux state
  const { voteCounts, totalCount, currentPage, pageSize, filters } = useSelector((state: RootState) => state.voting);
  const { committees } = useSelector((state: RootState) => state.committees);
  const { currentElection } = useSelector((state: RootState) => state.elections);

  // Local state
  const [committeeFilter, setCommitteeFilter] = React.useState<number | ''>('');
  const [statusFilter, setStatusFilter] = React.useState<string>('');

  // Fetch data on mount
  useEffect(() => {
    if (currentElection) {
      dispatch(getVoteCountsRequest({ election: currentElection.id, ...filters }));
      dispatch(getCommitteesRequest({ election: currentElection.id }));
    }
  }, [dispatch, currentElection, filters]);

  // Handle committee filter change
  const handleCommitteeFilterChange = (value: number | '') => {
    setCommitteeFilter(value);
    dispatch(
      setVoteCountFilters({
        ...filters,
        committee: value || undefined,
        page: 1
      })
    );
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    dispatch(
      setVoteCountFilters({
        ...filters,
        status: value as any,
        page: 1
      })
    );
  };

  // Handle page change
  const handlePageChange = (event: unknown, newPage: number) => {
    dispatch(
      setVoteCountFilters({
        ...filters,
        page: newPage + 1
      })
    );
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setVoteCountFilters({
        ...filters,
        pageSize: parseInt(event.target.value, 10),
        page: 1
      })
    );
  };

  return (
    <Box>
      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Filter Vote Counts
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                select
                fullWidth
                label="Committee"
                value={committeeFilter}
                onChange={(e) => handleCommitteeFilterChange(e.target.value as number | '')}
              >
                <MenuItem value="">All Committees</MenuItem>
                {committees.map((committee) => (
                  <MenuItem key={committee.id} value={committee.id}>
                    {committee.code} - {committee.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField select fullWidth label="Status" value={statusFilter} onChange={(e) => handleStatusFilterChange(e.target.value)}>
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="VERIFIED">Verified</MenuItem>
                <MenuItem value="DISPUTED">Disputed</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Vote Counts Table */}
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Vote Count Audit Trail
          </Typography>

          {voteCounts.length === 0 ? (
            <Alert severity="info">No vote count entries found. Start entering votes to see the audit trail.</Alert>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Committee</TableCell>
                      <TableCell>Candidate</TableCell>
                      <TableCell align="right">Vote Count</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Entered By</TableCell>
                      <TableCell>Verified By</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {voteCounts.map((voteCount) => {
                      const statusProps = getStatusBadgeProps(voteCount.status);
                      return (
                        <TableRow key={voteCount.id} hover>
                          <TableCell>{voteCount.id}</TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {voteCount.committee_code}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {voteCount.committee_name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              #{voteCount.candidate_number}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {voteCount.candidate_name}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="h6">{formatVoteCount(voteCount.vote_count)}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={
                                voteCount.status === 'VERIFIED' ? (
                                  <VerifiedIcon />
                                ) : voteCount.status === 'DISPUTED' ? (
                                  <DisputedIcon />
                                ) : (
                                  <PendingIcon />
                                )
                              }
                              label={statusProps.label}
                              color={statusProps.color}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <PersonIcon fontSize="small" color="action" />
                              <Typography variant="body2">{voteCount.entered_by_name}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            {voteCount.is_verified && voteCount.verified_by_name ? (
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <PersonIcon fontSize="small" color="action" />
                                <Typography variant="body2">{voteCount.verified_by_name}</Typography>
                              </Stack>
                            ) : (
                              <Typography variant="caption" color="textSecondary">
                                Not verified
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{new Date(voteCount.created_at).toLocaleDateString()}</Typography>
                            <Typography variant="caption" color="textSecondary">
                              {new Date(voteCount.created_at).toLocaleTimeString()}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={totalCount}
                rowsPerPage={pageSize}
                page={currentPage - 1}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuditTrailTab;
