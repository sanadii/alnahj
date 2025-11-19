// Selectors/committeesSelector.ts
import { createSelector } from 'reselect';
import type { RootState } from 'store';

const selectCommitteesState = (state: RootState) => state.committees;

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
