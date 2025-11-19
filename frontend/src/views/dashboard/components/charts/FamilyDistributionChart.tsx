/**
 * Elector Distribution Chart
 * Allows dynamic axis selection for grouped column visualisations.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Button,
  Divider
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import { IconDownload, IconRefresh } from '@tabler/icons-react';
import Chart from 'react-apexcharts';

import { getBarChartOptions } from 'utils/charts/chartDefaults';
import { exportChartAsPNG } from 'utils/charts/exportChart';
import { getElectorDistribution } from 'helpers/api/dashboard';

type DistributionDimension = 'family' | 'gender' | 'department' | 'team';

interface DistributionCategory {
  key: string;
  label: string;
  total: number;
}

interface DistributionSeries {
  key: string;
  label: string;
  data: number[];
  total: number;
}

interface DistributionResponse {
  primary: DistributionDimension;
  secondary: DistributionDimension | null;
  categories: DistributionCategory[];
  secondary_categories: DistributionCategory[];
  series: DistributionSeries[];
  totals: {
    total_electors: number;
    primary_count: number;
    secondary_count: number;
  };
  meta: {
    limit: number;
    election_id: number;
    primary_label: string;
    secondary_label?: string | null;
  };
}

interface FamilyDistributionChartProps {
  electionId: number;
  height?: number;
  defaultPrimary?: DistributionDimension;
  defaultSecondary?: DistributionDimension | 'none';
  limit?: number;
}

const AXIS_OPTIONS: Array<{ value: DistributionDimension; label: string }> = [
  { value: 'family', label: 'Families' },
  { value: 'gender', label: 'Gender' },
  { value: 'department', label: 'Departments' },
  { value: 'team', label: 'Teams' }
];

const SECONDARY_NONE_VALUE = 'none';

export const FamilyDistributionChart: React.FC<FamilyDistributionChartProps> = ({
  electionId,
  height = 460,
  defaultPrimary = 'family',
  defaultSecondary = 'gender',
  limit
}) => {
  const theme = useTheme();

  const [primaryAxis, setPrimaryAxis] = useState<DistributionDimension>(defaultPrimary);
  const [secondaryAxis, setSecondaryAxis] = useState<DistributionDimension | 'none'>(defaultSecondary);
  const [distribution, setDistribution] = useState<DistributionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const availableSecondaryOptions = useMemo(() => {
    return [SECONDARY_NONE_VALUE, ...AXIS_OPTIONS.filter((option) => option.value !== primaryAxis).map((option) => option.value)];
  }, [primaryAxis]);

  const fetchDistribution = useCallback(async () => {
    if (!electionId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getElectorDistribution(
        electionId,
        primaryAxis,
        secondaryAxis === SECONDARY_NONE_VALUE ? undefined : secondaryAxis,
        limit
      );

      if (response.data?.status !== 'success') {
        throw new Error(response.data?.message || 'Failed to load distribution data');
      }

      setDistribution(response.data.data as DistributionResponse);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Unable to load distribution data. Please try again later.';
      setError(message);
      setDistribution(null);
    } finally {
      setLoading(false);
    }
  }, [electionId, primaryAxis, secondaryAxis, limit]);

  useEffect(() => {
    if (!availableSecondaryOptions.includes(secondaryAxis)) {
      const fallback = availableSecondaryOptions.find((option) => option !== SECONDARY_NONE_VALUE) ?? SECONDARY_NONE_VALUE;
      setSecondaryAxis(fallback as DistributionDimension | 'none');
    }
  }, [availableSecondaryOptions, secondaryAxis]);

  useEffect(() => {
    fetchDistribution();
  }, [fetchDistribution]);

  const handlePrimaryChange = (event: SelectChangeEvent<DistributionDimension>) => {
    const nextPrimary = event.target.value as DistributionDimension;
    setPrimaryAxis(nextPrimary);
    if (secondaryAxis !== SECONDARY_NONE_VALUE && nextPrimary === secondaryAxis) {
      const fallbackOption = AXIS_OPTIONS.find((option) => option.value !== nextPrimary)?.value ?? SECONDARY_NONE_VALUE;
      setSecondaryAxis(fallbackOption as DistributionDimension | 'none');
    }
  };

  const handleSecondaryChange = (event: SelectChangeEvent<string>) => {
    setSecondaryAxis(event.target.value as DistributionDimension | 'none');
  };

  const handleExport = () => {
    exportChartAsPNG('elector-distribution-chart', 'Elector-Distribution');
  };

  const categories = distribution?.categories ?? [];
  const series = distribution?.series ?? [];

  const seriesColors = useMemo(() => {
    if (secondaryAxis === SECONDARY_NONE_VALUE || !series.length) {
      return [theme.palette.primary.main];
    }

    if (secondaryAxis === 'gender') {
      const maleColor = theme.palette.info.main;
      const femaleColor = theme.palette.secondary.main;
      return series.map((serie) => {
        if (serie.label.toLowerCase().includes('female')) {
          return femaleColor;
        }
        if (serie.label.toLowerCase().includes('male')) {
          return maleColor;
        }
        return theme.palette.primary.main;
      });
    }

    const palette = [
      theme.palette.primary.main,
      theme.palette.info.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
      theme.palette.grey[500]
    ];

    return Array.from({ length: series.length }, (_, index) => palette[index % palette.length]);
  }, [series, theme.palette, secondaryAxis]);

  const chartOptions = useMemo(() => {
    const singleSeries = secondaryAxis === SECONDARY_NONE_VALUE || !series.length;
    const options = getBarChartOptions(theme);
    return {
      ...options,
      chart: {
        ...options.chart,
        type: 'bar',
        stacked: singleSeries,
        background: 'transparent',
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth:
            !singleSeries && series.length > 4
              ? '28%'
              : '45%',
          borderRadius: 6
        }
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      colors: seriesColors,
      xaxis: {
        categories: categories.map((category) => category.label),
        axisBorder: { color: theme.palette.divider },
        axisTicks: { color: theme.palette.divider },
        labels: {
          rotate: categories.length > 8 ? -35 : 0,
          style: {
            colors: theme.palette.text.secondary,
            fontSize: '12px',
            fontWeight: 600
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: theme.palette.text.secondary,
            fontSize: '12px'
          }
        },
        title: {
          text: 'Electors',
          style: {
            color: theme.palette.text.secondary,
            fontWeight: 600
          }
        }
      },
      legend: singleSeries
        ? {
            show: false
          }
        : {
            position: 'top' as const,
            horizontalAlign: 'right' as const,
            labels: {
              colors: theme.palette.text.primary
            }
          },
      dataLabels: {
        enabled: false
      },
      tooltip: {
        theme: theme.palette.mode,
        y: {
          formatter: (val: number) => `${val.toLocaleString()} electors`
        }
      },
      grid: {
        borderColor: theme.palette.divider
      }
    };
  }, [categories, series.length, seriesColors, theme]);

  const apexSeries = useMemo(
    () =>
      (secondaryAxis !== SECONDARY_NONE_VALUE && series.length)
        ? series.map((serie) => ({
            name: serie.label,
            data: serie.data
          }))
        : [
            {
              name: 'Electors',
              data: categories.map((category) => category.total)
            }
          ],
    [series, categories, secondaryAxis]
  );

  const handleRetry = () => {
    fetchDistribution();
  };

  const primaryLabel = useMemo(
    () => AXIS_OPTIONS.find((option) => option.value === primaryAxis)?.label ?? 'Primary',
    [primaryAxis]
  );

  const secondaryLabel = useMemo(() => {
    if (secondaryAxis === SECONDARY_NONE_VALUE) {
      return 'None';
    }
    return AXIS_OPTIONS.find((option) => option.value === secondaryAxis)?.label ?? 'None';
  }, [secondaryAxis]);

  const totalElectors = distribution?.totals?.total_electors ?? 0;

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Elector Distribution
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visualise elector totals by dynamic dimensions.
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="primary-axis-label">Primary Axis</InputLabel>
            <Select
              labelId="primary-axis-label"
              value={primaryAxis}
              label="Primary Axis"
              onChange={handlePrimaryChange}
            >
              {AXIS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="secondary-axis-label">Series</InputLabel>
            <Select
              labelId="secondary-axis-label"
              value={availableSecondaryOptions.includes(secondaryAxis) ? secondaryAxis : SECONDARY_NONE_VALUE}
              label="Series"
              onChange={handleSecondaryChange}
            >
              <MenuItem value={SECONDARY_NONE_VALUE}>None</MenuItem>
              {AXIS_OPTIONS.filter((option) => option.value !== primaryAxis).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
            <Chip label={`${categories.length} ${primaryLabel}`} size="small" color="primary" />
            {secondaryAxis !== SECONDARY_NONE_VALUE && (
              <Chip
                label={`${distribution?.secondary_categories?.length ?? 0} ${secondaryLabel}`}
                size="small"
                variant="outlined"
              />
            )}
            <Chip label={`${totalElectors.toLocaleString()} Electors`} size="small" variant="outlined" />
            <Tooltip title="Export as PNG">
              <span>
                <IconButton size="small" onClick={handleExport} disabled={!series.length || loading}>
                  <IconDownload size={18} />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Stack>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: height - 80 }}>
          <CircularProgress size={32} />
        </Box>
      ) : error ? (
        <Box sx={{ py: 4 }}>
          <Alert
            severity="error"
            action={
              <Button size="small" startIcon={<IconRefresh size={16} />} onClick={handleRetry}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Box>
      ) : !series.length || !categories.length ? (
        <Box sx={{ py: 4 }}>
          <Alert severity="info">No data available for the selected dimensions.</Alert>
        </Box>
      ) : (
        <>
          <Divider sx={{ mb: 2 }} />
          <Box id="elector-distribution-chart">
            <Chart options={chartOptions} series={apexSeries} type="bar" height={height} />
          </Box>
        </>
      )}
    </Paper>
  );
};

export default FamilyDistributionChart;
