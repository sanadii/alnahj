import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { Dialog, DialogContent, Box, Typography, Stack, IconButton, useMediaQuery, Button } from '@mui/material';

import { useTheme } from '@mui/material/styles';
import { Close as CloseIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';

import {
  createGuarantee,
  quickUpdateGuaranteeByElector,
  deleteGuaranteeByElector,
  deleteGuarantee,
  updateGuarantee
} from 'helpers/api/guarantees';
import type { Elector } from 'types/electors';
import type { GuaranteeGroup, GuaranteeStatus, GuaranteeConfirmationStatus } from 'types/guarantees';
import { GuaranteeStatusLabels } from 'types/guarantees';
import { openSnackbar } from 'store/snackbar/actions';
import { updateElectorGuaranteeStatus } from 'store/electors';
import { electorsGroupsSelector } from 'selectors/electorsSelector';

import ElectorActionButtons from '../ElectorActionButtons';
import ElectorGuaranteeCard from './ElectorGuaranteeCard';
import WorkRelationshipsCard, { RelationshipsCardHandle } from './RelationshipsCard';
import type { Relative } from './types';

/**
 * ViewElectorDialog - Shared Dialog Component
 * 
 * This dialog is shared between:
 * - Electors view: For viewing elector details and managing guarantees
 * - Guarantees view: For viewing guarantee details (uses elector data)
 * 
 * It displays elector information, guarantee details, and relationships.
 */
interface ViewElectorDialogProps {
  open: boolean;
  elector: Elector | null;
  onClose: () => void;
  onAddToGuarantee?: () => void;
  onViewElector?: (kocId: string) => void;
}

const ViewElectorDialog: React.FC<ViewElectorDialogProps> = ({ open, elector, onClose, onAddToGuarantee, onViewElector }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const guaranteeGroups = useAppSelector(electorsGroupsSelector) as GuaranteeGroup[] | undefined;

  const [addingGuarantee, setAddingGuarantee] = useState<string | null>(null);
  const [removingGuarantee, setRemovingGuarantee] = useState<string | null>(null);

  const [localGuaranteeGroup, setLocalGuaranteeGroup] = useState<Elector['guaranteeGroup'] | null>(null);
  const [updatingGuaranteeGroup, setUpdatingGuaranteeGroup] = useState(false);
  const [mobile, setMobile] = useState('');
  const [savingMobile, setSavingMobile] = useState(false);
  const [mobileSavedFlash, setMobileSavedFlash] = useState(false);
  const [lastSavedMobile, setLastSavedMobile] = useState('');
  const [note, setNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [noteSavedFlash, setNoteSavedFlash] = useState(false);
  const [lastSavedNote, setLastSavedNote] = useState('');
  const [localElector, setLocalElector] = useState<Elector | null>(elector);
  const relationshipsCardRef = useRef<RelationshipsCardHandle>(null);
  const [showRelations, setShowRelations] = useState(false);

  const guaranteeGroupsList = guaranteeGroups || [];

  useEffect(() => {
    setLocalElector(elector);
  }, [elector]);

  const mapElectorToRelative = (person: Elector): Relative => ({
    kocId: person.kocId,
    fullName: person.fullName || '',
    mobile: person.mobile || '',
    section: person.section || '',
    committee: person.committeeName || null,
    area: person.area || null,
    department: person.department || null,
    team: person.team || null,
    relationship: 'SELF',
    guaranteeStatus: person.guaranteeStatus ?? null
  });

  useEffect(() => {
    if (elector) {
      setLocalGuaranteeGroup(elector.guaranteeGroup ?? null);
      // Use only guaranteeMobile for the guarantee phone field; do not fall back to elector.mobile
      setMobile(elector.guaranteeMobile || '');
      setLastSavedMobile(elector.guaranteeMobile || '');
      // Note may not be present in elector payload; start empty if missing
      setNote((elector as any).guaranteeNote || '');
      setLastSavedNote((elector as any).guaranteeNote || '');
    } else {
      setLocalGuaranteeGroup(null);
      setMobile('');
      setLastSavedMobile('');
      setNote('');
      setLastSavedNote('');
    }
  }, [elector?.guaranteeGroup, elector?.mobile, elector?.guaranteeMobile, elector?.kocId, elector]);

  // Hide any mobile action/flash when dialog closes
  useEffect(() => {
    if (!open) {
      setMobileSavedFlash(false);
      setNoteSavedFlash(false);
    }
  }, [open]);

  const handleSelectGuaranteeGroup = async (selectedGroup: GuaranteeGroup | null) => {
    const currentId = localElector?.guaranteeId ?? null;
    if (!currentId) return;
    if ((selectedGroup?.id ?? null) === (localGuaranteeGroup?.id ?? null)) {
      return;
    }

    try {
      setUpdatingGuaranteeGroup(true);
      await updateGuarantee(currentId, { group: selectedGroup ? selectedGroup.id : null });
      setLocalGuaranteeGroup(
        selectedGroup
          ? {
              id: selectedGroup.id,
              name: selectedGroup.name,
              color: selectedGroup.color
            }
          : null
      );

      dispatch(
        openSnackbar({
          open: true,
          message: selectedGroup ? `Assigned to ${selectedGroup.name}` : 'Guarantee group cleared',
          variant: 'success',
          close: true
        })
      );
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.nonFieldErrors?.[0] ||
        error?.message ||
        'Failed to update guarantee group';

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
      setUpdatingGuaranteeGroup(false);
    }
  };

  const handleMobileChange = (value: string) => {
    setMobile(value);
  };

  const handleSaveMobile = async () => {
    const currentId = localElector?.guaranteeId ?? null;
    if (!currentId) return;
    try {
      setSavingMobile(true);
      const current = mobile || '';
      const changed = current !== lastSavedMobile;
      await updateGuarantee(currentId, { mobile: current === '' ? '' : current });
      setLastSavedMobile(current);
      // Only show the success check if value actually changed
      if (changed) {
        setMobileSavedFlash(true);
        setTimeout(() => setMobileSavedFlash(false), 1500);
      } else {
        setMobileSavedFlash(false);
      }
      dispatch(
        openSnackbar({
          open: true,
          message: 'Contact number updated',
          variant: 'success',
          close: true
        })
      );
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update contact number';
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
      setSavingMobile(false);
    }
  };

  const handleConfirmationChange = async (value: GuaranteeConfirmationStatus) => {
    const currentId = localElector?.guaranteeId ?? null;
    if (!currentId) return;
    try {
      await updateGuarantee(currentId, { confirmation_status: value });
      setLocalElector((prev) => (prev ? { ...prev, guaranteeConfirmationStatus: value as any } : prev));
      dispatch(
        openSnackbar({
          open: true,
          message: 'Confirmation updated',
          variant: 'success',
          close: true
        })
      );
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update confirmation';
      dispatch(
        openSnackbar({
          open: true,
          message: errorMessage,
          variant: 'alert',
          alert: { color: 'error' },
          close: true
        })
      );
    }
  };
  const handleNoteChange = (value: string) => {
    setNote(value);
  };

  const handleSaveNote = async () => {
    const currentId = localElector?.guaranteeId ?? null;
    if (!currentId) return;
    try {
      setSavingNote(true);
      const current = note || '';
      const changed = current !== lastSavedNote;
      await updateGuarantee(currentId, { quick_note: current || undefined });
      setLastSavedNote(current);
      if (changed) {
        setNoteSavedFlash(true);
        setTimeout(() => setNoteSavedFlash(false), 1500);
      } else {
        setNoteSavedFlash(false);
      }
      dispatch(
        openSnackbar({
          open: true,
          message: 'Notes updated',
          variant: 'success',
          close: true
        })
      );
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update notes';
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
      setSavingNote(false);
    }
  };

  const handleAddToGuarantee = async (person: Relative, status: GuaranteeStatus) => {
    setAddingGuarantee(person.kocId);

    try {
      const isUpdatingExisting = Boolean(person.guaranteeStatus);
      let newId: number | null = localElector?.guaranteeId ?? null;

      if (isUpdatingExisting) {
        await quickUpdateGuaranteeByElector(person.kocId, status);
      } else {
        const created = await createGuarantee({
          elector: person.kocId,
          guaranteeStatus: status,
          group: null,
          quick_note: `Added from ${elector?.fullName}'s relationships`
        });
        const createdData: any = (created as any)?.data ?? created;
        if (createdData && typeof (createdData as any).id !== 'undefined') {
          newId = (createdData as any).id;
        }
      }

      relationshipsCardRef.current?.updateRelative(person.kocId, (p) => ({
        ...p,
        isGuarantee: status === 'GUARANTEED',
        guaranteeStatus: status
      }));

      setLocalElector((prev) => (prev ? { ...prev, guaranteeStatus: status, guaranteeId: newId } : prev));
      dispatch(updateElectorGuaranteeStatus(person.kocId, status));

      dispatch(
        openSnackbar({
          open: true,
          message: isUpdatingExisting
            ? `${person.fullName} status updated to ${GuaranteeStatusLabels[status] || status}`
            : status === 'PENDING'
              ? `${person.fullName} added to pending guarantees`
              : `${person.fullName} added to guarantees successfully!`,
          variant: 'alert',
          alert: { color: status === 'GUARANTEED' ? 'success' : 'warning' },
          close: true
        })
      );
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.response?.data?.errors?.nonFieldErrors?.[0] || error?.message || 'Failed to add guarantee';

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

  const handleRemoveFromGuarantee = async (person: Relative) => {
    setRemovingGuarantee(person.kocId);

    try {
      // Prefer deleting by guarantee ID when available (more precise)
      const currentId = localElector?.kocId === person.kocId ? (localElector?.guaranteeId ?? null) : null;
      if (currentId) {
        await deleteGuarantee(currentId);
      } else {
        // Fallback for relations when we don't have the guarantee id
        await deleteGuaranteeByElector(person.kocId);
      }

      relationshipsCardRef.current?.updateRelative(person.kocId, (p) => ({
        ...p,
        isGuarantee: false,
        guaranteeStatus: null
      }));

      setLocalElector((prev) => (prev ? { ...prev, guaranteeStatus: null, guaranteeId: null as any } : prev));
      dispatch(updateElectorGuaranteeStatus(person.kocId, null));

      dispatch(
        openSnackbar({
          open: true,
          message: `${person.fullName} removed from guarantees`,
          variant: 'alert',
          alert: { color: 'success' },
          close: true
        })
      );
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.nonFieldErrors?.[0] ||
        error?.message ||
        'Failed to remove from guarantees';

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
      setRemovingGuarantee(null);
    }
  };

  const handlePrimaryGuaranteeUpdate = (status: GuaranteeStatus) => {
    if (!localElector) return;
    handleAddToGuarantee(mapElectorToRelative(localElector), status);
  };

  const handlePrimaryGuaranteeRemove = () => {
    if (!localElector) return;
    handleRemoveFromGuarantee(mapElectorToRelative(localElector));
  };

  const renderRelationActions = (person: Relative) => {
    const isAdding = addingGuarantee === person.kocId;
    const isRemoving = removingGuarantee === person.kocId;

    return (
      <ElectorActionButtons
        guaranteeStatus={person.guaranteeStatus}
        isAdding={isAdding}
        isRemoving={isRemoving}
        onAddGuaranteed={() => handleAddToGuarantee(person, 'GUARANTEED')}
        onAddPending={() => handleAddToGuarantee(person, 'PENDING')}
        onRemove={person.guaranteeStatus ? () => handleRemoveFromGuarantee(person) : undefined}
        onView={onViewElector ? () => onViewElector(person.kocId) : undefined}
      />
    );
  };

  if (!elector) return null;

  const displayName = elector.fullName || '-';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 4,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'visible',
          background: 'transparent',
          p: isMobile ? 0 : 3
        }
      }}
    >
      <Box
        sx={{
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          borderRadius: isMobile ? 0 : 2,
          position: 'relative',
          minHeight: isMobile ? '100vh' : 'auto',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            animation: 'shimmer 3s ease-in-out infinite',
            '@keyframes shimmer': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.7 }
            }
          }
        }}
      >
        <Box
          sx={{
            position: 'relative',
            p: 2,
            // pb: 3,
            // background: 'linear-gradient(145deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            background: theme.palette.primary.main,
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              opacity: 0.5,
              pointerEvents: 'none'
            }
          }}
        >
          {/* HERE */}
          <Stack spacing={isMobile ? 0.5 : 2.5} sx={{ position: 'relative', zIndex: 1 }}>
            <Stack
              direction="row"
              spacing={isMobile ? 0.5 : 2}
              alignItems="center"
              justifyContent="space-between"
              sx={{ width: '100%' }}
              flexWrap="wrap"
            >
              <Typography
                variant={isMobile ? 'h6' : 'h3'}
                sx={{
                  fontWeight: 800,
                  color: 'white',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                  letterSpacing: '-0.5px',
                  fontSize: isMobile ? '1.1rem' : undefined,
                  flex: 1,
                  minWidth: 0
                }}
              >
                {displayName}
              </Typography>
              <Stack direction="row" spacing={isMobile ? 0.5 : 1.5} alignItems="center" sx={{ flexShrink: 0 }}>
                <ElectorActionButtons
                  guaranteeStatus={(localElector || elector)?.guaranteeStatus ?? undefined}
                  justifyContent="flex-end"
                  showViewButton={false}
                  stackSx={{ width: 'auto', flexWrap: 'nowrap' }}
                  isAdding={addingGuarantee === elector.kocId}
                  isRemoving={removingGuarantee === elector.kocId}
                  onAddGuaranteed={() => handlePrimaryGuaranteeUpdate('GUARANTEED')}
                  onAddPending={() => handlePrimaryGuaranteeUpdate('PENDING')}
                  onRemove={(localElector || elector)?.guaranteeStatus ? handlePrimaryGuaranteeRemove : undefined}
                />
                <IconButton
                  onClick={onClose}
                  sx={{
                    color: 'white',
                    width: isMobile ? 28 : 32,
                    height: isMobile ? 28 : 32,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    '& .MuiSvgIcon-root': {
                      fontSize: isMobile ? 18 : 24
                    },
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                      transform: 'rotate(90deg)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Stack>
            </Stack>
          </Stack>
        </Box>

        <DialogContent
          sx={{
            maxHeight: isMobile ? 'calc(100vh - 260px)' : 'calc(100vh - 400px)',
            overflowY: 'auto',
            p: isMobile ? 2 : 3
          }}
        >
          <ElectorGuaranteeCard
            elector={localElector || elector}
            selectedGroup={localElector?.guaranteeGroup ?? localGuaranteeGroup ?? null}
            groups={guaranteeGroupsList}
            updatingGroup={updatingGuaranteeGroup}
            onSelectGroup={handleSelectGuaranteeGroup}
            onChangeConfirmation={handleConfirmationChange}
            mobile={mobile}
            canEditPhone={Boolean(localElector?.guaranteeStatus)}
            onChangeMobile={handleMobileChange}
            onSubmitMobile={handleSaveMobile}
            savingMobile={savingMobile}
            mobileSavedFlash={mobileSavedFlash}
            showMobileAction={open && (mobileSavedFlash || mobile !== lastSavedMobile)}
            guaranteeNote={note}
            onChangeNote={handleNoteChange}
            onSubmitNote={handleSaveNote}
            savingNote={savingNote}
            noteSavedFlash={noteSavedFlash}
            showNoteAction={open && (noteSavedFlash || (!!note.trim() && note !== lastSavedNote))}
            isAdding={addingGuarantee === elector.kocId}
            isRemoving={removingGuarantee === elector.kocId}
            onAddGuaranteed={() => handlePrimaryGuaranteeUpdate('GUARANTEED')}
            onAddPending={() => handlePrimaryGuaranteeUpdate('PENDING')}
            onRemove={(localElector || elector)?.guaranteeStatus ? handlePrimaryGuaranteeRemove : undefined}
          />
          {showRelations && (
            <WorkRelationshipsCard ref={relationshipsCardRef} open={open} elector={elector} renderRelationActions={renderRelationActions} />
          )}
          <Box sx={{ pt: 1.5, pb: 1 }}>
            <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap">
              <Button
                size="small"
                variant={showRelations ? 'outlined' : 'contained'}
                color="primary"
                onClick={() => setShowRelations(true)}
                disabled={showRelations}
                startIcon={<VisibilityIcon />}
                aria-label="Show Relations"
                sx={{
                  color: (theme) => (!showRelations ? theme.palette.common.white : undefined),
                  '& .MuiButton-startIcon svg': {
                    color: (theme) => (!showRelations ? theme.palette.common.white : undefined)
                  }
                }}
              >
                Show Relations
              </Button>
              <Button
                size="small"
                variant={showRelations ? 'contained' : 'outlined'}
                color="secondary"
                onClick={() => setShowRelations(false)}
                disabled={!showRelations}
                startIcon={<VisibilityOffIcon />}
                aria-label="Hide Relations"
                sx={{
                  color: (theme) => (showRelations ? theme.palette.common.white : undefined),
                  '& .MuiButton-startIcon svg': {
                    color: (theme) => (showRelations ? theme.palette.common.white : undefined)
                  }
                }}
              >
                Hide Relations
              </Button>
            </Stack>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default ViewElectorDialog;
