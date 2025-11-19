/**
 * Dashboard Data Hooks
 *
 * Custom hooks for fetching and managing dashboard data
 * Provides easy-to-use interfaces for all dashboard components
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import useApi, { UseApiReturn } from 'shared/hooks/useApi';
import {
  getGuaranteesTrend,
  getGroupPerformance,
  getHourlyAttendance,
  getElectorDemographics,
  getRealtimeStats,
  getDashboardSummary,
  getDashboardOverview,
  GuaranteeTrendData,
  GroupPerformanceData,
  HourlyAttendanceData,
  ElectorDemographicsData,
  RealtimeStatsUpdate,
  DashboardSummary,
  mockGuaranteesTrend,
  mockGroupPerformance,
  mockHourlyAttendance,
  mockElectorDemographics
} from 'helpers/api/dashboard';
import type {
  AttendanceDashboardData,
  AttendanceSummary,
  CommitteeAttendance,
  GuaranteeGroupAttendance,
  GuaranteeUserAttendance,
  GuaranteeUserGroupDetail
} from 'views/dashboard/components/hooks/useAttendanceDashboard';

// ==============================|| CONFIGURATION ||============================== //

/**
 * Enable mock data mode for development
 * Set to true to use mock data instead of API calls
 *
 * Supports both VITE_ and REACT_APP_ prefixes
 * Defaults to TRUE (mock mode) for safety
 */
const USE_MOCK_DATA =
  import.meta.env.VITE_USE_MOCK_DASHBOARD === 'true' ||
  import.meta.env.VITE_USE_MOCK_DASHBOARD === true ||
  import.meta.env.REACT_APP_USE_MOCK_DASHBOARD === 'true' ||
  import.meta.env.REACT_APP_USE_MOCK_DASHBOARD === true ||
  // Default to TRUE (mock mode) if not set
  (import.meta.env.VITE_USE_MOCK_DASHBOARD === undefined && import.meta.env.REACT_APP_USE_MOCK_DASHBOARD === undefined);

// ==============================|| HOOKS ||============================== //

/**
 * Hook for fetching guarantee trend data
 *
 * @param electionId - Election ID
 * @param period - Time period for trends
 * @param options - Additional options (autoFetch, onSuccess, onError)
 *
 * @example
 * const { data, loading, error, refetch } = useGuaranteesTrend(electionId, '30days');
 */
export function useGuaranteesTrend(
  electionId: number | null,
  period: '7days' | '30days' | '90days' | 'all' = '30days',
  options: { autoFetch?: boolean; onSuccess?: (data: any) => void; onError?: (error: any) => void } = {}
): UseApiReturn<GuaranteeTrendData[]> {
  const { autoFetch = true, ...restOptions } = options;

  // Mock data fallback
  const [mockData, setMockData] = useState<GuaranteeTrendData[] | null>(null);

  useEffect(() => {
    if (USE_MOCK_DATA && autoFetch) {
      const days = period === '7days' ? 7 : period === '30days' ? 30 : period === '90days' ? 90 : 365;
      setMockData(mockGuaranteesTrend(days));
    }
  }, [period, autoFetch]);

  const apiResult = useApi<GuaranteeTrendData[]>(
    () => {
      if (!electionId) throw new Error('Election ID is required');
      return getGuaranteesTrend(electionId, period);
    },
    {
      autoFetch: autoFetch && !USE_MOCK_DATA && !!electionId,
      deps: [electionId, period],
      ...restOptions
    }
  );

  // Return mock data if enabled
  if (USE_MOCK_DATA) {
    return {
      ...apiResult,
      data: mockData,
      loading: false
    };
  }

  return apiResult;
}

/**
 * Hook for fetching group performance data
 *
 * @param electionId - Election ID
 * @param filters - Optional filters
 * @param options - Additional options
 *
 * @example
 * const { data, loading, error } = useGroupPerformance(electionId, { status: 'active' });
 */
