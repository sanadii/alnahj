/**
 * Strategic Command Center - Selectors
 */

import type { RootState } from 'store';
import type { StrategicState } from 'types/strategic';

export const selectStrategicState = (state: RootState): StrategicState => state.strategic;

export const selectStrategicLoading = (state: RootState) => selectStrategicState(state).loading;
export const selectStrategicError = (state: RootState) => selectStrategicState(state).error;
export const selectStrategicOverview = (state: RootState) => selectStrategicState(state).overview;
export const selectStrategicCoverage = (state: RootState) => selectStrategicState(state).coverage;
export const selectStrategicTrends = (state: RootState) => selectStrategicState(state).trends;
export const selectStrategicCharts = (state: RootState) => ({
  guaranteeDistribution: selectStrategicState(state).guaranteeDistribution,
  committeeComparison: selectStrategicState(state).committeeComparison
});
export const selectStrategicFilters = (state: RootState) => selectStrategicState(state).filters;
export const selectStrategicRecommendations = (state: RootState) => selectStrategicState(state).recommendations;
export const selectStrategicLastUpdated = (state: RootState) => selectStrategicState(state).lastUpdated;
