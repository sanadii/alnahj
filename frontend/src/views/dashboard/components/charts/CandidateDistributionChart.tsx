/**
 * Candidate Distribution Chart
 * Donut chart showing candidate distribution across parties
 */

import React, { useMemo } from 'react';
import { Paper, Typography, Box, IconButton, Tooltip, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconDownload } from '@tabler/icons-react';
import Chart from 'react-apexcharts';
import { getPieChartOptions } from 'utils/charts/chartDefaults';
import { exportChartAsPNG } from 'utils/charts/exportChart';

interface CandidateDistributionChartProps {
  parties: Array<{
    name: string;
    candidateCount: number;
    color: string;
  }>;
  height?: number;
}

export const CandidateDistributionChart: React.FC<CandidateDistributionChartProps> = ({ parties, height = 350 }) => {
  const theme = useTheme();

  const totalCandidates = useMemo(() => parties.reduce((sum, p) => sum + p.candidateCount, 0), [parties]);

  const chartOptions = useMemo(
    () => ({
      ...getPieChartOptions(theme),
      labels: parties.map((p) => p.name),
      colors: parties.map((p) => p.color),
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '18px',
                fontWeight: 600,
                color: theme.palette.text.primary
              },
              value: {
                show: true,
                fontSize: '24px',
                fontWeight: 700,
                color: theme.palette.text.primary,
                formatter: (val: string) => val
              },
              total: {
                show: true,
                label: 'Total Candidates',
                fontSize: '14px',
                fontWeight: 600,
                color: theme.palette.text.secondary,
                formatter: () => totalCandidates.toString()
              }
            }
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
      }
    }),
    [parties, totalCandidates, theme]
  );

  const series = useMemo(() => parties.map((p) => p.candidateCount), [parties]);

  const handleExport = () => {
    exportChartAsPNG('candidate-distribution-chart', 'Candidate-Distribution');
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
            Candidate Distribution
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Percentage share of candidates by party
          </Typography>
        </Box>
        <Tooltip title="Export as PNG">
          <IconButton size="small" onClick={handleExport}>
            <IconDownload size={20} />
          </IconButton>
        </Tooltip>
      </Stack>
      <Box id="candidate-distribution-chart">
        <Chart options={chartOptions} series={series} type="donut" height={height} />
      </Box>
    </Paper>
  );
};

export default CandidateDistributionChart;
