// ==============================|| ELECTORS TYPES ||============================== //
// Election Management System - Electors Module

import type { GuaranteeStatus } from './guarantees';

/**
 * Elector Interface
 * Represents a voter/elector in the election system
 * Note: Field names use camelCase for JavaScript conventions
 */
export interface Elector {
  // Primary Key
  kocId: string;

  // Full name (computed from backend)
  fullName: string;

  // Name breakdown
  nameFirst?: string;
  nameSecond?: string;
  nameThird?: string;
  nameFourth?: string;
  nameFifth?: string;
  nameSixth?: string;
  subFamilyName?: string;
  familyName?: string;

  // Employee information
  designation?: string;
  section?: string;
  extension?: string;
  mobile?: string;
  area?: string;
  department?: string;
  team?: string;

  // Committee Assignment
  committee?: number;
  committeeCode?: string;
  committeeName?: string;

  // Demographics (human-readable value from backend)
  gender: string;

  // Status
  isActive: boolean;
  isApproved?: boolean;
  isWalkIn?: boolean;
  hasAttended?: boolean;
  isGuarantee?: boolean;
  guaranteeStatus?: GuaranteeStatus | null;
  guaranteeId?: number | null;
  guaranteeGroup?: {
    id: number;
    name: string;
    color?: string | null;
  } | null;
  guaranteeConfirmationStatus?: string | null;
  guaranteeMobile?: string | null;

  // Relationships
  familyCount?: number;
  workCount?: number;

  // Audit
  createdByEmail?: string;

  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Elector List Response
 */
export interface ElectorListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Elector[];
}

/**
 * Elector Filters for API
 * Note: Backend expects snake_case, will be transformed in API call
 */
export interface ElectorFilters {
  search?: string;
  gender?: 'MALE' | 'FEMALE' | '';
  committee?: number;
  area?: string;
  department?: string;
  team?: string;
  section?: string;
  nameFirst?: string;
  nameSecond?: string;
  nameThird?: string;
  nameFourth?: string;
  subFamilyName?: string;
  familyName?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Elector Form Data
 * Note: Field names match backend snake_case format
 */
export interface ElectorFormData {
  koc_id: string;
  full_name?: string;
  name_first?: string;
  name_second?: string;
  name_third?: string;
  name_fourth?: string;
  name_fifth?: string;
  name_sixth?: string;
  sub_family_name?: string;
  family_name?: string;
  designation?: string;
  section?: string;
  extension?: string;
  mobile?: string;
  area?: string;
  department?: string;
  team?: string;
  committee: number;
  gender: 'MALE' | 'FEMALE';
  is_active?: boolean;
  is_walk_in?: boolean;
}

/**
 * Elector Import Result
 */
export interface ElectorImportResult {
  success: boolean;
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
  warnings?: string[];
}
