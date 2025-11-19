import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  Divider,
  FormControlLabel,
  Switch,
  Stack,
  Box,
  Alert,
  LinearProgress,
  Grid
} from '@mui/material';
import { IconUserPlus } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from 'store';

import { createElectorRequest } from 'store/electors';
import { electorsSelector } from 'selectors/electorsSelector';

interface ElectorCreateDialogProps {
  open: boolean;
  onClose: (refresh?: boolean) => void;
}

const initialFormState = {
  kocId: '',
  fullName: '',
  subFamilyName: '',
  familyName: '',
  gender: 'MALE',
  mobile: '',
  area: '',
  team: '',
  isActive: true
};

const ElectorCreateDialog: React.FC<ElectorCreateDialogProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(electorsSelector);

  const [formData, setFormData] = useState(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) {
      setFormData(initialFormState);
      setFieldErrors({});
      setFormError(null);
      setSubmitted(false);
    }
  }, [open]);

  useEffect(() => {
    if (!submitted) return;
    if (loading) return;

    if (error) {
      setFormError(error);
      setSubmitted(false);
    } else {
      handleClose(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, error, submitted]);

  const handleClose = (refresh?: boolean) => {
    setSubmitted(false);
    setFormError(null);
    setFieldErrors({});
    setFormData(initialFormState);
    onClose(refresh);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.kocId.trim()) {
      errors.kocId = 'KOC ID is required';
    }
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    if (!formData.familyName.trim()) {
      errors.familyName = 'Family name is required';
    }
    if (formData.mobile && !/^\d{8}$/.test(formData.mobile.trim())) {
      errors.mobile = 'Mobile must be exactly 8 digits';
    }
    return errors;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFormError(null);
    setFieldErrors({});
    setSubmitted(true);

    const payload = {
      kocId: formData.kocId.trim(),
      fullName: formData.fullName.trim(),
      subFamilyName: formData.subFamilyName || undefined,
      familyName: formData.familyName.trim(),
      gender: formData.gender as 'MALE' | 'FEMALE',
      mobile: formData.mobile ? formData.mobile.trim() : undefined,
      area: formData.area || undefined,
      team: formData.team || undefined,
      isActive: formData.isActive
    };

    dispatch(createElectorRequest(payload));
  };

  return (
    <Dialog open={open} onClose={() => handleClose(false)} maxWidth="md" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        {loading && submitted && <LinearProgress />}
        <DialogTitle>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconUserPlus size={28} />
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Add New Elector
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Provide the basic information to create a new elector
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>
            {formError && (
              <Alert severity="error" onClose={() => setFormError(null)}>
                {formError}
              </Alert>
            )}

            <Box>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Identification
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="KOC ID"
                    name="kocId"
                    value={formData.kocId}
                    onChange={handleChange}
                    required
                    error={!!fieldErrors.kocId}
                    helperText={fieldErrors.kocId || 'Unique identifier'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField select fullWidth label="Gender" name="gender" value={formData.gender} onChange={handleChange} required>
                    <MenuItem value="MALE">Male</MenuItem>
                    <MenuItem value="FEMALE">Female</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Name Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    error={!!fieldErrors.fullName}
                    helperText={fieldErrors.fullName || 'Enter the elector\'s complete name'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Sub-Family Name"
                    name="subFamilyName"
                    value={formData.subFamilyName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Family Name"
                    name="familyName"
                    value={formData.familyName}
                    onChange={handleChange}
                    required
                    error={!!fieldErrors.familyName}
                    helperText={fieldErrors.familyName}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Contact Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="XXXXXXXX"
                    inputProps={{ maxLength: 8, inputMode: 'numeric', pattern: '\\d*' }}
                    error={!!fieldErrors.mobile}
                    helperText={fieldErrors.mobile || 'Enter 8-digit mobile number'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Area" name="area" value={formData.area} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Team" name="team" value={formData.team} onChange={handleChange} />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Status
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack direction="row" spacing={3}>
                <FormControlLabel
                  control={<Switch checked={formData.isActive} onChange={handleSwitchChange} name="isActive" />}
                  label="Active"
                />
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => handleClose(false)} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading && submitted}>
            Add Elector
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ElectorCreateDialog;

