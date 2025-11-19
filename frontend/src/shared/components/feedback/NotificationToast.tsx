import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, AlertTitle, alpha, useTheme, SxProps, Theme, IconButton, Box, Typography } from '@mui/material';
import { IconX, IconCheck, IconAlertTriangle, IconInfoCircle, IconCircleX } from '@tabler/icons-react';

export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

export interface NotificationToastProps {
  open: boolean;
  message: string;
  title?: string;
  severity?: ToastSeverity;
  duration?: number; // in milliseconds, 0 = persistent
  onClose?: () => void;
  action?: React.ReactNode;
  position?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  variant?: 'filled' | 'outlined' | 'standard';
  showIcon?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  open,
  message,
  title,
  severity = 'info',
  duration = 6000,
  onClose,
  action,
  position = { vertical: 'top', horizontal: 'right' },
  variant = 'filled',
  showIcon = true,
  className,
  sx
}) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(open);

  useEffect(() => {
    setIsVisible(open);
  }, [open]);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsVisible(false);
    onClose?.();
  };

  const getSeverityIcon = () => {
    const iconProps = { size: 20 };
    switch (severity) {
      case 'success':
        return <IconCheck {...iconProps} />;
      case 'error':
        return <IconCircleX {...iconProps} />;
      case 'warning':
        return <IconAlertTriangle {...iconProps} />;
      case 'info':
      default:
        return <IconInfoCircle {...iconProps} />;
    }
  };

  const getVariantStyles = (): SxProps<Theme> => {
    const baseStyles = {
      borderRadius: 2,
      boxShadow: theme.shadows[8],
      '& .MuiAlert-message': {
        width: '100%'
      }
    };

    switch (variant) {
      case 'outlined':
        return {
          ...baseStyles,
          border: `1px solid ${theme.palette[severity].main}`,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette[severity].main
        };
      case 'standard':
        return {
          ...baseStyles,
          backgroundColor: alpha(theme.palette[severity].main, 0.1),
          color: theme.palette[severity].dark,
          border: 'none'
        };
      case 'filled':
      default:
        return {
          ...baseStyles,
          backgroundColor: theme.palette[severity].main,
          color: theme.palette[severity].contrastText,
          border: 'none'
        };
    }
  };

  const alertStyles: SxProps<Theme> = {
    ...getVariantStyles(),
    '& .MuiAlert-icon': {
      color: variant === 'filled' ? 'inherit' : theme.palette[severity].main
    },
    '& .MuiAlert-action': {
      paddingTop: 0
    },
    ...sx
  };

  return (
    <Snackbar
      open={isVisible}
      autoHideDuration={duration === 0 ? undefined : duration}
      onClose={handleClose}
      anchorOrigin={position}
      className={className}
    >
      <Alert
        severity={severity}
        variant={variant}
        onClose={duration === 0 ? undefined : handleClose}
        icon={showIcon ? getSeverityIcon() : false}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {action}
            {duration === 0 && (
              <IconButton
                size="small"
                onClick={handleClose}
                sx={{
                  color: variant === 'filled' ? 'inherit' : theme.palette.text.secondary,
                  '&:hover': {
                    backgroundColor: alpha(variant === 'filled' ? theme.palette.common.white : theme.palette.text.secondary, 0.1)
                  }
                }}
              >
                <IconX size={16} />
              </IconButton>
            )}
          </Box>
        }
        sx={alertStyles}
      >
        {title && <AlertTitle sx={{ fontWeight: 600, mb: 0.5 }}>{title}</AlertTitle>}
        <Typography variant="body2" component="div">
          {message}
        </Typography>
      </Alert>
    </Snackbar>
  );
};

export default NotificationToast;
