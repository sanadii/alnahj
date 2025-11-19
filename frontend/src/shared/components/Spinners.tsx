import React, { useEffect } from 'react';
import { CircularProgress, Box } from '@mui/material';

/**
 * Loading spinner component
 * Shows a centered spinner and auto-hides after 1 second
 */
const Spinners = ({ setLoading }: { setLoading?: (loading: boolean) => void }) => {
  useEffect(() => {
    if (setLoading) {
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [setLoading]);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
};

export default Spinners;
