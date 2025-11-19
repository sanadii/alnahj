/**
 * Voting Redux Types
 * Election Management System - TypeScript Interfaces Only
 */

import type {
  VoteCount,
  Candidate,
  Party,
  CommitteeVoteEntry,
  ElectionResults,
  VoteCountFilters,
  VoteCountCreateData,
  VoteCountUpdateData,
  BulkVoteEntryData,
  VotingStatistics
} from 'types/voting';

import * as ActionTypes from './actionTypes';

// ============================================================================
// STATE INTERFACE
// ============================================================================

export interface VotingState {
  voteCounts: VoteCount[];
  candidates: Candidate[];
  parties: Party[];
  committeeEntries: CommitteeVoteEntry[];
  electionResults: ElectionResults | null;
  statistics: VotingStatistics | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  filters: VoteCountFilters;
}

// ============================================================================
// ACTION INTERFACES
// ============================================================================

// Vote Counts Actions
export interface GetVoteCountsRequestAction {
  type: typeof ActionTypes.GET_VOTE_COUNTS_REQUEST;
  payload: VoteCountFilters;
}

export interface GetVoteCountsSuccessAction {
  type: typeof ActionTypes.GET_VOTE_COUNTS_SUCCESS;
  payload: {
    voteCounts: VoteCount[];
    count: number;
  };
}

export interface GetVoteCountsFailureAction {
  type: typeof ActionTypes.GET_VOTE_COUNTS_FAILURE;
  payload: string;
}

export interface CreateVoteCountRequestAction {
  type: typeof ActionTypes.CREATE_VOTE_COUNT_REQUEST;
  payload: VoteCountCreateData;
}

export interface CreateVoteCountSuccessAction {
  type: typeof ActionTypes.CREATE_VOTE_COUNT_SUCCESS;
  payload: string;
}

export interface CreateVoteCountFailureAction {
  type: typeof ActionTypes.CREATE_VOTE_COUNT_FAILURE;
  payload: string;
}

export interface UpdateVoteCountRequestAction {
  type: typeof ActionTypes.UPDATE_VOTE_COUNT_REQUEST;
  payload: {
    id: number;
    data: VoteCountUpdateData;
  };
}

export interface UpdateVoteCountSuccessAction {
  type: typeof ActionTypes.UPDATE_VOTE_COUNT_SUCCESS;
  payload: string;
}

export interface UpdateVoteCountFailureAction {
  type: typeof ActionTypes.UPDATE_VOTE_COUNT_FAILURE;
  payload: string;
}

export interface DeleteVoteCountRequestAction {
  type: typeof ActionTypes.DELETE_VOTE_COUNT_REQUEST;
  payload: number;
}

export interface DeleteVoteCountSuccessAction {
  type: typeof ActionTypes.DELETE_VOTE_COUNT_SUCCESS;
  payload: {
    id: number;
    message: string;
  };
}

export interface DeleteVoteCountFailureAction {
  type: typeof ActionTypes.DELETE_VOTE_COUNT_FAILURE;
  payload: string;
}

export interface VerifyVoteCountRequestAction {
  type: typeof ActionTypes.VERIFY_VOTE_COUNT_REQUEST;
  payload: number;
}

export interface VerifyVoteCountSuccessAction {
  type: typeof ActionTypes.VERIFY_VOTE_COUNT_SUCCESS;
  payload: string;
}

export interface VerifyVoteCountFailureAction {
  type: typeof ActionTypes.VERIFY_VOTE_COUNT_FAILURE;
  payload: string;
}

export interface BulkVoteEntryRequestAction {
  type: typeof ActionTypes.BULK_VOTE_ENTRY_REQUEST;
  payload: BulkVoteEntryData;
}

export interface BulkVoteEntrySuccessAction {
  type: typeof ActionTypes.BULK_VOTE_ENTRY_SUCCESS;
  payload: string;
}

export interface BulkVoteEntryFailureAction {
  type: typeof ActionTypes.BULK_VOTE_ENTRY_FAILURE;
  payload: string;
}

// Candidates Actions
export interface GetCandidatesRequestAction {
  type: typeof ActionTypes.GET_CANDIDATES_REQUEST;
  payload?: { election?: number };
}

export interface GetCandidatesSuccessAction {
  type: typeof ActionTypes.GET_CANDIDATES_SUCCESS;
  payload: Candidate[];
}

export interface GetCandidatesFailureAction {
  type: typeof ActionTypes.GET_CANDIDATES_FAILURE;
  payload: string;
}

export interface CreateCandidateRequestAction {
  type: typeof ActionTypes.CREATE_CANDIDATE_REQUEST;
  payload:
    | FormData
    | {
        election: number;
        name: string;
        candidateNumber: number;
        party?: number | null;
        remove_photo?: boolean;
      };
}

export interface CreateCandidateSuccessAction {
  type: typeof ActionTypes.CREATE_CANDIDATE_SUCCESS;
  payload: Candidate;
}

export interface CreateCandidateFailureAction {
  type: typeof ActionTypes.CREATE_CANDIDATE_FAILURE;
  payload: string;
}

export interface UpdateCandidateRequestAction {
  type: typeof ActionTypes.UPDATE_CANDIDATE_REQUEST;
  payload: {
    id: number;
    data:
      | FormData
      | (Partial<Candidate> & {
          remove_photo?: boolean;
        });
  };
}

export interface UpdateCandidateSuccessAction {
  type: typeof ActionTypes.UPDATE_CANDIDATE_SUCCESS;
  payload: Candidate;
}

