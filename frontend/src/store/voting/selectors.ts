/**
 * Voting Redux Selectors
 * Election Management System
 */

import { createSelector } from 'reselect';
import type { RootState } from 'store';
import type { VotingState } from './types';

// ============================================================================
// BASE SELECTOR
// ============================================================================

const selectVotingState = (state: RootState): VotingState => state.voting;

// ============================================================================
// MAIN SELECTOR
// ============================================================================

export const votingSelector = createSelector(selectVotingState, (votingState) => ({
  // Voting data
  voteCounts: votingState.voteCounts,
  candidates: votingState.candidates,
  parties: votingState.parties,
  committeeEntries: votingState.committeeEntries,
  electionResults: votingState.electionResults,
  statistics: votingState.statistics,

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

// ============================================================================
// INDIVIDUAL SELECTORS
// ============================================================================

/**
 * Get vote counts
 */
export const selectVoteCounts = createSelector([selectVotingState], (state) => state.voteCounts);

/**
 * Get candidates
 */
export const selectCandidates = createSelector([selectVotingState], (state) => state.candidates);

/**
 * Get parties
 */
export const selectParties = createSelector([selectVotingState], (state) => state.parties);

/**
 * Get committee entries
 */
export const selectCommitteeEntries = createSelector([selectVotingState], (state) => state.committeeEntries);

/**
 * Get election results
 */
export const selectElectionResults = createSelector([selectVotingState], (state) => state.electionResults);

/**
 * Get statistics
 */
export const selectVotingStatistics = createSelector([selectVotingState], (state) => state.statistics);

/**
 * Get loading state
 */
export const selectVotingLoading = createSelector([selectVotingState], (state) => state.loading);

/**
 * Get error state
 */
export const selectVotingError = createSelector([selectVotingState], (state) => state.error);

/**
 * Get total count
 */
export const selectVotingTotalCount = createSelector([selectVotingState], (state) => state.totalCount);

/**
 * Get current page
 */
export const selectVotingCurrentPage = createSelector([selectVotingState], (state) => state.currentPage);

/**
 * Get page size
 */
export const selectVotingPageSize = createSelector([selectVotingState], (state) => state.pageSize);

/**
 * Get filters
 */
export const selectVotingFilters = createSelector([selectVotingState], (state) => state.filters);

/**
 * Derived completion + verification metrics for dashboards
 */
export const selectVotingCompletionMetrics = createSelector([selectVotingStatistics], (stats) => {
  if (!stats) {
    return {
      committeeCompletion: 0,
      verificationRate: 0,
      disputeRate: 0
    };
  }

  const committeeCompletion =
    stats.total_committees > 0 ? stats.committees_completed / stats.total_committees : 0;
  const verificationRate =
    stats.total_votes_recorded > 0 ? stats.verified_entries / stats.total_votes_recorded : 0;
  const disputeRate =
    stats.total_votes_recorded > 0 ? stats.disputed_entries / stats.total_votes_recorded : 0;

  return {
    committeeCompletion,
    verificationRate,
    disputeRate
  };
});

