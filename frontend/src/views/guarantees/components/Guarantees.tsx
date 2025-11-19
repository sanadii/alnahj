/**
 * Guarantees Management Page
 * Election Management System - Full featured guarantees tracking
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from 'store';

// material-ui
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
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
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// icons
import {
  Add as AddIcon,
  Search as SearchIcon,
  Message as MessageIcon,
  CheckCircle as CheckCircleIcon,
  NotificationsActive as NotificationsActiveIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Save as SaveIcon
} from '@mui/icons-material';

// project imports
import { DeleteConfirmationDialog, PremiumCard, StatCard, StatCardGradients, PremiumPageHeader, ScrollableCardContainer } from 'shared/components';
import type { HeaderAction } from 'shared/components';
import { IconShieldCheck, IconPlus, IconRefresh, IconSettings } from '@tabler/icons-react';
import {
  getGuaranteesRequest,
  deleteGuaranteeRequest,
  quickUpdateGuaranteeRequest,
  setGuaranteeFilters,
  confirmGuaranteeRequest,
  updateGuaranteeRequest
} from 'store/guarantees';
import type {
  GuaranteeStatus,
  GuaranteeListItem,
  GuaranteeConfirmationStatus,
  GuaranteeFilters,
  GuaranteeUpdateData
} from 'types/guarantees';
import ElectorActionButtons from '../../electors/components/ElectorActionButtons';
import AddGuaranteeDialog from './AddGuaranteeDialog';
import ManageGroupsDialog from './ManageGroupsDialog';
import ConfirmGuaranteeDialog from './ConfirmGuaranteeDialog';
import ViewElectorDialog from 'views/electors/components/ViewElectorDialog';
import GuaranteeCardList from './GuaranteeCardList';
import type { Elector } from 'types/electors';
import { getElector } from 'helpers/api/electors';
import { getGuaranteeDetail } from 'helpers/api/guarantees';
import { openSnackbar } from 'store/snackbar/actions';
import { guaranteesSelector, selectGuaranteesByStatus, selectGuaranteesGroupedByCommittee } from 'store/guarantees/selectors';

type InlineField = 'mobile' | 'quickNote';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Guarantees: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const shellSpacing = theme.layoutSpacing?.shell ?? {
    padding: {
      xs: theme.spacing(1.5),
      md: theme.spacing(3)
    },
    marginX: {
      xs: theme.spacing(2),
      sm: theme.spacing(2.5),
      md: theme.spacing(3)
    }
  };
  const sectionPadding = {
    xs: shellSpacing.padding?.xs ?? theme.spacing(1.5),
    md: shellSpacing.padding?.md ?? theme.spacing(3)
  };
  const verticalGap = {
    xs: shellSpacing.marginX?.xs ?? theme.spacing(2),
    sm: shellSpacing.marginX?.sm ?? theme.spacing(2.5),
    md: shellSpacing.marginX?.md ?? theme.spacing(3)
  };

  const {
    guarantees,
    statistics = null,
    groups = [],
    loading = false,
    totalCount = 0,
    currentPage = 1,
    pageSize = 10,
    filters: storeFilters,
    error
  } = useAppSelector(guaranteesSelector);
  const statusBuckets = useAppSelector(selectGuaranteesByStatus);
  const guaranteesByCommittee = useAppSelector(selectGuaranteesGroupedByCommittee);
  const defaultFilters: GuaranteeFilters = {
    search: '',
    guaranteeStatus: '',
    group: '',
    confirmationStatus: '',
    page: 1,
    pageSize: 10
  };
  const filters = (storeFilters || defaultFilters) as GuaranteeFilters;

  // Local state
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [guaranteeStatusFilter, setGuaranteeStatusFilter] = useState(filters.guaranteeStatus || '');
  const [groupFilter, setGroupFilter] = useState(filters.group || '');
  const [confirmationFilter, setConfirmationFilter] = useState<GuaranteeConfirmationStatus | ''>(filters.confirmationStatus || '');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [groupsDialogOpen, setGroupsDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedGuarantee, setSelectedGuarantee] = useState<GuaranteeListItem | null>(null);
  const [viewElectorDialogOpen, setViewElectorDialogOpen] = useState(false);
  const [selectedElector, setSelectedElector] = useState<Elector | null>(null);
  const [viewElectorRequesting, setViewElectorRequesting] = useState(false);
  const [inlineEdits, setInlineEdits] = useState<Record<number, { mobile?: string; quickNote?: string }>>({});
  const [inlineSaving, setInlineSaving] = useState<Record<number, Partial<Record<InlineField, boolean>>>>({});
  const [inlineSavedFlash, setInlineSavedFlash] = useState<Record<number, Partial<Record<InlineField, boolean>>>>({});

  const clearInlineSavingField = useCallback((id: number, field: InlineField) => {
    setInlineSaving((prev) => {
      const entry = prev[id];
      if (!entry?.[field]) {
        return prev;
      }
      const updatedEntry = { ...entry };
      delete updatedEntry[field];
      const next = { ...prev };
      if (Object.keys(updatedEntry).length === 0) {
        delete next[id];
      } else {
        next[id] = updatedEntry;
      }
      return next;
    });
  }, []);

  const clearInlineSavedFlashField = useCallback((id: number, field: InlineField) => {
    setInlineSavedFlash((prev) => {
      const entry = prev[id];
      if (!entry?.[field]) {
        return prev;
      }
      const updatedEntry = { ...entry };
      delete updatedEntry[field];
      const next = { ...prev };
      if (Object.keys(updatedEntry).length === 0) {
        delete next[id];
      } else {
        next[id] = updatedEntry;
      }
      return next;
    });
  }, []);

  const triggerInlineSavedFlash = useCallback(
    (id: number, field: InlineField) => {
      let scheduled = false;
      setInlineSavedFlash((prev) => {
        const entry = prev[id];
        if (entry?.[field]) {
          return prev;
        }
        scheduled = true;
        const updatedEntry = { ...(entry || {}), [field]: true };
        return { ...prev, [id]: updatedEntry };
      });

      if (scheduled) {
        setTimeout(() => {
          clearInlineSavedFlashField(id, field);
        }, 1500);
      }
    },
    [clearInlineSavedFlashField]
  );

  const formatErrorMessage = (error: unknown): string => {
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object' && 'message' in error && typeof (error as { message?: string }).message === 'string') {
      return (error as { message?: string }).message as string;
    }
    return 'Unable to load guarantees right now. Please try again.';
  };

  const normalizeFieldValue = (value: string, field: InlineField): string => {
    if (field === 'mobile') {
      return value.trim();
    }
    return value;
  };

  const getInlineFieldValue = (guarantee: GuaranteeListItem, field: 'mobile' | 'quickNote'): string => {
    const pending = inlineEdits[guarantee.id];
    if (pending && pending[field] !== undefined) {
      return pending[field] ?? '';
    }
    return field === 'mobile' ? guarantee.mobile || '' : guarantee.quickNote || '';
  };

  const isFieldDirty = (guarantee: GuaranteeListItem, field: 'mobile' | 'quickNote'): boolean => {
    const pending = inlineEdits[guarantee.id];
    if (!pending || pending[field] === undefined) {
      return false;
    }
    const pendingValue = normalizeFieldValue(String(pending[field] ?? ''), field);
    const original = normalizeFieldValue(field === 'mobile' ? guarantee.mobile || '' : guarantee.quickNote || '', field);
    return pendingValue !== original;
  };


  const getFieldSavedFlash = (guarantee: GuaranteeListItem, field: InlineField): boolean => {
    return Boolean(inlineSavedFlash[guarantee.id]?.[field]);
  };

  const handleInlineFieldChange = (guarantee: GuaranteeListItem, field: 'mobile' | 'quickNote', value: string) => {
    const original = field === 'mobile' ? guarantee.mobile || '' : guarantee.quickNote || '';
    setInlineEdits((prev) => {
      const next = { ...prev };
      const currentEntry = { ...(next[guarantee.id] || {}) };

      if (value === original) {
        if (currentEntry[field] !== undefined) {
          delete currentEntry[field];
          if (Object.keys(currentEntry).length === 0) {
            delete next[guarantee.id];
          } else {
            next[guarantee.id] = currentEntry;
          }
          return next;
        }
        return prev;
      }

      currentEntry[field] = value;
      next[guarantee.id] = currentEntry;
      return next;
    });

    clearInlineSavingField(guarantee.id, field);
    clearInlineSavedFlashField(guarantee.id, field);
  };

  const handleSyncMobileFromElector = (guarantee: GuaranteeListItem) => {
    if (!guarantee.electorMobile) {
      return;
    }
    handleInlineFieldChange(guarantee, 'mobile', guarantee.electorMobile);
  };

  const handleInlineFieldSave = (guarantee: GuaranteeListItem, field: 'mobile' | 'quickNote') => {
    const pendingValue = inlineEdits[guarantee.id]?.[field];
    const currentValue =
      pendingValue !== undefined ? pendingValue : field === 'mobile' ? guarantee.mobile || '' : guarantee.quickNote || '';
    const originalValue = field === 'mobile' ? guarantee.mobile || '' : guarantee.quickNote || '';
    const normalizedCurrent = normalizeFieldValue(String(currentValue ?? ''), field);
    const normalizedOriginal = normalizeFieldValue(String(originalValue ?? ''), field);

    if (normalizedCurrent === normalizedOriginal) {
      return;
    }

    const payload: GuaranteeUpdateData = {};
    if (field === 'mobile') {
      const trimmedMobile = normalizedCurrent;
      if (trimmedMobile && !/^\d{8}$/.test(trimmedMobile)) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Mobile number must be exactly 8 digits',
            variant: 'alert',
            alert: { color: 'error' },
            close: true
          })
        );
        return;
      }
      payload.mobile = trimmedMobile || null;
    } else {
      payload.quick_note = currentValue || '';
    }

    setInlineSaving((prev) => ({
      ...prev,
      [guarantee.id]: { ...(prev[guarantee.id] || {}), [field]: true }
    }));

    dispatch(updateGuaranteeRequest(guarantee.id, payload));
  };

  const totalGuarantees = statistics?.total_guarantees ?? guarantees.length;
  const guaranteedCount = statistics?.guaranteed_count ?? statusBuckets.guaranteed.length;
  const pendingGuaranteesCount = statistics?.pending_count ?? statusBuckets.pending.length;
  const confirmedCount =
    statistics?.confirmed_count ?? guarantees.filter((g) => g.confirmationStatus === 'CONFIRMED').length;
  const pendingConfirmationCount =
    statistics?.pending_confirmation_count ?? guarantees.filter((g) => g.confirmationStatus === 'PENDING').length;
  const notAvailableConfirmationCount =
    statistics?.not_available_confirmation_count ??
    guarantees.filter((g) => g.confirmationStatus === 'NOT_AVAILABLE').length;
  const committeesWithGuarantees = Object.keys(guaranteesByCommittee).length;
  const totalTrackedCommittees = statistics?.by_committee?.length || committeesWithGuarantees || 1;
  const committeeCoveragePercent =
    totalTrackedCommittees > 0 ? (committeesWithGuarantees / totalTrackedCommittees) * 100 : 0;
  const summaryCards = [
    {
      key: 'guaranteed',
      label: 'Guaranteed',
      value: guaranteedCount,
      gradient: StatCardGradients.success,
      icon: <CheckCircleIcon fontSize="large" />,
      onClick: () => {
        setGuaranteeStatusFilter('GUARANTEED');
        dispatch(
          setGuaranteeFilters({
            ...filters,
            guaranteeStatus: 'GUARANTEED',
            page: 1
          })
        );
      }
    },
    {
      key: 'pending',
      label: 'Pending Guarantees',
      value: pendingGuaranteesCount,
      gradient: StatCardGradients.warning,
      icon: <HourglassEmptyIcon fontSize="large" />,
      onClick: () => {
        setGuaranteeStatusFilter('PENDING');
        dispatch(
          setGuaranteeFilters({
            ...filters,
            guaranteeStatus: 'PENDING',
            page: 1
          })
        );
      }
    },
    {
      key: 'coverage',
      label: 'Active Committees',
      value: committeesWithGuarantees,
      gradient: StatCardGradients.info,
      icon: <IconShieldCheck />,
      subtitle: `${committeeCoveragePercent.toFixed(0)}% coverage`
    },
    // Temporarily commented out - confirmation feature disabled
    // {
    //   key: 'confirmed',
    //   label: 'Confirmed',
    //   value: confirmedCount,
    //   gradient: StatCardGradients.primary,
    //   icon: <IconShieldCheck size={28} color="#fff" />,
    //   onClick: () => {
    //     setConfirmationFilter('CONFIRMED');
    //     dispatch(
    //       setGuaranteeFilters({
    //         ...filters,
    //         confirmationStatus: 'CONFIRMED',
    //         page: 1
    //       })
    //     );
    //   }
    // },
    // {
    //   key: 'follow-up',
    //   label: 'Needs Follow-up',
    //   value: pendingConfirmationCount + notAvailableConfirmationCount,
    //   gradient: StatCardGradients.info,
    //   icon: <NotificationsActiveIcon fontSize="large" />,
    //   onClick: () => {
    //     setConfirmationFilter('PENDING');
    //     dispatch(
    //       setGuaranteeFilters({
    //         ...filters,
    //         confirmationStatus: 'PENDING',
    //         page: 1
    //       })
    //     );
    //   }
    // }
  ];

  // Delete dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [guaranteeToDelete, setGuaranteeToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch data on mount
  const shouldSkipMeta = React.useCallback(
    (currentFilters: GuaranteeFilters) =>
      Boolean(currentFilters.search) ||
      Boolean(currentFilters.guaranteeStatus) ||
      Boolean(currentFilters.group) ||
      Boolean(currentFilters.confirmationStatus) ||
      (currentFilters.page ?? 1) !== 1 ||
      (currentFilters.pageSize ?? defaultFilters.pageSize!) !== defaultFilters.pageSize,
    [defaultFilters.pageSize]
  );

  useEffect(() => {
    dispatch(
      getGuaranteesRequest({
        ...filters,
        _skipMeta: shouldSkipMeta(filters)
      })
    );
  }, [dispatch, filters, shouldSkipMeta]);

  useEffect(() => {
    setInlineEdits((prev) => {
      if (!Object.keys(prev).length) {
        return prev;
      }

      const next = { ...prev };
      let changed = false;

      Object.entries(prev).forEach(([idStr, entry]) => {
        const id = Number(idStr);
        const guarantee = guarantees.find((g) => g.id === id);
        if (!guarantee) {
          return;
        }

        const updatedEntry = { ...entry };
        let entryChanged = false;

        if (updatedEntry.mobile !== undefined) {
          const pendingMobile = normalizeFieldValue(String(updatedEntry.mobile ?? ''), 'mobile');
          const originalMobile = normalizeFieldValue(guarantee.mobile || '', 'mobile');
          if (pendingMobile === originalMobile) {
            delete updatedEntry.mobile;
            entryChanged = true;
          }
        }

        if (updatedEntry.quickNote !== undefined) {
          const pendingNote = normalizeFieldValue(String(updatedEntry.quickNote ?? ''), 'quickNote');
          const originalNote = normalizeFieldValue(guarantee.quickNote || '', 'quickNote');
          if (pendingNote === originalNote) {
            delete updatedEntry.quickNote;
            entryChanged = true;
          }
        }

        if (entryChanged) {
          changed = true;
          if (Object.keys(updatedEntry).length === 0) {
            delete next[id];
          } else {
            next[id] = updatedEntry;
          }
        }
      });

      return changed ? next : prev;
    });
  }, [guarantees]);

  useEffect(() => {
    setInlineSaving((prev) => {
      let changed = false;
      const next = { ...prev };

      Object.entries(prev).forEach(([idStr, fields]) => {
        const id = Number(idStr);
        const guarantee = guarantees.find((g) => g.id === id);
        if (!guarantee) {
          return;
        }

        (['mobile', 'quickNote'] as InlineField[]).forEach((field) => {
          if (!fields[field]) {
            return;
          }

          const pending = inlineEdits[id];
          const original = normalizeFieldValue(field === 'mobile' ? guarantee.mobile || '' : guarantee.quickNote || '', field);
          const dirty =
            pending && pending[field] !== undefined
              ? normalizeFieldValue(String(pending[field] ?? ''), field) !== original
              : false;

          if (!dirty) {
            changed = true;
            const updatedEntry = { ...(next[id] || {}) };
            delete updatedEntry[field];
            if (Object.keys(updatedEntry).length === 0) {
              delete next[id];
            } else {
              next[id] = updatedEntry;
            }
            triggerInlineSavedFlash(id, field);
          }
        });
      });

      return changed ? next : prev;
    });
  }, [inlineEdits, guarantees, triggerInlineSavedFlash]);

  // ========== HANDLERS ==========

  const handleSearch = () => {
    dispatch(
      setGuaranteeFilters({
        ...filters,
        search: searchTerm,
        page: 1
      })
    );
  };

  const handleStatusFilterChange = (status: string) => {
    setGuaranteeStatusFilter(status);
    dispatch(
      setGuaranteeFilters({
        ...filters,
        guaranteeStatus: status as GuaranteeStatus | '',
        page: 1
      })
    );
  };

  const handleGroupFilterChange = (group: string) => {
    setGroupFilter(group);
    dispatch(
      setGuaranteeFilters({
        ...filters,
        group: group as number | '',
        page: 1
      })
    );
  };

  const handleConfirmationFilterChange = (status: string) => {
    setConfirmationFilter(status as GuaranteeConfirmationStatus | '');
    dispatch(
      setGuaranteeFilters({
        ...filters,
        confirmationStatus: status as GuaranteeConfirmationStatus | '',
        page: 1
      })
    );
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    dispatch(
      setGuaranteeFilters({
        ...filters,
        page: newPage + 1
      })
    );
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setGuaranteeFilters({
        ...filters,
        pageSize: parseInt(event.target.value, 10),
        page: 1
      })
    );
  };

  const handleQuickGuaranteeStatusChange = (id: number, guaranteeStatus: GuaranteeStatus) => {
    dispatch(quickUpdateGuaranteeRequest(id, guaranteeStatus));
  };

  const handleQuickGroupChange = (guaranteeId: number, groupId: string | number) => {
    const parsedGroup = groupId === '' ? null : Number(groupId);
    dispatch(updateGuaranteeRequest(guaranteeId, { group: parsedGroup }));
  };

  const handleQuickConfirmationChange = (guaranteeId: number, confirmationStatus: GuaranteeConfirmationStatus) => {
    dispatch(
      confirmGuaranteeRequest(guaranteeId, {
        confirmation_status: confirmationStatus
      })
    );
  };

  const handleViewGuarantee = async (guarantee: GuaranteeListItem) => {
    if (viewElectorRequesting) return;

    setSelectedGuarantee(guarantee);
    setViewElectorRequesting(true);

    try {
      let electorKocId = guarantee.electorKocId || null;

      if (!electorKocId) {
        const guaranteeDetail = await getGuaranteeDetail(guarantee.id);
        electorKocId = guaranteeDetail.data?.electorKocId || null;
      }

      if (!electorKocId) {
        throw new Error('MissingKocId');
      }

      const response = await getElector(electorKocId);
      const electorData = response.data;
      
      // Merge guarantee data from the guarantee object into the elector
      // This ensures the guarantee box is visible in the dialog
      const electorWithGuarantee = {
        ...electorData,
        guaranteeStatus: guarantee.guaranteeStatus || electorData.guaranteeStatus,
        guaranteeId: guarantee.id || electorData.guaranteeId,
        guaranteeMobile: guarantee.mobile || electorData.guaranteeMobile,
        guaranteeNote: guarantee.quickNote || (electorData as any).guaranteeNote,
        guaranteeConfirmationStatus: guarantee.confirmationStatus || electorData.guaranteeConfirmationStatus,
        guaranteeGroup: guarantee.group
          ? {
              id: guarantee.group,
              name: groups.find((g) => g.id === guarantee.group)?.name || '',
              color: groups.find((g) => g.id === guarantee.group)?.color || null
            }
          : electorData.guaranteeGroup
      };
      
      setSelectedElector(electorWithGuarantee);
      setViewElectorDialogOpen(true);
    } catch (error: any) {
      const fallbackMessage = error?.response?.data?.message || error?.message || 'Failed to load elector details. Please try again.';
      const message =
        error?.message === 'MissingKocId'
          ? 'Unable to open elector dialog because this guarantee record does not have a linked KOC ID yet.'
          : fallbackMessage;

      dispatch(
        openSnackbar({
          open: true,
          message,
          variant: 'alert',
          alert: { color: 'error' },
          close: true
        })
      );
    } finally {
      setViewElectorRequesting(false);
    }
  };

  const handleConfirmGuarantee = (guarantee: GuaranteeListItem) => {
    setSelectedGuarantee(guarantee);
    setConfirmDialogOpen(true);
  };

  const handleCloseViewElectorDialog = () => {
    setViewElectorDialogOpen(false);
    setSelectedElector(null);
  };

  const handleConfirmSubmit = (confirmationStatus: GuaranteeConfirmationStatus) => {
    if (selectedGuarantee) {
      dispatch(
        confirmGuaranteeRequest(selectedGuarantee.id, {
          confirmation_status: confirmationStatus
        })
      );
    }
  };

  const handleDeleteGuarantee = (id: number, name: string) => {
    setGuaranteeToDelete({ id, name });
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!guaranteeToDelete) return;

    setIsDeleting(true);
    try {
      dispatch(deleteGuaranteeRequest(guaranteeToDelete.id));
      setShowDeleteDialog(false);
      setGuaranteeToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setGuaranteeToDelete(null);
  };

  const handleAddSuccess = () => {
    setAddDialogOpen(false);
    // Data will be reloaded by the saga after successful creation
  };

  const handleGroupsSuccess = () => {
    setGroupsDialogOpen(false);
    // Data will be reloaded by the saga after successful group operation
  };

  // ========== RENDER ==========

  // Loading State
  if (loading && !statistics) {
    return (
      <PremiumCard title="Guarantees Management" variant="elevated" color="primary">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 400,
            flexDirection: 'column',
            gap: 2,
            p: { xs: sectionPadding.xs, md: sectionPadding.md }
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="textSecondary">
            Loading guarantees data...
          </Typography>
        </Box>
      </PremiumCard>
    );
  }

  // Error State
  if (!loading && !statistics && error) {
    const errorMessage = formatErrorMessage(error);

    return (
      <PremiumCard title="Guarantees Management" variant="elevated" color="primary">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 400,
            flexDirection: 'column',
            gap: 2,
            p: { xs: sectionPadding.xs, md: sectionPadding.md }
          }}
        >
          <Alert
            severity="error"
            sx={{ maxWidth: 600, width: '100%' }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() =>
                  dispatch(
                    getGuaranteesRequest({
                      ...filters,
                      _skipMeta: shouldSkipMeta(filters)
                    })
                  )
                }
              >
                Retry
              </Button>
            }
          >
            <Typography variant="h6" gutterBottom>
              Failed to Load Guarantees
            </Typography>
            <Typography variant="body2">{errorMessage}</Typography>
          </Alert>
        </Box>
      </PremiumCard>
    );
  }

  // Header actions configuration
  const headerActions: HeaderAction[] = [
    {
      icon: <IconRefresh />,
      onClick: () =>
        dispatch(
          getGuaranteesRequest({
            ...filters,
            _skipMeta: shouldSkipMeta(filters)
          })
        ),
      tooltip: 'Refresh data',
      type: 'iconButton',
      disabled: loading
    },
    {
      label: 'Manage Groups',
      icon: <IconSettings />,
      onClick: () => setGroupsDialogOpen(true),
      variant: 'outlined'
    },
    {
      label: 'Add Guarantee',
      icon: <IconPlus />,
      onClick: () => setAddDialogOpen(true),
      variant: 'contained'
    }
  ];

  return (
    <>
      <PremiumCard variant="elevated" hover={false} padding={0}>
        {/* Premium Header */}
        <PremiumPageHeader
          title="Guarantees Management"
          subtitle="Track and manage your electoral guarantees"
          icon={<IconShieldCheck />}
          actions={headerActions}
        />

        <Box sx={{ p: { xs: sectionPadding.xs, md: sectionPadding.md } }}>
          {statistics && (
            <Box sx={{ mb: { xs: verticalGap.xs, md: verticalGap.md } }}>
              <ScrollableCardContainer>
                {summaryCards.map((card) => (
                  <StatCard
                    key={card.key}
                    icon={card.icon}
                    value={card.value.toLocaleString()}
                    label={card.label}
                    gradient={card.gradient}
                    onClick={card.onClick}
                    subtitle={totalGuarantees ? `${Math.round((card.value / totalGuarantees) * 100)}% of total` : undefined}
                  />
                ))}
              </ScrollableCardContainer>
            </Box>
          )}

          {/* Filters and Actions */}
          <Box sx={{ mb: { xs: verticalGap.xs, md: verticalGap.md } }}>
            <Grid container spacing={2} alignItems="center">
              {/* Search - Full width on first row */}
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  placeholder="Search by name, mobile, or section..."
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

              {/* Status Filter - Second row on mobile */}
              <Grid size={{ xs: 4, sm: 6, md: 2 }}>
                <TextField
                  select
                  fullWidth
                  label="Guarantee Status"
                  value={guaranteeStatusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="GUARANTEED">Guaranteed</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                </TextField>
              </Grid>

              {/* Confirmation Filter - Second row on mobile */}
              {/* Temporarily commented out - confirmation feature disabled */}
              {/* <Grid size={{ xs: 4, sm: 6, md: 2 }}>
                <TextField
                  select
                  fullWidth
                  label="Confirmation"
                  value={confirmationFilter}
                  onChange={(e) => handleConfirmationFilterChange(e.target.value)}
                >
                  <MenuItem value="">All States</MenuItem>
                  <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="NOT_AVAILABLE">Not Available</MenuItem>
                </TextField>
              </Grid> */}

              {/* Group Filter - Second row on mobile */}
              <Grid size={{ xs: 4, sm: 6, md: 2 }}>
                <TextField select fullWidth label="Group" value={groupFilter} onChange={(e) => handleGroupFilterChange(e.target.value)}>
                  <MenuItem value="">All Groups</MenuItem>
                  {Array.isArray(groups) &&
                    groups.map((group) => (
                      <MenuItem key={group.id} value={group.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: group.color
                            }}
                          />
                          {group.name}
                        </Box>
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>

          {/* Guarantees List - Table for Desktop, Cards for Mobile */}
          {isMobile ? (
            <>
              <GuaranteeCardList
                guarantees={guarantees}
                groups={groups}
                loading={loading}
                inlineEdits={inlineEdits}
                onInlineFieldChange={handleInlineFieldChange}
                onInlineFieldSave={handleInlineFieldSave}
                onSyncMobileFromElector={handleSyncMobileFromElector}
                onQuickGroupChange={handleQuickGroupChange}
                onQuickConfirmationChange={handleQuickConfirmationChange}
                onQuickGuaranteeStatusChange={handleQuickGuaranteeStatusChange}
                onViewGuarantee={handleViewGuarantee}
                onDeleteGuarantee={handleDeleteGuarantee}
                onConfirmGuarantee={handleConfirmGuarantee}
                getInlineFieldValue={getInlineFieldValue}
                isFieldDirty={isFieldDirty}
                getFieldSavedFlash={getFieldSavedFlash}
                filters={filters}
                onAddGuarantee={() => setAddDialogOpen(true)}
              />
              {/* Mobile Pagination */}
              {guarantees.length > 0 && (
                <Box
                  sx={{
                    mt: verticalGap.xs,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                    flexWrap: 'wrap'
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={currentPage === 1}
                    onClick={() => dispatch(setGuaranteeFilters({ ...filters, page: currentPage - 1 }))}
                  >
                    Previous
                  </Button>
                  <Typography variant="body2" color="text.secondary">
                    Page {currentPage} of {Math.ceil(totalCount / pageSize)}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={currentPage >= Math.ceil(totalCount / pageSize)}
                    onClick={() => dispatch(setGuaranteeFilters({ ...filters, page: currentPage + 1 }))}
                  >
                    Next
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>KOC ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Mobile</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell>Group</TableCell>
                          <TableCell align="center">Actions</TableCell>
                          {/* <TableCell>Confirmation</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                        <CircularProgress size={40} />
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          Loading guarantees...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : guarantees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Box sx={{ py: 5 }}>
                          <Typography variant="h5" color="textSecondary" gutterBottom>
                            No guarantees found
                          </Typography>
                          <Typography variant="body2" color="textSecondary" paragraph>
                            {filters?.search || filters?.guaranteeStatus || filters?.group
                              ? 'Try adjusting your search filters'
                              : 'Get started by adding guarantees from the list'}
                          </Typography>
                          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setAddDialogOpen(true)}>
                            Add Guarantee
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    guarantees.map((guarantee: GuaranteeListItem) => {
                      const mobileValue = getInlineFieldValue(guarantee, 'mobile');
                      const mobileDirty = isFieldDirty(guarantee, 'mobile');
                      const noteValue = getInlineFieldValue(guarantee, 'quickNote');
                      const noteDirty = isFieldDirty(guarantee, 'quickNote');
                      const mobileSavedFlash = getFieldSavedFlash(guarantee, 'mobile');
                      const noteSavedFlash = getFieldSavedFlash(guarantee, 'quickNote');
                      const showMobileAction = mobileDirty || mobileSavedFlash;
                      const showNoteAction = noteDirty || noteSavedFlash;

                      return (
                        <TableRow key={guarantee.id} hover>
                          <TableCell>
                            <Chip
                              label={guarantee.electorKocId || '—'}
                              size="small"
                              sx={{
                                bgcolor: guarantee.guaranteeStatus === 'GUARANTEED' ? '#16a34a' : '#f59e0b',
                                color: 'white',
                                fontWeight: 600,
                                '&:hover': {
                                  bgcolor: guarantee.guaranteeStatus === 'GUARANTEED' ? '#15803d' : '#d97706'
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Stack spacing={0.75}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="body2">{guarantee.electorName}</Typography>
                              </Stack>
                              <Typography variant="caption" color="text.secondary">
                                {(() => {
                                  const parts: string[] = [];
                                  if (guarantee.electorTeam) parts.push(guarantee.electorTeam);
                                  if (guarantee.electorDepartment) parts.push(guarantee.electorDepartment);
                                  return parts.length ? parts.join(' • ') : 'Team • Department not set';
                                })()}
                              </Typography>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="caption" color={guarantee.electorMobile ? 'text.secondary' : 'text.disabled'}>
                                  {guarantee.electorMobile || 'No mobile on file'}
                                </Typography>
                                {guarantee.electorMobile && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleSyncMobileFromElector(guarantee)}
                                    disabled={guarantee.electorMobile === mobileValue}
                                    sx={{ textTransform: 'none' }}
                                  >
                                    Add
                                  </Button>
                                )}
                              </Stack>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <TextField
                                size="small"
                                value={mobileValue}
                                onChange={(event) => handleInlineFieldChange(guarantee, 'mobile', event.target.value)}
                                placeholder="Add mobile"
                                sx={{ minWidth: 160 }}
                                inputProps={{ inputMode: 'tel' }}
                              />
                              {showMobileAction && (
                                <Tooltip title={mobileSavedFlash ? 'Saved' : 'Save mobile'}>
                                  <span>
                                    <IconButton
                                      size="small"
                                      color={mobileSavedFlash ? 'success' : 'primary'}
                                      onClick={() => handleInlineFieldSave(guarantee, 'mobile')}
                                      disabled={!mobileDirty}
                                    >
                                      {mobileSavedFlash ? <CheckCircleIcon fontSize="small" color="success" /> : <SaveIcon fontSize="small" />}
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              )}
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack spacing={0.5}>
                              <Stack direction="row" spacing={1} alignItems="flex-start">
                                <TextField
                                  size="small"
                                  fullWidth
                                  multiline
                                  minRows={1}
                                  maxRows={3}
                                  value={noteValue}
                                  onChange={(event) => handleInlineFieldChange(guarantee, 'quickNote', event.target.value)}
                                  placeholder="Add quick note"
                                />
                                {showNoteAction && (
                                  <Tooltip title={noteSavedFlash ? 'Saved' : 'Save note'}>
                                    <span>
                                      <IconButton
                                        size="small"
                                        color={noteSavedFlash ? 'success' : 'primary'}
                                        onClick={() => handleInlineFieldSave(guarantee, 'quickNote')}
                                        disabled={!noteDirty}
                                      >
                                        {noteSavedFlash ? <CheckCircleIcon fontSize="small" color="success" /> : <SaveIcon fontSize="small" />}
                                      </IconButton>
                                    </span>
                                  </Tooltip>
                                )}
                              </Stack>
                              {guarantee.hasNotes && (
                                <Chip
                                  icon={<MessageIcon fontSize="small" />}
                                  label="More notes"
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontWeight: 500, width: 'fit-content' }}
                                />
                              )}
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <TextField
                              select
                              size="small"
                              fullWidth
                              value={guarantee.group ?? ''}
                              onChange={(event) => handleQuickGroupChange(guarantee.id, event.target.value)}
                              sx={{ minWidth: 160 }}
                            >
                              <MenuItem value="">No Group</MenuItem>
                              {Array.isArray(groups) &&
                                groups.map((group) => (
                                  <MenuItem key={group.id} value={group.id}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Box
                                        sx={{
                                          width: 10,
                                          height: 10,
                                          borderRadius: '50%',
                                          bgcolor: group.color
                                        }}
                                      />
                                      {group.name}
                                    </Box>
                                  </MenuItem>
                                ))}
                            </TextField>
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ width: '100%' }}>
                              <ElectorActionButtons
                                guaranteeStatus={guarantee.guaranteeStatus}
                                onAddGuaranteed={() => handleQuickGuaranteeStatusChange(guarantee.id, 'GUARANTEED')}
                                onAddPending={() => handleQuickGuaranteeStatusChange(guarantee.id, 'PENDING')}
                                onRemove={() => handleDeleteGuarantee(guarantee.id, guarantee.electorName)}
                                onView={() => handleViewGuarantee(guarantee)}
                                justifyContent="center"
                                stackSx={{ width: 'auto' }}
                              />
                            </Stack>
                          </TableCell>
                          {/* <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <TextField
                                select
                                size="small"
                                fullWidth
                                value={guarantee.confirmationStatus}
                                onChange={(event) =>
                                  handleQuickConfirmationChange(guarantee.id, event.target.value as GuaranteeConfirmationStatus)
                                }
                                sx={{ minWidth: 160 }}
                              >
                                <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                                <MenuItem value="PENDING">Pending</MenuItem>
                                <MenuItem value="NOT_AVAILABLE">Not Available</MenuItem>
                              </TextField>
                              <Tooltip title="Open confirmation dialog">
                                <IconButton size="small" onClick={() => handleConfirmGuarantee(guarantee)}>
                                  <CheckCircleIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell> */}
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={totalCount}
                rowsPerPage={pageSize}
                page={currentPage - 1}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handlePageSizeChange}
              />
            </TableContainer>
          )}
        </Box>
      </PremiumCard>

      {/* Dialogs */}
      <AddGuaranteeDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} onSuccess={handleAddSuccess} />
      <ViewElectorDialog open={viewElectorDialogOpen} elector={selectedElector} onClose={handleCloseViewElectorDialog} />
      <ConfirmGuaranteeDialog
        open={confirmDialogOpen}
        guarantee={selectedGuarantee}
        onClose={() => {
          setConfirmDialogOpen(false);
          setSelectedGuarantee(null);
        }}
        onConfirm={handleConfirmSubmit}
      />
      <ManageGroupsDialog open={groupsDialogOpen} onClose={() => setGroupsDialogOpen(false)} onSuccess={handleGroupsSuccess} />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        title="Delete Guarantee"
        itemName={guaranteeToDelete?.name || ''}
        itemType="guarantee"
        warningMessage="This will permanently delete this guarantee record. All follow-up history and notes will be lost."
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default Guarantees;
