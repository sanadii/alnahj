/**
 * Strategic Command Center - Action Types & Interfaces
 */

import type { StrategicState, StrategicLoadPayload, StrategicTimeRange, StrategicFocus } from 'types/strategic';
import {
  GET_STRATEGIC_DATA_REQUEST,
  GET_STRATEGIC_DATA_SUCCESS,
  GET_STRATEGIC_DATA_FAILURE,
  SET_STRATEGIC_FILTERS,
  CREATE_STRATEGIC_SNAPSHOT_REQUEST,
  CREATE_STRATEGIC_SNAPSHOT_SUCCESS,
  CREATE_STRATEGIC_SNAPSHOT_FAILURE
} from './actionTypes';

// ============================================================================
// ACTION INTERFACES
// ============================================================================

export interface GetStrategicDataRequestAction {
  type: typeof GET_STRATEGIC_DATA_REQUEST;
  payload?: StrategicLoadPayload;
}

export interface GetStrategicDataSuccessAction {
  type: typeof GET_STRATEGIC_DATA_SUCCESS;
  payload: Pick<
    StrategicState,
    'overview' | 'coverage' | 'trends' | 'guaranteeDistribution' | 'committeeComparison' | 'recommendations' | 'lastUpdated'
  >;
}

export interface GetStrategicDataFailureAction {
  type: typeof GET_STRATEGIC_DATA_FAILURE;
  payload: string;
}

export interface SetStrategicFiltersAction {
  type: typeof SET_STRATEGIC_FILTERS;
  payload: Partial<StrategicState['filters']>;
}

export interface CreateStrategicSnapshotRequestAction {
  type: typeof CREATE_STRATEGIC_SNAPSHOT_REQUEST;
}

export interface CreateStrategicSnapshotSuccessAction {
  type: typeof CREATE_STRATEGIC_SNAPSHOT_SUCCESS;
  payload?: string;
}

export interface CreateStrategicSnapshotFailureAction {
  type: typeof CREATE_STRATEGIC_SNAPSHOT_FAILURE;
  payload: string;
}

// ============================================================================
// UNION TYPES
// ============================================================================

export type StrategicActionTypes =
  | GetStrategicDataRequestAction
  | GetStrategicDataSuccessAction
  | GetStrategicDataFailureAction
  | SetStrategicFiltersAction
  | CreateStrategicSnapshotRequestAction
  | CreateStrategicSnapshotSuccessAction
  | CreateStrategicSnapshotFailureAction;

// ============================================================================
// EXPORTS
// ============================================================================

export type { StrategicState, StrategicLoadPayload, StrategicTimeRange, StrategicFocus };
