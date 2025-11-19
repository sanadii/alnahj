/**
 * Voting Redux Actions
 * Election Management System
 */

import type { VoteCountFilters, VoteCountCreateData, VoteCountUpdateData, BulkVoteEntryData } from 'types/voting';

import * as actionTypes from './actionTypes';
import * as types from './types';

// ============================================================================
// VOTE COUNTS ACTIONS
// ============================================================================

export const getVoteCountsRequest = (filters: VoteCountFilters = {}) => ({
  type: actionTypes.GET_VOTE_COUNTS_REQUEST,
  payload: filters
});

export const getVoteCountsSuccess = (voteCounts: any[], count: number) => ({
  type: actionTypes.GET_VOTE_COUNTS_SUCCESS,
  payload: { voteCounts, count }
});

export const getVoteCountsFailure = (error: string) => ({
  type: actionTypes.GET_VOTE_COUNTS_FAILURE,
  payload: error
});

export const createVoteCountRequest = (data: VoteCountCreateData) => ({
  type: actionTypes.CREATE_VOTE_COUNT_REQUEST,
  payload: data
});

export const createVoteCountSuccess = (message: string) => ({
  type: actionTypes.CREATE_VOTE_COUNT_SUCCESS,
  payload: message
});

export const createVoteCountFailure = (error: string) => ({
  type: actionTypes.CREATE_VOTE_COUNT_FAILURE,
  payload: error
});

export const updateVoteCountRequest = (id: number, data: VoteCountUpdateData) => ({
  type: actionTypes.UPDATE_VOTE_COUNT_REQUEST,
  payload: { id, data }
});

export const updateVoteCountSuccess = (message: string) => ({
  type: actionTypes.UPDATE_VOTE_COUNT_SUCCESS,
  payload: message
});

export const updateVoteCountFailure = (error: string) => ({
  type: actionTypes.UPDATE_VOTE_COUNT_FAILURE,
  payload: error
});

export const deleteVoteCountRequest = (id: number) => ({
  type: actionTypes.DELETE_VOTE_COUNT_REQUEST,
  payload: id
});

export const deleteVoteCountSuccess = (id: number, message: string) => ({
  type: actionTypes.DELETE_VOTE_COUNT_SUCCESS,
  payload: { id, message }
});

export const deleteVoteCountFailure = (error: string) => ({
  type: actionTypes.DELETE_VOTE_COUNT_FAILURE,
  payload: error
});

export const verifyVoteCountRequest = (id: number) => ({
  type: actionTypes.VERIFY_VOTE_COUNT_REQUEST,
  payload: id
});

export const verifyVoteCountSuccess = (message: string) => ({
  type: actionTypes.VERIFY_VOTE_COUNT_SUCCESS,
  payload: message
});

export const verifyVoteCountFailure = (error: string) => ({
  type: actionTypes.VERIFY_VOTE_COUNT_FAILURE,
  payload: error
});

export const bulkVoteEntryRequest = (data: BulkVoteEntryData) => ({
  type: actionTypes.BULK_VOTE_ENTRY_REQUEST,
  payload: data
});

export const bulkVoteEntrySuccess = (message: string) => ({
  type: actionTypes.BULK_VOTE_ENTRY_SUCCESS,
  payload: message
});

export const bulkVoteEntryFailure = (error: string) => ({
  type: actionTypes.BULK_VOTE_ENTRY_FAILURE,
  payload: error
});

// ============================================================================
// CANDIDATES ACTIONS
// ============================================================================

export const getCandidatesRequest = (election?: number) => ({
  type: actionTypes.GET_CANDIDATES_REQUEST,
  payload: election ? { election } : undefined
});

export const getCandidatesSuccess = (candidates: any[]) => ({
  type: actionTypes.GET_CANDIDATES_SUCCESS,
  payload: candidates
});

export const getCandidatesFailure = (error: string) => ({
  type: actionTypes.GET_CANDIDATES_FAILURE,
  payload: error
});

export const createCandidateRequest = (
  data:
    | FormData
    | {
        election: number;
        name: string;
        candidateNumber: number;
        party?: number | null;
        remove_photo?: boolean;
      }
) => ({
  type: actionTypes.CREATE_CANDIDATE_REQUEST,
  payload: data
});

export const createCandidateSuccess = (candidate: any) => ({
  type: actionTypes.CREATE_CANDIDATE_SUCCESS,
  payload: candidate
});

