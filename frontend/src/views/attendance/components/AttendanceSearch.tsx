/**
 * AttendanceSearch Component
 * Search and mark elector attendance
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Card, CardContent, TextField, Typography, Alert, CircularProgress, Chip, Stack, Paper } from '@mui/material';
import { IconSearch, IconCheck, IconAlertCircle, IconUserPlus, IconAlertTriangle } from '@tabler/icons-react';
import { RootState } from 'store';
import {
  searchElectorRequest,
  markAttendanceRequest,
  clearSearchResult,
  addPendingElectorRequest
} from 'store/attendance/actions';
import QuickAddElectorDialog from './QuickAddElectorDialog';

// ============================================================================
// COMPONENT
// ============================================================================

interface AttendanceSearchProps {
  selectedCommittee: string;
}

const AttendanceSearch: React.FC<AttendanceSearchProps> = ({ selectedCommittee }) => {
  const dispatch = useDispatch();
  const { searchResult, searchLoading, markingLoading, searchError } = useSelector((state: RootState) => state.attendance);

  const [kocId, setKocId] = useState('');
  const [notes, setNotes] = useState('');
  const [mismatchNotes, setMismatchNotes] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const handleAddPendingFromMismatch = () => {
    if (!kocId.trim()) {
      return;
    }
    dispatch(
      addPendingElectorRequest({
        koc_id: kocId.trim(),
        full_name: '',
        committee_code: selectedCommittee,
        notes: mismatchNotes.trim()
      })
    );
    setMismatchNotes('');
  };


  // Clear search result when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearSearchResult());
    };
  }, [dispatch]);

  // Handle search
  const handleSearch = () => {
    if (!kocId.trim()) {
      return;
    }
    dispatch(
      searchElectorRequest({
        koc_id: kocId.trim(),
        committee: selectedCommittee
      })
    );
  };

  // Handle mark attendance
  const handleMarkAttendance = () => {
    if (!searchResult) {
      return;
    }

    dispatch(
      markAttendanceRequest({
        koc_id: searchResult.kocId,
        committee_code: selectedCommittee,
        notes: notes.trim()
      })
    );

    // Clear form after marking
    setKocId('');
    setNotes('');
  };

  // Handle key press
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle add pending elector
  const handleAddPendingElector = (electorData: any) => {
    dispatch(addPendingElectorRequest(electorData));
    setShowAddDialog(false);
  };

  const handleAddPendingFromAttended = () => {
    if (!searchResult) return;
    dispatch(
      addPendingElectorRequest({
        koc_id: searchResult.kocId,
        full_name: searchResult.fullName,
        committee_code: selectedCommittee,
        notes: notes.trim()
      })
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Mark Attendance
        </Typography>

        {/* Search Form */}
        <Stack spacing={2} sx={{ mb: 3 }}>
          <TextField
            label="KOC ID"
            value={kocId}
            onChange={(e) => setKocId(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter elector's KOC ID"
            fullWidth
            autoFocus
            disabled={searchLoading || markingLoading}
          />

          <Button
            variant="contained"
            startIcon={searchLoading ? <CircularProgress size={20} /> : <IconSearch />}
            onClick={handleSearch}
            disabled={!kocId.trim() || searchLoading || markingLoading}
            fullWidth
            size="large"
          >
            {searchLoading ? 'Searching...' : 'Search Elector'}
          </Button>
        </Stack>

        {/* Search Error - Not Found / Committee mismatch */}
        {searchError && !searchResult && (
          /assigned to committee/i.test(searchError) ? (
            <Paper
              elevation={0}
              sx={{
                mb: 2,
                p: 2.5,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'warning.light',
                backgroundColor: '#FFF9F0'
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: 'warning.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <IconAlertTriangle size={22} color="white" />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography component="div" variant="subtitle1" sx={{ color: '#c67100' }}>
                      Elector{' '}
                      <Typography component="span" sx={{ fontWeight: 700 }}>
                        {kocId.trim()}
                      </Typography>{' '}
                      is assigned to committee{' '}
                      <Typography component="span" sx={{ fontWeight: 700 }}>
                        {searchError.match(/committee\s([^\s,]+)/i)?.[1] || 'unknown'}
                      </Typography>
                      , not{' '}
                      <Typography component="span" sx={{ fontWeight: 700 }}>
                        {selectedCommittee}
                      </Typography>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Add a note and record this attendance as pending.
                    </Typography>
                  </Box>
                </Stack>

                <TextField
                  label="Notes (Optional)"
                  value={mismatchNotes}
                  onChange={(e) => setMismatchNotes(e.target.value)}
                  placeholder="Add any special notes or observations..."
                  fullWidth
                  multiline
                  rows={2}
                />

                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<IconUserPlus size={16} />}
                  onClick={handleAddPendingFromMismatch}
                  disabled={markingLoading}
                  sx={{ fontWeight: 'bold', textTransform: 'none' }}
                >
                  Add as Pending
                </Button>
              </Stack>
            </Paper>
          ) : (
          <Paper
            elevation={0}
            sx={{
              mb: 2,
              p: 2.5,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'warning.light',
              backgroundColor: '#FFF9F0'
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: 'warning.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconAlertTriangle size={22} color="white" />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography component="div" variant="subtitle1" sx={{ color: '#c67100' }}>
                  Elector{' '}
                  <Typography component="span" sx={{ fontWeight: 700 }}>
                    {kocId.trim()}
                  </Typography>{' '}
                  is assigned to committee{' '}
                  <Typography component="span" sx={{ fontWeight: 700 }}>
                    {searchError.match(/committee\s([^\s,]+)/i)?.[1] || 'unknown'}
                  </Typography>
                  , not{' '}
                  <Typography component="span" sx={{ fontWeight: 700 }}>
                    {selectedCommittee}
                  </Typography>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Click &quot;Add Elector&quot; to create this elector as pending approval
                </Typography>
              </Box>

              <Button
                size="small"
                startIcon={<IconUserPlus size={16} />}
                onClick={() => setShowAddDialog(true)}
                variant="contained"
                sx={{
                  backgroundColor: '#f9a825',
                  color: 'white',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#f57f17',
                    boxShadow: 'none'
                  }
                }}
              >
                Add Elector
              </Button>
            </Stack>
          </Paper>
          )
        )}

        {/* Search Result - Found but Already Attended */}
        {searchResult && searchResult.hasAttended && (
          <Paper
            elevation={4}
            sx={{
              p: 4,
              background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(251, 140, 0, 0.05) 100%)',
              border: '2px solid',
              borderColor: 'warning.main',
              borderRadius: 3,
              mb: 2
            }}
          >
            {/* Header with Icon */}
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: 'warning.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconAlertCircle size={32} color="white" />
              </Box>
              <Box>
                <Typography variant="h4" color="warning.dark" fontWeight="bold">
                  Already Attended
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This elector has already checked in
                </Typography>
              </Box>
            </Stack>

            {/* Details */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2
              }}
            >
              <Stack spacing={2}>
                {/* KOC ID + Name */}
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Chip
                      label={searchResult.kocId}
                      sx={{
                        height: 28,
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        backgroundColor: 'warning.main',
                        color: 'white'
                      }}
                    />
                  </Stack>
                  <Typography variant="h5" fontWeight="bold" color="text.primary">
                    {searchResult.fullName}
                  </Typography>
                </Box>

                {/* Attended At */}
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                    Attended At
                  </Typography>
                  <Typography variant="h6" color="warning.dark" fontWeight="bold">
                    {searchResult.attendedAt ? new Date(searchResult.attendedAt).toLocaleString() : 'N/A'}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            <TextField
              label="Notes (Optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special notes or observations..."
              fullWidth
              multiline
              rows={2}
              sx={{ mt: 3 }}
              disabled={markingLoading}
            />

            <Button
              variant="contained"
              color="warning"
              startIcon={<IconUserPlus size={20} />}
              onClick={handleAddPendingFromAttended}
              disabled={markingLoading}
              sx={{ mt: 2, fontWeight: 'bold', textTransform: 'none' }}
              fullWidth
            >
              Add as Pending
            </Button>
          </Paper>
        )}

        {/* Search Result - Found and Can Mark Attendance */}
        {searchResult && !searchResult.hasAttended && (
          <Paper
            elevation={0}
            sx={{
              mb: 2,
              p: { xs: 2, sm: 2.5 },
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'success.light',
              backgroundColor: '#F1F8F4'
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'success.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <IconCheck size={22} color="white" />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography component="div" variant="subtitle1" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                    Elector{' '}
                    <Typography component="span" sx={{ fontWeight: 700 }}>
                      {searchResult.kocId}
                    </Typography>{' '}
                    found
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="text.primary" sx={{ mt: 0.5 }}>
                    {searchResult.fullName}
                  </Typography>
                </Box>
              </Stack>

              <TextField
                label="Notes (Optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any special notes or observations..."
                fullWidth
                multiline
                rows={2}
                size="small"
              />

              <Button
                variant="contained"
                color="success"
                startIcon={markingLoading ? <CircularProgress size={16} color="inherit" /> : <IconCheck size={16} />}
                onClick={handleMarkAttendance}
                disabled={markingLoading}
                sx={{
                  fontWeight: 'bold',
                  textTransform: 'none',
                  py: 1.25
                }}
                fullWidth
              >
                {markingLoading ? 'Marking...' : 'Mark Attended'}
              </Button>
            </Stack>
          </Paper>
        )}

        {/* Quick Add Elector Dialog */}
        <QuickAddElectorDialog
          open={showAddDialog}
          kocId={kocId}
          committeeCode={selectedCommittee}
          onClose={() => setShowAddDialog(false)}
          onAdd={handleAddPendingElector}
          loading={markingLoading}
        />
      </CardContent>
    </Card>
  );
};

export default AttendanceSearch;
