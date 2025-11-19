import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';

// ==============================|| ANALYTICS ECOMMERCE CARD ||============================== //

interface AnalyticEcommerceProps {
  title: string;
  count: string;
  percentage?: number;
  isLoss?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  extra?: string;
  icon?: React.ReactNode;
}

const AnalyticEcommerce: React.FC<AnalyticEcommerceProps> = ({
  title,
  count,
  percentage,
  isLoss = false,
  color = 'primary',
  extra,
  icon
}) => {
  const theme = useTheme();

  const getColorFromTheme = (colorName: string) => {
    switch (colorName) {
      case 'primary':
        return theme.palette.primary.main;
      case 'secondary':
        return theme.palette.secondary.main;
      case 'success':
        return theme.palette.success.main;
      case 'error':
        return theme.palette.error.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'info':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const colorValue = getColorFromTheme(color);

  return (
    <Card
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" color="textSecondary" sx={{ fontSize: '0.875rem', mb: 1 }}>
              {title}
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
              {count}
            </Typography>

            {percentage !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: extra ? 0.5 : 0 }}>
                {isLoss ? (
                  <IconTrendingDown size={16} color={theme.palette.error.main} />
                ) : (
                  <IconTrendingUp size={16} color={theme.palette.success.main} />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    color: isLoss ? 'error.main' : 'success.main',
                    fontWeight: 500
                  }}
                >
                  {percentage > 0 ? '+' : ''}
                  {percentage}%
                </Typography>
              </Box>
            )}

            {extra && (
              <Typography variant="caption" color="textSecondary">
                {extra}
              </Typography>
            )}
          </Box>

          {icon && (
            <Box
              sx={{
                color: colorValue,
                bgcolor: `${colorValue}20`,
                borderRadius: 2,
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 56,
                minHeight: 56
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AnalyticEcommerce;
