/**
 * Guarantees Redux Selectors
 * Election Management System
 */

import { createSelector } from 'reselect';
import type { RootState } from 'store';
import type { GuaranteeState } from './types';
import type { GuaranteeListItem } from 'types/guarantees';

// ============================================================================
// BASE SELECTOR
// ============================================================================

const selectGuaranteesState = (state: RootState): GuaranteeState => state.guarantees;

// ============================================================================
// MAIN SELECTOR
// ============================================================================

export const guaranteesSelector = createSelector(selectGuaranteesState, (guaranteesState) => ({
  // Guarantees
  guarantees: guaranteesState.guarantees,
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

// ============================================================================
// INDIVIDUAL SELECTORS
// ============================================================================

/**
 * Get guarantees list
 */
export const selectGuarantees = createSelector([selectGuaranteesState], (state) => state.guarantees);

/**
 * Get guarantee groups
 */
export const selectGuaranteeGroups = createSelector([selectGuaranteesState], (state) => state.groups);

/**
 * Get guarantee statistics
 */
export const selectGuaranteeStatistics = createSelector([selectGuaranteesState], (state) => state.statistics);

/**
 * Get loading state
 */
export const selectGuaranteesLoading = createSelector([selectGuaranteesState], (state) => state.loading);

/**
 * Get error state
 */
export const selectGuaranteesError = createSelector([selectGuaranteesState], (state) => state.error);

/**
 * Get total count
 */
export const selectGuaranteesTotalCount = createSelector([selectGuaranteesState], (state) => state.totalCount);

/**
 * Get current page
 */
export const selectGuaranteesCurrentPage = createSelector([selectGuaranteesState], (state) => state.currentPage);

/**
 * Get page size
 */
export const selectGuaranteesPageSize = createSelector([selectGuaranteesState], (state) => state.pageSize);

/**
 * Get filters
 */
export const selectGuaranteesFilters = createSelector([selectGuaranteesState], (state) => state.filters);

/**
 * Split guarantees by status (guaranteed vs pending)
 */
export const selectGuaranteesByStatus = createSelector([selectGuarantees], (guarantees) => {
  const result = {
    guaranteed: [] as GuaranteeListItem[],
    pending: [] as GuaranteeListItem[]
  };

  if (!guarantees) {
    return result;
  }

  for (const guarantee of guarantees) {
    if (guarantee.guaranteeStatus === 'GUARANTEED') {
      result.guaranteed.push(guarantee);
    } else {
      result.pending.push(guarantee);
    }
  }

  return result;
});

/**
 * Group guarantees by committee name for dashboards
 */
export const selectGuaranteesGroupedByCommittee = createSelector([selectGuarantees], (guarantees) => {
  return guarantees.reduce<Record<string, GuaranteeListItem[]>>((acc, guarantee) => {
    const committee = guarantee.electorCommitteeName || 'Unassigned';
    if (!acc[committee]) {
      acc[committee] = [];
    }
    acc[committee].push(guarantee);
    return acc;
  }, {});
});

