/**
 * Hourly Attendance Chart with API Integration
 * Wrapper component that fetches data from API and displays HourlyAttendanceChart
 */

import React from 'react';
import { Paper, Typography, CircularProgress, Alert, Button } from '@mui/material';
import HourlyAttendanceChart from './HourlyAttendanceChart';
import { useHourlyAttendance } from 'hooks/dashboard/useDashboardData';

interface HourlyAttendanceChartWithAPIProps {
  electionId: number;
  date?: string;
  height?: number;
}

export const HourlyAttendanceChartWithAPI: React.FC<HourlyAttendanceChartWithAPIProps> = ({ electionId, date, height }) => {
  const { data, loading, error, refetch } = useHourlyAttendance(electionId, date);

  // Loading state
  if (loading) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading hourly attendance data...
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
            Failed to load hourly attendance
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
          <Typography variant="body2">No hourly attendance data available yet.</Typography>
          <Typography variant="caption">Data will appear as voting begins.</Typography>
        </Alert>
      </Paper>
    );
  }

  // Transform API data to match chart expectations
  const transformedData = data.map((item, index) => {
    const cumulative = data.slice(0, index + 1).reduce((sum, d) => sum + (d.attendance || 0), 0);

    return {
      hour: item.hour,
      count: item.attendance || 0,
      cumulative: cumulative
    };
  });

  // Success - render the chart
  return <HourlyAttendanceChart data={transformedData} height={height} />;
};

export default HourlyAttendanceChartWithAPI;
