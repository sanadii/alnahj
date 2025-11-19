import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'utils/axios';

interface GuaranteeDistributionDimension {
  id: string;
  label: string;
  description?: string;
  adjusted?: boolean;
}

interface GuaranteeDistributionCategory {
  key: string;
  label: string;
  count: number;
  attended: number;
  attendance_percentage: number;
}

interface GuaranteeDistributionSeries {
  key: string;
  label: string;
  data: number[];
  attended: number[];
  attendance_percentage: number[];
  total: number;
}

interface GuaranteeDistributionTotals {
  overall: number;
  x_totals: GuaranteeDistributionCategory[];
  y_totals: GuaranteeDistributionCategory[];
}

export interface GuaranteeDistributionData {
  available_dimensions: GuaranteeDistributionDimension[];
  x_dimension: GuaranteeDistributionDimension;
  y_dimension: GuaranteeDistributionDimension;
  categories: GuaranteeDistributionCategory[];
  series: GuaranteeDistributionSeries[];
  totals: GuaranteeDistributionTotals;
  limit: number;
  series_limit: number;
}

export interface UseGuaranteeDistributionParams {
  dimensionX: string;
  dimensionY: string;
  limit?: number;
}

interface UseGuaranteeDistributionReturn {
  data: GuaranteeDistributionData | null;
  loading: boolean;
  error: string | null;
  refetch: (override?: Partial<UseGuaranteeDistributionParams>) => Promise<void>;
}

export const useGuaranteeDistribution = (
  electionId: number | null,
  params: UseGuaranteeDistributionParams
): UseGuaranteeDistributionReturn => {
  const [data, setData] = useState<GuaranteeDistributionData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const queryParams = useMemo(
    () => ({
      dimensionX: params.dimensionX,
      dimensionY: params.dimensionY,
      limit: params.limit
    }),
    [params.dimensionX, params.dimensionY, params.limit]
  );

  const fetchData = useCallback(
    async (override?: Partial<UseGuaranteeDistributionParams>) => {
      if (!electionId) {
        setData(null);
        setLoading(false);
        return;
      }

      const dimensionX = override?.dimensionX ?? queryParams.dimensionX;
      const dimensionY = override?.dimensionY ?? queryParams.dimensionY;
      const limit = override?.limit ?? queryParams.limit;

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Not authenticated - please log in');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<{ status: string; data: GuaranteeDistributionData }>(
          `/api/elections/${electionId}/dashboard/guarantees/distribution`,
          {
            params: {
              dimension_x: dimensionX,
              dimension_y: dimensionY,
              limit
            }
          }
        );

        if (response.data.status === 'success') {
          setData(response.data.data);
        } else {
          setError('Failed to fetch guarantee distribution');
        }
      } catch (fetchError: any) {
        setError(fetchError.response?.data?.message || fetchError.message || 'Failed to fetch guarantee distribution');
      } finally {
        setLoading(false);
      }
    },
    [electionId, queryParams.dimensionX, queryParams.dimensionY, queryParams.limit]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

export type { GuaranteeDistributionDimension, GuaranteeDistributionCategory, GuaranteeDistributionSeries };

