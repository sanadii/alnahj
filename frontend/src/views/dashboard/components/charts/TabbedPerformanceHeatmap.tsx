/**
 * Tabbed Performance Heatmap
 * Visual overview with tabs for Teams and Areas
 */

import React, { useState, useMemo } from 'react';
import { Paper, Typography, Box, IconButton, Tooltip, Stack, Chip, Tabs, Tab } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconDownload, IconUsers, IconMap } from '@tabler/icons-react';
import Chart from 'react-apexcharts';
import { getHeatmapOptions } from 'utils/charts/chartDefaults';
import { exportChartAsPNG } from 'utils/charts/exportChart';

interface HeatmapItem {
  code: string;
  name: string;
  percentage: number;
  metadata?: string;
}

interface TabbedPerformanceHeatmapProps {
  teams: HeatmapItem[];
  areas: HeatmapItem[];
  height?: number;
  metricLabel?: string; // e.g., "Attendance", "Performance", "Completion"
}

export const TabbedPerformanceHeatmap: React.FC<TabbedPerformanceHeatmapProps> = ({
  teams,
  areas,
  height = 300,
  metricLabel = 'Performance'
}) => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Get current data based on tab
  const currentData = currentTab === 0 ? teams : areas;
  const currentLabel = currentTab === 0 ? 'Teams' : 'Areas';

  // Organize items into rows (5 per row for good visualization)
  const rows = useMemo(() => {
    const COLS = 5;
    const result: (typeof currentData)[][] = [];

    for (let i = 0; i < currentData.length; i += COLS) {
      result.push(currentData.slice(i, i + COLS));
    }

    return result;
  }, [currentData]);

  const chartOptions = useMemo(
    () => ({
      ...getHeatmapOptions(theme),
      xaxis: {
        labels: {
          show: true,
          style: {
            colors: theme.palette.text.secondary,
            fontSize: '12px',
            fontWeight: 600
          }
        }
      },
      yaxis: {
        labels: {
          show: false
        }
      },
      tooltip: {
        theme: theme.palette.mode,
        custom: ({ seriesIndex, dataPointIndex }: any) => {
          const item = rows[seriesIndex]?.[dataPointIndex];
          if (!item) return '';

          return `
            <div style="padding: 12px; background: ${theme.palette.background.paper}; border-radius: 8px; border: 1px solid ${theme.palette.divider};">
              <div style="font-weight: 700; margin-bottom: 4px; color: ${theme.palette.text.primary};">
                ${item.code} - ${item.name}
              </div>
              <div style="color: ${theme.palette.text.secondary};">
                ${metricLabel}: <strong style="color: ${theme.palette.text.primary};">${item.percentage.toFixed(1)}%</strong>
              </div>
              ${
                item.metadata
                  ? `
                <div style="color: ${theme.palette.text.secondary}; font-size: 11px; margin-top: 4px;">
                  ${item.metadata}
                </div>
              `
                  : ''
              }
            </div>
          `;
        }
      }
    }),
    [rows, theme, metricLabel]
  );

  const series = useMemo(
    () =>
      rows.map((row, rowIndex) => ({
        name: `Row ${rowIndex + 1}`,
        data: row.map((item) => ({
          x: item.code,
          y: Math.round(item.percentage)
        }))
      })),
    [rows]
  );

  const handleExport = () => {
    const filename = `${currentLabel}-${metricLabel}-Heatmap`;
    exportChartAsPNG('performance-heatmap-chart', filename);
  };

  // Calculate summary stats
  const avgPerformance = useMemo(() => {
    if (currentData.length === 0) return '0';
    const avg = currentData.reduce((sum, item) => sum + item.percentage, 0) / currentData.length;
    return avg.toFixed(1);
  }, [currentData]);

  const lowPerformers = currentData.filter((item) => item.percentage < 50).length;
  const highPerformers = currentData.filter((item) => item.percentage >= 80).length;

  if (teams.length === 0 && areas.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          No teams or areas data available
        </Typography>
      </Paper>
    );
  }

  if (currentData.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Teams" icon={<IconUsers size={18} />} iconPosition="start" disabled={teams.length === 0} />
          <Tab label="Areas" icon={<IconMap size={18} />} iconPosition="start" disabled={areas.length === 0} />
        </Tabs>
        <Typography variant="body2" color="text.secondary" align="center">
          No {currentLabel.toLowerCase()} data available
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      {/* Tabs */}
      <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Tab label={`Teams (${teams.length})`} icon={<IconUsers size={18} />} iconPosition="start" disabled={teams.length === 0} />
        <Tab label={`Areas (${areas.length})`} icon={<IconMap size={18} />} iconPosition="start" disabled={areas.length === 0} />
      </Tabs>

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            {currentLabel} {metricLabel} Heatmap
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visual overview of {metricLabel.toLowerCase()} rates - darker green is better
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label={`Avg: ${avgPerformance}%`} size="small" color="primary" />
          <Chip label={`${highPerformers} High`} size="small" sx={{ bgcolor: 'success.main', color: 'white' }} />
          <Chip label={`${lowPerformers} Low`} size="small" sx={{ bgcolor: 'error.main', color: 'white' }} />
          <Tooltip title="Export as PNG">
            <IconButton size="small" onClick={handleExport}>
              <IconDownload size={20} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Heatmap Chart */}
      <Box id="performance-heatmap-chart">
        <Chart options={chartOptions} series={series} type="heatmap" height={height} />
      </Box>
    </Paper>
  );
};

export default TabbedPerformanceHeatmap;
