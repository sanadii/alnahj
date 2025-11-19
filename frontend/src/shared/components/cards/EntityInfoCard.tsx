/**
 * EntityInfoCard Component
 * Elegant card for displaying entity identification with gradient accent
 *
 * @component EntityInfoCard
 * @description A beautiful card for showing entity information (ID, name, metadata)
 * with gradient left border, chips, and dot separators. Perfect for dialog headers.
 *
 * @example
 * ```tsx
 * <EntityInfoCard
 *   primaryId={{ label: 'KOC ID', value: 'PA0001' }}
 *   title="Ahmed Hassan"
 *   metadata={[
 *     { icon: <GroupIcon />, label: 'Committee: M1', color: 'secondary' },
 *     { icon: <PhoneIcon />, label: '+965xxxxxxx', variant: 'outlined' }
 *   ]}
 * />
 * ```
 */

import React from 'react';
import { Paper, Box, Typography, Chip, Stack, alpha, useTheme } from '@mui/material';
import { Badge as BadgeIcon } from '@mui/icons-material';

export interface EntityMetadata {
  /** Icon for the metadata chip */
  icon: React.ReactNode;
  /** Label/value for the metadata */
  label: string;
  /** MUI color for the chip */
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  /** Chip variant */
  variant?: 'filled' | 'outlined';
}

export interface EntityInfoCardProps {
  /** Primary identifier (e.g., KOC ID, User ID) */
  primaryId: {
    label: string;
    value: string;
  };
  /** Entity title/name */
  title: string;
  /** Optional metadata chips (committee, phone, etc.) */
  metadata?: EntityMetadata[];
  /** Optional gradient color for left border */
  borderGradient?: string;
  /** Optional background gradient */
  backgroundGradient?: string;
  /** Make card clickable */
  onClick?: () => void;
}

/**
 * EntityInfoCard Component
 *
 * Features:
 * - Gradient left border accent
 * - Primary ID chip (prominent)
 * - Large title text
 * - Metadata chips with dot separators
 * - Hover effects
 * - Glassmorphism effect
 * - Theme-aware colors
 */
const EntityInfoCard: React.FC<EntityInfoCardProps> = ({
  primaryId,
  title,
  metadata = [],
  borderGradient = 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
  backgroundGradient,
  onClick
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        p: 3,
        background:
          backgroundGradient ||
          (theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)'
            : 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)'),
        border: '2px solid',
        borderColor: alpha(theme.palette.primary.main, 0.1),
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        '&:hover': onClick
          ? {
              borderColor: 'primary.main',
              transform: 'translateY(-2px)',
              boxShadow: `0 12px 24px ${alpha('#667eea', 0.15)}`
            }
          : {},
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '5px',
          height: '100%',
          background: borderGradient
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexWrap: 'wrap',
          pl: 1
        }}
      >
        {/* Primary ID Chip */}
        <Chip
          icon={<BadgeIcon />}
          label={`${primaryId.label}: ${primaryId.value}`}
          size="medium"
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            fontWeight: 700,
            fontSize: '1rem',
            height: 40,
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            '& .MuiChip-icon': { color: 'white' }
          }}
        />

        {/* Dot Separator */}
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            flexShrink: 0
          }}
        />

        {/* Entity Title */}
        <Typography
          variant="h3"
          fontWeight={700}
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flexShrink: 1,
            minWidth: 0,
            flex: metadata.length > 0 ? 'initial' : 1
          }}
        >
          {title}
        </Typography>

        {/* Metadata Chips */}
        {metadata.map((meta, index) => (
          <React.Fragment key={index}>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: meta.color ? `${meta.color}.main` : 'text.secondary',
                flexShrink: 0
              }}
            />
            <Chip
              icon={meta.icon}
              label={meta.label}
              size="medium"
              color={meta.color}
              variant={meta.variant || 'filled'}
              sx={{
                fontWeight: 600,
                fontSize: '0.9rem',
                height: 40,
                flexShrink: 0,
                ...(meta.variant === 'filled' &&
                  meta.color && {
                    boxShadow: `0 4px 12px ${alpha(theme.palette[meta.color].main, 0.2)}`
                  })
              }}
            />
          </React.Fragment>
        ))}
      </Box>
    </Paper>
  );
};

export default EntityInfoCard;
