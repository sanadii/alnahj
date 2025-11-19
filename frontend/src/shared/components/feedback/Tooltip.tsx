import React from 'react';
import { Tooltip as MuiTooltip, alpha, useTheme, SxProps, Theme, Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

export interface TooltipProps {
  title: string | ReactNode;
  children: ReactNode;
  placement?:
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top';
  arrow?: boolean;
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  disableHoverListener?: boolean;
  disableFocusListener?: boolean;
  disableTouchListener?: boolean;
  enterDelay?: number;
  leaveDelay?: number;
  enterNextDelay?: number;
  enterTouchDelay?: number;
  leaveTouchDelay?: number;
  followCursor?: boolean;
  variant?: 'default' | 'dark' | 'light' | 'colored';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  size?: 'small' | 'medium' | 'large';
  maxWidth?: number;
  className?: string;
  sx?: SxProps<Theme>;
}

const Tooltip: React.FC<TooltipProps> = ({
  title,
  children,
  placement = 'top',
  arrow = true,
  open,
  onOpen,
  onClose,
  disableHoverListener = false,
  disableFocusListener = false,
  disableTouchListener = false,
  enterDelay = 500,
  leaveDelay = 0,
  enterNextDelay = 0,
  enterTouchDelay = 700,
  leaveTouchDelay = 1500,
  followCursor = false,
  variant = 'default',
  color = 'primary',
  size = 'medium',
  maxWidth = 300,
  className,
  sx
}) => {
  const theme = useTheme();

  const getVariantStyles = (): SxProps<Theme> => {
    const baseStyles = {
      borderRadius: 2,
      boxShadow: theme.shadows[8],
      maxWidth,
      '& .MuiTooltip-arrow': {
        color: 'inherit'
      }
    };

    switch (variant) {
      case 'dark':
        return {
          ...baseStyles,
          backgroundColor: theme.palette.grey[900],
          color: theme.palette.common.white,
          '& .MuiTooltip-arrow': {
            color: theme.palette.grey[900]
          }
        };
      case 'light':
        return {
          ...baseStyles,
          backgroundColor: theme.palette.common.white,
          color: theme.palette.grey[900],
          border: `1px solid ${theme.palette.divider}`,
          '& .MuiTooltip-arrow': {
            color: theme.palette.common.white
          }
        };
      case 'colored':
        return {
          ...baseStyles,
          backgroundColor: theme.palette[color].main,
          color: theme.palette[color].contrastText,
          '& .MuiTooltip-arrow': {
            color: theme.palette[color].main
          }
        };
      case 'default':
      default:
        return {
          ...baseStyles,
          backgroundColor: alpha(theme.palette.grey[900], 0.9),
          color: theme.palette.common.white,
          '& .MuiTooltip-arrow': {
            color: alpha(theme.palette.grey[900], 0.9)
          }
        };
    }
  };

  const getSizeStyles = (): SxProps<Theme> => {
    switch (size) {
      case 'small':
        return {
          fontSize: '0.75rem',
          padding: theme.spacing(0.5, 1)
        };
      case 'large':
        return {
          fontSize: '1rem',
          padding: theme.spacing(1.5, 2)
        };
      case 'medium':
      default:
        return {
          fontSize: '0.875rem',
          padding: theme.spacing(1, 1.5)
        };
    }
  };

  const tooltipStyles: SxProps<Theme> = {
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...sx
  };

  const renderTitle = () => {
    if (typeof title === 'string') {
      return (
        <Typography
          variant="body2"
          component="div"
          sx={{
            fontWeight: 500,
            lineHeight: 1.4,
            wordBreak: 'break-word'
          }}
        >
          {title}
        </Typography>
      );
    }
    return title;
  };

  return (
    <MuiTooltip
      title={renderTitle()}
      placement={placement}
      arrow={arrow}
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      disableHoverListener={disableHoverListener}
      disableFocusListener={disableFocusListener}
      disableTouchListener={disableTouchListener}
      enterDelay={enterDelay}
      leaveDelay={leaveDelay}
      enterNextDelay={enterNextDelay}
      enterTouchDelay={enterTouchDelay}
      leaveTouchDelay={leaveTouchDelay}
      followCursor={followCursor}
      className={className}
      componentsProps={{
        tooltip: {
          sx: tooltipStyles
        }
      }}
    >
      <Box component="span" sx={{ display: 'inline-block' }}>
        {children}
      </Box>
    </MuiTooltip>
  );
};

export default Tooltip;
