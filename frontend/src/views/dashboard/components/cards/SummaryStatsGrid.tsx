/**
 * Summary Stats Grid Component
 * Reusable 3-column statistics display grid
 */

import React from 'react';
import { Box, Typography } from '@mui/material';

export interface StatItem {
  value: string | number;
  label: string;
  sublabel?: string;
  color?: string;
}

export interface SummaryStatsGridProps {
  stats: [StatItem, StatItem, StatItem]; // Exactly 3 stats
}

export const SummaryStatsGrid: React.FC<SummaryStatsGridProps> = ({ stats }) => {
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        p: 2,
        borderRadius: 1.5,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 2
      }}
    >
      {stats.map((stat, index) => (
        <Box key={index} sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={700} color={stat.color || 'primary'}>
            {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {stat.label}
            {stat.sublabel && ` (${stat.sublabel})`}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default SummaryStatsGrid;
