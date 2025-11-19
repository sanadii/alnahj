/**
 * Storybook Stories for DeleteConfirmationDialog
 */

import type { Meta, StoryObj } from '@storybook/react';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { IconTrash } from '@tabler/icons-react';

const meta: Meta<typeof DeleteConfirmationDialog> = {
  title: 'Components/Modals/DeleteConfirmationDialog',
  component: DeleteConfirmationDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A reusable delete confirmation dialog with warning indicators, item details, and loading states. Perfect for any destructive action across all modules.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls dialog visibility'
    },
    title: {
      control: 'text',
      description: 'Dialog title'
    },
    itemName: {
      control: 'text',
      description: 'Name of the item to be deleted'
    },
    itemType: {
      control: 'text',
      description: 'Type of the item (e.g., product, user, party)'
    },
    warningMessage: {
      control: 'text',
      description: 'Custom warning message'
    },
    isDeleting: {
      control: 'boolean',
      description: 'Loading state indicator'
    }
  }
};

export default meta;
type Story = StoryObj<typeof DeleteConfirmationDialog>;

/**
 * Default story - basic delete confirmation
 */
export const Default: Story = {
  args: {
    open: true,
    title: 'Delete Item',
    itemName: 'Sample Item',
    itemType: 'item',
    isDeleting: false,
  }
};

/**
 * Party deletion example
 */
export const Party: Story = {
  args: {
    open: true,
    title: 'Delete Party',
    itemName: 'Democratic Party',
    itemType: 'party',
    warningMessage: 'This will permanently delete this party and all associated data.',
    isDeleting: false,
  }
};

/**
 * User removal example
 */
export const User: Story = {
  args: {
    open: true,
    title: 'Remove User from Election',
    itemName: 'John Doe',
    itemType: 'user',
    warningMessage: 'This will remove this user from the election. They will no longer be assigned to any committees.',
    isDeleting: false,
  }
};

/**
 * Product deletion example
 */
export const Product: Story = {
  args: {
    open: true,
    title: 'Delete Product',
    itemName: 'iPhone 15 Pro',
    itemType: 'product',
    warningMessage: 'This will remove the product from your inventory. This action cannot be undone.',
    isDeleting: false,
  }
};

/**
 * Deleting state - shows loading spinner
 */
export const Deleting: Story = {
  args: {
    open: true,
    title: 'Delete Product',
    itemName: 'iPhone 15 Pro',
    itemType: 'product',
    isDeleting: true,
  }
};

/**
 * Candidate deletion example
 */
export const Candidate: Story = {
  args: {
    open: true,
    title: 'Delete Candidate',
    itemName: 'Jane Smith',
    itemType: 'candidate',
    warningMessage: 'This action cannot be undone. All candidate data will be permanently removed.',
    isDeleting: false,
  }
};

/**
 * Committee deletion example
 */
export const Committee: Story = {
  args: {
    open: true,
    title: 'Delete Committee',
    itemName: 'M1 Committee',
    itemType: 'committee',
    warningMessage: 'This will permanently delete this committee. All associated data will be removed.',
    isDeleting: false,
  }
};

/**
 * Elector removal example
 */
export const Elector: Story = {
  args: {
    open: true,
    title: 'Remove Elector',
    itemName: 'Sarah Williams',
    itemType: 'elector',
    warningMessage: 'This will remove the elector from the committee. Their voting history will be preserved.',
    isDeleting: false,
  }
};

/**
 * Guarantee deletion example
 */
export const Guarantee: Story = {
  args: {
    open: true,
    title: 'Delete Guarantee',
    itemName: 'Ahmed Hassan - Strong Support',
    itemType: 'guarantee',
    warningMessage: 'This will permanently delete this guarantee record. All follow-up history will be lost.',
    isDeleting: false,
  }
};
