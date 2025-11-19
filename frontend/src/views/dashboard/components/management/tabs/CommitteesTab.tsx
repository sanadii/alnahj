import React from 'react';
import { Box, Stack, Typography, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Tooltip, Chip } from '@mui/material';
import { IconPlus, IconUsers, IconEye, IconEdit, IconTrash } from '@tabler/icons-react';

interface CommitteesTabProps {
  committees: any[];
  onAssignElectors: () => void;
  onAddCommittee: () => void;
  onViewCommittee: (committeeId: number) => void;
  onEditCommittee: (committeeId: number) => void;
  onDeleteCommittee: (committeeId: number, committeeName: string) => void;
}

const CommitteesTab: React.FC<CommitteesTabProps> = ({
  committees,
  onAssignElectors,
  onAddCommittee,
  onViewCommittee,
  onEditCommittee,
  onDeleteCommittee
}) => {
  return (
    <Box sx={{ p: (theme) => theme.layoutSpacing?.shell?.padding?.md ?? theme.spacing(3) }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3, px: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          Manage Committees
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<IconUsers size={18} />}
            onClick={onAssignElectors}
            disabled={committees.length === 0}
          >
            Assign Electors To Committees
          </Button>
          <Button variant="contained" startIcon={<IconPlus size={18} />} onClick={onAddCommittee}>
            Add Committee
          </Button>
        </Stack>
      </Stack>
      <TableContainer component={Paper} variant="outlined" sx={{ mx: 0 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Elector Range</TableCell>
              <TableCell>Total Electors</TableCell>
              <TableCell>Assigned Staff</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {committees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    No committees added yet
                  </Typography>
                  <Button variant="outlined" startIcon={<IconPlus />} onClick={onAddCommittee} sx={{ mt: 1 }}>
                    Add First Committee
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              committees.map((committee: any) => (
                <TableRow key={committee.id} hover>
                  <TableCell>
                    <Chip label={committee.code} size="small" color="primary" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {committee.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={committee.genderDisplay || committee.gender || 'N/A'}
                      size="small"
                      color={committee.gender === 'MALE' ? 'info' : committee.gender === 'FEMALE' ? 'secondary' : 'default'}
                      sx={{
                        fontWeight: 600
                      }}
                    />
                  </TableCell>
                  <TableCell>{committee.location || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={`${committee.electorsFrom || '-'} to ${committee.electorsTo || '-'}`}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{(committee.electorCount || 0).toLocaleString()}</Typography>
                  </TableCell>
                  <TableCell>{committee.assignedUsers?.length || 0}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton size="small" color="primary" onClick={() => onViewCommittee(committee.id)}>
                        <IconEye size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" color="info" onClick={() => onEditCommittee(committee.id)}>
                        <IconEdit size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => onDeleteCommittee(committee.id, committee.name)}>
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

export default CommitteesTab;


