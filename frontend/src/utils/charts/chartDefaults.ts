/**
 * Chart Defaults and Configuration
 * Reusable chart options for ApexCharts
 */

import { ApexOptions } from 'apexcharts';
import { Theme } from '@mui/material/styles';

/**
 * Get base chart options with theme support
 */
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
    },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800
    }
  },
  grid: {
    borderColor: theme.palette.divider,
    strokeDashArray: 4,
    padding: {
      top: 0,
      right: 10,
      bottom: 0,
      left: 10
    }
  },
  tooltip: {
    theme: theme.palette.mode,
    style: {
      fontSize: '14px'
    }
  },
  legend: {
    position: 'bottom',
    fontSize: '14px',
    fontWeight: 600,
    labels: {
      colors: theme.palette.text.primary
    },
    markers: {
      width: 12,
      height: 12,
      radius: 3
    }
  },
  dataLabels: {
    enabled: false,
    style: {
      fontSize: '12px',
      fontWeight: 600
    }
  }
});

/**
 * Bar chart specific options
 */
export const getBarChartOptions = (theme: Theme): ApexOptions => ({
  ...getBaseChartOptions(theme),
  plotOptions: {
    bar: {
      borderRadius: 8,
      dataLabels: {
        position: 'top'
      },
      columnWidth: '50%'
    }
  }
});

/**
 * Line chart specific options
 */
export const getLineChartOptions = (theme: Theme): ApexOptions => ({
  ...getBaseChartOptions(theme),
  stroke: {
    curve: 'smooth',
    width: 3
  },
  markers: {
    size: 0,
    hover: {
      size: 6
    }
  }
});

/**
 * Area chart specific options
 */
export const getAreaChartOptions = (theme: Theme): ApexOptions => ({
  ...getBaseChartOptions(theme),
  stroke: {
    curve: 'smooth',
    width: 2
  },
  fill: {
    type: 'gradient',
    gradient: {
      opacityFrom: 0.6,
      opacityTo: 0.1,
      stops: [0, 90, 100]
    }
  }
});

/**
 * Pie/Donut chart specific options
 */
export const getPieChartOptions = (theme: Theme): ApexOptions => ({
  ...getBaseChartOptions(theme),
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val.toFixed(1)}%`
  },
  legend: {
    position: 'bottom',
    labels: {
      colors: theme.palette.text.primary
    }
  }
});

/**
 * Heatmap specific options
 */
export const getHeatmapOptions = (theme: Theme): ApexOptions => ({
  ...getBaseChartOptions(theme),
  plotOptions: {
    heatmap: {
      enableShades: true,
      shadeIntensity: 0.5,
      radius: 8,
      colorScale: {
        ranges: [
          {
            from: 0,
            to: 40,
            color: theme.palette.error.main,
            name: 'Low'
          },
          {
            from: 41,
            to: 70,
            color: theme.palette.warning.main,
            name: 'Medium'
          },
          {
            from: 71,
            to: 100,
            color: theme.palette.success.main,
            name: 'High'
          }
        ]
      }
    }
  },
  dataLabels: {
    enabled: true,
    style: {
      colors: ['#fff']
    }
  }
});

/**
 * Radial bar (gauge) specific options
 */
export const getRadialBarOptions = (theme: Theme): ApexOptions => ({
  ...getBaseChartOptions(theme),
  plotOptions: {
    radialBar: {
      hollow: {
        size: '70%'
      },
      dataLabels: {
        show: true,
        name: {
          show: true,
          fontSize: '16px',
          fontWeight: 600,
          color: theme.palette.text.primary
        },
        value: {
          show: true,
          fontSize: '32px',
          fontWeight: 700,
          color: theme.palette.text.primary,
          formatter: (val: number) => `${val}%`
        }
      }
    }
  }
});
