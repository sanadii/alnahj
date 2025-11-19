import type { Meta, StoryObj } from '@storybook/react-vite';
import SearchFilterBar from './SearchFilterBar';
import { Button } from '@mui/material';
import { IconDownload, IconPrinter } from '@tabler/icons-react';

const meta: Meta<typeof SearchFilterBar> = {
  title: 'Shared/Forms/SearchFilterBar',
  component: SearchFilterBar,
  tags: ['autodocs'],
  argTypes: {
    searchValue: { control: 'text', description: 'Current search value' },
    onSearchChange: { action: 'search changed', description: 'Callback when search value changes' },
    viewMode: { control: 'select', options: ['grid', 'list'], description: 'Current view mode' },
    onViewModeChange: { action: 'view mode changed', description: 'Callback when view mode changes' },
    placeholder: { control: 'text', description: 'Search input placeholder' },
    showRefresh: { control: 'boolean', description: 'Show refresh button' },
    onRefresh: { action: 'refresh clicked', description: 'Callback when refresh is clicked' }
  },
  args: {
    searchValue: '',
    viewMode: 'list',
    placeholder: 'Search...',
    showRefresh: false,
  }
};

export default meta;

type Story = StoryObj<typeof SearchFilterBar>;

export const Default: Story = {
  args: {
    searchValue: '',
  }
};

export const WithViewToggle: Story = {
  args: {
    searchValue: '',
    viewMode: 'list',
  }
};

export const WithRefresh: Story = {
  args: {
    searchValue: '',
    showRefresh: true,
  }
};

export const WithActions: Story = {
  args: {
    searchValue: '',
    actions: (
      <>
        <Button size="small" variant="outlined" startIcon={<IconDownload size={16} />}>
          Export
        </Button>
        <Button size="small" variant="outlined" startIcon={<IconPrinter size={16} />}>
          Print
        </Button>
      </>
    )
  }
};

export const WithFilters: Story = {
  args: {
    searchValue: '',
    filters: [
      { key: 'status', label: 'Status', options: [], value: 'all' },
      { key: 'role', label: 'Role', options: [], value: 'user' },
      { key: 'date', label: 'Date Range', options: [], value: '7days' }
    ],
  }
};

export const FullFeatured: Story = {
  args: {
    searchValue: '',
    viewMode: 'list',
    showRefresh: true,
    filters: [
      { key: 'status', label: 'Status', options: [], value: 'all' },
      { key: 'role', label: 'Role', options: [], value: 'user' }
    ],
    actions: (
      <>
        <Button size="small" variant="outlined" startIcon={<IconDownload size={16} />}>
          Export
        </Button>
        <Button size="small" variant="contained" startIcon={<IconPrinter size={16} />}>
          Print
        </Button>
      </>
    )
  }
};
