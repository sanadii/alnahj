import React from 'react';
import { Box, Stack, Typography, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Avatar, IconButton, Tooltip } from '@mui/material';
import { IconPlus, IconEye, IconEdit, IconTrash } from '@tabler/icons-react';

interface PartiesTabProps {
  parties: any[];
  onAddParty: () => void;
  onViewParty: (partyId: number) => void;
  onEditParty: (partyId: number) => void;
  onDeleteParty: (partyId: number, partyName: string) => void;
}

const PartiesTab: React.FC<PartiesTabProps> = ({ parties, onAddParty, onViewParty, onEditParty, onDeleteParty }) => {
  return (
    <Box sx={{ p: (theme) => theme.layoutSpacing?.shell?.padding?.md ?? theme.spacing(3) }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3, px: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          Manage Parties
        </Typography>
        <Button variant="contained" startIcon={<IconPlus size={18} />} onClick={onAddParty}>
          Add Party
        </Button>
      </Stack>
      <TableContainer component={Paper} variant="outlined" sx={{ mx: 0 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Logo</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Candidates</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    No parties added yet
                  </Typography>
                  <Button variant="outlined" startIcon={<IconPlus />} onClick={onAddParty} sx={{ mt: 1 }}>
                    Add First Party
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              parties.map((party: any) => (
                <TableRow key={party.id} hover>
                  <TableCell>
                    {party.logo ? (
                      <Avatar
                        src={party.logo}
                        alt={party.name}
                        variant="rounded"
                        sx={{ width: 40, height: 40, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1.5,
                          backgroundColor: party.color || '#ccc',
                          border: '1px solid rgba(0, 0, 0, 0.12)'
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: 0.5,
                          backgroundColor: party.color || '#ccc',
                          border: '1px solid rgba(0, 0, 0, 0.12)'
                        }}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        {party.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{party.candidateCount || 0}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton size="small" color="primary" onClick={() => onViewParty(party.id)}>
                        <IconEye size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" color="info" onClick={() => onEditParty(party.id)}>
                        <IconEdit size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => onDeleteParty(party.id, party.name)}>
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

export default PartiesTab;

