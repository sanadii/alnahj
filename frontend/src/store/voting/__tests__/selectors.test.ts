import { describe, it, expect } from 'vitest';
import { selectVotingCompletionMetrics } from '../selectors';
import type { RootState } from 'store';
import type { VotingState } from '../types';

const baseVotingState: VotingState = {
  voteCounts: [],
  candidates: [],
  parties: [],
  committeeEntries: [],
  electionResults: null,
  statistics: null,
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 25,
  filters: {}
};

const createState = (overrides: Partial<VotingState>): RootState =>
  ({
    voting: {
      ...baseVotingState,
      ...overrides
    }
  } as unknown as RootState);

describe('voting selectors', () => {
  it('selectVotingCompletionMetrics calculates rates', () => {
    const state = createState({
      statistics: {
        total_committees: 10,
        committees_completed: 7,
        committees_pending: 3,
        total_ballots_cast: 1000,
        total_invalid_ballots: 50,
        total_valid_ballots: 950,
        total_votes_recorded: 800,
        verified_entries: 600,
        pending_entries: 150,
        disputed_entries: 50
      }
    });

    const metrics = selectVotingCompletionMetrics(state);
    expect(metrics.committeeCompletion).toBeCloseTo(0.7);
    expect(metrics.verificationRate).toBeCloseTo(0.75);
    expect(metrics.disputeRate).toBeCloseTo(0.0625);
  });

  it('selectVotingCompletionMetrics handles missing stats', () => {
    const state = createState({ statistics: null });
    const metrics = selectVotingCompletionMetrics(state);
    expect(metrics.committeeCompletion).toBe(0);
    expect(metrics.verificationRate).toBe(0);
    expect(metrics.disputeRate).toBe(0);
  });
});

