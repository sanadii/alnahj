# Dashboard Charts - Quick Start Implementation Guide

**Purpose**: Ready-to-use chart components for immediate implementation  
**Status**: Code examples and templates  
**Date**: November 3, 2025

---

## 📦 Quick Setup

### Installation
```bash
cd D:\React\election\frontend

# Install required packages
npm install apexcharts react-apexcharts
npm install date-fns
npm install xlsx jspdf html2canvas

# Install types
npm install -D @types/d3
```

### File Structure
```
src/
├── views/election/components/
│   ├── charts/
│   │   ├── index.ts
│   │   ├── PartyComparisonChart.tsx
│   │   ├── CommitteePerformanceChart.tsx
│   │   ├── GuaranteesTrendChart.tsx
│   │   ├── AttendanceTimelineChart.tsx
│   │   ├── ElectorDemographicsChart.tsx
│   │   └── ... (more charts)
│   └── widgets/
│       ├── LiveCounter.tsx
│       ├── PredictionWidget.tsx
│       └── AlertsWidget.tsx
├── utils/
│   ├── charts/
│   │   ├── chartDefaults.ts
│   │   ├── exportChart.ts
│   │   └── chartHelpers.ts
│   └── statistics/
│       ├── calculations.ts
│       ├── predictions.ts
│       └── correlations.ts
```

---

## 🎨 Chart Templates

### 1. Party Comparison Bar Chart

```typescript
// File: src/views/election/components/charts/PartyComparisonChart.tsx

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Paper, Typography, Box, Stack, Chip, IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconDownload } from '@tabler/icons-react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

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

export const PartyComparisonChart: React.FC<PartyComparisonChartProps> = ({ 
  parties, 
  totalCandidates,
  height = 350
}) => {
  const theme = useTheme();

  const chartOptions = useMemo(() => ({
    chart: {
      type: 'bar',
      toolbar: {
        show: true,
        tools: {
          download: true,
          zoom: false
        }
      }
    },
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
    colors: parties.map(p => p.color),
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
      categories: parties.map(p => p.name),
      title: {
        text: 'Candidates',
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
    grid: {
      borderColor: theme.palette.divider
    },
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: (val: number) => {
          const percentage = totalCandidates > 0 
            ? ((val / totalCandidates) * 100).toFixed(1) 
            : '0';
          return `${val} candidates (${percentage}%)`;
        }
      }
    },
    legend: {
      show: false
    }
  }), [parties, totalCandidates, theme]);

  const series = useMemo(() => [{
    name: 'Candidates',
    data: parties.map(p => p.candidateCount)
  }], [parties]);

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
            Candidate distribution across parties
          </Typography>
        </Box>
        <Chip label={`${parties.length} Parties`} size="small" color="primary" />
      </Stack>
      <Box sx={{ mt: 2 }}>
        <Chart 
          options={chartOptions} 
          series={series} 
          type="bar" 
          height={height} 
        />
      </Box>
    </Paper>
  );
};

export default PartyComparisonChart;
```

**Usage:**
```typescript
// In DashboardView.tsx Election Tab
import { PartyComparisonChart } from './charts/PartyComparisonChart';

<PartyComparisonChart 
  parties={parties}
  totalCandidates={totalCandidates}
/>
```

---

### 2. Committee Performance Grouped Bar Chart

