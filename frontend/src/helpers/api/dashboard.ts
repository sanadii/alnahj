/**
 * Dashboard API Service
 *
 * Centralized API calls for election dashboard analytics and statistics
 * Handles all dashboard-related data fetching
 */

import { APIClient } from 'helpers/api_helper';
import { APIResponse } from 'types/api';

const api = new APIClient();

// ==============================|| TYPE DEFINITIONS ||============================== //

/**
 * Guarantee Trend Data Point
 */
export interface GuaranteeTrendData {
  date: string;
  strong: number;
  medium: number;
  weak: number;
  total: number;
  pending?: number;
  high?: number;
  not_available?: number;
}

/**
 * Group Performance Data
 */
export interface GroupPerformanceData {
  id: number;
  name: string;
  leader: string;
  membersCount: number;
  guaranteesCount: number;
  strongCount: number;
  mediumCount: number;
  weakCount: number;
  conversionRate: number;
  lastActivity: string;
  status: 'active' | 'inactive' | 'pending';
  pendingCount?: number;
  highCount?: number;
  notAvailableCount?: number;
}

/**
 * Hourly Attendance Data Point
 */
export interface HourlyAttendanceData {
  hour: string;
  attendance: number;
  votes: number;
  target: number;
}

/**
 * Elector Demographics Data
 */
export interface ElectorDemographicsData {
  total: number;
  male: number;
  female: number;
  malePercentage: number;
  femalePercentage: number;
  byCommittee: {
    committeeId: number;
    committeeName: string;
    male: number;
    female: number;
  }[];
  byFamily: {
    familyName: string;
    count: number;
    male: number;
    female: number;
  }[];
  byAge: {
    ageGroup: string;
    count: number;
    male: number;
    female: number;
  }[];
}

/**
 * Real-time Statistics Update
 */
export interface RealtimeStatsUpdate {
  electionId: number;
  totalElectors: number;
  totalAttendance: number;
  totalVotes: number;
  attendancePercentage: number;
  votingPercentage: number;
  lastUpdated: string;
  committeeStats: {
    committeeId: number;
    attendanceCount: number;
    voteCount: number;
  }[];
}

/**
 * Dashboard Summary Statistics
 */
export interface DashboardSummary {
  electionId: number;
  totalParties: number;
  totalCandidates: number;
  totalCommittees: number;
  totalElectors: number;
  totalAttendance: number;
  totalVotes: number;
  totalGuarantees: number;
  attendancePercentage: number;
  votingPercentage: number;
  guaranteeStats: {
    strong: number;
    medium: number;
    weak: number;
    pendingFollowUp: number;
    overdue: number;
  };
}

/**
 * Reports Personal Dashboard payload (matches backend schema)
 */
export interface ReportsPersonalDashboard {
  my_guarantees: {
    total: number;
    pending: number;
    not_available: number;
    confirmed: number;
    guaranteed: number;
    guaranteed_percentage: number;
  };
  my_groups: {
    group__name: string;
    group__color: string;
    count: number;
  }[];
  recent_guarantees: any[];
  quick_stats: {
    coverage_rate: number;
    confidence_score: number;
  };
}

/**
 * Reports Supervisor Dashboard payload
 */
export interface ReportsSupervisorDashboard {
  team_overview: {
    total_members: number;
    active_today: number;
    total_guarantees: number;
  };
  team_guarantees: {
    total: number;
    pending: number;
    guaranteed: number;
    not_available: number;
    confirmed: number;
  };
  team_members: {
    id: number;
    name: string;
    email: string;
    total: number;
    pending: number;
    guaranteed: number;
    not_available: number;
    confirmed: number;
  }[];
  team_progress: {
    average_per_member: number;
    top_performer: ReportsSupervisorDashboard['team_members'][number] | null;
  };
  recent_activity: {
    user_name: string;
    elector_name: string;
    status: string;
    confirmation_status: string;
    created_at: string;
  }[];
}

/**
 * Reports Admin Dashboard payload
 */
export interface ReportsAdminDashboard {
  overview: Record<string, number>;
  system_overview?: Record<string, number>;
  guarantees: Record<string, number>;
  attendance: Record<string, number>;
  users: Record<string, number>;
  committees: any[];
  recent_activity: any[];
  trends: Record<string, number | any>;
  budget_overview?: Record<string, any>;
  resource_overview?: Record<string, any>;
  performance_forecast?: Record<string, any>;
}

/**
 * Coverage report payload
 */
export interface CoverageReportData {
  summary: Record<string, any>;
  by_committee: any[];
  by_section: any[];
  by_user: any[];
  coverage_gaps: any[];
  recommendations: any[];
}

/**
 * Accuracy report payload
 */
export interface AccuracyReportData {
  summary: Record<string, any>;
  by_status: Record<string, any>;
  by_user: any[];
  accuracy_metrics: Record<string, any>;
  predictions_vs_actual: any[];
}

/**
 * Committee performance report payload
 */
export interface CommitteePerformanceData {
  committee_stats: any[];
  attendance_rates: Record<string, any>;
  guarantee_distribution: any[];
  performance_comparison: Record<string, any>;
}

