/**
 * Committee Create Page
 * Election Management System - Create new committee
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Grid, TextField, MenuItem, Typography, Divider } from '@mui/material';
import { PremiumCard } from 'shared/components';
import { IconPlus } from '@tabler/icons-react';
import { createCommitteeRequest } from 'store/committees';
import { getElectionsRequest } from 'store/elections';
import { CommitteeGender } from 'types/elections';

const CommitteeCreate: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { elections } = useSelector((state: any) => state.elections);

  const [formData, setFormData] = useState({
    election: '',
    code: '',
    name: '',
    gender: CommitteeGender.MALE,
    location: ''
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    dispatch(getElectionsRequest({ status: '', page: 1, pageSize: 100 }));
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: any = {};

    if (!formData.election) {
      newErrors.election = 'Election is required';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Committee code is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Committee name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    dispatch(
      createCommitteeRequest({
        ...formData,
        election: parseInt(formData.election)
      })
    );
    navigate('/committees/list');
  };

  return (
    <PremiumCard title="Create New Committee" icon={<IconPlus size={24} />} variant="elevated" color="primary">
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid size={12}>
            <Typography variant="h5" gutterBottom>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              label="Election"
              name="election"
              value={formData.election}
              onChange={handleChange}
              required
              error={!!errors.election}
              helperText={errors.election || 'Select the election this committee belongs to'}
            >
              <MenuItem value="">Select Election</MenuItem>
              {elections.map((election: any) => (
                <MenuItem key={election.id} value={election.id}>
                  {election.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Committee Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              error={!!errors.code}
              helperText={errors.code || 'e.g., CAND-01, EK-II'}
              placeholder="e.g., CAND-01"
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="Committee Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              error={!!errors.name}
              helperText={errors.name}
              placeholder="e.g., Candidates Committee"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              helperText="Select the gender designation for this committee"
            >
              <MenuItem value={CommitteeGender.MALE}>Male</MenuItem>
              <MenuItem value={CommitteeGender.FEMALE}>Female</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Building A, Room 101"
              helperText="Physical location of the committee (optional)"
            />
          </Grid>

          {/* Actions */}
          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="outlined" onClick={() => navigate('/committees/list')}>
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Create Committee
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </PremiumCard>
  );
};

export default CommitteeCreate;
