/**
 * Committees API Helper
 * Election Management System - Committees CRUD Operations
 *
 * @module helpers/api/committees
 */

import axios from 'utils/axios';
import type { APIResponse } from 'types/api';
import * as URL from '../urls/committees';
import type {
  Committee,
  CommitteeFormData,
  CommitteeFilters,
  CommitteeListResponse,
  CommitteeStatistics,
  AssignUsersData
} from 'types/elections';
import type { Elector } from 'types/electors';

// ============================================================================
// COMMITTEE CRUD OPERATIONS
// ============================================================================

/**
 * Get all committees with optional filters and pagination
 *
 * @param filters - Election, gender, search filters, and pagination
 * @returns Promise<APIResponse<CommitteeListResponse>>
 */
export const getCommittees = async (filters?: CommitteeFilters): Promise<APIResponse<CommitteeListResponse>> => {
  const response = await axios.get(URL.COMMITTEES_LIST, { params: filters });
  return response.data;
};

/**
 * Get single committee by ID
 *
 * @param id - Committee ID
 * @returns Promise<APIResponse<Committee>>
 */
export const getCommittee = async (id: number): Promise<APIResponse<Committee>> => {
  const response = await axios.get(URL.committeeDetail(id));
  return response.data;
};

/**
 * Get committees for an election
 *
 * @param electionId - Election ID
 * @returns Promise<APIResponse<Committee[]>>
 */
export const getCommitteesByElection = async (electionId: number): Promise<APIResponse<Committee[]>> => {
  const response = await axios.get('/api/elections/committees/', {
    params: { election: electionId }
  });
  return response.data;
};

/**
 * Create new committee
 *
 * @param data - Committee creation data
 * @returns Promise<APIResponse<Committee>>
 */
export const createCommittee = async (data: CommitteeFormData): Promise<APIResponse<Committee>> => {
  const response = await axios.post(URL.COMMITTEES_CREATE, data);
  return response.data;
};

/**
 * Update existing committee (PATCH for partial update)
 *
 * @param id - Committee ID
 * @param data - Partial committee data to update
 * @returns Promise<APIResponse<Committee>>
 */
export const updateCommittee = async (id: number, data: Partial<CommitteeFormData>): Promise<APIResponse<Committee>> => {
  const response = await axios.patch(URL.committeeUpdate(id), data);
  return response.data;
};

/**
 * Delete committee
 *
 * @param id - Committee ID
 * @returns Promise<APIResponse<null>>
 */
export const deleteCommittee = async (id: number): Promise<APIResponse<null>> => {
  const response = await axios.delete(URL.committeeDelete(id));
  return response.data;
};

// ============================================================================
// COMMITTEE STAFF MANAGEMENT
// ============================================================================

/**
 * Assign users to committee
 *
 * @param id - Committee ID
 * @param data - User IDs to assign
 * @returns Promise<APIResponse<Committee>>
 */
export const assignUsersToCommittee = async (id: number, data: AssignUsersData): Promise<APIResponse<Committee>> => {
  const response = await axios.post(URL.committeeAssignUsers(id), data);
  return response.data;
};

/**
 * Remove user from committee
 *
 * @param id - Committee ID
 * @param userId - User ID to remove
 * @returns Promise<APIResponse<Committee>>
 */
export const removeUserFromCommittee = async (id: number, userId: number): Promise<APIResponse<Committee>> => {
  const response = await axios.post(URL.committeeRemoveUser(id), {
    userId
  });
  return response.data;
};

/**
 * Get committee staff members
 *
 * @param id - Committee ID
 * @returns Promise<APIResponse<any[]>>
 */
export const getCommitteeStaff = async (id: number): Promise<APIResponse<any[]>> => {
  const response = await axios.get(URL.committeeStaff(id));
  return response.data;
};

// ============================================================================
// COMMITTEE ELECTORS
// ============================================================================

/**
 * Get electors assigned to committee
 *
 * @param id - Committee ID
 * @returns Promise<APIResponse<Elector[]>>
 */
export const getCommitteeElectors = async (id: number): Promise<APIResponse<Elector[]>> => {
  const response = await axios.get(URL.committeeElectors(id));
  return response.data;
};