```typescript
// File: src/views/election/components/charts/CommitteePerformanceChart.tsx

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Paper, Typography, Box, Stack, Chip, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Committee {
  id: number;
  code: string;
  name: string;
  electorCount: number;
  attendanceCount: number;
  voteCount: number;
  gender: 'MALE' | 'FEMALE' | 'MIXED';
}

interface CommitteePerformanceChartProps {
  committees: Committee[];
}

export const CommitteePerformanceChart: React.FC<CommitteePerformanceChartProps> = ({ committees }) => {
  const theme = useTheme();
  const [chartType, setChartType] = React.useState<'grouped' | 'stacked'>('grouped');

  const chartOptions = useMemo(() => ({
    chart: {
      type: 'bar',
      stacked: chartType === 'stacked',
      toolbar: {
        show: true
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 8,
        columnWidth: '70%'
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.info.main,
      theme.palette.success.main
    ],
    xaxis: {
      categories: committees.map(c => c.code),
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      title: {
        text: 'Count',
        style: {
          color: theme.palette.text.primary,
          fontWeight: 600
        }
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: theme.palette.text.primary
      }
    },
    grid: {
      borderColor: theme.palette.divider
    },
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: (val: number) => `${val} electors`
      }
    }
  }), [committees, chartType, theme]);

  const series = useMemo(() => [
    {
      name: 'Total Electors',
      data: committees.map(c => c.electorCount)
    },
    {
      name: 'Attendance',
      data: committees.map(c => c.attendanceCount)
    },
    {
      name: 'Votes',
      data: committees.map(c => c.voteCount)
    }
  ], [committees]);

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Committee Performance
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Electors, attendance, and votes by committee
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={(e, newType) => newType && setChartType(newType)}
          size="small"
        >
          <ToggleButton value="grouped">Grouped</ToggleButton>
          <ToggleButton value="stacked">Stacked</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Box>
        <Chart options={chartOptions} series={series} type="bar" height={400} />
      </Box>
    </Paper>
  );
};

export default CommitteePerformanceChart;
```

---

### 3. Guarantees Trend Line Chart

```typescript
// File: src/views/election/components/charts/GuaranteesTrendChart.tsx

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Paper, Typography, Box, Stack, ButtonGroup, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { format, subDays } from 'date-fns';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface GuaranteeTrendData {
  date: string;
  strong: number;
  medium: number;
  weak: number;
  total: number;
}

interface GuaranteesTrendChartProps {
  data: GuaranteeTrendData[];
}

export const GuaranteesTrendChart: React.FC<GuaranteesTrendChartProps> = ({ data }) => {
  const theme = useTheme();
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // Filter data based on period
  const filteredData = useMemo(() => {
    if (period === 'all') return data;
    
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const cutoffDate = subDays(new Date(), days);
    
    return data.filter(d => new Date(d.date) >= cutoffDate);
  }, [data, period]);

  const chartOptions = useMemo(() => ({
    chart: {
      type: 'area',
      stacked: true,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    dataLabels: {
      enabled: false
    },
    colors: [
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main
    ],
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.1
      }
    },
    xaxis: {
      type: 'datetime',
      categories: filteredData.map(d => d.date),
      labels: {
        format: 'MMM dd',
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      title: {
        text: 'Guarantees',
        style: {
          color: theme.palette.text.primary,
          fontWeight: 600
        }
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      labels: {
        colors: theme.palette.text.primary
      }
    },
    grid: {
      borderColor: theme.palette.divider
    },
    tooltip: {
      theme: theme.palette.mode,
      x: {
        format: 'dd MMM yyyy'
      }
    }
  }), [filteredData, theme]);

  const series = useMemo(() => [
    {
      name: 'Strong',
      data: filteredData.map(d => d.strong)
    },
    {
      name: 'Medium',
      data: filteredData.map(d => d.medium)
    },
    {
      name: 'Weak',
      data: filteredData.map(d => d.weak)
    }
  ], [filteredData]);

  const latestData = filteredData[filteredData.length - 1];

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Guarantees Trend
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Guarantee collection over time by strength
          </Typography>
        </Box>
        <ButtonGroup size="small">
          <Button variant={period === '7d' ? 'contained' : 'outlined'} onClick={() => setPeriod('7d')}>
            7D
          </Button>
          <Button variant={period === '30d' ? 'contained' : 'outlined'} onClick={() => setPeriod('30d')}>
            30D
          </Button>
          <Button variant={period === '90d' ? 'contained' : 'outlined'} onClick={() => setPeriod('90d')}>
            90D
          </Button>
          <Button variant={period === 'all' ? 'contained' : 'outlined'} onClick={() => setPeriod('all')}>
            ALL
          </Button>
        </ButtonGroup>
      </Stack>

      {/* Quick Stats */}
      {latestData && (
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Chip label={`Total: ${latestData.total}`} color="primary" />
          <Chip label={`Strong: ${latestData.strong}`} sx={{ bgcolor: 'success.main', color: 'white' }} />
          <Chip label={`Medium: ${latestData.medium}`} sx={{ bgcolor: 'warning.main', color: 'white' }} />
          <Chip label={`Weak: ${latestData.weak}`} sx={{ bgcolor: 'error.main', color: 'white' }} />
        </Stack>
      )}

      <Box>
        <Chart options={chartOptions} series={series} type="area" height={height} />
      </Box>
    </Paper>
  );
};

export default GuaranteesTrendChart;
```

