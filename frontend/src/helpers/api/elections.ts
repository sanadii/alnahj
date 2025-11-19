/**
 * Elections API Helper
 * Election Management System - Elections CRUD Operations
 *
 * @module helpers/api/elections
 */

import axios from 'utils/axios';
import type { APIResponse } from 'types/api';
import * as URL from '../urls/elections';
import type {
  Election,
  ElectionFormData,
  ElectionFilters,
  ElectionListResponse,
  ElectionWithCommittees,
  AddMembersData
} from 'types/elections';

// ============================================================================
// ELECTION CRUD OPERATIONS
// ============================================================================

/**
 * Get all elections with optional filters and pagination
 *
 * @param filters - Status, search filters, and pagination
 * @returns Promise<APIResponse<ElectionListResponse>>
 */
export const getElections = async (filters?: ElectionFilters): Promise<APIResponse<ElectionListResponse>> => {
  const response = await axios.get(URL.ELECTIONS_LIST, { params: filters });
  return response.data;
};

/**
 * Get single election by ID
 *
 * @param id - Election ID
 * @returns Promise<APIResponse<Election>>
 */
export const getElection = async (id: number): Promise<APIResponse<Election>> => {
  const response = await axios.get(URL.electionDetail(id));
  return response.data;
};

/**
 * Get current/active election
 *
 * @returns Promise<APIResponse<Election>>
 */
export const getCurrentElection = async (): Promise<APIResponse<Election>> => {
  const response = await axios.get(URL.ELECTIONS_CURRENT);
  return response.data;
};

/**
 * Get election with all committees
 *
 * @param id - Election ID
 * @returns Promise<APIResponse<ElectionWithCommittees>>
 */
export const getElectionWithCommittees = async (id: number): Promise<APIResponse<ElectionWithCommittees>> => {
  const response = await axios.get(URL.electionWithCommittees(id));
  return response.data;
};

/**
 * Create new election
 *
 * @param data - Election creation data
 * @returns Promise<APIResponse<Election>>
 */
export const createElection = async (data: ElectionFormData): Promise<APIResponse<Election>> => {
  const response = await axios.post(URL.ELECTIONS_CREATE, data);
  return response.data;
};

/**
 * Update existing election (PATCH for partial update)
 *
 * @param id - Election ID
 * @param data - Partial election data to update
 * @returns Promise<APIResponse<Election>>
 */
export const updateElection = async (id: number, data: Partial<ElectionFormData>): Promise<APIResponse<Election>> => {

  const response = await axios.patch(URL.electionUpdate(id), data);


  return response.data;
};

/**
 * Add members to election
 *
 * @param id - Election ID
 * @param userIds - Array of user IDs to add as members
 * @returns Promise<APIResponse<Election>>
 */
export const addElectionMembers = async (id: number, userIds: number[]): Promise<APIResponse<Election>> => {
  const response = await axios.post(URL.electionAssignUsers(id), { userIds });
  return response.data;
};

/**
 * Create a new user and add them to election (optionally assign to committee)
 *
 * @param id - Election ID
 * @param userData - User creation data
 * @returns Promise<APIResponse<any>>
 */
export const createElectionMember = async (
  id: number,
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
    committeeId?: number;
  }
): Promise<APIResponse<any>> => {
  const response = await axios.post(URL.electionCreateMember(id), userData);
  return response.data;
};

/**
 * Remove a user from election members
 *
 * @param electionId - Election ID
 * @param userId - User ID to remove
 * @returns Promise<APIResponse<Election>>
 */
export const removeElectionMember = async (electionId: number, userId: number): Promise<APIResponse<Election>> => {
  const response = await axios.delete(URL.electionRemoveMember(electionId, userId));
  return response.data;
};

/**
 * Delete election
 *
 * @param id - Election ID
 * @returns Promise<APIResponse<null>>
 */
export const deleteElection = async (id: number): Promise<APIResponse<null>> => {
  const response = await axios.delete(URL.electionDelete(id));
  return response.data;
};

// ============================================================================
// ELECTION STATUS MANAGEMENT
// ============================================================================

/**
 * Update election status
 *
 * @param id - Election ID
 * @param status - New status
 * @returns Promise<APIResponse<Election>>
 */
export const updateElectionStatus = async (id: number, status: string): Promise<APIResponse<Election>> => {
  const response = await axios.post(URL.electionUpdateStatus(id), { status });
  return response.data;
};

/**
 * Start guarantee phase
 *
 * @param id - Election ID
 * @returns Promise<APIResponse<Election>>
 */
export const startGuaranteePhase = async (id: number): Promise<APIResponse<Election>> => {
  const response = await axios.post(URL.electionStartGuaranteePhase(id));
  return response.data;
};

/**
 * Start voting day
 *
 * @param id - Election ID
 * @returns Promise<APIResponse<Election>>
 */
export const startVotingDay = async (id: number): Promise<APIResponse<Election>> => {
  const response = await axios.post(URL.electionStartVotingDay(id));
  return response.data;
};

/**
 * Start counting
 *
 * @param id - Election ID
 * @returns Promise<APIResponse<Election>>
 */
export const startCounting = async (id: number): Promise<APIResponse<Election>> => {
  const response = await axios.post(URL.electionStartCounting(id));
  return response.data;
};

/**
 * Close election
 *
 * @param id - Election ID
 * @returns Promise<APIResponse<Election>>
 */
export const closeElection = async (id: number): Promise<APIResponse<Election>> => {
  const response = await axios.post(URL.electionClose(id));
  return response.data;
};

// ============================================================================
// ELECTION STATISTICS
// ============================================================================

/**
 * Get election statistics
 *
 * @param id - Election ID
 * @returns Promise<APIResponse<any>>
 */
export const getElectionStatistics = async (id: number): Promise<APIResponse<any>> => {
  const response = await axios.get(URL.electionStatistics(id));
  return response.data;
};

/**
 * Get election summary
 *
 * @param id - Election ID
 * @returns Promise<APIResponse<any>>
 */
export const getElectionSummary = async (id: number): Promise<APIResponse<any>> => {
  const response = await axios.get(URL.electionSummary(id));
  return response.data;
};

// ============================================================================
// EXPORT
// ============================================================================

/**
 * Export election data to CSV
 *
 * @param id - Election ID
 * @returns Promise<Blob>
 */
export const exportElectionCSV = async (id: number): Promise<Blob> => {
  const response = await axios.get(URL.electionExportCSV(id), {
    responseType: 'blob'
  });
  return response.data;
};

/**
 * Export election report to PDF
 *
 * @param id - Election ID
 * @returns Promise<Blob>
 */
export const exportElectionPDF = async (id: number): Promise<Blob> => {
  const response = await axios.get(URL.electionExportPDF(id), {
    responseType: 'blob'
  });
  return response.data;
};
