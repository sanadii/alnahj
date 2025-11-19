/**
 * Elections Redux Selectors
 * Election Management System
 */

import { createSelector } from 'reselect';
import type { RootState } from 'store';

// ============================================================================
// BASE SELECTOR
// ============================================================================

const selectElectionsState = (state: RootState) => state.elections;

// ============================================================================
// MAIN SELECTOR
// ============================================================================

export const electionsSelector = createSelector(selectElectionsState, (electionsState) => ({
  // Elections
  elections: electionsState.elections,
  currentElection: electionsState.currentElection,
  activeElection: electionsState.activeElection,

  // Pagination
  totalCount: electionsState.totalCount,
  currentPage: electionsState.currentPage,
  pageSize: electionsState.pageSize,

  // UI State
  loading: electionsState.loading,
  error: electionsState.error,

  // Filters
  filters: electionsState.filters
}));

// ============================================================================
// INDIVIDUAL SELECTORS
// ============================================================================

/**
 * Get elections list
 */
export const selectElections = createSelector([selectElectionsState], (state) => state.elections);

/**
 * Get current election
 */
export const selectCurrentElection = createSelector([selectElectionsState], (state) => state.currentElection);

/**
 * Get active election
 */
export const selectActiveElection = createSelector([selectElectionsState], (state) => state.activeElection);

/**
 * Get loading state
 */
export const selectElectionsLoading = createSelector([selectElectionsState], (state) => state.loading);

/**
 * Get error state
 */
export const selectElectionsError = createSelector([selectElectionsState], (state) => state.error);

/**
 * Get total count
 */
export const selectElectionsTotalCount = createSelector([selectElectionsState], (state) => state.totalCount);

/**
 * Get current page
 */
export const selectElectionsCurrentPage = createSelector([selectElectionsState], (state) => state.currentPage);

/**
 * Get page size
 */
export const selectElectionsPageSize = createSelector([selectElectionsState], (state) => state.pageSize);

/**
 * Get filters
 */
export const selectElectionsFilters = createSelector([selectElectionsState], (state) => state.filters);

