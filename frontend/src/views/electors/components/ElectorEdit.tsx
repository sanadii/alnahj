/**
 * Elector Edit Page
 * Election Management System - Edit existing elector
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Divider,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert
} from '@mui/material';
import { PremiumCard } from 'shared/components';
import { IconEdit } from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { getElectorRequest, updateElectorRequest } from 'store/electors';
import { electorsSelector } from 'selectors/electorsSelector';
import { openSnackbar } from 'store/snackbar/actions';

const ElectorEdit: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { currentElector, loading, error } = useSelector(electorsSelector);

  const [formData, setFormData] = useState({
    kocId: '',
    nameFirst: '',
    nameSecond: '',
    nameThird: '',
    nameFourth: '',
    nameFifth: '',
    subFamilyName: '',
    familyName: '',
    gender: 'MALE',
    committee: '',
    mobile: '',
    area: '',
    team: '',
    section: '',
    designation: '',
    isActive: true,
    isWalkIn: false
  });

  const [errors, setErrors] = useState<any>({});

  // Load elector data on mount
  useEffect(() => {
    if (id) {
      dispatch(getElectorRequest(id));
    }
  }, [id, dispatch]);

  // Populate form when elector data is loaded
  useEffect(() => {
    if (currentElector) {
      setFormData({
        kocId: currentElector.kocId || '',
        nameFirst: currentElector.nameFirst || '',
        nameSecond: currentElector.nameSecond || '',
        nameThird: currentElector.nameThird || '',
        nameFourth: currentElector.nameFourth || '',
        nameFifth: currentElector.nameFifth || '',
        subFamilyName: currentElector.subFamilyName || '',
        familyName: currentElector.familyName || '',
        gender: currentElector.gender || 'MALE',
        committee: currentElector.committee?.toString() || '',
        mobile: currentElector.mobile || '',
        area: currentElector.area || '',
        team: currentElector.team || '',
        section: currentElector.section || '',
        designation: currentElector.designation || '',
        isActive: currentElector.isActive ?? true,
        isWalkIn: currentElector.isWalkIn ?? false
      });
    }
  }, [currentElector]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: any = {};

    if (!formData.kocId.trim()) {
      newErrors.kocId = 'KOC ID is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!id) return;

    // Prepare data for update
    const updateData = {
      kocId: formData.kocId,
      nameFirst: formData.nameFirst,
      nameSecond: formData.nameSecond,
      nameThird: formData.nameThird,
      nameFourth: formData.nameFourth,
      nameFifth: formData.nameFifth,
      subFamilyName: formData.subFamilyName,
      familyName: formData.familyName,
      gender: formData.gender as 'MALE' | 'FEMALE',
      committee: formData.committee ? Number(formData.committee) : undefined,
      mobile: formData.mobile,
      area: formData.area,
      team: formData.team,
      section: formData.section,
      designation: formData.designation,
      isActive: formData.isActive,
      isWalkIn: formData.isWalkIn
    };

    dispatch(updateElectorRequest(id, updateData));

    dispatch(
      openSnackbar({
        open: true,
        message: 'Elector updated successfully',
        variant: 'alert',
        alert: { color: 'success' },
        close: true
      })
    );

    setTimeout(() => {
      navigate('/electors/list');
    }, 500);
  };

  const handleCancel = () => {
    navigate('/electors/list');
  };

  if (loading && !currentElector) {
    return (
      <PremiumCard title="Edit Elector" icon={<IconEdit size={24} />} variant="elevated" color="primary">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400, p: 3 }}>
          <CircularProgress />
        </Box>
      </PremiumCard>
    );
  }

  if (error) {
    return (
      <PremiumCard title="Edit Elector" icon={<IconEdit size={24} />} variant="elevated" color="primary">
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="outlined" onClick={handleCancel}>
            Back to List
          </Button>
        </Box>
      </PremiumCard>
    );
  }

  return (
    <PremiumCard title="Edit Elector" icon={<IconEdit size={24} />} variant="elevated" color="primary">
      <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid size={12}>
            <Typography variant="h5" gutterBottom>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="KOC ID"
              name="kocId"
              value={formData.kocId}
              onChange={handleChange}
              error={!!errors.kocId}
              helperText={errors.kocId}
              required
              disabled
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth select label="Gender" name="gender" value={formData.gender} onChange={handleChange}>
              <MenuItem value="MALE">Male</MenuItem>
              <MenuItem value="FEMALE">Female</MenuItem>
            </TextField>
          </Grid>

          {/* Name Fields */}
          <Grid size={12}>
            <Typography variant="h5" gutterBottom>
              Name (7-part structure)
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField fullWidth label="First Name" name="nameFirst" value={formData.nameFirst} onChange={handleChange} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField fullWidth label="Second Name" name="nameSecond" value={formData.nameSecond} onChange={handleChange} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField fullWidth label="Third Name" name="nameThird" value={formData.nameThird} onChange={handleChange} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField fullWidth label="Fourth Name" name="nameFourth" value={formData.nameFourth} onChange={handleChange} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField fullWidth label="Fifth Name" name="nameFifth" value={formData.nameFifth} onChange={handleChange} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField fullWidth label="Sub-Family Name" name="subFamilyName" value={formData.subFamilyName} onChange={handleChange} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField fullWidth label="Family Name" name="familyName" value={formData.familyName} onChange={handleChange} />
          </Grid>

          {/* Contact & Work Information */}
          <Grid size={12}>
            <Typography variant="h5" gutterBottom>
              Contact & Work Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Mobile" name="mobile" value={formData.mobile} onChange={handleChange} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Designation" name="designation" value={formData.designation} onChange={handleChange} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Section" name="section" value={formData.section} onChange={handleChange} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Area" name="area" value={formData.area} onChange={handleChange} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Team" name="team" value={formData.team} onChange={handleChange} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Committee ID"
              name="committee"
              value={formData.committee}
              onChange={handleChange}
              helperText="Optional - leave blank if not assigned"
            />
          </Grid>

          {/* Status */}
          <Grid size={12}>
            <Typography variant="h5" gutterBottom>
              Status
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel control={<Switch checked={formData.isActive} onChange={handleChange} name="isActive" />} label="Active" />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel control={<Switch checked={formData.isWalkIn} onChange={handleChange} name="isWalkIn" />} label="Walk-in" />
          </Grid>

          {/* Actions */}
          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={handleCancel} size="large">
                Cancel
              </Button>
              <Button type="submit" variant="contained" size="large" disabled={loading}>
                {loading ? 'Updating...' : 'Update Elector'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </PremiumCard>
  );
};

export default ElectorEdit;
