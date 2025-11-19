import React from 'react';
import { Stack, Button, Divider, alpha, useTheme, SxProps, Theme, Box, Tooltip } from '@mui/material';
import { ReactNode } from 'react';

export interface ActionButton {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  variant?: 'text' | 'outlined' | 'contained';
  disabled?: boolean;
  tooltip?: string;
  loading?: boolean;
}

export interface ActionButtonGroupProps {
  actions: ActionButton[];
  orientation?: 'horizontal' | 'vertical';
  spacing?: number;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'grouped' | 'separated';
  maxVisible?: number;
  showMoreLabel?: string;
  onShowMore?: () => void;
  className?: string;
  sx?: SxProps<Theme>;
}

const ActionButtonGroup: React.FC<ActionButtonGroupProps> = ({
  actions,
  orientation = 'horizontal',
  spacing = 1,
  size = 'medium',
  variant = 'default',
  maxVisible,
  showMoreLabel = 'More',
  onShowMore,
  className,
  sx
}) => {
  const theme = useTheme();

  const visibleActions = maxVisible ? actions.slice(0, maxVisible) : actions;
  const hiddenActions = maxVisible ? actions.slice(maxVisible) : [];

  const getVariantStyles = (): SxProps<Theme> => {
    switch (variant) {
      case 'grouped':
        return {
          '& .MuiButton-root': {
            borderRadius: 0,
            '&:first-of-type': {
              borderTopLeftRadius: theme.shape.borderRadius,
              borderBottomLeftRadius: theme.shape.borderRadius
            },
            '&:last-of-type': {
              borderTopRightRadius: theme.shape.borderRadius,
              borderBottomRightRadius: theme.shape.borderRadius
            },
            '&:not(:last-of-type)': {
              borderRight: 'none'
            }
          }
        };
      case 'separated':
        return {
          '& .MuiButton-root': {
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[1],
            '&:hover': {
              boxShadow: theme.shadows[2]
            }
          }
        };
      case 'default':
      default:
        return {
          '& .MuiButton-root': {
            borderRadius: theme.shape.borderRadius
          }
        };
    }
  };

  const renderButton = (action: ActionButton, index: number) => {
    const button = (
      <Button
        key={index}
        variant={action.variant || 'outlined'}
        color={action.color || 'primary'}
        size={size}
        startIcon={action.icon}
        onClick={action.onClick}
        disabled={action.disabled || action.loading}
        sx={{
          minWidth: 'auto',
          px: 2,
          py: 1,
          fontWeight: 600,
          textTransform: 'none',
          transition: theme.transitions.create(['all'], {
            duration: theme.transitions.duration.short
          }),
          ...(action.loading && {
            opacity: 0.7,
            cursor: 'not-allowed'
          })
        }}
      >
        {action.loading ? 'Loading...' : action.label}
      </Button>
    );

    if (action.tooltip) {
      return (
        <Tooltip key={index} title={action.tooltip} arrow>
          {button}
        </Tooltip>
      );
    }

    return button;
  };

  return (
    <Box className={className} sx={{ ...getVariantStyles(), ...sx }}>
      <Stack
        direction={orientation}
        spacing={variant === 'separated' ? spacing : 0}
        divider={
          variant === 'separated' ? <Divider orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'} flexItem /> : undefined
        }
      >
        {visibleActions.map((action, index) => renderButton(action, index))}

        {hiddenActions.length > 0 && onShowMore && (
          <>
            {variant === 'separated' && <Divider orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'} flexItem />}
            <Button
              variant="text"
              color="primary"
              size={size}
              onClick={onShowMore}
              sx={{
                minWidth: 'auto',
                px: 2,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  color: theme.palette.primary.main
                }
              }}
            >
              {showMoreLabel} ({hiddenActions.length})
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default ActionButtonGroup;
