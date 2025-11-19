/**
 * Metric Summary Card Component
 * Displays a single metric with percentage and details
 */

import React from 'react';
import { Paper, Typography } from '@mui/material';

export interface MetricSummaryCardProps {
  value: string | number;
  label: string;
  sublabel?: string;
  color?: 'primary' | 'success' | 'secondary' | 'error' | 'warning' | 'info';
}

export const MetricSummaryCard: React.FC<MetricSummaryCardProps> = ({ value, label, sublabel, color = 'primary' }) => {
  return (
    <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center', border: '1px solid', borderColor: `${color}.light` }}>
      <Typography variant="h2" fontWeight={700} color={`${color}.main`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </Typography>
      <Typography variant="body1" fontWeight={600} sx={{ mt: 1 }}>
        {label}
      </Typography>
      {sublabel && (
        <Typography variant="caption" color="text.secondary">
          {sublabel}
        </Typography>
      )}
    </Paper>
  );
};

export default MetricSummaryCard;
