// Selectors/votingSelector.ts
import { createSelector } from 'reselect';
import type { RootState } from 'store';

const selectVotingState = (state: RootState) => state.voting;

export const votingSelector = createSelector(selectVotingState, (votingState) => ({
  // Voting
  candidates: votingState.candidates,
  voteCounts: votingState.voteCounts,
  currentVoteCount: votingState.currentVoteCount,
  results: votingState.results,

  // Pagination
  totalCount: votingState.totalCount,
  currentPage: votingState.currentPage,
  pageSize: votingState.pageSize,

  // UI State
  loading: votingState.loading,
  error: votingState.error,

  // Filters
  filters: votingState.filters
}));
