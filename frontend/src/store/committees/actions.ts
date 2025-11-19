// ==============================|| COMMITTEES ACTIONS ||============================== //
// Election Management System - Committees Management

import * as types from './actionTypes';
import type { Committee, CommitteeFormData, CommitteeFilters, CommitteeStatistics, AssignUsersData } from 'types/elections';

// ============================================================================
// LIST COMMITTEES
// ============================================================================

export const getCommitteesRequest = (filters?: CommitteeFilters) => ({
  type: types.GET_COMMITTEES_REQUEST,
  payload: { filters }
});

export const getCommitteesSuccess = (data: { committees: Committee[]; totalCount: number }) => ({
  type: types.GET_COMMITTEES_SUCCESS,
  payload: data
});

export const getCommitteesError = (error: string) => ({
  type: types.GET_COMMITTEES_FAILURE,
  payload: error
});

// ============================================================================
// GET SINGLE COMMITTEE
// ============================================================================

export const getCommitteeRequest = (id: number) => ({
  type: types.GET_COMMITTEE_REQUEST,
  payload: { id }
});

export const getCommitteeSuccess = (committee: Committee) => ({
  type: types.GET_COMMITTEE_SUCCESS,
  payload: committee
});

export const getCommitteeError = (error: string) => ({
  type: types.GET_COMMITTEE_FAILURE,
  payload: error
});

// ============================================================================
// CREATE COMMITTEE
// ============================================================================

export const createCommitteeRequest = (data: CommitteeFormData) => ({
  type: types.CREATE_COMMITTEE_REQUEST,
  payload: data
});

export const createCommitteeSuccess = (committee: Committee) => ({
  type: types.CREATE_COMMITTEE_SUCCESS,
  payload: committee
});

export const createCommitteeError = (error: string) => ({
  type: types.CREATE_COMMITTEE_FAILURE,
  payload: error
});

// ============================================================================
// UPDATE COMMITTEE
// ============================================================================

export const updateCommitteeRequest = (id: number, data: Partial<CommitteeFormData>) => ({
  type: types.UPDATE_COMMITTEE_REQUEST,
  payload: { id, data }
});

export const updateCommitteeSuccess = (committee: Committee) => ({
  type: types.UPDATE_COMMITTEE_SUCCESS,
  payload: committee
});

export const updateCommitteeError = (error: string) => ({
  type: types.UPDATE_COMMITTEE_FAILURE,
  payload: error
});

// ============================================================================
// DELETE COMMITTEE
// ============================================================================

export const deleteCommitteeRequest = (id: number) => ({
  type: types.DELETE_COMMITTEE_REQUEST,
  payload: { id }
});

export const deleteCommitteeSuccess = (id: number) => ({
  type: types.DELETE_COMMITTEE_SUCCESS,
  payload: id
});

export const deleteCommitteeError = (error: string) => ({
  type: types.DELETE_COMMITTEE_FAILURE,
  payload: error
});

// ============================================================================
// ASSIGN USERS
// ============================================================================

export const assignUsersRequest = (id: number, data: AssignUsersData) => ({
  type: types.ASSIGN_USERS_REQUEST,
  payload: { id, data }
});

export const assignUsersSuccess = (committee: Committee) => ({
  type: types.ASSIGN_USERS_SUCCESS,
  payload: committee
});

export const assignUsersError = (error: string) => ({
  type: types.ASSIGN_USERS_FAILURE,
  payload: error
});

// ============================================================================
// GET COMMITTEE STATISTICS
// ============================================================================

export const getCommitteeStatisticsRequest = (id: number) => ({
  type: types.GET_COMMITTEE_STATISTICS_REQUEST,
  payload: { id }
});

export const getCommitteeStatisticsSuccess = (statistics: CommitteeStatistics) => ({
  type: types.GET_COMMITTEE_STATISTICS_SUCCESS,
  payload: statistics
});

export const getCommitteeStatisticsError = (error: string) => ({
  type: types.GET_COMMITTEE_STATISTICS_FAILURE,
  payload: error
});

// ============================================================================
// FILTERS
// ============================================================================

export const setCommitteeFilters = (filters: CommitteeFilters) => ({
  type: types.SET_COMMITTEE_FILTERS,
  payload: filters
});

export const clearCommitteeFilters = () => ({
  type: types.CLEAR_COMMITTEE_FILTERS
});

// ============================================================================
// UTILITIES
// ============================================================================

export const clearCommitteeError = () => ({
  type: types.CLEAR_COMMITTEE_ERROR
});

export const setCurrentCommittee = (committee: Committee) => ({
  type: types.SET_CURRENT_COMMITTEE,
  payload: committee
});

export const clearCurrentCommittee = () => ({
  type: types.CLEAR_CURRENT_COMMITTEE
});
