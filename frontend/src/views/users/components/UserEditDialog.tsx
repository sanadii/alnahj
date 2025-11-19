/**
 * User Edit Dialog
 * Election Management System - Modal dialog for editing users
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Box,
  Chip
} from '@mui/material';

// project imports
import { RootState } from 'store';
import { getUserRequest, updateUserRequest, clearCurrentUser } from 'store/users';
import type { UserRole } from 'types/users-management';
import { UserRoleLabels, getUserRoleColor } from 'types/users-management';

// ============================================================================
// INTERFACES
// ============================================================================

interface UserEditDialogProps {
  open: boolean;
  userId: number | null;
  onClose: () => void;
  onSuccess?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

const UserEditDialog: React.FC<UserEditDialogProps> = ({ open, userId, onClose, onSuccess }) => {
  const dispatch = useDispatch();

  // Redux state
  const { currentUser, loading, error } = useSelector((state: RootState) => state.users);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'USER' as UserRole,
    isActive: true
  });

  // Fetch user data when dialog opens
  useEffect(() => {
    if (open && userId) {
      dispatch(getUserRequest(userId));
    }

    // Cleanup when dialog closes
    return () => {
      if (!open) {
        dispatch(clearCurrentUser());
      }
    };
  }, [open, userId, dispatch]);

  // Update form data when user is loaded
  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        role: currentUser.role || 'USER',
        isActive: currentUser.isActive ?? true
      });
    }
  }, [currentUser]);

  // Handle form field changes
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle submit
  const handleSubmit = () => {
    if (!userId) return;

    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      alert('Please enter first name and last name');
      return;
    }

    if (!formData.email.trim()) {
      alert('Please enter email');
      return;
    }

    // Transform data to match backend expectations (camelCase to snake_case)
    const backendData = {
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      role: formData.role,
      is_active: formData.isActive
    };

    // Dispatch update action
    dispatch(updateUserRequest(userId, backendData as any));

    // Close dialog and trigger success callback
    handleClose();
    if (onSuccess) {
      onSuccess();
    }
  };

  // Handle close
  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: 'USER',
      isActive: true
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Edit User
        {currentUser && (
          <Box sx={{ mt: 1 }}>
            <Chip
              label={UserRoleLabels[currentUser.role]}
              size="small"
              sx={{
                backgroundColor: getUserRoleColor(currentUser.role),
                color: 'white'
              }}
            />
          </Box>
        )}
      </DialogTitle>

      <DialogContent dividers>
        {loading && !currentUser ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={2.5}>
              {/* First Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required
                  disabled={loading}
                />
              </Grid>

              {/* Last Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  required
                  disabled={loading}
                />
              </Grid>

              {/* Email */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  disabled={loading}
                />
              </Grid>

              {/* Role */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Role"
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value as UserRole)}
                  required
                  disabled={loading}
                >
                  <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="SUPERVISOR">Supervisor</MenuItem>
                  <MenuItem value="USER">User</MenuItem>
                </TextField>
              </Grid>

              {/* Status */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ pt: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch checked={formData.isActive} onChange={(e) => handleChange('isActive', e.target.checked)} disabled={loading} />
                    }
                    label={formData.isActive ? 'Active' : 'Inactive'}
                  />
                </Box>
              </Grid>

              {/* User Info Display */}
              {currentUser && (
                <Grid size={12}>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Grid container spacing={1}>
                      <Grid size={6}>
                        <strong>User ID:</strong> {currentUser.id}
                      </Grid>
                      <Grid size={6}>
                        <strong>Created:</strong> {new Date(currentUser.createdAt).toLocaleDateString()}
                      </Grid>
                      {currentUser.lastLogin && (
                        <Grid size={12}>
                          <strong>Last Login:</strong> {new Date(currentUser.lastLogin).toLocaleString()}
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Grid>
              )}
            </Grid>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading || !currentUser}>
          {loading ? <CircularProgress size={24} /> : 'Update User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserEditDialog;
