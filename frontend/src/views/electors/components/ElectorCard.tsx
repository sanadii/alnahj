import React from 'react';
import { Paper, Stack, Chip, Typography, Box, Divider, IconButton, Tooltip, Button } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { IconEdit } from '@tabler/icons-react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Business as BusinessIcon, Phone as PhoneIcon } from '@mui/icons-material';
import ElectorActionButtons from './ElectorActionButtons';
import type { Elector } from 'types/electors';
import type { GuaranteeStatus } from 'types/guarantees';

interface ElectorCardProps {
  elector: Elector | { kocId: string; fullName: string; mobile?: string | null | undefined; department?: string | null | undefined; team?: string | null | undefined; gender?: string | null | undefined; guaranteeStatus?: GuaranteeStatus | null | undefined; [key: string]: any };
  showEditDelete?: boolean;
  onEdit?: (kocId: string) => void;
  onDelete?: (kocId: string, name: string) => void;
  onMobileSync?: (elector: any) => void;
  mobileSyncingId?: string | null;
  addingGuarantee?: string | null;
  removingGuarantee?: string | null;
  onAddToGuarantees?: (elector: any, status: GuaranteeStatus) => void;
  onRemoveFromGuarantees?: (elector: any) => void;
  onViewElector?: (kocId: string) => void;
  renderActions?: (person: any) => React.ReactNode;
}

const ElectorCard: React.FC<ElectorCardProps> = ({
  elector,
  showEditDelete = false,
  onEdit,
  onDelete,
  onMobileSync,
  mobileSyncingId,
  addingGuarantee,
  removingGuarantee,
  onAddToGuarantees,
  onRemoveFromGuarantees,
  onViewElector,
  renderActions
}) => {
  const theme = useTheme();
  const chipColor = (elector.gender || '').toUpperCase() === 'MALE' ? '#3b82f6' : elector.gender ? '#ec4899' : theme.palette.primary.main;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 4,
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
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Chip label={elector.kocId} size="small" sx={{ bgcolor: chipColor, color: 'white', fontWeight: 600 }} />
            <Typography variant="subtitle1" fontWeight={600}>
              {elector.fullName}
            </Typography>
          </Stack>
          {showEditDelete && onEdit && onDelete && (
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Edit">
                <IconButton size="small" color="primary" onClick={() => onEdit(elector.kocId)}>
                  <IconEdit size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" color="error" onClick={() => onDelete(elector.kocId, elector.fullName || 'Unknown')}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </Stack>

        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
            bgcolor: alpha(theme.palette.primary.main, 0.02)
          }}
        >
          <Stack spacing={1.5}>
            {(elector.department || elector.team) && (
              <Stack direction="row" spacing={0.75} alignItems="center">
                <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" fontWeight={600}>
                  {[elector.department || '-', elector.team || '-'].filter((v) => v !== '-').join(' • ') || '-'}
                </Typography>
              </Stack>
            )}
            {onMobileSync ? (
              <Stack direction="row" spacing={0.75} alignItems="center">
                <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" fontWeight={600} color={elector.mobile ? 'text.primary' : 'text.disabled'}>
                  {elector.mobile || '-'}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onMobileSync(elector)}
                  disabled={!elector.mobile || mobileSyncingId === elector.kocId}
                  sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, ml: 'auto' }}
                >
                  Add
                </Button>
              </Stack>
            ) : (
              <Stack direction="row" spacing={0.75} alignItems="center">
                <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" fontWeight={600} color={elector.mobile ? 'text.primary' : 'text.disabled'}>
                  {elector.mobile || '-'}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Box>

        <Divider />

        {renderActions ? (
          <Box>{renderActions(elector)}</Box>
        ) : (
          <ElectorActionButtons
            guaranteeStatus={elector.guaranteeStatus ?? undefined}
            isAdding={addingGuarantee === elector.kocId}
            isRemoving={removingGuarantee === elector.kocId}
            onAddGuaranteed={onAddToGuarantees ? () => onAddToGuarantees(elector, 'GUARANTEED') : undefined}
            onAddPending={onAddToGuarantees ? () => onAddToGuarantees(elector, 'PENDING') : undefined}
            onRemove={elector.guaranteeStatus && onRemoveFromGuarantees ? () => onRemoveFromGuarantees(elector) : undefined}
            onView={onViewElector ? () => onViewElector(elector.kocId) : undefined}
          />
        )}
      </Stack>
    </Paper>
  );
};

export default ElectorCard;

