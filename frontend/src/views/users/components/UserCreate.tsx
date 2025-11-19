/**
 * User Create Page
 * Election Management System - Create new user
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Grid, TextField, MenuItem } from '@mui/material';
import { PremiumCard } from 'shared/components';
import { IconUserPlus } from '@tabler/icons-react';

const UserCreate: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement user creation
  };

  return (
    <PremiumCard title="Create New User" icon={<IconUserPlus size={24} />} variant="elevated" color="primary">
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="First Name" name="firstName" required />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Last Name" name="lastName" required />
          </Grid>
          <Grid size={12}>
            <TextField fullWidth label="Email" name="email" type="email" required />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Password" name="password" type="password" required />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField select fullWidth label="Role" name="role" defaultValue="USER" required>
              <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="SUPERVISOR">Supervisor</MenuItem>
              <MenuItem value="USER">User</MenuItem>
            </TextField>
          </Grid>
          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => navigate('/users/list')}>
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Create User
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </PremiumCard>
  );
};

export default UserCreate;
