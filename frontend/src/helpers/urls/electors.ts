/**
 * Electors URL Constants
 * Election Management System - Electors Management Endpoints
 */

// ============================================================================
// BASE ENDPOINTS
// ============================================================================

export const ELECTORS_LIST = '/api/electors/';
export const ELECTORS_CREATE = '/api/electors/';
export const ELECTORS_SEARCH = '/api/electors/search/';
export const ELECTORS_FILTER_OPTIONS = '/api/electors/filter_options/';
export const ELECTORS_STATISTICS = '/api/electors/statistics/';
export const ELECTORS_PENDING = '/api/electors/pending/';
export const ELECTORS_BULK_APPROVE = '/api/electors/bulk_approve/';
export const ELECTORS_IMPORT = '/api/electors/import/';
export const ELECTORS_EXPORT = '/api/electors/export/';

// ============================================================================
// INDIVIDUAL ELECTOR ENDPOINTS
// ============================================================================

export const electorDetail = (kocId: string) => `/api/electors/${kocId}/`;
export const electorUpdate = (kocId: string) => `/api/electors/${kocId}/`;
export const electorDelete = (kocId: string) => `/api/electors/${kocId}/`;
export const electorApprove = (kocId: string) => `/api/electors/${kocId}/approve/`;
export const electorRelatives = (kocId: string) => `/api/electors/${kocId}/relatives/`;
export const electorRelationships = (kocId: string) => `/api/electors/${kocId}/relationships/`;
export const electorWorkColleagues = (kocId: string) => `/api/electors/${kocId}/work_colleagues/`;

