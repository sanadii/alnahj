/**
 * Users Redux Selectors
 * Election Management System
 */

import { createSelector } from 'reselect';
import type { RootState } from 'store';
import type { UsersState } from 'types/users-management';

// ============================================================================
// BASE SELECTOR
// ============================================================================

const selectUsersState = (state: RootState): UsersState => state.users;

// ============================================================================
// MAIN SELECTOR
// ============================================================================

export const usersSelector = createSelector(selectUsersState, (usersState) => ({
  // Users
  users: usersState.users,
  currentUser: usersState.currentUser,
  userStats: usersState.userStats,

  // Pagination
  totalCount: usersState.totalCount,
  currentPage: usersState.currentPage,
  pageSize: usersState.pageSize,

  // UI State
  loading: usersState.loading,
  error: usersState.error,

  // Filters
  filters: usersState.filters
}));

// ============================================================================
// INDIVIDUAL SELECTORS
// ============================================================================

/**
 * Get users list
 */
export const selectUsers = createSelector([selectUsersState], (state) => state.users);

/**
 * Get current user
 */
export const selectCurrentUser = createSelector([selectUsersState], (state) => state.currentUser);

/**
 * Get user stats
 */
export const selectUserStats = createSelector([selectUsersState], (state) => state.userStats);

/**
 * Get loading state
 */
export const selectUsersLoading = createSelector([selectUsersState], (state) => state.loading);

/**
 * Get error state
 */
export const selectUsersError = createSelector([selectUsersState], (state) => state.error);

/**
 * Get total count
 */
export const selectUsersTotalCount = createSelector([selectUsersState], (state) => state.totalCount);

/**
 * Get current page
 */
export const selectUsersCurrentPage = createSelector([selectUsersState], (state) => state.currentPage);

/**
 * Get page size
 */
export const selectUsersPageSize = createSelector([selectUsersState], (state) => state.pageSize);

/**
 * Get filters
 */
export const selectUsersFilters = createSelector([selectUsersState], (state) => state.filters);

