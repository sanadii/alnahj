import React from 'react';
import { Box, Avatar, Typography, Stack, Chip, IconButton, Tooltip, useTheme } from '@mui/material';

export interface EntityHeaderAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

export interface EntityHeaderProps {
  avatar?: {
    src?: string;
    alt?: string;
    fallback?: string;
    color?: string;
  };
  title: string;
  subtitle?: string;
  status?: {
    label: string;
    color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  };
  badges?: {
    label: string;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    icon?: React.ReactNode;
  }[];
  actions?: EntityHeaderAction[];
}

/**
 * Reusable entity header component
 * Can be used for Client, Contact, Order, etc. detail pages
 *
 * @example
 * ```typescript
 * <EntityHeader
 *   avatar={{ src: client.avatar, fallback: client.initials }}
 *   title={`${client.first_name} ${client.last_name}`}
 *   subtitle={client.email}
 *   status={{ label: "Active", color: "success" }}
 *   badges={[
 *     { label: "VIP", color: "primary", icon: <IconStar /> }
 *   ]}
 *   actions={[
 *     { icon: <IconEdit />, label: "Edit", onClick: handleEdit },
 *     { icon: <IconMail />, label: "Email", onClick: handleEmail }
 *   ]}
 * />
 * ```
 */
const EntityHeader: React.FC<EntityHeaderProps> = ({ avatar, title, subtitle, status, badges, actions }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
      {/* Left: Avatar + Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
        {avatar && (
          <Avatar
            src={avatar.src}
            alt={avatar.alt || title}
            sx={{
              width: 64,
              height: 64,
              bgcolor: avatar.color || theme.palette.primary.main,
              fontSize: '1.5rem',
              fontWeight: 600
            }}
          >
            {avatar.fallback || title.charAt(0)}
          </Avatar>
        )}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
            <Typography variant="h3" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>
              {title}
            </Typography>
            {status && (
              <Chip label={status.label} color={status.color} size="small" sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600 }} />
            )}
          </Box>

          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {subtitle}
            </Typography>
          )}

          {badges && badges.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {badges.map((badge, index) => (
                <Chip
                  key={index}
                  label={badge.label}
                  color={badge.color || 'default'}
                  size="small"
                  icon={badge.icon}
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              ))}
            </Stack>
          )}
        </Box>
      </Box>

      {/* Right: Actions */}
      {actions && actions.length > 0 && (
        <Stack direction="row" spacing={1}>
          {actions.map((action, index) => (
            <Tooltip key={index} title={action.label}>
              <IconButton onClick={action.onClick} color={action.color || 'primary'} size="large">
                {action.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default EntityHeader;
