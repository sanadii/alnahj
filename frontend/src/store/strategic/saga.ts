/**
 * Strategic Command Center - Saga
 */

import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { GET_STRATEGIC_DATA_REQUEST, CREATE_STRATEGIC_SNAPSHOT_REQUEST } from './actionTypes';
import {
  getStrategicDataSuccess,
  getStrategicDataFailure,
  createStrategicSnapshotSuccess,
  createStrategicSnapshotFailure,
  setStrategicFilters
} from './actions';
import type { GetStrategicDataRequestAction, StrategicState } from './types';
import * as strategicApi from 'helpers/api/strategic';
import { openSnackbar } from 'store/snackbar/actions';
import type { RootState } from 'store';

function extractErrorMessage(error: unknown, fallback: string): string {
  if (!error) return fallback;
  if (typeof error === 'string') return error;
  const responseMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
  if (typeof responseMessage === 'string') return responseMessage;
  const fallbackMessage = (error as { message?: string })?.message;
  if (typeof fallbackMessage === 'string') return fallbackMessage;
  return fallback;
}

function* loadStrategicData(action: GetStrategicDataRequestAction) {
  try {
    const currentFilters: StrategicState['filters'] = yield select(
      (state: RootState) =>
        state.strategic?.filters || {
          timeRange: '30days',
          focus: 'coverage',
          selectedCommittee: null
        }
    );

    const filters = {
      ...currentFilters,
      ...(action.payload || {})
    };

    if (action.payload) {
      yield put(setStrategicFilters(action.payload));
    }

    const [overviewResponse, coverageResponse, trendsResponse, guaranteeDistributionResponse, committeeComparisonResponse] = yield all([
      call(strategicApi.getStrategicOverview),
      call(strategicApi.getCoverageSummary),
      call(strategicApi.getTrendSeries, filters.timeRange),
      call(strategicApi.getGuaranteeDistributionChart),
      call(strategicApi.getCommitteeComparisonChart)
    ]);

    yield put(
      getStrategicDataSuccess({
        overview: overviewResponse.data,
        coverage: coverageResponse.data,
        trends: trendsResponse.data,
        guaranteeDistribution: guaranteeDistributionResponse.data,
        committeeComparison: committeeComparisonResponse.data,
        recommendations: [],
        lastUpdated: new Date().toISOString()
      })
    );
  } catch (error: any) {
    const message = extractErrorMessage(error, 'Failed to load strategic insights');
    console.error('❌ [StrategicSaga] Error loading strategic data:', error);
    yield put(getStrategicDataFailure(message));
    yield put(
      openSnackbar({
        open: true,
        message,
        variant: 'error'
      })
    );
  }
}

function* createSnapshot() {
  try {
    const response = yield call(strategicApi.createAnalyticsSnapshot);

    yield put(createStrategicSnapshotSuccess(response.message || 'Snapshot created'));
    yield put(
      openSnackbar({
        open: true,
        message: response.message || 'Snapshot created successfully',
        variant: 'success'
      })
    );

    yield put({ type: GET_STRATEGIC_DATA_REQUEST });
  } catch (error: any) {
    const message = extractErrorMessage(error, 'Failed to create analytics snapshot');
    console.error('❌ [StrategicSaga] Error creating analytics snapshot:', error);
    yield put(createStrategicSnapshotFailure(message));
    yield put(
      openSnackbar({
        open: true,
        message,
        variant: 'error'
      })
    );
  }
}

export function* watchStrategicData() {
  yield takeLatest(GET_STRATEGIC_DATA_REQUEST, loadStrategicData);
}

export function* watchStrategicSnapshots() {
  yield takeLatest(CREATE_STRATEGIC_SNAPSHOT_REQUEST, createSnapshot);
}

export default function* strategicSaga() {
  yield all([watchStrategicData(), watchStrategicSnapshots()]);
}
