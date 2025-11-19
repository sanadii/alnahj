// Selectors/attendanceSelector.ts
import { createSelector } from 'reselect';
import type { RootState } from 'store';

const selectAttendanceState = (state: RootState) => state.attendance;

export const attendanceSelector = createSelector(selectAttendanceState, (attendanceState) => ({
  // Attendance data
  items: attendanceState.items,
  item: attendanceState.item,
  searchResult: attendanceState.searchResult,
  statistics: attendanceState.statistics,
  committeeList: attendanceState.committeeList,

  // Loading states
  loading: attendanceState.loading,
  searchLoading: attendanceState.searchLoading,
  markingLoading: attendanceState.markingLoading,
  statsLoading: attendanceState.statsLoading,

  // Error states
  error: attendanceState.error,
  searchError: attendanceState.searchError,

  // Metadata
  totalCount: attendanceState.totalCount
}));
