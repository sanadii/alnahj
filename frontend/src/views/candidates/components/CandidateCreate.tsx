/**
 * Candidate Create Page
 * Election Management System - Create new candidate
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Grid, TextField, MenuItem, Typography, Divider, FormControlLabel, Switch } from '@mui/material';
import { PremiumCard } from 'shared/components';
import { IconUserPlus } from '@tabler/icons-react';

const CandidateCreate: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    election: '',
    candidateNumber: '',
    elector: '',
    party: '',
    isActive: true
  });

  const [errors, setErrors] = useState<any>({});

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

    if (!formData.election) {
      newErrors.election = 'Election is required';
    }

    if (!formData.candidateNumber) {
      newErrors.candidateNumber = 'Candidate number is required';
    }

    if (!formData.elector) {
      newErrors.elector = 'Elector is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    navigate('/candidates/list');
  };

  return (
    <PremiumCard title="Add New Candidate" icon={<IconUserPlus size={24} />} variant="elevated" color="primary">
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <Typography variant="h5" gutterBottom>
              Candidate Information
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
              helperText={errors.election}
            >
              <MenuItem value="">Select Election</MenuItem>
              <MenuItem value="1">2025 Election</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Candidate Number"
              name="candidateNumber"
              type="number"
              value={formData.candidateNumber}
              onChange={handleChange}
              required
              error={!!errors.candidateNumber}
              helperText={errors.candidateNumber}
              placeholder="e.g., 1"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Elector (KOC ID)"
              name="elector"
              value={formData.elector}
              onChange={handleChange}
              required
              error={!!errors.elector}
              helperText={errors.elector || 'Enter the elector KOC ID'}
              placeholder="e.g., PA0001"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField select fullWidth label="Party" name="party" value={formData.party} onChange={handleChange}>
              <MenuItem value="">No Party</MenuItem>
              <MenuItem value="1">Progressive Alliance</MenuItem>
              <MenuItem value="2">Conservative Party</MenuItem>
            </TextField>
          </Grid>

          <Grid size={12}>
            <FormControlLabel
              control={<Switch checked={formData.isActive} onChange={handleChange} name="isActive" />}
              label="Active Candidate"
            />
          </Grid>

          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="outlined" onClick={() => navigate('/candidates/list')}>
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Add Candidate
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </PremiumCard>
  );
};

export default CandidateCreate;
