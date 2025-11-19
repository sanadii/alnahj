// ==============================|| ELECTIONS ACTION TYPES ||============================== //
// Election Management System - Elections Management

// List Elections
export const GET_ELECTIONS_REQUEST = 'elections/GET_ELECTIONS_REQUEST';
export const GET_ELECTIONS_SUCCESS = 'elections/GET_ELECTIONS_SUCCESS';
export const GET_ELECTIONS_FAILURE = 'elections/GET_ELECTIONS_FAILURE';

// Get Single Election
export const GET_ELECTION_REQUEST = 'elections/GET_ELECTION_REQUEST';
export const GET_ELECTION_SUCCESS = 'elections/GET_ELECTION_SUCCESS';
export const GET_ELECTION_FAILURE = 'elections/GET_ELECTION_FAILURE';

// Get Current Election
export const GET_CURRENT_ELECTION_REQUEST = 'elections/GET_CURRENT_ELECTION_REQUEST';
export const GET_CURRENT_ELECTION_SUCCESS = 'elections/GET_CURRENT_ELECTION_SUCCESS';
export const GET_CURRENT_ELECTION_FAILURE = 'elections/GET_CURRENT_ELECTION_FAILURE';

// Create Election
export const CREATE_ELECTION_REQUEST = 'elections/CREATE_ELECTION_REQUEST';
export const CREATE_ELECTION_SUCCESS = 'elections/CREATE_ELECTION_SUCCESS';
export const CREATE_ELECTION_FAILURE = 'elections/CREATE_ELECTION_FAILURE';

// Update Election
export const UPDATE_ELECTION_REQUEST = 'elections/UPDATE_ELECTION_REQUEST';
export const UPDATE_ELECTION_SUCCESS = 'elections/UPDATE_ELECTION_SUCCESS';
export const UPDATE_ELECTION_FAILURE = 'elections/UPDATE_ELECTION_FAILURE';

// Delete Election
export const DELETE_ELECTION_REQUEST = 'elections/DELETE_ELECTION_REQUEST';
export const DELETE_ELECTION_SUCCESS = 'elections/DELETE_ELECTION_SUCCESS';
export const DELETE_ELECTION_FAILURE = 'elections/DELETE_ELECTION_FAILURE';

// Update Election Status
export const UPDATE_ELECTION_STATUS_REQUEST = 'elections/UPDATE_ELECTION_STATUS_REQUEST';
export const UPDATE_ELECTION_STATUS_SUCCESS = 'elections/UPDATE_ELECTION_STATUS_SUCCESS';
export const UPDATE_ELECTION_STATUS_FAILURE = 'elections/UPDATE_ELECTION_STATUS_FAILURE';

// Get Election Statistics
export const GET_ELECTION_STATISTICS_REQUEST = 'elections/GET_ELECTION_STATISTICS_REQUEST';
export const GET_ELECTION_STATISTICS_SUCCESS = 'elections/GET_ELECTION_STATISTICS_SUCCESS';
export const GET_ELECTION_STATISTICS_FAILURE = 'elections/GET_ELECTION_STATISTICS_FAILURE';

// Set Filters
export const SET_ELECTION_FILTERS = 'elections/SET_ELECTION_FILTERS';
export const CLEAR_ELECTION_FILTERS = 'elections/CLEAR_ELECTION_FILTERS';

// Clear Error
export const CLEAR_ELECTION_ERROR = 'elections/CLEAR_ELECTION_ERROR';

// Set Current Election
export const SET_CURRENT_ELECTION = 'elections/SET_CURRENT_ELECTION';
export const CLEAR_CURRENT_ELECTION = 'elections/CLEAR_CURRENT_ELECTION';

// ============================================================================
// CANDIDATES (Moved from voting module)
// ============================================================================

export const GET_CANDIDATES_REQUEST = 'elections/GET_CANDIDATES_REQUEST';
export const GET_CANDIDATES_SUCCESS = 'elections/GET_CANDIDATES_SUCCESS';
export const GET_CANDIDATES_FAILURE = 'elections/GET_CANDIDATES_FAILURE';

export const GET_CANDIDATE_REQUEST = 'elections/GET_CANDIDATE_REQUEST';
export const GET_CANDIDATE_SUCCESS = 'elections/GET_CANDIDATE_SUCCESS';
export const GET_CANDIDATE_FAILURE = 'elections/GET_CANDIDATE_FAILURE';

export const CREATE_CANDIDATE_REQUEST = 'elections/CREATE_CANDIDATE_REQUEST';
export const CREATE_CANDIDATE_SUCCESS = 'elections/CREATE_CANDIDATE_SUCCESS';
export const CREATE_CANDIDATE_FAILURE = 'elections/CREATE_CANDIDATE_FAILURE';

export const UPDATE_CANDIDATE_REQUEST = 'elections/UPDATE_CANDIDATE_REQUEST';
export const UPDATE_CANDIDATE_SUCCESS = 'elections/UPDATE_CANDIDATE_SUCCESS';
export const UPDATE_CANDIDATE_FAILURE = 'elections/UPDATE_CANDIDATE_FAILURE';

export const DELETE_CANDIDATE_REQUEST = 'elections/DELETE_CANDIDATE_REQUEST';
export const DELETE_CANDIDATE_SUCCESS = 'elections/DELETE_CANDIDATE_SUCCESS';
export const DELETE_CANDIDATE_FAILURE = 'elections/DELETE_CANDIDATE_FAILURE';

// ============================================================================
// PARTIES (Moved from voting module)
// ============================================================================

export const GET_PARTIES_REQUEST = 'elections/GET_PARTIES_REQUEST';
export const GET_PARTIES_SUCCESS = 'elections/GET_PARTIES_SUCCESS';
export const GET_PARTIES_FAILURE = 'elections/GET_PARTIES_FAILURE';

export const CREATE_PARTY_REQUEST = 'elections/CREATE_PARTY_REQUEST';
export const CREATE_PARTY_SUCCESS = 'elections/CREATE_PARTY_SUCCESS';
export const CREATE_PARTY_FAILURE = 'elections/CREATE_PARTY_FAILURE';

export const UPDATE_PARTY_REQUEST = 'elections/UPDATE_PARTY_REQUEST';
export const UPDATE_PARTY_SUCCESS = 'elections/UPDATE_PARTY_SUCCESS';
export const UPDATE_PARTY_FAILURE = 'elections/UPDATE_PARTY_FAILURE';

export const DELETE_PARTY_REQUEST = 'elections/DELETE_PARTY_REQUEST';
export const DELETE_PARTY_SUCCESS = 'elections/DELETE_PARTY_SUCCESS';
export const DELETE_PARTY_FAILURE = 'elections/DELETE_PARTY_FAILURE';