---

### 4. Candidate Distribution Donut Chart

```typescript
// File: src/views/election/components/charts/CandidateDistributionChart.tsx

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Paper, Typography, Box, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface CandidateDistributionChartProps {
  parties: Array<{
    name: string;
    candidateCount: number;
    color: string;
  }>;
}

export const CandidateDistributionChart: React.FC<CandidateDistributionChartProps> = ({ parties }) => {
  const theme = useTheme();

  const chartOptions = useMemo(() => ({
    chart: {
      type: 'donut'
    },
    labels: parties.map(p => p.name),
    colors: parties.map(p => p.color),
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`
    },
    legend: {
      position: 'bottom',
      labels: {
        colors: theme.palette.text.primary
      }
    },
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
              formatter: (w: any) => {
                return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
              }
            }
          }
        }
      }
    },
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: (val: number) => `${val} candidates`
      }
    }
  }), [parties, theme]);

  const series = useMemo(() => parties.map(p => p.candidateCount), [parties]);

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Candidate Distribution
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Percentage share of candidates by party
      </Typography>
      <Box>
        <Chart options={chartOptions} series={series} type="donut" height={350} />
      </Box>
    </Paper>
  );
};

export default CandidateDistributionChart;
```

---

### 5. Live Attendance Counter Widget

```typescript
// File: src/views/election/components/widgets/LiveAttendanceCounter.tsx

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Stack, LinearProgress, Chip } from '@mui/material';
import { IconUsers, IconTarget, IconClock } from '@tabler/icons-react';
import { useTheme } from '@mui/material/styles';

interface LiveAttendanceCounterProps {
  currentAttendance: number;
  totalElectors: number;
  targetPercentage?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
  onRefresh?: () => void;
}

