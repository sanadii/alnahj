import type { Meta, StoryObj } from '@storybook/react';
import { Typography, Button, Stack, Box } from '@mui/material';
import { IconUser, IconMail, IconPhone, IconCalendar } from '@tabler/icons-react';
import { PremiumCard } from '../index';

const meta: Meta<typeof PremiumCard> = {
  title: 'Components/Cards/PremiumCard',
  component: PremiumCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A reusable card component with premium design system featuring gradient backgrounds, hover effects, and theme-aware colors.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outlined', 'elevated'],
      description: 'The visual style variant of the card'
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'success', 'warning', 'error', 'info', 'neutral'],
      description: 'The color theme of the card'
    },
    hover: {
      control: { type: 'boolean' },
      description: 'Whether the card should have hover effects'
    },
    padding: {
      control: { type: 'number' },
      description: 'The padding inside the card'
    },
    borderRadius: {
      control: { type: 'number' },
      description: 'The border radius of the card'
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the card is disabled'
    },
    onClick: {
      action: 'clicked',
      description: 'Callback fired when the card is clicked'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic card
export const Default: Story = {
  args: {
    children: <Typography variant="body1">This is a basic premium card with default styling.</Typography>
  }
};

// Colored cards
export const Primary: Story = {
  args: {
    color: 'primary',
    children: (
      <Box>
        <Typography variant="h6" gutterBottom>
          Primary Card
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This card uses the primary color theme with gradient background.
        </Typography>
      </Box>
    )
  }
};

export const Success: Story = {
  args: {
    color: 'success',
    children: (
      <Box>
        <Typography variant="h6" gutterBottom>
          Success Card
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This card uses the success color theme.
        </Typography>
      </Box>
    )
  }
};

export const Warning: Story = {
  args: {
    color: 'warning',
    children: (
      <Box>
        <Typography variant="h6" gutterBottom>
          Warning Card
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This card uses the warning color theme.
        </Typography>
      </Box>
    )
  }
};

export const Error: Story = {
  args: {
    color: 'error',
    children: (
      <Box>
        <Typography variant="h6" gutterBottom>
          Error Card
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This card uses the error color theme.
        </Typography>
      </Box>
    )
  }
};

// Variants
export const Outlined: Story = {
  args: {
    variant: 'outlined',
    color: 'primary',
    children: (
      <Box>
        <Typography variant="h6" gutterBottom>
          Outlined Card
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This card uses the outlined variant with border styling.
        </Typography>
      </Box>
    )
  }
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: (
      <Box>
        <Typography variant="h6" gutterBottom>
          Elevated Card
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This card uses the elevated variant with shadow styling.
        </Typography>
      </Box>
    )
  }
};

// Interactive features
export const Clickable: Story = {
  args: {
    color: 'primary',
    onClick: () => alert('Card clicked!'),
    children: (
      <Box>
        <Typography variant="h6" gutterBottom>
          Clickable Card
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click this card to see the onClick action.
        </Typography>
      </Box>
    )
  }
};

export const Disabled: Story = {
  args: {
    color: 'primary',
    disabled: true,
    children: (
      <Box>
        <Typography variant="h6" gutterBottom>
          Disabled Card
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This card is disabled and cannot be clicked.
        </Typography>
      </Box>
    )
  }
};

// Complex content
export const WithActions: Story = {
  args: {
    color: 'primary',
    children: (
      <Box>
        <Typography variant="h6" gutterBottom>
          Card with Actions
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          This card contains action buttons and complex content.
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="contained">
            Primary Action
          </Button>
          <Button size="small" variant="outlined">
            Secondary Action
          </Button>
        </Stack>
      </Box>
    )
  }
};

export const WithIcons: Story = {
  args: {
    color: 'info',
    children: (
      <Box>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <IconUser size={24} />
          <Typography variant="h6">User Information</Typography>
        </Stack>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconMail size={16} />
            <Typography variant="body2">user@example.com</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconPhone size={16} />
            <Typography variant="body2">+1 (555) 123-4567</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconCalendar size={16} />
            <Typography variant="body2">Joined Jan 2024</Typography>
          </Stack>
        </Stack>
      </Box>
    )
  }
};

// No hover effect
export const NoHover: Story = {
  args: {
    color: 'primary',
    hover: false,
    children: (
      <Box>
        <Typography variant="h6" gutterBottom>
          No Hover Effect
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This card has hover effects disabled.
        </Typography>
      </Box>
    )
  }
};

// Custom styling
export const CustomStyling: Story = {
  args: {
    color: 'success',
    padding: 4,
    borderRadius: 4,
    sx: {
      minHeight: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    children: (
      <Typography variant="h5" textAlign="center">
        Custom Styled Card
      </Typography>
    )
  }
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <Stack spacing={3} sx={{ maxWidth: 800 }}>
      <Typography variant="h4" gutterBottom>
        PremiumCard Variants
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap">
        <PremiumCard color="primary" sx={{ minWidth: 200 }}>
          <Typography variant="h6">Primary</Typography>
          <Typography variant="body2" color="text.secondary">
            Default variant with primary color
          </Typography>
        </PremiumCard>

        <PremiumCard variant="outlined" color="success" sx={{ minWidth: 200 }}>
          <Typography variant="h6">Success Outlined</Typography>
          <Typography variant="body2" color="text.secondary">
            Outlined variant with success color
          </Typography>
        </PremiumCard>

        <PremiumCard variant="elevated" color="warning" sx={{ minWidth: 200 }}>
          <Typography variant="h6">Warning Elevated</Typography>
          <Typography variant="body2" color="text.secondary">
            Elevated variant with warning color
          </Typography>
        </PremiumCard>
      </Stack>
    </Stack>
  )
};
