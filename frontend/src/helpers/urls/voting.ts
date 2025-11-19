/**
 * Voting URL Constants
 * Election Management System - Voting Operations Endpoints
 */

// ============================================================================
// VOTE COUNTS ENDPOINTS
// ============================================================================

export const VOTE_COUNTS_LIST = '/api/voting/vote-counts/';
export const VOTE_COUNTS_CREATE = '/api/voting/vote-counts/';
export const VOTE_COUNTS_STATISTICS = '/api/voting/vote-counts/statistics/';
export const voteCountDetail = (id: number) => `/api/voting/vote-counts/${id}/`;
export const voteCountUpdate = (id: number) => `/api/voting/vote-counts/${id}/`;
export const voteCountDelete = (id: number) => `/api/voting/vote-counts/${id}/`;
export const voteCountVerify = (id: number) => `/api/voting/vote-counts/${id}/verify/`;
export const voteCountAudit = (id: number) => `/api/voting/vote-counts/${id}/audit/`;
export const VOTE_COUNTS_BULK_ENTRY = '/api/voting/vote-counts/bulk-entry/';

// ============================================================================
// CANDIDATES ENDPOINTS (Note: Uses /api/candidates, not /api/voting/candidates)
// ============================================================================

export const CANDIDATES_LIST = '/api/candidates/';
export const CANDIDATES_CREATE = '/api/candidates/';
export const candidateDetail = (id: number) => `/api/candidates/${id}/`;
export const candidateUpdate = (id: number) => `/api/candidates/${id}/`;
export const candidateDelete = (id: number) => `/api/candidates/${id}/`;

// ============================================================================
// PARTIES ENDPOINTS (Note: Uses /api/candidates/parties, not /api/voting/parties)
// ============================================================================

export const PARTIES_LIST = '/api/candidates/parties/';
export const PARTIES_CREATE = '/api/candidates/parties/';
export const partyDetail = (id: number) => `/api/candidates/parties/${id}/`;
export const partyUpdate = (id: number) => `/api/candidates/parties/${id}/`;
export const partyDelete = (id: number) => `/api/candidates/parties/${id}/`;

// ============================================================================
// RESULTS ENDPOINTS
// ============================================================================

export const RESULTS_LIST = '/api/voting/results/';
export const RESULTS_GENERATE = '/api/voting/results/generate/';
export const resultDetail = (electionId: number) => `/api/voting/results/${electionId}/`;
export const resultPublish = (resultsId: number) => `/api/voting/results/${resultsId}/publish/`;

// ============================================================================
// COMMITTEE ENTRIES ENDPOINTS
// ============================================================================

export const COMMITTEE_ENTRIES_LIST = '/api/voting/committee-entries/';
export const committeeEntryDetail = (id: number) => `/api/voting/committee-entries/${id}/`;

