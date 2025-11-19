/**
 * Demo Feature Types
 * Types for the comprehensive election demo feature
 */

export type DemoPhase = 
  | 'idle'
  | 'parties'
  | 'committees'
  | 'users'
  | 'guarantees'
  | 'attendance'
  | 'complete';

export interface DemoConfig {
  // Phase enablement flags
  enabledPhases: {
    parties: boolean;
    candidates: boolean;
    committees: boolean;
    users: boolean;
    guarantees: boolean;
    attendance: boolean;
  };
  // Election Setup
  parties: {
    count: number;                    // Number of parties (default: 3-5)
  };
  candidates: {
    candidatesPerParty: number;       // Candidates per party (default: 2-4)
    independentCandidates: number;    // Number of independent candidates (default: 2-4)
  };
  committees: {
    count: number;                     // Number of committees (default: 5-10)
  };
  users: {
    count: number;                    // Number of users (default: 10-20)
    assignToCommittees: boolean;      // Assign users to committees
  };
  // Guarantees Configuration
  guarantees: {
    batchSize: number;                // Guarantees per batch (default: 100)
    intervalMs: number;                // Milliseconds between batches (default: 1000)
    totalLimit?: number;               // Optional total limit
    groupDistribution: 'random' | 'round-robin' | 'equal';
    guaranteeStatus: 'GUARANTEED' | 'PENDING';
  };
  // Attendance Configuration
  attendance: {
    rate: number;                      // Attendance rate 0-1 (default: 0.70-0.85)
    batchSize: number;                 // Attendance records per batch (default: 50)
    intervalMs: number;                // Milliseconds between batches (default: 2000)
  };
}

export interface DemoState {
  isRunning: boolean;
  isPaused: boolean;
  currentPhase: DemoPhase;
  startTime: Date | null;
  errors: number;
}

export interface DemoProgress {
  // Phase progress
  phases: {
    parties: { completed: boolean; count: number; candidates: number };
    committees: { completed: boolean; count: number };
    users: { completed: boolean; count: number };
    guarantees: { completed: boolean; total: number; batches: number };
    attendance: { completed: boolean; total: number; batches: number; rate: number };
  };
  // Detailed statistics
  guarantees: {
    totalCreated: number;
    batchesCompleted: number;
    perUser: Record<number, number>;
    perGroup: Record<number, number>;
  };
  attendance: {
    totalCreated: number;
    batchesCompleted: number;
    perCommittee: Record<number, number>;
    overallRate: number;
  };
  errors: Array<{ phase: DemoPhase; batch?: number; error: string }>;
}

export interface DemoError {
  phase: DemoPhase;
  batch?: number;
  error: string;
  timestamp: Date;
}

export type DemoJobStatus = 'queued' | 'running' | 'completed' | 'failed';

export interface DemoSeedJob {
  id: number;
  election: number;
  electionName?: string;
  status: DemoJobStatus;
  currentPhase: string;
  config: Record<string, any>;
  progress: Record<string, any>;
  errors: Array<{
    phase?: string;
    message?: string;
    timestamp?: string;
    [key: string]: any;
  }>;
  startedAt?: string | null;
  finishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface DemoSeedRequestPayload {
  election_id: number;
  phases: Record<string, any>;
}

export const DEFAULT_DEMO_CONFIG: DemoConfig = {
  enabledPhases: {
    parties: true,
    candidates: true,
    committees: true,
    users: true,
    guarantees: true,
    attendance: true
  },
  parties: {
    count: 4
  },
  candidates: {
    candidatesPerParty: 3,
    independentCandidates: 3
  },
  committees: {
    count: 8
  },
  users: {
    count: 15,
    assignToCommittees: true
  },
  guarantees: {
    batchSize: 100,
    intervalMs: 1000,
    groupDistribution: 'random',
    guaranteeStatus: 'GUARANTEED'
  },
  attendance: {
    rate: 0.75,
    batchSize: 50,
    intervalMs: 2000
  }
};

