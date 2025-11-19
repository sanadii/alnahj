import { useCallback, useEffect, useRef, useState } from 'react';

import { startDemoSeedJob, getDemoSeedJob } from 'helpers/api/demos';
import type {
  DemoConfig,
  DemoState,
  DemoProgress,
  DemoPhase,
  DemoSeedJob,
  DemoSeedRequestPayload
} from 'types/demo';

export interface UseElectionDemoReturn {
  state: DemoState;
  progress: DemoProgress;
  start: (electionId: number, config: DemoConfig) => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
}

const POLL_INTERVAL = 4000;

const createInitialState = (): DemoState => ({
  isRunning: false,
  isPaused: false,
  currentPhase: 'idle',
  startTime: null,
  errors: 0
});

const createInitialProgress = (): DemoProgress => ({
  phases: {
    parties: { completed: false, count: 0, candidates: 0 },
    committees: { completed: false, count: 0 },
    users: { completed: false, count: 0 },
    guarantees: { completed: false, total: 0, batches: 0 },
    attendance: { completed: false, total: 0, batches: 0, rate: 0 }
  },
  guarantees: {
    totalCreated: 0,
    batchesCompleted: 0,
    perUser: {},
    perGroup: {}
  },
  attendance: {
    totalCreated: 0,
    batchesCompleted: 0,
    perCommittee: {},
    overallRate: 0
  },
  errors: []
});

const normalizePhase = (phase?: string | null): DemoPhase => {
  switch (phase) {
    case 'parties':
    case 'committees':
    case 'users':
    case 'guarantees':
    case 'attendance':
    case 'complete':
      return phase as DemoPhase;
    default:
      return 'idle';
  }
};

const safeNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const buildPayload = (electionId: number, config: DemoConfig): DemoSeedRequestPayload => ({
  election_id: electionId,
  phases: {
    parties: {
      enabled: config.enabledPhases.parties || config.enabledPhases.candidates,
      count: config.enabledPhases.parties ? config.parties.count : 0,
      candidates_per_party: config.enabledPhases.candidates ? config.candidates.candidatesPerParty : 0,
      independent_candidates: config.enabledPhases.candidates ? config.candidates.independentCandidates : 0
    },
    committees: {
      enabled: config.enabledPhases.committees,
      count: config.committees.count
    },
    users: {
      enabled: config.enabledPhases.users,
      count: config.users.count,
      assign_to_committees: config.users.assignToCommittees
    },
    guarantees: {
      enabled: config.enabledPhases.guarantees,
      batch_size: config.guarantees.batchSize,
      interval_ms: config.guarantees.intervalMs,
      total_limit: config.guarantees.totalLimit ?? null,
      group_distribution: config.guarantees.groupDistribution,
      guarantee_status: config.guarantees.guaranteeStatus
    },
    attendance: {
      enabled: config.enabledPhases.attendance,
      rate: config.attendance.rate,
      batch_size: config.attendance.batchSize,
      interval_ms: config.attendance.intervalMs
    }
  }
});

const mapJobToState = (job: DemoSeedJob | null): DemoState => {
  if (!job) return createInitialState();

  const status = job.status;
  const running = status === 'running' || status === 'queued';
  const legacyPhase = (job as any)?.current_phase;
  const currentPhase = status === 'completed' ? 'complete' : normalizePhase(job.currentPhase ?? legacyPhase);

  return {
    isRunning: running,
    isPaused: false,
    currentPhase,
    startTime: job.startedAt
      ? new Date(job.startedAt)
      : (job as any)?.started_at
        ? new Date((job as any).started_at)
        : null,
    errors: job.errors?.length ?? 0
  };
};

