/**
 * Recent Activity Feed
 * Inspired by Berry's LatestCustomerTableCard - Shows recent election activities
 */

import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Typography,
  CardActions,
  Button,
  Chip,
  Stack,
  Box
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconUserPlus, IconUserCheck, IconCheckbox, IconShield, IconFlag, IconChevronRight } from '@tabler/icons-react';

interface Activity {
  id: number;
  type: 'elector_added' | 'attendance' | 'vote_cast' | 'guarantee_added' | 'party_registered';
  title: string;
  description: string;
  timestamp: string;
  metadata?: string;
}

interface RecentActivityFeedProps {
  activities?: Activity[];
  maxItems?: number;
  onViewAll?: () => void;
}

const defaultActivities: Activity[] = [
  {
    id: 1,
    type: 'attendance',
    title: 'Committee C-101',
    description: '45 electors marked present',
    timestamp: '2 mins ago',
    metadata: '92% attendance'
  },
  {
    id: 2,
    type: 'vote_cast',
    title: 'Committee C-105',
    description: '38 votes recorded',
    timestamp: '5 mins ago',
    metadata: '85% voting rate'
  },
  {
    id: 3,
    type: 'guarantee_added',
    title: 'Group: Downtown',
    description: '12 new guarantees collected',
    timestamp: '15 mins ago',
    metadata: '8 strong'
  },
  {
    id: 4,
    type: 'elector_added',
    title: 'New Electors',
    description: '25 electors registered',
    timestamp: '1 hour ago',
    metadata: 'Committee C-108'
  },
  {
    id: 5,
    type: 'party_registered',
    title: 'Party: Progress Alliance',
    description: 'New party registered',
    timestamp: '2 hours ago',
    metadata: '15 candidates'
  },
  {
    id: 6,
    type: 'attendance',
    title: 'Committee C-102',
    description: '52 electors marked present',
    timestamp: '3 hours ago',
    metadata: '95% attendance'
  }
];

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ activities = defaultActivities, maxItems = 6, onViewAll }) => {
  const theme = useTheme();

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'elector_added':
        return <IconUserPlus size={20} />;
      case 'attendance':
        return <IconUserCheck size={20} />;
      case 'vote_cast':
        return <IconCheckbox size={20} />;
      case 'guarantee_added':
        return <IconShield size={20} />;
      case 'party_registered':
        return <IconFlag size={20} />;
      default:
        return <IconUserPlus size={20} />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'elector_added':
        return 'primary';
      case 'attendance':
        return 'info';
      case 'vote_cast':
        return 'success';
      case 'guarantee_added':
        return 'warning';
      case 'party_registered':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const displayedActivities = activities.slice(0, maxItems);

  return (
    <Paper sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ p: 2.5 }}>
        <Typography variant="h5" fontWeight={600}>
          Recent Activity
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Live updates from your election
        </Typography>
      </Box>

      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 3 }}>Type</TableCell>
              <TableCell>Activity</TableCell>
              <TableCell>Details</TableCell>
              <TableCell align="right" sx={{ pr: 3 }}>
                Time
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedActivities.map((activity) => (
              <TableRow
                hover
                key={activity.id}
                sx={{
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <TableCell sx={{ pl: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: `${getActivityColor(activity.type)}.lighter`,
                      color: `${getActivityColor(activity.type)}.dark`,
                      width: 36,
                      height: 36
                    }}
                  >
                    {getActivityIcon(activity.type)}
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {activity.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {activity.description}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  {activity.metadata && (
                    <Chip label={activity.metadata} size="small" color={getActivityColor(activity.type)} variant="outlined" />
                  )}
                </TableCell>
                <TableCell align="right" sx={{ pr: 3 }}>
                  <Typography variant="caption" color="text.secondary">
                    {activity.timestamp}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {onViewAll && (
        <CardActions sx={{ p: 1.5, justifyContent: 'flex-end', borderTop: '1px solid', borderColor: 'divider' }}>
          <Button size="small" onClick={onViewAll} endIcon={<IconChevronRight size={16} />}>
            View All Activities
          </Button>
        </CardActions>
      )}
    </Paper>
  );
};

export default RecentActivityFeed;
