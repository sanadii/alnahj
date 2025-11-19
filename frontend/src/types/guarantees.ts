/**
 * Guarantee-related types and helpers.
 */

// ============================================================================
// STATUS TYPES & HELPERS
// ============================================================================

export type GuaranteeStatus = 'PENDING' | 'GUARANTEED';

export const GuaranteeStatusLabels: Record<GuaranteeStatus, string> = {
  PENDING: 'Pending',
  GUARANTEED: 'Guaranteed'
};

export const getGuaranteeStatusColor = (status: GuaranteeStatus): string => {
  const colors: Record<GuaranteeStatus, string> = {
    PENDING: '#fbbf24',
    GUARANTEED: '#22c55e'
  };
  return colors[status] ?? '#9ca3af';
};

export type GuaranteeConfirmationStatus = 'PENDING' | 'CONFIRMED' | 'NOT_AVAILABLE';

export const ConfirmationStatusLabels: Record<GuaranteeConfirmationStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  NOT_AVAILABLE: 'Not Available'
};

export const getConfirmationBadgeProps = (
  status: GuaranteeConfirmationStatus
): { label: string; color: 'default' | 'success' | 'warning' | 'info' } => {
  switch (status) {
    case 'CONFIRMED':
      return { label: 'Confirmed', color: 'success' };
    case 'NOT_AVAILABLE':
      return { label: 'Not Available', color: 'default' };
    default:
      return { label: 'Pending', color: 'warning' };
  }
};

export const getConfirmationIcon = (status: GuaranteeConfirmationStatus): string => {
  switch (status) {
    case 'CONFIRMED':
      return '✅';
    case 'NOT_AVAILABLE':
      return '🚫';
    default:
      return '⏳';
  }
};

export const getStatusBadgeProps = (status: GuaranteeStatus): { label: string; color: 'success' | 'warning' } =>
  status === 'GUARANTEED'
    ? { label: 'Guaranteed', color: 'success' }
    : { label: 'Pending', color: 'warning' };

// ============================================================================
// DOMAIN MODELS
// ============================================================================

export interface GuaranteeGroup {
  id: number;
  name: string;
  color: string;
  description?: string;
  order: number;
  guaranteeCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GuaranteeNote {
  id: number;
  guarantee: number;
  user: number;
  userName?: string;
  userEmail?: string;
  content: string;
  isImportant: boolean;
  createdAt: string;
}

export interface GuaranteeHistory {
  id: number;
  action: string;
  actionDisplay: string;
  userName: string;
  description: string;
  oldValue: string | null;
  newValue: string | null;
  createdAt: string;
}

export interface Guarantee {
  id: number;
  user: number;
  elector: number;
  electorKocId?: string | null;
  electorName: string;
  electorMobile: string;
  electorSection?: string | null;
  electorDepartment?: string | null;
  electorTeam?: string | null;
  electorCommittee?: string | null;
  guaranteeStatus: GuaranteeStatus;
  guaranteeStatusDisplay: string;
  group: number | null;
  groupName: string | null;
  groupColor: string | null;
  mobile: string;
  quickNote: string;
  confirmationStatus: GuaranteeConfirmationStatus;
  confirmationStatusDisplay: string;
  isConfirmed: boolean;
  hasNotes: boolean;
  noteCount?: number;
  recentNotes?: GuaranteeNote[];
  createdAt: string;
  updatedAt: string;
}

export interface GuaranteeListItem {
  id: number;
  elector: number;
  electorKocId?: string | null;
  electorName: string;
  electorMobile: string;
  electorSection?: string | null;
  electorDepartment?: string | null;
  electorTeam?: string | null;
  electorCommitteeName?: string | null;
  guaranteeStatus: GuaranteeStatus;
  guaranteeStatusDisplay: string;
  group?: number | null;
  groupName: string | null;
  groupColor: string | null;
  quickNote: string;
  mobile?: string;
  confirmationStatus: GuaranteeConfirmationStatus;
  confirmationStatusDisplay: string;
  isConfirmed: boolean;
  hasNotes: boolean;
  createdAt: string;
}

export interface GuaranteeStatistics {
  total_guarantees: number;
  pending_count: number;
  guaranteed_count: number;
  not_available_count: number;
  by_group: Array<{
    group__name: string | null;
    group__color: string | null;
    count: number;
  }>;
  by_committee: Array<{
    elector__committee__code: string | null;
    elector__committee__name: string | null;
    count: number;
  }>;
  recent_guarantees: GuaranteeListItem[];
  top_sections: Array<{
    elector__section: string | null;
    count: number;
  }>;
  confirmed_count: number;
  pending_confirmation_count: number;
  not_available_confirmation_count: number;
  unconfirmed_count: number;
  confirmation_rate: number;
}

export interface Elector {
  id: number;
  kocId: string;
  nameFirst: string;
  familyName: string;
  subFamilyName: string;
  fullName: string;
  mobile: string;
  section: string;
  department?: string;
  team?: string;
  area?: string;
  designation?: string;
  committeeCode: string;
  committeeName: string;
  isActive: boolean;
  hasGuarantee?: boolean;
}

// ============================================================================
// FORM DATA & FILTERS
// ============================================================================

export interface GuaranteeGroupFormData {
  name: string;
  color: string;
  description?: string;
  order: number;
}

export interface GuaranteeCreateData {
  elector: string | number;
  guaranteeStatus: GuaranteeStatus;
  group: number | null;
  quick_note?: string;
  mobile?: string | null;
}

export interface GuaranteeUpdateData {
  guaranteeStatus?: GuaranteeStatus;
  group?: number | null;
  mobile?: string | null;
  quick_note?: string;
  confirmation_status?: GuaranteeConfirmationStatus;
}

export interface GuaranteeBulkUpdateData {
  guaranteeIds: number[];
  guaranteeStatus?: GuaranteeStatus;
  groupId?: number | null;
}

export interface GuaranteeNoteCreateData {
  guarantee?: number;
  content: string;
  isImportant: boolean;
}

export interface GuaranteeConfirmData {
  confirmation_status: GuaranteeConfirmationStatus;
}

export interface GuaranteeBulkConfirmData extends GuaranteeConfirmData {
  guarantee_ids: number[];
}

export interface GuaranteeFilters {
  search?: string;
  guaranteeStatus?: GuaranteeStatus | '';
  confirmationStatus?: GuaranteeConfirmationStatus | '';
  group?: number | '';
  page?: number;
  pageSize?: number;
  _skipMeta?: boolean;
}

