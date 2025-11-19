/**
 * Voting Redux Reducer
 * Election Management System
 */

import * as types from './types';
import type { VotingState, VotingActionTypes } from './types';

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: VotingState = {
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
  filters: {
    page: 1,
    pageSize: 25
  }
};

// ============================================================================
// REDUCER
// ============================================================================

const votingReducer = (state = initialState, action: VotingActionTypes): VotingState => {
  switch (action.type) {
    // Get Vote Counts
    case types.GET_VOTE_COUNTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        filters: action.payload
      };

    case types.GET_VOTE_COUNTS_SUCCESS:
      return {
        ...state,
        loading: false,
        voteCounts: action.payload.voteCounts,
        totalCount: action.payload.count,
        currentPage: state.filters.page || 1,
        pageSize: state.filters.pageSize || 25
      };

    case types.GET_VOTE_COUNTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Create Vote Count
    case types.CREATE_VOTE_COUNT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.CREATE_VOTE_COUNT_SUCCESS:
      return {
        ...state,
        loading: false
      };

    case types.CREATE_VOTE_COUNT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Update Vote Count
    case types.UPDATE_VOTE_COUNT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.UPDATE_VOTE_COUNT_SUCCESS:
      return {
        ...state,
        loading: false
      };

    case types.UPDATE_VOTE_COUNT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Delete Vote Count
    case types.DELETE_VOTE_COUNT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.DELETE_VOTE_COUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        voteCounts: state.voteCounts.filter((vc) => vc.id !== action.payload.id)
      };

    case types.DELETE_VOTE_COUNT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Verify Vote Count
    case types.VERIFY_VOTE_COUNT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.VERIFY_VOTE_COUNT_SUCCESS:
      return {
        ...state,
        loading: false
      };

    case types.VERIFY_VOTE_COUNT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Bulk Vote Entry
    case types.BULK_VOTE_ENTRY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.BULK_VOTE_ENTRY_SUCCESS:
      return {
        ...state,
        loading: false
      };

    case types.BULK_VOTE_ENTRY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Get Candidates
    case types.GET_CANDIDATES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.GET_CANDIDATES_SUCCESS:
      return {
        ...state,
        loading: false,
        candidates: action.payload
      };

    case types.GET_CANDIDATES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Create Candidate
    case types.CREATE_CANDIDATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.CREATE_CANDIDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        candidates: [...state.candidates, action.payload]
      };

    case types.CREATE_CANDIDATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Update Candidate
    case types.UPDATE_CANDIDATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.UPDATE_CANDIDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        candidates: state.candidates.map((c) => (c.id === action.payload.id ? action.payload : c))
      };

    case types.UPDATE_CANDIDATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Delete Candidate
    case types.DELETE_CANDIDATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.DELETE_CANDIDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        candidates: state.candidates.filter((c) => c.id !== action.payload.id)
      };

    case types.DELETE_CANDIDATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Get Parties
    case types.GET_PARTIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.GET_PARTIES_SUCCESS:
      return {
        ...state,
        loading: false,
        parties: action.payload
      };

    case types.GET_PARTIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Get Election Results
    case types.GET_ELECTION_RESULTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.GET_ELECTION_RESULTS_SUCCESS:
      return {
        ...state,
        loading: false,
        electionResults: action.payload
      };

    case types.GET_ELECTION_RESULTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Generate Results
    case types.GENERATE_RESULTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.GENERATE_RESULTS_SUCCESS:
      return {
        ...state,
        loading: false
      };

    case types.GENERATE_RESULTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Get Voting Statistics
    case types.GET_VOTING_STATISTICS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.GET_VOTING_STATISTICS_SUCCESS:
      return {
        ...state,
        loading: false,
        statistics: action.payload
      };

    case types.GET_VOTING_STATISTICS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Get Committee Entries
    case types.GET_COMMITTEE_ENTRIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.GET_COMMITTEE_ENTRIES_SUCCESS:
      return {
        ...state,
        loading: false,
        committeeEntries: action.payload
      };

    case types.GET_COMMITTEE_ENTRIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Filters
    case types.SET_VOTE_COUNT_FILTERS:
      return {
        ...state,
        filters: action.payload
      };

    case types.CLEAR_VOTING_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

export default votingReducer;
