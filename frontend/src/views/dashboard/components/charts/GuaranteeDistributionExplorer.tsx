import { useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { useTheme } from '@mui/material/styles';

import {
  GuaranteeDistributionCategory,
  GuaranteeDistributionSeries,
  useGuaranteeDistribution
} from '../hooks/useGuaranteeDistribution';

interface GuaranteeDistributionExplorerProps {
  electionId: number;
  height?: number;
}

const LIMIT_OPTIONS = [6, 8, 10, 12];

const formatPercentage = (value: number): string => `${Number.isFinite(value) ? value.toFixed(1) : '0.0'}%`;

export const GuaranteeDistributionExplorer: React.FC<GuaranteeDistributionExplorerProps> = ({ electionId, height = 380 }) => {
  const theme = useTheme();
  const [dimensionX, setDimensionX] = useState<string>('family');
  const [dimensionY, setDimensionY] = useState<string>('area');
  const [categoryLimit, setCategoryLimit] = useState<number>(10);

  const { data, loading, error, refetch } = useGuaranteeDistribution(electionId, {
    dimensionX,
    dimensionY,
    limit: categoryLimit
  });

  useEffect(() => {
    if (!data) return;

    if (data.x_dimension && data.x_dimension.id !== dimensionX) {
      setDimensionX(data.x_dimension.id);
    }

    if (data.y_dimension && data.y_dimension.id !== dimensionY) {
      setDimensionY(data.y_dimension.id);
    }
  }, [data, dimensionX, dimensionY]);

  const categories = useMemo(() => data?.categories ?? [], [data]);
  const series = useMemo(() => data?.series ?? [], [data]);

  const options: ApexOptions = useMemo(() => {
    return {
      chart: {
        type: 'bar',
        stacked: true,
        toolbar: { show: false },
        animations: { enabled: true }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 4,
          borderRadiusApplication: 'end'
        }
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      dataLabels: { enabled: false },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        labels: {
          colors: theme.palette.text.primary
        }
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (value: number, { seriesIndex, dataPointIndex }) => {
            if (!data) return `${value} guarantees`;
            const targetSeries = data.series[seriesIndex];
            if (!targetSeries) return `${value} guarantees`;
            const attendance = targetSeries.attended[dataPointIndex] ?? 0;
            const percent = targetSeries.attendance_percentage[dataPointIndex] ?? 0;
            return `${value.toLocaleString()} guarantees • ${attendance.toLocaleString()} attended (${formatPercentage(percent)})`;
          }
        }
      },
      colors: theme.palette.mode === 'dark'
        ? [theme.palette.primary.light, theme.palette.secondary.light, theme.palette.info.light, theme.palette.success.light, theme.palette.warning.light, theme.palette.error.light]
        : [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.info.main, theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main],
      xaxis: {
        categories: categories.map((item) => item.label),
        labels: {
          rotate: -15,
          trim: true,
          style: {
            colors: theme.palette.text.secondary
          }
        }
      },
      yaxis: {
        title: {
          text: 'Guarantees',
          style: {
            color: theme.palette.text.secondary
          }
        }
      },
      grid: {
        borderColor: theme.palette.divider,
        strokeDashArray: 3
      },
      responsive: [
        {
          breakpoint: 900,
          options: {
            legend: { position: 'top' },
            plotOptions: { bar: { columnWidth: '65%' } }
          }
        }
      ]
    };
  }, [categories, data, theme]);

  const handleDimensionChange = (setter: (value: string) => void) => (event: SelectChangeEvent<string>) => {
    setter(event.target.value);
  };

  const handleLimitChange = (event: SelectChangeEvent<string>) => {
    const newLimit = Number(event.target.value);
    setCategoryLimit(newLimit);
    refetch({ limit: newLimit });
  };

  const renderSummaryChip = (title: string, value: string, color: 'primary' | 'secondary' | 'default' = 'default') => (
    <Chip label={`${title}: ${value}`} color={color} variant={color === 'default' ? 'outlined' : 'filled'} />
  );

  const renderTotals = (totals: GuaranteeDistributionCategory[] = [], caption: string) => (
    <Stack spacing={0.5} sx={{ maxHeight: 180, overflowY: 'auto' }}>
      <Typography variant="caption" fontWeight={600} color="text.secondary">
        {caption}
      </Typography>
      {totals.slice(0, 5).map((item) => (
        <Typography key={item.key} variant="caption" color="text.secondary">
          {item.label}: {item.count.toLocaleString()} ({formatPercentage(item.attendance_percentage)})
        </Typography>
      ))}
    </Stack>
  );

  const renderChart = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: height }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert
          severity="error"
          action={
            <IconButton size="small" color="inherit" onClick={() => refetch()}>
              <RefreshOutlinedIcon fontSize="small" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      );
    }

    if (!data || categories.length === 0 || series.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="body2" color="text.secondary">
            No guarantee distribution data available for the selected dimensions.
          </Typography>
        </Box>
      );
    }

    const chartSeries = series.map((item: GuaranteeDistributionSeries) => ({
      name: item.label,
      data: item.data
    }));

    return <Chart type="bar" options={options} series={chartSeries} height={height} />;
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Stack spacing={0.5}>
            <Typography variant="h5" fontWeight={700}>
              Guarantee Distribution Explorer
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Compare guarantees across any available dimensions and understand distribution patterns.
            </Typography>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="dimension-x-label">X Axis</InputLabel>
              <Select
                labelId="dimension-x-label"
                value={dimensionX}
                label="X Axis"
                onChange={handleDimensionChange(setDimensionX)}
              >
                {data?.available_dimensions?.map((dimension) => (
                  <MenuItem key={dimension.id} value={dimension.id} disabled={dimension.id === dimensionY}>
                    {dimension.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="dimension-y-label">Series</InputLabel>
              <Select
                labelId="dimension-y-label"
                value={dimensionY}
                label="Series"
                onChange={handleDimensionChange(setDimensionY)}
              >
                {data?.available_dimensions?.map((dimension) => (
                  <MenuItem key={dimension.id} value={dimension.id} disabled={dimension.id === dimensionX}>
                    {dimension.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="limit-label">Top N</InputLabel>
              <Select labelId="limit-label" value={categoryLimit.toString()} label="Top N" onChange={handleLimitChange}>
                {LIMIT_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option.toString()}>
                    Top {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Tooltip title="Refresh">
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer'
                }}
                onClick={() => refetch()}
              >
                <RefreshOutlinedIcon fontSize="small" />
              </Box>
            </Tooltip>
          </Stack>
        </Stack>

        {data?.y_dimension?.adjusted && (
          <Alert severity="info" icon={<InfoOutlinedIcon fontSize="small" />}>
            We adjusted the series dimension to avoid duplicates. Currently showing {data?.y_dimension?.label}.
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            {renderChart()}
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={1.5}>
              {data && data.totals && data.x_dimension && data.y_dimension && (
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {renderSummaryChip('Total Guarantees', data.totals.overall.toLocaleString(), 'primary')}
                  {renderSummaryChip(
                    'X Axis',
                    data.x_dimension.label,
                    data.x_dimension.id === dimensionX ? 'secondary' : 'default'
                  )}
                  {renderSummaryChip(
                    'Series',
                    data.y_dimension.label,
                    data.y_dimension.id === dimensionY ? 'secondary' : 'default'
                  )}
                </Stack>
              )}

              <Divider />

              {data && data.totals && (
                <Stack spacing={1.5}>
                  {renderTotals(data.totals.x_totals, 'Top Categories')}
                  {renderTotals(data.totals.y_totals, 'Top Series')}
                </Stack>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Paper>
  );
};

export default GuaranteeDistributionExplorer;