export const LiveAttendanceCounter: React.FC<LiveAttendanceCounterProps> = ({
  currentAttendance,
  totalElectors,
  targetPercentage = 75,
  autoRefresh = true,
  refreshInterval = 30,
  onRefresh
}) => {
  const theme = useTheme();
  const [pulse, setPulse] = useState(false);

  const percentage = totalElectors > 0 ? (currentAttendance / totalElectors) * 100 : 0;
  const targetCount = Math.round((totalElectors * targetPercentage) / 100);
  const remaining = targetCount - currentAttendance;
  const onTrack = currentAttendance >= targetCount;

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || !onRefresh) return;

    const interval = setInterval(() => {
      onRefresh();
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, onRefresh]);

  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 3,
        border: '2px solid',
        borderColor: onTrack ? 'success.main' : percentage >= 50 ? 'warning.main' : 'error.main',
        background: `linear-gradient(135deg, ${
          onTrack ? theme.palette.success.dark : percentage >= 50 ? theme.palette.warning.dark : theme.palette.error.dark
        } 0%, ${
          onTrack ? theme.palette.success.light : percentage >= 50 ? theme.palette.warning.light : theme.palette.error.light
        } 100%)`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        transform: pulse ? 'scale(1.02)' : 'scale(1)'
      }}
    >
      {/* Live Indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          width: 12,
          height: 12,
          borderRadius: '50%',
          bgcolor: 'white',
          animation: pulse ? 'pulse 1s infinite' : 'none',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.5 }
          }
        }}
      />

      <Stack spacing={3}>
        {/* Main Counter */}
        <Box sx={{ textAlign: 'center' }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
            <IconUsers size={48} />
            <Typography variant="h1" fontWeight={700} sx={{ fontSize: '4rem' }}>
              {currentAttendance.toLocaleString()}
            </Typography>
          </Stack>
          <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
            Total Attendance
          </Typography>
        </Box>

        {/* Progress Bar */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="body1" fontWeight={600}>
              Progress to Target
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {percentage.toFixed(1)}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={Math.min(100, percentage)}
            sx={{
              height: 12,
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'white',
                borderRadius: 2
              }
            }}
          />
        </Box>

        {/* Stats Grid */}
        <Stack direction="row" spacing={2} justifyContent="space-around">
          <Box sx={{ textAlign: 'center' }}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
              <IconTarget size={20} />
              <Typography variant="h6" fontWeight={700}>
                {targetCount.toLocaleString()}
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Target ({targetPercentage}%)
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
              <Typography variant="h6" fontWeight={700}>
                {remaining > 0 ? remaining.toLocaleString() : '0'}
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Remaining
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
              <IconClock size={20} />
              <Typography variant="h6" fontWeight={700}>
                LIVE
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Updates: {refreshInterval}s
            </Typography>
          </Box>
        </Stack>

        {/* Status Message */}
        <Box
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            p: 2,
            borderRadius: 2,
            textAlign: 'center'
          }}
        >
          <Typography variant="body1" fontWeight={600}>
            {onTrack 
              ? '🎉 Target Achieved! Keep up the great work!' 
              : remaining > 0 
                ? `📊 ${remaining} more attendees needed to reach target`
                : '✅ All targets met'}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default LiveAttendanceCounter;
```

---

### 6. Committee Attendance Heatmap

```typescript
// File: src/views/election/components/charts/CommitteeAttendanceHeatmap.tsx

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Paper, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface CommitteeAttendanceHeatmapProps {
  committees: Array<{
    code: string;
    name: string;
    attendancePercentage: number;
  }>;
}

export const CommitteeAttendanceHeatmap: React.FC<CommitteeAttendanceHeatmapProps> = ({ committees }) => {
  const theme = useTheme();

  // Organize committees into rows (e.g., 5 per row)
  const rows = useMemo(() => {
    const COLS = 5;
    const result: typeof committees[][] = [];
    
    for (let i = 0; i < committees.length; i += COLS) {
      result.push(committees.slice(i, i + COLS));
    }
    
    return result;
  }, [committees]);

  const chartOptions = useMemo(() => ({
    chart: {
      type: 'heatmap',
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff'],
        fontSize: '12px',
        fontWeight: 700
      },
      formatter: (val: number) => `${val.toFixed(0)}%`
    },
    colors: ['#008FFB'],
    plotOptions: {
      heatmap: {
        radius: 8,
        enableShades: true,
        shadeIntensity: 0.5,
        colorScale: {
          ranges: [
            { from: 0, to: 40, color: theme.palette.error.main, name: 'Low' },
            { from: 41, to: 70, color: theme.palette.warning.main, name: 'Medium' },
            { from: 71, to 100, color: theme.palette.success.main, name: 'High' }
          ]
        }
      }
    },
    legend: {
      show: true,
      position: 'top',
      labels: {
        colors: theme.palette.text.primary
      }
    },
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: (val: number, { seriesIndex, dataPointIndex, w }: any) => {
          const committee = rows[seriesIndex][dataPointIndex];
          return `${committee?.name}: ${val.toFixed(1)}%`;
        }
      }
    },
    xaxis: {
      labels: {
        show: false
      }
    }
  }), [rows, theme]);

  const series = useMemo(() => 
    rows.map((row, rowIndex) => ({
      name: `Row ${rowIndex + 1}`,
      data: row.map(committee => ({
        x: committee.code,
        y: committee.attendancePercentage
      }))
    }))
  , [rows]);

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Committee Attendance Heatmap
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Visual overview of attendance rates across all committees
      </Typography>
      <Box>
        <Chart options={chartOptions} series={series} type="heatmap" height={300} />
      </Box>
    </Paper>
  );
};

