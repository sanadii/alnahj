// ==============================|| ELECTORS ACTIONS ||============================== //
// Election Management System - Electors Management

import * as types from './actionTypes';
import type { Elector, ElectorFilters } from 'types/electors';
import type { GuaranteeStatus } from 'types/guarantees';

// ============================================================================
// LIST ELECTORS
// ============================================================================

export const getElectorsRequest = (filters?: ElectorFilters, includeGroups?: boolean) => ({
  type: types.GET_ELECTORS_REQUEST,
  payload: { filters, includeGroups }
});

export const getElectorsSuccess = (data: { electors: Elector[]; totalCount: number; groups?: any[] }) => ({
  type: types.GET_ELECTORS_SUCCESS,
  payload: data
});

export const getElectorsError = (error: string) => ({
  type: types.GET_ELECTORS_FAILURE,
  payload: error
});

// ============================================================================
// GET SINGLE ELECTOR
// ============================================================================

export const getElectorRequest = (kocId: string) => ({
  type: types.GET_ELECTOR_REQUEST,
  payload: { kocId }
});

export const getElectorSuccess = (elector: Elector) => ({
  type: types.GET_ELECTOR_SUCCESS,
  payload: elector
});

export const getElectorError = (error: string) => ({
  type: types.GET_ELECTOR_FAILURE,
  payload: error
});

// ============================================================================
// CREATE ELECTOR
// ============================================================================

export const createElectorRequest = (data: Partial<Elector>) => ({
  type: types.CREATE_ELECTOR_REQUEST,
  payload: data
});

export const createElectorSuccess = (elector: Elector) => ({
  type: types.CREATE_ELECTOR_SUCCESS,
  payload: elector
});

export const createElectorError = (error: string) => ({
  type: types.CREATE_ELECTOR_FAILURE,
  payload: error
});

// ============================================================================
// UPDATE ELECTOR
// ============================================================================

export const updateElectorRequest = (kocId: string, data: Partial<Elector>) => ({
  type: types.UPDATE_ELECTOR_REQUEST,
  payload: { kocId, data }
});

export const updateElectorSuccess = (elector: Elector) => ({
  type: types.UPDATE_ELECTOR_SUCCESS,
  payload: elector
});

export const updateElectorError = (error: string) => ({
  type: types.UPDATE_ELECTOR_FAILURE,
  payload: error
});

// ============================================================================
// DELETE ELECTOR
// ============================================================================

export const deleteElectorRequest = (kocId: string) => ({
  type: types.DELETE_ELECTOR_REQUEST,
  payload: { kocId }
});

export const deleteElectorSuccess = (kocId: string) => ({
  type: types.DELETE_ELECTOR_SUCCESS,
  payload: kocId
});

export const deleteElectorError = (error: string) => ({
  type: types.DELETE_ELECTOR_FAILURE,
  payload: error
});

// ============================================================================
// IMPORT/EXPORT
// ============================================================================

export const importElectorsRequest = (file: File, updateExisting: boolean = false) => ({
  type: types.IMPORT_ELECTORS_REQUEST,
  payload: { file, updateExisting }
});

export const importElectorsSuccess = (result: { success: boolean; created: number; updated: number; errors: string[] }) => ({
  type: types.IMPORT_ELECTORS_SUCCESS,
  payload: result
});

export const importElectorsError = (error: string) => ({
  type: types.IMPORT_ELECTORS_FAILURE,
  payload: error
});

export const exportElectorsRequest = (filters?: ElectorFilters, format: 'csv' | 'excel' = 'csv') => ({
  type: types.EXPORT_ELECTORS_REQUEST,
  payload: { filters, format }
});

export const exportElectorsSuccess = () => ({
  type: types.EXPORT_ELECTORS_SUCCESS
});

export const exportElectorsError = (error: string) => ({
  type: types.EXPORT_ELECTORS_FAILURE,
  payload: error
});

// ============================================================================
// STATISTICS
// ============================================================================

export const getElectorStatsRequest = () => ({
  type: types.GET_ELECTOR_STATS_REQUEST
});

export const getElectorStatsSuccess = (stats: any) => ({
  type: types.GET_ELECTOR_STATS_SUCCESS,
  payload: stats
});

export const getElectorStatsError = (error: string) => ({
  type: types.GET_ELECTOR_STATS_FAILURE,
  payload: error
});

// ============================================================================
// FILTERS
// ============================================================================

export const setElectorFilters = (filters: ElectorFilters) => ({
  type: types.SET_ELECTOR_FILTERS,
  payload: filters
});

export const clearElectorFilters = () => ({
  type: types.CLEAR_ELECTOR_FILTERS
});

// ============================================================================
// UTILITIES
// ============================================================================

export const clearElectorError = () => ({
  type: types.CLEAR_ELECTOR_ERROR
});

export const setCurrentElector = (elector: Elector) => ({
  type: types.SET_CURRENT_ELECTOR,
  payload: elector
});

export const clearCurrentElector = () => ({
  type: types.CLEAR_CURRENT_ELECTOR
});

// ============================================================================
// UPDATE GUARANTEE STATUS
// ============================================================================

export const updateElectorGuaranteeStatus = (kocId: string, guaranteeStatus: GuaranteeStatus | null) => ({
  type: types.UPDATE_ELECTOR_GUARANTEE_STATUS,
  payload: { kocId, guaranteeStatus }
});
