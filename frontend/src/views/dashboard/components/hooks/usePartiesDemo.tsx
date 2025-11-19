/**
 * usePartiesDemo Hook
 * Handles creation of parties and candidates for demo
 */

import { useState, useCallback } from 'react';
import { createParty, createCandidate } from 'helpers/api/voting';
import { generatePartyName, generateCandidateName } from 'utils/demo/dataGenerators';
import type { DemoPhase } from 'types/demo';

interface UsePartiesDemoReturn {
  parties: any[];
  candidates: any[];
  loading: boolean;
  error: string | null;
  createPartiesAndCandidates: (
    electionId: number,
    partyCount: number,
    candidatesPerParty: number,
    independentCandidates: number,
    onProgress?: (progress: { parties: number; candidates: number }) => void
  ) => Promise<{ parties: any[]; candidates: any[] }>;
  reset: () => void;
}

export const usePartiesDemo = (): UsePartiesDemoReturn => {
  const [parties, setParties] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPartiesAndCandidates = useCallback(
    async (
      electionId: number,
      partyCount: number,
      candidatesPerParty: number,
      onProgress?: (progress: { parties: number; candidates: number }) => void
    ) => {
      setLoading(true);
      setError(null);
      const createdParties: any[] = [];
      const createdCandidates: any[] = [];

      try {
        // Create parties
        for (let i = 0; i < partyCount; i++) {
          try {
            const partyName = generatePartyName(i);
            const partyData = {
              election: electionId,
              name: partyName,
              color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
              description: `Demo party: ${partyName}`
            };

            const response = await createParty(partyData);
            if (response.status === 'success' && response.data) {
              createdParties.push(response.data);
              onProgress?.({ parties: createdParties.length, candidates: createdCandidates.length });
            }
          } catch (err: any) {
            console.error(`Failed to create party ${i + 1}:`, err);
            // Continue with next party
          }
        }

        // Create candidates for each party
        let candidateNumber = 1;
        for (const party of createdParties) {
          for (let j = 0; j < candidatesPerParty; j++) {
            try {
              const candidateName = generateCandidateName();
              const candidateData = {
                election: electionId,
                name: candidateName,
                candidate_number: candidateNumber++,
                party: party.id
              };

              const response = await createCandidate(candidateData);
              if (response.status === 'success' && response.data) {
                createdCandidates.push(response.data);
                onProgress?.({ parties: createdParties.length, candidates: createdCandidates.length });
              }
            } catch (err: any) {
              console.error(`Failed to create candidate for party ${party.id}:`, err);
              // Continue with next candidate
            }
          }
        }

        setParties(createdParties);
        setCandidates(createdCandidates);
        return { parties: createdParties, candidates: createdCandidates };
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to create parties and candidates';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setParties([]);
    setCandidates([]);
    setError(null);
    setLoading(false);
  }, []);

  return {
    parties,
    candidates,
    loading,
    error,
    createPartiesAndCandidates,
    reset
  };
};

