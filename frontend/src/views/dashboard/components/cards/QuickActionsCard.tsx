/**
 * Quick Actions Card Component
 * Displays quick action buttons for common tasks
 */

import React from 'react';
import { Paper, Typography, Stack, Button } from '@mui/material';
import { IconEdit, IconSettings, IconChartBar, IconCalendarEvent } from '@tabler/icons-react';

export interface QuickActionsCardProps {
  onEditElection?: () => void;
  onManageEntities?: () => void;
  onViewReports?: () => void;
  onScheduleEvents?: () => void;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  onEditElection,
  onManageEntities,
  onViewReports,
  onScheduleEvents
}) => {
  return (
    <Paper sx={{ p: 2.5, borderRadius: 2, height: '100%', border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Quick Actions
      </Typography>
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" fullWidth startIcon={<IconEdit />} onClick={onEditElection}>
          Edit Election
        </Button>
        <Button variant="outlined" fullWidth startIcon={<IconSettings />} onClick={onManageEntities}>
          Manage Entities
        </Button>
        <Button variant="outlined" fullWidth startIcon={<IconChartBar />} onClick={onViewReports}>
          View Reports
        </Button>
        <Button variant="outlined" fullWidth startIcon={<IconCalendarEvent />} onClick={onScheduleEvents}>
          Schedule Events
        </Button>
      </Stack>
    </Paper>
  );
};

export default QuickActionsCard;
