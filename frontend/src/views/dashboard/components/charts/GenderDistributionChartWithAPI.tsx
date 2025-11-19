/**
 * Gender Distribution Chart with API Integration
 * Wrapper component that fetches data from API and displays GenderDistributionChart
 */

import React from 'react';
import { Paper, Typography, CircularProgress, Alert, Button } from '@mui/material';
import GenderDistributionChart from './GenderDistributionChart';
import { useElectorDemographics } from '../hooks/useElectorDemographics';

interface GenderDistributionChartWithAPIProps {
  electionId: number;
  height?: number;
}

export const GenderDistributionChartWithAPI: React.FC<GenderDistributionChartWithAPIProps> = ({ electionId, height }) => {
  const { data, loading, error, refetch } = useElectorDemographics(electionId);

  // Loading state
  if (loading) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading elector demographics...
        </Typography>
      </Paper>
    );
  }

  // Error state
  if (error) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'error.light' }}>
        <Alert
          severity="error"
          action={
            <Button size="small" onClick={refetch}>
              Retry
            </Button>
          }
        >
          <Typography variant="body2" fontWeight={600}>
            Failed to load elector demographics
          </Typography>
          <Typography variant="caption">{error}</Typography>
        </Alert>
      </Paper>
    );
  }

  // No data state
  if (!data) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Alert severity="info">
          <Typography variant="body2">No elector demographics available yet.</Typography>
          <Typography variant="caption">Import electors to see distribution.</Typography>
        </Alert>
      </Paper>
    );
  }

  // Success - render the chart
  const maleData = data.byGender.find((g: any) => g.gender === 'Male');
  const femaleData = data.byGender.find((g: any) => g.gender === 'Female');

  return <GenderDistributionChart maleCount={maleData?.count || 0} femaleCount={femaleData?.count || 0} height={height} />;
};

export default GenderDistributionChartWithAPI;
