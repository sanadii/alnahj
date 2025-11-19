/**
 * Custom React Hook - useAttendanceDashboard
 *
 * Fetches comprehensive attendance dashboard data for an election.
 *
 * @param electionId - The ID of the election
 * @returns { data, loading, error, refetch }
 */

import { useState, useEffect, useCallback } from 'react';
import axios from 'utils/axios';

interface AttendanceSummary {
  totalElectors: number;
  totalAttendance: number;
  totalVotes: number;
  attendancePercentage: number;
  votingPercentage: number;
  participationRate: number;
}

interface CommitteeAttendance {
  id: number;
  code: string;
  name: string;
  gender: string;
  electorCount: number;
  electorAttendanceCount: number;
  electorAttendancePercentage: number;
  guaranteeCount: number;
  guaranteeAttendanceCount: number;
  guaranteeAttendancePercentage: number;
}

interface GuaranteeUserAttendance {
  userId: number | null;
  userName: string;
  totalGuarantees: number;
  attended: number;
  attendancePercentage: number;
}

interface GuaranteeGroupAttendance {
  groupId: number;
  groupName: string;
  totalGuarantees: number;
  attended: number;
  attendancePercentage: number;
}

interface GuaranteeUserGroupDetail {
  userId: number | null;
  userName: string;
  groups: GuaranteeGroupAttendance[];
}

interface AttendanceDashboardData {
  summary: AttendanceSummary;
  committees: CommitteeAttendance[];
  guaranteesByUser: GuaranteeUserAttendance[];
  guaranteesByGroup: GuaranteeGroupAttendance[];
  guaranteesByUserGroups: GuaranteeUserGroupDetail[];
  topPerformers: CommitteeAttendance[];
  lowPerformers: CommitteeAttendance[];
}

interface AttendanceDashboardMeta {
  electionId: number;
  totalCommittees: number;
  lastUpdated: string;
}

interface AttendanceDashboardResponse {
  status: string;
  data: AttendanceDashboardData;
  meta: AttendanceDashboardMeta;
}

interface UseAttendanceDashboardReturn {
  data: AttendanceDashboardData | null;
  meta: AttendanceDashboardMeta | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAttendanceDashboard = (electionId: number | null): UseAttendanceDashboardReturn => {
  const [data, setData] = useState<AttendanceDashboardData | null>(null);
  const [meta, setMeta] = useState<AttendanceDashboardMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!electionId) {
      setLoading(false);
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `/api/elections/${electionId}/dashboard/attendance/summary`;

      const response = await axios.get<AttendanceDashboardResponse>(url);


      if (response.data.status === 'success') {
        setData(response.data.data);
        setMeta(response.data.meta);
      } else {
        console.error('❌ [useAttendanceDashboard] Response status not success:', response.data);
        setError('Failed to fetch attendance dashboard');
      }
    } catch (err: any) {
      console.error('❌ [useAttendanceDashboard] Error:', err);
      console.error('❌ [useAttendanceDashboard] Error response:', err.response);
      console.error('❌ [useAttendanceDashboard] Error status:', err.response?.status);

      if (err.response?.status === 401) {
        setError('Not authenticated - please log in');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to fetch attendance data');
      }
    } finally {
      setLoading(false);
    }
  }, [electionId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    meta,
    loading,
    error,
    refetch: fetchData
  };
};

export type {
  AttendanceSummary,
  CommitteeAttendance,
  GuaranteeUserAttendance,
  GuaranteeGroupAttendance,
  AttendanceDashboardData,
  GuaranteeUserGroupDetail,
  AttendanceDashboardMeta
};
