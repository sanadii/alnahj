/**
 * Strategic Command Center API Service
 * Aggregates executive analytics from reports endpoints.
 */

import axios from 'utils/axios';
import { wrapResponse } from './responseNormalizer';
import type { APIResponse } from 'types/api';
import type { StrategicOverview, StrategicCoverageSummary, StrategicTrendSeries, StrategicChartPayload, StrategicTimeRange } from 'types';

const REPORTS_BASE = '/api/reports';

const convertRangeToDays = (range: StrategicTimeRange | number): number => {
  if (typeof range === 'number') {
    return range;
  }

  switch (range) {
    case '7days':
      return 7;
    case '90days':
      return 90;
    case '30days':
    default:
      return 30;
  }
};

// =========================================================================
// Dashboard Overview (Admin)
// =========================================================================

export const getStrategicOverview = async (): Promise<APIResponse<StrategicOverview>> => {
  const response = await axios.get(`${REPORTS_BASE}/dashboard/admin/`);
  return wrapResponse<StrategicOverview>(response.data);
};

// =========================================================================
// Coverage Intelligence
// =========================================================================

export const getCoverageSummary = async (): Promise<APIResponse<StrategicCoverageSummary>> => {
  const response = await axios.get(`${REPORTS_BASE}/coverage/`);
  return wrapResponse<StrategicCoverageSummary>(response.data);
};

// =========================================================================
// Trend Analytics
// =========================================================================

export const getTrendSeries = async (range: StrategicTimeRange | number = '30days'): Promise<APIResponse<StrategicTrendSeries>> => {
  const days = convertRangeToDays(range);
  const response = await axios.get(`${REPORTS_BASE}/analytics/trends/`, {
    params: { days }
  });
  return wrapResponse<StrategicTrendSeries>(response.data);
};

// =========================================================================
// Chart Data
// =========================================================================

export const getGuaranteeDistributionChart = async (): Promise<APIResponse<StrategicChartPayload>> => {
  const response = await axios.get(`${REPORTS_BASE}/charts/guarantee-distribution/`);
  return wrapResponse<StrategicChartPayload>(response.data);
};

export const getCommitteeComparisonChart = async (): Promise<APIResponse<StrategicChartPayload>> => {
  const response = await axios.get(`${REPORTS_BASE}/charts/committee-comparison/`);
  return wrapResponse<StrategicChartPayload>(response.data);
};

// =========================================================================
// Snapshot Control
// =========================================================================

export const createAnalyticsSnapshot = async (): Promise<APIResponse<any>> => {
  const response = await axios.post(`${REPORTS_BASE}/analytics/create-snapshot/`, {});
  return wrapResponse(response.data);
};
