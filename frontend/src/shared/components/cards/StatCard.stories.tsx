/**
 * Storybook Stories for StatCard
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Grid, Box } from '@mui/material';
import StatCard, { StatCardGradients } from './StatCard';
import {
  IconUsers,
  IconCash,
  IconTrendingUp,
  IconShoppingCart,
  IconFlag,
  IconUserCheck,
  IconUsersGroup,
  IconChecks
} from '@tabler/icons-react';

const meta: Meta<typeof StatCard> = {
  title: 'Components/Cards/StatCard',
  component: StatCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A beautiful, compact card for displaying statistics with gradient backgrounds, trend indicators, and optional subtitles. Perfect for dashboards and analytics.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Main statistic value'
    },
    label: {
      control: 'text',
      description: 'Label describing the statistic'
    },
    gradient: {
      control: 'text',
      description: 'CSS gradient background'
    },
    subtitle: {
      control: 'text',
      description: 'Optional subtitle text'
    }
  }
};

export default meta;
type Story = StoryObj<typeof StatCard>;

/**
 * Default story - basic stat card
 */
export const Default: Story = {
  args: {
    icon: <IconUsers size={32} />,
    value: '1,234',
    label: 'Total Users',
    gradient: StatCardGradients.primary
  }
};

/**
 * With positive trend indicator
 */
export const WithTrendPositive: Story = {
  args: {
    icon: <IconCash size={32} />,
    value: '$45,678',
    label: 'Total Revenue',
    gradient: StatCardGradients.success,
    trend: { value: '+12%', isPositive: true },
    subtitle: 'vs last month'
  }
};

/**
 * With negative trend indicator
 */
export const WithTrendNegative: Story = {
  args: {
    icon: <IconShoppingCart size={32} />,
    value: '892',
    label: 'Total Orders',
    gradient: StatCardGradients.info,
    trend: { value: '-5%', isPositive: false },
    subtitle: 'vs last month'
  }
};

/**
 * Clickable card with hover effect
 */
export const Clickable: Story = {
  args: {
    icon: <IconTrendingUp size={32} />,
    value: '2,456',
    label: 'Active Sessions',
    gradient: StatCardGradients.warning,
    onClick: () => alert('Card clicked!')
  }
};

/**
 * Election statistics example
 */
export const ElectionStats: Story = {
  render: () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          icon={<IconFlag size={32} />}
          value="5"
          label="Political Parties"
          gradient={StatCardGradients.purple}
          subtitle="12 total candidates"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          icon={<IconUserCheck size={32} />}
          value="12"
          label="Candidates"
          gradient={StatCardGradients.pink}
          subtitle="Across all parties"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          icon={<IconUsersGroup size={32} />}
          value="8"
          label="Committees"
          gradient={StatCardGradients.blue}
          subtitle="4M / 3F / 1 Mixed"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          icon={<IconChecks size={32} />}
          value="Active"
          label="Election Status"
          gradient={StatCardGradients.green}
          subtitle="Date: Nov 5, 2025"
        />
      </Grid>
    </Grid>
  )
};

/**
 * All gradient presets showcase
 */
export const AllGradients: Story = {
  render: () => (
    <Grid container spacing={3}>
      {Object.entries(StatCardGradients).map(([name, gradient]) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={name}>
          <StatCard
            icon={<IconUsers size={28} />}
            value="1,234"
            label={`${name.charAt(0).toUpperCase()}${name.slice(1)} Theme`}
            gradient={gradient}
          />
        </Grid>
      ))}
    </Grid>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Showcase of all available gradient presets. Use StatCardGradients.{name} to access these gradients.'
      }
    }
  }
};

/**
 * With long values and text
 */
export const LongContent: Story = {
  args: {
    icon: <IconUsers size={32} />,
    value: '1,234,567',
    label: 'Total Registered Voters in Election',
    gradient: StatCardGradients.indigo,
    subtitle: 'Across all 50 committees nationwide'
  }
};

/**
 * Minimal - without trend or subtitle
 */
export const Minimal: Story = {
  args: {
    icon: <IconCash size={32} />,
    value: '85%',
    label: 'Completion Rate',
    gradient: StatCardGradients.coral
  }
};

/**
 * Dashboard metrics row example
 */
export const DashboardMetrics: Story = {
  render: () => (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<IconUsers size={32} />}
            value="15,234"
            label="Total Electors"
            gradient={StatCardGradients.primary}
            trend={{ value: '+8%', isPositive: true }}
            subtitle="vs last election"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<IconChecks size={32} />}
            value="12,456"
            label="Votes Cast"
            gradient={StatCardGradients.success}
            trend={{ value: '+15%', isPositive: true }}
            subtitle="82% participation"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<IconUserCheck size={32} />}
            value="13,200"
            label="Attendance"
            gradient={StatCardGradients.info}
            trend={{ value: '+10%', isPositive: true }}
            subtitle="87% attendance"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<IconFlag size={32} />}
            value="5"
            label="Active Parties"
            gradient={StatCardGradients.warning}
            subtitle="12 candidates total"
          />
        </Grid>
      </Grid>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of using StatCard in a dashboard metrics row with various data and trends.'
      }
    }
  }
};
