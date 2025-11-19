import React from 'react';
import { Stack, Chip, IconButton, Tooltip, CircularProgress, useMediaQuery } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  AddCircle as AddCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  RemoveCircle as RemoveIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import type { GuaranteeStatus } from 'types/guarantees';
import { GuaranteeStatusLabels, getGuaranteeStatusColor } from 'types/guarantees';

interface ElectorActionButtonsProps {
  guaranteeStatus?: GuaranteeStatus | null;
  isAdding?: boolean;
  isRemoving?: boolean;
  onAddGuaranteed?: () => void;
  onAddPending?: () => void;
  onRemove?: () => void;
  onView?: () => void;
  justifyContent?: 'flex-start' | 'center' | 'flex-end';
  showViewButton?: boolean;
  stackSx?: SxProps<Theme>;
}

const ElectorActionButtons: React.FC<ElectorActionButtonsProps> = ({
  guaranteeStatus,
  isAdding = false,
  isRemoving = false,
  onAddGuaranteed,
  onAddPending,
  onRemove,
  onView,
  justifyContent = 'flex-end',
  showViewButton = true,
  stackSx
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const actionSize = isMobile ? 26 : 34;
  const iconSize = isMobile ? 14 : 18;
  const defaultActionSx = {
    width: actionSize,
    height: actionSize,
    borderRadius: '50%',
    border: '1px solid',
    transition: 'all 0.2s ease',
    '& .MuiSvgIcon-root': {
      fontSize: iconSize
    },
    '&:hover': {
      transform: 'translateY(-1px) scale(1.05)'
    },
    '&.Mui-disabled': {
      boxShadow: 'none'
    }
  } as const;

  const renderAddGuaranteedButton = () => {
    if (!onAddGuaranteed) return null;
    return (
      <Tooltip title="Add to Guarantees">
        <span>
          <IconButton
            size="small"
            disabled={isAdding}
            onClick={onAddGuaranteed}
            sx={{
              ...defaultActionSx,
              borderColor: 'rgba(46, 204, 113, 0.5)',
              bgcolor: 'rgba(46, 204, 113, 0.18)',
              color: 'success.main',
              boxShadow: '0 0 0 1px rgba(46, 204, 113, 0.24) inset',
              '&:hover': {
                ...defaultActionSx['&:hover'],
                bgcolor: 'rgba(46, 204, 113, 0.28)',
                boxShadow: '0 6px 16px rgba(46, 204, 113, 0.26), 0 0 0 1px rgba(46, 204, 113, 0.26) inset'
              },
              '&.Mui-disabled': {
                ...defaultActionSx['&.Mui-disabled'],
                bgcolor: 'rgba(46, 204, 113, 0.1)',
                borderColor: 'rgba(46, 204, 113, 0.2)',
                color: 'rgba(46, 204, 113, 0.4)'
              }
            }}
          >
            {isAdding ? <CircularProgress size={isMobile ? 14 : 16} color="inherit" /> : <AddCircleIcon fontSize="small" />}
          </IconButton>
        </span>
      </Tooltip>
    );
  };

  const renderAddPendingButton = () => {
    if (!onAddPending) return null;
    const tooltip = guaranteeStatus === 'GUARANTEED' ? 'Move to Waiting List' : 'Add to Pending List';
    return (
      <Tooltip title={tooltip}>
        <span>
          <IconButton
            size="small"
            disabled={isAdding}
            onClick={onAddPending}
            sx={{
              ...defaultActionSx,
              borderColor: 'rgba(255, 193, 7, 0.4)',
              bgcolor: 'rgba(255, 193, 7, 0.12)',
              color: 'warning.main',
              boxShadow: '0 0 0 1px rgba(255, 193, 7, 0.18) inset',
              '&:hover': {
                ...defaultActionSx['&:hover'],
                bgcolor: 'rgba(255, 193, 7, 0.22)',
                boxShadow: '0 6px 16px rgba(255, 193, 7, 0.25), 0 0 0 1px rgba(255, 193, 7, 0.25) inset'
              }
            }}
          >
            {isAdding ? <CircularProgress size={isMobile ? 14 : 16} color="inherit" /> : <HourglassEmptyIcon fontSize="small" />}
          </IconButton>
        </span>
      </Tooltip>
    );
  };

  const renderRemoveButton = () => {
    if (!onRemove) return null;
    return (
      <Tooltip title="Remove from Guarantees">
        <span>
          <IconButton
            size="small"
            disabled={isRemoving}
            onClick={onRemove}
            sx={{
              ...defaultActionSx,
              borderColor: 'rgba(239, 83, 80, 0.4)',
              bgcolor: 'rgba(239, 83, 80, 0.12)',
              color: 'error.main',
              boxShadow: '0 0 0 1px rgba(239, 83, 80, 0.18) inset',
              '&:hover': {
                ...defaultActionSx['&:hover'],
                bgcolor: 'rgba(239, 83, 80, 0.22)',
                boxShadow: '0 6px 16px rgba(239, 83, 80, 0.25), 0 0 0 1px rgba(239, 83, 80, 0.25) inset'
              },
              '&.Mui-disabled': {
                ...defaultActionSx['&.Mui-disabled'],
                bgcolor: 'rgba(239, 83, 80, 0.08)',
                borderColor: 'rgba(239, 83, 80, 0.2)',
                color: 'rgba(239, 83, 80, 0.4)'
              }
            }}
          >
            {isRemoving ? <CircularProgress size={isMobile ? 14 : 16} color="inherit" /> : <RemoveIcon fontSize="small" />}
          </IconButton>
        </span>
      </Tooltip>
    );
  };

  const renderViewButton = () => {
    if (!onView || !showViewButton) return null;
    return (
      <Tooltip title="View Details">
        <IconButton
          size="small"
          onClick={onView}
          sx={{
            ...defaultActionSx,
            borderColor: 'rgba(33, 150, 243, 0.2)',
            bgcolor: 'rgba(33, 150, 243, 0.12)',
            color: 'info.main',
            boxShadow: '0 0 0 1px rgba(33, 150, 243, 0.18) inset',
            '&:hover': {
              ...defaultActionSx['&:hover'],
              bgcolor: 'rgba(33, 150, 243, 0.22)',
              boxShadow: '0 6px 16px rgba(33, 150, 243, 0.25), 0 0 0 1px rgba(33, 150, 243, 0.25) inset'
            }
          }}
        >
          <ViewIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  };

  const renderGuaranteeChip = () => {
    if (!guaranteeStatus) {
      return null;
    }
    const color = getGuaranteeStatusColor(guaranteeStatus);
    return (
      <Chip
        icon={
          guaranteeStatus === 'PENDING' ? (
            <HourglassEmptyIcon sx={{ fontSize: isMobile ? 12 : 16 }} />
          ) : (
            <CheckCircleIcon sx={{ fontSize: isMobile ? 12 : 16 }} />
          )
        }
        label={GuaranteeStatusLabels[guaranteeStatus] || 'Guaranteed'}
        size="small"
        sx={{
          fontWeight: 600,
          height: isMobile ? 24 : 32,
          px: isMobile ? 0.8 : 1.2,
          minWidth: isMobile ? 90 : 130,
          fontSize: isMobile ? '0.7rem' : undefined,
          justifyContent: 'flex-start',
          display: 'flex',
          gap: 0.5,
          color,
          bgcolor: alpha(color, 0.12),
          border: '1px solid',
          borderColor: alpha(color, 0.4),
          '& .MuiChip-icon': {
            color
          }
        }}
      />
    );
  };

  const shouldShowAddPendingButton = (!guaranteeStatus || guaranteeStatus === 'GUARANTEED') && Boolean(onAddPending);
  const shouldShowAddGuaranteedButton = !guaranteeStatus
    ? Boolean(onAddGuaranteed)
    : guaranteeStatus === 'PENDING' && Boolean(onAddGuaranteed);

  const stackStyle = stackSx ? { width: '100%', ...stackSx } : { width: '100%' };

  return (
    <Stack direction="row" spacing={isMobile ? 0.25 : 0.5} alignItems="center" justifyContent={justifyContent} sx={stackStyle}>
      {renderGuaranteeChip()}
      {shouldShowAddGuaranteedButton && renderAddGuaranteedButton()}
      {shouldShowAddPendingButton && renderAddPendingButton()}
      {guaranteeStatus && renderRemoveButton()}
      {!guaranteeStatus && onRemove && renderRemoveButton()}
      {renderViewButton()}
    </Stack>
  );
};

export default ElectorActionButtons;
