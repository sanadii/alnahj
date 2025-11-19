import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Grid } from '@mui/material';
import {
  IconTrendingUp,
  IconUsers,
  IconCurrencyDollar,
  IconShoppingCart,
  IconPackage,
  IconCalendar,
  IconHeart,
  IconStar,
  IconAlertCircle,
  IconCheck
} from '@tabler/icons-react';
import { MetricCard } from '../index';

const meta: Meta<typeof MetricCard> = {
  title: 'Components/Cards/MetricCard',
  component: MetricCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A reusable metric display component with premium design featuring large value display, trend indicators, and action buttons.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: { type: 'select' },
      options: ['primary', 'success', 'warning', 'error', 'info', 'neutral'],
      description: 'The color theme of the metric card'
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Whether the card is in loading state'
    },
    hover: {
      control: { type: 'boolean' },
      description: 'Whether the card should have hover effects'
    },
    onClick: {
      action: 'clicked',
      description: 'Callback fired when the card is clicked'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic metric
export const Default: Story = {
  args: {
    title: 'Total Sales',
    value: '$12,450',
    subtitle: 'This month',
    icon: <IconTrendingUp size={20} />
  }
};

// Colored metrics
export const Primary: Story = {
  args: {
    title: 'Active Users',
    value: '1,234',
    subtitle: 'Online now',
    icon: <IconUsers size={20} />,
    color: 'primary'
  }
};

export const Success: Story = {
  args: {
    title: 'Revenue',
    value: '$45,678',
    subtitle: 'This quarter',
    icon: <IconCurrencyDollar size={20} />,
    color: 'success'
  }
};

export const Warning: Story = {
  args: {
    title: 'Pending Orders',
    value: '23',
    subtitle: 'Awaiting processing',
    icon: <IconShoppingCart size={20} />,
    color: 'warning'
  }
};

export const Error: Story = {
  args: {
    title: 'Failed Payments',
    value: '5',
    subtitle: 'Require attention',
    icon: <IconAlertCircle size={20} />,
    color: 'error'
  }
};

export const Info: Story = {
  args: {
    title: 'New Customers',
    value: '89',
    subtitle: 'This week',
    icon: <IconUsers size={20} />,
    color: 'info'
  }
};

// Metric with trend
export const WithTrend: Story = {
  args: {
    title: 'Website Traffic',
    value: '12,456',
    subtitle: 'Unique visitors',
    icon: <IconTrendingUp size={20} />,
    color: 'primary',
    trend: {
      value: 12,
      direction: 'up',
      label: 'vs last month'
    }
  }
};

export const WithDownTrend: Story = {
  args: {
    title: 'Bounce Rate',
    value: '45%',
    subtitle: 'Page bounce rate',
    icon: <IconTrendingUp size={20} />,
    color: 'warning',
    trend: {
      value: 8,
      direction: 'down',
      label: 'vs last month'
    }
  }
};

export const WithNeutralTrend: Story = {
  args: {
    title: 'Conversion Rate',
    value: '3.2%',
    subtitle: 'Overall conversion',
    icon: <IconCheck size={20} />,
    color: 'info',
    trend: {
      value: 0,
      direction: 'neutral',
      label: 'vs last month'
    }
  }
};

// Metric with action
export const WithAction: Story = {
  args: {
    title: 'Products',
    value: '156',
    subtitle: 'Total products',
    icon: <IconPackage size={20} />,
    color: 'primary',
    action: {
      label: 'View All',
      onClick: () => alert('View all products')
    }
  }
};

// Complete metric with all features
export const Complete: Story = {
  args: {
    title: 'Monthly Revenue',
    value: '$89,456',
    subtitle: 'Total revenue this month',
    icon: <IconCurrencyDollar size={20} />,
    color: 'success',
    trend: {
      value: 15,
      direction: 'up',
      label: 'vs last month'
    },
    action: {
      label: 'View Details',
      onClick: () => alert('View revenue details')
    }
  }
};

// Clickable metric
export const Clickable: Story = {
  args: {
    title: 'Orders',
    value: '234',
    subtitle: 'Total orders',
    icon: <IconShoppingCart size={20} />,
    color: 'primary',
    onClick: () => alert('Navigate to orders')
  }
};

// Loading state
export const Loading: Story = {
  args: {
    title: 'Loading Metric',
    value: 'Loading...',
    subtitle: 'Please wait',
    icon: <IconCalendar size={20} />,
    color: 'primary',
    loading: true
  }
};

// No hover effect
export const NoHover: Story = {
  args: {
    title: 'Static Metric',
    value: '999',
    subtitle: 'No hover effects',
    icon: <IconStar size={20} />,
    color: 'info',
    hover: false
  }
};

// Large numbers
export const LargeNumbers: Story = {
  args: {
    title: 'Total Customers',
    value: '1,234,567',
    subtitle: 'All time customers',
    icon: <IconUsers size={20} />,
    color: 'success',
    trend: {
      value: 25,
      direction: 'up',
      label: 'vs last year'
    }
  }
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <Grid container spacing={3} sx={{ maxWidth: 1000 }}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Total Sales"
          value="$12,450"
          subtitle="This month"
          icon={<IconTrendingUp size={20} />}
          color="success"
          trend={{ value: 12, direction: 'up', label: 'vs last month' }}
          action={{ label: 'View', onClick: () => {} }}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Active Users"
          value="1,234"
          subtitle="Online now"
          icon={<IconUsers size={20} />}
          color="primary"
          trend={{ value: 8, direction: 'down', label: 'vs last week' }}
          action={{ label: 'Manage', onClick: () => {} }}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Orders"
          value="89"
          subtitle="Pending orders"
          icon={<IconShoppingCart size={20} />}
          color="warning"
          trend={{ value: 5, direction: 'up', label: 'vs yesterday' }}
          action={{ label: 'Process', onClick: () => {} }}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Products"
          value="156"
          subtitle="Total products"
          icon={<IconPackage size={20} />}
          color="info"
          trend={{ value: 0, direction: 'neutral', label: 'vs last month' }}
          action={{ label: 'Add', onClick: () => {} }}
        />
      </Grid>
    </Grid>
  )
};

// Dashboard layout example
export const DashboardLayout: Story = {
  render: () => (
    <Stack spacing={3} sx={{ maxWidth: 1200 }}>
      <MetricCard
        title="Monthly Revenue"
        value="$89,456"
        subtitle="Total revenue this month"
        icon={<IconCurrencyDollar size={24} />}
        color="success"
        trend={{ value: 15, direction: 'up', label: 'vs last month' }}
        action={{ label: 'View Report', onClick: () => {} }}
        sx={{ minHeight: 120 }}
      />

      <Stack direction="row" spacing={3}>
        <MetricCard
          title="New Customers"
          value="234"
          subtitle="This month"
          icon={<IconUsers size={20} />}
          color="primary"
          trend={{ value: 12, direction: 'up', label: 'vs last month' }}
          action={{ label: 'View', onClick: () => {} }}
        />

        <MetricCard
          title="Orders"
          value="1,456"
          subtitle="Total orders"
          icon={<IconShoppingCart size={20} />}
          color="info"
          trend={{ value: 8, direction: 'up', label: 'vs last month' }}
          action={{ label: 'Manage', onClick: () => {} }}
        />

        <MetricCard
          title="Products"
          value="89"
          subtitle="Active products"
          icon={<IconPackage size={20} />}
          color="warning"
          trend={{ value: 3, direction: 'down', label: 'vs last month' }}
          action={{ label: 'Edit', onClick: () => {} }}
        />
      </Stack>
    </Stack>
  )
};
