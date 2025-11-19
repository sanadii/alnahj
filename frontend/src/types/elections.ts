// ==============================|| ELECTIONS & COMMITTEES TYPES ||============================== //
// Election Management System - Elections Module

/**
 * Election Status Enum
 */
export enum ElectionStatus {
  SETUP = 'SETUP',
  GUARANTEE_PHASE = 'GUARANTEE_PHASE',
  VOTING_DAY = 'VOTING_DAY',
  COUNTING = 'COUNTING',
  CLOSED = 'CLOSED'
}

/**
 * Election Status Display Names
 */
export const ElectionStatusLabels: Record<ElectionStatus, string> = {
  [ElectionStatus.SETUP]: 'Setup',
  [ElectionStatus.GUARANTEE_PHASE]: 'Guarantee Collection Phase',
  [ElectionStatus.VOTING_DAY]: 'Voting Day',
  [ElectionStatus.COUNTING]: 'Counting in Progress',
  [ElectionStatus.CLOSED]: 'Closed'
};

/**
 * Voting Mode Enum
 */
export enum VotingMode {
  FULL_PARTY = 'FULL_PARTY',
  MIXED = 'MIXED',
  BOTH = 'BOTH'
}

/**
 * Voting Mode Display Names
 */
export const VotingModeLabels: Record<VotingMode, string> = {
  [VotingMode.FULL_PARTY]: 'Full Party Ticket',
  [VotingMode.MIXED]: 'Mixed Ticket',
  [VotingMode.BOTH]: 'Both Options'
};

/**
 * Committee Gender Enum
 */
export enum CommitteeGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

/**
 * Committee Gender Display Names
 */
export const CommitteeGenderLabels: Record<CommitteeGender, string> = {
  [CommitteeGender.MALE]: 'Male',
  [CommitteeGender.FEMALE]: 'Female'
};

/**
 * Election Interface
 * Main election configuration and settings
 */
export interface Election {
  id: number;

  // Basic Information
  name: string;
  description: string;

  // Voting Configuration
  votingMode: VotingMode;
  maxCandidatesPerBallot: number;
  allowPartialVoting: boolean;
  minimumVotesRequired: number;

  // Election Status
  status: ElectionStatus;
  statusDisplay: string;

  // Important Dates
  electionDate: string | null;

  // Relationships
  committeeCount?: number;
  memberCount?: number;
  members?: number[]; // Array of user IDs who are members

  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  createdByName?: string;
}

/**
 * Election Form Data (for Create/Update operations)
 */
export interface ElectionFormData {
  name: string;
  description?: string;
  votingMode: VotingMode;
  maxCandidatesPerBallot: number;
  allowPartialVoting: boolean;
  minimumVotesRequired: number;
  status: ElectionStatus;
  electionDate: string | null;
}

/**
 * Election Filters
 */
export interface ElectionFilters {
  status?: ElectionStatus | '';
  search?: string;
  ordering?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Election List Response
 */
export interface ElectionListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Election[];
}

/**
 * Committee Interface
 * Voting committee with gender segregation
 */
export interface Committee {
  id: number;

  // Relationships
  election: number;
  electionName?: string;

  // Committee Details
  code: string;
  name: string;
  gender: CommitteeGender;
  genderDisplay: string;
  location: string;

  // Elector Range
  electorsFrom?: number;
  electorsTo?: number;

  // Staff Assignment (keeping for committees)
  assignedUsers: number[];
  assignedUserNames?: string[];

  // Statistics
  electorCount?: number;
  attendanceCount?: number;
  voteCount?: number;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

/**
 * Committee Form Data (for Create/Update operations)
 */
export interface CommitteeFormData {
  election: number;
  code: string;
  name: string;
  gender: CommitteeGender;
  location?: string;
  electorsFrom?: number;
  electorsTo?: number;
  assignedUsers?: number[];
}

/**
 * Committee Filters
 */
export interface CommitteeFilters {
  election?: number;
  gender?: CommitteeGender | '';
  search?: string;
  ordering?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Committee List Response
 */
export interface CommitteeListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Committee[];
}

/**
 * Committee Statistics
 */
export interface CommitteeStatistics {
  committeeId: number;
  committeeName: string;
  committeeCode: string;
  electorCount: number;
  attendanceCount: number;
  attendancePercentage: number;
  voteCount: number;
  votingPercentage: number;
}

/**
 * Assign Users to Committee Data
 */
export interface AssignUsersData {
  userIds: number[];
}

/**
 * Add Election Members Data
 */
export interface AddMembersData {
  userIds: number[];
}

/**
 * Elections State (Redux)
 */
export interface ElectionsState {
  // Data
  elections: Election[];
  currentElection: Election | null;
  activeElection: Election | null;

