/**
 * Manage Groups Dialog
 * Election Management System - Dialog for managing guarantee groups
 */

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store';

// material-ui
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Stack,
  Divider,
  Alert
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';
import { IconEdit } from '@tabler/icons-react';

// project imports
import { createGroupRequest, updateGroupRequest, deleteGroupRequest } from 'store/guarantees';
import type { GuaranteeGroup } from 'types/guarantees';
import { DeleteConfirmationDialog } from 'shared/components';

// ============================================================================
// INTERFACES
// ============================================================================

interface ManageGroupsDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

const ManageGroupsDialog: React.FC<ManageGroupsDialogProps> = ({ open, onClose, onSuccess }) => {
  const dispatch = useAppDispatch();
  const groups = useAppSelector((state) => state.guarantees?.groups || []);

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#1976d2');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState(0);

  // Delete dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Predefined colors
  const colors = [
    '#1976d2', // Blue
    '#2e7d32', // Green
    '#ed6c02', // Orange
    '#d32f2f', // Red
    '#9c27b0', // Purple
    '#0288d1', // Light Blue
    '#f57c00', // Deep Orange
    '#c62828', // Dark Red
    '#7b1fa2', // Deep Purple
    '#5e35b1' // Indigo
  ];

  // Handle create
  const handleCreate = () => {
    if (!name.trim()) {
      alert('Please enter a group name');
      return;
    }

    dispatch(
      createGroupRequest({
        name: name.trim(),
        color,
        description: description.trim(),
        order: groups.length
      })
    );

    resetForm();
  };

  // Handle edit
  const handleEdit = (group: GuaranteeGroup) => {
    setIsEditing(true);
    setEditingGroupId(group.id);
    setName(group.name);
    setColor(group.color);
    setDescription(group.description);
    setOrder(group.order);
  };

  // Handle update
  const handleUpdate = () => {
    if (!name.trim() || !editingGroupId) {
      alert('Please enter a group name');
      return;
    }

    dispatch(
      updateGroupRequest(editingGroupId, {
        name: name.trim(),
        color,
        description: description.trim(),
        order
      })
    );

    resetForm();
  };

  // Handle delete
  const handleDelete = (id: number, name: string) => {
    setGroupToDelete({ id, name });
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!groupToDelete) return;

    setIsDeleting(true);
    try {
      dispatch(deleteGroupRequest(groupToDelete.id));
      setShowDeleteDialog(false);
      setGroupToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setGroupToDelete(null);
  };

  // Reset form
  const resetForm = () => {
    setIsEditing(false);
    setEditingGroupId(null);
    setName('');
    setColor('#1976d2');
    setDescription('');
    setOrder(0);
  };

  // Handle close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: '#fff',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)'
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              Manage Guarantee Groups
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
              Create and organize your guarantee groups
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {isEditing ? 'Edit Group' : 'Create New Group'}
          </Typography>
          <Stack spacing={2}>
            {/* Name */}
            <TextField
              fullWidth
              label="Group Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Close Friends, Family, Work Colleagues"
              required
            />

            {/* Description */}
            <TextField
              fullWidth
              label="Description (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this group..."
              multiline
              rows={2}
            />

            {/* Color Picker */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Color
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {colors.map((colorOption) => (
                  <Box
                    key={colorOption}
                    onClick={() => setColor(colorOption)}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      backgroundColor: colorOption,
                      cursor: 'pointer',
                      border: color === colorOption ? '3px solid #000' : '1px solid #e0e0e0',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)'
                      }
                    }}
                  />
                ))}
                <TextField
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  sx={{ width: 40, height: 40 }}
                  inputProps={{
                    style: {
                      cursor: 'pointer',
                      padding: 0,
                      border: 'none'
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Preview */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Preview
              </Typography>
              <Chip
                label={name || 'Group Name'}
                sx={{
                  backgroundColor: `${color}20`,
                  borderColor: color,
                  color: color,
                  fontWeight: 500
                }}
                variant="outlined"
              />
            </Box>

            {/* Action Buttons */}
            <Stack direction="row" spacing={1}>
              {isEditing ? (
                <>
                  <Button variant="contained" onClick={handleUpdate} startIcon={<IconEdit size={20} />}>
                    Update Group
                  </Button>
                  <Button variant="outlined" onClick={resetForm}>
                    Cancel Edit
                  </Button>
                </>
              ) : (
                <Button variant="contained" onClick={handleCreate} startIcon={<AddIcon />}>
                  Create Group
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Groups List */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Existing Groups ({Array.isArray(groups) ? groups.length : 0})
          </Typography>
          {!Array.isArray(groups) || groups.length === 0 ? (
            <Alert severity="info">No groups created yet. Create your first group above.</Alert>
          ) : (
            <List>
              {groups.map((group) => (
                <ListItem
                  key={group.id}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: group.color,
                      mr: 2
                    }}
                  />
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1">{group.name}</Typography>
                        <Chip label={`${group.guaranteeCount} guarantees`} size="small" variant="outlined" />
                      </Box>
                    }
                    secondary={group.description || 'No description'}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" size="small" onClick={() => handleEdit(group)} sx={{ mr: 1 }}>
                      <IconEdit size={16} />
                    </IconButton>
                    <IconButton
                      edge="end"
                      size="small"
                      color="error"
                      onClick={() => handleDelete(group.id, group.name)}
                      disabled={group.guaranteeCount > 0}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)'
            }
          }}
        >
          Done
        </Button>
      </DialogActions>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteDialog}
        title="Delete Group"
        itemName={groupToDelete?.name || ''}
        itemType="group"
        warningMessage="This will delete the group. Guarantees in this group will be ungrouped but not deleted."
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Dialog>
  );
};

export default ManageGroupsDialog;