export default CommitteeAttendanceHeatmap;
```

---

### 7. Attendance Prediction Widget

```typescript
// File: src/views/election/components/widgets/AttendancePredictionWidget.tsx

import React from 'react';
import { Paper, Typography, Box, Stack, LinearProgress, Chip } from '@mui/material';
import { IconTrendingUp, IconAlertTriangle, IconCheck } from '@tabler/icons-react';

interface AttendancePredictionWidgetProps {
  currentAttendance: number;
  predictedFinal: number;
  targetAttendance: number;
  totalElectors: number;
  confidence: number;
  timeRemaining: number; // minutes
}

export const AttendancePredictionWidget: React.FC<AttendancePredictionWidgetProps> = ({
  currentAttendance,
  predictedFinal,
  targetAttendance,
  totalElectors,
  confidence,
  timeRemaining
}) => {
  const predictedPercentage = (predictedFinal / totalElectors) * 100;
  const targetPercentage = (targetAttendance / totalElectors) * 100;
  const willMeetTarget = predictedFinal >= targetAttendance;
  const gap = targetAttendance - predictedFinal;

  const getStatusColor = () => {
    if (willMeetTarget) return 'success';
    if (gap <= totalElectors * 0.05) return 'warning'; // Within 5%
    return 'error';
  };

  const getRecommendation = () => {
    if (willMeetTarget) {
      return 'On track! Maintain current pace to exceed target.';
    }
    
    const required = gap / (timeRemaining / 60); // Per hour
    return `Need ${Math.ceil(required)} more attendees per hour to meet target.`;
  };

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        border: '2px solid',
        borderColor: `${getStatusColor()}.main`,
        background: `linear-gradient(135deg, ${getStatusColor()}.light 0%, ${getStatusColor()}.lighter 100%)`
      }}
    >
      <Stack spacing={2}>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconTrendingUp size={24} />
          <Typography variant="h5" fontWeight={700}>
            Attendance Forecast
          </Typography>
        </Stack>

        {/* Prediction Display */}
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="h2" fontWeight={700} color={`${getStatusColor()}.dark`}>
            {predictedFinal.toLocaleString()}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Predicted Final ({predictedPercentage.toFixed(1)}%)
          </Typography>
          <Chip
            label={`${confidence}% Confidence`}
            size="small"
            sx={{ mt: 1 }}
            color={confidence >= 80 ? 'success' : confidence >= 60 ? 'warning' : 'default'}
          />
        </Box>

        {/* Progress Comparison */}
        <Box>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Current
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {currentAttendance} ({((currentAttendance / totalElectors) * 100).toFixed(1)}%)
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Predicted
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {predictedFinal} ({predictedPercentage.toFixed(1)}%)
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Target
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {targetAttendance} ({targetPercentage.toFixed(1)}%)
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={Math.min(100, (predictedFinal / targetAttendance) * 100)}
            color={getStatusColor()}
            sx={{ height: 10, borderRadius: 2 }}
          />
        </Box>

        {/* Status & Recommendation */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            p: 2,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Stack direction="row" spacing={1} alignItems="flex-start">
            {willMeetTarget ? (
              <IconCheck size={20} color={theme.palette.success.main} />
            ) : (
              <IconAlertTriangle size={20} color={theme.palette.warning.main} />
            )}
            <Box>
              <Typography variant="body2" fontWeight={600} color="text.primary">
                {willMeetTarget ? 'On Track!' : 'Action Needed'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {getRecommendation()}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Time Remaining */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <IconClock size={18} />
            <Typography variant="body2">
              Time Remaining
            </Typography>
          </Stack>
          <Typography variant="body1" fontWeight={700}>
            {Math.floor(timeRemaining / 60)}h {timeRemaining % 60}m
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default AttendancePredictionWidget;
```

---

## 🔧 Utility Functions

### Chart Export Utility

```typescript
// File: src/utils/charts/exportChart.ts

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

/**
 * Export chart as PNG image
 */
export const exportChartAsPNG = async (
  elementId: string,
  filename: string = 'chart'
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  const canvas = await html2canvas(element, {
    backgroundColor: null,
    scale: 2 // Higher quality
  });

  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

/**
 * Export chart as PDF
 */
export const exportChartAsPDF = async (
  elementId: string,
  filename: string = 'chart',
  title?: string
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [canvas.width, canvas.height]
  });

  if (title) {
    pdf.setFontSize(20);
    pdf.text(title, 40, 40);
  }

  pdf.addImage(imgData, 'PNG', 0, title ? 60 : 0, canvas.width, canvas.height);
  pdf.save(`${filename}.pdf`);
};

/**
 * Export data as Excel
 */
export const exportDataAsExcel = (
  data: any[],
  filename: string = 'data',
  sheetName: string = 'Sheet1'
): void => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

/**
 * Export data as CSV
 */
export const exportDataAsCSV = (
  data: any[],
  filename: string = 'data'
): void => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
};
```

### Statistical Calculations Utility

```typescript
// File: src/utils/statistics/calculations.ts

