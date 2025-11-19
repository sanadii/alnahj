import type { Meta, StoryObj } from '@storybook/react-vite';
import FloatingActionButton from './FloatingActionButton';
import { IconPlus, IconEdit, IconTrash, IconDownload } from '@tabler/icons-react';

const meta: Meta<typeof FloatingActionButton> = {
  title: 'Shared/Buttons/FloatingActionButton',
  component: FloatingActionButton,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'none', description: 'Icon to display in the button' },
    onClick: { action: 'clicked', description: 'Callback when button is clicked' },
    color: { control: 'select', options: ['primary', 'secondary'], description: 'Color scheme' },
    position: { control: 'select', options: ['bottom-right', 'bottom-left', 'top-right', 'top-left'], description: 'Position on screen' },
    tooltip: { control: 'text', description: 'Tooltip text to display on hover' },
    disabled: { control: 'boolean', description: 'Disable the button' }
  },
  args: {
    icon: <IconPlus />,
    color: 'primary',
    position: 'bottom-right',
    tooltip: 'Add new item',
    disabled: false
  },
  decorators: [
    (Story) => (
      <div style={{ height: '400px', position: 'relative', border: '1px dashed #ccc', margin: '20px' }}>
        <p style={{ padding: '20px', textAlign: 'center' }}>Container for FAB positioning demo</p>
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof FloatingActionButton>;

export const Default: Story = {
  args: {
    icon: <IconPlus />,
    tooltip: 'Add new item'
  }
};

export const WithTooltip: Story = {
  args: {
    icon: <IconPlus />,
    tooltip: 'Create new project'
  }
};

export const Secondary: Story = {
  args: {
    icon: <IconEdit />,
    color: 'secondary',
    tooltip: 'Edit item'
  }
};

export const DifferentPositions: Story = {
  render: () => (
    <>
      <FloatingActionButton
        icon={<IconDownload />}
        position="bottom-left"
        tooltip="Bottom Left"
        color="secondary"
      />
      <FloatingActionButton
        icon={<IconTrash />}
        position="bottom-right"
        tooltip="Bottom Right"
        color="secondary"
      />
    </>
  )
};

export const Disabled: Story = {
  args: {
    icon: <IconPlus />,
    disabled: true,
    tooltip: 'Button is disabled'
  }
};

export const CustomIcon: Story = {
  args: {
    icon: <IconDownload />,
    tooltip: 'Download file'
  }
};
