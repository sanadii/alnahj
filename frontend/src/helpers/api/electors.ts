/**
 * Electors Management API Helper
 * Election Management System - Electors CRUD Operations
 *
 * @module helpers/api/electors
 */

import axios from 'utils/axios';
import type { APIResponse } from 'types/api';
import { wrapResponse, wrapListResponse } from './responseNormalizer';
import type { Elector, ElectorListResponse } from 'types/electors';
import type { GuaranteeStatus } from 'types/guarantees';
import type { ElectorFilters as ElectorFiltersType } from 'types/electors';
import * as URL from '../urls/electors';

type RelativeSummary = {
  kocId: string;
  fullName: string;
  mobile: string;
  section: string;
  committee: string | null;
  isGuarantee: boolean;
  guaranteeStatus?: GuaranteeStatus | null;
  department?: string | null;
  team?: string | null;
};

type PaginatedRelationship = {
  results: RelativeSummary[];
  pagination: {
    count: number;
    page: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
};

// ============================================================================
// ELECTOR CRUD OPERATIONS
// ============================================================================

function transformFilters(filters?: ElectorFiltersType): any {
  if (!filters) return undefined;

  return {
    search: filters.search,
    gender: filters.gender,
    committee: filters.committee,
    area: filters.area,
    department: filters.department,
    team: filters.team,
    section: filters.section,
    name_first: filters.nameFirst,
    name_second: filters.nameSecond,
    name_third: filters.nameThird,
    name_fourth: filters.nameFourth,
    sub_family_name: filters.subFamilyName,
    family_name: filters.familyName,
    page: filters.page,
    page_size: filters.pageSize
  };
}

function transformElectorData(data: Partial<Elector>): any {
  const transformed: any = {};

  if (data.kocId !== undefined) transformed.koc_id = data.kocId;
  if (data.fullName !== undefined) transformed.full_name = data.fullName;
  if (data.nameFirst !== undefined) transformed.name_first = data.nameFirst;
  if (data.nameSecond !== undefined) transformed.name_second = data.nameSecond;
  if (data.nameThird !== undefined) transformed.name_third = data.nameThird;
  if (data.nameFourth !== undefined) transformed.name_fourth = data.nameFourth;
  if (data.nameFifth !== undefined) transformed.name_fifth = data.nameFifth;
  if (data.nameSixth !== undefined) transformed.name_sixth = data.nameSixth;
  if (data.subFamilyName !== undefined) transformed.sub_family_name = data.subFamilyName;
  if (data.familyName !== undefined) transformed.family_name = data.familyName;
  if (data.designation !== undefined) transformed.designation = data.designation;
  if (data.section !== undefined) transformed.section = data.section;
  if (data.extension !== undefined) transformed.extension = data.extension;
  if (data.mobile !== undefined) transformed.mobile = data.mobile;
  if (data.area !== undefined) transformed.area = data.area;
  if (data.department !== undefined) transformed.department = data.department;
  if (data.team !== undefined) transformed.team = data.team;
  if (data.committee !== undefined) transformed.committee = data.committee;
  if (data.gender !== undefined) transformed.gender = data.gender;
  if (data.isActive !== undefined) transformed.is_active = data.isActive;
  if (data.isWalkIn !== undefined) transformed.is_walk_in = data.isWalkIn;

  return transformed;
}

export const getElectors = async (filters?: ElectorFiltersType): Promise<APIResponse<ElectorListResponse>> => {
  const transformedFilters = transformFilters(filters);
  const response = await axios.get(URL.ELECTORS_LIST, { params: transformedFilters });
  const normalized = wrapListResponse<Elector>(response.data);
  return normalized as APIResponse<ElectorListResponse>;
};

export const getElectorsCombined = async (
  filters?: ElectorFiltersType,
  include?: string[]
): Promise<
  APIResponse<{
    electors: Elector[];
    groups?: any[];
    committees?: any[];
  }>
> => {
  const transformedFilters = transformFilters(filters);
  const params: any = transformedFilters || {};
  if (include && include.length > 0) {
    params.include = include.join(',');
  }

  const response = await axios.get(URL.ELECTORS_LIST, { params });

  const normalized: APIResponse<{
    electors: Elector[];
    groups?: any[];
    committees?: any[];
  }> = {
    status: response.data.status,
    data: {
      electors: response.data.data.electors || [],
      groups: response.data.data.groups,
      committees: response.data.data.committees
    },
    message: response.data.message,
    meta: {
      pagination: response.data.meta?.pagination || {
        count: response.data.data.electors?.length || 0,
        next: null,
        previous: null
      }
    }
  };

  return normalized;
};

export const getElector = async (kocId: string): Promise<APIResponse<Elector>> => {
  const response = await axios.get(URL.electorDetail(kocId));
  return wrapResponse(response.data);
};

export const getElectorRelatives = async (
  kocId: string
): Promise<
  APIResponse<{
    brothers: RelativeSummary[];
    fathers: RelativeSummary[];
    sons: RelativeSummary[];
    cousins: RelativeSummary[];
  }>
> => {
  const response = await axios.get(URL.electorRelatives(kocId));
  return wrapResponse(response.data);
};

export const getElectorRelationships = async (
  kocId: string,
  departmentPage: number = 1,
  teamPage: number = 1,
  departmentPageSize: number = 10,
  teamPageSize: number = 10
): Promise<
  APIResponse<{
    family: RelativeSummary[];
    sameDepartment: PaginatedRelationship;
    sameTeam: PaginatedRelationship;
  }>
> => {
  const params = {
    department_page: departmentPage,
    department_page_size: departmentPageSize,
    team_page: teamPage,
    team_page_size: teamPageSize
  };

  const response = await axios.get(URL.electorRelationships(kocId), { params });
  return wrapResponse(response.data);
};

export const getElectorWorkColleagues = async (
  kocId: string
): Promise<
  APIResponse<{
    sameArea: RelativeSummary[];
    sameDepartment: RelativeSummary[];
    sameTeam: RelativeSummary[];
  }>
> => {
  const response = await axios.get(URL.electorWorkColleagues(kocId));
  return wrapResponse(response.data);
};

export const createElector = async (data: Partial<Elector>): Promise<APIResponse<Elector>> => {
  const transformedData = transformElectorData(data);
  const response = await axios.post(URL.ELECTORS_CREATE, transformedData);
  return wrapResponse(response.data);
};

export const updateElector = async (kocId: string, data: Partial<Elector>): Promise<APIResponse<Elector>> => {
  const transformedData = transformElectorData(data);
  const response = await axios.patch(URL.electorUpdate(kocId), transformedData);
  return wrapResponse(response.data);
};

export const deleteElector = async (kocId: string): Promise<APIResponse<null>> => {
  const response = await axios.delete(URL.electorDelete(kocId));
  return wrapResponse(response.data);
};

export const searchElectors = async (searchParams?: ElectorFiltersType): Promise<APIResponse<ElectorListResponse>> => {
  const transformedParams = transformFilters(searchParams);
  const response = await axios.get(URL.ELECTORS_SEARCH, {
    params: transformedParams
  });
  return wrapListResponse<Elector>(response.data) as APIResponse<ElectorListResponse>;
};

export const getElectorFilterOptions = async (): Promise<
  APIResponse<{
    areas: string[];
    departments: string[];
    teams: string[];
  }>
> => {
  const response = await axios.get(URL.ELECTORS_FILTER_OPTIONS);
  return wrapResponse(response.data);
};

export const getElectorStatistics = async (): Promise<
  APIResponse<{
    total_electors: number;
    by_gender: Array<{ gender: string; count: number }>;
    by_committee: Array<{ committee__code: string; committee__name: string; count: number }>;
    top_departments: Array<{ department: string; count: number }>;
    top_teams: Array<{ team: string; count: number }>;
  }>
> => {
  const response = await axios.get(URL.ELECTORS_STATISTICS);
  return wrapResponse(response.data);
};

export const getPendingElectors = async (): Promise<APIResponse<ElectorListResponse>> => {
  const response = await axios.get(URL.ELECTORS_PENDING);
  return wrapListResponse<Elector>(response.data) as APIResponse<ElectorListResponse>;
};

export const approveElector = async (kocId: string): Promise<APIResponse<Elector>> => {
  const response = await axios.post(URL.electorApprove(kocId));
  return wrapResponse(response.data);
};

export const bulkApproveElectors = async (kocIds: string[]): Promise<APIResponse<{ approved_count: number }>> => {
  const response = await axios.post(URL.ELECTORS_BULK_APPROVE, { koc_ids: kocIds });
  return wrapResponse(response.data);
};

export const importElectorsCsv = async (
  file: File,
  updateExisting: boolean = false
): Promise<APIResponse<{ success: boolean; created: number; updated: number; errors: string[] }>> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('update_existing', String(updateExisting));

  const response = await axios.post(URL.ELECTORS_IMPORT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return wrapResponse(response.data);
};

export const exportElectorsCsv = async (filters?: ElectorFiltersType): Promise<Blob> => {
  const transformedFilters = transformFilters(filters);
  const response = await axios.get(URL.ELECTORS_EXPORT, {
    params: transformedFilters,
    responseType: 'blob'
  });
  return response.data;
};
