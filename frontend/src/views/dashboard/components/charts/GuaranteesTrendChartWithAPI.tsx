/**
 * Guarantees Trend Chart with API Integration
 * Wrapper component that fetches data from API and displays GuaranteesTrendChart
 */

import React from 'react';
import { Paper, Typography, Box, CircularProgress, Alert, Button } from '@mui/material';
import GuaranteesTrendChart from './GuaranteesTrendChart';
import { useGuaranteesTrend } from 'hooks/dashboard/useDashboardData';

interface GuaranteesTrendChartWithAPIProps {
  electionId: number;
  height?: number;
}

export const GuaranteesTrendChartWithAPI: React.FC<GuaranteesTrendChartWithAPIProps> = ({ electionId, height }) => {
  const { data, loading, error, refetch } = useGuaranteesTrend(electionId, '30days');

  // Loading state
  if (loading) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading guarantees trend data...
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
            Failed to load guarantees trend
          </Typography>
          <Typography variant="caption">{error}</Typography>
        </Alert>
      </Paper>
    );
  }

  // No data state
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Alert severity="info">
          <Typography variant="body2">No guarantees trend data available yet.</Typography>
          <Typography variant="caption">Data will appear as guarantees are collected.</Typography>
        </Alert>
      </Paper>
    );
  }

  // Success - render the chart
  return <GuaranteesTrendChart data={data} height={height} />;
};

export default GuaranteesTrendChartWithAPI;
