/**
 * useElectorDemographics Hook
 * Fetches elector demographics data from the API
 */

import { useState, useEffect } from 'react';
import axios from 'utils/axios';

interface FamilyData {
  familyName: string;
  count: number;
  male: number;
  female: number;
}

interface GenderData {
  gender: string;
  count: number;
  percentage: number;
}

interface AreaData {
  code: string;
  name: string;
  totalElectors: number;
  attended: number;
  attendancePercentage: number;
  male: number;
  female: number;
}

interface TeamData {
  code: string;
  name: string;
  totalElectors: number;
  attended: number;
  attendancePercentage: number;
  male: number;
  female: number;
}

type DepartmentData = TeamData;

interface ElectorDemographicsData {
  byGender: GenderData[];
  byArea: AreaData[];
  byTeam: TeamData[];
  byDepartment: DepartmentData[];
  byFamily: FamilyData[];
}

interface ElectorDemographicsMeta {
  electionId: number;
  totalAreas: number;
  totalTeams: number;
  totalDepartments: number;
  totalFamilies: number;
  lastUpdated: string;
}

interface UseElectorDemographicsReturn {
  data: ElectorDemographicsData | null;
  meta: ElectorDemographicsMeta | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useElectorDemographics = (electionId: number | string): UseElectorDemographicsReturn => {
  const [data, setData] = useState<ElectorDemographicsData | null>(null);
  const [meta, setMeta] = useState<ElectorDemographicsMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`/api/elections/${electionId}/dashboard/electors/demographics`);

      if (response.data.status === 'success') {
        setData(response.data.data);
        setMeta(response.data.meta);
      } else {
        throw new Error('Failed to fetch elector demographics');
      }
    } catch (err: any) {
      console.error('Error fetching elector demographics:', err);
      setError(err.message || 'Failed to load elector demographics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (electionId) {
      fetchData();
    }
  }, [electionId]);

  return {
    data,
    meta,
    loading,
    error,
    refetch: fetchData
  };
};

export default useElectorDemographics;

export type { FamilyData, GenderData, AreaData, TeamData, DepartmentData, ElectorDemographicsData, ElectorDemographicsMeta };
