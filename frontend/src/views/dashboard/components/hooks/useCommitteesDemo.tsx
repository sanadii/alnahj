/**
 * useCommitteesDemo Hook
 * Handles creation of committees and elector assignment for demo
 */

import { useState, useCallback } from 'react';
import { createCommittee } from 'helpers/api/committees';
import { autoAssignElectorsToCommittees } from 'helpers/api/committees';
import { generateCommitteeCode, generateCommitteeName } from 'utils/demo/dataGenerators';
import type { DemoPhase } from 'types/demo';

interface UseCommitteesDemoReturn {
  committees: any[];
  loading: boolean;
  error: string | null;
  createCommittees: (
    electionId: number,
    committeeCount: number,
    onProgress?: (progress: { created: number }) => void
  ) => Promise<any[]>;
  assignElectors: (
    electionId: number,
    committeeIds: number[],
    onComplete?: () => void
  ) => Promise<void>;
  reset: () => void;
}

export const useCommitteesDemo = (): UseCommitteesDemoReturn => {
  const [committees, setCommittees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCommittees = useCallback(
    async (
      electionId: number,
      committeeCount: number,
      onProgress?: (progress: { created: number }) => void
    ) => {
      setLoading(true);
      setError(null);
      const createdCommittees: any[] = [];

      try {
        // Alternate between MALE and FEMALE committees
        const genders: ('MALE' | 'FEMALE')[] = ['MALE', 'FEMALE'];

        for (let i = 0; i < committeeCount; i++) {
          try {
            const gender = genders[i % 2];
            const code = generateCommitteeCode(i, gender);
            const name = generateCommitteeName(i, gender);

            const committeeData: any = {
              election: electionId,
              code,
              name,
              gender,
              location: `Location ${i + 1}`
              // electors_from and electors_to will be set later or auto-assigned (can be null)
            };

            const response = await createCommittee(committeeData);
            if (response.status === 'success' && response.data) {
              createdCommittees.push(response.data);
              onProgress?.({ created: createdCommittees.length });
            }
          } catch (err: any) {
            console.error(`Failed to create committee ${i + 1}:`, err);
            // Continue with next committee
          }
        }

        setCommittees(createdCommittees);
        return createdCommittees;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to create committees';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const assignElectors = useCallback(
    async (electionId: number, committeeIds: number[], onComplete?: () => void) => {
      try {
        const response = await autoAssignElectorsToCommittees(electionId, committeeIds);
        if (response.status === 'success') {
          onComplete?.();
        }
      } catch (err: any) {
        console.error('Failed to assign electors:', err);
        // Don't throw - electors can be assigned manually later
      }
    },
    []
  );

  const reset = useCallback(() => {
    setCommittees([]);
    setError(null);
    setLoading(false);
  }, []);

  return {
    committees,
    loading,
    error,
    createCommittees,
    assignElectors,
    reset
  };
};

