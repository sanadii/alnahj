import { useState, useCallback, useEffect } from 'react';

/**
 * useApi Hook
 *
 * Manages API call state (loading, error, data) with automatic fetching
 * Used in: All client tabs that fetch data from backend
 *
 * Replaces duplicate API state management across 10+ tabs
 */

export interface UseApiReturn<T> {
  /** Response data */
  data: T | null;
  /** Loading state */
  loading: boolean;
  /** Error message */
  error: string | null;
  /** Refetch data */
  refetch: () => Promise<void>;
  /** Set data manually */
  setData: (data: T | null) => void;
  /** Clear error */
  clearError: () => void;
}

export interface UseApiOptions {
  /** Auto-fetch on mount */
  autoFetch?: boolean;
  /** Dependencies to trigger refetch */
  deps?: any[];
  /** Callback on success */
  onSuccess?: (data: any) => void;
  /** Callback on error */
  onError?: (error: any) => void;
}

/**
 * Custom hook for API calls with loading and error states
 *
 * @example
 * // Basic usage
 * const { data, loading, error, refetch } = useApi(() => getAppointmentsApi(clientId));
 *
 * // With options
 * const { data, loading, error } = useApi(
 *   () => getClientApi(id),
 *   {
 *     autoFetch: true,
 *     deps: [id],
 *   }
 * );
 */
function useApi<T = any>(apiFunction: () => Promise<any>, options: UseApiOptions = {}): UseApiReturn<T> {
  const { autoFetch = true, deps = [], onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFunction();

      // Handle different response structures
      let resultData = response;

      // If response has a 'data' property, use that
      if (response?.data !== undefined) {
        resultData = response.data;

        // Some APIs wrap data in response.data.data
        if (resultData?.data !== undefined && Array.isArray(resultData.data)) {
          resultData = resultData.data;
        }
      }

      setData(resultData);

      if (onSuccess) {
        onSuccess(resultData);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch data';
      setError(errorMessage);

      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError]);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch, ...deps]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setData,
    clearError
  };
}

export default useApi;