export function useGroupPerformance(
  electionId: number | null,
  filters?: {
    status?: 'active' | 'inactive' | 'pending';
    search?: string;
    sortBy?: 'name' | 'guarantees' | 'conversionRate';
    sortOrder?: 'asc' | 'desc';
  },
  options: { autoFetch?: boolean; onSuccess?: (data: any) => void; onError?: (error: any) => void } = {}
): UseApiReturn<GroupPerformanceData[]> {
  const { autoFetch = true, ...restOptions } = options;

  // Mock data fallback
  const [mockData, setMockData] = useState<GroupPerformanceData[] | null>(null);

  useEffect(() => {
    if (USE_MOCK_DATA && autoFetch) {
      let data = mockGroupPerformance();

      // Apply filters to mock data
      if (filters?.status) {
        data = data.filter((g) => g.status === filters.status);
      }
      if (filters?.search) {
        data = data.filter((g) => g.name.toLowerCase().includes(filters.search!.toLowerCase()));
      }
      if (filters?.sortBy) {
        data.sort((a, b) => {
          const aVal = a[filters.sortBy!];
          const bVal = b[filters.sortBy!];
          const order = filters.sortOrder === 'desc' ? -1 : 1;
          return aVal > bVal ? order : aVal < bVal ? -order : 0;
        });
      }

      setMockData(data);
    }
  }, [filters, autoFetch]);

  const apiResult = useApi<GroupPerformanceData[]>(
    () => {
      if (!electionId) throw new Error('Election ID is required');
      return getGroupPerformance(electionId, filters);
    },
    {
      autoFetch: autoFetch && !USE_MOCK_DATA && !!electionId,
      deps: [electionId, JSON.stringify(filters)],
      ...restOptions
    }
  );

  // Return mock data if enabled
  if (USE_MOCK_DATA) {
    return {
      ...apiResult,
      data: mockData,
      loading: false
    };
  }

  return apiResult;
}

/**
 * Hook for fetching hourly attendance data
 *
 * @param electionId - Election ID
 * @param date - Optional date (defaults to today)
 * @param options - Additional options
 *
 * @example
 * const { data, loading, error } = useHourlyAttendance(electionId);
 */
export function useHourlyAttendance(
  electionId: number | null,
  date?: string,
  options: { autoFetch?: boolean; onSuccess?: (data: any) => void; onError?: (error: any) => void } = {}
): UseApiReturn<HourlyAttendanceData[]> {
  const { autoFetch = true, ...restOptions } = options;

  // Mock data fallback
  const [mockData, setMockData] = useState<HourlyAttendanceData[] | null>(null);

  useEffect(() => {
    if (USE_MOCK_DATA && autoFetch) {
      setMockData(mockHourlyAttendance());
    }
  }, [date, autoFetch]);

  const apiResult = useApi<HourlyAttendanceData[]>(
    () => {
      if (!electionId) throw new Error('Election ID is required');
      return getHourlyAttendance(electionId, date);
    },
    {
      autoFetch: autoFetch && !USE_MOCK_DATA && !!electionId,
      deps: [electionId, date],
      ...restOptions
    }
  );

  // Return mock data if enabled
  if (USE_MOCK_DATA) {
    return {
      ...apiResult,
      data: mockData,
      loading: false
    };
  }

  return apiResult;
}

/**
 * Hook for fetching elector demographics
 *
 * @param electionId - Election ID
 * @param options - Additional options
 *
 * @example
 * const { data, loading, error } = useElectorDemographics(electionId);
 */
export function useElectorDemographics(
  electionId: number | null,
  options: { autoFetch?: boolean; onSuccess?: (data: any) => void; onError?: (error: any) => void } = {}
): UseApiReturn<ElectorDemographicsData> {
  const { autoFetch = true, ...restOptions } = options;

  // Mock data fallback
  const [mockData, setMockData] = useState<ElectorDemographicsData | null>(null);

  useEffect(() => {
    if (USE_MOCK_DATA && autoFetch) {
      setMockData(mockElectorDemographics());
    }
  }, [autoFetch]);

  const apiResult = useApi<any>(
    () => {
      if (!electionId) throw new Error('Election ID is required');
      return getElectorDemographics(electionId);
    },
    {
      autoFetch: autoFetch && !USE_MOCK_DATA && !!electionId,
      deps: [electionId],
      ...restOptions
    }
  );

  // Transform API response to match expected structure
  const transformedData = useMemo(() => {
    if (!apiResult.data) return null;
    
    // API returns { status: "success", data: { byArea, byTeam, byDepartment, byFamily, byGender } }
    let response = apiResult.data;
    
    // Handle wrapped response structure
    if (response.status === 'success' && response.data) {
      response = response.data;
    } else if (response.data) {
      response = response.data;
    }

    if (!response || typeof response !== 'object') return null;

    // Use mapDemographics to transform the response (handles both snake_case and camelCase)
    return mapDemographics(response);
  }, [apiResult.data]);

  // Return mock data if enabled
  if (USE_MOCK_DATA) {
    return {
      ...apiResult,
      data: mockData,
      loading: false
    };
  }

  return {
    ...apiResult,
    data: transformedData
  };
}