/**
 * Assign electors to committee
 *
 * @param id - Committee ID
 * @param electorIds - Array of elector IDs
 * @returns Promise<APIResponse<Committee>>
 */
export const assignElectorsToCommittee = async (id: number, electorIds: number[]): Promise<APIResponse<Committee>> => {
  const response = await axios.post(URL.committeeAssignElectors(id), {
    electorIds
  });
  return response.data;
};

/**
 * Auto-assign electors to all committees based on ranges and gender
 *
 * @param electionId - Election ID
 * @returns Promise<APIResponse<{ assigned: number; committees: number; message: string }>>
 */
export const autoAssignElectorsToCommittees = async (
  electionId: number,
  committeeIds?: number[]
): Promise<APIResponse<{ assigned: number; committees: number; message: string }>> => {
  const payload = committeeIds && committeeIds.length ? { committeeIds } : {};
  const response = await axios.post(URL.electionAutoAssignElectors(electionId), payload);
  return response.data;
};

// ============================================================================
// COMMITTEE STATISTICS
// ============================================================================

/**
 * Get committee statistics
 *
 * @param id - Committee ID
 * @returns Promise<APIResponse<CommitteeStatistics>>
 */
export const getCommitteeStatistics = async (id: number): Promise<APIResponse<CommitteeStatistics>> => {
  const response = await axios.get(URL.committeeStatistics(id));
  return response.data;
};

/**
 * Get attendance for committee
 *
 * @param id - Committee ID
 * @returns Promise<APIResponse<any[]>>
 */
export const getCommitteeAttendance = async (id: number): Promise<APIResponse<any[]>> => {
  const response = await axios.get(URL.committeeAttendance(id));
  return response.data;
};

/**
 * Get vote counts for committee
 *
 * @param id - Committee ID
 * @returns Promise<APIResponse<any[]>>
 */
export const getCommitteeVoteCounts = async (id: number): Promise<APIResponse<any[]>> => {
  const response = await axios.get(URL.committeeVoteCounts(id));
  return response.data;
};

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * Bulk create committees
 *
 * @param data - Array of committee data
 * @returns Promise<APIResponse<{ success: number; failed: number }>>
 */
export const bulkCreateCommittees = async (data: CommitteeFormData[]): Promise<APIResponse<{ success: number; failed: number }>> => {
  const response = await axios.post(URL.COMMITTEES_BULK_CREATE, { committees: data });
  return response.data;
};

/**
 * Bulk delete committees
 *
 * @param ids - Array of committee IDs
 * @returns Promise<APIResponse<{ success: number; failed: number }>>
 */
export const bulkDeleteCommittees = async (ids: number[]): Promise<APIResponse<{ success: number; failed: number }>> => {
  const response = await axios.post(URL.COMMITTEES_BULK_DELETE, { ids });
  return response.data;
};

// ============================================================================
// SEARCH & FILTER
// ============================================================================

/**
 * Search committees by code or name
 *
 * @param query - Search query
 * @returns Promise<APIResponse<Committee[]>>
 */
export const searchCommittees = async (query: string): Promise<APIResponse<Committee[]>> => {
  const response = await axios.get(URL.COMMITTEES_SEARCH, {
    params: { q: query }
  });
  return response.data;
};

/**
 * Get committees by gender
 *
 * @param gender - MALE or FEMALE
 * @returns Promise<APIResponse<Committee[]>>
 */
export const getCommitteesByGender = async (gender: string): Promise<APIResponse<Committee[]>> => {
  const response = await axios.get('/api/elections/committees/', {
    params: { gender }
  });
  return response.data;
};

// ============================================================================
// EXPORT
// ============================================================================

/**
 * Export committees to CSV
 *
 * @param filters - Optional filters to apply
 * @returns Promise<Blob>
 */
export const exportCommitteesCSV = async (filters?: CommitteeFilters): Promise<Blob> => {
  const response = await axios.get(URL.COMMITTEES_EXPORT_CSV, {
    params: filters,
    responseType: 'blob'
  });
  return response.data;
};

/**
 * Export committee report to PDF
 *
 * @param id - Committee ID
 * @returns Promise<Blob>
 */
export const exportCommitteePDF = async (id: number): Promise<Blob> => {
  const response = await axios.get(URL.committeeExportPDF(id), {
    responseType: 'blob'
  });
  return response.data;
};
