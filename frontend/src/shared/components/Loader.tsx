import React from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';

interface LoaderProps {
  error?: string;
}

const Loader: React.FC<LoaderProps> = (props) => {
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', justifyContent: 'center', mx: 2, mt: 2 }}>
        <CircularProgress color="primary" />
      </Box>
      {props.error && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">{props.error}</Alert>
        </Box>
      )}
    </React.Fragment>
  );
};

export default Loader;
