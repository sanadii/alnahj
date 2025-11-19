/**
 * Guarantees URL Constants
 * Election Management System - Guarantees Management Endpoints
 */

// ============================================================================
// BASE ENDPOINTS
// ============================================================================

export const GUARANTEES_LIST = '/api/guarantees/';
export const GUARANTEES_CREATE = '/api/guarantees/';
export const GUARANTEES_STATISTICS = '/api/guarantees/statistics/';
export const GUARANTEES_BULK_UPDATE = '/api/guarantees/bulk-update/';
export const GUARANTEES_BULK_CONFIRM = '/api/guarantees/bulk-confirm/';
export const GUARANTEES_SEARCH_ELECTOR = '/api/guarantees/search-elector/';

// ============================================================================
// INDIVIDUAL GUARANTEE ENDPOINTS
// ============================================================================

export const guaranteeDetail = (id: number) => `/api/guarantees/${id}/`;
export const guaranteeUpdate = (id: number) => `/api/guarantees/${id}/`;
export const guaranteeDelete = (id: number) => `/api/guarantees/${id}/`;
export const guaranteeQuickUpdate = (id: number) => `/api/guarantees/${id}/quick-update/`;
export const guaranteeConfirm = (id: number) => `/api/guarantees/${id}/confirm/`;
export const guaranteeAddNote = (id: number) => `/api/guarantees/${id}/add-note/`;

// ============================================================================
// ELECTOR-BASED GUARANTEE ENDPOINTS
// ============================================================================

export const guaranteeByElectorQuickUpdate = (electorKocId: string) => `/api/guarantees/by-elector/${electorKocId}/`;
export const guaranteeByElectorDelete = (electorKocId: string) => `/api/guarantees/by-elector/${electorKocId}/`;

// ============================================================================
// GUARANTEE GROUPS ENDPOINTS
// ============================================================================

export const GUARANTEES_GROUPS_LIST = '/api/guarantees/groups/';
export const GUARANTEES_GROUPS_CREATE = '/api/guarantees/groups/';
export const guaranteeGroupUpdate = (id: number) => `/api/guarantees/groups/${id}/`;
export const guaranteeGroupDelete = (id: number) => `/api/guarantees/groups/${id}/`;

