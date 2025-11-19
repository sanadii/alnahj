// ==============================|| ELECTIONS ACTIONS ||============================== //
// Election Management System - Elections Management

import * as types from './actionTypes';
import type { Election, ElectionFormData, ElectionFilters } from 'types/elections';

// ============================================================================
// LIST ELECTIONS
// ============================================================================

export const getElectionsRequest = (filters?: ElectionFilters) => ({
  type: types.GET_ELECTIONS_REQUEST,
  payload: { filters }
});

export const getElectionsSuccess = (data: { elections: Election[]; totalCount: number }) => ({
  type: types.GET_ELECTIONS_SUCCESS,
  payload: data
});

export const getElectionsError = (error: string) => ({
  type: types.GET_ELECTIONS_FAILURE,
  payload: error
});

// ============================================================================
// GET SINGLE ELECTION
// ============================================================================

export const getElectionRequest = (id: number) => ({
  type: types.GET_ELECTION_REQUEST,
  payload: { id }
});

export const getElectionSuccess = (election: Election) => ({
  type: types.GET_ELECTION_SUCCESS,
  payload: election
});

export const getElectionError = (error: string) => ({
  type: types.GET_ELECTION_FAILURE,
  payload: error
});

// ============================================================================
// GET CURRENT ELECTION
// ============================================================================

export const getCurrentElectionRequest = () => ({
  type: types.GET_CURRENT_ELECTION_REQUEST
});

export const getCurrentElectionSuccess = (election: Election) => ({
  type: types.GET_CURRENT_ELECTION_SUCCESS,
  payload: election
});

export const getCurrentElectionError = (error: string) => ({
  type: types.GET_CURRENT_ELECTION_FAILURE,
  payload: error
});

// ============================================================================
// CREATE ELECTION
// ============================================================================

export const createElectionRequest = (data: ElectionFormData) => ({
  type: types.CREATE_ELECTION_REQUEST,
  payload: data
});

export const createElectionSuccess = (election: Election) => ({
  type: types.CREATE_ELECTION_SUCCESS,
  payload: election
});

export const createElectionError = (error: string) => ({
  type: types.CREATE_ELECTION_FAILURE,
  payload: error
});

// ============================================================================
// UPDATE ELECTION
// ============================================================================

export const updateElectionRequest = (id: number, data: Partial<ElectionFormData>) => ({
  type: types.UPDATE_ELECTION_REQUEST,
  payload: { id, data }
});

export const updateElectionSuccess = (election: Election) => ({
  type: types.UPDATE_ELECTION_SUCCESS,
  payload: election
});

export const updateElectionError = (error: string) => ({
  type: types.UPDATE_ELECTION_FAILURE,
  payload: error
});

// ============================================================================
// DELETE ELECTION
// ============================================================================

export const deleteElectionRequest = (id: number) => ({
  type: types.DELETE_ELECTION_REQUEST,
  payload: { id }
});

export const deleteElectionSuccess = (id: number) => ({
  type: types.DELETE_ELECTION_SUCCESS,
  payload: id
});

export const deleteElectionError = (error: string) => ({
  type: types.DELETE_ELECTION_FAILURE,
  payload: error
});

// ============================================================================
// UPDATE ELECTION STATUS
// ============================================================================

export const updateElectionStatusRequest = (id: number, status: string) => ({
  type: types.UPDATE_ELECTION_STATUS_REQUEST,
  payload: { id, status }
});

export const updateElectionStatusSuccess = (election: Election) => ({
  type: types.UPDATE_ELECTION_STATUS_SUCCESS,
  payload: election
});

export const updateElectionStatusError = (error: string) => ({
  type: types.UPDATE_ELECTION_STATUS_FAILURE,
  payload: error
});

// ============================================================================
// GET ELECTION STATISTICS
// ============================================================================

export const getElectionStatisticsRequest = (id: number) => ({
  type: types.GET_ELECTION_STATISTICS_REQUEST,
  payload: { id }
});

export const getElectionStatisticsSuccess = (statistics: any) => ({
  type: types.GET_ELECTION_STATISTICS_SUCCESS,
  payload: statistics
});

export const getElectionStatisticsError = (error: string) => ({
  type: types.GET_ELECTION_STATISTICS_FAILURE,
  payload: error
});

// ============================================================================
// FILTERS
// ============================================================================

export const setElectionFilters = (filters: ElectionFilters) => ({
  type: types.SET_ELECTION_FILTERS,
  payload: filters
});

export const clearElectionFilters = () => ({
  type: types.CLEAR_ELECTION_FILTERS
});

// ============================================================================
// UTILITIES
// ============================================================================

export const clearElectionError = () => ({
  type: types.CLEAR_ELECTION_ERROR
});

export const setCurrentElection = (election: Election) => ({
  type: types.SET_CURRENT_ELECTION,
  payload: election
});

export const clearCurrentElection = () => ({
  type: types.CLEAR_CURRENT_ELECTION
});

// ============================================================================
// CANDIDATES ACTIONS (Moved from voting module)
// ============================================================================

export const getCandidatesRequest = (election?: number) => ({
  type: types.GET_CANDIDATES_REQUEST,
  payload: election ? { election } : undefined
});

export const getCandidatesSuccess = (candidates: any[]) => ({
  type: types.GET_CANDIDATES_SUCCESS,
  payload: candidates
});

export const getCandidatesFailure = (error: string) => ({
  type: types.GET_CANDIDATES_FAILURE,
  payload: error
});

export const getCandidateRequest = (id: number) => ({
  type: types.GET_CANDIDATE_REQUEST,
  payload: id
});

export const getCandidateSuccess = (candidate: any) => ({
  type: types.GET_CANDIDATE_SUCCESS,
  payload: candidate
});

export const getCandidateFailure = (error: string) => ({
  type: types.GET_CANDIDATE_FAILURE,
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
  type: types.CREATE_CANDIDATE_REQUEST,
  payload: data
});

export const createCandidateSuccess = (candidate: any) => ({
  type: types.CREATE_CANDIDATE_SUCCESS,
  payload: candidate
});

export const createCandidateFailure = (error: string) => ({
  type: types.CREATE_CANDIDATE_FAILURE,
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
  type: types.UPDATE_CANDIDATE_REQUEST,
  payload: { id, data }
});

export const updateCandidateSuccess = (candidate: any) => ({
  type: types.UPDATE_CANDIDATE_SUCCESS,
  payload: candidate
});

export const updateCandidateFailure = (error: string) => ({
  type: types.UPDATE_CANDIDATE_FAILURE,
  payload: error
});

export const deleteCandidateRequest = (id: number) => ({
  type: types.DELETE_CANDIDATE_REQUEST,
  payload: id
});

export const deleteCandidateSuccess = (id: number, message: string) => ({
  type: types.DELETE_CANDIDATE_SUCCESS,
  payload: { id, message }
});

export const deleteCandidateFailure = (error: string) => ({
  type: types.DELETE_CANDIDATE_FAILURE,
  payload: error
});

// ============================================================================
// PARTIES ACTIONS (Moved from voting module)
// ============================================================================

export const getPartiesRequest = (election?: number) => ({
  type: types.GET_PARTIES_REQUEST,
  payload: election ? { election } : undefined
});

export const getPartiesSuccess = (parties: any[]) => ({
  type: types.GET_PARTIES_SUCCESS,
  payload: parties
});

export const getPartiesFailure = (error: string) => ({
  type: types.GET_PARTIES_FAILURE,
  payload: error
});
