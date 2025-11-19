/**
 * Recent Activity Mini Card Component
 * Displays recent activity items in a compact format
 */

import React from 'react';
import { Paper, Typography, Stack, Box, Avatar } from '@mui/material';
import { IconChecks, IconFlag, IconUsersGroup } from '@tabler/icons-react';

export interface ActivityItem {
  text: string;
  time: string;
  icon: React.ReactNode;
  color: 'success' | 'primary' | 'info' | 'warning' | 'error' | 'secondary';
}

export interface RecentActivityMiniCardProps {
  activities?: ActivityItem[];
  totalParties?: number;
  totalCommittees?: number;
}

export const RecentActivityMiniCard: React.FC<RecentActivityMiniCardProps> = ({ activities, totalParties = 0, totalCommittees = 0 }) => {
  // Default activities if none provided
  const defaultActivities: ActivityItem[] = [
    { text: 'Election created', time: '2 hours ago', icon: <IconChecks size={18} />, color: 'success' },
    { text: `${totalParties} parties added`, time: '1 hour ago', icon: <IconFlag size={18} />, color: 'primary' },
    {
      text: `${totalCommittees} committees configured`,
      time: '30 mins ago',
      icon: <IconUsersGroup size={18} />,
      color: 'info'
    }
  ];

  const displayActivities = activities || defaultActivities;

  return (
    <Paper sx={{ p: 2.5, borderRadius: 2, height: '100%', border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Recent Activity
      </Typography>
      <Stack spacing={1.5} sx={{ mt: 2 }}>
        {displayActivities.map((activity, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.default',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateX(4px)',
                boxShadow: 1,
                borderColor: `${activity.color}.main`,
                bgcolor: `${activity.color}.lighter`
              }
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: `${activity.color}.light`,
                  color: `${activity.color}.main`
                }}
              >
                {activity.icon}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  {activity.text}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {activity.time}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
};

export default RecentActivityMiniCard;
