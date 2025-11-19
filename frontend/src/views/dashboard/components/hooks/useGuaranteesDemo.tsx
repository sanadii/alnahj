/**
 * useGuaranteesDemo Hook
 * Handles batch creation of guarantees for demo
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { createGuarantee, getGuaranteeGroups } from 'helpers/api/guarantees';
import { getElectors } from 'helpers/api/electors';
import { selectRandom, selectRoundRobin, shuffleArray } from 'utils/demo/dataGenerators';
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

interface UseGuaranteesDemoReturn {
  totalCreated: number;
  batchesCompleted: number;
  perUser: Record<number, number>;
  perGroup: Record<number, number>;
  loading: boolean;
  error: string | null;
  startBatchCreation: (
    electionId: number,
    users: any[],
    config: DemoConfig['guarantees'],
    onProgress?: (progress: { total: number; batches: number }) => void,
    onError?: (error: string) => void
  ) => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  isRunning: boolean;
  isPaused: boolean;
}

export const useGuaranteesDemo = (): UseGuaranteesDemoReturn => {
  const [totalCreated, setTotalCreated] = useState(0);
  const [batchesCompleted, setBatchesCompleted] = useState(0);
  const [perUser, setPerUser] = useState<Record<number, number>>({});
  const [perGroup, setPerGroup] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const electorsRef = useRef<any[]>([]);
  const usersRef = useRef<any[]>([]);
  const groupsRef = useRef<any[]>([]);
  const configRef = useRef<DemoConfig['guarantees'] | null>(null);
  const onProgressRef = useRef<((progress: { total: number; batches: number }) => void) | undefined>();
  const onErrorRef = useRef<((error: string) => void) | undefined>();
  const groupIndexRef = useRef(0);

  const createBatch = useCallback(async () => {
    if (!configRef.current || electorsRef.current.length === 0 || usersRef.current.length === 0) {
      return;
    }

    const config = configRef.current;
    const batchSize = Math.min(config.batchSize, electorsRef.current.length);
    const batchElectors = shuffleArray(electorsRef.current).slice(0, batchSize);

    const promises = batchElectors.map(async (elector) => {
      const user = selectRandom(usersRef.current);
      if (!user) return { success: false };

      let group: any = undefined;
      if (groupsRef.current.length > 0) {
        switch (config.groupDistribution) {
          case 'random':
            group = selectRandom(groupsRef.current);
            break;
          case 'round-robin':
            group = selectRoundRobin(groupsRef.current, groupIndexRef.current++);
            break;
          case 'equal':
            // For equal distribution, we'd need more complex logic
            group = selectRandom(groupsRef.current);
            break;
        }
      }

      try {
        const electorId =
          elector.id ??
          elector.elector ??
          elector.electorId ??
          elector.elector_id ??
          elector.koc_id ??
          elector.kocId ??
          elector.kocid ??
          elector.kocID;
        if (!electorId) {
          throw new Error('Missing elector identifier');
        }

        await createGuarantee({
          elector: electorId,
          guaranteeStatus: config.guaranteeStatus,
          group: group?.id
        });

        return { success: true, userId: user.id, groupId: group?.id };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    });

    const results = await Promise.allSettled(promises);
    const successful = results.filter((r) => r.status === 'fulfilled' && r.value.success);

    // Update statistics
    setTotalCreated((prev) => prev + successful.length);
    setBatchesCompleted((prev) => prev + 1);

    // Update per-user and per-group counts
    const userCounts: Record<number, number> = { ...perUser };
    const groupCounts: Record<number, number> = { ...perGroup };

    successful.forEach((result) => {
      if (result.status === 'fulfilled' && result.value.success) {
        const { userId, groupId } = result.value as any;
        if (userId) {
          userCounts[userId] = (userCounts[userId] || 0) + 1;
        }
        if (groupId) {
          groupCounts[groupId] = (groupCounts[groupId] || 0) + 1;
        }
      }
    });

    setPerUser(userCounts);
    setPerGroup(groupCounts);

    onProgressRef.current?.({
      total: totalCreated + successful.length,
      batches: batchesCompleted + 1
    });

    // Check if we've reached the limit
    if (config.totalLimit && totalCreated + successful.length >= config.totalLimit) {
      stop();
    }
  }, [perUser, perGroup, totalCreated, batchesCompleted]);

  const startBatchCreation = useCallback(
    async (
      electionId: number,
      users: any[],
      config: DemoConfig['guarantees'],
      onProgress?: (progress: { total: number; batches: number }) => void,
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
          electorsResponse = await getElectors({ page_size: 1000 });
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
          console.error('Unexpected electors response format (guarantees):', electorsResponse);
          const errorMsg = electorsResponse.message || 'Invalid response format from electors API';
          throw new Error(errorMsg);
        }

        if (electorsRef.current.length === 0) {
          throw new Error('No electors available. Please ensure electors are imported first.');
        }

        // Fetch groups
        const groupsResponse = await getGuaranteeGroups();
        if (groupsResponse.status === 'success' && groupsResponse.data) {
          groupsRef.current = groupsResponse.data;
        }

        usersRef.current = users;
        configRef.current = config;
        onProgressRef.current = onProgress;
        onErrorRef.current = onError;
        groupIndexRef.current = 0;

        // Start batch creation interval
        intervalRef.current = setInterval(() => {
          if (!isPaused) {
            createBatch();
          }
        }, config.intervalMs);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to start guarantee creation';
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
    setPerUser({});
    setPerGroup({});
    setError(null);
    electorsRef.current = [];
    usersRef.current = [];
    groupsRef.current = [];
    configRef.current = null;
    onProgressRef.current = undefined;
    onErrorRef.current = undefined;
    groupIndexRef.current = 0;
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
    perUser,
    perGroup,
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