/**
 * Hook for fetching real-time statistics
 *
 * @param electionId - Election ID
 * @param refreshInterval - Auto-refresh interval in milliseconds (default: 30000 = 30 seconds)
 * @param options - Additional options
 *
 * @example
 * const { data, loading, error } = useRealtimeStats(electionId, 30000);
 */
export function useRealtimeStats(
  electionId: number | null,
  refreshInterval: number = 30000,
  options: { autoFetch?: boolean; onSuccess?: (data: any) => void; onError?: (error: any) => void } = {}
): UseApiReturn<RealtimeStatsUpdate> {
  const { autoFetch = true, ...restOptions } = options;

  const apiResult = useApi<RealtimeStatsUpdate>(
    () => {
      if (!electionId) throw new Error('Election ID is required');
      return getRealtimeStats(electionId);
    },
    {
      autoFetch: autoFetch && !!electionId,
      deps: [electionId],
      ...restOptions
    }
  );

  // Setup auto-refresh interval
  useEffect(() => {
    if (!autoFetch || !electionId || USE_MOCK_DATA) return;

    const interval = setInterval(() => {
      apiResult.refetch();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [electionId, refreshInterval, autoFetch, apiResult]);

  return apiResult;
}

/**
 * Hook for fetching complete dashboard summary
 *
 * @param electionId - Election ID
 * @param options - Additional options
 *
 * @example
 * const { data, loading, error } = useDashboardSummary(electionId);
 */
export function useDashboardSummary(
  electionId: number | null,
  options: { autoFetch?: boolean; onSuccess?: (data: any) => void; onError?: (error: any) => void } = {}
): UseApiReturn<DashboardSummary> {
  const { autoFetch = true, ...restOptions } = options;

  return useApi<DashboardSummary>(
    () => {
      if (!electionId) throw new Error('Election ID is required');
      return getDashboardSummary(electionId);
    },
    {
      autoFetch: autoFetch && !!electionId,
      deps: [electionId],
      ...restOptions
    }
  );
}

interface DashboardOverviewTotals {
  areas: number;
  teams: number;
  departments: number;
  families: number;
  committees: number;
  electors: number;
  attendance: number;
  votes: number;
}

interface DashboardOverviewMeta {
  electionId: number;
  totals: DashboardOverviewTotals;
  generatedAt: string;
}

interface DashboardOverviewData {
  summary: AttendanceSummary;
  committees: CommitteeAttendance[];
  guaranteeBreakdown: {
    byUser: GuaranteeUserAttendance[];
    byGroup: GuaranteeGroupAttendance[];
    byUserGroups: GuaranteeUserGroupDetail[];
  };
  topPerformers: CommitteeAttendance[];
  lowPerformers: CommitteeAttendance[];
  demographics: ElectorDemographicsData;
}

interface UseDashboardOverviewReturn {
  data: DashboardOverviewData | null;
  meta: DashboardOverviewMeta | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const mapCommittee = (committee: any): CommitteeAttendance => ({
  id: committee.id,
  code: committee.code,
  name: committee.name,
  gender: committee.gender,
  electorCount: committee.elector_count ?? committee.electorCount ?? 0,
  electorAttendanceCount: committee.elector_attendance_count ?? committee.electorAttendanceCount ?? 0,
  electorAttendancePercentage:
    committee.elector_attendance_percentage ?? committee.electorAttendancePercentage ?? 0,
  guaranteeCount: committee.guarantee_count ?? committee.guaranteeCount ?? 0,
  guaranteeAttendanceCount: committee.guarantee_attendance_count ?? committee.guaranteeAttendanceCount ?? 0,
  guaranteeAttendancePercentage:
    committee.guarantee_attendance_percentage ?? committee.guaranteeAttendancePercentage ?? 0
});

const mapGuaranteeUser = (entry: any): GuaranteeUserAttendance => ({
  userId: entry.user_id ?? entry.userId ?? null,
  userName: entry.user_name ?? entry.userName ?? 'Unassigned User',
  totalGuarantees: entry.total_guarantees ?? entry.totalGuarantees ?? 0,
  attended: entry.attended ?? entry.attendedGuarantees ?? entry.total_attended ?? 0,
  attendancePercentage: entry.attendance_percentage ?? entry.attendancePercentage ?? 0
});

const mapGuaranteeGroup = (entry: any): GuaranteeGroupAttendance => ({
  groupId: entry.group_id ?? entry.groupId ?? -1,
  groupName: entry.group_name ?? entry.groupName ?? 'Ungrouped',
  totalGuarantees: entry.total_guarantees ?? entry.totalGuarantees ?? 0,
  attended: entry.attended ?? entry.attendedGuarantees ?? 0,
  attendancePercentage: entry.attendance_percentage ?? entry.attendancePercentage ?? 0
});

const mapGuaranteeUserGroup = (entry: any): GuaranteeUserGroupDetail => ({
  userId: entry.user_id ?? entry.userId ?? null,
  userName: entry.user_name ?? entry.userName ?? 'Unassigned User',
  groups: Array.isArray(entry.groups)
    ? entry.groups.map((group: any) => ({
        groupId: group.group_id ?? group.groupId ?? -1,
        groupName: group.group_name ?? group.groupName ?? 'Ungrouped',
        totalGuarantees: group.total_guarantees ?? group.totalGuarantees ?? 0,
        attended: group.attended ?? group.attendedGuarantees ?? 0,
        attendancePercentage: group.attendance_percentage ?? group.attendancePercentage ?? 0
      }))
    : []
});

const mapDemographics = (demographics: any): ElectorDemographicsData => {
  // Helper to get array from either snake_case or camelCase
  const getArray = (snakeKey: string, camelKey: string) => {
    const arr = demographics[snakeKey] ?? demographics[camelKey];
    return Array.isArray(arr) ? arr : [];
  };

  // Helper to map items with consistent field access
  const mapItem = (item: any) => ({
    code: item.code,
    name: item.name,
    totalElectors: item.total_electors ?? item.totalElectors ?? 0,
    attended: item.attended ?? 0,
    attendancePercentage: item.attendance_percentage ?? item.attendancePercentage ?? 0,
    male: item.male ?? 0,
    female: item.female ?? 0
  });

  return {
    byGender: demographics.by_gender ?? demographics.byGender ?? [],
    byArea: getArray('by_area', 'byArea').map(mapItem),
    byTeam: getArray('by_team', 'byTeam').map(mapItem),
    byDepartment: getArray('by_department', 'byDepartment').map(mapItem),
    byFamily: getArray('by_family', 'byFamily').map((item: any) => ({
      familyName: item.family_name ?? item.familyName ?? 'Unspecified',
      count: item.count ?? 0,
      male: item.male ?? 0,
      female: item.female ?? 0
    }))
  };
};

export function useDashboardOverview(
  electionId: number | null,
  options: { autoFetch?: boolean; onSuccess?: (data: DashboardOverviewData) => void; onError?: (error: any) => void } = {}
): UseDashboardOverviewReturn {
  const { autoFetch = true, onSuccess, onError } = options;
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [meta, setMeta] = useState<DashboardOverviewMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!electionId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getDashboardOverview(electionId);
      const backendResponse = response.data ?? response;

      if (backendResponse.status === 'success') {
        const payload = backendResponse.data as AttendanceDashboardData & { demographics: any; guarantee_breakdown: any };
        const summary = payload.summary ?? {};
        const overviewData: DashboardOverviewData = {
          summary: {
            totalElectors: summary.total_electors ?? summary.totalElectors ?? 0,
            totalAttendance: summary.total_attendance ?? summary.totalAttendance ?? 0,
            totalVotes: summary.total_votes ?? summary.totalVotes ?? 0,
            attendancePercentage: summary.attendance_percentage ?? summary.attendancePercentage ?? 0,
            votingPercentage: summary.voting_percentage ?? summary.votingPercentage ?? 0,
            participationRate: summary.participation_rate ?? summary.participationRate ?? 0
          },
          committees: Array.isArray(payload.committees) ? payload.committees.map(mapCommittee) : [],
          guaranteeBreakdown: {
            byUser: Array.isArray(payload.guarantee_breakdown?.by_user)
              ? payload.guarantee_breakdown.by_user.map(mapGuaranteeUser)
              : Array.isArray((payload as any).guaranteeBreakdown?.byUser)
              ? (payload as any).guaranteeBreakdown.byUser.map(mapGuaranteeUser)
              : [],
            byGroup: Array.isArray(payload.guarantee_breakdown?.by_group)
              ? payload.guarantee_breakdown.by_group.map(mapGuaranteeGroup)
              : Array.isArray((payload as any).guaranteeBreakdown?.byGroup)
              ? (payload as any).guaranteeBreakdown.byGroup.map(mapGuaranteeGroup)
              : [],
            byUserGroups: Array.isArray(payload.guarantee_breakdown?.by_user_groups)
              ? payload.guarantee_breakdown.by_user_groups.map(mapGuaranteeUserGroup)
              : Array.isArray((payload as any).guaranteeBreakdown?.byUserGroups)
              ? (payload as any).guaranteeBreakdown.byUserGroups.map(mapGuaranteeUserGroup)
              : []
          },
          topPerformers: Array.isArray(payload.top_performers)
            ? payload.top_performers.map(mapCommittee)
            : Array.isArray((payload as any).topPerformers)
            ? (payload as any).topPerformers.map(mapCommittee)
            : [],
          lowPerformers: Array.isArray(payload.low_performers)
            ? payload.low_performers.map(mapCommittee)
            : Array.isArray((payload as any).lowPerformers)
            ? (payload as any).lowPerformers.map(mapCommittee)
            : [],
          demographics: mapDemographics(payload.demographics ?? {})
        };

        const backendMeta = backendResponse.meta as {
          election_id: number;
          totals: DashboardOverviewTotals;
          generated_at: string;
        };
        const overviewMeta: DashboardOverviewMeta = {
          electionId: backendMeta?.election_id ?? electionId,
          totals: backendMeta?.totals ?? {
            areas: 0,
            teams: 0,
            departments: 0,
            families: 0,
            committees: 0,
            electors: 0,
            attendance: 0,
            votes: 0
          },
          generatedAt: backendMeta?.generated_at ?? new Date().toISOString()
        };

        setData(overviewData);
        setMeta(overviewMeta);
        onSuccess?.(overviewData);
      } else {
        const message = backendResponse.message || 'Failed to fetch dashboard overview';
        setError(message);
        onError?.(message);
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to fetch dashboard overview';
      setError(message);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [electionId, onError, onSuccess]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return {
    data,
    meta,
    loading,
    error,
    refetch: fetchData
  };
}

/**
 * Combined hook for all dashboard data
 * Fetches all dashboard data in one go
 *
 * @param electionId - Election ID
 *
 * @example
 * const dashboard = useCompleteDashboard(electionId);
 * // Access: dashboard.summary.data, dashboard.guaranteesTrend.data, etc.
 */
export function useCompleteDashboard(electionId: number | null) {
  const summary = useDashboardSummary(electionId);
  const guaranteesTrend = useGuaranteesTrend(electionId, '30days', { autoFetch: false });
  const groupPerformance = useGroupPerformance(electionId, undefined, { autoFetch: false });
  const hourlyAttendance = useHourlyAttendance(electionId, undefined, { autoFetch: false });
  const demographics = useElectorDemographics(electionId, { autoFetch: false });
  const overview = useDashboardOverview(electionId, { autoFetch: false });

  // Load all data together
  const loadAll = useCallback(async () => {
    await Promise.all([
      summary.refetch(),
      guaranteesTrend.refetch(),
      groupPerformance.refetch(),
      hourlyAttendance.refetch(),
      demographics.refetch(),
      overview.refetch()
    ]);
  }, [summary, guaranteesTrend, groupPerformance, hourlyAttendance, demographics, overview]);

  return {
    summary,
    guaranteesTrend,
    groupPerformance,
    hourlyAttendance,
    demographics,
    overview,
    loadAll,
    loading:
      summary.loading ||
      guaranteesTrend.loading ||
      groupPerformance.loading ||
      hourlyAttendance.loading ||
      demographics.loading ||
      overview.loading,
    error:
      summary.error ||
      guaranteesTrend.error ||
      groupPerformance.error ||
      hourlyAttendance.error ||
      demographics.error ||
      overview.error
  };
}
