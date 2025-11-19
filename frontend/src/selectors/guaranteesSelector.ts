// Selectors/guaranteesSelector.ts
import { createSelector } from 'reselect';
import type { RootState } from 'store';

const selectGuaranteesState = (state: RootState) => state.guarantees;

export const guaranteesSelector = createSelector(selectGuaranteesState, (guaranteesState) => ({
  // Guarantees
  guarantees: guaranteesState.guarantees,
  currentGuarantee: guaranteesState.currentGuarantee,
  groups: guaranteesState.groups,
  statistics: guaranteesState.statistics,

  // Pagination
  totalCount: guaranteesState.totalCount,
  currentPage: guaranteesState.currentPage,
  pageSize: guaranteesState.pageSize,

  // UI State
  loading: guaranteesState.loading,
  error: guaranteesState.error,

  // Filters
  filters: guaranteesState.filters
}));
