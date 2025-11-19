/**
 * useUsersDemo Hook
 * Handles creation of users and assignment to election/committees for demo
 */

import { useState, useCallback } from 'react';
import { createElectionMember } from 'helpers/api/elections';
import { generateUserData } from 'utils/demo/dataGenerators';
import { UserRole } from 'types/users-management';

interface UseUsersDemoReturn {
  users: any[];
  loading: boolean;
  error: string | null;
  createUsers: (
    electionId: number,
    userCount: number,
    committees: any[],
    assignToCommittees: boolean,
    onProgress?: (progress: { created: number }) => void
  ) => Promise<any[]>;
  reset: () => void;
}

export const useUsersDemo = (): UseUsersDemoReturn => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUsers = useCallback(
    async (
      electionId: number,
      userCount: number,
      committees: any[],
      assignToCommittees: boolean,
      onProgress?: (progress: { created: number }) => void
    ) => {
      setLoading(true);
      setError(null);
      const createdUsers: any[] = [];

      try {
        for (let i = 0; i < userCount; i++) {
          try {
            const userData = generateUserData(i);
            const committeeId = assignToCommittees && committees.length > 0
              ? committees[i % committees.length].id
              : undefined;

            const response = await createElectionMember(electionId, {
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              password: userData.phone, // Use phone as password for demo
              phone: userData.phone,
              role: UserRole.USER,
              committeeId
            });

            if (response.status === 'success' && response.data?.user) {
              createdUsers.push(response.data.user);
              onProgress?.({ created: createdUsers.length });
            }
          } catch (err: any) {
            console.error(`Failed to create user ${i + 1}:`, err);
            // Continue with next user
          }
        }

        setUsers(createdUsers);
        return createdUsers;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to create users';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setUsers([]);
    setError(null);
    setLoading(false);
  }, []);

  return {
    users,
    loading,
    error,
    createUsers,
    reset
  };
};

