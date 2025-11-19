import { Box, CircularProgress, Stack, Typography, Skeleton } from '@mui/material';

/**
 * LoadingState Component
 *
 * Displays loading state with spinner and optional message
 * Used in: All client tabs during data loading
 *
 * Replaces duplicate loading state implementations
 */

export interface LoadingStateProps {
  /** Loading message */
  message?: string;
  /** Type of loading indicator */
  type?: 'spinner' | 'skeleton' | 'linear';
  /** Size of spinner */
  size?: number;
  /** Compact mode (smaller padding) */
  compact?: boolean;
  /** Number of skeleton rows (for skeleton type) */
  skeletonRows?: number;
  /** Skeleton variant */
  skeletonVariant?: 'text' | 'rectangular' | 'rounded';
}

const LoadingState = ({
  message = 'Loading...',
  type = 'spinner',
  size = 40,
  compact = false,
  skeletonRows = 3,
  skeletonVariant = 'rectangular'
}: LoadingStateProps) => {
  // Skeleton loading
  if (type === 'skeleton') {
    return (
      <Box sx={{ py: compact ? 2 : 3, px: 2 }}>
        <Stack spacing={2}>
          {Array.from({ length: skeletonRows }).map((_, index) => (
            <Skeleton key={index} variant={skeletonVariant} height={skeletonVariant === 'text' ? 20 : 60} animation="wave" />
          ))}
        </Stack>
      </Box>
    );
  }

  // Spinner loading
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: compact ? 150 : 250,
        py: compact ? 2 : 4,
        px: 2
      }}
    >
      <Stack spacing={2} alignItems="center">
        <CircularProgress size={size} thickness={4} />
        {message && (
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default LoadingState;
