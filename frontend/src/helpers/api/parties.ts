/**
 * Parties API Helper
 * Election Management System - Political Parties
 */

import axios from 'utils/axios';
import { wrapResponse, wrapListResponse } from './responseNormalizer';
import type { APIResponse, APIListResponse } from 'types/api';

// ============================================================================
// TYPES
// ============================================================================

export interface Party {
  id: number;
  election: number;
  name: string;
  color: string;
  logo?: string | null;
  description: string;
  is_active: boolean;
  candidate_count: number;
  created_at: string;
  updated_at: string;
}

export interface PartyCreateData {
  election: number;
  name: string;
  color?: string;
  description?: string;
  is_active?: boolean;
}

export interface PartyUpdateData {
  name?: string;
  color?: string;
  description?: string;
  is_active?: boolean;
}

export interface PartyFilters {
  election?: number;
  is_active?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

const PARTIES_BASE = '/api/candidates/parties';

/**
 * Get list of parties with optional filtering
 */
export const getParties = async (filters?: PartyFilters): Promise<APIListResponse<Party>> => {
  const response = await axios.get(PARTIES_BASE, { params: filters });
  return wrapListResponse(response);
};

/**
 * Get single party by ID
 */
export const getParty = async (id: number): Promise<APIResponse<Party>> => {
  const response = await axios.get(`${PARTIES_BASE}/${id}/`);
  return wrapResponse(response);
};

/**
 * Create a new party
 */
export const createParty = async (data: PartyCreateData | FormData): Promise<APIResponse<Party>> => {
  const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined;
  const response = await axios.post(`${PARTIES_BASE}/`, data, config);
  return wrapResponse(response);
};

/**
 * Update an existing party
 */
export const updateParty = async (id: number, data: PartyUpdateData | FormData): Promise<APIResponse<Party>> => {
  const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined;
  const response = await axios.patch(`${PARTIES_BASE}/${id}/`, data, config);
  return wrapResponse(response);
};

/**
 * Delete a party
 */
export const deleteParty = async (id: number): Promise<APIResponse<void>> => {
  const response = await axios.delete(`${PARTIES_BASE}/${id}/`);
  return wrapResponse(response);
};

/**
 * Get candidates for a specific party
 */
export const getPartyCandidates = async (partyId: number): Promise<APIResponse<any>> => {
  const response = await axios.get(`${PARTIES_BASE}/${partyId}/candidates/`);
  return wrapResponse(response);
};

/**
 * Get party statistics
 */
export const getPartyStatistics = async (): Promise<APIResponse<any>> => {
  const response = await axios.get(`${PARTIES_BASE}/statistics/`);
  return wrapResponse(response);
};



