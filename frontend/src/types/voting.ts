/**
 * Voting and Vote Counting Types
 * Election Management System
 */

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export type VoteCountStatus = 'PENDING' | 'VERIFIED' | 'DISPUTED';
export type ResultsStatus = 'DRAFT' | 'PRELIMINARY' | 'FINAL' | 'PUBLISHED';

export const VoteCountStatusLabels: Record<VoteCountStatus, string> = {
  PENDING: 'Pending',
  VERIFIED: 'Verified',
  DISPUTED: 'Disputed'
};

export const ResultsStatusLabels: Record<ResultsStatus, string> = {
  DRAFT: 'Draft',
  PRELIMINARY: 'Preliminary',
  FINAL: 'Final',
  PUBLISHED: 'Published'
};

// ============================================================================
// CANDIDATE & PARTY INTERFACES
// ============================================================================

export interface Party {
  id: number;
  election: number;
  name: string;
  color: string;
  logo?: string | null;
  description: string;
  isActive: boolean;
  candidateCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Candidate {
  id: number;
  election: number;
  name: string;
  candidateNumber: number;
  party: number | null;
  partyName: string | null;
  partyColor: string | null;
  partyAffiliation: string | null;
  photo?: string | null;
  isActive: boolean;
  totalVotes: number;
  votePercentage: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// VOTE COUNT INTERFACES
// ============================================================================

export interface VoteCount {
  id: number;
  election: number;
  election_name: string;
  committee: number;
  committee_code: string;
  committee_name: string;
  candidate: number;
  candidate_name: string;
  candidate_number: number;
  vote_count: number;
  status: VoteCountStatus;
  is_verified: boolean;
  verified_by: number | null;
  verified_by_name: string | null;
  verified_at: string | null;
  entered_by: number;
  entered_by_name: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface VoteCountCreateData {
  election: number;
  committee: number;
  candidate: number;
  vote_count: number;
  notes?: string;
}

export interface VoteCountUpdateData {
  vote_count?: number;
  notes?: string;
  status?: VoteCountStatus;
}

export interface BulkVoteEntryData {
  committee_id: number;
  total_ballots_cast: number;
  invalid_ballots: number;
  vote_counts: {
    candidate_id: number;
    vote_count: number;
  }[];
  notes?: string;
}

export interface PartyFormData {
  name: string;
  color: string;
  description: string;
  logo?: string | null;
}

export interface PartyCreateData extends PartyFormData {
  election: number;
}

// ============================================================================
// COMMITTEE VOTE ENTRY
// ============================================================================

export interface CommitteeVoteEntry {
  id: number;
  election: number;
  committee: number;
  committee_code: string;
  committee_name: string;
  total_ballots_cast: number;
  invalid_ballots: number;
  valid_ballots: number;
  status: VoteCountStatus;
  is_verified: boolean;
  entered_by: number;
  entered_by_name: string;
  verified_by: number | null;
  verified_by_name: string | null;
  verified_at: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// ELECTION RESULTS
// ============================================================================

export interface CandidateResult {
  candidate_id: number;
  candidate_name: string;
  candidate_number: number;
  party_name: string | null;
  party_color: string | null;
  total_votes: number;
  vote_percentage: number;
  rank: number;
  is_winner: boolean;
}

export interface CommitteeResult {
  committee_id: number;
  committee_code: string;
  committee_name: string;
  total_ballots: number;
  invalid_ballots: number;
  valid_ballots: number;
  turnout_percentage: number;
  candidate_results: CandidateResult[];
}

export interface ElectionResults {
  id: number;
  election: number;
  election_name: string;
  status: ResultsStatus;
  total_registered_electors: number;
  total_attendance: number;
  total_ballots_cast: number;
  total_invalid_ballots: number;
  total_valid_ballots: number;
  turnout_percentage: number;
  winning_candidate_ids: number[];
  candidate_results: CandidateResult[];
  committee_results: CommitteeResult[];
  generated_by: number | null;
  generated_by_name: string | null;
  generated_at: string | null;
  published_by: number | null;
  published_by_name: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// FILTERS
// ============================================================================

export interface VoteCountFilters {
  election?: number;
  committee?: number;
  candidate?: number;
  status?: VoteCountStatus | '';
  is_verified?: boolean;
  entered_by?: number;
  search?: string;
  ordering?: string;
  page?: number;
  pageSize?: number;
}

export interface CandidateFilters {
  election?: number;
  party?: number;
  is_active?: boolean;
  search?: string;
  ordering?: string;
}

// ============================================================================
// STATISTICS
// ============================================================================

export interface VotingStatistics {
  total_committees: number;
  committees_completed: number;
  committees_pending: number;
  total_ballots_cast: number;
  total_invalid_ballots: number;
  total_valid_ballots: number;
  total_votes_recorded: number;
  verified_entries: number;
  pending_entries: number;
  disputed_entries: number;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const getStatusBadgeProps = (status: VoteCountStatus): { color: 'success' | 'warning' | 'error'; label: string } => {
  switch (status) {
    case 'VERIFIED':
      return { color: 'success', label: VoteCountStatusLabels.VERIFIED };
    case 'PENDING':
      return { color: 'warning', label: VoteCountStatusLabels.PENDING };
    case 'DISPUTED':
      return { color: 'error', label: VoteCountStatusLabels.DISPUTED };
    default:
      return { color: 'warning', label: 'Unknown' };
  }
};

export const getResultsStatusBadgeProps = (status: ResultsStatus): { color: 'default' | 'primary' | 'success' | 'info'; label: string } => {
  switch (status) {
    case 'DRAFT':
      return { color: 'default', label: ResultsStatusLabels.DRAFT };
    case 'PRELIMINARY':
      return { color: 'info', label: ResultsStatusLabels.PRELIMINARY };
    case 'FINAL':
      return { color: 'primary', label: ResultsStatusLabels.FINAL };
    case 'PUBLISHED':
      return { color: 'success', label: ResultsStatusLabels.PUBLISHED };
    default:
      return { color: 'default', label: 'Unknown' };
  }
};

export const formatVoteCount = (count: number): string => {
  return count.toLocaleString();
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};
