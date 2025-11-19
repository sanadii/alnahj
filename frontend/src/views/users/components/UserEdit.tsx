/**
 * User Edit Page
 * Election Management System - Edit existing user
 */

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Grid, TextField, MenuItem } from '@mui/material';
import { PremiumCard } from 'shared/components';
import { IconEdit } from '@tabler/icons-react';

const UserEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    // TODO: Fetch user data
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement user update
  };

  return (
    <PremiumCard title="Edit User" icon={<IconEdit size={24} />} variant="elevated" color="primary">
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="First Name" name="firstName" defaultValue="John" required />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Last Name" name="lastName" defaultValue="Doe" required />
          </Grid>
          <Grid size={12}>
            <TextField fullWidth label="Email" name="email" type="email" defaultValue="john@example.com" required />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField select fullWidth label="Role" name="role" defaultValue="USER" required>
              <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="SUPERVISOR">Supervisor</MenuItem>
              <MenuItem value="USER">User</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField select fullWidth label="Status" name="isActive" defaultValue="true">
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </TextField>
          </Grid>
          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => navigate('/users/list')}>
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Update User
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </PremiumCard>
  );
};

export default UserEdit;
