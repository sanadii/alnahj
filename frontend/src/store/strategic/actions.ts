/**
 * Strategic Command Center - Actions
 */

import type { StrategicLoadPayload, StrategicState } from 'types/strategic';
import {
  GET_STRATEGIC_DATA_REQUEST,
  GET_STRATEGIC_DATA_SUCCESS,
  GET_STRATEGIC_DATA_FAILURE,
  SET_STRATEGIC_FILTERS,
  CREATE_STRATEGIC_SNAPSHOT_REQUEST,
  CREATE_STRATEGIC_SNAPSHOT_SUCCESS,
  CREATE_STRATEGIC_SNAPSHOT_FAILURE
} from './actionTypes';
import type {
  GetStrategicDataRequestAction,
  GetStrategicDataSuccessAction,
  GetStrategicDataFailureAction,
  SetStrategicFiltersAction,
  CreateStrategicSnapshotRequestAction,
  CreateStrategicSnapshotSuccessAction,
  CreateStrategicSnapshotFailureAction
} from './types';

export const getStrategicDataRequest = (payload?: StrategicLoadPayload): GetStrategicDataRequestAction => ({
  type: GET_STRATEGIC_DATA_REQUEST,
  payload
});

export const getStrategicDataSuccess = (payload: GetStrategicDataSuccessAction['payload']): GetStrategicDataSuccessAction => ({
  type: GET_STRATEGIC_DATA_SUCCESS,
  payload
});

export const getStrategicDataFailure = (message: string): GetStrategicDataFailureAction => ({
  type: GET_STRATEGIC_DATA_FAILURE,
  payload: message
});

export const setStrategicFilters = (filters: Partial<StrategicState['filters']>): SetStrategicFiltersAction => ({
  type: SET_STRATEGIC_FILTERS,
  payload: filters
});

export const createStrategicSnapshotRequest = (): CreateStrategicSnapshotRequestAction => ({
  type: CREATE_STRATEGIC_SNAPSHOT_REQUEST
});

export const createStrategicSnapshotSuccess = (message?: string): CreateStrategicSnapshotSuccessAction => ({
  type: CREATE_STRATEGIC_SNAPSHOT_SUCCESS,
  payload: message
});

export const createStrategicSnapshotFailure = (message: string): CreateStrategicSnapshotFailureAction => ({
  type: CREATE_STRATEGIC_SNAPSHOT_FAILURE,
  payload: message
});
