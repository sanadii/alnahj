/**
 * Committees Table Component
 * Election Management System - Display committees list
 */

import React from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, People as PeopleIcon } from '@mui/icons-material';
import { IconEdit } from '@tabler/icons-react';
import type { Committee } from 'types/elections';
import { CommitteeGenderLabels, getCommitteeGenderColor } from 'types/elections';

interface CommitteesTableProps {
  committees: Committee[];
  electionId: number;
  onEdit?: (committee: Committee) => void;
  onDelete?: (id: number) => void;
  onCreate?: () => void;
}

const CommitteesTable: React.FC<CommitteesTableProps> = ({ committees, electionId, onEdit, onDelete, onCreate }) => {
  return (
    <Box>
      {/* Header Actions */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={onCreate}>
          Add Committee
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Elector Range</TableCell>
              <TableCell>Total Electors</TableCell>
              <TableCell>Staff</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {committees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Box sx={{ py: 3 }}>
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                      No committees yet
                    </Typography>
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={onCreate} sx={{ mt: 1 }}>
                      Add First Committee
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              committees.map((committee) => (
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
                        color: 'white'
                      }}
                    />
                  </TableCell>
                  <TableCell>{committee.location || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={`${(committee as any).electorsFrom || '-'} to ${(committee as any).electorsTo || '-'}`}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip label={committee.electorCount || 0} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip icon={<PeopleIcon />} label={committee.assignedUsers?.length || 0} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <Tooltip title="Edit">
                        <IconButton size="small" color="primary" onClick={() => onEdit?.(committee)}>
                          <IconEdit size={16} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => onDelete?.(committee.id)}>
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
      </TableContainer>
    </Box>
  );
};

export default CommitteesTable;
