// ==============================|| ELECTORS SELECTOR ||============================== //
// Election Management System - Electors State Selector

import { createSelector } from 'reselect';
import type { RootState } from 'store';
import type { ElectorsState } from 'store/electors/reducer';

/**
 * Base selector to get electors state
 */
const selectElectorsState = (state: RootState): ElectorsState => state.electors;

/**
 * Memoized selectors for electors state
 * Note: createSelector will only recompute when electorsState reference changes
 */
export const electorsSelector = createSelector([selectElectorsState], (electorsState) => ({
  electors: electorsState.electors,
  currentElector: electorsState.currentElector,
  electorStats: electorsState.electorStats,
  groups: electorsState.groups,
  totalCount: electorsState.totalCount,
  currentPage: electorsState.currentPage,
  pageSize: electorsState.pageSize,
  loading: electorsState.loading,
  error: electorsState.error,
  filters: electorsState.filters
}));

/**
 * Get electors list
 */
export const selectElectors = createSelector([selectElectorsState], (state) => state.electors);

/**
 * Get current elector
 */
export const selectCurrentElector = createSelector([selectElectorsState], (state) => state.currentElector);

/**
 * Get elector stats
 */
export const selectElectorStats = createSelector([selectElectorsState], (state) => state.electorStats);

/**
 * Get loading state
 */
export const selectElectorsLoading = createSelector([selectElectorsState], (state) => state.loading);

/**
 * Get error state
 */
export const selectElectorsError = createSelector([selectElectorsState], (state) => state.error);

/**
 * Get total count
 */
export const selectElectorsTotalCount = createSelector([selectElectorsState], (state) => state.totalCount);

/**
 * Get filters
 */
export const selectElectorsFilters = createSelector([selectElectorsState], (state) => state.filters);

/**
 * Get guarantee groups (loaded with electors)
 */
export const electorsGroupsSelector = createSelector([selectElectorsState], (state) => state.groups || []);

/**
 * Electors sorted alphabetically (case-insensitive) by `fullName`
 */
export const selectElectorsSortedByName = createSelector([selectElectors], (electors) => {
  if (!electors || electors.length <= 1) {
    return electors;
  }

  return [...electors].sort((a, b) => {
    const nameA = (a.fullName || '').toLowerCase();
    const nameB = (b.fullName || '').toLowerCase();
    return nameA.localeCompare(nameB);
  });
});

/**
 * Electors filtered by current search term (matches `fullName` or `kocId`)
 */
export const selectElectorsBySearch = createSelector(
  [selectElectors, selectElectorsFilters],
  (electors, filters) => {
    const search = filters?.search?.trim().toLowerCase();
    if (!search) return electors;

    return electors.filter((elector) => {
      const name = elector.fullName?.toLowerCase() ?? '';
      const kocId = elector.kocId?.toLowerCase() ?? '';
      return name.includes(search) || kocId.includes(search);
    });
  }
);
