import type { Meta, StoryObj } from '@storybook/react';
import FormField from './FormField';
import { IconMail, IconPhone, IconUser, IconLock, IconSearch } from '@tabler/icons-react';
import { Box, Stack } from '@mui/material';

const meta: Meta<typeof FormField> = {
  title: 'Shared/Forms/FormField',
  component: FormField,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the field.'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text.'
    },
    value: {
      control: 'text',
      description: 'The value of the input.'
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
    multiline: {
      control: 'boolean',
      description: 'Whether the field is multiline.'
    },
    rows: {
      control: 'number',
      description: 'Number of rows for multiline field.'
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'The type of input.'
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
    showPasswordToggle: {
      control: 'boolean',
      description: 'Whether to show password visibility toggle.'
    },
    onChange: {
      action: 'value changed',
      description: 'Callback when the value changes.'
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
    label: 'Field Label',
    placeholder: 'Enter text...',
    size: 'medium',
    variant: 'outlined',
    fullWidth: true
  }
};

export default meta;

type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  args: {
    label: 'Default Field',
    placeholder: 'Enter some text...'
  }
};

export const WithIcon: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    type: 'email',
    startAdornment: <IconMail size={20} />
  }
};

export const Password: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
    showPasswordToggle: true,
    startAdornment: <IconLock size={20} />
  }
};

export const Phone: Story = {
  args: {
    label: 'Phone Number',
    placeholder: '+1 (555) 123-4567',
    type: 'tel',
    startAdornment: <IconPhone size={20} />
  }
};

export const Search: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search...',
    type: 'search',
    startAdornment: <IconSearch size={20} />
  }
};

export const Multiline: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter a description...',
    multiline: true,
    rows: 4
  }
};

export const WithError: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    type: 'email',
    error: true,
    helperText: 'Please enter a valid email address',
    startAdornment: <IconMail size={20} />
  }
};

export const Required: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'Enter your full name',
    required: true,
    startAdornment: <IconUser size={20} />
  }
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    placeholder: 'This field is disabled',
    disabled: true,
    value: 'Disabled value'
  }
};

export const ReadOnly: Story = {
  args: {
    label: 'Read Only Field',
    value: 'This value cannot be changed',
    readOnly: true
  }
};

export const SmallSize: Story = {
  args: {
    label: 'Small Field',
    placeholder: 'Small size field',
    size: 'small'
  }
};

export const FilledVariant: Story = {
  args: {
    label: 'Filled Field',
    placeholder: 'Filled variant',
    variant: 'filled'
  }
};

export const StandardVariant: Story = {
  args: {
    label: 'Standard Field',
    placeholder: 'Standard variant',
    variant: 'standard'
  }
};

export const NumberField: Story = {
  args: {
    label: 'Age',
    placeholder: 'Enter your age',
    type: 'number',
    inputProps: { min: 0, max: 120 }
  }
};

export const URLField: Story = {
  args: {
    label: 'Website',
    placeholder: 'https://example.com',
    type: 'url'
  }
};

export const FormExample: Story = {
  render: () => (
    <Box sx={{ maxWidth: 400, p: 2 }}>
      <Stack spacing={3}>
        <FormField label="Full Name" placeholder="Enter your full name" required startAdornment={<IconUser size={20} />} />
        <FormField label="Email Address" placeholder="Enter your email" type="email" required startAdornment={<IconMail size={20} />} />
        <FormField label="Phone Number" placeholder="+1 (555) 123-4567" type="tel" startAdornment={<IconPhone size={20} />} />
        <FormField
          label="Password"
          placeholder="Enter your password"
          type="password"
          required
          showPasswordToggle
          startAdornment={<IconLock size={20} />}
        />
        <FormField label="Bio" placeholder="Tell us about yourself..." multiline rows={3} />
      </Stack>
    </Box>
  )
};
