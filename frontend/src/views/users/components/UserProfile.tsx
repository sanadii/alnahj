/**
 * User Profile Page
 * Election Management System - View user profile and statistics
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { PremiumCard, StatusChip } from 'shared/components';
import { IconUser, IconEdit } from '@tabler/icons-react';
import { UserRoleLabels } from 'types/users-management';

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Fetch user profile
  }, [id]);

  // Mock data
  const user = {
    id: parseInt(id || '0'),
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: 'USER' as const,
    isActive: true,
    supervisorName: 'Jane Smith'
  };

  return (
    <PremiumCard
      title="User Profile"
      icon={<IconUser size={24} />}
      variant="elevated"
      color="primary"
      action={
        <Button variant="contained" startIcon={<IconEdit size={20} />} onClick={() => navigate(`/users/edit/${id}`)}>
          Edit Profile
        </Button>
      }
    >
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Basic Information
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1">
                    {user.firstName} {user.lastName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{user.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Role
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip label={UserRoleLabels[user.role]} color="primary" size="small" />
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <StatusChip status={user.isActive ? 'active' : 'inactive'} label={user.isActive ? 'Active' : 'Inactive'} />
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Supervisor
                  </Typography>
                  <Typography variant="body1">{user.supervisorName || 'None'}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Statistics
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Total Guarantees
                  </Typography>
                  <Typography variant="h5">0</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Overdue Follow-ups
                  </Typography>
                  <Typography variant="h5">0</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PremiumCard>
  );
};

export default UserProfile;
