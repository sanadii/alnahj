import React from 'react';
import { Box, Stack, Typography, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Avatar, IconButton, Tooltip, Chip } from '@mui/material';
import { IconPlus, IconEye, IconEdit, IconTrash } from '@tabler/icons-react';

interface CandidatesTabProps {
  candidates: any[];
  onAddCandidate: () => void;
  onViewCandidate: (candidateId: number) => void;
  onEditCandidate: (candidateId: number) => void;
  onDeleteCandidate: (candidateId: number, candidateName: string) => void;
}

const CandidatesTab: React.FC<CandidatesTabProps> = ({
  candidates,
  onAddCandidate,
  onViewCandidate,
  onEditCandidate,
  onDeleteCandidate
}) => {
  return (
    <Box sx={{ p: (theme) => theme.layoutSpacing?.shell?.padding?.md ?? theme.spacing(3) }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3, px: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          Manage Candidates
        </Typography>
        <Button variant="contained" startIcon={<IconPlus size={18} />} onClick={onAddCandidate}>
          Add Candidate
        </Button>
      </Stack>
      <TableContainer component={Paper} variant="outlined" sx={{ mx: 0 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={80}>Photo</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Party</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    No candidates added yet
                  </Typography>
                  <Button variant="outlined" startIcon={<IconPlus />} onClick={onAddCandidate} sx={{ mt: 1 }}>
                    Add First Candidate
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              candidates.map((candidate: any) => (
                <TableRow key={candidate.id} hover>
                  <TableCell>
                    <Avatar
                      src={candidate.photo}
                      alt={candidate.name}
                      sx={{
                        width: 48,
                        height: 48,
                        border: '2px solid',
                        borderColor: 'primary.main'
                      }}
                    >
                      {candidate.name?.charAt(0) || candidate.candidateNumber}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Chip label={candidate.candidateNumber} size="small" color="primary" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {candidate.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {candidate.partyName ? (
                      <Chip
                        label={candidate.partyName}
                        size="small"
                        sx={{
                          backgroundColor: candidate.partyColor || '#1976d2',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    ) : (
                      <Chip label="Independent" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={candidate.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={candidate.isActive ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton size="small" color="primary" onClick={() => onViewCandidate(candidate.id)}>
                        <IconEye size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" color="info" onClick={() => onEditCandidate(candidate.id)}>
                        <IconEdit size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => onDeleteCandidate(candidate.id, candidate.name)}>
                        <IconTrash size={18} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CandidatesTab;


