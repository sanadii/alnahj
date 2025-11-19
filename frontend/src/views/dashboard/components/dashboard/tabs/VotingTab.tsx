import React from 'react';
import { Paper, Typography } from '@mui/material';

const VotingTab: React.FC = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="body1" color="text.secondary">
        Voting statistics will appear here once voting begins.
      </Typography>
    </Paper>
  );
};

export default VotingTab;

