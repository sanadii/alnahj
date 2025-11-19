/**
 * Strategic Command Center Types
 * Election Management System - Executive planning data structures
 */

// ============================================================================
// FILTERS & ENUMS
// ============================================================================

/**
 * Available focus areas for scenario recommendations
 */
export type StrategicFocus = 'coverage' | 'budget' | 'resources';

/**
 * Supported time ranges for trend analysis
 */
export type StrategicTimeRange = '7days' | '30days' | '90days';

// ============================================================================
// DATA CONTRACTS (aligned with backend reports endpoints)
// ============================================================================

export interface StrategicOverview {
  overview: {
    totalUsers: number;
    totalElectors: number;
    totalGuarantees: number;
    totalAttendance: number;
    coveragePercentage: number;
    attendancePercentage: number;
  };
  guarantees: {
    total: number;
    strong: number;
    medium: number;
    weak: number;
    strongPercentage: number;
    electorsCovered: number;
  };
  attendance: {
    total: number;
    percentage: number;
    recent24h: number;
  };
  users: {
    total: number;
    admins: number;
    supervisors: number;
    regular: number;
  };
  committees: Array<{
    code: string;
    name: string;
    totalElectors: number;
    totalAttendance: number;
    attendancePercentage: number;
  }>;
  recentActivity: Array<{
    type: string;
    user: string;
    description: string;
    timestamp: string;
  }>;
  trends: {
    guarantees24h: number;
    guaranteeTrend: number;
    attendance24h: number;
  };
}

export interface StrategicCoverageSummary {
  summary: {
    totalElectors: number;
    coveredElectors: number;
    uncoveredElectors: number;
    coveragePercentage: number;
  };
  byCommittee: Array<{
    committeeCode: string;
    committeeName: string;
    totalElectors: number;
    covered: number;
    uncovered: number;
    coveragePercentage: number;
  }>;
  bySection: Array<{
    section: string | null;
    total: number;
    covered: number;
    uncovered: number;
    coveragePercentage: number;
  }>;
  byUser: Array<{
    userName: string;
    userEmail: string;
    totalGuarantees: number;
    strong: number;
    medium: number;
    weak: number;
  }>;
  coverageGaps: Array<{
    kocId: string;
    name: string;
    section: string | null;
    committee: string | null;
  }>;
  recommendations: Array<{
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    message: string;
  }>;
}

export interface StrategicTrendSeries {
  dates: string[];
  guarantees: number[];
  attendance: number[];
  coverage: number[];
}

export interface StrategicChartPayload {
  chartType: 'PIE' | 'BAR' | 'LINE' | 'AREA' | 'DONUT';
  title: string;
  labels: string[];
  datasets: any[];
  options?: Record<string, unknown>;
}

export interface StrategicRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium';
  actions: string[];
  targetCommittees?: string[];
  expectedImpact?: string;
}

export interface StrategicPlanDraft {
  objective: string;
  timeframe: string;
  targetGuarantees: number;
  budgetAllocation: number;
  focusArea: StrategicFocus;
  notes?: string;
  owners: string[];
}

// ============================================================================
// STATE
// ============================================================================

export interface StrategicState {
  loading: boolean;
  error: string | null;
  overview: StrategicOverview | null;
  coverage: StrategicCoverageSummary | null;
  trends: StrategicTrendSeries | null;
  guaranteeDistribution: StrategicChartPayload | null;
  committeeComparison: StrategicChartPayload | null;
  recommendations: StrategicRecommendation[];
  filters: {
    timeRange: StrategicTimeRange;
    focus: StrategicFocus;
    selectedCommittee: string | null;
  };
  lastUpdated?: string;
}

export interface StrategicLoadPayload {
  timeRange?: StrategicTimeRange;
  focus?: StrategicFocus;
}

export interface StrategicScenarioContext {
  overview: StrategicOverview | null;
  coverage: StrategicCoverageSummary | null;
  trends: StrategicTrendSeries | null;
  focus: StrategicFocus;
}
