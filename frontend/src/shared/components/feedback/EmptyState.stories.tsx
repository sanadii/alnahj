import type { Meta, StoryObj } from '@storybook/react-vite';
import EmptyState from './EmptyState';
import { IconInbox, IconSearch, IconUsers, IconFile } from '@tabler/icons-react';

const meta: Meta<typeof EmptyState> = {
  title: 'Shared/Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'none', description: 'Icon to display' },
    title: { control: 'text', description: 'Main title text' },
    description: { control: 'text', description: 'Optional description text' },
    action: { control: 'object', description: 'Optional action button configuration' },
    size: { control: 'select', options: ['small', 'medium', 'large'], description: 'Size variant' }
  },
  args: {
    title: 'No data found',
    description: 'There are no items to display at the moment.',
    size: 'medium'
  }
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: 'No data found',
    description: 'There are no items to display at the moment.'
  }
};

export const WithIcon: Story = {
  args: {
    icon: <IconInbox size={64} />,
    title: 'No messages',
    description: "You don't have any messages yet."
  }
};

export const WithAction: Story = {
  args: {
    icon: <IconUsers size={64} />,
    title: 'No users found',
    description: 'Get started by adding your first user to the system.',
    action: {
      label: 'Add User',
      variant: 'contained'
    }
  }
};

export const Small: Story = {
  args: {
    icon: <IconFile size={48} />,
    title: 'No files',
    size: 'small'
  }
};

export const Large: Story = {
  args: {
    icon: <IconSearch size={96} />,
    title: 'No search results',
    description: "Try adjusting your search criteria or browse our categories to find what you're looking for.",
    action: {
      label: 'Browse Categories',
      variant: 'outlined'
    },
    size: 'large'
  }
};

export const WithoutDescription: Story = {
  args: {
    icon: <IconInbox size={64} />,
    title: 'Empty inbox'
  }
};

export const CustomAction: Story = {
  args: {
    icon: <IconUsers size={64} />,
    title: 'No team members',
    description: 'Invite team members to collaborate on this project.',
    action: {
      label: 'Invite Members',
      variant: 'contained',
      color: 'secondary'
    }
  }
};

export const SizeVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3>Small</h3>
        <EmptyState icon={<IconInbox size={48} />} title="Small empty state" description="This is a small variant." size="small" />
      </div>
      <div>
        <h3>Medium</h3>
        <EmptyState
          icon={<IconInbox size={64} />}
          title="Medium empty state"
          description="This is a medium variant (default)."
          size="medium"
        />
      </div>
      <div>
        <h3>Large</h3>
        <EmptyState
          icon={<IconInbox size={96} />}
          title="Large empty state"
          description="This is a large variant with more prominent styling."
          size="large"
        />
      </div>
    </div>
  )
};
