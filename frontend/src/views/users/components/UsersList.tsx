/**
 * Users List Page
 * Election Management System - Display all users with search, filter, and actions
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';

// icons
import { Add as AddIcon, Delete as DeleteIcon, Visibility as ViewIcon, Download as DownloadIcon } from '@mui/icons-material';

// project imports
import { PremiumCard, DeleteConfirmationDialog, StatusChip, PremiumPageHeader } from 'shared/components';
import type { HeaderActionInput } from 'shared/components';
import { IconUsers, IconUserPlus, IconDownload, IconRefresh, IconEdit } from '@tabler/icons-react';
import { FilterBar } from 'ui-component/filters';
import { getUsersRequest, deleteUserRequest, setUserFilters } from 'store/users';
import type { User, UserRole } from 'types/users-management';
import { UserRoleLabels, getUserRoleColor } from 'types/users-management';
import UserEditDialog from './UserEditDialog';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const UsersList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { users = [], loading, totalCount, currentPage, pageSize, filters } = useSelector((state: any) => state.users);

  // Local state
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [roleFilter, setRoleFilter] = useState(filters.role || '');
  const [statusFilter, setStatusFilter] = useState<boolean | null>(filters.isActive || null);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Delete dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch users on mount and when filters change
  useEffect(() => {
    dispatch(getUsersRequest(filters));
  }, [dispatch, filters]);

  // ========== HANDLERS ==========

  const handleSearch = () => {
    dispatch(
      setUserFilters({
        ...filters,
        search: searchTerm,
        page: 1
      })
    );
  };

  const handleRoleFilterChange = (role: string) => {
    setRoleFilter(role);
    dispatch(
      setUserFilters({
        ...filters,
        role: role as UserRole | '',
        page: 1
      })
    );
  };

  const handleStatusFilterChange = (status: string) => {
    const statusValue = status === 'active' ? true : status === 'inactive' ? false : null;
    setStatusFilter(statusValue);
    dispatch(
      setUserFilters({
        ...filters,
        isActive: statusValue,
        page: 1
      })
    );
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    dispatch(
      setUserFilters({
        ...filters,
        page: newPage + 1
      })
    );
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setUserFilters({
        ...filters,
        pageSize: parseInt(event.target.value, 10),
        page: 1
      })
    );
  };

  const handleCreateUser = () => {
    navigate('/users/create');
  };

  const handleViewUser = (id: number) => {
    navigate(`/users/profile/${id}`);
  };

  const handleEditUser = (id: number) => {
    setSelectedUserId(id);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedUserId(null);
  };

  const handleEditSuccess = () => {
    // Refresh users list after successful edit
    dispatch(getUsersRequest(filters));
  };

  const handleDeleteUser = (id: number, username: string) => {
    setUserToDelete({ id, name: username });
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      dispatch(deleteUserRequest(userToDelete.id));
      setShowDeleteDialog(false);
      setUserToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setUserToDelete(null);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
  };

  // Calculate active filters count
  const activeFiltersCount = [roleFilter, statusFilter !== null ? statusFilter : null, searchTerm].filter(
    (f) => f !== '' && f !== null
  ).length;

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setStatusFilter(null);
    dispatch(
      setUserFilters({
        search: '',
        role: '',
        isActive: null,
        page: 1
      })
    );
  };

  // ========== RENDER ==========

  // Header actions configuration
  const headerActions: HeaderActionInput[] = [
    {
      icon: <IconRefresh />,
      onClick: handleRefresh,
      tooltip: 'Refresh data',
      type: 'iconButton',
      disabled: loading
    },
    {
      label: 'Export',
      icon: <IconDownload />,
      onClick: handleExport,
      variant: 'outlined',
      disabled: loading
    },
    {
      label: 'Add User',
      icon: <IconUserPlus />,
      onClick: handleCreateUser,
      variant: 'contained'
    }
  ];

  return (
    <>
      <PremiumCard variant="elevated" hover={false} padding={0}>
        {/* Premium Header */}
        <PremiumPageHeader
          title="Users Management"
          subtitle="Manage system users and their roles"
          icon={<IconUsers />}
          actions={headerActions}
          chips={[
            { label: `Total: ${totalCount}`, background: 'rgba(255, 255, 255, 0.25)' },
            {
              label: users.length > 0 ? `Showing ${users.length} of ${totalCount}` : 'No users',
              background: 'rgba(255, 255, 255, 0.15)'
            }
          ]}
        />

        <Box sx={{ p: 3 }}>
          {/* Premium Filter Bar */}
          <FilterBar
            searchPlaceholder="Search by name or email..."
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            onSearchSubmit={handleSearch}
            filters={[
              {
                name: 'role',
                label: 'Role',
                type: 'select',
                value: roleFilter,
                onChange: handleRoleFilterChange,
                options: [
                  { value: '', label: 'All Roles' },
                  { value: 'SUPER_ADMIN', label: 'Super Admin' },
                  { value: 'ADMIN', label: 'Admin' },
                  { value: 'SUPERVISOR', label: 'Supervisor' },
                  { value: 'USER', label: 'User' }
                ]
              },
              {
                name: 'status',
                label: 'Status',
                type: 'select',
                value: statusFilter === true ? 'active' : statusFilter === false ? 'inactive' : 'all',
                onChange: handleStatusFilterChange,
                options: [
                  { value: 'all', label: 'All Status' },
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' }
                ]
              }
            ]}
            activeFiltersCount={activeFiltersCount}
            onClearFilters={handleClearFilters}
            actions={[
              {
                label: 'Export',
                onClick: handleExport,
                variant: 'outlined',
                startIcon: <DownloadIcon />
              },
              {
                label: 'Add User',
                onClick: handleCreateUser,
                variant: 'contained',
                startIcon: <AddIcon />
              }
            ]}
          />

          {/* Users Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Supervisor</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user: User) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {user.firstName} {user.lastName}
                        </Typography>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={UserRoleLabels[user.role]}
                          size="small"
                          sx={{
                            backgroundColor: getUserRoleColor(user.role),
                            color: 'white'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <StatusChip status={user.isActive ? 'active' : 'inactive'} label={user.isActive ? 'Active' : 'Inactive'} />
                      </TableCell>
                      <TableCell>{user.supervisorName || '-'}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title="View">
                            <IconButton size="small" color="info" onClick={() => handleViewUser(user.id)}>
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small" color="primary" onClick={() => handleEditUser(user.id)}>
                              <IconEdit size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteUser(user.id, `${user.firstName} ${user.lastName}`)}
                            >
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

      {/* Edit User Dialog */}
      <UserEditDialog open={editDialogOpen} userId={selectedUserId} onClose={handleCloseEditDialog} onSuccess={handleEditSuccess} />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        title="Delete User"
        itemName={userToDelete?.name || ''}
        itemType="user"
        warningMessage="This will permanently delete this user and all associated data. This action cannot be undone."
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default UsersList;
