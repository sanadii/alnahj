import React from 'react';
import {
  Paper,
  Stack,
  Chip,
  Typography,
  Box,
  Divider,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Message as MessageIcon,
  CheckCircle as CheckCircleIcon,
  Group as GroupIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import ElectorActionButtons from '../../electors/components/ElectorActionButtons';
import type { GuaranteeListItem, GuaranteeConfirmationStatus, GuaranteeStatus, GuaranteeGroup } from 'types/guarantees';

interface GuaranteeCardProps {
  guarantee: GuaranteeListItem;
  groups: GuaranteeGroup[];
  inlineEdits: Record<number, { mobile?: string; quickNote?: string }>;
  onInlineFieldChange: (guarantee: GuaranteeListItem, field: 'mobile' | 'quickNote', value: string) => void;
  onInlineFieldSave: (guarantee: GuaranteeListItem, field: 'mobile' | 'quickNote') => void;
  onSyncMobileFromElector: (guarantee: GuaranteeListItem) => void;
  onQuickGroupChange: (guaranteeId: number, groupId: string | number) => void;
  onQuickConfirmationChange: (guaranteeId: number, confirmationStatus: GuaranteeConfirmationStatus) => void;
  onQuickGuaranteeStatusChange: (id: number, guaranteeStatus: GuaranteeStatus) => void;
  onViewGuarantee: (guarantee: GuaranteeListItem) => void;
  onDeleteGuarantee: (id: number, name: string) => void;
  onConfirmGuarantee: (guarantee: GuaranteeListItem) => void;
  getInlineFieldValue: (guarantee: GuaranteeListItem, field: 'mobile' | 'quickNote') => string;
  isFieldDirty: (guarantee: GuaranteeListItem, field: 'mobile' | 'quickNote') => boolean;
  getFieldSavedFlash: (guarantee: GuaranteeListItem, field: 'mobile' | 'quickNote') => boolean;
}

const GuaranteeCard: React.FC<GuaranteeCardProps> = ({
  guarantee,
  groups,
  inlineEdits,
  onInlineFieldChange,
  onInlineFieldSave,
  onSyncMobileFromElector,
  onQuickGroupChange,
  onQuickConfirmationChange,
  onQuickGuaranteeStatusChange,
  onViewGuarantee,
  onDeleteGuarantee,
  onConfirmGuarantee,
  getInlineFieldValue,
  isFieldDirty,
  getFieldSavedFlash
}) => {
  const theme = useTheme();
  const chipColor = guarantee.guaranteeStatus === 'GUARANTEED' ? '#16a34a' : '#f59e0b';
  const mobileValue = getInlineFieldValue(guarantee, 'mobile');
  const mobileDirty = isFieldDirty(guarantee, 'mobile');
  const noteValue = getInlineFieldValue(guarantee, 'quickNote');
  const noteDirty = isFieldDirty(guarantee, 'quickNote');
  const mobileSavedFlash = getFieldSavedFlash(guarantee, 'mobile');
  const noteSavedFlash = getFieldSavedFlash(guarantee, 'quickNote');
  const showMobileAction = mobileDirty || mobileSavedFlash;
  const showNoteAction = noteDirty || noteSavedFlash;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: { xs: 0, sm: 4 },
        position: 'relative',
        overflow: 'hidden',
        borderColor: alpha(theme.palette.primary.main, 0.15),
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.08)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
        boxShadow: theme.shadows[4],
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at top right, ${alpha(theme.palette.primary.main, 0.18)} 0%, transparent 60%)`,
          opacity: 0.5,
          pointerEvents: 'none'
        }
      }}
    >
      <Stack spacing={1.5} sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header: KOC ID and Name */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Chip
              label={guarantee.electorKocId || '—'}
              size="small"
              sx={{
                bgcolor: chipColor,
                color: 'white',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: guarantee.guaranteeStatus === 'GUARANTEED' ? '#15803d' : '#d97706'
                }
              }}
            />
            <Typography variant="subtitle1" fontWeight={600}>
              {guarantee.electorName}
            </Typography>
          </Stack>
        </Stack>

        {/* Department/Team Info */}
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
            bgcolor: alpha(theme.palette.primary.main, 0.02)
          }}
        >
          <Stack spacing={1.5}>
            {(guarantee.electorDepartment || guarantee.electorTeam) && (
              <Stack direction="row" spacing={0.75} alignItems="center">
                <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" fontWeight={600}>
                  {(() => {
                    const parts: string[] = [];
                    if (guarantee.electorTeam) parts.push(guarantee.electorTeam);
                    if (guarantee.electorDepartment) parts.push(guarantee.electorDepartment);
                    return parts.length ? parts.join(' • ') : 'Team • Department not set';
                  })()}
                </Typography>
              </Stack>
            )}

            {/* Elector Mobile with Sync Button */}
            {guarantee.electorMobile && (
              <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap">
                <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ flex: 1 }}>
                  {guarantee.electorMobile}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onSyncMobileFromElector(guarantee)}
                  disabled={guarantee.electorMobile === mobileValue}
                  sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                >
                  Add
                </Button>
              </Stack>
            )}
          </Stack>
        </Box>

        <Divider />

        {/* Guarantee Information Box */}
        <Box
          sx={{
            position: 'relative',
            background: (() => {
              if (!guarantee.guaranteeStatus) {
                return 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(37, 99, 235, 0.12) 100%)';
              }
              if (guarantee.guaranteeStatus === 'PENDING') {
                return 'linear-gradient(135deg, rgba(255, 213, 79, 0.18) 0%, rgba(255, 193, 7, 0.15) 100%)';
              }
              return 'linear-gradient(135deg, rgba(76, 175, 80, 0.18) 0%, rgba(56, 142, 60, 0.16) 100%)';
            })(),
            px: { xs: 1.5, md: 2 },
            py: { xs: 1.5, md: 2 },
            borderRadius: 2,
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(120deg, transparent 0%, ${alpha(theme.palette.success.light, 0.15)} 60%)`,
              opacity: 0.35,
              pointerEvents: 'none',
              borderRadius: 2
            }
          }}
        >
          <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
            {/* Confirmation Status temporarily disabled */}

            {/* Group Select */}
            <Stack direction="row" spacing={1} alignItems="center">
              <GroupIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
              <TextField
                select
                size="small"
                fullWidth
                value={guarantee.group ?? ''}
                onChange={(event) => onQuickGroupChange(guarantee.id, event.target.value)}
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
            </Stack>

            {/* Mobile Field */}
            <Stack direction="row" spacing={1} alignItems="center">
              <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }} />
              <TextField
                size="small"
                fullWidth
                value={mobileValue}
                onChange={(event) => onInlineFieldChange(guarantee, 'mobile', event.target.value)}
                placeholder="Enter phone"
                inputProps={{ inputMode: 'tel' }}
              />
              {showMobileAction && (
                <Tooltip title={mobileSavedFlash ? 'Saved' : 'Save mobile'}>
                  <span>
                    <IconButton
                      size="small"
                      color={mobileSavedFlash ? 'success' : 'primary'}
                      onClick={() => onInlineFieldSave(guarantee, 'mobile')}
                      disabled={!mobileDirty}
                    >
                      {mobileSavedFlash ? <CheckCircleIcon fontSize="small" color="success" /> : <SaveIcon fontSize="small" />}
                    </IconButton>
                  </span>
                </Tooltip>
              )}
            </Stack>

            {/* Notes Field */}
            <Stack spacing={0.5}>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <MessageIcon sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0, mt: 0.5 }} />
                <TextField
                  size="small"
                  fullWidth
                  multiline
                  minRows={2}
                  maxRows={3}
                  value={noteValue}
                  onChange={(event) => onInlineFieldChange(guarantee, 'quickNote', event.target.value)}
                  placeholder="Add a note..."
                />
                {showNoteAction && (
                  <Tooltip title={noteSavedFlash ? 'Saved' : 'Save note'}>
                    <span>
                      <IconButton
                        size="small"
                        color={noteSavedFlash ? 'success' : 'primary'}
                        onClick={() => onInlineFieldSave(guarantee, 'quickNote')}
                        disabled={!noteDirty}
                        sx={{ mt: 0.5 }}
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
                  sx={{ fontWeight: 500, width: 'fit-content', ml: 3 }}
                />
              )}
            </Stack>
          </Stack>
        </Box>

        <Divider />

        {/* Actions */}
        <ElectorActionButtons
          guaranteeStatus={guarantee.guaranteeStatus}
          onAddGuaranteed={() => onQuickGuaranteeStatusChange(guarantee.id, 'GUARANTEED')}
          onAddPending={() => onQuickGuaranteeStatusChange(guarantee.id, 'PENDING')}
          onRemove={() => onDeleteGuarantee(guarantee.id, guarantee.electorName)}
          onView={() => onViewGuarantee(guarantee)}
          justifyContent="flex-start"
          stackSx={{ width: '100%', flexWrap: 'wrap' }}
        />
      </Stack>
    </Paper>
  );
};

export default GuaranteeCard;

