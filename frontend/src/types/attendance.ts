/**
 * Attendance Module Types
 * Manages elector attendance tracking for voting day
 */

/**
 * Attendance Record
 * Represents when an elector attended to vote
 * Uses camelCase to match backend serializer
 */
export type AttendanceStatus = 'ATTENDED' | 'PENDING';

export interface Attendance {
  id: number;
  electorId?: number;
  electorKocId: string;
  electorName: string;
  electorGender: 'MALE' | 'FEMALE';
  committeeId?: number;
  committeeCode: string;
  committeeName: string;
  markedBy?: number;
  markedByName: string;
  attendedAt: string;
  notes: string;
  deviceInfo?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
  status: AttendanceStatus;
}

/**
 * Elector Search Result
 * Response when searching for an elector before marking attendance
 * Uses camelCase to match backend serializer
 */
export interface ElectorSearchResult {
  kocId: string;
  fullName: string;
  section: string;
  committeeCode: string;
  committeeName: string;
  hasAttended: boolean;
  attendedAt: string | null;
  nameFirst?: string;
  familyName?: string;
  mobile?: string;
  location?: string;
}

/**
 * Attendance Statistics
 * Statistics for committee attendance
 * Uses camelCase to match frontend conventions
 */
export interface AttendanceStatistics {
  committeeId?: number;
  committee_id?: number; // Backend compatibility
  committeeCode: string;
  committee_code?: string; // Backend compatibility
  committeeName: string;
  committee_name?: string; // Backend compatibility
  totalElectors: number;
  total_electors?: number; // Backend compatibility
  totalAttended: number;
  total_attended?: number; // Backend compatibility
  totalWalkIns: number;
  total_walk_ins?: number; // Backend compatibility
  pendingCount: number;
  pending_count?: number; // Backend compatibility
  attendancePercentage: number;
  attendance_percentage?: number; // Backend compatibility
  hourlyBreakdown: Record<string, number>;
  hourly_breakdown?: Record<string, number>; // Backend compatibility
  lastUpdated: string;
  last_updated?: string; // Backend compatibility
}

/**
 * Committee Attendance List Response
 * Full attendance list for a specific committee
 */
export interface CommitteeAttendanceList {
  committee: {
    code: string;
    name: string;
  };
  statistics: {
    total_electors: number;
    total_attended: number;
    pending: number;
    percentage: number;
  };
  attendance: Attendance[];
}

/**
 * Mark Attendance Request
 * Payload for marking attendance
 */
export interface MarkAttendanceRequest {
  koc_id: string;
  committee_code: string;
  notes?: string;
}

/**
 * Search Elector Request
 * Parameters for searching an elector
 */
export interface SearchElectorRequest {
  koc_id: string;
  committee?: string;
  committee_code?: string;
}

/**
 * Attendance State
 * Redux state for attendance module
 */
export interface AttendanceState {
  // All attendance records
  items: Attendance[];

  // Single attendance record (for details)
  item: Attendance | null;

  // Search result
  searchResult: ElectorSearchResult | null;

  // Statistics for current committee
  statistics: AttendanceStatistics | null;

  // Committee attendance list
  committeeList: CommitteeAttendanceList | null;

  // Loading states
  loading: boolean;
  searchLoading: boolean;
  markingLoading: boolean;
  statsLoading: boolean;

  // Error states
  error: string | null;
  searchError: string | null;

  // Pagination
  totalCount: number;
  currentPage: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Attendance Filter Parameters
 * For filtering attendance records
 */
export interface AttendanceFilterParams {
  committee?: number;
  committee__code?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
  ordering?: string;
}
