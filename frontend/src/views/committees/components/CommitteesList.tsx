/**
 * Committees List Page
 * Election Management System - Display all committees with filters and actions
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
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';

// icons
import {
  Add as AddIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  People as PeopleIcon
} from '@mui/icons-material';

// project imports
import { PremiumCard, DeleteConfirmationDialog, PremiumPageHeader } from 'shared/components';
import type { HeaderAction } from 'shared/components';
import { IconBuildingCommunity, IconPlus, IconRefresh, IconEdit } from '@tabler/icons-react';
import { getCommitteesRequest, deleteCommitteeRequest, setCommitteeFilters } from 'store/committees';
import type { Committee, CommitteeGender } from 'types/elections';
import { CommitteeGenderLabels, getCommitteeGenderColor } from 'types/elections';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const CommitteesList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { committees, loading, totalCount, currentPage, pageSize, filters } = useSelector((state: any) => state.committees);

  // Local state
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [genderFilter, setGenderFilter] = useState(filters.gender || '');

  // Delete dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [committeeToDelete, setCommitteeToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch committees on mount and when filters change
  useEffect(() => {
    dispatch(getCommitteesRequest(filters));
  }, [dispatch, filters]);

  // ========== HANDLERS ==========

  const handleSearch = () => {
    dispatch(
      setCommitteeFilters({
        ...filters,
        search: searchTerm,
        page: 1
      })
    );
  };

  const handleGenderFilterChange = (gender: string) => {
    setGenderFilter(gender);
    dispatch(
      setCommitteeFilters({
        ...filters,
        gender: gender as CommitteeGender | '',
        page: 1
      })
    );
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    dispatch(
      setCommitteeFilters({
        ...filters,
        page: newPage + 1
      })
    );
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setCommitteeFilters({
        ...filters,
        pageSize: parseInt(event.target.value, 10),
        page: 1
      })
    );
  };

  const handleCreateCommittee = () => {
    navigate('/committees/create');
  };

  const handleViewCommittee = (id: number) => {
    navigate(`/committees/${id}`);
  };

  const handleEditCommittee = (id: number) => {
    navigate(`/committees/edit/${id}`);
  };

  const handleDeleteCommittee = (id: number, name: string) => {
    setCommitteeToDelete({ id, name });
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!committeeToDelete) return;

    setIsDeleting(true);
    try {
      dispatch(deleteCommitteeRequest(committeeToDelete.id));
      setShowDeleteDialog(false);
      setCommitteeToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setCommitteeToDelete(null);
  };

  // ========== RENDER ==========

  // Header actions configuration
  const headerActions: HeaderAction[] = [
    {
      icon: <IconRefresh />,
      onClick: () => dispatch(getCommitteesRequest(filters)),
      tooltip: 'Refresh data',
      type: 'iconButton',
      disabled: loading
    },
    {
      label: 'Add Committee',
      icon: <IconPlus />,
      onClick: () => navigate('/committees/create'),
      variant: 'contained'
    }
  ];

  return (
    <>
      <PremiumCard variant="elevated" hover={false} padding={0}>
        {/* Premium Header */}
        <PremiumPageHeader
          title="Committees Management"
          subtitle="Manage election committees and their members"
          icon={<IconBuildingCommunity />}
          actions={headerActions}
          chips={[
            { label: `Total: ${totalCount}`, background: 'rgba(255, 255, 255, 0.25)' },
            {
              label: committees.length > 0 ? `Showing ${committees.length} of ${totalCount}` : 'No committees',
              background: 'rgba(255, 255, 255, 0.15)'
            }
          ]}
        />

        <Box sx={{ p: 3 }}>
          {/* Header Actions */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              {/* Search */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  placeholder="Search committees by code or name..."
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

              {/* Gender Filter */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField select fullWidth label="Gender" value={genderFilter} onChange={(e) => handleGenderFilterChange(e.target.value)}>
                  <MenuItem value="">All Genders</MenuItem>
                  <MenuItem value="MALE">Male</MenuItem>
                  <MenuItem value="FEMALE">Female</MenuItem>
                </TextField>
              </Grid>

              {/* Action Buttons */}
              <Grid size={{ xs: 12, md: 3 }}>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateCommittee} fullWidth>
                    Create Committee
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>

          {/* Committees Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Electors</TableCell>
                  <TableCell>Staff</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : committees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Box sx={{ py: 3 }}>
                        <Typography variant="body1" color="textSecondary">
                          No committees found
                        </Typography>
                        <Button variant="outlined" startIcon={<AddIcon />} onClick={handleCreateCommittee} sx={{ mt: 2 }}>
                          Create First Committee
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  committees.map((committee: Committee) => (
                    <TableRow key={committee.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {committee.code}
                        </Typography>
                      </TableCell>
                      <TableCell>{committee.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={CommitteeGenderLabels[committee.gender]}
                          size="small"
                          sx={{
                            backgroundColor: getCommitteeGenderColor(committee.gender),
                            color: 'white',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>{committee.location || '-'}</TableCell>
                      <TableCell>
                        <Chip label={committee.electorCount || 0} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip icon={<PeopleIcon />} label={committee.assignedUsers?.length || 0} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title="View Details">
                            <IconButton size="small" color="info" onClick={() => handleViewCommittee(committee.id)}>
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small" color="primary" onClick={() => handleEditCommittee(committee.id)}>
                              <IconEdit size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => handleDeleteCommittee(committee.id, committee.code)}>
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
        </Box>
      </PremiumCard>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        title="Delete Committee"
        itemName={committeeToDelete?.name || ''}
        itemType="committee"
        warningMessage="This will permanently delete this committee and all associated data. This action cannot be undone."
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default CommitteesList;
