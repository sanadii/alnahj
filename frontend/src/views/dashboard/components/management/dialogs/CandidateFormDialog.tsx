/**
 * Candidate Form Dialog
 * Add/Edit/View candidate dialog
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Box,
  Typography,
  Avatar
} from '@mui/material';
import { IconPhoto, IconUpload } from '@tabler/icons-react';

interface Party {
  id: number;
  name: string;
  color: string;
}

interface CandidateFormData {
  candidateNumber: string;
  name: string;
  party: string;
  image?: string | File | null;
  removeImage?: boolean;
}

interface CandidateFormDialogProps {
  open: boolean;
  mode: 'add' | 'edit' | 'view';
  formData: CandidateFormData;
  parties: Party[];
  onClose: () => void;
  onSave: () => void;
  onChange: (field: keyof CandidateFormData, value: string | File | null | boolean) => void;
}

const CandidateFormDialog: React.FC<CandidateFormDialogProps> = ({ open, mode, formData, parties, onClose, onSave, onChange }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (formData.image && typeof formData.image === 'string') {
      setImagePreview(formData.image);
    } else if (!formData.image) {
      setImagePreview(null);
    }
  }, [formData.image, open]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Pass file to parent
      onChange('image', file);
      onChange('removeImage', false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    onChange('image', null);
    onChange('removeImage', true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const hasImage = Boolean(imagePreview || (typeof formData.image === 'string' && formData.image));
  const isReadOnly = mode === 'view';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === 'add' ? 'Add New Candidate' : mode === 'edit' ? 'Edit Candidate' : 'Candidate Details'}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Candidate Photo Upload */}
          <Box>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>
              Candidate Photo
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                src={imagePreview || (typeof formData.image === 'string' ? formData.image : undefined)}
                sx={{
                  width: 100,
                  height: 100,
                  border: '3px solid',
                  borderColor: 'primary.main',
                  boxShadow: 2
                }}
              >
                <IconPhoto size={40} />
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <input
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="candidate-image-upload"
                  type="file"
                  onChange={handleImageUpload}
                  disabled={isReadOnly}
                />
                <label htmlFor="candidate-image-upload">
                  <Button component="span" variant="outlined" startIcon={<IconUpload size={18} />} disabled={isReadOnly} fullWidth>
                    {hasImage ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                </label>
                {!isReadOnly && hasImage && (
                  <Button color="error" onClick={handleRemoveImage} sx={{ mt: 1 }}>
                    Remove Photo
                  </Button>
                )}
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                  Recommended: Square image, min 300x300px (JPG, PNG)
                </Typography>
              </Box>
            </Box>
          </Box>

          <TextField
            label="Candidate Number"
            type="number"
            fullWidth
            placeholder="e.g., 1, 2, 3..."
            value={formData.candidateNumber}
            onChange={(e) => onChange('candidateNumber', e.target.value)}
            required
            disabled={mode === 'view'}
            helperText="Unique number for this candidate"
          />

          <TextField
            label="Candidate Name"
            fullWidth
            placeholder="Enter candidate's full name"
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
            required
            disabled={mode === 'view'}
            helperText="Full name of the candidate"
          />

          <TextField
            label="Party"
            select
            fullWidth
            value={formData.party}
            onChange={(e) => onChange('party', e.target.value)}
            disabled={mode === 'view'}
            helperText="Select a party or leave empty for independent"
          >
            <MenuItem value="">
              <em>Independent (No Party)</em>
            </MenuItem>
            {parties.map((party) => (
              <MenuItem key={party.id} value={party.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: 0.5,
                      backgroundColor: party.color,
                      border: '1px solid rgba(0,0,0,0.1)'
                    }}
                  />
                  <Typography>{party.name}</Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>

        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{mode === 'view' ? 'Close' : 'Cancel'}</Button>
        {mode !== 'view' && (
          <Button variant="contained" onClick={onSave}>
            {mode === 'edit' ? 'Save Changes' : 'Add Candidate'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CandidateFormDialog;