/**
 * Calculate mean (average)
 */
export const mean = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

/**
 * Calculate median
 */
export const median = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 
    ? (sorted[mid - 1] + sorted[mid]) / 2 
    : sorted[mid];
};

/**
 * Calculate standard deviation
 */
export const standardDeviation = (values: number[]): number => {
  if (values.length === 0) return 0;
  const avg = mean(values);
  const squareDiffs = values.map(value => Math.pow(value - avg, 2));
  const avgSquareDiff = mean(squareDiffs);
  return Math.sqrt(avgSquareDiff);
};

/**
 * Calculate percentile
 */
export const percentile = (values: number[], p: number): number => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
};

/**
 * Calculate Pearson correlation
 */
export const correlation = (x: number[], y: number[]): number => {
  if (x.length !== y.length || x.length < 2) return 0;
  
  const meanX = mean(x);
  const meanY = mean(y);
  
  let numerator = 0;
  let sumSqX = 0;
  let sumSqY = 0;
  
  for (let i = 0; i < x.length; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    numerator += diffX * diffY;
    sumSqX += diffX * diffX;
    sumSqY += diffY * diffY;
  }
  
  const denominator = Math.sqrt(sumSqX * sumSqY);
  return denominator === 0 ? 0 : numerator / denominator;
};

/**
 * Detect outliers using IQR method
 */
export const detectOutliers = (values: number[]): {
  outliers: number[];
  lowerBound: number;
  upperBound: number;
} => {
  if (values.length < 4) return { outliers: [], lowerBound: 0, upperBound: 0 };
  
  const q1 = percentile(values, 25);
  const q3 = percentile(values, 75);
  const iqr = q3 - q1;
  
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  
  const outliers = values.filter(v => v < lowerBound || v > upperBound);
  
  return { outliers, lowerBound, upperBound };
};

/**
 * Growth rate calculation
 */
