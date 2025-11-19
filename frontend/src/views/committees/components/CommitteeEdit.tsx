/**
 * Committee Edit Page
 * Election Management System - Edit existing committee
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Grid, TextField, MenuItem, Typography, Divider, CircularProgress } from '@mui/material';
import { PremiumCard } from 'shared/components';
import { IconEdit } from '@tabler/icons-react';
import { getCommitteeRequest, updateCommitteeRequest } from 'store/committees';
import { getElectionsRequest } from 'store/elections';
import { CommitteeGender } from 'types/elections';

const CommitteeEdit: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  const { currentCommittee, loading } = useSelector((state: any) => state.committees);
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
    if (id) {
      dispatch(getCommitteeRequest(parseInt(id)));
      dispatch(getElectionsRequest({ status: '', page: 1, pageSize: 100 }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentCommittee) {
      setFormData({
        election: currentCommittee.election?.toString() || '',
        code: currentCommittee.code || '',
        name: currentCommittee.name || '',
        gender: currentCommittee.gender || CommitteeGender.MALE,
        location: currentCommittee.location || ''
      });
    }
  }, [currentCommittee]);

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

    if (id) {
      dispatch(
        updateCommitteeRequest(parseInt(id), {
          ...formData,
          election: parseInt(formData.election)
        })
      );
      navigate('/committees/list');
    }
  };

  if (loading) {
    return (
      <PremiumCard title="Edit Committee" icon={<IconEdit size={24} />} variant="elevated" color="primary">
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      </PremiumCard>
    );
  }

  return (
    <PremiumCard title="Edit Committee">
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
              disabled
              helperText="Election cannot be changed"
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
              helperText={errors.code}
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
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField select fullWidth label="Gender" name="gender" value={formData.gender} onChange={handleChange} required>
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
            />
          </Grid>

          {/* Actions */}
          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="outlined" onClick={() => navigate('/committees/list')}>
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Update Committee
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </PremiumCard>
  );
};

export default CommitteeEdit;
