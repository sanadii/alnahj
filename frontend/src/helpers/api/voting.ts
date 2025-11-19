/**
 * Voting API Helper Functions
 * Election Management System
 */

import axiosServices from 'utils/axios';
import type { VoteCountFilters, VoteCountCreateData, VoteCountUpdateData, BulkVoteEntryData } from 'types/voting';
import { wrapResponse } from './responseNormalizer';
import * as URL from '../urls/voting';

// ============================================================================
// VOTE COUNTS API
// ============================================================================

export const getVoteCounts = async (filters: VoteCountFilters = {}) => {
  const params = new URLSearchParams();

  if (filters.election) params.append('election', filters.election.toString());
  if (filters.committee) params.append('committee', filters.committee.toString());
  if (filters.candidate) params.append('candidate', filters.candidate.toString());
  if (filters.status) params.append('status', filters.status);
  if (filters.is_verified !== undefined) params.append('is_verified', filters.is_verified.toString());
  if (filters.entered_by) params.append('entered_by', filters.entered_by.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.ordering) params.append('ordering', filters.ordering);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.pageSize) params.append('page_size', filters.pageSize.toString());

  const response = await axiosServices.get(URL.VOTE_COUNTS_LIST, { params: Object.fromEntries(params) });
  return wrapResponse(response.data);
};

export const getVoteCount = async (id: number) => {
  const response = await axiosServices.get(URL.voteCountDetail(id));
  return wrapResponse(response.data);
};

export const createVoteCount = async (data: VoteCountCreateData) => {
  const response = await axiosServices.post(URL.VOTE_COUNTS_CREATE, data);
  return wrapResponse(response.data);
};

export const updateVoteCount = async (id: number, data: VoteCountUpdateData) => {
  const response = await axiosServices.patch(URL.voteCountUpdate(id), data);
  return wrapResponse(response.data);
};

export const deleteVoteCount = async (id: number) => {
  const response = await axiosServices.delete(URL.voteCountDelete(id));
  return wrapResponse(response.data);
};

export const verifyVoteCount = async (id: number) => {
  const response = await axiosServices.patch(URL.voteCountVerify(id));
  return wrapResponse(response.data);
};

export const bulkVoteEntry = async (data: BulkVoteEntryData) => {
  const response = await axiosServices.post(URL.VOTE_COUNTS_BULK_ENTRY, data);
  return wrapResponse(response.data);
};

export const getVoteCountAudit = async (id: number) => {
  const response = await axiosServices.get(URL.voteCountAudit(id));
  return wrapResponse(response.data);
};

// ============================================================================
// CANDIDATES API
// ============================================================================

export const getCandidates = async (params?: { election?: number }) => {
  const response = await axiosServices.get(URL.CANDIDATES_LIST, { params: params ? { election: params.election } : {} });
  return wrapResponse(response.data);
};

export const getCandidate = async (id: number) => {
  const response = await axiosServices.get(URL.candidateDetail(id));
  return wrapResponse(response.data);
};

export const createCandidate = async (
  data:
    | {
        election: number;
        name: string;
        candidateNumber: number;
        party?: number | null;
        partyAffiliation?: string;
        remove_photo?: boolean;
      }
    | FormData
) => {
  const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined;
  const response = await axiosServices.post(URL.CANDIDATES_CREATE, data, config);
  return wrapResponse(response.data);
};

export const updateCandidate = async (
  id: number,
  data:
    | {
        name?: string;
        candidateNumber?: number;
        party?: number | null;
        partyAffiliation?: string;
        isActive?: boolean;
        remove_photo?: boolean;
      }
    | FormData
) => {
  const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined;
  const response = await axiosServices.patch(URL.candidateUpdate(id), data, config);
  return wrapResponse(response.data);
};

export const deleteCandidate = async (id: number) => {
  const response = await axiosServices.delete(URL.candidateDelete(id));
  return wrapResponse(response.data);
};

// ============================================================================
// PARTIES API
// ============================================================================

export const getParties = async (params?: { election?: number }) => {
  const response = await axiosServices.get(URL.PARTIES_LIST, { params: params ? { election: params.election } : {} });
  return wrapResponse(response.data);
};

export const getParty = async (id: number) => {
  const response = await axiosServices.get(URL.partyDetail(id));
  return wrapResponse(response.data);
};

export const createParty = async (
  data:
    | {
        election: number;
        name: string;
        color: string;
        description: string;
      }
    | FormData
) => {
  const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined;
  const response = await axiosServices.post(URL.PARTIES_CREATE, data, config);
  return wrapResponse(response.data);
};

export const updateParty = async (
  id: number,
  data:
    | {
        name?: string;
        color?: string;
        description?: string;
        isActive?: boolean;
      }
    | FormData
) => {
  const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined;
  const response = await axiosServices.patch(URL.partyUpdate(id), data, config);
  return wrapResponse(response.data);
};

export const deleteParty = async (id: number) => {
  const response = await axiosServices.delete(URL.partyDelete(id));
  return wrapResponse(response.data);
};

// ============================================================================
// ELECTION RESULTS API
// ============================================================================

export const getElectionResults = async (electionId: number) => {
  const response = await axiosServices.get(URL.resultDetail(electionId));
  return wrapResponse(response.data);
};

export const generateResults = async (electionId: number) => {
  const response = await axiosServices.post(URL.RESULTS_GENERATE, {
    election_id: electionId
  });
  return wrapResponse(response.data);
};

export const publishResults = async (resultsId: number) => {
  const response = await axiosServices.post(URL.resultPublish(resultsId));
  return wrapResponse(response.data);
};

// ============================================================================
// COMMITTEE ENTRIES API
// ============================================================================

export const getCommitteeEntries = async (params?: { election?: number; committee?: number }) => {
  const response = await axiosServices.get(URL.COMMITTEE_ENTRIES_LIST, { params: params || {} });
  return wrapResponse(response.data);
};

export const getCommitteeEntry = async (id: number) => {
  const response = await axiosServices.get(URL.committeeEntryDetail(id));
  return wrapResponse(response.data);
};

// ============================================================================
// STATISTICS API
// ============================================================================

export const getVotingStatistics = async (electionId?: number) => {
  const response = await axiosServices.get(URL.VOTE_COUNTS_STATISTICS, { params: electionId ? { election: electionId } : {} });
  return wrapResponse(response.data);
};
