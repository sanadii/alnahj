/**
 * Attendance Page
 * Main page for marking and tracking elector attendance on voting day
 * Layout: Left column (9) for search, Right column (3) for stats and attendee list
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Box, Grid, Typography, FormControl, InputLabel, Select, MenuItem, Paper, Stack, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'store';
import { PremiumCard, PremiumPageHeader } from 'shared/components';
import type { HeaderAction } from 'shared/components';
import { IconClipboardCheck, IconBuilding, IconRefresh, IconDownload, IconFileText } from '@tabler/icons-react';
import { getCommitteesRequest } from 'store/committees/actions';
import { exportAttendanceCSV, exportAttendancePDF } from 'helpers/api/attendance';
import { openSnackbar } from 'store/snackbar/actions';

// Components
import AttendanceSearch from './AttendanceSearch';
import AttendanceList from './AttendanceList';
import AttendanceStats from './AttendanceStats';

// ==============================|| ATTENDANCE PAGE ||============================== //

const ALL_COMMITTEES_VALUE = 'ALL';

const Attendance: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { committees } = useAppSelector((state) => state.committees);
  const [selectedCommittee, setSelectedCommittee] = useState('');

  // Check if user is admin
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.is_admin || user?.is_superuser;

  // Get user's assigned committees (codes) - memoized to prevent unnecessary re-renders
  const userCommitteeCodes = useMemo(() => user?.committees || [], [user?.committees]);

  // Admin: Can select any committee
  // Member: Only assigned committees - memoized to prevent unnecessary re-renders
  const availableCommittees = useMemo(
    () => (isAdmin ? committees || [] : (committees || []).filter((c) => userCommitteeCodes.includes(c.code))),
    [isAdmin, committees, userCommitteeCodes]
  );

  // Fetch committees on mount
  useEffect(() => {
    dispatch(getCommitteesRequest({}));
  }, [dispatch]);

  // Auto-select committee based on role
  useEffect(() => {
    if (availableCommittees.length === 0) return;

    if (isAdmin) {
      if (!selectedCommittee) {
        setSelectedCommittee(ALL_COMMITTEES_VALUE);
      }
      return;
    }

    if (!selectedCommittee) {
      setSelectedCommittee(availableCommittees[0].code);
    }
  }, [availableCommittees, selectedCommittee, isAdmin]);

  // Refresh handler
  const handleRefresh = () => {
    dispatch(getCommitteesRequest({}));
  };

  // Export handlers
  const handleExportCSV = async () => {
    try {
      const filters: { committee_code?: string } = {};
      if (selectedCommittee && selectedCommittee !== ALL_COMMITTEES_VALUE) {
        filters.committee_code = selectedCommittee;
      }

      const blob = await exportAttendanceCSV(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `attendance_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      dispatch(
        openSnackbar({
          open: true,
          message: 'CSV export downloaded successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: true
        })
      );
    } catch (error: any) {
      dispatch(
        openSnackbar({
          open: true,
          message: error?.response?.data?.message || 'Failed to export CSV',
          variant: 'alert',
          alert: { color: 'error' },
          close: true
        })
      );
    }
  };

  const handleExportPDF = async () => {
    try {
      const filters: { committee_code?: string } = {};
      if (selectedCommittee && selectedCommittee !== ALL_COMMITTEES_VALUE) {
        filters.committee_code = selectedCommittee;
      }

      const blob = await exportAttendancePDF(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `attendance_export_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      dispatch(
        openSnackbar({
          open: true,
          message: 'PDF export downloaded successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: true
        })
      );
    } catch (error: any) {
      dispatch(
        openSnackbar({
          open: true,
          message: error?.response?.data?.message || 'Failed to export PDF',
          variant: 'alert',
          alert: { color: 'error' },
          close: true
        })
      );
    }
  };

  // Header actions
  const headerActions: HeaderAction[] = [
    {
      label: 'Export CSV',
      icon: <IconDownload />,
      onClick: handleExportCSV,
      tooltip: 'Export attendance to CSV',
      type: 'iconButton',
      disabled: !selectedCommittee
    },
    {
      label: 'Export PDF',
      icon: <IconFileText />,
      onClick: handleExportPDF,
      tooltip: 'Export attendance to PDF',
      type: 'iconButton',
      disabled: !selectedCommittee
    },
    {
      label: 'Refresh',
      icon: <IconRefresh />,
      onClick: handleRefresh,
      tooltip: 'Refresh committees data',
      type: 'iconButton'
    }
  ];

  const isAllCommitteesSelected = selectedCommittee === ALL_COMMITTEES_VALUE;
  const canShowCommitteeDetails = !isAdmin || (selectedCommittee && !isAllCommitteesSelected);

  return (
    <PremiumCard variant="elevated" padding={0}>
      {/* Premium Header */}
      <PremiumPageHeader
        title="Attendance Tracking"
        subtitle="Mark and track elector attendance on voting day"
        icon={<IconClipboardCheck />}
        actions={headerActions}
      />

      <Box sx={{ p: (theme) => theme.layoutSpacing?.shell?.padding?.md ?? theme.spacing(3) }}>
        {/* Committee Selector */}
        <Paper
          elevation={2}
          sx={{
            p: 2.5,
            mb: 3,
            background: 'linear-gradient(135deg, rgba(103, 58, 183, 0.05) 0%, rgba(63, 81, 181, 0.05) 100%)',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2
          }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <IconBuilding size={20} />
              <Typography variant="subtitle1" fontWeight="600">
                Committee:
              </Typography>
            </Stack>

            {/* Admin: Can select any committee */}
            {isAdmin ? (
              <>
                <FormControl sx={{ minWidth: 250 }} size="small">
                  <InputLabel>Select Committee</InputLabel>
                  <Select value={selectedCommittee} onChange={(e) => setSelectedCommittee(e.target.value)} label="Select Committee">
                    <MenuItem value={ALL_COMMITTEES_VALUE}>All Committees</MenuItem>
                    {availableCommittees.length === 0 ? (
                      <MenuItem value="" disabled>
                        No committees available
                      </MenuItem>
                    ) : (
                      availableCommittees.map((committee) => (
                        <MenuItem key={committee.id} value={committee.code}>
                          {committee.code} - {committee.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
                <Typography variant="caption" color="text.secondary">
                  Admin - All {availableCommittees.length} committees available
                </Typography>
              </>
            ) : (
              /* Member: Shows assigned committee only */
              <>
                {availableCommittees.length > 0 ? (
                  <>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      {availableCommittees[0].code} - {availableCommittees[0].name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Your assigned committee
                    </Typography>
                  </>
                ) : (
                  <Alert severity="error">No committees assigned to you. Please contact administrator.</Alert>
                )}
              </>
            )}
          </Stack>
        </Paper>

        {/* No Committee Selected Warning */}
        {!selectedCommittee && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Please select a committee to start marking attendance
          </Alert>
        )}
        {isAdmin && isAllCommitteesSelected && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Viewing attendance for all committees. Select a specific committee to mark attendance or view statistics.
          </Alert>
        )}

        {/* Main Content */}
        {selectedCommittee && (
          <Grid container spacing={3}>
            {/* Left Column - Search & Mark Attendance */}
            {canShowCommitteeDetails ? (
              <Grid size={{ xs: 12, lg: 9 }}>
                <AttendanceSearch selectedCommittee={selectedCommittee} />
              </Grid>
            ) : null}

            {/* Right Column - Statistics & Attendee List */}
            <Grid size={{ xs: 12, lg: canShowCommitteeDetails ? 3 : 12 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Statistics */}
                {canShowCommitteeDetails ? <AttendanceStats selectedCommittee={selectedCommittee} /> : null}

                {/* Attendee List */}
                <AttendanceList
                  selectedCommittee={canShowCommitteeDetails ? selectedCommittee : undefined}
                  isAllView={isAdmin && isAllCommitteesSelected}
                  onCommitteeSelect={setSelectedCommittee}
                />
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
    </PremiumCard>
  );
};

export default Attendance;
