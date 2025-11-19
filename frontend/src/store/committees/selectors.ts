/**
 * Committees Redux Selectors
 * Election Management System
 */

import { createSelector } from 'reselect';
import type { RootState } from 'store';

// ============================================================================
// BASE SELECTOR
// ============================================================================

const selectCommitteesState = (state: RootState) => state.committees;

// ============================================================================
// MAIN SELECTOR
// ============================================================================

export const committeesSelector = createSelector(selectCommitteesState, (committeesState) => ({
  // Committees
  committees: committeesState.committees,
  currentCommittee: committeesState.currentCommittee,
  committeeStatistics: committeesState.committeeStatistics,

  // Pagination
  totalCount: committeesState.totalCount,
  currentPage: committeesState.currentPage,
  pageSize: committeesState.pageSize,

  // UI State
  loading: committeesState.loading,
  error: committeesState.error,

  // Filters
  filters: committeesState.filters
}));

// ============================================================================
// INDIVIDUAL SELECTORS
// ============================================================================

/**
 * Get committees list
 */
export const selectCommittees = createSelector([selectCommitteesState], (state) => state.committees);

/**
 * Get current committee
 */
export const selectCurrentCommittee = createSelector([selectCommitteesState], (state) => state.currentCommittee);

/**
 * Get committee statistics
 */
export const selectCommitteeStatistics = createSelector([selectCommitteesState], (state) => state.committeeStatistics);

/**
 * Get loading state
 */
export const selectCommitteesLoading = createSelector([selectCommitteesState], (state) => state.loading);

/**
 * Get error state
 */
export const selectCommitteesError = createSelector([selectCommitteesState], (state) => state.error);

/**
 * Get total count
 */
export const selectCommitteesTotalCount = createSelector([selectCommitteesState], (state) => state.totalCount);

/**
 * Get current page
 */
export const selectCommitteesCurrentPage = createSelector([selectCommitteesState], (state) => state.currentPage);

/**
 * Get page size
 */
export const selectCommitteesPageSize = createSelector([selectCommitteesState], (state) => state.pageSize);

/**
 * Get filters
 */
export const selectCommitteesFilters = createSelector([selectCommitteesState], (state) => state.filters);

