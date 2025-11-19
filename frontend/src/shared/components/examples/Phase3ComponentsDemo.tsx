import React, { useState } from 'react';
import { Box, Typography, Grid, Stack, Button, Paper, Divider } from '@mui/material';
import { IconEdit, IconTrash, IconEye, IconDownload, IconShare, IconPlus } from '@tabler/icons-react';

// Import Phase 3 components
import ActionButtonGroup from '../buttons/ActionButtonGroup';
import StatusChip from '../indicators/StatusChip';
import FormField from '../forms/FormField';
import DatePicker from '../forms/DatePicker';
import FileUpload from '../forms/FileUpload';
import NotificationToast from '../feedback/NotificationToast';
import ConfirmDialog from '../modals/ConfirmDialog';
import Tooltip from '../feedback/Tooltip';

const Phase3ComponentsDemo: React.FC = () => {
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

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
  }>({
    open: false,
    title: '',
    message: '',
    type: 'info'
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: null as Date | null,
    files: [] as File[]
  });

  const showToast = (severity: 'success' | 'error' | 'warning' | 'info', message: string, title?: string) => {
    setToast({ open: true, message, severity, title });
  };

  const showConfirmDialog = (type: 'info' | 'warning' | 'error' | 'success', title: string, message: string) => {
    setConfirmDialog({ open: true, title, message, type });
  };

  const handleConfirm = () => {
    setConfirmDialog((prev) => ({ ...prev, open: false }));
    showToast('success', 'Action confirmed successfully!', 'Confirmed');
  };

  const handleCancel = () => {
    setConfirmDialog((prev) => ({ ...prev, open: false }));
    showToast('info', 'Action was cancelled.', 'Cancelled');
  };

  const actionButtons = [
    {
      label: 'View',
      icon: <IconEye size={16} />,
      onClick: () => showToast('info', 'View action clicked'),
      color: 'primary' as const,
      variant: 'outlined' as const,
      tooltip: 'View details'
    },
    {
      label: 'Edit',
      icon: <IconEdit size={16} />,
      onClick: () => showToast('warning', 'Edit action clicked'),
      color: 'secondary' as const,
      variant: 'outlined' as const,
      tooltip: 'Edit item'
    },
    {
      label: 'Delete',
      icon: <IconTrash size={16} />,
      onClick: () => showConfirmDialog('error', 'Delete Item', 'Are you sure you want to delete this item? This action cannot be undone.'),
      color: 'error' as const,
      variant: 'outlined' as const,
      tooltip: 'Delete item'
    }
  ];

  const moreActions = [
    ...actionButtons,
    {
      label: 'Download',
      icon: <IconDownload size={16} />,
      onClick: () => showToast('success', 'Download started'),
      color: 'info' as const,
      variant: 'outlined' as const,
      tooltip: 'Download file'
    },
    {
      label: 'Share',
      icon: <IconShare size={16} />,
      onClick: () => showToast('info', 'Share options opened'),
      color: 'success' as const,
      variant: 'outlined' as const,
      tooltip: 'Share item'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Phase 3 Components Demo
      </Typography>

      <Grid container spacing={3}>
        {/* ActionButtonGroup Demo */}
        <Grid size={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Action Button Group
            </Typography>
            <Stack spacing={2}>
              <div>
                <Typography variant="subtitle2" mb={1}>
                  Default Group
                </Typography>
                <ActionButtonGroup actions={actionButtons} />
              </div>
              <div>
                <Typography variant="subtitle2" mb={1}>
                  Grouped Variant
                </Typography>
                <ActionButtonGroup actions={actionButtons} variant="grouped" />
              </div>
              <div>
                <Typography variant="subtitle2" mb={1}>
                  With More Button
                </Typography>
                <ActionButtonGroup actions={moreActions} maxVisible={3} onShowMore={() => showToast('info', 'More actions clicked')} />
              </div>
            </Stack>
          </Paper>
        </Grid>

        {/* StatusChip Demo */}
        <Grid size={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Status Chips
            </Typography>
            <Stack spacing={2}>
              <div>
                <Typography variant="subtitle2" mb={1}>
                  All Status Types
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <StatusChip status="active" />
                  <StatusChip status="pending" />
                  <StatusChip status="completed" />
                  <StatusChip status="failed" />
                  <StatusChip status="processing" />
                  <StatusChip status="approved" />
                  <StatusChip status="rejected" />
                </Stack>
              </div>
              <div>
                <Typography variant="subtitle2" mb={1}>
                  With Icons
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <StatusChip status="active" showIcon />
                  <StatusChip status="pending" showIcon />
                  <StatusChip status="completed" showIcon />
                  <StatusChip status="failed" showIcon />
                </Stack>
              </div>
              <div>
                <Typography variant="subtitle2" mb={1}>
                  Different Variants
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <StatusChip status="active" variant="filled" />
                  <StatusChip status="pending" variant="outlined" />
                  <StatusChip status="completed" variant="soft" />
                </Stack>
              </div>
            </Stack>
          </Paper>
        </Grid>

        {/* FormField Demo */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Form Fields
            </Typography>
            <Stack spacing={2}>
              <FormField
                label="Name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(value) => setFormData((prev) => ({ ...prev, name: value }))}
                startAdornment={<IconEdit size={20} />}
              />
              <FormField
                label="Email"
                placeholder="Enter your email"
                type="email"
                value={formData.email}
                onChange={(value) => setFormData((prev) => ({ ...prev, email: value }))}
              />
              <FormField label="Password" placeholder="Enter password" type="password" showPasswordToggle />
            </Stack>
          </Paper>
        </Grid>

        {/* DatePicker Demo */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Date Picker
            </Typography>
            <Stack spacing={2}>
              <DatePicker
                label="Select Date"
                placeholder="Choose a date"
                value={formData.date}
                onChange={(date) => setFormData((prev) => ({ ...prev, date }))}
              />
              <DatePicker label="Future Date Only" placeholder="Select future date" disablePast />
              <DatePicker label="Past Date Only" placeholder="Select past date" disableFuture />
            </Stack>
          </Paper>
        </Grid>

        {/* FileUpload Demo */}
        <Grid size={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              File Upload
            </Typography>
            <Stack spacing={2}>
              <div>
                <Typography variant="subtitle2" mb={1}>
                  Dropzone Variant
                </Typography>
                <FileUpload
                  label="Upload Files"
                  multiple
                  maxFiles={3}
                  maxSize={10}
                  onFilesChange={(files) => setFormData((prev) => ({ ...prev, files }))}
                />
              </div>
              <div>
                <Typography variant="subtitle2" mb={1}>
                  Button Variant
                </Typography>
                <FileUpload label="Choose Files" variant="button" accept="image/*" maxFiles={2} />
              </div>
            </Stack>
          </Paper>
        </Grid>

        {/* Tooltip Demo */}
        <Grid size={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tooltips
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Tooltip title="Default tooltip with helpful information">
                <Button variant="outlined">Default</Button>
              </Tooltip>
              <Tooltip title="Dark tooltip" variant="dark">
                <Button variant="contained" color="secondary">
                  Dark
                </Button>
              </Tooltip>
              <Tooltip title="Light tooltip" variant="light">
                <Button variant="contained">Light</Button>
              </Tooltip>
              <Tooltip title="Colored tooltip" variant="colored" color="success">
                <Button variant="contained" color="success">
                  Colored
                </Button>
              </Tooltip>
              <Tooltip title="Small tooltip" size="small">
                <Button size="small">Small</Button>
              </Tooltip>
              <Tooltip title="Large tooltip with more content" size="large">
                <Button variant="contained" color="info">
                  Large
                </Button>
              </Tooltip>
            </Stack>
          </Paper>
        </Grid>

        {/* Interactive Buttons */}
        <Grid size={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Interactive Examples
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Button
                variant="contained"
                color="success"
                onClick={() => showToast('success', 'Operation completed successfully!', 'Success')}
              >
                Show Success Toast
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => showToast('error', 'Something went wrong. Please try again.', 'Error')}
              >
                Show Error Toast
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={() =>
                  showConfirmDialog('warning', 'Confirm Action', 'Are you sure you want to proceed? This action cannot be undone.')
                }
              >
                Show Confirm Dialog
              </Button>
              <Button
                variant="contained"
                color="info"
                onClick={() => showConfirmDialog('info', 'Information', 'This is an informational dialog with important details.')}
              >
                Show Info Dialog
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Notification Toast */}
      <NotificationToast
        open={toast.open}
        message={toast.message}
        title={toast.title}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </Box>
  );
};

export default Phase3ComponentsDemo;
