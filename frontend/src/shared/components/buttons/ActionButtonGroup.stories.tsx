import type { Meta, StoryObj } from '@storybook/react';
import ActionButtonGroup from './ActionButtonGroup';
import { IconEdit, IconTrash, IconEye, IconDownload, IconShare, IconMore } from '@tabler/icons-react';

const meta: Meta<typeof ActionButtonGroup> = {
  title: 'Shared/Buttons/ActionButtonGroup',
  component: ActionButtonGroup,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the button group.'
    },
    spacing: {
      control: 'number',
      description: 'Spacing between buttons.'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the buttons.'
    },
    variant: {
      control: 'select',
      options: ['default', 'grouped', 'separated'],
      description: 'Visual style of the button group.'
    },
    maxVisible: {
      control: 'number',
      description: 'Maximum number of visible buttons before showing "More" button.'
    },
    showMoreLabel: {
      control: 'text',
      description: 'Label for the "More" button.'
    },
    onShowMore: {
      action: 'show more clicked',
      description: 'Callback when "More" button is clicked.'
    }
  },
  args: {
    orientation: 'horizontal',
    spacing: 1,
    size: 'medium',
    variant: 'default',
    showMoreLabel: 'More'
  }
};

export default meta;

type Story = StoryObj<typeof ActionButtonGroup>;

const defaultActions = [
  {
    label: 'View',
    icon: <IconEye size={16} />,
    color: 'primary' as const,
    variant: 'outlined' as const,
    tooltip: 'View details'
  },
  {
    label: 'Edit',
    icon: <IconEdit size={16} />,
    color: 'secondary' as const,
    variant: 'outlined' as const,
    tooltip: 'Edit item'
  },
  {
    label: 'Delete',
    icon: <IconTrash size={16} />,
    color: 'error' as const,
    variant: 'outlined' as const,
    tooltip: 'Delete item'
  }
];

export const Default: Story = {
  args: {
    actions: defaultActions
  }
};

export const Grouped: Story = {
  args: {
    actions: defaultActions,
    variant: 'grouped'
  }
};

export const Separated: Story = {
  args: {
    actions: defaultActions,
    variant: 'separated',
    spacing: 2
  }
};

export const Vertical: Story = {
  args: {
    actions: defaultActions,
    orientation: 'vertical',
    spacing: 1
  }
};

export const WithMoreButton: Story = {
  args: {
    actions: [
      ...defaultActions,
      {
        label: 'Download',
        icon: <IconDownload size={16} />,
        color: 'info' as const,
        variant: 'outlined' as const,
        tooltip: 'Download file'
      },
      {
        label: 'Share',
        icon: <IconShare size={16} />,
        color: 'success' as const,
        variant: 'outlined' as const,
        tooltip: 'Share item'
      }
    ],
    maxVisible: 3,
  }
};

export const DifferentSizes: Story = {
  args: {
    actions: defaultActions,
    size: 'small'
  }
};

export const LargeSize: Story = {
  args: {
    actions: defaultActions,
    size: 'large'
  }
};

export const WithLoading: Story = {
  args: {
    actions: [
      {
        label: 'Save',
        icon: <IconEdit size={16} />,
        color: 'primary' as const,
        variant: 'contained' as const,
        loading: true
      },
      {
        label: 'Cancel',
        icon: <IconTrash size={16} />,
        color: 'secondary' as const,
        variant: 'outlined' as const
      }
    ]
  }
};

export const WithDisabled: Story = {
  args: {
    actions: [
      {
        label: 'Enabled',
        icon: <IconEye size={16} />,
        color: 'primary' as const,
        variant: 'contained' as const
      },
      {
        label: 'Disabled',
        icon: <IconEdit size={16} />,
        color: 'secondary' as const,
        variant: 'outlined' as const,
        disabled: true
      }
    ]
  }
};

export const MixedVariants: Story = {
  args: {
    actions: [
      {
        label: 'Primary',
        icon: <IconEye size={16} />,
        color: 'primary' as const,
        variant: 'contained' as const
      },
      {
        label: 'Secondary',
        icon: <IconEdit size={16} />,
        color: 'secondary' as const,
        variant: 'outlined' as const
      },
      {
        label: 'Text',
        icon: <IconTrash size={16} />,
        color: 'error' as const,
        variant: 'text' as const
      }
    ]
  }
};