export const createCandidateFailure = (error: string) => ({
  type: actionTypes.CREATE_CANDIDATE_FAILURE,
  payload: error
});

export const updateCandidateRequest = (
  id: number,
  data:
    | FormData
    | {
        name?: string;
        candidateNumber?: number;
        party?: number | null;
        isActive?: boolean;
        remove_photo?: boolean;
      }
) => ({
  type: actionTypes.UPDATE_CANDIDATE_REQUEST,
  payload: { id, data }
});

export const updateCandidateSuccess = (candidate: any) => ({
  type: actionTypes.UPDATE_CANDIDATE_SUCCESS,
  payload: candidate
});

export const updateCandidateFailure = (error: string) => ({
  type: actionTypes.UPDATE_CANDIDATE_FAILURE,
  payload: error
});

export const deleteCandidateRequest = (id: number) => ({
  type: actionTypes.DELETE_CANDIDATE_REQUEST,
  payload: id
});

export const deleteCandidateSuccess = (id: number, message: string) => ({
  type: actionTypes.DELETE_CANDIDATE_SUCCESS,
  payload: { id, message }
});

export const deleteCandidateFailure = (error: string) => ({
  type: actionTypes.DELETE_CANDIDATE_FAILURE,
  payload: error
});

// ============================================================================
// PARTIES ACTIONS
// ============================================================================

export const getPartiesRequest = (election?: number) => ({
  type: actionTypes.GET_PARTIES_REQUEST,
  payload: election ? { election } : undefined
});

export const getPartiesSuccess = (parties: any[]) => ({
  type: actionTypes.GET_PARTIES_SUCCESS,
  payload: parties
});

export const getPartiesFailure = (error: string) => ({
  type: actionTypes.GET_PARTIES_FAILURE,
  payload: error
});

// ============================================================================
// ELECTION RESULTS ACTIONS
// ============================================================================

export const getElectionResultsRequest = (electionId: number) => ({
  type: actionTypes.GET_ELECTION_RESULTS_REQUEST,
  payload: electionId
});

export const getElectionResultsSuccess = (results: any) => ({
  type: actionTypes.GET_ELECTION_RESULTS_SUCCESS,
  payload: results
});

export const getElectionResultsFailure = (error: string) => ({
  type: actionTypes.GET_ELECTION_RESULTS_FAILURE,
  payload: error
});

export const generateResultsRequest = (electionId: number) => ({
  type: actionTypes.GENERATE_RESULTS_REQUEST,
  payload: electionId
});

export const generateResultsSuccess = (message: string) => ({
  type: actionTypes.GENERATE_RESULTS_SUCCESS,
  payload: message
});

export const generateResultsFailure = (error: string) => ({
  type: actionTypes.GENERATE_RESULTS_FAILURE,
  payload: error
});

// ============================================================================
// STATISTICS ACTIONS
// ============================================================================

export const getVotingStatisticsRequest = (electionId?: number) => ({
  type: actionTypes.GET_VOTING_STATISTICS_REQUEST,
  payload: electionId
});

export const getVotingStatisticsSuccess = (statistics: any) => ({
  type: actionTypes.GET_VOTING_STATISTICS_SUCCESS,
  payload: statistics
});

export const getVotingStatisticsFailure = (error: string) => ({
  type: actionTypes.GET_VOTING_STATISTICS_FAILURE,
  payload: error
});

// ============================================================================
// COMMITTEE ENTRIES ACTIONS
// ============================================================================

export const getCommitteeEntriesRequest = (params?: { election?: number; committee?: number }) => ({
  type: actionTypes.GET_COMMITTEE_ENTRIES_REQUEST,
  payload: params
});

export const getCommitteeEntriesSuccess = (entries: any[]) => ({
  type: actionTypes.GET_COMMITTEE_ENTRIES_SUCCESS,
  payload: entries
});

export const getCommitteeEntriesFailure = (error: string) => ({
  type: actionTypes.GET_COMMITTEE_ENTRIES_FAILURE,
  payload: error
});

// ============================================================================
// FILTERS ACTIONS
// ============================================================================

export const setVoteCountFilters = (filters: VoteCountFilters) => ({
  type: actionTypes.SET_VOTE_COUNT_FILTERS,
  payload: filters
});

export const clearVotingError = () => ({
  type: actionTypes.CLEAR_VOTING_ERROR
});