export interface UpdateCandidateFailureAction {
  type: typeof ActionTypes.UPDATE_CANDIDATE_FAILURE;
  payload: string;
}

export interface DeleteCandidateRequestAction {
  type: typeof ActionTypes.DELETE_CANDIDATE_REQUEST;
  payload: number;
}

export interface DeleteCandidateSuccessAction {
  type: typeof ActionTypes.DELETE_CANDIDATE_SUCCESS;
  payload: { id: number; message: string };
}

export interface DeleteCandidateFailureAction {
  type: typeof ActionTypes.DELETE_CANDIDATE_FAILURE;
  payload: string;
}

// Parties Actions
export interface GetPartiesRequestAction {
  type: typeof ActionTypes.GET_PARTIES_REQUEST;
  payload?: { election?: number };
}

export interface GetPartiesSuccessAction {
  type: typeof ActionTypes.GET_PARTIES_SUCCESS;
  payload: Party[];
}

export interface GetPartiesFailureAction {
  type: typeof ActionTypes.GET_PARTIES_FAILURE;
  payload: string;
}

// Election Results Actions
export interface GetElectionResultsRequestAction {
  type: typeof ActionTypes.GET_ELECTION_RESULTS_REQUEST;
  payload: number; // election ID
}

export interface GetElectionResultsSuccessAction {
  type: typeof ActionTypes.GET_ELECTION_RESULTS_SUCCESS;
  payload: ElectionResults;
}

export interface GetElectionResultsFailureAction {
  type: typeof ActionTypes.GET_ELECTION_RESULTS_FAILURE;
  payload: string;
}

export interface GenerateResultsRequestAction {
  type: typeof ActionTypes.GENERATE_RESULTS_REQUEST;
  payload: number; // election ID
}

export interface GenerateResultsSuccessAction {
  type: typeof ActionTypes.GENERATE_RESULTS_SUCCESS;
  payload: string;
}

export interface GenerateResultsFailureAction {
  type: typeof ActionTypes.GENERATE_RESULTS_FAILURE;
  payload: string;
}

// Statistics Actions
export interface GetVotingStatisticsRequestAction {
  type: typeof ActionTypes.GET_VOTING_STATISTICS_REQUEST;
  payload?: number; // election ID
}

export interface GetVotingStatisticsSuccessAction {
  type: typeof ActionTypes.GET_VOTING_STATISTICS_SUCCESS;
  payload: VotingStatistics;
}

export interface GetVotingStatisticsFailureAction {
  type: typeof ActionTypes.GET_VOTING_STATISTICS_FAILURE;
  payload: string;
}

// Committee Entries Actions
export interface GetCommitteeEntriesRequestAction {
  type: typeof ActionTypes.GET_COMMITTEE_ENTRIES_REQUEST;
  payload?: { election?: number; committee?: number };
}

export interface GetCommitteeEntriesSuccessAction {
  type: typeof ActionTypes.GET_COMMITTEE_ENTRIES_SUCCESS;
  payload: CommitteeVoteEntry[];
}

export interface GetCommitteeEntriesFailureAction {
  type: typeof ActionTypes.GET_COMMITTEE_ENTRIES_FAILURE;
  payload: string;
}

// Filter Actions
export interface SetVoteCountFiltersAction {
  type: typeof ActionTypes.SET_VOTE_COUNT_FILTERS;
  payload: VoteCountFilters;
}

export interface ClearVotingErrorAction {
  type: typeof ActionTypes.CLEAR_VOTING_ERROR;
}

// ============================================================================
// UNION TYPE
// ============================================================================

export type VotingActionTypes =
  | GetVoteCountsRequestAction
  | GetVoteCountsSuccessAction
  | GetVoteCountsFailureAction
  | CreateVoteCountRequestAction
  | CreateVoteCountSuccessAction
  | CreateVoteCountFailureAction
  | UpdateVoteCountRequestAction
  | UpdateVoteCountSuccessAction
  | UpdateVoteCountFailureAction
  | DeleteVoteCountRequestAction
  | DeleteVoteCountSuccessAction
  | DeleteVoteCountFailureAction
  | VerifyVoteCountRequestAction
  | VerifyVoteCountSuccessAction
  | VerifyVoteCountFailureAction
  | BulkVoteEntryRequestAction
  | BulkVoteEntrySuccessAction
  | BulkVoteEntryFailureAction
  | GetCandidatesRequestAction
  | GetCandidatesSuccessAction
  | GetCandidatesFailureAction
  | CreateCandidateRequestAction
  | CreateCandidateSuccessAction
  | CreateCandidateFailureAction
  | UpdateCandidateRequestAction
  | UpdateCandidateSuccessAction
  | UpdateCandidateFailureAction
  | DeleteCandidateRequestAction
  | DeleteCandidateSuccessAction
  | DeleteCandidateFailureAction
  | GetPartiesRequestAction
  | GetPartiesSuccessAction
  | GetPartiesFailureAction
  | GetElectionResultsRequestAction
  | GetElectionResultsSuccessAction
  | GetElectionResultsFailureAction
  | GenerateResultsRequestAction
  | GenerateResultsSuccessAction
  | GenerateResultsFailureAction
  | GetVotingStatisticsRequestAction
  | GetVotingStatisticsSuccessAction
  | GetVotingStatisticsFailureAction
  | GetCommitteeEntriesRequestAction
  | GetCommitteeEntriesSuccessAction
  | GetCommitteeEntriesFailureAction
  | SetVoteCountFiltersAction
  | ClearVotingErrorAction;
