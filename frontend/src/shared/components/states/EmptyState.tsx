import { Box, Stack, Typography, Button } from '@mui/material';
import { ReactNode } from 'react';

/**
 * EmptyState Component
 *
 * Displays empty state with icon, message, and optional action button
 * Used in: All client tabs when no data is available
 *
 * Replaces duplicate empty state implementations
 */

export interface EmptyStateProps {
  /** Icon to display (MUI Icon component) */
  icon?: ReactNode;
  /** Main title/message */
  title: string;
  /** Description/subtitle */
  description?: string;
  /** Action button label */
  actionLabel?: string;
  /** Action button click handler */
  onAction?: () => void;
  /** Icon size */
  iconSize?: number;
  /** Icon color */
  iconColor?: string;
  /** Compact mode (smaller padding) */
  compact?: boolean;
}

const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  iconSize = 80,
  iconColor = 'text.secondary',
  compact = false
}: EmptyStateProps) => {
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
      <Stack spacing={3} alignItems="center" maxWidth={400}>
        {/* Icon */}
        {icon && (
          <Box
            sx={{
              fontSize: iconSize,
              color: iconColor,
              opacity: 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
        )}

        {/* Title */}
        <Typography variant={compact ? 'h6' : 'h5'} color="text.primary" textAlign="center" fontWeight={500}>
          {title}
        </Typography>

        {/* Description */}
        {description && (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ maxWidth: 350 }}>
            {description}
          </Typography>
        )}

        {/* Action Button */}
        {actionLabel && onAction && (
          <Button variant="contained" color="primary" onClick={onAction} size={compact ? 'medium' : 'large'}>
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default EmptyState;
