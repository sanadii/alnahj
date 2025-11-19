/**
 * Storybook Stories for EntityInfoCard
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '@mui/material';
import EntityInfoCard from './EntityInfoCard';
import {
  Badge as BadgeIcon,
  Group as GroupIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

const meta: Meta<typeof EntityInfoCard> = {
  title: 'Components/Cards/EntityInfoCard',
  component: EntityInfoCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'An elegant card for displaying entity identification with gradient accent, perfect for dialog headers and entity displays.'
      }
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof EntityInfoCard>;

export const Elector: Story = {
  args: {
    primaryId: { label: 'KOC ID', value: 'PA0001' },
    title: 'Ahmed Hassan Mohamed'
  }
};

export const ElectorWithCommittee: Story = {
  args: {
    primaryId: { label: 'KOC ID', value: 'PA0001' },
    title: 'Ahmed Hassan Mohamed',
    metadata: [
      {
        icon: <GroupIcon />,
        label: 'Committee: M1',
        color: 'secondary'
      }
    ]
  }
};

export const ElectorWithFullMetadata: Story = {
  args: {
    primaryId: { label: 'KOC ID', value: 'PA0001' },
    title: 'Ahmed Hassan Mohamed Ali',
    metadata: [
      {
        icon: <GroupIcon />,
        label: 'Committee: M1',
        color: 'secondary'
      },
      {
        icon: <PhoneIcon />,
        label: '+965 9999 9999',
        variant: 'outlined'
      }
    ]
  }
};

export const User: Story = {
  args: {
    primaryId: { label: 'User ID', value: 'USR-12345' },
    title: 'John Doe',
    metadata: [
      {
        icon: <EmailIcon />,
        label: 'john.doe@example.com',
        variant: 'outlined'
      }
    ]
  }
};

export const Product: Story = {
  args: {
    primaryId: { label: 'SKU', value: 'PRD-2024-001' },
    title: 'iPhone 15 Pro Max',
    metadata: [
      {
        icon: <BusinessIcon />,
        label: 'Category: Electronics',
        color: 'info'
      },
      {
        icon: <LocationIcon />,
        label: 'Warehouse A',
        color: 'success'
      }
    ]
  }
};

export const Candidate: Story = {
  args: {
    primaryId: { label: 'Candidate #', value: '42' },
    title: 'Sarah Johnson',
    metadata: [
      {
        icon: <GroupIcon />,
        label: 'Democratic Party',
        color: 'primary'
      }
    ]
  }
};

export const Clickable: Story = {
  args: {
    primaryId: { label: 'ID', value: 'CLK-001' },
    title: 'Clickable Card',
    metadata: [
      {
        icon: <GroupIcon />,
        label: 'Click me!',
        color: 'primary'
      }
    ],
    onClick: () => alert('Card clicked!')
  }
};

export const MultipleCards: Story = {
  render: () => (
    <Stack spacing={3}>
      <EntityInfoCard
        primaryId={{ label: 'KOC ID', value: 'PA0001' }}
        title="Ahmed Hassan"
        metadata={[
          { icon: <GroupIcon />, label: 'Committee: M1', color: 'secondary' },
          { icon: <PhoneIcon />, label: '+965 9999 9999', variant: 'outlined' }
        ]}
      />
      <EntityInfoCard
        primaryId={{ label: 'KOC ID', value: 'PA0002' }}
        title="Fatima Ali"
        metadata={[{ icon: <GroupIcon />, label: 'Committee: F1', color: 'secondary' }]}
      />
      <EntityInfoCard
        primaryId={{ label: 'User ID', value: 'USR-001' }}
        title="John Administrator"
        metadata={[
          { icon: <EmailIcon />, label: 'admin@example.com', variant: 'outlined' },
          { icon: <BusinessIcon />, label: 'Administrator', color: 'error' }
        ]}
      />
    </Stack>
  )
};

export const LongTitle: Story = {
  args: {
    primaryId: { label: 'ID', value: 'LONG-001' },
    title: 'This Is A Very Long Name That Will Be Truncated With Ellipsis When It Overflows',
    metadata: [
      {
        icon: <GroupIcon />,
        label: 'Department: Technology and Innovation',
        color: 'primary'
      }
    ]
  }
};
