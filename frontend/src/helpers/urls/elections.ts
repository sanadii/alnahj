/**
 * Elections URL Constants
 * Election Management System - Elections Management Endpoints
 */

// ============================================================================
// BASE ENDPOINTS
// ============================================================================

export const ELECTIONS_LIST = '/api/elections/';
export const ELECTIONS_CREATE = '/api/elections/';
export const ELECTIONS_CURRENT = '/api/elections/current/';

// ============================================================================
// INDIVIDUAL ELECTION ENDPOINTS
// ============================================================================

export const electionDetail = (id: number) => `/api/elections/${id}/`;
export const electionUpdate = (id: number) => `/api/elections/${id}/`;
export const electionDelete = (id: number) => `/api/elections/${id}/`;
export const electionWithCommittees = (id: number) => `/api/elections/${id}/with-committees/`;
export const electionStatus = (id: number) => `/api/elections/${id}/status/`;
export const electionStatistics = (id: number) => `/api/elections/${id}/statistics/`;
export const electionAddMembers = (id: number) => `/api/elections/${id}/add-members/`;
export const electionAssignUsers = (id: number) => `/api/elections/${id}/assign-users/`;
export const electionCreateMember = (id: number) => `/api/elections/${id}/create_member/`;
export const electionRemoveMember = (id: number, userId: number) => `/api/elections/${id}/remove-member/${userId}/`;
export const electionUpdateStatus = (id: number) => `/api/elections/${id}/update-status/`;
export const electionStartGuaranteePhase = (id: number) => `/api/elections/${id}/start-guarantee-phase/`;
export const electionStartVotingDay = (id: number) => `/api/elections/${id}/start-voting-day/`;
export const electionStartCounting = (id: number) => `/api/elections/${id}/start-counting/`;
export const electionClose = (id: number) => `/api/elections/${id}/close/`;
export const electionSummary = (id: number) => `/api/elections/${id}/summary/`;
export const electionExportCSV = (id: number) => `/api/elections/${id}/export-csv/`;
export const electionExportPDF = (id: number) => `/api/elections/${id}/export-pdf/`;

// ============================================================================
// CANDIDATES ENDPOINTS
// ============================================================================

export const CANDIDATES_LIST = '/api/elections/candidates/';
export const CANDIDATES_CREATE = '/api/elections/candidates/';
export const candidateDetail = (id: number) => `/api/elections/candidates/${id}/`;
export const candidateUpdate = (id: number) => `/api/elections/candidates/${id}/`;
export const candidateDelete = (id: number) => `/api/elections/candidates/${id}/`;

// ============================================================================
// PARTIES ENDPOINTS
// ============================================================================

export const PARTIES_LIST = '/api/elections/parties/';
export const PARTIES_CREATE = '/api/elections/parties/';
export const partyDetail = (id: number) => `/api/elections/parties/${id}/`;
export const partyUpdate = (id: number) => `/api/elections/parties/${id}/`;
export const partyDelete = (id: number) => `/api/elections/parties/${id}/`;