/**
 * Campaign performance payload
 */
export interface CampaignPerformancePayload {
  budget: Record<string, any>;
  resources: Record<string, any>;
  forecast?: Record<string, any>;
}

// ==============================|| API FUNCTIONS ||============================== //

/**
 * Get Guarantees Trend Data
 *
 * @param electionId - Election ID
 * @param period - Time period: '7days' | '30days' | '90days' | 'all'
 * @returns Promise with guarantee trends over time
 */
export const getGuaranteesTrend = async (
  electionId: number,
  period: '7days' | '30days' | '90days' | 'all' = '30days'
) => {
  return api.get(`/api/elections/${electionId}/dashboard/guarantees/trends/`, { period });
};

/**
 * Get Group Performance Data
 *
 * @param electionId - Election ID
 * @param filters - Optional filters (status, search, sortBy)
 * @returns Promise with group performance metrics
 */
export const getGroupPerformance = async (
  electionId: number,
  filters?: {
    status?: 'active' | 'inactive' | 'pending';
    search?: string;
    sortBy?: 'name' | 'guarantees' | 'conversionRate';
    sortOrder?: 'asc' | 'desc';
  }
) => {
  return api.get(`/api/elections/${electionId}/dashboard/groups/performance/`, filters);
};

/**
 * Get Hourly Attendance Data
 *
 * @param electionId - Election ID
 * @param date - Optional date (defaults to today)
 * @returns Promise with hourly attendance breakdown
 */
export const getHourlyAttendance = async (electionId: number, date?: string) => {
  const params = date ? { date } : {};
  return api.get(`/api/elections/${electionId}/dashboard/attendance/hourly/`, params);
};

/**
 * Get Attendance Dashboard Summary
 *
 * @param electionId - Election ID
 * @returns Promise with comprehensive attendance dashboard data
 */
export const getAttendanceDashboard = async (electionId: number) => {
  return api.get(`/api/elections/${electionId}/dashboard/attendance/summary/`);
};

/**
 * Get Elector Demographics
 *
 * @param electionId - Election ID
 * @returns Promise with elector demographics breakdown
 */
export const getElectorDemographics = async (electionId: number) => {
  return api.get(`/api/elections/${electionId}/dashboard/electors/demographics/`);
};

/**
 * Get configurable elector distribution data
 *
 * @param electionId - Election ID
 * @param primary - Primary axis dimension
 * @param secondary - Optional secondary axis dimension
 * @param limit - Optional limit for primary categories
 */
export const getElectorDistribution = async (
  electionId: number,
  primary: 'family' | 'gender' | 'department' | 'team',
  secondary?: 'family' | 'gender' | 'department' | 'team' | null,
  limit?: number
) => {
  const params: Record<string, string | number> = { primary };
  if (secondary && secondary !== 'none') {
    params.secondary = secondary;
  }
  if (typeof limit === 'number') {
    params.limit = limit;
  }

  return api.get(`/api/elections/${electionId}/dashboard/electors/distribution/`, params);
};

/**
 * Get Real-time Statistics
 *
 * @param electionId - Election ID
 * @returns Promise with real-time dashboard statistics
 */
export const getRealtimeStats = async (electionId: number) => {
  return api.get(`/api/elections/${electionId}/dashboard/stats/realtime/`);
};

/**
 * Get Dashboard Summary
 *
 * @param electionId - Election ID
 * @returns Promise with complete dashboard summary
 */
export const getDashboardSummary = async (electionId: number) => {
  return api.get(`/api/elections/${electionId}/dashboard/summary/`);
};

/**
 * Get combined dashboard overview (attendance + demographics)
 *
 * @param electionId - Election ID
 * @returns Promise with consolidated dashboard snapshot
 */
export const getDashboardOverview = async (electionId: number) => {
  return api.get(`/api/elections/${electionId}/dashboard/overview/`);
};

/**
 * Export Dashboard Data
 *
 * @param electionId - Election ID
 * @param format - Export format: 'pdf' | 'excel' | 'csv'
 * @returns Promise with file download URL or Blob
 */
export const exportDashboardData = async (
  electionId: number,
  format: 'pdf' | 'excel' | 'csv' = 'excel'
) => {
  return api.get(`/api/elections/${electionId}/dashboard/export/`, { format });
};

// ==============================|| REPORTS API HELPERS ||============================== //

export const getReportsPersonalDashboard = async () => {
  return api.get<APIResponse<ReportsPersonalDashboard>>('/api/reports/dashboard/personal/');
};

export const getReportsSupervisorDashboard = async () => {
  return api.get<APIResponse<ReportsSupervisorDashboard>>('/api/reports/dashboard/supervisor/');
};

export const getReportsAdminDashboard = async () => {
  return api.get<APIResponse<ReportsAdminDashboard>>('/api/reports/dashboard/admin/');
};

export const getCoverageReport = async () => {
  return api.get<APIResponse<CoverageReportData>>('/api/reports/coverage/');
};

export const getAccuracyReport = async () => {
  return api.get<APIResponse<AccuracyReportData>>('/api/reports/accuracy/');
};

