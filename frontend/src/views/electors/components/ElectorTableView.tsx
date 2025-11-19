import React from 'react';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Typography,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconEdit } from '@tabler/icons-react';
import ElectorActionButtons from './ElectorActionButtons';
import type { Elector } from 'types/electors';
import type { GuaranteeStatus } from 'types/guarantees';

interface ElectorTableViewProps {
  electors: Elector[];
  addingGuarantee: string | null;
  removingGuarantee: string | null;
  onAddToGuarantees: (elector: Elector, status: GuaranteeStatus) => void;
  onRemoveFromGuarantees: (elector: Elector) => void;
  onViewElector: (kocId: string) => void;
  onEditElector: (kocId: string) => void;
  onDeleteElector: (kocId: string, name: string) => void;
}

const ElectorTableView: React.FC<ElectorTableViewProps> = ({
  electors,
  addingGuarantee,
  removingGuarantee,
  onAddToGuarantees,
  onRemoveFromGuarantees,
  onViewElector,
  onEditElector,
  onDeleteElector
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>KOC ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Mobile</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Team</TableCell>
            <TableCell align="center">Actions</TableCell>
            <TableCell align="right">Admin</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {electors.map((elector) => (
            <TableRow key={elector.kocId} hover>
              <TableCell>
                <Chip
                  label={elector.kocId}
                  size="small"
                  sx={{
                    bgcolor: (elector.gender || '').toUpperCase() === 'MALE' ? '#3b82f6' : '#ec4899',
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: (elector.gender || '').toUpperCase() === 'MALE' ? '#2563eb' : '#db2777'
                    }
                  }}
                />
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2">{elector.fullName}</Typography>
                  {!elector.isActive && (
                    <Chip
                      label="Inactive"
                      size="small"
                      color="default"
                      variant="outlined"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        textTransform: 'uppercase'
                      }}
                    />
                  )}
                </Stack>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{elector.mobile || '-'}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                  {elector.department || '-'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                  {elector.team || '-'}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <ElectorActionButtons
                  guaranteeStatus={elector.guaranteeStatus}
                  isAdding={addingGuarantee === elector.kocId}
                  isRemoving={removingGuarantee === elector.kocId}
                  onAddGuaranteed={() => onAddToGuarantees(elector, 'GUARANTEED')}
                  onAddPending={() => onAddToGuarantees(elector, 'PENDING')}
                  onRemove={elector.guaranteeStatus ? () => onRemoveFromGuarantees(elector) : undefined}
                  onView={() => onViewElector(elector.kocId)}
                />
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center">
                  <Tooltip title="Edit">
                    <IconButton size="small" color="primary" onClick={() => onEditElector(elector.kocId)}>
                      <IconEdit size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => onDeleteElector(elector.kocId, elector.fullName || 'Unknown')}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ElectorTableView;