export const growthRate = (previous: number, current: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};
```

---

## 📊 Complete Chart Examples Index

### Ready-to-Use Components

| Chart Name | Type | Purpose | Tab | Priority |
|-----------|------|---------|-----|----------|
| PartyComparisonChart | Bar (Horizontal) | Compare parties | Election | High |
| CandidateDistributionChart | Donut | Candidate breakdown | Election | High |
| CommitteePerformanceChart | Bar (Grouped) | Compare committees | Election | High |
| CommitteeHeatmap | Heatmap | Visual overview | Election/Attendance | High |
| GuaranteesTrendChart | Area (Stacked) | Trend over time | Guarantees | High |
| GuaranteesFunnelChart | Funnel | Conversion process | Guarantees | Medium |
| GroupPerformanceChart | Bar (Stacked) | Group comparison | Guarantees | Medium |
| MemberLeaderboard | Table + Bars | Top performers | Guarantees | Medium |
| AttendanceTimelineChart | Line | Real-time tracking | Attendance | Critical |
| HourlyAttendanceChart | Column | Hourly breakdown | Attendance | High |
| VotingConversionFunnel | Funnel | Attend → Vote | Attendance | High |
| GenderDistributionChart | Pie | Male vs Female | Electors | Medium |
| FamilyStructureChart | Tree Map | Family sizes | Electors | Low |
| SectionHeatmap | Heatmap | Geographic | Electors | Medium |
| CorrelationMatrix | Heatmap | Variable relationships | Electors | Low |

---

## 🚀 Quick Implementation Steps

### Step 1: Create Chart Defaults (30 min)

```typescript
// File: src/utils/charts/chartDefaults.ts

import { ApexOptions } from 'apexcharts';
import { Theme } from '@mui/material/styles';

export const getBaseChartOptions = (theme: Theme): ApexOptions => ({
  chart: {
    fontFamily: theme.typography.fontFamily,
    foreColor: theme.palette.text.secondary,
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: false,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true
      }
    }
  },
  grid: {
    borderColor: theme.palette.divider,
    strokeDashArray: 4
  },
  tooltip: {
    theme: theme.palette.mode
  },
  legend: {
    labels: {
      colors: theme.palette.text.primary
    }
  }
});
```

### Step 2: Copy Chart Template (15 min each)

1. Copy one of the chart examples above
2. Customize for your data
3. Import into DashboardView
4. Place in appropriate tab
5. Test with real data

### Step 3: Test & Iterate (1 hour)

1. Test with empty data
2. Test with small dataset
3. Test with large dataset
4. Test on mobile
5. Test dark/light mode
6. Fix any issues
7. Polish animations

---

## 🎯 Success Metrics

### After Implementing Charts

**User Feedback:**
- "I can see trends easily now" ✅
- "The heatmap helps identify issues quickly" ✅
- "Real-time chart is exciting to watch" ✅

**Usage Metrics:**
- Chart interaction rate: > 60%
- Export usage: > 30% of sessions
- Time to find info: Reduced by 50%

**Performance:**
- Chart render time: < 1 second
- Page load with charts: < 3 seconds
- No lag on interactions

---

## 📚 Resources

### Documentation
- **ApexCharts Docs**: https://apexcharts.com/docs/
- **Chart Examples**: https://apexcharts.com/react-chart-demos/
- **MUI Charts Guide**: Material-UI integration patterns

### Tools
- **Chart Builder**: Use ApexCharts online editor to prototype
- **Color Picker**: Use Material-UI theme colors
- **Data Generator**: Create realistic mock data for testing

### Support
- **ApexCharts Forum**: Community support
- **Stack Overflow**: Tagged questions
- **GitHub Issues**: Report bugs

---

## ✅ Final Checklist

Before considering charts complete:

**Functionality:**
- [ ] Chart renders correctly
- [ ] Data updates properly
- [ ] Tooltips show correct info
- [ ] Legend accurate
- [ ] Colors match theme
- [ ] Responsive on mobile

**Polish:**
- [ ] Smooth animations
- [ ] Loading state
- [ ] Empty state
- [ ] Error state
- [ ] Export works
- [ ] Dark mode looks good

**Performance:**
- [ ] Renders fast (< 1s)
- [ ] No memory leaks
- [ ] Handles large datasets
- [ ] Optimized re-renders

**Accessibility:**
- [ ] Keyboard navigable
- [ ] ARIA labels present
- [ ] Color contrast passes
- [ ] Screen reader friendly

---

**Ready to Start?** → Pick one chart and implement it today!

**Questions?** → Check ApexCharts docs or the complete guide.

**Stuck?** → The examples above are ready to copy and customize!

**Good Luck!** 🎨📊

