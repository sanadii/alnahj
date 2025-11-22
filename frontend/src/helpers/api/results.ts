/**
 * Election Results API Helper
 * Election Management System - Results generation, publishing, and viewing
 */

import { APIClient } from '../api_helper';
import { wrapResponse } from './responseNormalizer';
import type { APIResponse } from 'types/api';

const api = new APIClient();

const BASE_URL = '/api/voting/results/';

// ==============================|| TYPE DEFINITIONS ||============================== //

export interface ElectionResults {
  id: number;
  election: number;
  election_name: string;
  status: 'DRAFT' | 'PUBLISHED';
  status_display: string;
  total_registered_electors: number;
  total_attendance: number;
  total_ballots_cast: number;
  total_valid_ballots: number;
  total_invalid_ballots: number;
  turnout_percentage: number;
  results_data: {
    candidates: CandidateResult[];
    committees: CommitteeResult[];
  };
  generated_by: number;
  generated_by_name: string;
  generated_at: string;
  published_by: number | null;
  published_by_name: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CandidateResult {
  id: number;
  candidate_number: number;
  candidate_name: string;
  party_name: string | null;
  votes: number;
  vote_percentage: number;
}

export interface CommitteeResult {
  committee_id: number;
  committee_code: string;
  committee_name: string;
  total_ballots: number;
  valid_ballots: number;
  invalid_ballots: number;
}

export interface ResultsSummary {
  election_name: string;
  total_candidates: number;
  total_registered_electors: number;
  total_attendance: number;
  total_ballots_cast: number;
  total_valid_ballots: number;
  turnout_percentage: number;
  candidates: CandidateResult[];
  winners: CandidateResult[];
  status: string;
}

export interface CommitteeBreakdown {
  committee_code: string;
  committee_name: string;
  total_ballots: number;
  valid_ballots: number;
  invalid_ballots: number;
  status: string;
  verified_at: string | null;
}

// ==============================|| RESULTS API FUNCTIONS ||============================== //

/**
 * Get current election results (if generated).
 *
 * GET /api/voting/results/
 */
export const getCurrentResults = (): Promise<APIResponse<ElectionResults>> => {
  return wrapResponse(api.get(`${BASE_URL}`));
};

/**
 * Generate election results from verified vote counts.
 * Requires admin privileges.
 *
 * POST /api/voting/results/generate/
 *
 * @param electionId - Optional election ID (defaults to current election)
 */
export const generateResults = (electionId?: number): Promise<APIResponse<ElectionResults>> => {
  const data = electionId ? { election_id: electionId } : {};
  return wrapResponse(api.post(`${BASE_URL}generate/`, data));
};

/**
 * Publish final results.
 * Requires admin privileges.
 *
 * POST /api/voting/results/publish/
 *
 * @param electionId - Optional election ID (defaults to current election)
 */
export const publishResults = (electionId?: number): Promise<APIResponse<ElectionResults>> => {
  const data = electionId ? { election_id: electionId } : {};
  return wrapResponse(api.post(`${BASE_URL}publish/`, data));
};

/**
 * Get results summary with winners.
 *
 * GET /api/voting/results/summary/
 *
 * @param electionId - Optional election ID (defaults to current election)
 */
export const getResultsSummary = (electionId?: number): Promise<APIResponse<ResultsSummary>> => {
  const params = electionId ? { election_id: electionId } : {};
  return wrapResponse(api.get(`${BASE_URL}summary/`, { params }));
};

/**
 * Get results breakdown by committee.
 *
 * GET /api/voting/results/by-committee/
 *
 * @param electionId - Optional election ID (defaults to current election)
 */
export const getResultsByCommittee = (electionId?: number): Promise<APIResponse<CommitteeBreakdown[]>> => {
  const params = electionId ? { election_id: electionId } : {};
  return wrapResponse(api.get(`${BASE_URL}by-committee/`, { params }));
};



