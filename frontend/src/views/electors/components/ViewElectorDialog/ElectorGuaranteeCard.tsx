import React, { useMemo } from 'react';
import { Stack, Typography, Box, TextField, Select, FormControl, MenuItem, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  FiberManualRecord as FiberManualRecordIcon,
  Phone as PhoneIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
  LocationOn as LocationOnIcon,
  AssignmentInd as AssignmentIndIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';
import type { Elector } from 'types/electors';
import type { GuaranteeGroup, GuaranteeStatus, GuaranteeConfirmationStatus } from 'types/guarantees';

interface ElectorInfoBoxProps {
  items: { label: string; value: React.ReactNode }[];
  onUseElectorMobile?: (value: string) => void;
  canEditPhone?: boolean;
}

interface GuaranteeInfoBoxProps {
  guaranteeStatus: GuaranteeStatus | null;
  confirmationStatus?: string | null;
  selectedGroup: { id: number; name: string; color?: string | null } | null;
  groups: GuaranteeGroup[];
  updatingGroup: boolean;
  onSelectGroup: (group: GuaranteeGroup | null) => void;
  mobile: string;
  canEditPhone: boolean;
  onChangeMobile: (value: string) => void;
  onSubmitMobile: () => void;
  savingMobile?: boolean;
  mobileSavedFlash?: boolean;
  showMobileAction?: boolean;
  onChangeConfirmation?: (value: GuaranteeConfirmationStatus) => void;
  confirmationOptions?: { value: string; label: string }[];
  guaranteeNote?: string;
  onChangeNote?: (value: string) => void;
  onSubmitNote?: () => void;
  savingNote?: boolean;
  noteSavedFlash?: boolean;
  showNoteAction?: boolean;
  // Additional props that might be passed by parent; kept optional for compatibility
  isAdding?: boolean;
  isRemoving?: boolean;
  onAddGuaranteed?: () => void;
  onAddPending?: () => void;
  onRemove?: () => void;
}

interface ElectorGuaranteeCardProps {
  elector: Elector;
  selectedGroup: { id: number; name: string; color?: string | null } | null;
  groups: GuaranteeGroup[];
  updatingGroup: boolean;
  onSelectGroup: (group: GuaranteeGroup | null) => void;
  onChangeConfirmation?: (value: GuaranteeConfirmationStatus) => void;
  mobile: string;
  canEditPhone: boolean;
  onChangeMobile: (value: string) => void;
  onSubmitMobile: () => void;
  savingMobile?: boolean;
  mobileSavedFlash?: boolean;
  showMobileAction?: boolean;
  guaranteeNote?: string;
  onChangeNote?: (value: string) => void;
  onSubmitNote?: () => void;
  savingNote?: boolean;
  noteSavedFlash?: boolean;
  showNoteAction?: boolean;
  isAdding?: boolean;
  isRemoving?: boolean;
  onAddGuaranteed?: () => void;
  onAddPending?: () => void;
  onRemove?: () => void;
}

const ElectorInfoBox: React.FC<ElectorInfoBoxProps> = ({ items, onUseElectorMobile, canEditPhone }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        p: { xs: 0, md: 1 },
        flex: { xs: 1, md: 1 },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          opacity: 0.35,
          pointerEvents: 'none'
        }
      }}
    >
      <Stack spacing={2}>
        {items.map((item) => {
          // Get icon based on label
          const getIcon = () => {
            if (item.label === 'KOC ID') return <BadgeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />;
            if (item.label === 'Department • Team') return <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />;
            if (item.label === 'Area') return <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />;
            if (item.label === 'Designation') return <AssignmentIndIcon sx={{ fontSize: 16, color: 'text.secondary' }} />;
            if (item.label === 'Section') return <CategoryIcon sx={{ fontSize: 16, color: 'text.secondary' }} />;
            if (item.label === 'Contact Number') return <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />;
            return null;
          };

          const icon = getIcon();

          // Render with icon inline
          const displayValue =
            item.label === 'Contact Number'
              ? typeof item.value === 'string' && item.value.trim() !== '-' && item.value.trim() !== ''
                ? item.value
                : 'No Contact Number'
              : item.value;

          return (
            <Stack key={item.label} direction="row" alignItems="center" spacing={0.75}>
              {icon}
              <Typography variant="body2" fontWeight={600} sx={{ wordBreak: 'break-word', flex: 1 }}>
                {displayValue}
              </Typography>
              {item.label === 'Contact Number' &&
                typeof item.value === 'string' &&
                item.value.trim() !== '-' &&
                item.value.trim() !== '' && (
                  <Tooltip title="Use for guarantee">
                    <span>
                      <IconButton
                        size="small"
                        color="success"
                        disabled={!canEditPhone}
                        onClick={() => onUseElectorMobile?.(item.value as string)}
                      >
                        <AddCircleOutlineIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};

const DEFAULT_CONFIRMATION_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'NOT_AVAILABLE', label: 'Not Available' }
];

const GuaranteeInfoBox: React.FC<GuaranteeInfoBoxProps> = ({
  guaranteeStatus,
  confirmationStatus,
  confirmationOptions,
  onChangeConfirmation,
  selectedGroup,
  groups,
  updatingGroup,
  onSelectGroup,
  mobile,
  canEditPhone,
  onChangeMobile,
  onSubmitMobile,
  savingMobile,
  mobileSavedFlash,
  showMobileAction,
  guaranteeNote,
  onChangeNote,
  onSubmitNote,
  savingNote,
  noteSavedFlash,
  showNoteAction
}) => {
  const theme = useTheme();
  const [localConfirmation, setLocalConfirmation] = React.useState(confirmationStatus || 'PENDING');
  const [localNote, setLocalNote] = React.useState(guaranteeNote || '');
  const confirmationChoices = confirmationOptions || DEFAULT_CONFIRMATION_OPTIONS;

  React.useEffect(() => {
    setLocalConfirmation(confirmationStatus || 'PENDING');
  }, [confirmationStatus]);

  React.useEffect(() => {
    setLocalNote(guaranteeNote || '');
  }, [guaranteeNote]);

  const handleSelect = (group: GuaranteeGroup | null) => {
    onSelectGroup(group);
  };

  const guaranteeGroupColor = selectedGroup?.color || theme.palette.secondary.main;
  const guaranteeGroupLabel = selectedGroup?.name || 'Assign Group';

  const getBackground = () => {
    if (!guaranteeStatus) {
      return 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(37, 99, 235, 0.12) 100%)';
    }
    if (guaranteeStatus === 'PENDING') {
      return 'linear-gradient(135deg, rgba(255, 213, 79, 0.18) 0%, rgba(255, 193, 7, 0.15) 100%)';
    }
    return 'linear-gradient(135deg, rgba(76, 175, 80, 0.18) 0%, rgba(56, 142, 60, 0.16) 100%)';
  };

  return (
    <Box
      sx={{
        position: 'relative',
        background: getBackground(),
        px: { xs: 1.5, md: 3 },
        py: { xs: 1.5, md: 2.5 },
        flex: { xs: 1, lg: 1 },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(120deg, transparent 0%, ${alpha(theme.palette.success.light, 0.15)} 60%)`,
          opacity: 0.35,
          pointerEvents: 'none'
        }
      }}
    >
      <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
        {/* Confirmation controls temporarily disabled */}

        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ flexBasis: { xs: '30%', sm: '25%' }, flexShrink: 0 }}>
            Group
          </Typography>
          <Box sx={{ flexBasis: { xs: '70%', sm: '75%' }, flexGrow: 1 }}>
            <FormControl fullWidth size="small" disabled={!canEditPhone || updatingGroup}>
              <Select
                displayEmpty
                value={selectedGroup ? String(selectedGroup.id) : ''}
                onChange={(event) => {
                  const value = event.target.value as string | number;
                  if (value === '') {
                    handleSelect(null);
                  } else {
                    const numericValue = typeof value === 'string' ? Number(value) : value;
                    const group = groups.find((g) => g.id === numericValue);
                    if (group) handleSelect(group);
                  }
                }}
                renderValue={(value) =>
                  value === '' ? (
                    <Typography variant="body2" color="text.secondary">
                      No Group
                    </Typography>
                  ) : (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <FiberManualRecordIcon sx={{ fontSize: 12, color: guaranteeGroupColor }} />
                      <Typography variant="body2" fontWeight={600}>
                        {guaranteeGroupLabel}
                      </Typography>
                    </Stack>
                  )
                }
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: selectedGroup ? guaranteeGroupColor : 'divider'
                  }
                }}
              >
                <MenuItem value="">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <FiberManualRecordIcon sx={{ fontSize: 12, color: theme.palette.text.disabled }} />
                    <Typography variant="body2">No Group</Typography>
                  </Stack>
                </MenuItem>
                {groups.map((group) => (
                  <MenuItem key={group.id} value={String(group.id)}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <FiberManualRecordIcon sx={{ fontSize: 12, color: group.color }} />
                      <Typography variant="body2">{group.name}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ flexBasis: { xs: '30%', sm: '25%' }, flexShrink: 0 }}>
            Mobile
          </Typography>
          <Box sx={{ flexBasis: { xs: '70%', sm: '75%' }, flexGrow: 1 }}>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                fullWidth
                value={mobile}
                placeholder="Enter phone"
                onChange={(event) => onChangeMobile(event.target.value)}
                InputProps={{
                  readOnly: !canEditPhone
                }}
              />
              {showMobileAction ? (
                <IconButton
                  color="primary"
                  size="small"
                  onClick={onSubmitMobile}
                  disabled={!canEditPhone || savingMobile}
                  sx={{ alignSelf: 'center' }}
                >
                  {mobileSavedFlash ? <CheckCircleIcon fontSize="small" color="success" /> : <SaveIcon fontSize="small" />}
                </IconButton>
              ) : null}
            </Stack>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Typography
            variant="caption"
            fontWeight={700}
            color="text.secondary"
            sx={{ flexBasis: { xs: '30%', sm: '25%' }, flexShrink: 0, pt: 1 }}
          >
            Notes
          </Typography>
          <Box sx={{ flexBasis: { xs: '70%', sm: '75%' }, flexGrow: 1 }}>
            <Stack direction="row" spacing={1} alignItems="flex-start">
              <TextField
                size="small"
                fullWidth
                multiline
                minRows={2}
                value={localNote}
                placeholder="Add a note..."
                onChange={(event) => {
                  const value = event.target.value;
                  setLocalNote(value);
                  onChangeNote?.(value);
                }}
              />
              {showNoteAction ? (
                <IconButton color="primary" size="small" onClick={onSubmitNote} disabled={savingNote} sx={{ mt: 0.5 }}>
                  {noteSavedFlash ? <CheckCircleIcon fontSize="small" color="success" /> : <SaveIcon fontSize="small" />}
                </IconButton>
              ) : null}
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

const ElectorGuaranteeCard: React.FC<ElectorGuaranteeCardProps> = ({
  elector,
  selectedGroup,
  groups,
  updatingGroup,
  onSelectGroup,
  onChangeConfirmation,
  mobile,
  canEditPhone,
  onChangeMobile,
  onSubmitMobile,
  savingMobile,
  mobileSavedFlash,
  showMobileAction,
  guaranteeNote,
  onChangeNote,
  onSubmitNote,
  savingNote,
  noteSavedFlash,
  showNoteAction,
  isAdding,
  isRemoving,
  onAddGuaranteed,
  onAddPending,
  onRemove
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const infoItems = useMemo(() => {
    const departmentTeamValue = [elector.department || '-', elector.team || '-'].filter((v) => v !== '-').join(' • ') || '-';
    const allItems = [
      { label: 'KOC ID', value: elector.kocId || '-' },
      { label: 'Department • Team', value: departmentTeamValue },
      { label: 'Area', value: elector.area || '-' },
      { label: 'Designation', value: elector.designation || '-' },
      { label: 'Section', value: elector.section || '-' },
      { label: 'Contact Number', value: elector.mobile || '-' }
    ];
    // Remove Area, Designation, and Section on mobile
    if (isMobile) {
      return allItems.filter((item) => !['Area', 'Designation', 'Section'].includes(item.label));
    }
    return allItems;
  }, [elector.area, elector.department, elector.designation, elector.kocId, elector.section, elector.team, elector.mobile, isMobile]);

  const confirmationStatus = elector.guaranteeConfirmationStatus || 'PENDING';
  // Show guarantee box if guaranteeStatus exists OR guaranteeId exists (for guarantees opened from guarantees page)
  const hasGuarantee = Boolean(elector.guaranteeStatus || elector.guaranteeId);
  const getStatusBorderColor = () => {
    if (!hasGuarantee) return theme.palette.info.main;
    if (elector.guaranteeStatus === 'PENDING') return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  return (
    <Box sx={{ position: 'relative', borderBottom: (theme) => `3px solid ${getStatusBorderColor()}` }}>
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
        <ElectorInfoBox
          items={infoItems}
          canEditPhone={canEditPhone}
          onUseElectorMobile={(value: string) => {
            onChangeMobile(value);
            onSubmitMobile();
          }}
        />

        {hasGuarantee && (
          <GuaranteeInfoBox
            guaranteeStatus={elector.guaranteeStatus || null}
            confirmationStatus={confirmationStatus}
            selectedGroup={selectedGroup}
            groups={groups}
            updatingGroup={updatingGroup}
            onSelectGroup={onSelectGroup}
            onChangeConfirmation={onChangeConfirmation}
            mobile={mobile}
            canEditPhone={canEditPhone}
            onChangeMobile={onChangeMobile}
            onSubmitMobile={onSubmitMobile}
            savingMobile={savingMobile}
            mobileSavedFlash={mobileSavedFlash}
            showMobileAction={showMobileAction}
            guaranteeNote={guaranteeNote}
            onChangeNote={onChangeNote}
            onSubmitNote={onSubmitNote}
            savingNote={savingNote}
            noteSavedFlash={noteSavedFlash}
            showNoteAction={showNoteAction}
            isAdding={isAdding}
            isRemoving={isRemoving}
            onAddGuaranteed={onAddGuaranteed}
            onAddPending={onAddPending}
            onRemove={onRemove}
          />
        )}
      </Stack>
    </Box>
  );
};

export default ElectorGuaranteeCard;
