/**
 * Party Comparison Chart
 * Horizontal bar chart comparing candidates across parties
 */

import React, { useMemo } from 'react';
import { Paper, Typography, Box, Stack, Chip, IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconDownload } from '@tabler/icons-react';
import Chart from 'react-apexcharts';
import { getBarChartOptions } from 'utils/charts/chartDefaults';
import { exportChartAsPNG } from 'utils/charts/exportChart';

interface Party {
  id: number;
  name: string;
  candidateCount: number;
  color: string;
}

interface PartyComparisonChartProps {
  parties: Party[];
  totalCandidates: number;
  height?: number;
}

export const PartyComparisonChart: React.FC<PartyComparisonChartProps> = ({ parties, totalCandidates, height = 350 }) => {
  const theme = useTheme();

  const chartOptions = useMemo(
    () => ({
      ...getBarChartOptions(theme),
      colors: parties.map((p) => p.color),
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
          borderRadius: 8,
          dataLabels: {
            position: 'center'
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val}`,
        style: {
          fontSize: '14px',
          fontWeight: 700,
          colors: ['#fff']
        }
      },
      xaxis: {
        categories: parties.map((p) => p.name),
        title: {
          text: 'Number of Candidates',
          style: {
            fontSize: '14px',
            fontWeight: 600,
            color: theme.palette.text.primary
          }
        },
        labels: {
          style: {
            colors: theme.palette.text.secondary
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: theme.palette.text.primary,
            fontSize: '14px',
            fontWeight: 600
          }
        }
      },
      tooltip: {
        theme: theme.palette.mode,
        y: {
          formatter: (val: number) => {
            const percentage = totalCandidates > 0 ? ((val / totalCandidates) * 100).toFixed(1) : '0';
            return `${val} candidates (${percentage}%)`;
          }
        }
      },
      legend: {
        show: false
      }
    }),
    [parties, totalCandidates, theme]
  );

  const series = useMemo(
    () => [
      {
        name: 'Candidates',
        data: parties.map((p) => p.candidateCount)
      }
    ],
    [parties]
  );

  const handleExport = () => {
    exportChartAsPNG('party-comparison-chart', 'Party-Comparison');
  };

  if (parties.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          No parties data available
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Party Comparison
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Candidate distribution across political parties
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label={`${parties.length} Parties`} size="small" color="primary" />
          <Tooltip title="Export as PNG">
            <IconButton size="small" onClick={handleExport}>
              <IconDownload size={20} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      <Box id="party-comparison-chart" sx={{ mt: 2 }}>
        <Chart options={chartOptions} series={series} type="bar" height={height} />
      </Box>
    </Paper>
  );
};

export default PartyComparisonChart;
