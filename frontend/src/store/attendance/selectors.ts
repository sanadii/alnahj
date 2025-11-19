/**
 * Attendance Redux Selectors
 * Election Management System
 */

import { createSelector } from 'reselect';
import type { RootState } from 'store';
import type { AttendanceState } from 'types/attendance';

// ============================================================================
// BASE SELECTOR
// ============================================================================

const selectAttendanceState = (state: RootState): AttendanceState => state.attendance;

// ============================================================================
// MAIN SELECTOR
// ============================================================================

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
  totalCount: attendanceState.totalCount,
  currentPage: attendanceState.currentPage,
  pageSize: attendanceState.pageSize,
  hasMore: attendanceState.hasMore
}));

// ============================================================================
// INDIVIDUAL SELECTORS
// ============================================================================

/**
 * Get attendance items
 */
export const selectAttendanceItems = createSelector([selectAttendanceState], (state) => state.items);

/**
 * Get current attendance item
 */
export const selectAttendanceItem = createSelector([selectAttendanceState], (state) => state.item);

/**
 * Get search result
 */
export const selectAttendanceSearchResult = createSelector([selectAttendanceState], (state) => state.searchResult);

/**
 * Get statistics
 */
export const selectAttendanceStatistics = createSelector([selectAttendanceState], (state) => state.statistics);

/**
 * Get committee list
 */
export const selectAttendanceCommitteeList = createSelector([selectAttendanceState], (state) => state.committeeList);

/**
 * Get loading state
 */
export const selectAttendanceLoading = createSelector([selectAttendanceState], (state) => state.loading);

/**
 * Get search loading state
 */
export const selectAttendanceSearchLoading = createSelector([selectAttendanceState], (state) => state.searchLoading);

/**
 * Get marking loading state
 */
export const selectAttendanceMarkingLoading = createSelector([selectAttendanceState], (state) => state.markingLoading);

/**
 * Get stats loading state
 */
export const selectAttendanceStatsLoading = createSelector([selectAttendanceState], (state) => state.statsLoading);

/**
 * Get error state
 */
export const selectAttendanceError = createSelector([selectAttendanceState], (state) => state.error);

/**
 * Get search error state
 */
export const selectAttendanceSearchError = createSelector([selectAttendanceState], (state) => state.searchError);

/**
 * Get total count
 */
export const selectAttendanceTotalCount = createSelector([selectAttendanceState], (state) => state.totalCount);

/**
 * Get current page
 */
export const selectAttendanceCurrentPage = createSelector([selectAttendanceState], (state) => state.currentPage);

/**
 * Get page size
 */
export const selectAttendancePageSize = createSelector([selectAttendanceState], (state) => state.pageSize);

/**
 * Get has more flag
 */
export const selectAttendanceHasMore = createSelector([selectAttendanceState], (state) => state.hasMore);

