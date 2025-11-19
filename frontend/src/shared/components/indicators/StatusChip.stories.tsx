import type { Meta, StoryObj } from '@storybook/react';
import StatusChip from './StatusChip';
import { IconCheck, IconX, IconClock, IconAlertTriangle } from '@tabler/icons-react';

const meta: Meta<typeof StatusChip> = {
  title: 'Shared/Indicators/StatusChip',
  component: StatusChip,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: [
        'active',
        'inactive',
        'pending',
        'completed',
        'failed',
        'warning',
        'info',
        'success',
        'error',
        'draft',
        'published',
        'archived',
        'cancelled',
        'processing',
        'approved',
        'rejected'
      ],
      description: 'The status type that determines the color and default label.'
    },
    label: {
      control: 'text',
      description: 'Custom label text. If not provided, uses the default label for the status.'
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Size of the chip.'
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'soft'],
      description: 'Visual style variant of the chip.'
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether to show the default icon for the status.'
    },
    icon: {
      control: 'none',
      description: 'Custom icon to display in the chip.'
    },
    onClick: {
      action: 'chip clicked',
      description: 'Callback when the chip is clicked.'
    },
    onDelete: {
      action: 'delete clicked',
      description: 'Callback when the delete button is clicked.'
    }
  },
  args: {
    status: 'active',
    size: 'small',
    variant: 'filled',
    showIcon: false
  }
};

export default meta;

type Story = StoryObj<typeof StatusChip>;

export const Default: Story = {
  args: {
    status: 'active'
  }
};

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      <StatusChip status="active" />
      <StatusChip status="inactive" />
      <StatusChip status="pending" />
      <StatusChip status="completed" />
      <StatusChip status="failed" />
      <StatusChip status="warning" />
      <StatusChip status="info" />
      <StatusChip status="success" />
      <StatusChip status="error" />
      <StatusChip status="draft" />
      <StatusChip status="published" />
      <StatusChip status="archived" />
      <StatusChip status="cancelled" />
      <StatusChip status="processing" />
      <StatusChip status="approved" />
      <StatusChip status="rejected" />
    </div>
  )
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      <StatusChip status="active" showIcon />
      <StatusChip status="pending" showIcon />
      <StatusChip status="completed" showIcon />
      <StatusChip status="failed" showIcon />
      <StatusChip status="processing" showIcon />
    </div>
  )
};

export const Outlined: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      <StatusChip status="active" variant="outlined" />
      <StatusChip status="pending" variant="outlined" />
      <StatusChip status="completed" variant="outlined" />
      <StatusChip status="failed" variant="outlined" />
      <StatusChip status="warning" variant="outlined" />
    </div>
  )
};

export const Soft: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      <StatusChip status="active" variant="soft" />
      <StatusChip status="pending" variant="soft" />
      <StatusChip status="completed" variant="soft" />
      <StatusChip status="failed" variant="soft" />
      <StatusChip status="info" variant="soft" />
    </div>
  )
};

export const MediumSize: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      <StatusChip status="active" size="medium" />
      <StatusChip status="pending" size="medium" />
      <StatusChip status="completed" size="medium" />
      <StatusChip status="failed" size="medium" />
    </div>
  )
};

export const WithCustomIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      <StatusChip status="active" icon={<IconCheck size={14} />} label="Custom Active" />
      <StatusChip status="pending" icon={<IconClock size={14} />} label="Custom Pending" />
      <StatusChip status="failed" icon={<IconX size={14} />} label="Custom Failed" />
      <StatusChip status="warning" icon={<IconAlertTriangle size={14} />} label="Custom Warning" />
    </div>
  )
};

export const Clickable: Story = {
  args: {
    status: 'active',
  }
};

export const Deletable: Story = {
  args: {
    status: 'draft',
  }
};

export const CustomLabel: Story = {
  args: {
    status: 'active',
    label: 'Online',
    showIcon: true
  }
};

export const Processing: Story = {
  args: {
    status: 'processing',
    showIcon: true
  }
};

export const Approved: Story = {
  args: {
    status: 'approved',
    variant: 'soft',
    showIcon: true
  }
};