  // Pagination
  totalCount: number;
  currentPage: number;
  pageSize: number;

  // UI State
  loading: boolean;
  error: string | null;

  // Filters
  filters: ElectionFilters;
}

/**
 * Committees State (Redux)
 */
export interface CommitteesState {
  // Data
  committees: Committee[];
  currentCommittee: Committee | null;
  committeeStatistics: CommitteeStatistics | null;

  // Pagination
  totalCount: number;
  currentPage: number;
  pageSize: number;

  // UI State
  loading: boolean;
  error: string | null;

  // Filters
  filters: CommitteeFilters;
}

/**
 * Election with Committees (Extended)
 */
export interface ElectionWithCommittees extends Election {
  committees: Committee[];
}

/**
 * Committee Option (for dropdowns)
 */
export interface CommitteeOption {
  value: number;
  label: string;
  code: string;
  gender: CommitteeGender;
}

/**
 * Election Option (for dropdowns)
 */
export interface ElectionOption {
  value: number;
  label: string;
  status: ElectionStatus;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get status color for election status badge
 */
export const getElectionStatusColor = (status: ElectionStatus): string => {
  switch (status) {
    case ElectionStatus.SETUP:
      return '#757575'; // Grey
    case ElectionStatus.GUARANTEE_PHASE:
      return '#0288d1'; // Blue
    case ElectionStatus.VOTING_DAY:
      return '#2e7d32'; // Green
    case ElectionStatus.COUNTING:
      return '#ed6c02'; // Orange
    case ElectionStatus.CLOSED:
      return '#d32f2f'; // Red
    default:
      return '#757575';
  }
};

/**
 * Get gender color for committee badge
 */
export const getCommitteeGenderColor = (gender: CommitteeGender): string => {
  switch (gender) {
    case CommitteeGender.MALE:
      return '#1976d2'; // Blue
    case CommitteeGender.FEMALE:
      return '#d32f2f'; // Pink/Red
    default:
      return '#757575';
  }
};

/**
 * Check if election is active
 */
export const isElectionActive = (election: Election): boolean => {
  return election.status !== ElectionStatus.CLOSED;
};

/**
 * Check if election is in voting phase
 */
export const isElectionVotingDay = (election: Election): boolean => {
  return election.status === ElectionStatus.VOTING_DAY;
};

/**
 * Check if election is in guarantee phase
 */
export const isElectionGuaranteePhase = (election: Election): boolean => {
  return election.status === ElectionStatus.GUARANTEE_PHASE;
};

/**
 * Check if date is in the past
 */
export const isDatePast = (dateString: string | null): boolean => {
  if (!dateString) return false;
  return new Date(dateString) < new Date();
};

/**
 * Check if date is in the future
 */
export const isDateFuture = (dateString: string | null): boolean => {
  if (!dateString) return false;
  return new Date(dateString) > new Date();
};

/**
 * Format date for display
 */
export const formatElectionDate = (dateString: string | null): string => {
  if (!dateString) return 'Not set';

  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Get election phase progress (0-100%)
 */
export const getElectionProgress = (election: Election): number => {
  const statusOrder = [
    ElectionStatus.SETUP,
    ElectionStatus.GUARANTEE_PHASE,
    ElectionStatus.VOTING_DAY,
    ElectionStatus.COUNTING,
    ElectionStatus.CLOSED
  ];

  const currentIndex = statusOrder.indexOf(election.status);
  return ((currentIndex + 1) / statusOrder.length) * 100;
};

/**
 * Validate election dates
 */
export const validateElectionDates = (formData: ElectionFormData): string | null => {
  // No date validation needed currently
  // Can be extended if more date fields are added in the future
  return null;
};

/**
 * Get committee display name
 */
export const getCommitteeDisplayName = (committee: Committee): string => {
  return `${committee.code} - ${committee.name} (${CommitteeGenderLabels[committee.gender]})`;
};

/**
 * Type Guards
 */
export const isElection = (obj: any): obj is Election => {
  return typeof obj === 'object' && typeof obj.id === 'number' && typeof obj.name === 'string' && typeof obj.status === 'string';
};

export const isCommittee = (obj: any): obj is Committee => {
  return typeof obj === 'object' && typeof obj.id === 'number' && typeof obj.code === 'string' && typeof obj.gender === 'string';
};
