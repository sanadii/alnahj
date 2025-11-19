/**
 * StartDemoButton Component
 * Button to trigger the demo control panel
 */

import React from 'react';
import { Button } from '@mui/material';
import { IconPlayerPlay } from '@tabler/icons-react';

interface StartDemoButtonProps {
  onClick: () => void;
}

const StartDemoButton: React.FC<StartDemoButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      startIcon={<IconPlayerPlay size={18} />}
    >
      Start Demo
    </Button>
  );
};

export default StartDemoButton;

