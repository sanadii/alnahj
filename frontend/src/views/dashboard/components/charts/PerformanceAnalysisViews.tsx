/**
 * Performance Analysis Views
 * Multi-view component with Heatmap, Charts, Filters, and Table
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Stack,
  Chip,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  LinearProgress,
  Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconDownload, IconUsers, IconMap, IconChartBar, IconFilter, IconTable } from '@tabler/icons-react';
import Chart from 'react-apexcharts';
import { getHeatmapOptions, getBarChartOptions } from 'utils/charts/chartDefaults';
import { exportChartAsPNG } from 'utils/charts/exportChart';

interface PerformanceItem {
  code: string;
  name: string;
  totalElectors: number;
  attended: number;
  attendancePercentage: number;
  male: number;
  female: number;
}

interface PerformanceAnalysisViewsProps {
  teams: PerformanceItem[];
  areas: PerformanceItem[];
  height?: number;
  metricLabel?: string;
  showAttendance?: boolean; // New prop to control attendance vs elector data
}

type ViewType = 'heatmap' | 'chart' | 'filter' | 'table';
type DataType = 'teams' | 'areas';
type SortField = 'name' | 'totalElectors' | 'attended' | 'attendancePercentage';
type SortOrder = 'asc' | 'desc';

export const PerformanceAnalysisViews: React.FC<PerformanceAnalysisViewsProps> = ({
  teams,
  areas,
  height = 400,
  metricLabel = 'Attendance',
  showAttendance = true // Default to showing attendance
}) => {
  const theme = useTheme();
  const [currentView, setCurrentView] = useState<ViewType>('heatmap');
  const [currentDataType, setCurrentDataType] = useState<DataType>('teams');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [minElectors, setMinElectors] = useState<number>(0);
  const [sortField, setSortField] = useState<SortField>(showAttendance ? 'attendancePercentage' : 'totalElectors');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Get the value to display based on showAttendance flag
  const getDisplayValue = (item: PerformanceItem): number => {
    return showAttendance ? item.attendancePercentage || 0 : item.totalElectors || 0;
  };

  // Get the display label
  const displayLabel = showAttendance ? metricLabel : 'Electors';

  // Reset sort field when showAttendance changes
  useEffect(() => {
    if (!showAttendance && (sortField === 'attended' || sortField === 'attendancePercentage')) {
      setSortField('totalElectors');
    }
  }, [showAttendance, sortField]);

  const handleViewChange = (event: React.SyntheticEvent, newValue: ViewType) => {
    setCurrentView(newValue);
  };

  const handleDataTypeChange = (event: React.SyntheticEvent, newValue: DataType) => {
    setCurrentDataType(newValue);
  };

  // Get current data
  const currentData = currentDataType === 'teams' ? teams : areas;
  const currentLabel = currentDataType === 'teams' ? 'Teams' : 'Areas';

  // Apply filters and sorting
  const filteredData = useMemo(() => {
    let filtered = [...currentData];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Min electors filter
    if (minElectors > 0) {
      filtered = filtered.filter((item) => item.totalElectors >= minElectors);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else {
        comparison = a[sortField] - b[sortField];
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [currentData, searchQuery, minElectors, sortField, sortOrder]);

  // Top 10 for heatmap
  const top10Data = useMemo(() => {
    return [...filteredData].sort((a, b) => getDisplayValue(b) - getDisplayValue(a)).slice(0, 10);
  }, [filteredData, showAttendance]);

  // Calculate stats
  const stats = useMemo(() => {
    if (filteredData.length === 0) return { avg: 0, high: 0, low: 0 };

    if (showAttendance) {
      const avg = filteredData.reduce((sum, item) => sum + (item.attendancePercentage || 0), 0) / filteredData.length;
      const high = filteredData.filter((item) => (item.attendancePercentage || 0) >= 80).length;
      const low = filteredData.filter((item) => (item.attendancePercentage || 0) < 50).length;
      return { avg: avg.toFixed(1), high, low };
    } else {
      const totalElectors = filteredData.reduce((sum, item) => sum + (item.totalElectors || 0), 0);
      const avg = totalElectors / filteredData.length;
      const high = filteredData.filter((item) => (item.totalElectors || 0) >= 100).length; // Threshold for "high"
      const low = filteredData.filter((item) => (item.totalElectors || 0) < 10).length; // Threshold for "low"
      return { avg: avg.toFixed(0), high, low };
    }
  }, [filteredData, showAttendance]);

  const handleExport = () => {
    const filename = `${currentLabel}-${currentView}-${metricLabel}`;
    exportChartAsPNG('performance-analysis-chart', filename);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // HEATMAP VIEW
  const renderHeatmap = () => {
    const rows = [];
    const COLS = 5;
    for (let i = 0; i < top10Data.length; i += COLS) {
      rows.push(top10Data.slice(i, i + COLS));
    }

    // Calculate min/max for proper color scaling
    const values = top10Data.map((item) => getDisplayValue(item));
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    const chartOptions = {
      ...getHeatmapOptions(theme),
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          colorScale: {
            ranges: showAttendance
              ? [
                  { from: 0, to: 30, color: theme.palette.error.main, name: 'Low' },
                  { from: 31, to: 69, color: theme.palette.warning.main, name: 'Medium' },
                  { from: 70, to: 100, color: theme.palette.success.main, name: 'High' }
                ]
              : [
                  { from: 0, to: maxValue * 0.33, color: theme.palette.error.light, name: 'Low' },
                  { from: maxValue * 0.33 + 1, to: maxValue * 0.66, color: theme.palette.warning.light, name: 'Medium' },
                  { from: maxValue * 0.66 + 1, to: maxValue, color: theme.palette.success.main, name: 'High' }
                ]
          }
        }
      },
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
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#fff'],
          fontSize: '13px',
          fontWeight: 700
        }
      },
      tooltip: {
        theme: theme.palette.mode,
        custom: ({ seriesIndex, dataPointIndex }: any) => {
          const item = rows[seriesIndex]?.[dataPointIndex];
          if (!item) return '';

          const displayValue = getDisplayValue(item);
          const valueDisplay = showAttendance ? `${displayValue.toFixed(1)}%` : displayValue.toLocaleString();

          return `
            <div style="padding: 12px; background: ${theme.palette.background.paper}; border-radius: 8px; border: 1px solid ${theme.palette.divider};">
              <div style="font-weight: 700; margin-bottom: 4px; color: ${theme.palette.text.primary};">
                ${item.code} - ${item.name}
              </div>
              <div style="color: ${theme.palette.text.secondary};">
                ${displayLabel}: <strong style="color: ${theme.palette.text.primary};">${valueDisplay}</strong>
              </div>
              <div style="color: ${theme.palette.text.secondary}; font-size: 11px; margin-top: 4px;">
                ${item.totalElectors || 0} electors (${item.male || 0}M, ${item.female || 0}F)
              </div>
              ${
                showAttendance
                  ? `
              <div style="color: ${theme.palette.text.secondary}; font-size: 11px;">
                ${item.attended || 0} attended
              </div>
              `
                  : ''
              }
            </div>
          `;
        }
      }
    };

    const series = rows.map((row, rowIndex) => ({
      name: `Row ${rowIndex + 1}`,
      data: row.map((item) => ({
        x: item.code,
        y: Math.round(getDisplayValue(item))
      }))
    }));

    if (top10Data.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No data available for heatmap
          </Typography>
        </Box>
      );
    }

    return (
      <Box id="performance-analysis-chart">
        <Chart options={chartOptions} series={series} type="heatmap" height={height} />
      </Box>
    );
  };

  // BAR CHART VIEW
  const renderBarChart = () => {
    const top15Data = [...filteredData].sort((a, b) => getDisplayValue(b) - getDisplayValue(a)).slice(0, 15);

    const chartOptions = {
      ...getBarChartOptions(theme),
      chart: {
        ...getBarChartOptions(theme).chart,
        type: 'bar',
        toolbar: {
          show: true
        }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '70%',
          distributed: true
        }
      },
      colors: top15Data.map((item) => {
        const value = getDisplayValue(item);
        if (showAttendance) {
          if (value >= 80) return theme.palette.success.main;
          if (value >= 50) return theme.palette.warning.main;
          return theme.palette.error.main;
        } else {
          // For elector counts: green >= 100, yellow >= 50, red < 50
          if (value >= 100) return theme.palette.success.main;
          if (value >= 50) return theme.palette.warning.main;
          return theme.palette.error.main;
        }
      }),
      xaxis: {
        categories: top15Data.map((item) => item.name),
        labels: {
          formatter: (val: number) => (showAttendance ? `${val}%` : val.toLocaleString()),
          style: {
            colors: theme.palette.text.secondary
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: theme.palette.text.secondary,
            fontSize: '12px',
            fontWeight: 600
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => (showAttendance ? `${val.toFixed(1)}%` : val.toLocaleString()),
        style: {
          colors: ['#fff'],
          fontSize: '11px',
          fontWeight: 600
        }
      },
      legend: {
        show: false
      },
      tooltip: {
        theme: theme.palette.mode,
        y: {
          formatter: (val: number, opts: any) => {
            const item = top15Data[opts.dataPointIndex];
            if (showAttendance) {
              return `${val.toFixed(1)}% (${item.attended || 0}/${item.totalElectors || 0})`;
            } else {
              return `${val.toLocaleString()} electors (${item.male || 0}M, ${item.female || 0}F)`;
            }
          }
        }
      }
    };

    const series = [
      {
        name: displayLabel,
        data: top15Data.map((item) => getDisplayValue(item))
      }
    ];

    if (top15Data.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No data available for chart
          </Typography>
        </Box>
      );
    }

    return (
      <Box id="performance-analysis-chart">
        <Chart options={chartOptions} series={series} type="bar" height={height} />
      </Box>
    );
  };

  // FILTER VIEW
  const renderFilterView = () => {
    return (
      <Box>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <TextField
            label="Search"
            placeholder="Search by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ flex: 1 }}
          />
          <TextField
            label="Min Electors"
            type="number"
            value={minElectors}
            onChange={(e) => setMinElectors(Number(e.target.value))}
            size="small"
            sx={{ width: 150 }}
          />
          <FormControl size="small" sx={{ width: 200 }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortField} label="Sort By" onChange={(e) => setSortField(e.target.value as SortField)}>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="totalElectors">Total Electors</MenuItem>
              {showAttendance && <MenuItem value="attended">Attended</MenuItem>}
              {showAttendance && <MenuItem value="attendancePercentage">Attendance %</MenuItem>}
            </Select>
          </FormControl>
        </Stack>

        {/* Show results */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredData.length} of {currentData.length} {currentLabel.toLowerCase()}
          </Typography>
        </Box>

        {/* Grid of cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
          {filteredData.slice(0, 20).map((item) => {
            const displayValue = getDisplayValue(item);

            return (
              <Paper
                key={item.code}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" fontWeight={600} noWrap>
                  {item.code}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
                  {item.name}
                </Typography>
                {showAttendance && (
                  <Box sx={{ mb: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={displayValue}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'divider',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: displayValue >= 80 ? 'success.main' : displayValue >= 50 ? 'warning.main' : 'error.main'
                        }
                      }}
                    />
                  </Box>
                )}
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Chip
                    label={showAttendance ? `${displayValue.toFixed(1)}%` : `${displayValue.toLocaleString()} electors`}
                    size="small"
                    color="primary"
                  />
                  {!showAttendance && <Chip label={`${item.male || 0}M • ${item.female || 0}F`} size="small" variant="outlined" />}
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {showAttendance
                    ? `${item.male || 0}M • ${item.female || 0}F • ${item.attended || 0} attended`
                    : `${item.male || 0}M • ${item.female || 0}F electors`}
                </Typography>
              </Paper>
            );
          })}
        </Box>
      </Box>
    );
  };

  // TABLE VIEW
  const renderTableView = () => {
    return (
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'name'}
                  direction={sortField === 'name' ? sortOrder : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Code / Name
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'totalElectors'}
                  direction={sortField === 'totalElectors' ? sortOrder : 'asc'}
                  onClick={() => handleSort('totalElectors')}
                >
                  Total Electors
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Male</TableCell>
              <TableCell align="right">Female</TableCell>
              {showAttendance && (
                <>
                  <TableCell align="right">
                    <TableSortLabel
                      active={sortField === 'attended'}
                      direction={sortField === 'attended' ? sortOrder : 'asc'}
                      onClick={() => handleSort('attended')}
                    >
                      Attended
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right">
                    <TableSortLabel
                      active={sortField === 'attendancePercentage'}
                      direction={sortField === 'attendancePercentage' ? sortOrder : 'asc'}
                      onClick={() => handleSort('attendancePercentage')}
                    >
                      Attendance %
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">Status</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((item) => {
              const displayValue = getDisplayValue(item);

              return (
                <TableRow key={item.code} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {item.code}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{(item.totalElectors || 0).toLocaleString()}</TableCell>
                  <TableCell align="right">{(item.male || 0).toLocaleString()}</TableCell>
                  <TableCell align="right">{(item.female || 0).toLocaleString()}</TableCell>
                  {showAttendance && (
                    <>
                      <TableCell align="right">{(item.attended || 0).toLocaleString()}</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {(item.attendancePercentage || 0).toFixed(1)}%
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={
                            (item.attendancePercentage || 0) >= 80 ? 'High' : (item.attendancePercentage || 0) >= 50 ? 'Medium' : 'Low'
                          }
                          size="small"
                          color={
                            (item.attendancePercentage || 0) >= 80
                              ? 'success'
                              : (item.attendancePercentage || 0) >= 50
                                ? 'warning'
                                : 'error'
                          }
                        />
                      </TableCell>
                    </>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  if (teams.length === 0 && areas.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          No teams or areas data available
        </Typography>
      </Paper>
    );
  }

  // Check if all attendance is zero
  const allAttendanceZero = useMemo(() => {
    return currentData.every((item) => (item.attendancePercentage || 0) === 0);
  }, [currentData]);

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      {/* Data Type Tabs (Teams/Areas) */}
      <Tabs value={currentDataType} onChange={handleDataTypeChange} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Tab
          value="teams"
          label={`Teams (${teams.length})`}
          icon={<IconUsers size={18} />}
          iconPosition="start"
          disabled={teams.length === 0}
        />
        <Tab
          value="areas"
          label={`Areas (${areas.length})`}
          icon={<IconMap size={18} />}
          iconPosition="start"
          disabled={areas.length === 0}
        />
      </Tabs>

      {/* View Type Tabs */}
      <Tabs value={currentView} onChange={handleViewChange} sx={{ mb: 2 }}>
        <Tab value="heatmap" label="Heatmap (Top 10)" icon={<IconChartBar size={18} />} iconPosition="start" />
        <Tab value="chart" label="Bar Chart (Top 15)" icon={<IconChartBar size={18} />} iconPosition="start" />
        <Tab value="filter" label="Filtered View" icon={<IconFilter size={18} />} iconPosition="start" />
        <Tab value="table" label="Table View" icon={<IconTable size={18} />} iconPosition="start" />
      </Tabs>

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            {currentLabel} {currentView === 'heatmap' ? 'Heatmap' : currentView === 'chart' ? 'Performance' : 'Analysis'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentView === 'heatmap' && `Top 10 ${currentLabel.toLowerCase()} by ${showAttendance ? 'attendance' : 'elector count'}`}
            {currentView === 'chart' && `Top 15 ${currentLabel.toLowerCase()} ${showAttendance ? 'performance' : 'elector count'} chart`}
            {currentView === 'filter' && `Filter and search ${currentLabel.toLowerCase()}`}
            {currentView === 'table' && `Complete ${currentLabel.toLowerCase()} data table`}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip label={`Avg: ${stats.avg}${showAttendance ? '%' : ''}`} size="small" color="primary" />
          <Chip label={`${stats.high} High`} size="small" sx={{ bgcolor: 'success.main', color: 'white' }} />
          <Chip label={`${stats.low} Low`} size="small" sx={{ bgcolor: 'error.main', color: 'white' }} />
          {(currentView === 'heatmap' || currentView === 'chart') && (
            <Tooltip title="Export as PNG">
              <IconButton size="small" onClick={handleExport}>
                <IconDownload size={20} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>

      {/* Info Alert when all attendance is zero */}
      {showAttendance && allAttendanceZero && (currentView === 'heatmap' || currentView === 'chart') && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={600}>
            Data Loaded: {currentData.length} {currentLabel.toLowerCase()}
          </Typography>
          <Typography variant="caption">
            Charts show attendance percentage. Currently 0% for all {currentLabel.toLowerCase()} - data will populate when election starts
            and attendance is recorded. Use <strong>Table View</strong> to see elector counts and team details.
          </Typography>
        </Alert>
      )}

      {/* Render current view */}
      {currentView === 'heatmap' && renderHeatmap()}
      {currentView === 'chart' && renderBarChart()}
      {currentView === 'filter' && renderFilterView()}
      {currentView === 'table' && renderTableView()}
    </Paper>
  );
};

export default PerformanceAnalysisViews;
