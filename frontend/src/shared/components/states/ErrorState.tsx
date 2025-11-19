import { Box, Stack, Typography, Button, Alert } from '@mui/material';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';

/**
 * ErrorState Component
 *
 * Displays error state with message and optional retry action
 * Used in: All client tabs when data loading fails
 *
 * Replaces duplicate error state implementations
 */

export interface ErrorStateProps {
  /** Error message */
  message: string;
  /** Detailed error description */
  description?: string;
  /** Retry button label */
  retryLabel?: string;
  /** Retry button click handler */
  onRetry?: () => void;
  /** Display as alert instead of full state */
  variant?: 'full' | 'alert';
  /** Compact mode (smaller padding) */
  compact?: boolean;
  /** Alert severity */
  severity?: 'error' | 'warning' | 'info';
}

const ErrorState = ({
  message,
  description,
  retryLabel = 'Try Again',
  onRetry,
  variant = 'full',
  compact = false,
  severity = 'error'
}: ErrorStateProps) => {
  // Alert variant
  if (variant === 'alert') {
    return (
      <Alert
        severity={severity}
        action={
          onRetry && (
            <Button color="inherit" size="small" onClick={onRetry} startIcon={<IconRefresh size={16} />}>
              {retryLabel}
            </Button>
          )
        }
      >
        <Typography variant="body2" fontWeight={500}>
          {message}
        </Typography>
        {description && (
          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
            {description}
          </Typography>
        )}
      </Alert>
    );
  }

  // Full state variant
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: compact ? 200 : 300,
        py: compact ? 3 : 6,
        px: 2
      }}
    >
      <Stack spacing={3} alignItems="center" maxWidth={450}>
        {/* Icon */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'error.lighter',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <IconAlertCircle size={40} style={{ color: 'var(--error-main)' }} />
        </Box>

        {/* Title */}
        <Typography variant={compact ? 'h6' : 'h5'} color="error.main" textAlign="center" fontWeight={500}>
          {message}
        </Typography>

        {/* Description */}
        {description && (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ maxWidth: 400 }}>
            {description}
          </Typography>
        )}

        {/* Retry Button */}
        {onRetry && (
          <Button
            variant="outlined"
            color="error"
            onClick={onRetry}
            startIcon={<IconRefresh size={18} />}
            size={compact ? 'medium' : 'large'}
          >
            {retryLabel}
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default ErrorState;
