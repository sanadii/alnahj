/**
 * AttendanceList Component
 * Premium card-based list of attendance records for right sidebar
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Stack,
  Alert,
  Tooltip,
  Paper,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  useMediaQuery
} from '@mui/material';
import { IconTrash, IconRefresh, IconUserCheck, IconChevronDown } from '@tabler/icons-react';
import { useTheme } from '@mui/material/styles';
import { RootState } from 'store';
import { getAttendancesRequest, deleteAttendanceRequest } from 'store/attendance/actions';
import { DeleteConfirmationDialog, LoadingState, EmptyState } from 'shared/components';
import CommitteeCards from './CommitteeCards';
import { useAppSelector } from 'store';

// ============================================================================
// COMPONENT
// ============================================================================

interface AttendanceListProps {
  selectedCommittee?: string;
  isAllView?: boolean;
  onCommitteeSelect?: (committeeCode: string) => void;
}

const AttendanceList: React.FC<AttendanceListProps> = ({ selectedCommittee, isAllView = false, onCommitteeSelect }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { items, loading, error, totalCount, currentPage, pageSize, hasMore } = useSelector((state: RootState) => state.attendance);
  const { committees } = useAppSelector((state) => state.committees);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [displayLimit, setDisplayLimit] = useState(20); // Show first 20 items, then "Load More"

  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = React.useState<{
    open: boolean;
    id: number | null;
    name: string;
  }>({
    open: false,
    id: null,
    name: ''
  });

  // Load attendance records when committee changes
  useEffect(() => {
    const filters = selectedCommittee ? { committee__code: selectedCommittee } : {};
    dispatch(getAttendancesRequest(filters, 1, pageSize));
    setDisplayLimit(20); // Reset display limit when committee changes
  }, [dispatch, selectedCommittee, pageSize]);

  // Auto-refresh when new attendance is marked (totalCount changes)
  // The list automatically updates via Redux state, no action needed

  // Handle refresh
  const handleRefresh = () => {
    const filters = selectedCommittee ? { committee__code: selectedCommittee } : {};
    dispatch(getAttendancesRequest(filters, 1, pageSize));
    setDisplayLimit(20);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (hasMore) {
      const nextPage = currentPage + 1;
      const filters = selectedCommittee ? { committee__code: selectedCommittee } : {};
      dispatch(getAttendancesRequest(filters, nextPage, pageSize));
    } else {
      // If no pagination, just show more items
      setDisplayLimit(displayLimit + 20);
    }
  };

  // Handle delete
  const handleDelete = (id: number, electorName: string) => {
    setDeleteDialog({
      open: true,
      id,
      name: electorName
    });
  };

  const confirmDelete = () => {
    if (deleteDialog.id) {
      dispatch(deleteAttendanceRequest(deleteDialog.id));
    }
    setDeleteDialog({ open: false, id: null, name: '' });
  };

  return (
    <>
      <Box>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h6">{isAllView ? "All Committees' Attendance" : "Today's Attendance"}</Typography>
            <Typography variant="caption" color="text.secondary">
              {items.length} record{items.length !== 1 ? 's' : ''} loaded {isAllView ? 'across all committees' : ''}
            </Typography>
          </Box>
          <IconButton onClick={handleRefresh} disabled={loading} title="Refresh" size="small">
            <IconRefresh size={18} />
          </IconButton>
        </Stack>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && items.length === 0 ? (
          <LoadingState message="Loading attendance..." compact size={24} />
        ) : (
          <>
            {/* Empty State */}
            {items.length === 0 ? (
              <EmptyState
                icon={<IconUserCheck size={48} />}
                title="No attendance records yet"
                description="Electors will appear here as they check in"
                compact
              />
            ) : (
              <>
                {isAllView && isMobile ? (
                  <CommitteeCards committees={committees || []} onCommitteeSelect={(code) => onCommitteeSelect?.(code)} />
                ) : isAllView ? (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>KOC ID</TableCell>
                          <TableCell>Elector</TableCell>
                          <TableCell>Committee</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Attended At</TableCell>
                          <TableCell>Marked By</TableCell>
                          <TableCell>Notes</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {items.slice(0, displayLimit).map((attendance) => (
                          <TableRow key={attendance.id} hover>
                            <TableCell>
                              <Chip
                                label={attendance.electorKocId || 'N/A'}
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  backgroundColor: attendance.electorGender === 'FEMALE' ? '#E91E63' : theme.palette.primary.main,
                                  color: '#fff'
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                {attendance.electorName || 'Unknown Elector'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{attendance.committeeName || '—'}</Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={attendance.status === 'PENDING' ? 'Pending' : 'Attended'}
                                color={attendance.status === 'PENDING' ? 'warning' : 'success'}
                                variant={attendance.status === 'PENDING' ? 'outlined' : 'filled'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {attendance.attendedAt ? new Date(attendance.attendedAt).toLocaleTimeString() : '—'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{attendance.markedByName || '—'}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {attendance.notes || '—'}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip title="Delete">
                                <IconButton size="small" color="error" onClick={() => handleDelete(attendance.id, attendance.electorName)}>
                                  <IconTrash size={16} />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Stack spacing={1.5}>
                    {items.slice(0, displayLimit).map((attendance) => {
                      const isFemale = attendance.electorGender === 'FEMALE';
                      const accentColor = isFemale ? '#E91E63' : theme.palette.primary.main;
                      return (
                        <Card
                          key={attendance.id}
                          elevation={1}
                          sx={{
                            p: { xs: 1.5, sm: 2 },
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            position: 'relative',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              boxShadow: theme.shadows[4],
                              transform: 'translateY(-2px)',
                              borderColor: accentColor
                            }
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5, flexWrap: 'wrap' }}>
                                <Chip
                                  label={attendance.electorKocId || 'N/A'}
                                  size="small"
                                  sx={{
                                    height: 24,
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    backgroundColor: accentColor,
                                    color: 'white'
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  fontWeight={600}
                                  sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                >
                                  {attendance.electorName || 'Unknown Elector'}
                                </Typography>
                                {attendance.status === 'PENDING' && (
                                  <Chip label="Pending" color="warning" variant="outlined" size="small" sx={{ ml: 0.5 }} />
                                )}
                              </Stack>

                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                flexWrap="wrap"
                                divider={attendance.notes ? <Typography color="text.secondary">|</Typography> : null}
                              >
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                  🕐 {attendance.attendedAt ? new Date(attendance.attendedAt).toLocaleTimeString() : '—'}
                                </Typography>
                                {attendance.notes && (
                                  <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                                    📝 {attendance.notes}
                                  </Typography>
                                )}
                              </Stack>
                            </Box>

                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(attendance.id, attendance.electorName)}
                                sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
                              >
                                <IconTrash size={16} />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Card>
                      );
                    })}
                  </Stack>
                )}

                {/* Load More / Show More Button */}
                {(items.length > displayLimit || hasMore) && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    {hasMore ? (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleLoadMore}
                        disabled={loading}
                        startIcon={loading ? null : <IconChevronDown size={16} />}
                        fullWidth
                      >
                        {loading ? 'Loading...' : `Load More (${totalCount - items.length} remaining)`}
                      </Button>
                    ) : items.length > displayLimit ? (
                      <Button variant="text" size="small" onClick={() => setDisplayLimit(displayLimit + 20)} fullWidth>
                        Show More ({items.length - displayLimit} more)
                      </Button>
                    ) : null}
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Box>

      <DeleteConfirmationDialog
        open={deleteDialog.open}
        title="Delete Attendance Record"
        itemName={deleteDialog.name}
        itemType="attendance"
        isDeleting={loading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ open: false, id: null, name: '' })}
      />
    </>
  );
};

export default AttendanceList;
