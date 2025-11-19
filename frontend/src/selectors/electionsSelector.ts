// Selectors/electionsSelector.ts
import { createSelector } from 'reselect';
import type { RootState } from 'store';

const selectElectionsState = (state: RootState) => state.elections;

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
