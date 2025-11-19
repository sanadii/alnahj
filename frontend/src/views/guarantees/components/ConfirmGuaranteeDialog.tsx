/**
 * Confirm Guarantee Dialog Component
 * Allows users to update the confirmation status of a guarantee
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Chip
} from '@mui/material';
import { Close as CloseIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import type { GuaranteeListItem, GuaranteeConfirmationStatus } from 'types/guarantees';
import { getConfirmationIcon } from 'types/guarantees';

interface ConfirmGuaranteeDialogProps {
  open: boolean;
  guarantee: GuaranteeListItem | null;
  onClose: () => void;
  onConfirm: (status: GuaranteeConfirmationStatus) => void;
}

const ConfirmGuaranteeDialog: React.FC<ConfirmGuaranteeDialogProps> = ({ open, guarantee, onClose, onConfirm }) => {
  const [status, setStatus] = useState<GuaranteeConfirmationStatus>('PENDING');

  useEffect(() => {
    if (open && guarantee) {
      setStatus(guarantee.confirmationStatus || 'PENDING');
    }
  }, [open, guarantee]);

  const handleConfirm = () => {
    onConfirm(status);
    onClose();
  };

  if (!guarantee) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: '#fff',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)'
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          pb: 2.5
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
              Confirm Guarantee
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Update confirmation status for this guarantee
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        {/* Elector Info */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 0.5 }}>
            Elector
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {guarantee.electorName}
          </Typography>
          {guarantee.electorMobile && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
              📞 {guarantee.electorMobile}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'rgba(102, 126, 234, 0.06)'
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                {status === 'CONFIRMED'
                  ? 'This guarantee is marked as confirmed.'
                  : status === 'PENDING'
                    ? 'This guarantee is awaiting confirmation.'
                    : 'This guarantee is marked as not available.'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Choose the confirmation state that best reflects your latest contact.
              </Typography>
            </Box>
            <Chip label={status} color={status === 'CONFIRMED' ? 'success' : status === 'PENDING' ? 'warning' : 'default'} />
          </Stack>

          <Box sx={{ mt: 2 }}>
            <ToggleButtonGroup
              exclusive
              value={status}
              onChange={(_, newStatus: GuaranteeConfirmationStatus | null) => newStatus && setStatus(newStatus)}
              fullWidth
              color="primary"
            >
              <ToggleButton value="PENDING">Pending</ToggleButton>
              <ToggleButton value="CONFIRMED">Confirmed</ToggleButton>
              <ToggleButton value="NOT_AVAILABLE">Not Available</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2.5,
          gap: 1,
          background: 'linear-gradient(to right, rgba(102, 126, 234, 0.03), rgba(118, 75, 162, 0.03))',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          startIcon={<CheckCircleIcon />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            background: status === 'CONFIRMED'
              ? 'linear-gradient(135deg, #10b981, #34d399)'
              : 'linear-gradient(135deg, #64748b, #94a3b8)',
            '&:hover': {
              background: status === 'CONFIRMED'
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(52, 211, 153, 0.85))'
                : 'linear-gradient(135deg, rgba(100, 116, 139, 0.9), rgba(148, 163, 184, 0.85))'
            }
          }}
        >
          {getConfirmationIcon(status)} Update Confirmation
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmGuaranteeDialog;
