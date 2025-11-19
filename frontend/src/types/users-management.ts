// ==============================|| USER MANAGEMENT TYPES ||============================== //
// Election Management System - User Management Module

/**
 * User Role Enum
 * Hierarchy: SUPER_ADMIN > ADMIN > SUPERVISOR > USER
 */
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  USER = 'USER'
}

/**
 * User Role Display Names
 */
export const UserRoleLabels: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Super Admin',
  [UserRole.ADMIN]: 'Admin',
  [UserRole.SUPERVISOR]: 'Supervisor',
  [UserRole.USER]: 'User'
};

/**
 * Main User Interface
 * Represents a user in the election management system
 */
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  roleDisplay: string;
  isActive: boolean;
  isSuperuser: boolean;
  isStaff: boolean;

  // Relationships
  supervisor?: number | null;
  supervisorName?: string | null;
  team?: string[] | null;
  committees?: number[] | null;
  committeeNames?: string[] | null;

  // Metadata
  createdAt: string;
  updatedAt: string;
  lastLogin?: string | null;

  // Computed fields
  fullName?: string;
}

/**
 * User Form Data (for Create/Update operations)
 */
export interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  password?: string; // Only for create
  phone?: string; // Phone number (optional)
  isActive?: boolean;
  supervisor?: number | null;
  team?: string[];
  committees?: number[];
}

/**
 * User Filter Parameters
 */
export interface UserFilters {
  search?: string;
  role?: UserRole | '';
  isActive?: boolean | null;
  supervisor?: number | null;
  team?: string;
  ordering?: string;
  page?: number;
  pageSize?: number;
}

/**
 * User List Response (from API)
 */
export interface UserListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

/**
 * Password Change Data
 */
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * User Statistics (for dashboards)
 */
export interface UserStats {
  totalGuarantees: number;
  strongGuarantees: number;
  mediumGuarantees: number;
  weakGuarantees: number;
  overdueFollowUps: number;
  recentActivity: number;
}

/**
 * User State (Redux)
 */
export interface UsersState {
  // Data
  users: User[];
  currentUser: User | null;
  userStats: UserStats | null;

  // Pagination
  totalCount: number;
  currentPage: number;
  pageSize: number;

  // UI State
  loading: boolean;
  error: string | null;

  // Filters
  filters: UserFilters;
}

/**
 * User Activity Log Entry
 */
export interface UserActivity {
  id: number;
  action: string;
  description: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Team Assignment
 */
export interface TeamAssignment {
  teamName: string;
  assignedAt: string;
  assignedBy: string;
}

/**
 * Committee Assignment
 */
export interface CommitteeAssignment {
  committeeId: number;
  committeeName: string;
  electionName: string;
  assignedAt: string;
  role: 'supervisor' | 'staff';
}

/**
 * User Profile Extended (for profile page)
 */
export interface UserProfileExtended extends User {
  activities: UserActivity[];
  stats: UserStats;
  teamAssignments: TeamAssignment[];
  committeeAssignments: CommitteeAssignment[];
}

/**
 * User Selection Option (for dropdowns)
 */
export interface UserOption {
  value: number;
  label: string;
  role: UserRole;
  email: string;
}

/**
 * Bulk Operation Data
 */
export interface BulkUserOperation {
  userIds: number[];
  action: 'activate' | 'deactivate' | 'delete' | 'assign_supervisor' | 'assign_team';
  data?: {
    supervisor?: number;
    team?: string;
  };
}

/**
 * Type Guards
 */
export const isUser = (obj: any): obj is User => {
  return typeof obj === 'object' && typeof obj.id === 'number' && typeof obj.email === 'string' && typeof obj.role === 'string';
};

export const isSuperAdmin = (user: User | null): boolean => {
  return user?.role === UserRole.SUPER_ADMIN;
};

export const isAdmin = (user: User | null): boolean => {
  return user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.ADMIN;
};

export const isSupervisor = (user: User | null): boolean => {
  return user?.role === UserRole.SUPERVISOR;
};

/**
 * Helper Functions
 */
export const getUserFullName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`.trim();
};

export const getUserRoleColor = (role: UserRole): string => {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return '#d32f2f'; // Red
    case UserRole.ADMIN:
      return '#ed6c02'; // Orange
    case UserRole.SUPERVISOR:
      return '#0288d1'; // Blue
    case UserRole.USER:
      return '#2e7d32'; // Green
    default:
      return '#757575'; // Grey
  }
};

export const canManageUser = (currentUser: User | null, targetUser: User): boolean => {
  if (!currentUser) return false;

  // Super admin can manage everyone
  if (currentUser.role === UserRole.SUPER_ADMIN) return true;

  // Admin can manage everyone except super admins
  if (currentUser.role === UserRole.ADMIN) {
    return targetUser.role !== UserRole.SUPER_ADMIN;
  }

  // Supervisors and users cannot manage other users
  return false;
};

export const canDeleteUser = (currentUser: User | null, targetUser: User): boolean => {
  if (!currentUser) return false;

  // Cannot delete yourself
  if (currentUser.id === targetUser.id) return false;

  // Super admin can delete anyone except other super admins
  if (currentUser.role === UserRole.SUPER_ADMIN) {
    return targetUser.role !== UserRole.SUPER_ADMIN;
  }

  // Admin can delete non-admin users
  if (currentUser.role === UserRole.ADMIN) {
    return targetUser.role !== UserRole.SUPER_ADMIN && targetUser.role !== UserRole.ADMIN;
  }

  return false;
};
