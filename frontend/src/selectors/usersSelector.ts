// Selectors/usersSelector.ts
import { createSelector } from 'reselect';
import type { RootState } from 'store';

const selectUsersManagementState = (state: RootState) => state.users;

export const usersSelector = createSelector(selectUsersManagementState, (usersState) => ({
  // Users
  users: usersState.users,
  currentUser: usersState.currentUser,
  supervisors: usersState.supervisors,

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
