import React from 'react';
import { Paper, Typography } from '@mui/material';

const ResultsTab: React.FC = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="body1" color="text.secondary">
        Election results will be displayed here when available.
      </Typography>
    </Paper>
  );
};

export default ResultsTab;

