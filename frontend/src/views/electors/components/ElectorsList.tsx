/**
 * Electors List Page
 * Election Management System - Display all electors/voters
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store';

import { Box, Button, CircularProgress, Stack, TablePagination, Typography, Alert, useMediaQuery, useTheme } from '@mui/material';

import { Add as AddIcon, Upload as UploadIcon, Download as DownloadIcon, Refresh as RefreshIcon } from '@mui/icons-material';

import { DeleteConfirmationDialog, PremiumCard, PremiumPageHeader } from 'shared/components';
import type { HeaderAction } from 'shared/components';
import { IconUsers } from '@tabler/icons-react';
import ElectorEditDialog from './ElectorEditDialog';
import ViewElectorDialog from './ViewElectorDialog';
import ElectorCreateDialog from './ElectorCreateDialog';
import ElectorFilterBar from './ElectorFilterBar';
import ElectorTableView from './ElectorTableView';
import ElectorCardList from './ElectorCardList';
import { exportElectorsCsv } from 'helpers/api/electors';
import { createGuarantee, deleteGuaranteeByElector, deleteGuarantee, quickUpdateGuaranteeByElector } from 'helpers/api/guarantees';
import type { Elector } from 'types/electors';
import type { GuaranteeStatus } from 'types/guarantees';
import { GuaranteeStatusLabels } from 'types/guarantees';
import {
  getElectorsRequest,
  deleteElectorRequest,
  setElectorFilters,
  updateElectorGuaranteeStatus,
  getElectorRequest
} from 'store/electors';
import { electorsSelector, selectElectorsSortedByName, selectElectorsBySearch } from 'selectors/electorsSelector';
import { openSnackbar } from 'store/snackbar/actions';

const ElectorsList: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();
  const { electors, currentElector, loading, error, totalCount, filters } = useAppSelector(electorsSelector);
  const sortedElectors = useAppSelector(selectElectorsSortedByName) || [];
  const filteredElectors = useAppSelector(selectElectorsBySearch) || sortedElectors;
  const visibleElectors = filters.search?.trim() ? filteredElectors : sortedElectors;
  const authUser = useAppSelector((state) => state.auth?.user);
  const isAdminUser = authUser?.role === 'ADMIN' || authUser?.role === 'SUPER_ADMIN' || authUser?.is_admin || authUser?.is_superuser;
  /* Dialog states */
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedElectorForEdit, setSelectedElectorForEdit] = React.useState<Elector | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [selectedElectorForView, setSelectedElectorForView] = React.useState<Elector | null>(null);
  const [pendingViewKocId, setPendingViewKocId] = React.useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);

  // Guarantee actions state
  const [addingGuarantee, setAddingGuarantee] = React.useState<string | null>(null);

  // Delete dialog state
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [electorToDelete, setElectorToDelete] = React.useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Remove from guarantee state
  const [removingGuarantee, setRemovingGuarantee] = React.useState<string | null>(null);

  // Load electors on mount (with groups for the guarantee dialog)
  useEffect(() => {
    dispatch(getElectorsRequest(filters, true)); // true = include groups
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (newFilters: any) => {
    const updatedFilters = { ...newFilters, page: 1 };
    dispatch(setElectorFilters(updatedFilters));
    dispatch(getElectorsRequest(updatedFilters, true)); // Immediately fetch with new filters
  };

  const handleSearch = () => {
    dispatch(getElectorsRequest(filters, true)); // Include groups
  };

  const handleResetFilters = () => {
    dispatch(getElectorsRequest(filters, true)); // Include groups
  };

  const handleRefresh = () => {
    dispatch(getElectorsRequest(filters, true)); // Include groups
  };

  const handleCreateElector = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateDialogClose = (success?: boolean) => {
    setCreateDialogOpen(false);
    if (success) {
      dispatch(getElectorsRequest(filters, true));
    }
  };

  const handleImport = () => {
    navigate('/electors/import');
  };

  const handleExport = async () => {
    try {
      const blob = await exportElectorsCsv(filters);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `electors_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      dispatch(
        openSnackbar({
          open: true,
          message: 'Electors exported successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: true
        })
      );
    } catch (err: any) {
      console.error('Error exporting electors:', err);
      dispatch(
        openSnackbar({
          open: true,
          message: err.message || 'Failed to export electors',
          variant: 'alert',
          alert: { color: 'error' },
          close: true
        })
      );
    }
  };

  const handleViewElector = (koc_id: string) => {
    const elector = electors.find((e) => e.kocId === koc_id);
    if (elector) {
      setSelectedElectorForView(elector);
      setViewDialogOpen(true);
    } else {
      setPendingViewKocId(koc_id);
      dispatch(getElectorRequest(koc_id));
    }
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
    setSelectedElectorForView(null);
    setPendingViewKocId(null);
  };

  useEffect(() => {
  if (pendingViewKocId && currentElector && currentElector.kocId === pendingViewKocId) {
      setSelectedElectorForView(currentElector as Elector);
      setViewDialogOpen(true);
      setPendingViewKocId(null);
    }
  }, [currentElector, pendingViewKocId]);

  const handleEditElector = (koc_id: string) => {
    const elector = electors.find((e) => e.kocId === koc_id);
    if (elector) {
      setSelectedElectorForEdit(elector);
      setEditDialogOpen(true);
    }
  };

  const handleEditDialogClose = (success?: boolean) => {
    setEditDialogOpen(false);
    setSelectedElectorForEdit(null);

    if (success) {
      // Refresh the list to get updated data
      dispatch(getElectorsRequest(filters, true));
    }
  };

  const handleDeleteElector = (koc_id: string, name: string) => {
    setElectorToDelete({ id: koc_id, name: name || 'Unknown' });
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!electorToDelete) return;

    setIsDeleting(true);

    try {
      dispatch(deleteElectorRequest(electorToDelete.id));

      dispatch(
        openSnackbar({
          open: true,
          message: 'Elector deleted successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: true
        })
      );

      setShowDeleteDialog(false);
      setElectorToDelete(null);
    } catch (error: any) {
      dispatch(
        openSnackbar({
          open: true,
          message: error?.message || 'Failed to delete elector',
          variant: 'alert',
          alert: { color: 'error' },
          close: true
        })
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setElectorToDelete(null);
  };

  const handleAddToGuarantees = async (elector: Elector, status: GuaranteeStatus) => {
    setAddingGuarantee(elector.kocId);

    try {
      const isUpdatingExisting = Boolean(elector.guaranteeStatus);

      if (isUpdatingExisting) {
        await quickUpdateGuaranteeByElector(elector.kocId, status);
      } else {
        await createGuarantee({ elector: elector.kocId, guaranteeStatus: status, group: null });
      }

      dispatch(updateElectorGuaranteeStatus(elector.kocId, status));

      if (selectedElectorForView && selectedElectorForView.kocId === elector.kocId) {
        setSelectedElectorForView({ ...selectedElectorForView, guaranteeStatus: status });
      }

      const successMessage = isUpdatingExisting
        ? `${elector.fullName} status updated to ${GuaranteeStatusLabels[status] || status}`
        : status === 'PENDING'
          ? `${elector.fullName} added to pending guarantees`
          : `${elector.fullName} added to guarantees (${GuaranteeStatusLabels[status]})`;

      dispatch(
        openSnackbar({
          open: true,
          message: successMessage,
          variant: 'alert',
          alert: { color: status === 'PENDING' ? 'warning' : 'success' },
          close: true
        })
      );
    } catch (error: any) {
      console.error('Failed to add guarantee:', error);
      const errorMessage =
        error?.response?.data?.message ?? error?.response?.data?.errors?.nonFieldErrors?.[0] ?? error?.message ?? 'Failed to add guarantee';

      dispatch(
        openSnackbar({
          open: true,
          message: errorMessage,
          variant: 'alert',
          alert: { color: 'error' },
          close: true
        })
      );
    } finally {
      setAddingGuarantee(null);
    }
  };

  const handleRemoveFromGuarantees = async (elector: Elector) => {
    setRemovingGuarantee(elector.kocId);

    try {
      // Prefer deleting by guarantee ID when available (more precise)
      if (elector.guaranteeId) {
        await deleteGuarantee(elector.guaranteeId);
      } else {
        // Fallback to by-elector endpoint if guarantee ID is not available
        await deleteGuaranteeByElector(elector.kocId);
      }

      dispatch(updateElectorGuaranteeStatus(elector.kocId, null));

      dispatch(
        openSnackbar({
          open: true,
          message: `${elector.fullName} removed from guarantees successfully`,
          variant: 'alert',
          alert: { color: 'success' },
          close: true
        })
      );
    } catch (error: any) {
      console.error('Failed to remove guarantee:', error);
      dispatch(
        openSnackbar({
          open: true,
          message: error?.message || 'Failed to remove from guarantees',
          variant: 'alert',
          alert: { color: 'error' },
          close: true
        })
      );
    } finally {
      setRemovingGuarantee(null);
    }
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    const newFilters = { ...filters, page: newPage + 1 };
    dispatch(setElectorFilters(newFilters));
    dispatch(getElectorsRequest(newFilters, true)); // Include groups
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPageSize = parseInt(event.target.value, 10);
    const newFilters = { ...filters, page_size: newPageSize, page: 1 };
    dispatch(setElectorFilters(newFilters));
    dispatch(getElectorsRequest(newFilters, true)); // Include groups
  };

  // Header actions configuration
  const headerActions: HeaderAction[] = [
    {
      icon: <RefreshIcon />,
      onClick: handleRefresh,
      tooltip: 'Refresh data',
      disabled: loading,
      type: 'iconButton'
    },
    ...(isAdminUser
      ? [
          {
            label: 'Import',
            icon: <UploadIcon />,
            onClick: handleImport,
            variant: 'contained' as const,
            color: 'error' as const
          },
          {
            label: 'Export',
            icon: <DownloadIcon />,
            onClick: handleExport,
            variant: 'contained' as const,
            color: 'error' as const,
            disabled: loading
          }
        ]
      : []),
    {
      label: 'Add Elector',
      icon: <AddIcon />,
      onClick: handleCreateElector,
      variant: 'contained'
    }
  ];

  return (
    <PremiumCard variant="elevated" padding={0}>
      {/* Premium Header */}
      <PremiumPageHeader
        title="Electors Management"
        subtitle="Manage and organize electors for the election"
        icon={<IconUsers />}
        actions={headerActions}
      />

      <Box sx={{ p: { xs: 1.5, md: 3 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Premium Filter Component */}
        <Box sx={{ mb: 3 }}>
          <ElectorFilterBar filters={filters} onFilterChange={handleFilterChange} onSearch={handleSearch} onReset={handleResetFilters} />
        </Box>
        {loading ? (
          <Box sx={{ py: 5, textAlign: 'center' }}>
            <CircularProgress size={40} />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Loading electors...
            </Typography>
          </Box>
        ) : visibleElectors.length === 0 ? (
          <Box sx={{ py: 5, textAlign: 'center' }}>
            <Typography variant="h5" color="textSecondary" gutterBottom>
              No electors found
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              {filters?.search || filters?.gender || filters?.committee
                ? 'Try adjusting your search filters'
                : 'Get started by importing electors from CSV or adding them manually'}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
              {isAdminUser && (
                <Button variant="contained" color="error" startIcon={<UploadIcon />} onClick={handleImport}>
                  Import from CSV
                </Button>
              )}
              <Button variant="outlined" startIcon={<AddIcon />} onClick={handleCreateElector}>
                Add Manually
              </Button>
            </Stack>
          </Box>
        ) : (
          <>
            {isMobile ? (
              <ElectorCardList
                electors={visibleElectors}
                addingGuarantee={addingGuarantee}
                removingGuarantee={removingGuarantee}
                onAddToGuarantees={handleAddToGuarantees}
                onRemoveFromGuarantees={handleRemoveFromGuarantees}
                onViewElector={handleViewElector}
                onEditElector={handleEditElector}
                onDeleteElector={handleDeleteElector}
              />
            ) : (
              <ElectorTableView
                electors={visibleElectors}
                addingGuarantee={addingGuarantee}
                removingGuarantee={removingGuarantee}
                onAddToGuarantees={handleAddToGuarantees}
                onRemoveFromGuarantees={handleRemoveFromGuarantees}
                onViewElector={handleViewElector}
                onEditElector={handleEditElector}
                onDeleteElector={handleDeleteElector}
              />
            )}
            <TablePagination
              rowsPerPageOptions={[10, 25, 50, 100]}
              component="div"
              count={totalCount}
              rowsPerPage={filters?.pageSize ?? 25}
              page={Math.max(0, (filters?.page ?? 1) - 1)}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              sx={{ mt: 2 }}
            />
          </>
        )}

        {/* Quick Add to Guarantees Dialog */}
        {/* Removed QuickAddGuaranteeDialog */}

        {/* View Elector Dialog */}
        <ViewElectorDialog
          open={viewDialogOpen}
          elector={selectedElectorForView}
          onClose={handleViewDialogClose}
          onAddToGuarantee={() => {
            if (selectedElectorForView) {
              handleAddToGuarantees(selectedElectorForView, 'PENDING');
            }
          }}
          onViewElector={handleViewElector}
        />

        {/* Edit Elector Dialog */}
        <ElectorEditDialog open={editDialogOpen} elector={selectedElectorForEdit} onClose={handleEditDialogClose} />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={showDeleteDialog}
          title="Delete Elector"
          itemName={electorToDelete?.name || ''}
          itemType="elector"
          warningMessage="This will permanently delete this elector and all associated data. This action cannot be undone."
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </Box>

      <ElectorCreateDialog open={createDialogOpen} onClose={handleCreateDialogClose} />
    </PremiumCard>
  );
};

export default ElectorsList;
