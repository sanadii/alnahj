import React from 'react';
import { Button, ButtonProps, SxProps, Theme } from '@mui/material';
import { IconBaseProps } from '@tabler/icons-react';

export interface ActionButtonProps extends Omit<ButtonProps, 'children'> {
  icon: React.ReactElement<IconBaseProps>;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  size?: 'small' | 'medium' | 'large';
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, color = 'primary', size = 'small', sx, ...props }) => {
  const defaultSx: SxProps<Theme> = {
    minWidth: 'auto',
    color: 'common.white',
    borderRadius: 0,
    px: 1.5,
    py: 0.5
  };

  const mergedSx = typeof sx === 'function' ? sx : { ...defaultSx, ...sx };

  return (
    <Button variant="contained" color={color} size={size} sx={mergedSx} {...props}>
      {React.cloneElement(icon, { size: 16 })}
    </Button>
  );
};

export default ActionButton;
