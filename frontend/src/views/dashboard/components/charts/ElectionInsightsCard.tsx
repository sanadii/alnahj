/**
 * Election Insights Card
 * Inspired by Berry's EarningCard - Shows key insights with action menu
 */

import React, { useState } from 'react';
import { Box, Grid, Typography, Avatar, Menu, MenuItem, Chip, Stack, Paper, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  IconBulb,
  IconDotsVertical,
  IconDownload,
  IconFileExport,
  IconPrinter,
  IconShare,
  IconTrendingUp,
  IconAlertTriangle,
  IconCircleCheck
} from '@tabler/icons-react';

interface Insight {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
  value?: string;
}

interface ElectionInsightsCardProps {
  insights?: Insight[];
  onExport?: () => void;
  onPrint?: () => void;
  onShare?: () => void;
}

const defaultInsights: Insight[] = [
  {
    type: 'success',
    title: 'High Turnout Expected',
    description: 'Current attendance trends indicate 85%+ participation',
    value: '85%'
  },
  {
    type: 'warning',
    title: 'Action Required',
    description: '3 committees below target attendance',
    value: '3'
  },
  {
    type: 'info',
    title: 'On Track',
    description: 'All parties have sufficient candidates',
    value: '100%'
  }
];

export const ElectionInsightsCard: React.FC<ElectionInsightsCardProps> = ({ insights = defaultInsights, onExport, onPrint, onShare }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExport = () => {
    handleMenuClose();
    onExport?.();
  };

  const handlePrint = () => {
    handleMenuClose();
    onPrint?.();
  };

  const handleShare = () => {
    handleMenuClose();
    onShare?.();
  };

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'success':
        return <IconCircleCheck size={20} />;
      case 'warning':
        return <IconAlertTriangle size={20} />;
      case 'info':
        return <IconTrendingUp size={20} />;
      default:
        return <IconBulb size={20} />;
    }
  };

  const getInsightColor = (type: Insight['type']) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'primary';
    }
  };

  const primaryInsight = insights[0];

  return (
    <Paper
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        color: 'white',
        '&:after': {
          content: '""',
          position: 'absolute',
          width: 210,
          height: 210,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          top: -85,
          right: -95
        },
        '&:before': {
          content: '""',
          position: 'absolute',
          width: 210,
          height: 210,
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          top: -125,
          right: -15,
          opacity: 0.5
        }
      }}
    >
      <Box sx={{ p: 2.5, position: 'relative', zIndex: 1 }}>
        <Grid container direction="column" spacing={2}>
          {/* Header */}
          <Grid>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Avatar
                variant="rounded"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  width: 56,
                  height: 56
                }}
              >
                <IconBulb size={32} />
              </Avatar>

              <IconButton
                size="small"
                onClick={handleMenuClick}
                sx={{
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)'
                  }
                }}
              >
                <IconDotsVertical size={20} />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
              >
                <MenuItem onClick={handleExport}>
                  <IconFileExport size={18} style={{ marginRight: 8 }} />
                  Export Insights
                </MenuItem>
                <MenuItem onClick={handlePrint}>
                  <IconPrinter size={18} style={{ marginRight: 8 }} />
                  Print Report
                </MenuItem>
                <MenuItem onClick={handleShare}>
                  <IconShare size={18} style={{ marginRight: 8 }} />
                  Share Dashboard
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <IconDownload size={18} style={{ marginRight: 8 }} />
                  Download Data
                </MenuItem>
              </Menu>
            </Stack>
          </Grid>

          {/* Main Insight */}
          <Grid>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="baseline">
                <Typography variant="h2" fontWeight={700}>
                  {primaryInsight.value || 'N/A'}
                </Typography>
                {primaryInsight.type === 'success' && (
                  <Chip
                    label="↑ Trending Up"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                )}
              </Stack>

              <Typography variant="h6" fontWeight={600} sx={{ opacity: 0.9 }}>
                {primaryInsight.title}
              </Typography>

              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {primaryInsight.description}
              </Typography>
            </Stack>
          </Grid>

          {/* Additional Insights */}
          {insights.length > 1 && (
            <Grid>
              <Stack spacing={1.5} sx={{ mt: 1 }}>
                {insights.slice(1).map((insight, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: 'rgba(255, 255, 255, 0.2)'
                        }}
                      >
                        {getInsightIcon(insight.type)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={600}>
                          {insight.title}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          {insight.description}
                        </Typography>
                      </Box>
                      {insight.value && (
                        <Typography variant="h6" fontWeight={700}>
                          {insight.value}
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Grid>
          )}
        </Grid>
      </Box>
    </Paper>
  );
};

export default ElectionInsightsCard;
