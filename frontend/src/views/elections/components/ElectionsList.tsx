/**
 * Elections List Page
 * Election Management System - Display all elections with filters and actions
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';

// icons
import {
  Add as AddIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

// project imports
import { PremiumCard, DeleteConfirmationDialog } from 'shared/components';
import { IconCalendarEvent, IconEdit } from '@tabler/icons-react';
import { getElectionsRequest, deleteElectionRequest, setElectionFilters } from 'store/elections';
import type { Election, ElectionStatus } from 'types/elections';
import { ElectionStatusLabels, getElectionStatusColor, formatElectionDate } from 'types/elections';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ElectionsList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { elections, loading, totalCount, currentPage, pageSize, filters } = useSelector((state: any) => state.elections);

  // Local state
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');

  // Delete dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [electionToDelete, setElectionToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch elections on mount and when filters change
  useEffect(() => {
    dispatch(getElectionsRequest(filters));
  }, [dispatch, filters]);

  // ========== HANDLERS ==========

  const handleSearch = () => {
    dispatch(
      setElectionFilters({
        ...filters,
        search: searchTerm,
        page: 1
      })
    );
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    dispatch(
      setElectionFilters({
        ...filters,
        status: status as ElectionStatus | '',
        page: 1
      })
    );
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    dispatch(
      setElectionFilters({
        ...filters,
        page: newPage + 1
      })
    );
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setElectionFilters({
        ...filters,
        pageSize: parseInt(event.target.value, 10),
        page: 1
      })
    );
  };

  const handleCreateElection = () => {
    navigate('/elections/create');
  };

  const handleViewElection = (id: number) => {
    navigate(`/elections/${id}`);
  };

  const handleEditElection = (id: number) => {
    navigate(`/elections/edit/${id}`);
  };

  const handleDeleteElection = (id: number, name: string) => {
    setElectionToDelete({ id, name });
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!electionToDelete) return;

    setIsDeleting(true);
    try {
      dispatch(deleteElectionRequest(electionToDelete.id));
      setShowDeleteDialog(false);
      setElectionToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setElectionToDelete(null);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
  };

  // ========== RENDER ==========

  return (
    <>
      <PremiumCard title="Elections Management" icon={<IconCalendarEvent size={24} />} variant="elevated" color="primary">
        {/* Header Actions */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            {/* Search */}
            <Grid size={{ xs: 12, md: 5 }}>
              <TextField
                fullWidth
                placeholder="Search elections by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Status Filter */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField select fullWidth label="Status" value={statusFilter} onChange={(e) => handleStatusFilterChange(e.target.value)}>
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="SETUP">Setup</MenuItem>
                <MenuItem value="GUARANTEE_PHASE">Guarantee Phase</MenuItem>
                <MenuItem value="VOTING_DAY">Voting Day</MenuItem>
                <MenuItem value="COUNTING">Counting</MenuItem>
                <MenuItem value="CLOSED">Closed</MenuItem>
              </TextField>
            </Grid>

            {/* Action Buttons */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport}>
                  Export
                </Button>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateElection}>
                  Create Election
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Elections Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Voting Date</TableCell>
                <TableCell>Committees</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : elections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Box sx={{ py: 3 }}>
                      <Typography variant="body1" color="textSecondary">
                        No elections found
                      </Typography>
                      <Button variant="outlined" startIcon={<AddIcon />} onClick={handleCreateElection} sx={{ mt: 2 }}>
                        Create First Election
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                elections.map((election: Election) => (
                  <TableRow key={election.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2">{election.name}</Typography>
                      {election.description && (
                        <Typography variant="caption" color="textSecondary">
                          {election.description.substring(0, 60)}
                          {election.description.length > 60 ? '...' : ''}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ElectionStatusLabels[election.status]}
                        size="small"
                        sx={{
                          backgroundColor: getElectionStatusColor(election.status),
                          color: 'white',
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell>{formatElectionDate(election.electionDate)}</TableCell>
                    <TableCell>
                      <Chip label={election.committeeCount || 0} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="View Details">
                          <IconButton size="small" color="info" onClick={() => handleViewElection(election.id)}>
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" color="primary" onClick={() => handleEditElection(election.id)}>
                            <IconEdit size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDeleteElection(election.id, election.name)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalCount}
            rowsPerPage={pageSize}
            page={currentPage - 1}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handlePageSizeChange}
          />
        </TableContainer>
      </PremiumCard>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        title="Delete Election"
        itemName={electionToDelete?.name || ''}
        itemType="election"
        warningMessage="This will permanently delete this election and all associated committees, parties, and candidates. This action cannot be undone."
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default ElectionsList;
