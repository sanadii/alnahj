import type { Meta, StoryObj } from '@storybook/react';
import NotificationToast from './NotificationToast';
import { Button, Box, Stack } from '@mui/material';
import { useState } from 'react';

const meta: Meta<typeof NotificationToast> = {
  title: 'Shared/Feedback/NotificationToast',
  component: NotificationToast,
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the toast is open.'
    },
    message: {
      control: 'text',
      description: 'The main message text.'
    },
    title: {
      control: 'text',
      description: 'Optional title text.'
    },
    severity: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info'],
      description: 'The severity level of the toast.'
    },
    duration: {
      control: 'number',
      description: 'Duration in milliseconds (0 = persistent).'
    },
    position: {
      control: 'object',
      description: 'Position of the toast.'
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'standard'],
      description: 'Visual style variant.'
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether to show the severity icon.'
    },
    onClose: {
      action: 'toast closed',
      description: 'Callback when the toast is closed.'
    }
  },
  args: {
    open: true,
    message: 'This is a notification message',
    severity: 'info',
    duration: 6000,
    position: { vertical: 'top', horizontal: 'right' },
    variant: 'filled',
    showIcon: true
  }
};

export default meta;

type Story = StoryObj<typeof NotificationToast>;

export const Default: Story = {
  args: {
    message: 'Default notification message'
  }
};

export const Success: Story = {
  args: {
    message: 'Operation completed successfully!',
    severity: 'success'
  }
};

export const Error: Story = {
  args: {
    message: 'Something went wrong. Please try again.',
    severity: 'error'
  }
};

export const Warning: Story = {
  args: {
    message: 'Please review your input before proceeding.',
    severity: 'warning'
  }
};

export const Info: Story = {
  args: {
    message: 'Here is some helpful information.',
    severity: 'info'
  }
};

export const WithTitle: Story = {
  args: {
    title: 'Success!',
    message: 'Your changes have been saved successfully.',
    severity: 'success'
  }
};

export const Outlined: Story = {
  args: {
    message: 'Outlined variant notification',
    variant: 'outlined'
  }
};

export const Standard: Story = {
  args: {
    message: 'Standard variant notification',
    variant: 'standard'
  }
};

export const Persistent: Story = {
  args: {
    message: 'This toast will not auto-close',
    duration: 0
  }
};

export const NoIcon: Story = {
  args: {
    message: 'Notification without icon',
    showIcon: false
  }
};

export const WithAction: Story = {
  args: {
    message: 'File uploaded successfully',
    severity: 'success',
    action: (
      <Button size="small" color="inherit" variant="outlined">
        View
      </Button>
    )
  }
};

export const BottomLeft: Story = {
  args: {
    message: 'Bottom left positioned toast',
    position: { vertical: 'bottom', horizontal: 'left' }
  }
};

export const TopCenter: Story = {
  args: {
    message: 'Top center positioned toast',
    position: { vertical: 'top', horizontal: 'center' }
  }
};

export const InteractiveExample: Story = {
  render: () => {
    const [toast, setToast] = useState<{
      open: boolean;
      message: string;
      severity: 'success' | 'error' | 'warning' | 'info';
      title?: string;
    }>({
      open: false,
      message: '',
      severity: 'info'
    });

    const showToast = (severity: 'success' | 'error' | 'warning' | 'info', message: string, title?: string) => {
      setToast({ open: true, message, severity, title });
    };

    return (
      <Box sx={{ p: 2 }}>
        <Stack spacing={2} direction="row" flexWrap="wrap">
          <Button variant="contained" color="success" onClick={() => showToast('success', 'Operation completed successfully!', 'Success')}>
            Show Success
          </Button>
          <Button variant="contained" color="error" onClick={() => showToast('error', 'Something went wrong. Please try again.', 'Error')}>
            Show Error
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => showToast('warning', 'Please review your input before proceeding.', 'Warning')}
          >
            Show Warning
          </Button>
          <Button variant="contained" color="info" onClick={() => showToast('info', 'Here is some helpful information.', 'Info')}>
            Show Info
          </Button>
        </Stack>

        <NotificationToast
          open={toast.open}
          message={toast.message}
          title={toast.title}
          severity={toast.severity}
          onClose={() => setToast({ ...toast, open: false })}
        />
      </Box>
    );
  }
};
