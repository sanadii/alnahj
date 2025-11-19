import React, { useState } from 'react';
import { Box, Typography, Grid, Stack, Button, Chip, Paper, Alert } from '@mui/material';
import { IconPlus, IconEdit, IconTrash, IconSearch, IconFilter, IconUpload, IconDownload } from '@tabler/icons-react';

// Import Phase 2 components
import DataTable from '../tables/DataTable';
import SearchFilterBar from '../forms/SearchFilterBar';
import FloatingActionButton from '../buttons/FloatingActionButton';
import ModalDialog from '../modals/ModalDialog';
import ProgressIndicator from '../feedback/ProgressIndicator';
import EmptyState from '../feedback/EmptyState';
import LoadingSpinner from '../feedback/LoadingSpinner';
import ErrorBoundary from '../feedback/ErrorBoundary';

// Demo data
const demoData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Pending', role: 'User' }
];

const columns = [
  { id: 'name', label: 'Name', sortable: true },
  { id: 'email', label: 'Email', sortable: true },
  {
    id: 'status',
    label: 'Status',
    render: (value: string) => (
      <Chip label={value} color={value === 'Active' ? 'success' : value === 'Inactive' ? 'error' : 'warning'} size="small" />
    )
  },
  { id: 'role', label: 'Role', sortable: true }
];

const actions = [
  {
    label: 'Edit',
    icon: <IconEdit size={16} />,
    color: 'primary' as const
  },
  {
    label: 'Delete',
    icon: <IconTrash size={16} />,
    color: 'error' as const
  }
];

const filterOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Pending', value: 'pending' }
];

const Phase2ComponentsDemo: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleFilter = (value: string) => {
    setSelectedFilter(value);
  };

  const handleFabClick = () => {
    setModalOpen(true);
  };

  const simulateProgress = () => {
    setLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Phase 2 Components Demo
      </Typography>

      <Grid container spacing={3}>
        {/* SearchFilterBar Demo */}
        <Grid size={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Search & Filter Bar
            </Typography>
            <SearchFilterBar
              searchValue={searchValue}
              onSearchChange={handleSearch}
              filterOptions={filterOptions}
              onFilterChange={handleFilter}
              placeholder="Search users..."
              debounceTime={300}
            />
          </Paper>
        </Grid>

        {/* DataTable Demo */}
        <Grid size={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Data Table
            </Typography>
            <DataTable
              data={demoData}
              columns={columns}
              actions={actions}
              searchable={true}
              filterable={true}
              selectable={true}
              pagination={true}
            />
          </Paper>
        </Grid>

        {/* Progress Indicator Demo */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Progress Indicator
            </Typography>
            <Stack spacing={2}>
              <Button onClick={simulateProgress} variant="contained">
                Start Progress
              </Button>
              <ProgressIndicator variant="linear" value={progress} label={`${progress}% Complete`} color="primary" />
              {loading && <LoadingSpinner size={40} />}
            </Stack>
          </Paper>
        </Grid>

        {/* Empty State Demo */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Empty State
            </Typography>
            <EmptyState
              icon={<IconSearch size={48} />}
              title="No Data Found"
              description="Try adjusting your search criteria or add new data."
              action={
                <Button variant="contained" startIcon={<IconPlus size={16} />}>
                  Add New Item
                </Button>
              }
            />
          </Paper>
        </Grid>

        {/* Error Boundary Demo */}
        <Grid size={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Error Boundary
            </Typography>
            <Alert severity="info">
              Error boundaries are automatically applied to catch JavaScript errors anywhere in the component tree.
            </Alert>
          </Paper>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <FloatingActionButton
        icon={<IconPlus size={24} />}
        tooltip="Add New Item"
        onClick={handleFabClick}
        color="primary"
        position={{ bottom: 24, right: 24 }}
      />

      {/* Modal Dialog */}
      <ModalDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Item"
        content={
          <Box sx={{ p: 2 }}>
            <Typography>This is a modal dialog created with the ModalDialog component.</Typography>
          </Box>
        }
        actions={
          <Stack direction="row" spacing={1}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={() => setModalOpen(false)}>
              Save
            </Button>
          </Stack>
        }
      />
    </Box>
  );
};

export default Phase2ComponentsDemo;
