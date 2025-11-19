/**
 * Generic Delete Confirmation Dialog
 * Reusable dialog for confirming deletion of any entity
 *
 * @component DeleteConfirmationDialog
 * @description A flexible, reusable dialog component for confirming destructive delete actions.
 * Provides clear visual feedback, warning messages, and loading states.
 *
 * @example
 * ```tsx
 * <DeleteConfirmationDialog
 *   open={showDelete}
 *   title="Delete Product"
 *   itemName="iPhone 15 Pro"
 *   itemType="product"
 *   warningMessage="This will remove the product from your inventory."
 *   isDeleting={isDeleting}
 *   onConfirm={handleConfirmDelete}
 *   onCancel={handleCancelDelete}
 * />
 * ```
 */

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Alert, CircularProgress, Box } from '@mui/material';
import { IconTrash, IconAlertTriangle } from '@tabler/icons-react';

export interface DeleteConfirmationDialogProps {
  /** Controls dialog visibility */
  open: boolean;
  /** Dialog title (e.g., "Delete Product", "Remove User") */
  title: string;
  /** Name of the item to be deleted (displayed in the warning) */
  itemName: string;
  /** Type of the item (e.g., "product", "user", "party") - used in default warning message */
  itemType: string;
  /** Optional custom warning message. If not provided, uses default message */
  warningMessage?: string;
  /** Loading state - shows spinner and disables actions when true */
  isDeleting: boolean;
  /** Callback when user confirms deletion */
  onConfirm: () => void;
  /** Callback when user cancels deletion */
  onCancel: () => void;
  /** Optional maximum width of dialog */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * DeleteConfirmationDialog Component
 *
 * A production-ready delete confirmation dialog with:
 * - Visual warning indicators (icon + alert)
 * - Clear item identification
 * - Loading state support
 * - Keyboard accessibility
 * - Prevent accidental closures during deletion
 */
const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  title,
  itemName,
  itemType,
  warningMessage,
  isDeleting,
  onConfirm,
  onCancel,
  maxWidth = 'sm'
}) => {
  return (
    <Dialog
      open={open}
      onClose={!isDeleting ? onCancel : undefined}
      maxWidth={maxWidth}
      fullWidth
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 1,
              bgcolor: 'error.lighter',
              color: 'error.main'
            }}
          >
            <IconAlertTriangle size={24} />
          </Box>
          <Typography variant="h5" fontWeight={600} sx={{ flex: 1 }}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent id="delete-dialog-description">
        <Alert
          severity="warning"
          sx={{
            mb: 2.5,
            '& .MuiAlert-message': {
              width: '100%'
            }
          }}
          icon={<IconAlertTriangle size={20} />}
        >
          {warningMessage || `This action cannot be undone. Are you sure you want to delete this ${itemType}?`}
        </Alert>

        <Box
          sx={{
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {itemType.charAt(0).toUpperCase() + itemType.slice(1)}:
          </Typography>
          <Typography variant="body1" fontWeight={600} color="text.primary">
            {itemName}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onCancel} disabled={isDeleting} variant="outlined" size="large">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isDeleting}
          startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : <IconTrash size={18} />}
          size="large"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
