import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  alpha,
  useTheme,
  SxProps,
  Theme,
  IconButton,
  Typography
} from '@mui/material';
import { IconX } from '@tabler/icons-react';

export interface ModalDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  fullScreen?: boolean;
  showCloseButton?: boolean;
  closable?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
}

/**
 * ModalDialog - A premium modal dialog component
 *
 * Features:
 * - Gradient header
 * - Custom actions
 * - Size variants
 * - Close button control
 * - Full screen support
 * - Premium styling
 *
 * @example
 * ```tsx
 * <ModalDialog
 *   open={open}
 *   onClose={handleClose}
 *   title="Create New Item"
 *   maxWidth="md"
 *   actions={
 *     <Box>
 *       <Button onClick={handleClose}>Cancel</Button>
 *       <Button variant="contained" onClick={handleSave}>Save</Button>
 *     </Box>
 *   }
 * >
 *   <Typography>Modal content here</Typography>
 * </ModalDialog>
 * ```
 */
const ModalDialog: React.FC<ModalDialogProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  fullScreen = false,
  showCloseButton = true,
  closable = true,
  className,
  sx
}) => {
  const theme = useTheme();

  const dialogStyles: SxProps<Theme> = {
    '& .MuiDialog-paper': {
      borderRadius: 3,
      background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
      backdropFilter: 'blur(10px)',
      boxShadow: theme.shadows[24],
      ...sx
    }
  };

  return (
    <Dialog
      open={open}
      onClose={closable ? onClose : undefined}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      className={className}
      sx={dialogStyles}
    >
      {/* Header */}
      {(title || showCloseButton) && (
        <DialogTitle
          sx={{
            p: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {title && (
            <Typography variant="h6" fontWeight={600} color="text.primary">
              {title}
            </Typography>
          )}
          {showCloseButton && closable && (
            <IconButton
              size="small"
              onClick={onClose}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                  color: 'error.main'
                }
              }}
            >
              <IconX size={20} />
            </IconButton>
          )}
        </DialogTitle>
      )}

      {/* Content */}
      <DialogContent
        sx={{
          p: 3,
          '&:first-of-type': {
            pt: title || showCloseButton ? 3 : 3
          }
        }}
      >
        {children}
      </DialogContent>

      {/* Actions */}
      {actions && (
        <DialogActions
          sx={{
            p: 3,
            pt: 0,
            background: `linear-gradient(135deg, ${alpha(theme.palette.grey[50], 0.5)} 0%, ${alpha(theme.palette.grey[50], 0.3)} 100%)`,
            borderTop: `1px solid ${alpha(theme.palette.grey[200], 0.5)}`
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ModalDialog;
