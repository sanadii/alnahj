/**
 * Elector Data Visualization
 * Multi-view component with Treemap, Bubble Chart, Enhanced Table, and Grouped Bar Chart
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  LinearProgress,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
  Checkbox,
  Menu,
  ListItemText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  IconDownload,
  IconUsers,
  IconMap,
  IconChartTreemap,
  IconTable,
  IconChartBar,
  IconChevronLeft,
  IconChevronRight,
  IconHierarchy3,
  IconUsersGroup,
  IconSearch,
  IconColumns,
  IconFileExport,
  IconTrendingUp,
  IconTrendingDown,
  IconMinus
} from '@tabler/icons-react';
import Chart from 'react-apexcharts';
import { getBarChartOptions } from 'utils/charts/chartDefaults';
import { exportChartAsPNG } from 'utils/charts/exportChart';

interface ElectorDataItem {
  code: string;
  name: string;
  totalElectors: number;
  attended: number;
  attendancePercentage: number;
  male: number;
  female: number;
}

interface EnhancedElectorDataItem extends ElectorDataItem {
  genderRatio: string;
  malePercentage: number;
  femalePercentage: number;
  rank: number;
  percentageOfTotal: number;
  differenceFromAvg: number;
  status: 'high' | 'medium' | 'low';
  attendanceStatus?: 'excellent' | 'good' | 'needs-attention';
}

interface ElectorDataVisualizationProps {
  teams: ElectorDataItem[];
  departments: ElectorDataItem[];
  areas: ElectorDataItem[];
  families: ElectorDataItem[];
  height?: number;
  showAttendance?: boolean;
}

type ViewType = 'treemap' | 'table' | 'grouped';
type DataType = 'teams' | 'departments' | 'areas' | 'families';
type SortField =
  | 'name'
  | 'totalElectors'
  | 'male'
  | 'female'
  | 'attended'
  | 'attendancePercentage'
  | 'genderRatio'
  | 'malePercentage'
  | 'femalePercentage'
  | 'rank'
  | 'percentageOfTotal'
  | 'differenceFromAvg';
type QuickFilter = 'high-volume' | 'balanced-gender' | 'male-dominant' | 'female-dominant' | 'top-performers' | null;
type SortOrder = 'asc' | 'desc';
type PrimaryAxisType = 'families' | 'teams' | 'departments' | 'areas';
type SeriesType = 'none' | 'gender' | 'departments' | 'teams';

const PAGE_SIZE = 20;

export const ElectorDataVisualization: React.FC<ElectorDataVisualizationProps> = ({
  teams,
  departments,
  areas,
  families,
  height = 500,
  showAttendance = false
}) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [currentView, setCurrentView] = useState<ViewType>('grouped');
  const [currentDataType, setCurrentDataType] = useState<DataType>('families');
  const [sortField, setSortField] = useState<SortField>('totalElectors');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState<number>(1);
  const [primaryAxis, setPrimaryAxis] = useState<PrimaryAxisType>('families');
  const [series, setSeries] = useState<SeriesType>('gender');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>(null);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    code: true,
    total: true,
    male: true,
    female: true,
    genderRatio: true,
    malePercentage: false,
    femalePercentage: false,
    rank: true,
    percentageOfTotal: false,
    differenceFromAvg: false,
    attended: true,
    attendancePercentage: true,
    progress: true
  });
  const [columnMenuAnchor, setColumnMenuAnchor] = useState<null | HTMLElement>(null);


  const dataMap: Record<DataType, ElectorDataItem[]> = {
    teams,
    departments,
    areas,
    families
  };

  const labelMap: Record<DataType, string> = {
    teams: 'Teams',
    departments: 'Departments',
    areas: 'Areas',
    families: 'Families'
  };

  const currentData = dataMap[currentDataType] ?? [];
  const currentLabel = labelMap[currentDataType];
  const hasAttendance = showAttendance && currentDataType !== 'families';

  // Get data based on primary axis selection
  const primaryAxisData = useMemo(() => {
    switch (primaryAxis) {
      case 'families':
        return families;
      case 'teams':
        return teams;
      case 'departments':
        return departments;
      case 'areas':
        return areas;
      default:
        return families;
    }
  }, [primaryAxis, families, teams, departments, areas]);

  // Calculate stats - needed for enhanceDataItem and display
  const stats = useMemo(() => {
    // Use primary axis data for grouped view, otherwise use current data type
    const dataForStats = currentView === 'grouped' ? primaryAxisData : currentData;
    if (dataForStats.length === 0) return { total: 0, male: 0, female: 0, avgElectors: 0 };
    const total = dataForStats.reduce((sum, item) => sum + (item.totalElectors || 0), 0);
    const male = dataForStats.reduce((sum, item) => sum + (item.male || 0), 0);
    const female = dataForStats.reduce((sum, item) => sum + (item.female || 0), 0);
    const avgElectors = total / dataForStats.length;
    return { total, male, female, avgElectors: Math.round(avgElectors) };
  }, [currentData, currentView, primaryAxisData]);

  // Enhance data with calculated fields - MUST be defined before sortedData
  const enhanceDataItem = (item: ElectorDataItem, index: number, allData: ElectorDataItem[], avgOverride?: number): EnhancedElectorDataItem => {
    const total = item.totalElectors || 0;
    const male = item.male || 0;
    const female = item.female || 0;
    const grandTotal = allData.reduce((sum, d) => sum + (d.totalElectors || 0), 0);
    const avg = avgOverride ?? (stats.avgElectors || 1);

    // Calculate gender ratio
    let genderRatio = '0:0';
    if (female > 0) {
      const ratio = (male / female).toFixed(1);
      genderRatio = `${ratio}:1`;
    } else if (male > 0) {
      genderRatio = `${male}:0`;
    }

    // Calculate percentages
    const malePercentage = total > 0 ? (male / total) * 100 : 0;
    const femalePercentage = total > 0 ? (female / total) * 100 : 0;
    const percentageOfTotal = grandTotal > 0 ? (total / grandTotal) * 100 : 0;
    const differenceFromAvg = total - avg;

    // Determine status
    let status: 'high' | 'medium' | 'low' = 'low';
    if (total >= 100) status = 'high';
    else if (total >= 50) status = 'medium';

    // Determine attendance status
    let attendanceStatus: 'excellent' | 'good' | 'needs-attention' | undefined;
    if (hasAttendance) {
      const attPercent = item.attendancePercentage || 0;
      if (attPercent >= 80) attendanceStatus = 'excellent';
      else if (attPercent >= 50) attendanceStatus = 'good';
      else attendanceStatus = 'needs-attention';
    }

    return {
      ...item,
      genderRatio,
      malePercentage: Math.round(malePercentage * 10) / 10,
      femalePercentage: Math.round(femalePercentage * 10) / 10,
      rank: index + 1,
      percentageOfTotal: Math.round(percentageOfTotal * 10) / 10,
      differenceFromAvg: Math.round(differenceFromAvg),
      status,
      attendanceStatus
    };
  };

  // Sort data
  const sortedData = useMemo(() => {
    return [...currentData].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'genderRatio') {
        // Parse ratio strings like "5.6:1"
        const parseRatio = (ratio: string) => {
          const parts = ratio.split(':');
          return parts[0] ? parseFloat(parts[0]) : 0;
        };
        const dataTotal = currentData.reduce((sum, item) => sum + (item.totalElectors || 0), 0);
        const dataAvg = currentData.length > 0 ? dataTotal / currentData.length : 0;
        const aEnhanced = enhanceDataItem(a, 0, currentData, dataAvg);
        const bEnhanced = enhanceDataItem(b, 0, currentData, dataAvg);
        comparison = parseRatio(aEnhanced.genderRatio) - parseRatio(bEnhanced.genderRatio);
      } else {
        const dataTotal = currentData.reduce((sum, item) => sum + (item.totalElectors || 0), 0);
        const dataAvg = currentData.length > 0 ? dataTotal / currentData.length : 0;
        const aEnhanced = enhanceDataItem(a, 0, currentData, dataAvg);
        const bEnhanced = enhanceDataItem(b, 0, currentData, dataAvg);
        let aVal = 0;
        let bVal = 0;
        
        switch (sortField) {
          case 'rank':
            aVal = aEnhanced.rank;
            bVal = bEnhanced.rank;
            break;
          case 'malePercentage':
            aVal = aEnhanced.malePercentage;
            bVal = bEnhanced.malePercentage;
            break;
          case 'femalePercentage':
            aVal = aEnhanced.femalePercentage;
            bVal = bEnhanced.femalePercentage;
            break;
          case 'percentageOfTotal':
            aVal = aEnhanced.percentageOfTotal;
            bVal = bEnhanced.percentageOfTotal;
            break;
          case 'differenceFromAvg':
            aVal = aEnhanced.differenceFromAvg;
            bVal = bEnhanced.differenceFromAvg;
            break;
          default:
            aVal = (a[sortField] as number) ?? 0;
            bVal = (b[sortField] as number) ?? 0;
        }
        comparison = aVal - bVal;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [currentData, sortField, sortOrder, enhanceDataItem]);

  // Sort and paginate primary axis data
  const sortedPrimaryData = useMemo(() => {
    const data = [...primaryAxisData];
    return data.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'genderRatio') {
        // Parse ratio strings like "5.6:1"
        const parseRatio = (ratio: string) => {
          const parts = ratio.split(':');
          return parts[0] ? parseFloat(parts[0]) : 0;
        };
        const dataTotal = data.reduce((sum, item) => sum + (item.totalElectors || 0), 0);
        const dataAvg = data.length > 0 ? dataTotal / data.length : 0;
        const aEnhanced = enhanceDataItem(a, 0, data, dataAvg);
        const bEnhanced = enhanceDataItem(b, 0, data, dataAvg);
        comparison = parseRatio(aEnhanced.genderRatio) - parseRatio(bEnhanced.genderRatio);
      } else {
        const dataTotal = data.reduce((sum, item) => sum + (item.totalElectors || 0), 0);
        const dataAvg = data.length > 0 ? dataTotal / data.length : 0;
        const aEnhanced = enhanceDataItem(a, 0, data, dataAvg);
        const bEnhanced = enhanceDataItem(b, 0, data, dataAvg);
        let aVal = 0;
        let bVal = 0;
        
        switch (sortField) {
          case 'rank':
            aVal = aEnhanced.rank;
            bVal = bEnhanced.rank;
            break;
          case 'malePercentage':
            aVal = aEnhanced.malePercentage;
            bVal = bEnhanced.malePercentage;
            break;
          case 'femalePercentage':
            aVal = aEnhanced.femalePercentage;
            bVal = bEnhanced.femalePercentage;
            break;
          case 'percentageOfTotal':
            aVal = aEnhanced.percentageOfTotal;
            bVal = bEnhanced.percentageOfTotal;
            break;
          case 'differenceFromAvg':
            aVal = aEnhanced.differenceFromAvg;
            bVal = bEnhanced.differenceFromAvg;
            break;
          default:
            aVal = (a[sortField] as number) ?? 0;
            bVal = (b[sortField] as number) ?? 0;
        }
        comparison = aVal - bVal;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [primaryAxisData, sortField, sortOrder, enhanceDataItem]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  useEffect(() => {
    setPage(1);
  }, [currentDataType, sortField, sortOrder, currentView, showAttendance, primaryAxis, searchQuery, quickFilter]);

  // Use primary axis data for grouped view, otherwise use current data type
  const labelForPagination = currentView === 'grouped' 
    ? (primaryAxis === 'families' ? 'Families' : primaryAxis === 'teams' ? 'Teams' : primaryAxis === 'departments' ? 'Departments' : 'Areas')
    : currentLabel;

  // Enhanced and filtered data - MUST be defined before pagination
  const enhancedData = useMemo(() => {
    const data = currentView === 'grouped' ? sortedPrimaryData : sortedData;
    // Calculate average for this dataset
    const dataTotal = data.reduce((sum, item) => sum + (item.totalElectors || 0), 0);
    const dataAvg = data.length > 0 ? dataTotal / data.length : 0;
    let enhanced = data.map((item, index) => enhanceDataItem(item, index, data, dataAvg));

    // Apply quick filters
    if (quickFilter) {
      switch (quickFilter) {
        case 'high-volume':
          enhanced = enhanced.filter(item => item.status === 'high');
          break;
        case 'balanced-gender':
          enhanced = enhanced.filter(item => item.femalePercentage >= 40 && item.femalePercentage <= 60);
          break;
        case 'male-dominant':
          enhanced = enhanced.filter(item => item.malePercentage > 70);
          break;
        case 'female-dominant':
          enhanced = enhanced.filter(item => item.femalePercentage > 30);
          break;
        case 'top-performers':
          if (hasAttendance) {
            enhanced = enhanced.filter(item => item.attendanceStatus === 'excellent').slice(0, 10);
          } else {
            enhanced = enhanced.slice(0, 10);
          }
          break;
      }
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      enhanced = enhanced.filter(item =>
        item.code.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.totalElectors.toString().includes(query) ||
        item.male.toString().includes(query) ||
        item.female.toString().includes(query)
      );
    }

    // Recalculate ranks after all filters
    enhanced = enhanced.map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    return enhanced;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedData, sortedPrimaryData, currentView, quickFilter, searchQuery, hasAttendance]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(enhancedData.length / PAGE_SIZE));
  }, [enhancedData.length]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return enhancedData.slice(start, start + PAGE_SIZE);
  }, [enhancedData, page]);

  const handleDataTypeToggle = (_event: React.SyntheticEvent, value: DataType | null) => {
    if (value) {
      setCurrentDataType(value);
      // Sync primary axis when in grouped view
      if (currentView === 'grouped') {
        setPrimaryAxis(value as PrimaryAxisType);
      }
      setPage(1); // Reset to first page when changing data type
    }
  };

  const handleViewToggle = (_event: React.SyntheticEvent, value: ViewType | null) => {
    if (value) {
      setCurrentView(value);
      // Sync primary axis with current data type when switching to grouped view
      if (value === 'grouped') {
        setPrimaryAxis(currentDataType as PrimaryAxisType);
      }
    }
  };

  const handleExport = () => {
    exportChartAsPNG('elector-data-chart', `${currentLabel}-${currentView}`);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Rank', 'Code', 'Name', 'Total', 'Male', 'Female', 'Gender Ratio', 'Male %', 'Female %', '% of Total', 'Diff from Avg'];
    if (hasAttendance) {
      headers.push('Attended', 'Attendance %');
    }
    headers.push('Status');

    const rows = enhancedData.map(item => [
      item.rank,
      item.code,
      item.name,
      item.totalElectors,
      item.male,
      item.female,
      item.genderRatio,
      item.malePercentage,
      item.femalePercentage,
      item.percentageOfTotal,
      item.differenceFromAvg,
      ...(hasAttendance ? [item.attended, item.attendancePercentage] : []),
      item.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${currentLabel}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: 'high' | 'medium' | 'low') => {
    switch (status) {
      case 'high': return theme.palette.success.main;
      case 'medium': return theme.palette.warning.main;
      case 'low': return theme.palette.error.main;
    }
  };

  const getAttendanceStatusColor = (status?: 'excellent' | 'good' | 'needs-attention') => {
    if (!status) return theme.palette.grey[500];
    switch (status) {
      case 'excellent': return theme.palette.success.main;
      case 'good': return theme.palette.warning.main;
      case 'needs-attention': return theme.palette.error.main;
    }
  };

  const paginationLabel =
    paginatedData.length > 0
      ? `Showing ${paginatedData.length} of ${enhancedData.length} ${labelForPagination.toLowerCase()}`
      : `No ${labelForPagination.toLowerCase()} to display`;

  const goToPage = (value: number) => {
    const next = Math.min(Math.max(value, 1), totalPages);
    setPage(next);
  };

  const renderPagination = () => (
    <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
      <IconButton size="small" onClick={() => goToPage(1)} disabled={page === 1}>
        «
      </IconButton>
      <IconButton size="small" onClick={() => goToPage(page - 1)} disabled={page === 1}>
        <IconChevronLeft size={16} />
      </IconButton>
      <Typography variant="caption" color="text.secondary">
        {page} / {totalPages}
      </Typography>
      <IconButton size="small" onClick={() => goToPage(page + 1)} disabled={page === totalPages}>
        <IconChevronRight size={16} />
      </IconButton>
      <IconButton size="small" onClick={() => goToPage(totalPages)} disabled={page === totalPages}>
        »
      </IconButton>
    </Stack>
  );

  // TREEMAP VIEW
  const renderTreemap = () => {
    const treemapData = paginatedData.map((item) => ({
      x: item.code,
      y: item.totalElectors || 0
    }));

    const chartOptions: any = {
      chart: {
        type: 'treemap' as const,
        toolbar: {
          show: true,
          tools: {
            download: true
          }
        },
        background: 'transparent'
      },
      plotOptions: {
        treemap: {
          enableShades: true,
          shadeIntensity: 0.5,
          distributed: false,
          colorScale: {
            ranges: hasAttendance
              ? [
                  { from: 0, to: 30, color: theme.palette.error.main },
                  { from: 31, to: 69, color: theme.palette.warning.main },
                  { from: 70, to: 100, color: theme.palette.success.main }
                ]
              : [
                  { from: 0, to: 50, color: theme.palette.error.light },
                  { from: 51, to: 100, color: theme.palette.warning.light },
                  { from: 101, to: 999999, color: theme.palette.success.main }
                ]
          }
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '12px',
          fontWeight: 600,
          colors: ['#fff']
        },
        formatter: (text: string, op: any) => {
          const value = op.value;
          return [text, value.toLocaleString()];
        }
      },
      theme: {
        mode: theme.palette.mode
      },
      tooltip: {
        theme: theme.palette.mode,
        y: {
          formatter: (val: number, opts: any) => {
            const item = paginatedData[opts.dataPointIndex];
            return `${val.toLocaleString()} electors (${item.male}M, ${item.female}F)`;
          }
        }
      }
    };

    const series = [
      {
        data: treemapData
      }
    ];

    if (sortedData.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No data available
          </Typography>
        </Box>
      );
    }

    return (
      <Box id="elector-data-chart">
        <Chart options={chartOptions} series={series} type="treemap" height={height} />
      </Box>
    );
  };

  // ENHANCED TABLE VIEW
  const renderEnhancedTable = () => {
    const getRowColor = (item: EnhancedElectorDataItem) => {
      const value = hasAttendance ? item.attendancePercentage || 0 : item.totalElectors || 0;

      if (hasAttendance) {
        if (value >= 80) return theme.palette.success.light;
        if (value >= 50) return theme.palette.warning.light;
        return theme.palette.error.light;
      } else {
        if (value >= 100) return theme.palette.success.light;
        if (value >= 50) return theme.palette.warning.light;
        return theme.palette.error.light;
      }
    };

    const totalForProgress = stats.total || 1;
    const columnOptions = [
      { key: 'rank', label: 'Rank' },
      { key: 'code', label: 'Code / Name' },
      { key: 'total', label: 'Total' },
      { key: 'male', label: 'Male' },
      { key: 'female', label: 'Female' },
      { key: 'genderRatio', label: 'Gender Ratio' },
      { key: 'malePercentage', label: 'Male %' },
      { key: 'femalePercentage', label: 'Female %' },
      { key: 'percentageOfTotal', label: '% of Total' },
      { key: 'differenceFromAvg', label: 'Diff from Avg' },
      { key: 'attended', label: 'Attended' },
      { key: 'attendancePercentage', label: 'Attendance %' },
      { key: 'progress', label: 'Progress' }
    ];

    return (
      <Stack spacing={2}>
        {/* Search and Filter Bar */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
          <TextField
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={18} />
                </InputAdornment>
              )
            }}
            sx={{ flexGrow: 1, minWidth: 200 }}
          />
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            <Chip
              label="High Volume"
              size="small"
              color={quickFilter === 'high-volume' ? 'primary' : 'default'}
              onClick={() => setQuickFilter(quickFilter === 'high-volume' ? null : 'high-volume')}
              icon={<IconTrendingUp size={16} />}
            />
            <Chip
              label="Balanced"
              size="small"
              color={quickFilter === 'balanced-gender' ? 'primary' : 'default'}
              onClick={() => setQuickFilter(quickFilter === 'balanced-gender' ? null : 'balanced-gender')}
            />
            <Chip
              label="Male Dominant"
              size="small"
              color={quickFilter === 'male-dominant' ? 'primary' : 'default'}
              onClick={() => setQuickFilter(quickFilter === 'male-dominant' ? null : 'male-dominant')}
            />
            {hasAttendance && (
              <Chip
                label="Top Performers"
                size="small"
                color={quickFilter === 'top-performers' ? 'primary' : 'default'}
                onClick={() => setQuickFilter(quickFilter === 'top-performers' ? null : 'top-performers')}
                icon={<IconTrendingUp size={16} />}
              />
            )}
          </Stack>
          <Tooltip title="Column Visibility">
            <IconButton
              size="small"
              onClick={(e) => setColumnMenuAnchor(e.currentTarget)}
            >
              <IconColumns size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export to CSV">
            <IconButton size="small" onClick={handleExportCSV}>
              <IconFileExport size={18} />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Column Visibility Menu */}
        <Menu
          anchorEl={columnMenuAnchor}
          open={Boolean(columnMenuAnchor)}
          onClose={() => setColumnMenuAnchor(null)}
        >
          {columnOptions
            .filter(opt => opt.key !== 'code' && opt.key !== 'progress')
            .map((option) => (
              <MenuItem
                key={option.key}
                onClick={() => {
                  setColumnVisibility(prev => ({
                    ...prev,
                    [option.key]: !prev[option.key]
                  }));
                }}
              >
                <Checkbox checked={columnVisibility[option.key] ?? true} />
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
        </Menu>

        {/* Table */}
        <TableContainer sx={{ maxHeight: height }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {columnVisibility.rank && (
                  <TableCell align="center" sx={{ width: 60 }}>
                    <TableSortLabel
                      active={sortField === 'rank'}
                      direction={sortField === 'rank' ? sortOrder : 'asc'}
                      onClick={() => handleSort('rank')}
                    >
                      #
                    </TableSortLabel>
                  </TableCell>
                )}
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'name'}
                    direction={sortField === 'name' ? sortOrder : 'asc'}
                    onClick={() => handleSort('name')}
                  >
                    Code / Name
                  </TableSortLabel>
                </TableCell>
                {columnVisibility.total && (
                  <TableCell align="right">
                    <TableSortLabel
                      active={sortField === 'totalElectors'}
                      direction={sortField === 'totalElectors' ? sortOrder : 'asc'}
                      onClick={() => handleSort('totalElectors')}
                    >
                      Total
                    </TableSortLabel>
                  </TableCell>
                )}
                {columnVisibility.male && (
                  <TableCell align="right">
                    <TableSortLabel
                      active={sortField === 'male'}
                      direction={sortField === 'male' ? sortOrder : 'asc'}
                      onClick={() => handleSort('male')}
                    >
                      Male
                    </TableSortLabel>
                  </TableCell>
                )}
                {columnVisibility.female && (
                  <TableCell align="right">
                    <TableSortLabel
                      active={sortField === 'female'}
                      direction={sortField === 'female' ? sortOrder : 'asc'}
                      onClick={() => handleSort('female')}
                    >
                      Female
                    </TableSortLabel>
                  </TableCell>
                )}
                {columnVisibility.genderRatio && (
                  <TableCell align="center">
                    <TableSortLabel
                      active={sortField === 'genderRatio'}
                      direction={sortField === 'genderRatio' ? sortOrder : 'asc'}
                      onClick={() => handleSort('genderRatio')}
                    >
                      M:F Ratio
                    </TableSortLabel>
                  </TableCell>
                )}
                {columnVisibility.malePercentage && (
                  <TableCell align="right">
                    <TableSortLabel
                      active={sortField === 'malePercentage'}
                      direction={sortField === 'malePercentage' ? sortOrder : 'asc'}
                      onClick={() => handleSort('malePercentage')}
                    >
                      Male %
                    </TableSortLabel>
                  </TableCell>
                )}
                {columnVisibility.femalePercentage && (
                  <TableCell align="right">
                    <TableSortLabel
                      active={sortField === 'femalePercentage'}
                      direction={sortField === 'femalePercentage' ? sortOrder : 'asc'}
                      onClick={() => handleSort('femalePercentage')}
                    >
                      Female %
                    </TableSortLabel>
                  </TableCell>
                )}
                {columnVisibility.percentageOfTotal && (
                  <TableCell align="right">
                    <TableSortLabel
                      active={sortField === 'percentageOfTotal'}
                      direction={sortField === 'percentageOfTotal' ? sortOrder : 'asc'}
                      onClick={() => handleSort('percentageOfTotal')}
                    >
                      % of Total
                    </TableSortLabel>
                  </TableCell>
                )}
                {columnVisibility.differenceFromAvg && (
                  <TableCell align="right">
                    <TableSortLabel
                      active={sortField === 'differenceFromAvg'}
                      direction={sortField === 'differenceFromAvg' ? sortOrder : 'asc'}
                      onClick={() => handleSort('differenceFromAvg')}
                    >
                      vs Avg
                    </TableSortLabel>
                  </TableCell>
                )}
                {hasAttendance && columnVisibility.attended && (
                  <TableCell align="right">
                    <TableSortLabel
                      active={sortField === 'attended'}
                      direction={sortField === 'attended' ? sortOrder : 'asc'}
                      onClick={() => handleSort('attended')}
                    >
                      Attended
                    </TableSortLabel>
                  </TableCell>
                )}
                {hasAttendance && columnVisibility.attendancePercentage && (
                  <TableCell align="right">
                    <TableSortLabel
                      active={sortField === 'attendancePercentage'}
                      direction={sortField === 'attendancePercentage' ? sortOrder : 'asc'}
                      onClick={() => handleSort('attendancePercentage')}
                    >
                      Attendance %
                    </TableSortLabel>
                  </TableCell>
                )}
                {columnVisibility.progress && (
                  <TableCell align="center" sx={{ width: 200 }}>
                    Progress
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={20} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No data found {searchQuery || quickFilter ? '(try clearing filters)' : ''}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                (paginatedData as EnhancedElectorDataItem[]).map((item) => (
                  <TableRow
                    key={item.code}
                    hover
                    sx={{
                      bgcolor: getRowColor(item),
                      '&:hover': {
                        bgcolor: `${getRowColor(item)} !important`,
                        opacity: 0.8
                      }
                    }}
                  >
                    {columnVisibility.rank && (
                      <TableCell align="center">
                        <Chip
                          label={`#${item.rank}`}
                          size="small"
                          sx={{
                            bgcolor: item.rank <= 3 ? theme.palette.primary.main : 'transparent',
                            color: item.rank <= 3 ? 'white' : 'inherit',
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2" fontWeight={600}>
                            {item.code}
                          </Typography>
                          <Chip
                            label={item.status.toUpperCase()}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.65rem',
                              bgcolor: getStatusColor(item.status),
                              color: 'white'
                            }}
                          />
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          {item.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    {columnVisibility.total && (
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {item.totalElectors.toLocaleString()}
                        </Typography>
                      </TableCell>
                    )}
                    {columnVisibility.male && (
                      <TableCell align="right">{item.male.toLocaleString()}</TableCell>
                    )}
                    {columnVisibility.female && (
                      <TableCell align="right">{item.female.toLocaleString()}</TableCell>
                    )}
                    {columnVisibility.genderRatio && (
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={600}>
                          {item.genderRatio}
                        </Typography>
                      </TableCell>
                    )}
                    {columnVisibility.malePercentage && (
                      <TableCell align="right">
                        <Typography variant="body2">
                          {item.malePercentage.toFixed(1)}%
                        </Typography>
                      </TableCell>
                    )}
                    {columnVisibility.femalePercentage && (
                      <TableCell align="right">
                        <Typography variant="body2">
                          {item.femalePercentage.toFixed(1)}%
                        </Typography>
                      </TableCell>
                    )}
                    {columnVisibility.percentageOfTotal && (
                      <TableCell align="right">
                        <Typography variant="body2" color="text.secondary">
                          {item.percentageOfTotal.toFixed(1)}%
                        </Typography>
                      </TableCell>
                    )}
                    {columnVisibility.differenceFromAvg && (
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-end">
                          {item.differenceFromAvg > 0 ? (
                            <IconTrendingUp size={14} color={theme.palette.success.main} />
                          ) : item.differenceFromAvg < 0 ? (
                            <IconTrendingDown size={14} color={theme.palette.error.main} />
                          ) : (
                            <IconMinus size={14} />
                          )}
                          <Typography
                            variant="body2"
                            sx={{
                              color: item.differenceFromAvg > 0 ? theme.palette.success.main : item.differenceFromAvg < 0 ? theme.palette.error.main : 'inherit',
                              fontWeight: 600
                            }}
                          >
                            {item.differenceFromAvg > 0 ? '+' : ''}{item.differenceFromAvg}
                          </Typography>
                        </Stack>
                      </TableCell>
                    )}
                    {hasAttendance && columnVisibility.attended && (
                      <TableCell align="right">{item.attended.toLocaleString()}</TableCell>
                    )}
                    {hasAttendance && columnVisibility.attendancePercentage && (
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                          <Typography variant="body2" fontWeight={600}>
                            {item.attendancePercentage.toFixed(1)}%
                          </Typography>
                          {item.attendanceStatus && (
                            <Chip
                              label={item.attendanceStatus}
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: '0.65rem',
                                bgcolor: getAttendanceStatusColor(item.attendanceStatus),
                                color: 'white'
                              }}
                            />
                          )}
                        </Stack>
                      </TableCell>
                    )}
                    {columnVisibility.progress && (
                      <TableCell align="center" sx={{ width: 200 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={
                              hasAttendance
                                ? item.attendancePercentage || 0
                                : Math.min((item.totalElectors / totalForProgress) * 100, 100)
                            }
                            sx={{
                              flex: 1,
                              height: 8,
                              borderRadius: 4,
                              bgcolor: 'rgba(255,255,255,0.1)',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: hasAttendance
                                  ? getAttendanceStatusColor(item.attendanceStatus)
                                  : getStatusColor(item.status)
                              }
                            }}
                          />
                          <Typography variant="caption" sx={{ minWidth: 40 }}>
                            {hasAttendance
                              ? `${item.attendancePercentage.toFixed(0)}%`
                              : `${((item.totalElectors / totalForProgress) * 100).toFixed(0)}%`}
                          </Typography>
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    );
  };

  const paginatedPrimaryData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedPrimaryData.slice(start, start + PAGE_SIZE);
  }, [sortedPrimaryData, page]);

  // GROUPED BAR CHART VIEW
  const renderGroupedBarChart = () => {
    const pageData = paginatedPrimaryData;

    // Build series based on series selection
    let chartSeries: any[] = [];
    let chartColors: string[] = [];

    if (series === 'gender') {
      chartSeries = [
        {
          name: 'Male',
          data: pageData.map((item) => item.male || 0)
        },
        {
          name: 'Female',
          data: pageData.map((item) => item.female || 0)
        }
      ];
      chartColors = [theme.palette.info.main, theme.palette.secondary.main];
    } else if (series === 'none') {
      chartSeries = [
        {
          name: 'Total Electors',
          data: pageData.map((item) => item.totalElectors || 0)
        }
      ];
      chartColors = [theme.palette.primary.main];
    } else if (series === 'departments' && primaryAxis !== 'departments') {
      // Show departments as separate series
      // Each department becomes a series, showing its total electors for each primary axis category
      // Since we don't have direct relationships, distribute departments proportionally
      const topDepartments = [...departments]
        .sort((a, b) => (b.totalElectors || 0) - (a.totalElectors || 0))
        .slice(0, Math.min(10, departments.length)); // Top 10 departments
      
      const totalDeptElectors = topDepartments.reduce((sum, dept) => sum + (dept.totalElectors || 0), 0);
      const totalAllDeptElectors = departments.reduce((sum, dept) => sum + (dept.totalElectors || 0), 0);
      
      chartSeries = topDepartments.map((dept) => ({
        name: dept.code || dept.name,
        data: pageData.map((primaryItem) => {
          // Distribute department electors proportionally based on primary axis item size
          if (totalDeptElectors === 0) return 0;
          const ratio = (dept.totalElectors || 0) / totalDeptElectors;
          return Math.round((primaryItem.totalElectors || 0) * ratio);
        })
      }));
      
      // Add "Unassigned" or "No Department" series for electors not in any department
      const totalPrimaryElectors = pageData.reduce((sum, item) => sum + (item.totalElectors || 0), 0);
      if (totalAllDeptElectors < totalPrimaryElectors) {
        chartSeries.push({
          name: 'No Department / Unassigned',
          data: pageData.map((primaryItem) => {
            // Calculate unassigned electors for each primary axis item
            const assignedRatio = totalAllDeptElectors > 0 ? totalAllDeptElectors / totalPrimaryElectors : 0;
            const assigned = Math.round((primaryItem.totalElectors || 0) * assignedRatio);
            return Math.max(0, (primaryItem.totalElectors || 0) - assigned);
          })
        });
      }
      
      // Generate distinct colors for departments
      chartColors = chartSeries.map((_, index) => {
        if (index === chartSeries.length - 1 && chartSeries.length > topDepartments.length) {
          // Gray color for unassigned
          return theme.palette.mode === 'dark' ? '#666666' : '#999999';
        }
        const hue = (index * 360) / Math.max(topDepartments.length, 1);
        return `hsl(${hue}, 70%, 50%)`;
      });
    } else if (series === 'teams' && primaryAxis !== 'teams') {
      // Show teams as separate series
      const topTeams = [...teams]
        .sort((a, b) => (b.totalElectors || 0) - (a.totalElectors || 0))
        .slice(0, Math.min(10, teams.length)); // Top 10 teams
      
      const totalTeamElectors = topTeams.reduce((sum, team) => sum + (team.totalElectors || 0), 0);
      const totalAllTeamElectors = teams.reduce((sum, team) => sum + (team.totalElectors || 0), 0);
      
      chartSeries = topTeams.map((team) => ({
        name: team.code || team.name,
        data: pageData.map((primaryItem) => {
          // Distribute team electors proportionally based on primary axis item size
          if (totalTeamElectors === 0) return 0;
          const ratio = (team.totalElectors || 0) / totalTeamElectors;
          return Math.round((primaryItem.totalElectors || 0) * ratio);
        })
      }));
      
      // Add "Unassigned" or "No Team" series for electors not in any team
      const totalPrimaryElectors = pageData.reduce((sum, item) => sum + (item.totalElectors || 0), 0);
      if (totalAllTeamElectors < totalPrimaryElectors) {
        chartSeries.push({
          name: 'No Team / Unassigned',
          data: pageData.map((primaryItem) => {
            // Calculate unassigned electors for each primary axis item
            const assignedRatio = totalAllTeamElectors > 0 ? totalAllTeamElectors / totalPrimaryElectors : 0;
            const assigned = Math.round((primaryItem.totalElectors || 0) * assignedRatio);
            return Math.max(0, (primaryItem.totalElectors || 0) - assigned);
          })
        });
      }
      
      // Generate distinct colors for teams
      chartColors = chartSeries.map((_, index) => {
        if (index === chartSeries.length - 1 && chartSeries.length > topTeams.length) {
          // Gray color for unassigned
          return theme.palette.mode === 'dark' ? '#666666' : '#999999';
        }
        const hue = (index * 360) / Math.max(topTeams.length, 1);
        return `hsl(${hue}, 70%, 50%)`;
      });
    } else {
      // Fallback to gender when series matches primary axis or invalid combination
      chartSeries = [
        {
          name: 'Male',
          data: pageData.map((item) => item.male || 0)
        },
        {
          name: 'Female',
          data: pageData.map((item) => item.female || 0)
        }
      ];
      chartColors = [theme.palette.info.main, theme.palette.secondary.main];
    }

    const chartOptions: any = {
      ...getBarChartOptions(theme),
      chart: {
        ...getBarChartOptions(theme).chart,
        type: 'bar' as const,
        stacked: series !== 'none',
        toolbar: {
          show: true
        }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '80%',
          dataLabels: {
            position: 'top'
          }
        }
      },
      xaxis: {
        categories: pageData.map((item) => item.code || item.name),
        labels: {
          formatter: (val: number) => val.toLocaleString(),
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
      colors: chartColors,
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        labels: {
          colors: theme.palette.text.primary
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#fff'],
          fontSize: '10px',
          fontWeight: 600
        }
      },
      tooltip: {
        theme: theme.palette.mode,
        shared: true,
        intersect: false,
        y: {
          formatter: (val: number) => `${val.toLocaleString()} electors`
        }
      }
    };

    if (pageData.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No data available
          </Typography>
        </Box>
      );
    }

    return (
      <Box id="elector-data-chart">
        <Chart 
          key={`grouped-bar-${series}-${primaryAxis}-${page}`}
          options={chartOptions} 
          series={chartSeries} 
          type="bar" 
          height={height} 
        />
      </Box>
    );
  };

  if (teams.length === 0 && departments.length === 0 && areas.length === 0 && families.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          No elector demographic data available
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Box
            sx={{
              minWidth: isMdUp ? 260 : '100%',
              maxWidth: isMdUp ? 280 : '100%',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              p: 2,
              background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)'
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
              Filters
            </Typography>
            <ToggleButtonGroup
              value={currentDataType}
              exclusive
              onChange={handleDataTypeToggle}
              orientation="vertical"
              size="small"
              color="primary"
              sx={{ width: '100%', gap: 1 }}
            >
              <ToggleButton value="families" disabled={families.length === 0} sx={{ textTransform: 'none', justifyContent: 'flex-start' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconUsersGroup size={16} />
                  <Typography variant="body2">Families ({families.length})</Typography>
                </Stack>
              </ToggleButton>
              <ToggleButton value="teams" disabled={teams.length === 0} sx={{ textTransform: 'none', justifyContent: 'flex-start' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconUsers size={16} />
                  <Typography variant="body2">Teams ({teams.length})</Typography>
                </Stack>
              </ToggleButton>
              <ToggleButton
                value="departments"
                disabled={departments.length === 0}
                sx={{ textTransform: 'none', justifyContent: 'flex-start' }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconHierarchy3 size={16} />
                  <Typography variant="body2">Departments ({departments.length})</Typography>
                </Stack>
              </ToggleButton>
              <ToggleButton value="areas" disabled={areas.length === 0} sx={{ textTransform: 'none', justifyContent: 'flex-start' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconMap size={16} />
                  <Typography variant="body2">Areas ({areas.length})</Typography>
                </Stack>
              </ToggleButton>
            </ToggleButtonGroup>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Diagram
            </Typography>
            <ToggleButtonGroup
              value={currentView}
              exclusive
              onChange={handleViewToggle}
              orientation="vertical"
              size="small"
              color="primary"
              sx={{ width: '100%', gap: 1 }}
            >
              <ToggleButton value="grouped" sx={{ textTransform: 'none', justifyContent: 'flex-start' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconChartBar size={16} />
                  <Typography variant="body2">Grouped Bar</Typography>
                </Stack>
              </ToggleButton>
              <ToggleButton value="treemap" sx={{ textTransform: 'none', justifyContent: 'flex-start' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconChartTreemap size={16} />
                  <Typography variant="body2">Treemap</Typography>
                </Stack>
              </ToggleButton>
              <ToggleButton value="table" sx={{ textTransform: 'none', justifyContent: 'flex-start' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconTable size={16} />
                  <Typography variant="body2">Table</Typography>
                </Stack>
              </ToggleButton>
            </ToggleButtonGroup>

            <Divider sx={{ my: 2 }} />

            {/* Primary Axis and Series controls for grouped view */}
            {currentView === 'grouped' && (
              <>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Chart Options
                </Typography>
                <Stack spacing={2}>
                  <FormControl size="small" fullWidth>
                    <InputLabel>Primary Axis</InputLabel>
                    <Select
                      value={primaryAxis}
                      label="Primary Axis"
                      onChange={(e) => {
                        const newAxis = e.target.value as PrimaryAxisType;
                        setPrimaryAxis(newAxis);
                        setCurrentDataType(newAxis as DataType);
                        setPage(1);
                      }}
                    >
                      <MenuItem value="families">Families</MenuItem>
                      <MenuItem value="teams">Teams</MenuItem>
                      <MenuItem value="departments">Departments</MenuItem>
                      <MenuItem value="areas">Areas</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" fullWidth>
                    <InputLabel>Series</InputLabel>
                    <Select
                      value={series}
                      label="Series"
                      onChange={(e) => setSeries(e.target.value as SeriesType)}
                    >
                      <MenuItem value="none">None</MenuItem>
                      <MenuItem value="gender">Gender</MenuItem>
                      <MenuItem value="departments">Departments</MenuItem>
                      <MenuItem value="teams">Teams</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                <Divider sx={{ my: 2 }} />
              </>
            )}

            {enhancedData.length > PAGE_SIZE && (
              <Stack spacing={1} alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  {paginationLabel}
                </Typography>
                {renderPagination()}
              </Stack>
            )}
          </Box>

          <Stack flex={1} spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h5" fontWeight={600}>
                  {currentLabel} {currentView === 'treemap' ? 'Treemap' : currentView === 'table' ? 'Data Table' : 'Grouped Bar Chart'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentView === 'treemap' && `All ${currentLabel.toLowerCase()} sized by elector count`}
                  {currentView === 'table' && `Complete ${currentLabel.toLowerCase()} data with color-coded rows`}
                  {currentView === 'grouped' && `Paginated ${currentLabel.toLowerCase()} with male/female breakdown`}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip label={`Total: ${stats.total.toLocaleString()}`} size="small" color="primary" />
                <Chip label={`${stats.male.toLocaleString()}M`} size="small" sx={{ bgcolor: 'info.main', color: 'white' }} />
                <Chip label={`${stats.female.toLocaleString()}F`} size="small" sx={{ bgcolor: 'secondary.main', color: 'white' }} />
                <Chip label={`Avg: ${stats.avgElectors}`} size="small" variant="outlined" />
                <Tooltip title="Export current view as PNG">
                  <IconButton size="small" onClick={handleExport}>
                    <IconDownload size={18} />
                  </IconButton>
                </Tooltip>
              </Stack>

              {enhancedData.length > PAGE_SIZE && !isMdUp && renderPagination()}
            </Stack>

            {currentView === 'treemap' && renderTreemap()}
            {currentView === 'table' && renderEnhancedTable()}
            {currentView === 'grouped' && renderGroupedBarChart()}
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ElectorDataVisualization;
