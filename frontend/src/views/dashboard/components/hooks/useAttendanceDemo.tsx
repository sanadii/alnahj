/**
 * useAttendanceDemo Hook
 * Handles batch creation of attendance records for demo
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { markAttendance } from 'helpers/api/attendance';
import { getElectors } from 'helpers/api/electors';
import { selectRandomItems, selectRandom, shuffleArray } from 'utils/demo/dataGenerators';
import type { DemoPhase, DemoConfig } from 'types/demo';

const looksLikeElector = (value: any): boolean => {
  if (!value || typeof value !== 'object') return false;
  return (
    'kocId' in value ||
    'koc_id' in value ||
    'fullName' in value ||
    'full_name' in value ||
    'committee' in value
  );
};

const asArray = (value: any): any[] | null => {
  if (Array.isArray(value)) {
    return value;
  }
  if (looksLikeElector(value)) {
    return [value];
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.every(([, item]) => typeof item === 'object')) {
      return entries.map(([key, item]) => {
        if (item && typeof item === 'object' && !item.kocId && !item.koc_id) {
          return { kocId: key, ...item };
        }
        return item;
      }) as any[];
    }
  }
  return null;
};

const extractElectorResults = (response: any): any[] => {
  if (!response) return [];

  const candidates = [
    response?.data?.results,
    response?.data?.data?.results,
    response?.data?.data,
    response?.data,
    response?.results,
    response
  ];

  for (const candidate of candidates) {
    const arr = asArray(candidate);
    if (arr) {
      return arr;
    }
    if (candidate && typeof candidate === 'object' && candidate.results) {
      const nested = asArray(candidate.results);
      if (nested) {
        return nested;
      }
    }
  }

  return [];
};

interface UseAttendanceDemoReturn {
  totalCreated: number;
  batchesCompleted: number;
  perCommittee: Record<number, number>;
  overallRate: number;
  loading: boolean;
  error: string | null;
  startBatchCreation: (
    electionId: number,
    committees: any[],
    config: DemoConfig['attendance'],
    totalElectors: number,
    onProgress?: (progress: { total: number; batches: number; rate: number }) => void,
    onError?: (error: string) => void
  ) => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  isRunning: boolean;
  isPaused: boolean;
}

export const useAttendanceDemo = (): UseAttendanceDemoReturn => {
  const [totalCreated, setTotalCreated] = useState(0);
  const [batchesCompleted, setBatchesCompleted] = useState(0);
  const [perCommittee, setPerCommittee] = useState<Record<number, number>>({});
  const [overallRate, setOverallRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const electorsRef = useRef<any[]>([]);
  const committeesRef = useRef<any[]>([]);
  const configRef = useRef<DemoConfig['attendance'] | null>(null);
  const totalElectorsRef = useRef(0);
  const targetCountRef = useRef(0);
  const onProgressRef = useRef<((progress: { total: number; batches: number; rate: number }) => void) | undefined>();
  const onErrorRef = useRef<((error: string) => void) | undefined>();

  const createBatch = useCallback(async () => {
    if (!configRef.current || electorsRef.current.length === 0 || committeesRef.current.length === 0) {
      return;
    }

    const config = configRef.current;
    const batchSize = Math.min(config.batchSize, electorsRef.current.length);
    
    // Select random electors for this batch
    const batchElectors = selectRandomItems(electorsRef.current, batchSize);

    const promises = batchElectors.map(async (elector) => {
      const electorCommitteeId =
        elector.committee?.id ??
        elector.committee_id ??
        elector.committeeId ??
        elector.committee;

      const committee =
        committeesRef.current.find((c) => c.id === electorCommitteeId) ||
        selectRandom(committeesRef.current);
      
      if (!committee) return { success: false };

      try {
        const kocId =
          elector.koc_id ||
          elector.kocId ||
          elector.kocID ||
          elector.kocid ||
          elector.koc ||
          elector.kocNumber ||
          elector.koc_number ||
          elector.id;

        if (!kocId) {
          console.warn('Skipping elector with missing koc_id', elector);
          return { success: false };
        }

        await markAttendance({
          koc_id: String(kocId),
          committee_code: committee.code
        });

        return { success: true, committeeId: committee.id };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    });

    const results = await Promise.allSettled(promises);
    const successful = results.filter((r) => r.status === 'fulfilled' && r.value.success);

    // Update statistics
    const newTotal = totalCreated + successful.length;
    setTotalCreated(newTotal);
    setBatchesCompleted((prev) => prev + 1);

    // Update per-committee counts
    const committeeCounts: Record<number, number> = { ...perCommittee };
    successful.forEach((result) => {
      if (result.status === 'fulfilled' && result.value.success) {
        const { committeeId } = result.value as any;
        if (committeeId) {
          committeeCounts[committeeId] = (committeeCounts[committeeId] || 0) + 1;
        }
      }
    });
    setPerCommittee(committeeCounts);

    // Calculate overall rate
    const rate = totalElectorsRef.current > 0 ? newTotal / totalElectorsRef.current : 0;
    setOverallRate(rate);

    onProgressRef.current?.({
      total: newTotal,
      batches: batchesCompleted + 1,
      rate
    });

    // Check if we've reached the target
    if (newTotal >= targetCountRef.current) {
      stop();
    }
  }, [perCommittee, totalCreated, batchesCompleted]);

  const startBatchCreation = useCallback(
    async (
      electionId: number,
      committees: any[],
      config: DemoConfig['attendance'],
      totalElectors: number,
      onProgress?: (progress: { total: number; batches: number; rate: number }) => void,
      onError?: (error: string) => void
    ) => {
      setLoading(true);
      setError(null);
      setIsRunning(true);
      setIsPaused(false);

      try {
        // Fetch electors
        let electorsResponse;
        try {
          electorsResponse = await getElectors({ page_size: 10000 });
        } catch (fetchError: any) {
          const errorMsg = fetchError.response?.data?.message || fetchError.message || 'Failed to fetch electors from API';
          throw new Error(errorMsg);
        }

        const electors = extractElectorResults(electorsResponse);
        if (electors.length > 0) {
          electorsRef.current = electors;
        } else if (electorsResponse.status === 'error' || electorsResponse.success === false) {
          const errorMsg = electorsResponse.message || 'Failed to fetch electors from API';
          throw new Error(errorMsg);
        } else {
          console.error('Unexpected electors response format (attendance):', electorsResponse);
          const errorMsg = electorsResponse.message || 'Invalid response format from electors API';
          throw new Error(errorMsg);
        }

        if (electorsRef.current.length === 0) {
          throw new Error('No electors available. Please ensure electors are imported first.');
        }

        committeesRef.current = committees;
        configRef.current = config;
        totalElectorsRef.current = totalElectors;
        targetCountRef.current = Math.floor(totalElectors * config.rate);
        onProgressRef.current = onProgress;
        onErrorRef.current = onError;

        // Start batch creation interval
        intervalRef.current = setInterval(() => {
          if (!isPaused) {
            createBatch();
          }
        }, config.intervalMs);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to start attendance creation';
        setError(errorMessage);
        onError?.(errorMessage);
        setIsRunning(false);
        setIsPaused(false);
        setLoading(false);
        // Clear interval if it was set
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    },
    [createBatch, isPaused]
  );

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setIsPaused(false);
    setLoading(false);
  }, []);

  const reset = useCallback(() => {
    stop();
    setTotalCreated(0);
    setBatchesCompleted(0);
    setPerCommittee({});
    setOverallRate(0);
    setError(null);
    electorsRef.current = [];
    committeesRef.current = [];
    configRef.current = null;
    totalElectorsRef.current = 0;
    targetCountRef.current = 0;
    onProgressRef.current = undefined;
    onErrorRef.current = undefined;
  }, [stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    totalCreated,
    batchesCompleted,
    perCommittee,
    overallRate,
    loading,
    error,
    startBatchCreation,
    pause,
    resume,
    stop,
    reset,
    isRunning,
    isPaused
  };
};