export const getCommitteePerformanceReport = async () => {
  return api.get<APIResponse<CommitteePerformanceData>>('/api/reports/committee-performance/');
};

export const exportReportData = async (payload: {
  report_type: 'COVERAGE' | 'GUARANTEE_COVERAGE' | 'ACCURACY' | 'GUARANTEE_ACCURACY' | 'COMMITTEE_PERFORMANCE';
  format: 'CSV' | 'EXCEL' | 'PDF';
  parameters?: Record<string, unknown>;
  include_charts?: boolean;
}) => {
  return api.post('/api/reports/export/', payload);
};

export const getCampaignPerformance = async () => {
  return api.get<APIResponse<CampaignPerformancePayload>>('/api/reports/analytics/campaign-performance/');
};

export const getReportGuaranteeDistribution = async () => {
  return api.get<APIResponse<{ data: ChartDataSerializer }>>('/api/reports/charts/guarantee-distribution/');
};

export const getReportCommitteeComparison = async () => {
  return api.get<APIResponse<{ data: ChartDataSerializer }>>('/api/reports/charts/committee-comparison/');
};

// ==============================|| MOCK DATA (for development) ||============================== //

/**
 * Generate mock guarantee trend data
 * Used for development/testing when backend is not available
 */
export const mockGuaranteesTrend = (days: number = 30): GuaranteeTrendData[] => {
  const data: GuaranteeTrendData[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const pending = Math.floor(Math.random() * 12) + 8;
    const medium = Math.floor(Math.random() * 15) + 25;
    const high = Math.floor(Math.random() * 20) + 40;
    const notAvailable = Math.floor(Math.random() * 6) + 4;
    const total = pending + medium + high + notAvailable;

    data.push({
      date: date.toISOString().split('T')[0],
      strong: high,
      medium,
      weak: pending + notAvailable,
      total,
      pending,
      high,
      not_available: notAvailable
    });
  }

  return data;
};

/**
 * Generate mock group performance data
 */
export const mockGroupPerformance = (): GroupPerformanceData[] => {
  const groups = [
    'North Region Team',
    'South Region Team',
    'East Region Team',
    'West Region Team',
    'Central District Team',
    'Youth Outreach Group',
    'Senior Citizens Group',
    'Women Empowerment Group'
  ];

  return groups.map((name, index) => ({
    id: index + 1,
    name,
    leader: `Leader ${index + 1}`,
    membersCount: Math.floor(Math.random() * 20) + 5,
    guaranteesCount: Math.floor(Math.random() * 100) + 20,
    strongCount: Math.floor(Math.random() * 40) + 10,
    mediumCount: Math.floor(Math.random() * 30) + 10,
    weakCount: Math.floor(Math.random() * 20) + 5,
    pendingCount: Math.floor(Math.random() * 15) + 5,
    highCount: Math.floor(Math.random() * 40) + 10,
    notAvailableCount: Math.floor(Math.random() * 10) + 3,
    conversionRate: Math.floor(Math.random() * 40) + 60,
    lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: (['active', 'inactive', 'pending'] as const)[Math.floor(Math.random() * 3)]
  }));
};

/**
 * Generate mock hourly attendance data
 */
export const mockHourlyAttendance = (): HourlyAttendanceData[] => {
  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  return hours.map((hour) => {
    const attendance = Math.floor(Math.random() * 100) + 50;
    // Ensure votes is always less than or equal to attendance
    const votes = Math.floor(Math.random() * attendance * 0.9) + Math.floor(attendance * 0.7);

    return {
      hour,
      attendance,
      votes: Math.min(votes, attendance), // Ensure votes never exceeds attendance
      target: 120
    };
  });
};

/**
 * Generate mock elector demographics data
 */
export const mockElectorDemographics = (): ElectorDemographicsData => {
  const total = 1000;
  const male = 520;
  const female = 480;

  return {
    total,
    male,
    female,
    malePercentage: (male / total) * 100,
    femalePercentage: (female / total) * 100,
    byCommittee: [
      { committeeId: 1, committeeName: 'Committee 1', male: 120, female: 100 },
      { committeeId: 2, committeeName: 'Committee 2', male: 150, female: 130 },
      { committeeId: 3, committeeName: 'Committee 3', male: 110, female: 120 },
      { committeeId: 4, committeeName: 'Committee 4', male: 140, female: 130 }
    ],
    byFamily: [
      { familyName: 'Al-Ahmad', count: 45, male: 23, female: 22 },
      { familyName: 'Al-Mohammed', count: 38, male: 20, female: 18 },
      { familyName: 'Al-Hassan', count: 42, male: 21, female: 21 },
      { familyName: 'Al-Ali', count: 35, male: 18, female: 17 },
      { familyName: 'Other Families', count: 840, male: 438, female: 402 }
    ],
    byAge: [
      { ageGroup: '18-25', count: 150, male: 75, female: 75 },
      { ageGroup: '26-35', count: 280, male: 145, female: 135 },
      { ageGroup: '36-45', count: 250, male: 130, female: 120 },
      { ageGroup: '46-55', count: 180, male: 95, female: 85 },
      { ageGroup: '56+', count: 140, male: 75, female: 65 }
    ]
  };
};

