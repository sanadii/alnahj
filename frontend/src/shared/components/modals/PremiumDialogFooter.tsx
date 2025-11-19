/**
 * PremiumDialogFooter Component
 * Elegant dialog footer with gradient submit button and animations
 *
 * @component PremiumDialogFooter
 * @description A beautiful dialog footer with gradient submit button, hover effects,
 * loading states, and consistent spacing. Perfect for premium dialog experiences.
 *
 * @example
 * ```tsx
 * <PremiumDialogFooter
 *   onCancel={handleClose}
 *   onSubmit={handleSave}
 *   cancelLabel="Cancel"
 *   submitLabel="Save Changes"
 *   loading={isSaving}
 *   submitIcon={<SaveIcon />}
 * />
 * ```
 */

import React from 'react';
import { DialogActions, Button, Box, alpha } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

export interface PremiumDialogFooterProps {
  /** Callback when cancel button is clicked */
  onCancel: () => void;
  /** Callback when submit button is clicked */
  onSubmit: () => void;
  /** Label for cancel button */
  cancelLabel?: string;
  /** Label for submit button */
  submitLabel?: string;
  /** Loading state - disables buttons and shows loading text */
  loading?: boolean;
  /** Icon for submit button */
  submitIcon?: React.ReactNode;
  /** Custom gradient for submit button */
  submitGradient?: string;
  /** Disable the submit button */
  submitDisabled?: boolean;
  /** Optional additional actions (placed before cancel/submit) */
  additionalActions?: React.ReactNode;
}

/**
 * PremiumDialogFooter Component
 *
 * Features:
 * - Gradient submit button with animations
 * - Hover effects (elevation + transform)
 * - Loading state support
 * - Customizable labels and icons
 * - Consistent spacing
 * - Theme-aware styling
 */
const PremiumDialogFooter: React.FC<PremiumDialogFooterProps> = ({
  onCancel,
  onSubmit,
  cancelLabel = 'Cancel',
  submitLabel = 'Submit',
  loading = false,
  submitIcon = <SaveIcon />,
  submitGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  submitDisabled = false,
  additionalActions
}) => {
  return (
    <DialogActions
      sx={{
        px: 4,
        py: 3,
        background: (theme) => alpha(theme.palette.divider, 0.03),
        borderTop: '1px solid',
        borderColor: 'divider',
        gap: 1.5
      }}
    >
      {/* Additional Actions (if any) */}
      {additionalActions}

      {/* Spacer */}
      <Box sx={{ flex: 1 }} />

      {/* Cancel Button */}
      <Button
        onClick={onCancel}
        disabled={loading}
        variant="outlined"
        size="large"
        sx={{
          borderRadius: 2.5,
          px: 4,
          py: 1.5,
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '1rem',
          borderWidth: 2,
          transition: 'all 0.3s ease',
          '&:hover': {
            borderWidth: 2,
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        {cancelLabel}
      </Button>

      {/* Submit Button with Gradient */}
      <Button
        onClick={onSubmit}
        disabled={loading || submitDisabled}
        variant="contained"
        size="large"
        startIcon={loading ? null : submitIcon}
        sx={{
          borderRadius: 2.5,
          px: 5,
          py: 1.5,
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '1rem',
          background: submitGradient,
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: submitGradient.replace('135deg', '315deg'), // Reverse gradient
            boxShadow: '0 12px 28px rgba(102, 126, 234, 0.5)',
            transform: 'translateY(-2px)'
          },
          '&:disabled': {
            background: submitGradient,
            opacity: 0.6
          }
        }}
      >
        {loading ? 'Processing...' : submitLabel}
      </Button>
    </DialogActions>
  );
};

export default PremiumDialogFooter;

/**
 * Submit Button Gradient Presets
 */
export const SubmitGradients = {
  purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  blue: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  green: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  pink: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  orange: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  red: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'
} as const;
