/**
 * Storybook Stories for PremiumDialogHeader
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Dialog, DialogContent, Box } from '@mui/material';
import PremiumDialogHeader, { DialogHeaderGradients } from './PremiumDialogHeader';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { IconEdit } from '@tabler/icons-react';

const meta: Meta<typeof PremiumDialogHeader> = {
  title: 'Components/Modals/PremiumDialogHeader',
  component: PremiumDialogHeader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A stunning dialog header with gradient background, glassmorphism icon, and animated close button. Perfect for premium dialog experiences.'
      }
    }
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Dialog open={true} maxWidth="md" fullWidth>
        <Story />
        <DialogContent>
          <Box sx={{ p: 3, minHeight: 200 }}>
            <p>Dialog content goes here...</p>
          </Box>
        </DialogContent>
      </Dialog>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof PremiumDialogHeader>;

export const EditDialog: Story = {
  args: {
    icon: <IconEdit size={32} color="white" />,
    title: 'Edit Elector',
    subtitle: 'Update elector information',
  }
};

export const AddDialog: Story = {
  args: {
    icon: <AddIcon sx={{ fontSize: 32, color: 'white' }} />,
    title: 'Add New Item',
    subtitle: 'Create a new record',
  }
};

export const ViewDialog: Story = {
  args: {
    icon: <ViewIcon sx={{ fontSize: 32, color: 'white' }} />,
    title: 'Item Details',
    subtitle: 'View item information',
  }
};

export const DeleteDialog: Story = {
  args: {
    icon: <DeleteIcon sx={{ fontSize: 32, color: 'white' }} />,
    title: 'Delete Confirmation',
    subtitle: 'Permanently remove this item',
    gradient: DialogHeaderGradients.red
  }
};

export const SecurityDialog: Story = {
  args: {
    icon: <SecurityIcon sx={{ fontSize: 32, color: 'white' }} />,
    title: 'Add to Guarantees',
    subtitle: 'Create a new guarantee record',
    withPattern: true
  }
};

export const SettingsDialog: Story = {
  args: {
    icon: <SettingsIcon sx={{ fontSize: 32, color: 'white' }} />,
    title: 'Settings',
    subtitle: 'Configure application settings',
    gradient: DialogHeaderGradients.indigo
  }
};

export const BlueGradient: Story = {
  args: {
    icon: <AddIcon sx={{ fontSize: 32, color: 'white' }} />,
    title: 'Create Record',
    subtitle: 'Add a new entry',
    gradient: DialogHeaderGradients.blue
  }
};

export const GreenGradient: Story = {
  args: {
    icon: <AddIcon sx={{ fontSize: 32, color: 'white' }} />,
    title: 'Success Action',
    subtitle: 'Confirm and proceed',
    gradient: DialogHeaderGradients.green
  }
};

export const WithoutPattern: Story = {
  args: {
    icon: <IconEdit size={32} color="white" />,
    title: 'Simple Header',
    subtitle: 'Without floating pattern effect',
    withPattern: false
  }
};
