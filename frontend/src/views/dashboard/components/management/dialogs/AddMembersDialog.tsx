import React, { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { IconSearch } from '@tabler/icons-react';
import { UserRole } from 'types/users-management';

interface Props {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  allUsers: any[];
  users: any[];
  committees: any[];
  loadingUsers: boolean;
  isAssigning: boolean;
  userCreationMode: 'select' | 'create';
  onModeChange: (mode: 'select' | 'create') => void;
  newUserData: any;
  onNewUserDataChange: (data: any) => void;
  onCreateAndAdd: () => void;
  selectedUserIds: number[];
  onSelectedUsersChange: (ids: number[]) => void;
  onAssignUsers: () => void;
  onSaveEdit?: () => void;
}

const ROLE_OPTIONS = [
  { value: UserRole.USER, label: 'User' },
  { value: UserRole.SUPERVISOR, label: 'Supervisor' },
  { value: UserRole.ADMIN, label: 'Admin' }
];

const AddMembersDialog: React.FC<Props> = ({
  open,
  onClose,
  mode,
  allUsers,
  users,
  committees,
  loadingUsers,
  isAssigning,
  userCreationMode,
  onModeChange,
  newUserData,
  onNewUserDataChange,
  selectedUserIds,
  onSelectedUsersChange,
  onAssignUsers,
  onCreateAndAdd,
  onSaveEdit
}) => {
  const isEditMode = mode === 'edit';
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);

  const electionUserIds = useMemo(() => users.map((user) => user.id), [users]);

  const filteredUsers = useMemo(() => {
    return allUsers
      .filter((user) => {
        if (showOnlyAvailable && electionUserIds.includes(user.id)) {
          return false;
        }
        if (!searchTerm.trim()) return true;
        const query = searchTerm.toLowerCase();
        const name = `${user.first_name ?? ''} ${user.last_name ?? ''}`.toLowerCase();
        const email = (user.email ?? '').toLowerCase();
        const phone = (user.phone ?? '').toLowerCase();
        return name.includes(query) || email.includes(query) || phone.includes(query);
      })
      .sort((a, b) => {
        const aSelected = selectedUserIds.includes(a.id) ? -1 : 1;
        const bSelected = selectedUserIds.includes(b.id) ? -1 : 1;
        return aSelected - bSelected;
      });
  }, [allUsers, electionUserIds, searchTerm, showOnlyAvailable, selectedUserIds]);

  const handleToggleUser = (userId: number) => {
    if (selectedUserIds.includes(userId)) {
      onSelectedUsersChange(selectedUserIds.filter((id) => id !== userId));
    } else {
      onSelectedUsersChange([...selectedUserIds, userId]);
    }
  };

  const handleNewUserChange = (field: string, value: any) => {
    onNewUserDataChange({
      ...newUserData,
      [field]: value
    });
  };

  const isFormInvalid =
    !newUserData.firstName || !newUserData.lastName || !newUserData.email || !newUserData.phone || isAssigning;

  const renderSelectExisting = () => (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Typography variant="subtitle2" color="text.secondary">
          Select existing system users to add to this election. Use the search to filter by name, email, or phone.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search users..."
            InputProps={{
              startAdornment: (
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', pr: 1, color: 'text.secondary' }}>
                  <IconSearch size={16} />
                </Box>
              )
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showOnlyAvailable}
                onChange={(event) => setShowOnlyAvailable(event.target.checked)}
              />
            }
            label="Hide users already in election"
          />
        </Stack>
      </Stack>

      {loadingUsers ? (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Loading users...
          </Typography>
        </Box>
      ) : filteredUsers.length === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? 'No users match your search.' : 'All active users have already been added.'}
          </Typography>
        </Box>
      ) : (
        <List sx={{ maxHeight: 360, overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          {filteredUsers.map((user) => {
            const fullName = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || user.username || 'Unnamed User';
            const initials = fullName
              .split(' ')
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0])
              .join('')
              .toUpperCase();
            const isSelected = selectedUserIds.includes(user.id);
            const alreadyInElection = electionUserIds.includes(user.id);

            return (
              <React.Fragment key={user.id}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <Checkbox
                      edge="end"
                      checked={isSelected}
                      disabled={alreadyInElection}
                      onChange={() => handleToggleUser(user.id)}
                    />
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: alreadyInElection ? 'grey.400' : 'primary.main', color: 'white' }}>
                      {initials || fullName[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle1" fontWeight={600}>
                          {fullName}
                        </Typography>
                        {alreadyInElection && <Chip label="In Election" size="small" color="default" />}
                        {user.role && (
                          <Chip
                            label={user.role.toUpperCase()}
                            size="small"
                            color={user.role === 'ADMIN' ? 'error' : user.role === 'SUPERVISOR' ? 'warning' : 'default'}
                          />
                        )}
                      </Stack>
                    }
                    secondary={
                      <Stack spacing={0.5}>
                        {user.email && (
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                        )}
                        {user.phone && (
                          <Typography variant="body2" color="text.secondary">
                            {user.phone}
                          </Typography>
                        )}
                        {user.assignedCommittees && user.assignedCommittees.length > 0 && (
                          <Typography variant="caption" color="text.secondary">
                            Committees: {user.assignedCommittees.map((c: any) => c.name).join(', ')}
                          </Typography>
                        )}
                      </Stack>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            );
          })}
        </List>
      )}
      <Typography variant="caption" color="text.secondary">
        {selectedUserIds.length} user{selectedUserIds.length === 1 ? '' : 's'} selected
      </Typography>
    </Stack>
  );

  const renderCreateNew = (options?: { isEdit?: boolean }) => (
    <Stack spacing={2}>
      <Typography variant="subtitle2" color="text.secondary">
        {options?.isEdit
          ? 'Update this user’s account information. The phone can also be used as their password if desired.'
          : 'Create a brand new user and add them directly to this election. The phone number will be saved as their password.'}
      </Typography>
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
        <TextField
          fullWidth
          label="First Name"
          value={newUserData.firstName}
          onChange={(event) => handleNewUserChange('firstName', event.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Last Name"
          value={newUserData.lastName}
          onChange={(event) => handleNewUserChange('lastName', event.target.value)}
          required
        />
      </Stack>
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={newUserData.email}
        onChange={(event) => handleNewUserChange('email', event.target.value)}
        required
      />
      <TextField
        fullWidth
        label="Phone (temporary password)"
        value={newUserData.phone}
        onChange={(event) => handleNewUserChange('phone', event.target.value)}
        helperText="This phone number will also be saved as the initial password."
        required
      />
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
        <FormControl fullWidth>
          <InputLabel id="new-user-role-label">Role</InputLabel>
          <Select
            labelId="new-user-role-label"
            label="Role"
            value={newUserData.role}
            onChange={(event) => handleNewUserChange('role', event.target.value as UserRole)}
          >
            {ROLE_OPTIONS.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                {role.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {!options?.isEdit && (
          <FormControl fullWidth>
            <InputLabel id="new-user-committee-label">Assign to Committee (optional)</InputLabel>
            <Select
              labelId="new-user-committee-label"
              label="Assign to Committee (optional)"
              value={newUserData.committeeId ?? ''}
              onChange={(event) => {
                const value = event.target.value;
                handleNewUserChange('committeeId', value === '' ? undefined : Number(value));
              }}
            >
              <MenuItem value="">No committee assignment</MenuItem>
              {committees.map((committee: any) => (
                <MenuItem key={committee.id} value={committee.id}>
                  {committee.name} ({committee.code})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Stack>
    </Stack>
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{isEditMode ? 'Edit User' : 'Add Members'}</DialogTitle>
      {isEditMode ? (
        <DialogContent dividers>{renderCreateNew({ isEdit: true })}</DialogContent>
      ) : (
        <DialogContent dividers>
          <Tabs
            value={userCreationMode}
            onChange={(_, value) => onModeChange(value)}
            aria-label="Add members mode"
            sx={{ mb: 2 }}
          >
            <Tab label="Select Existing Users" value="select" />
            <Tab label="Create New User" value="create" />
          </Tabs>
          {userCreationMode === 'select' ? renderSelectExisting() : renderCreateNew()}
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onClose} disabled={isAssigning}>
          Close
        </Button>
        {!isEditMode && (
          <>
            <Button
              onClick={onAssignUsers}
              disabled={isAssigning || selectedUserIds.length === 0}
              variant="outlined"
            >
              Assign Selected
            </Button>
            <Button onClick={onCreateAndAdd} disabled={isFormInvalid} variant="contained">
              Create & Add
            </Button>
          </>
        )}
        {isEditMode && (
          <Button onClick={onSaveEdit} disabled={isFormInvalid} variant="contained">
            Save Changes
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddMembersDialog;


