/**
 * Party Form Dialog Component
 * Handles Create, Edit, and View modes for parties
 */

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Avatar
} from '@mui/material';
import { IconX, IconUpload } from '@tabler/icons-react';
import { createParty, updateParty, getParty } from 'helpers/api/voting';
import type { Party } from 'types/voting';

export interface PartyFormDialogProps {
  open: boolean;
  mode: 'add' | 'edit' | 'view';
  partyId?: number;
  electionId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const PartyFormDialog: React.FC<PartyFormDialogProps> = ({ open, mode, partyId, electionId, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    color: '#1976d2',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [removeLogo, setRemoveLogo] = useState(false);

  // Load party data for edit/view mode
  useEffect(() => {
    if (open && (mode === 'edit' || mode === 'view') && partyId) {
      loadParty();
    } else if (open && mode === 'add') {
      // Reset form for add mode
      setFormData({
        name: '',
        color: '#1976d2',
        description: ''
      });
      if (logoPreview && logoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(logoPreview);
      }
      setLogoFile(null);
      setLogoPreview(null);
      setRemoveLogo(false);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode, partyId]);

  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const loadParty = async () => {
    if (!partyId) return;

    setFetching(true);
    setError(null);

    try {
      const response = await getParty(partyId);

      if (response.success && response.data) {
        const party = response.data as Party;
        setFormData({
          name: party.name,
          color: party.color,
          description: party.description
        });
        setLogoFile(null);
        setLogoPreview(party.logo || null);
        setRemoveLogo(false);
      } else {
        console.error('❌ [PartyFormDialog] Response not successful or no data');
        setError('Failed to load party details');
      }
    } catch (err: any) {
      console.error('❌ [PartyFormDialog] Error loading party:', err);
      setError(err.response?.data?.message || 'Failed to load party');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (field: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
    setError(null);
  };

  const validate = (): boolean => {
    if (!formData.name.trim()) {
      setError('Party name is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setError(null);

    try {
      if (mode === 'add') {
        const payload = new FormData();
        payload.append('election', electionId.toString());
        payload.append('name', formData.name.trim());
        payload.append('color', formData.color);
        payload.append('description', formData.description.trim());
        if (logoFile) {
          payload.append('logo', logoFile);
        }

        const response = await createParty(payload);

        if (response.success && response.data) {
          // Dispatch Redux action to update store immediately
          dispatch({ type: 'elections/CREATE_PARTY_SUCCESS', payload: response.data });
          onSuccess();
          handleClose();
        } else {
          setError(response.message || 'Failed to create party');
        }
      } else if (mode === 'edit' && partyId) {
        const payload = new FormData();
        payload.append('name', formData.name.trim());
        payload.append('color', formData.color);
        payload.append('description', formData.description.trim());
        if (logoFile) {
          payload.append('logo', logoFile);
        }
        if (removeLogo && !logoFile) {
          payload.append('remove_logo', 'true');
        }

        const response = await updateParty(partyId, payload);

        if (response.success && response.data) {
          // Dispatch Redux action to update store immediately
          dispatch({ type: 'elections/UPDATE_PARTY_SUCCESS', payload: response.data });
          onSuccess();
          handleClose();
        } else {
          setError(response.message || 'Failed to update party');
        }
      }
    } catch (err: any) {
      console.error('Error saving party:', err);
      setError(err.response?.data?.message || 'Failed to save party');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (logoPreview && logoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(logoPreview);
    }
    setFormData({
      name: '',
      color: '#1976d2',
      description: ''
    });
    setLogoFile(null);
    setLogoPreview(null);
    setRemoveLogo(false);
    setError(null);
    onClose();
  };

  const handleLogoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (logoPreview && logoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(logoPreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setLogoFile(file);
    setLogoPreview(previewUrl);
    setRemoveLogo(false);
    setError(null);
  };

  const handleRemoveLogo = () => {
    if (logoPreview && logoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoFile(null);
    setLogoPreview(null);
    setRemoveLogo(true);
    setError(null);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getDialogTitle = () => {
    switch (mode) {
      case 'add':
        return 'Add New Party';
      case 'edit':
        return 'Edit Party';
      case 'view':
        return 'Party Details';
      default:
        return 'Party';
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" fontWeight={600}>
          {getDialogTitle()}
        </Typography>
        <Button onClick={handleClose} sx={{ minWidth: 'auto', p: 0.5 }} color="inherit">
          <IconX size={20} />
        </Button>
      </DialogTitle>

      <DialogContent>
        {fetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={3} sx={{ mt: 1 }}>
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {/* Party Image Upload */}
            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Party Image
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar
                  src={logoPreview || undefined}
                  variant="rounded"
                  sx={{
                    width: 100,
                    height: 100,
                    border: '3px solid',
                    borderColor: 'primary.main',
                    boxShadow: 2,
                    bgcolor: logoPreview ? 'transparent' : formData.color,
                    color: logoPreview ? 'inherit' : 'white',
                    fontWeight: 700,
                    fontSize: '1.5rem'
                  }}
                >
                  {!logoPreview && (formData.name ? formData.name.trim().slice(0, 3).toUpperCase() : 'PTY')}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleLogoSelect} disabled={isReadOnly} />
                  <Button
                    variant="outlined"
                    startIcon={<IconUpload size={18} />}
                    disabled={isReadOnly}
                    fullWidth
                    onClick={openFileDialog}
                  >
                    {logoPreview || logoFile ? 'Change Image' : 'Upload Image'}
                  </Button>
                  {!isReadOnly && (logoPreview || logoFile) && (
                    <Button color="error" onClick={handleRemoveLogo} disabled={loading} sx={{ mt: 1 }}>
                      Remove Image
                    </Button>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Recommended: Square image, min 300x300px (JPG, PNG)
                  </Typography>
                </Box>
              </Box>
            </Box>

            <TextField
              label="Party Name"
              value={formData.name}
              onChange={handleChange('name')}
              disabled={loading || isReadOnly}
              required
              fullWidth
              placeholder="e.g., Democratic Party"
              helperText={isReadOnly ? '' : 'Full official party name'}
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Party Color {!isReadOnly && '*'}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  type="color"
                  value={formData.color}
                  onChange={handleChange('color')}
                  disabled={loading || isReadOnly}
                  sx={{ width: 100 }}
                />
                <Box
                  sx={{
                    flex: 1,
                    height: 48,
                    borderRadius: 1,
                    backgroundColor: formData.color,
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                    {formData.name?.trim() || 'Party'}
                  </Typography>
                </Box>
              </Stack>
              {!isReadOnly && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  Color used for charts and visual identification
                </Typography>
              )}
            </Box>

            <TextField
              label="Description"
              value={formData.description}
              onChange={handleChange('description')}
              disabled={loading || isReadOnly}
              fullWidth
              multiline
              rows={3}
              placeholder="Optional description or platform summary"
              helperText={isReadOnly ? '' : 'Optional party description'}
            />
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          {isReadOnly ? 'Close' : 'Cancel'}
        </Button>
        {!isReadOnly && (
          <Button variant="contained" onClick={handleSubmit} disabled={loading || fetching}>
            {loading ? <CircularProgress size={24} /> : mode === 'add' ? 'Create Party' : 'Save Changes'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PartyFormDialog;
