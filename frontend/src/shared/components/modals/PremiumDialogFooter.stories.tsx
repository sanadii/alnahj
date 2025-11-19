/**
 * Storybook Stories for PremiumDialogFooter
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Dialog, DialogContent, Box } from '@mui/material';
import PremiumDialogFooter, { SubmitGradients } from './PremiumDialogFooter';
import {
  Save as SaveIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon
} from '@mui/icons-material';

const meta: Meta<typeof PremiumDialogFooter> = {
  title: 'Components/Modals/PremiumDialogFooter',
  component: PremiumDialogFooter,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An elegant dialog footer with gradient submit button, hover animations, and loading states.'
      }
    }
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Dialog open={true} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box sx={{ p: 3, minHeight: 200 }}>
            <p>Dialog content goes here...</p>
          </Box>
        </DialogContent>
        <Story />
      </Dialog>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof PremiumDialogFooter>;

export const Default: Story = {
  args: {
    cancelLabel: 'Cancel',
    submitLabel: 'Submit'
  }
};

export const SaveChanges: Story = {
  args: {
    cancelLabel: 'Cancel',
    submitLabel: 'Save Changes',
    submitIcon: <SaveIcon />
  }
};

export const Loading: Story = {
  args: {
    cancelLabel: 'Cancel',
    submitLabel: 'Saving Changes',
    loading: true,
    submitIcon: <SaveIcon />
  }
};

export const AddItem: Story = {
  args: {
    cancelLabel: 'Cancel',
    submitLabel: 'Add Item',
    submitIcon: <AddIcon />
  }
};

export const SendMessage: Story = {
  args: {
    cancelLabel: 'Discard',
    submitLabel: 'Send Message',
    submitIcon: <SendIcon />,
    submitGradient: SubmitGradients.blue
  }
};

export const Confirm: Story = {
  args: {
    cancelLabel: 'Cancel',
    submitLabel: 'Confirm',
    submitIcon: <CheckCircleIcon />,
    submitGradient: SubmitGradients.green
  }
};

export const Delete: Story = {
  args: {
    cancelLabel: 'Keep It',
    submitLabel: 'Delete Forever',
    submitIcon: <DeleteIcon />,
    submitGradient: SubmitGradients.red
  }
};

export const Upload: Story = {
  args: {
    cancelLabel: 'Cancel',
    submitLabel: 'Upload Files',
    submitIcon: <UploadIcon />,
    submitGradient: SubmitGradients.orange
  }
};

export const Disabled: Story = {
  args: {
    cancelLabel: 'Cancel',
    submitLabel: 'Submit',
    submitDisabled: true,
    submitIcon: <SaveIcon />
  }
};

export const ViewOnly: Story = {
  args: {
    cancelLabel: '',
    submitLabel: 'Close',
    submitIcon: null
  }
};
