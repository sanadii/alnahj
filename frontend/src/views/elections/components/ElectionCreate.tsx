/**
 * Election Create Page
 * Election Management System - Create new election
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Box, Button, Grid, TextField, MenuItem, FormControlLabel, Switch, Typography, Divider } from '@mui/material';
import { PremiumCard } from 'shared/components';
import { IconCalendarPlus } from '@tabler/icons-react';
import { createElectionRequest } from 'store/elections';
import { ElectionStatus, VotingMode, validateElectionDates } from 'types/elections';

const ElectionCreate: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    votingMode: VotingMode.BOTH,
    maxCandidatesPerBallot: 19,
    allowPartialVoting: true,
    minimumVotesRequired: 1,
    status: ElectionStatus.SETUP,
    electionDate: null
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Election name is required';
    }

    // Validate dates logic
    const dateValidation = validateElectionDates(formData);
    if (dateValidation) {
      newErrors.dates = dateValidation;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit
    dispatch(createElectionRequest(formData));
    navigate('/elections/list');
  };

  return (
    <PremiumCard title="Create New Election" icon={IconCalendarPlus} iconColor="primary">
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid size={12}>
            <Typography variant="h5" gutterBottom>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="Election Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              error={!!errors.name}
              helperText={errors.name}
              placeholder="e.g., 2025 Employee Council Election"
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              placeholder="Brief description of the election..."
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField select fullWidth label="Status" name="status" value={formData.status} onChange={handleChange} required>
              <MenuItem value={ElectionStatus.SETUP}>Setup</MenuItem>
              <MenuItem value={ElectionStatus.GUARANTEE_PHASE}>Guarantee Phase</MenuItem>
              <MenuItem value={ElectionStatus.VOTING_DAY}>Voting Day</MenuItem>
              <MenuItem value={ElectionStatus.COUNTING}>Counting</MenuItem>
              <MenuItem value={ElectionStatus.CLOSED}>Closed</MenuItem>
            </TextField>
          </Grid>

          {/* Voting Configuration */}
          <Grid size={12}>
            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
              Voting Configuration
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField select fullWidth label="Voting Mode" name="votingMode" value={formData.votingMode} onChange={handleChange} required>
              <MenuItem value={VotingMode.FULL_PARTY}>Full Party Ticket</MenuItem>
              <MenuItem value={VotingMode.MIXED}>Mixed Ticket</MenuItem>
              <MenuItem value={VotingMode.BOTH}>Both Options</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Max Candidates Per Ballot"
              name="maxCandidatesPerBallot"
              type="number"
              value={formData.maxCandidatesPerBallot}
              onChange={handleChange}
              required
              inputProps={{ min: 1, max: 50 }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Minimum Votes Required"
              name="minimumVotesRequired"
              type="number"
              value={formData.minimumVotesRequired}
              onChange={handleChange}
              required
              inputProps={{ min: 1 }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControlLabel
              control={<Switch checked={formData.allowPartialVoting} onChange={handleChange} name="allowPartialVoting" />}
              label="Allow Partial Voting"
            />
          </Grid>

          {/* Important Dates */}
          <Grid size={12}>
            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
              Important Dates
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {errors.dates && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {errors.dates}
              </Typography>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Election Date"
              name="electionDate"
              type="date"
              value={formData.electionDate}
              onChange={handleChange}
              required
              error={!!errors.electionDate}
              helperText={errors.electionDate}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Actions */}
          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="outlined" onClick={() => navigate('/elections/list')}>
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Create Election
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </PremiumCard>
  );
};

export default ElectionCreate;
