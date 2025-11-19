import type { Meta, StoryObj } from '@storybook/react-vite';
import DataTable, { ColumnDef } from './DataTable';
import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
import StatusChip from '../indicators/StatusChip';

// Sample data
const sampleData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', role: 'Admin', joinDate: '2023-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Pending', role: 'User', joinDate: '2023-02-20' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive', role: 'User', joinDate: '2023-03-10' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'Active', role: 'Manager', joinDate: '2023-04-05' }
];

const columns: ColumnDef<(typeof sampleData)[0]>[] = [
  { id: 'id', label: 'ID', minWidth: 50, align: 'center' },
  { id: 'name', label: 'Name', minWidth: 150 },
  { id: 'email', label: 'Email', minWidth: 200 },
  {
    id: 'status',
    label: 'Status',
    minWidth: 100,
    align: 'center',
    render: (value) => <StatusChip status={value} />
  },
  { id: 'role', label: 'Role', minWidth: 100 },
  { id: 'joinDate', label: 'Join Date', minWidth: 120, align: 'center' }
];

const meta: Meta<typeof DataTable> = {
  title: 'Shared/Tables/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  argTypes: {
    data: { control: 'object', description: 'Array of data objects to display' },
    columns: { control: 'object', description: 'Column definitions' },
    loading: { control: 'boolean', description: 'Show loading state' },
    searchable: { control: 'boolean', description: 'Enable search functionality' },
    sortable: { control: 'boolean', description: 'Enable column sorting' },
    selectable: { control: 'boolean', description: 'Enable row selection' },
    pagination: { control: 'boolean', description: 'Enable pagination' },
    stickyHeader: { control: 'boolean', description: 'Make header sticky' },
    dense: { control: 'boolean', description: 'Use dense table layout' },
    emptyMessage: { control: 'text', description: 'Message to show when no data' }
  },
  args: {
    data: sampleData,
    columns,
    loading: false,
    searchable: false,
    sortable: true,
    selectable: false,
    pagination: true,
    stickyHeader: false,
    dense: false,
    emptyMessage: 'No data available'
  }
};

export default meta;

type Story = StoryObj<typeof DataTable>;

export const Default: Story = {
  args: {
    data: sampleData,
    columns
  }
};

export const WithSearch: Story = {
  args: {
    data: sampleData,
    columns,
    searchable: true,
    searchValue: '',
  }
};

export const WithSelection: Story = {
  args: {
    data: sampleData,
    columns,
    selectable: true,
  }
};

export const WithActions: Story = {
  args: {
    data: sampleData,
    columns,
    actions: [
    ]
  }
};

export const Loading: Story = {
  args: {
    data: [],
    columns,
    loading: true
  }
};

export const Empty: Story = {
  args: {
    data: [],
    columns,
    emptyMessage: 'No users found. Try adjusting your search criteria.'
  }
};

export const Dense: Story = {
  args: {
    data: sampleData,
    columns,
    dense: true
  }
};

export const StickyHeader: Story = {
  args: {
    data: sampleData,
    columns,
    stickyHeader: true
  }
};

export const FullFeatured: Story = {
  args: {
    data: sampleData,
    columns,
    searchable: true,
    sortable: true,
    selectable: true,
    pagination: true,
    stickyHeader: true,
    actions: [
    ],
    searchValue: '',
  }
};