const mapJobToProgress = (job: DemoSeedJob | null): DemoProgress => {
  const base = createInitialProgress();
  if (!job) return base;

  const data: Record<string, any> = job.progress || {};

  const parties = data.parties || {};
  base.phases.parties = {
    completed: ['completed', 'skipped'].includes(parties.status),
    count: safeNumber(parties.created_parties ?? parties.count, base.phases.parties.count),
    candidates: safeNumber(parties.created_candidates ?? parties.candidates, base.phases.parties.candidates)
  };

  const committees = data.committees || {};
  base.phases.committees = {
    completed: ['completed', 'skipped'].includes(committees.status),
    count: safeNumber(committees.created_committees ?? committees.count, base.phases.committees.count)
  };

  const users = data.users || {};
  base.phases.users = {
    completed: ['completed', 'skipped'].includes(users.status),
    count: safeNumber(users.created_users ?? users.count, base.phases.users.count)
  };

  const guarantees = data.guarantees || {};
  const guaranteesTotal = safeNumber(guarantees.total_created ?? guarantees.total, 0);
  const guaranteesBatches = safeNumber(guarantees.batches ?? guarantees.batchesCompleted, 0);
  base.phases.guarantees = {
    completed: ['completed', 'skipped'].includes(guarantees.status),
    total: guaranteesTotal,
    batches: guaranteesBatches
  };
  base.guarantees.totalCreated = guaranteesTotal;
  base.guarantees.batchesCompleted = guaranteesBatches;

  const attendance = data.attendance || {};
  const attendanceTotal = safeNumber(attendance.total_created ?? attendance.total, 0);
  const attendanceBatches = safeNumber(attendance.batches ?? attendance.batchesCompleted, 0);
  const attendanceRate = safeNumber(attendance.rate ?? attendance.attendance_rate, 0);
  base.phases.attendance = {
    completed: ['completed', 'skipped'].includes(attendance.status),
    total: attendanceTotal,
    batches: attendanceBatches,
    rate: attendanceRate
  };
  base.attendance.totalCreated = attendanceTotal;
  base.attendance.batchesCompleted = attendanceBatches;
  base.attendance.overallRate = attendanceRate;

  base.errors = (job.errors || []).map((err) => ({
    phase: normalizePhase(err?.phase),
    error: err?.message || 'An error occurred',
    batch: typeof err?.batch === 'number' ? err.batch : undefined,
    timestamp: err?.timestamp ? new Date(err.timestamp) : new Date()
  }));

  return base;
};

export const useElectionDemo = (): UseElectionDemoReturn => {
  const [state, setState] = useState<DemoState>(createInitialState());
  const [progress, setProgress] = useState<DemoProgress>(createInitialProgress());
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const jobIdRef = useRef<number | null>(null);

  const clearPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const syncFromJob = useCallback(
    (job: DemoSeedJob | null) => {
      if (!job) return;
      jobIdRef.current = job.id;
      setState(mapJobToState(job));
      setProgress(mapJobToProgress(job));

      if (job.status === 'completed' || job.status === 'failed') {
        clearPolling();
      }
    },
    [clearPolling]
  );

  const startPolling = useCallback(
    (jobId: number) => {
      clearPolling();
      pollingRef.current = setInterval(async () => {
        try {
          const job = await getDemoSeedJob(jobId);
          if (job) {
            syncFromJob(job);
          }
        } catch (error) {
          console.error('Failed to poll demo job', error);
          clearPolling();
        }
      }, POLL_INTERVAL);
    },
    [clearPolling, syncFromJob]
  );

  const start = useCallback(
    async (electionId: number, config: DemoConfig) => {
      setState({
        isRunning: true,
        isPaused: false,
        currentPhase: 'parties',
        startTime: new Date(),
        errors: 0
      });
      setProgress(createInitialProgress());

      try {
        const payload = buildPayload(electionId, config);
        const job = await startDemoSeedJob(payload);
        syncFromJob(job);

        if (job.status === 'running' || job.status === 'queued') {
          startPolling(job.id);
        }
      } catch (error: any) {
        clearPolling();
        const message = error?.response?.data?.message || error?.message || 'Failed to start demo';
        setState({
          ...createInitialState(),
          errors: 1
        });
        setProgress((prev) => ({
          ...prev,
          errors: [...prev.errors, { phase: 'idle', error: message, timestamp: new Date() }]
        }));
      }
    },
    [clearPolling, startPolling, syncFromJob]
  );

  const pause = useCallback(() => {
    console.warn('Pause is not supported for backend-driven demo jobs yet.');
  }, []);

  const resume = useCallback(() => {
    console.warn('Resume is not supported for backend-driven demo jobs yet.');
  }, []);

  const stop = useCallback(() => {
    clearPolling();
    jobIdRef.current = null;
    setState(createInitialState());
  }, [clearPolling]);

  const reset = useCallback(() => {
    stop();
    setProgress(createInitialProgress());
  }, [stop]);

  useEffect(() => {
    return () => {
      clearPolling();
    };
  }, [clearPolling]);

  return {
    state,
    progress,
    start,
    pause,
    resume,
    stop,
    reset
  };
};

export default useElectionDemo;

