import type { Meta, StoryObj } from '@storybook/react';
import { Button, Stack } from '@mui/material';
import {
  IconUser,
  IconPackage,
  IconTrendingUp,
  IconUsers,
  IconSettings,
  IconPlus,
  IconEdit,
  IconTrash,
  IconDownload,
  IconPrinter
} from '@tabler/icons-react';
import { PremiumHeader } from '../index';

const meta: Meta<typeof PremiumHeader> = {
  title: 'Components/Headers/PremiumHeader',
  component: PremiumHeader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A reusable header component with premium gradient design featuring icons, actions, and theme-aware colors.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: { type: 'select' },
      options: ['primary', 'success', 'warning', 'error', 'info', 'neutral'],
      description: 'The color theme of the header'
    },
    padding: {
      control: { type: 'number' },
      description: 'The padding inside the header'
    },
    borderRadius: {
      control: { type: 'number' },
      description: 'The border radius of the header'
    },
    onAction: {
      action: 'action clicked',
      description: 'Callback fired when an action is clicked'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic header
export const Default: Story = {
  args: {
    title: 'Section Title'
  }
};

// Header with subtitle
export const WithSubtitle: Story = {
  args: {
    title: 'Dashboard Overview',
    subtitle: 'Monitor your key metrics and performance'
  }
};

// Header with icon
export const WithIcon: Story = {
  args: {
    title: 'User Management',
    subtitle: 'Manage user accounts and permissions',
    icon: <IconUser size={18} />
  }
};

// Colored headers
export const Primary: Story = {
  args: {
    title: 'Primary Header',
    subtitle: 'This header uses the primary color theme',
    icon: <IconTrendingUp size={18} />,
    color: 'primary'
  }
};

export const Success: Story = {
  args: {
    title: 'Success Header',
    subtitle: 'This header uses the success color theme',
    icon: <IconUsers size={18} />,
    color: 'success'
  }
};

export const Warning: Story = {
  args: {
    title: 'Warning Header',
    subtitle: 'This header uses the warning color theme',
    icon: <IconSettings size={18} />,
    color: 'warning'
  }
};

export const Error: Story = {
  args: {
    title: 'Error Header',
    subtitle: 'This header uses the error color theme',
    icon: <IconTrash size={18} />,
    color: 'error'
  }
};

export const Info: Story = {
  args: {
    title: 'Info Header',
    subtitle: 'This header uses the info color theme',
    icon: <IconPackage size={18} />,
    color: 'info'
  }
};

// Header with single action
export const WithSingleAction: Story = {
  args: {
    title: 'Products',
    subtitle: 'Manage your product inventory',
    icon: <IconPackage size={18} />,
    color: 'primary',
    actions: (
      <Button variant="contained" startIcon={<IconPlus size={16} />}>
        Add Product
      </Button>
    )
  }
};

// Header with multiple actions
export const WithMultipleActions: Story = {
  args: {
    title: 'Client Details',
    subtitle: 'View and manage client information',
    icon: <IconUser size={18} />,
    color: 'primary',
    actions: (
      <Stack direction="row" spacing={1}>
        <Button size="small" variant="outlined" startIcon={<IconEdit size={16} />}>
          Edit
        </Button>
        <Button size="small" variant="outlined" startIcon={<IconPrinter size={16} />}>
          Print
        </Button>
        <Button size="small" variant="contained" startIcon={<IconPlus size={16} />}>
          Add
        </Button>
      </Stack>
    )
  }
};

// Header with text action
export const WithTextAction: Story = {
  args: {
    title: 'Reports',
    subtitle: 'View and download reports',
    icon: <IconTrendingUp size={18} />,
    color: 'info',
    actions: 'Last updated: 2 hours ago'
  }
};

// Complex header with all features
export const Complete: Story = {
  args: {
    title: 'Marketing Campaigns',
    subtitle: 'Create and manage your marketing campaigns',
    icon: <IconTrendingUp size={18} />,
    color: 'success',
    actions: (
      <Stack direction="row" spacing={1}>
        <Button size="small" variant="outlined" startIcon={<IconDownload size={16} />}>
          Export
        </Button>
        <Button size="small" variant="outlined" startIcon={<IconPrinter size={16} />}>
          Print
        </Button>
        <Button size="small" variant="contained" startIcon={<IconPlus size={16} />}>
          Create Campaign
        </Button>
      </Stack>
    )
  }
};

// Custom styling
export const CustomStyling: Story = {
  args: {
    title: 'Custom Styled Header',
    subtitle: 'This header has custom padding and border radius',
    icon: <IconSettings size={18} />,
    color: 'primary',
    padding: 4,
    borderRadius: 4,
    sx: {
      minHeight: 80
    }
  }
};

// All color variants showcase
export const AllColors: Story = {
  render: () => (
    <Stack spacing={3} sx={{ maxWidth: 800 }}>
      <PremiumHeader
        title="Primary Header"
        subtitle="Primary color theme"
        icon={<IconUser size={18} />}
        color="primary"
        actions={
          <Button size="small" variant="contained">
            Action
          </Button>
        }
      />

      <PremiumHeader
        title="Success Header"
        subtitle="Success color theme"
        icon={<IconUsers size={18} />}
        color="success"
        actions={
          <Button size="small" variant="contained">
            Action
          </Button>
        }
      />

      <PremiumHeader
        title="Warning Header"
        subtitle="Warning color theme"
        icon={<IconSettings size={18} />}
        color="warning"
        actions={
          <Button size="small" variant="contained">
            Action
          </Button>
        }
      />

      <PremiumHeader
        title="Error Header"
        subtitle="Error color theme"
        icon={<IconTrash size={18} />}
        color="error"
        actions={
          <Button size="small" variant="contained">
            Action
          </Button>
        }
      />

      <PremiumHeader
        title="Info Header"
        subtitle="Info color theme"
        icon={<IconPackage size={18} />}
        color="info"
        actions={
          <Button size="small" variant="contained">
            Action
          </Button>
        }
      />
    </Stack>
  )
};
