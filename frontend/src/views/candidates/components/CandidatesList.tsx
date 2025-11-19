/**
 * Candidates List Page
 * Election Management System - Display all candidates with filters and actions
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

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
  Avatar
} from '@mui/material';

import { Add as AddIcon, Search as SearchIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';

import { PremiumCard, DeleteConfirmationDialog } from 'shared/components';
import { IconUsers, IconEdit } from '@tabler/icons-react';

const CandidatesList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Delete dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSearch = () => {
  };

  const handleCreateCandidate = () => {
    navigate('/candidates/create');
  };

  const handleEditCandidate = (id: number) => {
    navigate(`/candidates/edit/${id}`);
  };

  const handleDeleteCandidate = (id: number, name: string) => {
    setCandidateToDelete({ id, name });
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!candidateToDelete) return;

    setIsDeleting(true);
    try {
      // TODO: Implement actual delete API call
      setShowDeleteDialog(false);
      setCandidateToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setCandidateToDelete(null);
  };

  return (
    <>
      <PremiumCard title="Candidates Management" icon={<IconUsers size={24} />} variant="elevated" color="primary">
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="Search candidates by name or number..."
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

            <Grid size={{ xs: 12, md: 6 }}>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateCandidate}>
                  Add Candidate
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Number</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Party</TableCell>
                <TableCell>Election</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Votes</TableCell>
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
              ) : candidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box sx={{ py: 3 }}>
                      <Typography variant="body1" color="textSecondary">
                        No candidates found
                      </Typography>
                      <Button variant="outlined" startIcon={<AddIcon />} onClick={handleCreateCandidate} sx={{ mt: 2 }}>
                        Add First Candidate
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                candidates.map((candidate) => (
                  <TableRow key={candidate.id} hover>
                    <TableCell>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>{candidate.number}</Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{candidate.name}</Typography>
                    </TableCell>
                    <TableCell>{candidate.party}</TableCell>
                    <TableCell>{candidate.election}</TableCell>
                    <TableCell>
                      <Chip
                        label={candidate.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={candidate.isActive ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={candidate.votes || 0} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="Edit">
                          <IconButton size="small" color="primary" onClick={() => handleEditCandidate(candidate.id)}>
                            <IconEdit size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDeleteCandidate(candidate.id, candidate.name)}>
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

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={candidates.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
          />
        </TableContainer>
      </PremiumCard>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        title="Delete Candidate"
        itemName={candidateToDelete?.name || ''}
        itemType="candidate"
        warningMessage="This will permanently delete this candidate and all associated data."
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default CandidatesList;
