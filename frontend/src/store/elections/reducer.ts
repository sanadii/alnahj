// ==============================|| ELECTIONS REDUCER ||============================== //
// Election Management System - Elections Management

import * as types from './actionTypes';
import type { ElectionsState } from 'types/elections';

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: ElectionsState = {
  // Data
  elections: [],
  currentElection: null,
  activeElection: null,

  // Pagination
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,

  // UI State
  loading: false,
  error: null,

  // Filters
  filters: {
    status: '',
    search: '',
    ordering: '-created_at',
    page: 1,
    pageSize: 10
  }
};

// ============================================================================
// REDUCER
// ============================================================================

const electionsReducer = (state = initialState, action: any): ElectionsState => {
  switch (action.type) {
    // ========== GET ELECTIONS ==========
    case types.GET_ELECTIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.GET_ELECTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        elections: action.payload.elections,
        totalCount: action.payload.totalCount,
        error: null
      };

    case types.GET_ELECTIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== GET SINGLE ELECTION ==========
    case types.GET_ELECTION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.GET_ELECTION_SUCCESS:
      return {
        ...state,
        loading: false,
        currentElection: action.payload,
        error: null
      };

    case types.GET_ELECTION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== GET CURRENT ELECTION ==========
    case types.GET_CURRENT_ELECTION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.GET_CURRENT_ELECTION_SUCCESS:
      return {
        ...state,
        loading: false,
        activeElection: action.payload,
        error: null
      };

    // Handle candidate updates in activeElection
    case 'elections/UPDATE_CANDIDATE_SUCCESS':
      if (!state.activeElection) return state;

      const candidates = (state.activeElection as any).candidates || [];
      const updatedCandidates = candidates.map((c: any) => (c.id === action.payload.id ? action.payload : c));

      return {
        ...state,
        activeElection: {
          ...(state.activeElection as any),
          candidates: updatedCandidates
        } as any
      };

    // Handle candidate deletion in activeElection
    case 'elections/DELETE_CANDIDATE_SUCCESS':
      if (!state.activeElection) return state;

      const currentCandidates = (state.activeElection as any).candidates || [];
      const filteredCandidates = currentCandidates.filter((c: any) => c.id !== action.payload.id);

      return {
        ...state,
        activeElection: {
          ...(state.activeElection as any),
          candidates: filteredCandidates
        } as any
      };

    // Handle candidate creation in activeElection
    case 'elections/CREATE_CANDIDATE_SUCCESS':
      if (!state.activeElection) return state;

      const existingCandidates = (state.activeElection as any).candidates || [];

      return {
        ...state,
        activeElection: {
          ...(state.activeElection as any),
          candidates: [...existingCandidates, action.payload]
        } as any
      };

    // ============================================================================
    // PARTY HANDLERS
    // ============================================================================

    case 'elections/CREATE_PARTY_SUCCESS':
      if (!state.activeElection) return state;

      const existingParties = (state.activeElection as any).parties || [];

      return {
        ...state,
        activeElection: {
          ...(state.activeElection as any),
          parties: [...existingParties, action.payload]
        } as any
      };

    case 'elections/UPDATE_PARTY_SUCCESS':
      if (!state.activeElection) return state;

      const parties = (state.activeElection as any).parties || [];
      const updatedParties = parties.map((p: any) => (p.id === action.payload.id ? action.payload : p));

      return {
        ...state,
        activeElection: {
          ...(state.activeElection as any),
          parties: updatedParties
        } as any
      };

    case 'elections/DELETE_PARTY_SUCCESS':
      if (!state.activeElection) return state;

      const currentParties = (state.activeElection as any).parties || [];
      const filteredParties = currentParties.filter((p: any) => p.id !== action.payload.id);

      return {
        ...state,
        activeElection: {
          ...(state.activeElection as any),
          parties: filteredParties
        } as any
      };

    // ============================================================================
    // COMMITTEE HANDLERS
    // ============================================================================

    case 'committees/CREATE_COMMITTEE_SUCCESS':
      if (!state.activeElection) return state;

      const currentCommitteesForCreate = (state.activeElection as any).committees || [];

      return {
        ...state,
        activeElection: {
          ...(state.activeElection as any),
          committees: [...currentCommitteesForCreate, action.payload]
        } as any
      };

    case 'committees/UPDATE_COMMITTEE_SUCCESS':
      if (!state.activeElection) return state;

      const committees = (state.activeElection as any).committees || [];
      const updatedCommittees = committees.map((c: any) => (c.id === action.payload.id ? action.payload : c));

      return {
        ...state,
        activeElection: {
          ...(state.activeElection as any),
          committees: updatedCommittees
        } as any
      };

    case 'committees/DELETE_COMMITTEE_SUCCESS':
      if (!state.activeElection) return state;

      const currentCommittees = (state.activeElection as any).committees || [];
      const filteredCommittees = currentCommittees.filter((c: any) => c.id !== action.payload);

      return {
        ...state,
        activeElection: {
          ...(state.activeElection as any),
          committees: filteredCommittees
        } as any
      };

    case 'elections/AUTO_ASSIGN_COMMITTEES_SUCCESS':
      if (!state.activeElection) return state;

      const committeesById = new Map(action.payload.map((committee: any) => [committee.id, committee]));
      const existingCommittees = (state.activeElection as any).committees || [];

      const mergedCommittees = existingCommittees.map((committee: any) =>
        committeesById.has(committee.id) ? { ...committee, ...committeesById.get(committee.id) } : committee
      );

      return {
        ...state,
        activeElection: {
          ...(state.activeElection as any),
          committees: mergedCommittees
        } as any
      };

    case types.GET_CURRENT_ELECTION_FAILURE:
      console.error('❌ [ElectionsReducer] GET_CURRENT_ELECTION_ERROR', action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== CREATE ELECTION ==========
    case types.CREATE_ELECTION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.CREATE_ELECTION_SUCCESS:
      return {
        ...state,
        loading: false,
        elections: [action.payload, ...state.elections],
        totalCount: state.totalCount + 1,
        error: null
      };

    case types.CREATE_ELECTION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== UPDATE ELECTION ==========
    case types.UPDATE_ELECTION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.UPDATE_ELECTION_SUCCESS:
      return {
        ...state,
        loading: false,
        elections: state.elections.map((election) => (election.id === action.payload.id ? action.payload : election)),
        currentElection: state.currentElection?.id === action.payload.id ? action.payload : state.currentElection,
        // Update activeElection if it matches the updated election
        activeElection:
          state.activeElection && typeof state.activeElection === 'object' && 'election' in state.activeElection
            ? (state.activeElection as any).election?.id === action.payload.id
              ? { ...state.activeElection, election: action.payload }
              : state.activeElection
            : state.activeElection?.id === action.payload.id
              ? action.payload
              : state.activeElection,
        error: null
      };

    case types.UPDATE_ELECTION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== DELETE ELECTION ==========
    case types.DELETE_ELECTION_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.DELETE_ELECTION_SUCCESS:
      return {
        ...state,
        loading: false,
        elections: state.elections.filter((election) => election.id !== action.payload),
        totalCount: state.totalCount - 1,
        currentElection: state.currentElection?.id === action.payload ? null : state.currentElection,
        error: null
      };

    case types.DELETE_ELECTION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== UPDATE ELECTION STATUS ==========
    case types.UPDATE_ELECTION_STATUS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.UPDATE_ELECTION_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        elections: state.elections.map((election) => (election.id === action.payload.id ? action.payload : election)),
        currentElection: state.currentElection?.id === action.payload.id ? action.payload : state.currentElection,
        activeElection: state.activeElection?.id === action.payload.id ? action.payload : state.activeElection,
        error: null
      };

    case types.UPDATE_ELECTION_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== GET ELECTION STATISTICS ==========
    case types.GET_ELECTION_STATISTICS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.GET_ELECTION_STATISTICS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null
      };

    case types.GET_ELECTION_STATISTICS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // ========== FILTERS ==========
    case types.SET_ELECTION_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };

    case types.CLEAR_ELECTION_FILTERS:
      return {
        ...state,
        filters: initialState.filters
      };

    // ========== UTILITIES ==========
    case types.CLEAR_ELECTION_FAILURE:
      return {
        ...state,
        error: null
      };

    case types.SET_CURRENT_ELECTION:
      return {
        ...state,
        currentElection: action.payload
      };

    case types.CLEAR_CURRENT_ELECTION:
      return {
        ...state,
        currentElection: null
      };

    default:
      return state;
  }
};

export default electionsReducer;
