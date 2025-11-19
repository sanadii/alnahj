import type { Meta, StoryObj } from '@storybook/react';
import DatePicker from './DatePicker';
import { Box, Stack } from '@mui/material';

const meta: Meta<typeof DatePicker> = {
  title: 'Shared/Forms/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the date picker.'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text.'
    },
    value: {
      control: 'date',
      description: 'The selected date value.'
    },
    error: {
      control: 'boolean',
      description: 'Whether the field has an error.'
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below the field.'
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required.'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled.'
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the field is read-only.'
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Size of the field.'
    },
    variant: {
      control: 'select',
      options: ['outlined', 'filled', 'standard'],
      description: 'Visual style variant.'
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the field takes full width.'
    },
    format: {
      control: 'text',
      description: 'Date format string.'
    },
    disablePast: {
      control: 'boolean',
      description: 'Whether to disable past dates.'
    },
    disableFuture: {
      control: 'boolean',
      description: 'Whether to disable future dates.'
    },
    clearable: {
      control: 'boolean',
      description: 'Whether to show clear button.'
    },
    onChange: {
      action: 'date changed',
      description: 'Callback when the date changes.'
    },
    onFocus: {
      action: 'focused',
      description: 'Callback when the field is focused.'
    },
    onBlur: {
      action: 'blurred',
      description: 'Callback when the field loses focus.'
    }
  },
  args: {
    label: 'Select Date',
    placeholder: 'Choose a date...',
    size: 'medium',
    variant: 'outlined',
    fullWidth: true,
    format: 'MM/dd/yyyy',
    clearable: true
  }
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: {
    label: 'Date',
    placeholder: 'Select a date...'
  }
};

export const WithValue: Story = {
  args: {
    label: 'Birth Date',
    value: new Date('1990-01-15')
  }
};

export const Required: Story = {
  args: {
    label: 'Appointment Date',
    placeholder: 'Select appointment date',
    required: true
  }
};

export const WithError: Story = {
  args: {
    label: 'Due Date',
    placeholder: 'Select due date',
    error: true,
    helperText: 'Please select a valid date'
  }
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Date',
    value: new Date(),
    disabled: true
  }
};

export const ReadOnly: Story = {
  args: {
    label: 'Read Only Date',
    value: new Date(),
    readOnly: true
  }
};

export const SmallSize: Story = {
  args: {
    label: 'Small Date Picker',
    size: 'small'
  }
};

export const FilledVariant: Story = {
  args: {
    label: 'Filled Date Picker',
    variant: 'filled'
  }
};

export const StandardVariant: Story = {
  args: {
    label: 'Standard Date Picker',
    variant: 'standard'
  }
};

export const DisablePast: Story = {
  args: {
    label: 'Future Date Only',
    placeholder: 'Select a future date',
    disablePast: true
  }
};

export const DisableFuture: Story = {
  args: {
    label: 'Past Date Only',
    placeholder: 'Select a past date',
    disableFuture: true
  }
};

export const CustomFormat: Story = {
  args: {
    label: 'Custom Format',
    placeholder: 'dd/MM/yyyy',
    format: 'dd/MM/yyyy'
  }
};

export const NotClearable: Story = {
  args: {
    label: 'No Clear Button',
    value: new Date(),
    clearable: false
  }
};

export const WithMinMaxDate: Story = {
  args: {
    label: 'Date Range',
    placeholder: 'Select date within range',
    minDate: new Date('2024-01-01'),
    maxDate: new Date('2024-12-31')
  }
};

export const FormExample: Story = {
  render: () => (
    <Box sx={{ maxWidth: 400, p: 2 }}>
      <Stack spacing={3}>
        <DatePicker label="Start Date" placeholder="Select start date" required />
        <DatePicker label="End Date" placeholder="Select end date" disablePast />
        <DatePicker label="Birth Date" placeholder="Select birth date" disableFuture format="dd/MM/yyyy" />
      </Stack>
    </Box>
  )
};
