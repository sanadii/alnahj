import type { Meta, StoryObj } from '@storybook/react';
import ConfirmDialog from './ConfirmDialog';
import { Button, Box, Stack } from '@mui/material';
import { useState } from 'react';

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Shared/Modals/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the dialog is open.'
    },
    title: {
      control: 'text',
      description: 'The title of the dialog.'
    },
    message: {
      control: 'text',
      description: 'The message content of the dialog.'
    },
    type: {
      control: 'select',
      options: ['info', 'warning', 'error', 'success'],
      description: 'The type/severity of the dialog.'
    },
    confirmText: {
      control: 'text',
      description: 'Text for the confirm button.'
    },
    cancelText: {
      control: 'text',
      description: 'Text for the cancel button.'
    },
    loading: {
      control: 'boolean',
      description: 'Whether the dialog is in loading state.'
    },
    confirmColor: {
      control: 'select',
      options: ['primary', 'secondary', 'error', 'warning', 'info', 'success'],
      description: 'Color of the confirm button.'
    },
    cancelColor: {
      control: 'select',
      options: ['primary', 'secondary', 'error', 'warning', 'info', 'success'],
      description: 'Color of the cancel button.'
    },
    maxWidth: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Maximum width of the dialog.'
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the dialog takes full width.'
    },
    onConfirm: {
      action: 'confirmed',
      description: 'Callback when confirm button is clicked.'
    },
    onCancel: {
      action: 'cancelled',
      description: 'Callback when cancel button is clicked.'
    },
    onClose: {
      action: 'closed',
      description: 'Callback when dialog is closed.'
    }
  },
  args: {
    open: true,
    title: 'Confirm Action',
    message: 'Are you sure you want to perform this action?',
    type: 'info',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    loading: false,
    maxWidth: 'sm',
    fullWidth: true
  }
};

export default meta;

type Story = StoryObj<typeof ConfirmDialog>;

export const Default: Story = {
  args: {
    title: 'Confirm Action',
    message: 'Are you sure you want to perform this action?'
  }
};

export const Info: Story = {
  args: {
    title: 'Information',
    message: 'This is an informational dialog. Please review the details before proceeding.',
    type: 'info'
  }
};

export const Warning: Story = {
  args: {
    title: 'Warning',
    message: 'This action cannot be undone. Are you sure you want to continue?',
    type: 'warning'
  }
};

export const Error: Story = {
  args: {
    title: 'Error',
    message: 'Something went wrong. Would you like to try again or cancel the operation?',
    type: 'error'
  }
};

export const Success: Story = {
  args: {
    title: 'Success',
    message: 'Operation completed successfully! Would you like to continue with the next step?',
    type: 'success'
  }
};

export const CustomButtons: Story = {
  args: {
    title: 'Delete Item',
    message: 'This item will be permanently deleted. This action cannot be undone.',
    type: 'error',
    confirmText: 'Delete',
    cancelText: 'Keep',
    confirmColor: 'error'
  }
};

export const Loading: Story = {
  args: {
    title: 'Processing',
    message: 'Please wait while we process your request...',
    type: 'info',
    loading: true
  }
};

export const Small: Story = {
  args: {
    title: 'Quick Confirm',
    message: 'Are you sure?',
    maxWidth: 'xs'
  }
};

export const Large: Story = {
  args: {
    title: 'Detailed Confirmation',
    message:
      'This is a longer message that requires more space to display all the necessary information. The dialog will expand to accommodate the content while maintaining proper spacing and readability.',
    maxWidth: 'md'
  }
};

export const InteractiveExample: Story = {
  render: () => {
    const [dialog, setDialog] = useState<{
      open: boolean;
      title: string;
      message: string;
      type: 'info' | 'warning' | 'error' | 'success';
      loading: boolean;
    }>({
      open: false,
      title: '',
      message: '',
      type: 'info',
      loading: false
    });

    const showDialog = (type: 'info' | 'warning' | 'error' | 'success', title: string, message: string) => {
      setDialog({ open: true, title, message, type, loading: false });
    };

    const handleConfirm = () => {
      setDialog((prev) => ({ ...prev, loading: true }));
      // Simulate async operation
      setTimeout(() => {
        setDialog((prev) => ({ ...prev, open: false, loading: false }));
      }, 2000);
    };

    const handleCancel = () => {
      setDialog((prev) => ({ ...prev, open: false }));
    };

    return (
      <Box sx={{ p: 2 }}>
        <Stack spacing={2} direction="row" flexWrap="wrap">
          <Button variant="contained" color="info" onClick={() => showDialog('info', 'Information', 'This is an informational dialog.')}>
            Show Info
          </Button>
          <Button variant="contained" color="warning" onClick={() => showDialog('warning', 'Warning', 'This action cannot be undone.')}>
            Show Warning
          </Button>
          <Button variant="contained" color="error" onClick={() => showDialog('error', 'Error', 'Something went wrong.')}>
            Show Error
          </Button>
          <Button variant="contained" color="success" onClick={() => showDialog('success', 'Success', 'Operation completed successfully!')}>
            Show Success
          </Button>
        </Stack>

        <ConfirmDialog
          open={dialog.open}
          title={dialog.title}
          message={dialog.message}
          type={dialog.type}
          loading={dialog.loading}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </Box>
    );
  }
};
