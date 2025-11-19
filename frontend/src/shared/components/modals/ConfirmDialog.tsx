import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  alpha,
  useTheme,
  SxProps,
  Theme,
  IconButton
} from '@mui/material';
import { IconX, IconAlertTriangle, IconInfoCircle, IconCircleCheck, IconCircleX } from '@tabler/icons-react';

export type ConfirmDialogType = 'info' | 'warning' | 'error' | 'success';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  type?: ConfirmDialogType;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  onClose?: () => void;
  loading?: boolean;
  confirmColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  cancelColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  type = 'info',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  onClose,
  loading = false,
  confirmColor,
  cancelColor = 'primary',
  maxWidth = 'sm',
  fullWidth = true,
  className,
  sx
}) => {
  const theme = useTheme();

  const handleClose = () => {
    if (!loading) {
      onClose?.();
      onCancel();
    }
  };

  const getTypeIcon = () => {
    const iconProps = { size: 24 };
    switch (type) {
      case 'warning':
        return <IconAlertTriangle {...iconProps} />;
      case 'error':
        return <IconCircleX {...iconProps} />;
      case 'success':
        return <IconCircleCheck {...iconProps} />;
      case 'info':
      default:
        return <IconInfoCircle {...iconProps} />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'warning':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      case 'success':
        return theme.palette.success.main;
      case 'info':
      default:
        return theme.palette.info.main;
    }
  };

  const getConfirmColor = () => {
    if (confirmColor) return confirmColor;
    switch (type) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      case 'info':
      default:
        return 'primary';
    }
  };

  const dialogStyles: SxProps<Theme> = {
    '& .MuiDialog-paper': {
      borderRadius: 3,
      boxShadow: theme.shadows[24]
    },
    ...sx
  };

  const iconBoxStyles: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: alpha(getTypeColor(), 0.1),
    color: getTypeColor(),
    mb: 2
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={maxWidth} fullWidth={fullWidth} className={className} sx={dialogStyles}>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={iconBoxStyles}>{getTypeIcon()}</Box>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          disabled={loading}
          size="small"
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: alpha(theme.palette.text.secondary, 0.04)
            }
          }}
        >
          <IconX size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0, pb: 2 }}>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={onCancel}
          disabled={loading}
          color={cancelColor}
          variant="outlined"
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            px: 3
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          color={getConfirmColor()}
          variant="contained"
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            px: 3
          }}
        >
          {loading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
