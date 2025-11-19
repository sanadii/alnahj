/**
 * Test Utilities
 * Reusable testing helpers and custom render functions
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a test theme
const testTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5e35b1'
    },
    secondary: {
      main: '#673ab7'
    }
  }
});

// Custom render with providers
interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({ children }) => {
  return <ThemeProvider theme={testTheme}>{children}</ThemeProvider>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Mock data generators
export const mockElection = (overrides = {}) => ({
  id: 1,
  name: 'Test Election',
  status: 'ACTIVE',
  votingMode: 'MIXED',
  electionDate: '2025-12-01',
  maxCandidatesPerBallot: 5,
  minimumVotesRequired: 1,
  allowPartialVoting: true,
  ...overrides
});

export const mockParty = (overrides = {}) => ({
  id: 1,
  name: 'Test Party',
  color: '#FF0000',
  candidateCount: 5,
  ...overrides
});

export const mockCommittee = (overrides = {}) => ({
  id: 1,
  code: 'C001',
  name: 'Committee 1',
  gender: 'MALE' as const,
  electorCount: 100,
  attendanceCount: 80,
  voteCount: 75,
  ...overrides
});

export const mockGuaranteeTrend = () => [
  { date: '2025-10-01', strong: 20, medium: 15, weak: 10, total: 45 },
  { date: '2025-10-02', strong: 22, medium: 16, weak: 9, total: 47 },
  { date: '2025-10-03', strong: 25, medium: 18, weak: 8, total: 51 }
];

export const mockGroupPerformance = () => [
  {
    id: 1,
    name: 'Group A',
    color: '#FF0000',
    totalGuarantees: 100,
    strongCount: 50,
    mediumCount: 30,
    weakCount: 20,
    attendanceRate: 85,
    votingRate: 90,
    conversionRate: 75
  }
];

export const mockHourlyAttendance = () => [
  { hour: '08:00', attendance: 50, votes: 45, target: 100 },
  { hour: '09:00', attendance: 80, votes: 75, target: 100 },
  { hour: '10:00', attendance: 120, votes: 110, target: 100 }
];

export const mockElectorDemographics = () => ({
  total: 1000,
  male: 520,
  female: 480,
  malePercentage: 52,
  femalePercentage: 48,
  byCommittee: [{ committeeId: 1, committeeName: 'Committee 1', male: 120, female: 100 }],
  byFamily: [{ familyName: 'Family A', count: 50, male: 25, female: 25 }],
  byAge: [{ ageGroup: '18-25', count: 200, male: 100, female: 100 }]
});
