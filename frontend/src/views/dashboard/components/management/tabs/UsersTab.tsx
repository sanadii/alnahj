import React from 'react';
import { Box, Stack, Typography, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Tooltip, Chip, CircularProgress } from '@mui/material';
import { IconPlus, IconEye, IconEdit, IconTrash } from '@tabler/icons-react';

interface UsersTabProps {
  users: any[];
  loadingUsers: boolean;
  onOpenAddMembers: () => void;
  onEditUser: (user: any) => void;
  onRemoveFromElection: (userId: number, userName: string) => void;
}

const UsersTab: React.FC<UsersTabProps> = ({
  users,
  loadingUsers,
  onOpenAddMembers,
  onEditUser,
  onRemoveFromElection
}) => {
  return (
    <Box sx={{ p: (theme) => theme.layoutSpacing?.shell?.padding?.md ?? theme.spacing(3) }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3, px: 3 }}>
        <Stack>
          <Typography variant="h5" fontWeight={600}>
            Election Members
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Users who are members of this election
          </Typography>
        </Stack>
        <Button variant="contained" startIcon={<IconPlus size={18} />} onClick={onOpenAddMembers}>
          Add Members
        </Button>
      </Stack>
      <TableContainer component={Paper} variant="outlined" sx={{ mx: 0 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Assigned Committees</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingUsers ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    No users assigned to this election yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Add users by assigning them to committees
                  </Typography>
                  <Button variant="outlined" startIcon={<IconPlus />} onClick={onOpenAddMembers}>
                    Add First User
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user: any) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {user.fullName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={user.roleDisplay || user.role} size="small" color="primary" />
                  </TableCell>
                  <TableCell>
                    {user.assignedCommittees && user.assignedCommittees.length > 0 ? (
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {user.assignedCommittees.map((committee: any) => (
                          <Chip key={committee.id} label={committee.code} size="small" variant="outlined" />
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Not assigned
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={user.isActive ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton size="small" color="primary">
                        <IconEye size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit User">
                      <IconButton size="small" color="info" onClick={() => onEditUser(user)}>
                        <IconEdit size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove from Election">
                      <IconButton size="small" color="error" onClick={() => onRemoveFromElection(user.id, user.fullName)}>
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

export default UsersTab;


