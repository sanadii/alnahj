/**
 * Guarantees Redux Types
 * Election Management System - TypeScript Interfaces Only
 */

import type {
  GuaranteeListItem,
  GuaranteeGroup,
  GuaranteeStatistics,
  GuaranteeFilters,
  GuaranteeCreateData,
  GuaranteeUpdateData,
  GuaranteeBulkUpdateData,
  GuaranteeGroupFormData,
  GuaranteeNoteCreateData,
  GuaranteeStatus
} from 'types/guarantees';

import * as ActionTypes from './actionTypes';

// ============================================================================
// STATE INTERFACE
// ============================================================================

export interface GuaranteeState {
  guarantees: GuaranteeListItem[];
  groups: GuaranteeGroup[];
  statistics: GuaranteeStatistics | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  filters: GuaranteeFilters;
}

// ============================================================================
// ACTION INTERFACES
// ============================================================================

export interface GetGuaranteesRequestAction {
  type: typeof ActionTypes.GET_GUARANTEES_REQUEST;
  payload: GuaranteeFilters;
}

export interface GetGuaranteesSuccessAction {
  type: typeof ActionTypes.GET_GUARANTEES_SUCCESS;
  payload: {
    guarantees: GuaranteeListItem[];
    count: number;
    statistics: GuaranteeStatistics;
    groups: GuaranteeGroup[];
    pagination?: {
      count?: number;
      page?: number;
      page_size?: number;
      [key: string]: any;
    };
    skipMeta?: boolean;
  };
}

export interface GetGuaranteesFailureAction {
  type: typeof ActionTypes.GET_GUARANTEES_FAILURE;
  payload: string;
}

export interface CreateGuaranteeRequestAction {
  type: typeof ActionTypes.CREATE_GUARANTEE_REQUEST;
  payload: GuaranteeCreateData;
}

export interface CreateGuaranteeSuccessAction {
  type: typeof ActionTypes.CREATE_GUARANTEE_SUCCESS;
  payload: string;
}

export interface CreateGuaranteeFailureAction {
  type: typeof ActionTypes.CREATE_GUARANTEE_FAILURE;
  payload: string;
}

export interface UpdateGuaranteeRequestAction {
  type: typeof ActionTypes.UPDATE_GUARANTEE_REQUEST;
  payload: {
    id: number;
    data: GuaranteeUpdateData;
  };
}

export interface UpdateGuaranteeSuccessAction {
  type: typeof ActionTypes.UPDATE_GUARANTEE_SUCCESS;
  payload: {
    id: number;
    data: any; // Full guarantee object from backend
    message: string;
  };
}

export interface UpdateGuaranteeFailureAction {
  type: typeof ActionTypes.UPDATE_GUARANTEE_FAILURE;
  payload: string;
}

export interface DeleteGuaranteeRequestAction {
  type: typeof ActionTypes.DELETE_GUARANTEE_REQUEST;
  payload: number;
}

export interface DeleteGuaranteeSuccessAction {
  type: typeof ActionTypes.DELETE_GUARANTEE_SUCCESS;
  payload: {
    id: number;
    message: string;
  };
}

export interface DeleteGuaranteeFailureAction {
  type: typeof ActionTypes.DELETE_GUARANTEE_FAILURE;
  payload: string;
}

export interface QuickUpdateGuaranteeRequestAction {
  type: typeof ActionTypes.QUICK_UPDATE_GUARANTEE_REQUEST;
  payload: {
    id: number;
    guaranteeStatus: GuaranteeStatus;
  };
}

export interface QuickUpdateGuaranteeSuccessAction {
  type: typeof ActionTypes.QUICK_UPDATE_GUARANTEE_SUCCESS;
  payload: {
    id: number;
    guaranteeStatus: GuaranteeStatus;
    message: string;
  };
}

export interface QuickUpdateGuaranteeFailureAction {
  type: typeof ActionTypes.QUICK_UPDATE_GUARANTEE_FAILURE;
  payload: string;
}

export interface BulkUpdateGuaranteesRequestAction {
  type: typeof ActionTypes.BULK_UPDATE_GUARANTEES_REQUEST;
  payload: GuaranteeBulkUpdateData;
}

export interface BulkUpdateGuaranteesSuccessAction {
  type: typeof ActionTypes.BULK_UPDATE_GUARANTEES_SUCCESS;
  payload: string;
}

export interface BulkUpdateGuaranteesFailureAction {
  type: typeof ActionTypes.BULK_UPDATE_GUARANTEES_FAILURE;
  payload: string;
}

export interface GetStatisticsRequestAction {
  type: typeof ActionTypes.GET_STATISTICS_REQUEST;
}

export interface GetStatisticsSuccessAction {
  type: typeof ActionTypes.GET_STATISTICS_SUCCESS;
  payload: GuaranteeStatistics;
}

export interface GetStatisticsFailureAction {
  type: typeof ActionTypes.GET_STATISTICS_FAILURE;
  payload: string;
}

export interface GetGroupsRequestAction {
  type: typeof ActionTypes.GET_GROUPS_REQUEST;
}

export interface GetGroupsSuccessAction {
  type: typeof ActionTypes.GET_GROUPS_SUCCESS;
  payload: GuaranteeGroup[];
}

export interface GetGroupsFailureAction {
  type: typeof ActionTypes.GET_GROUPS_FAILURE;
  payload: string;
}

export interface CreateGroupRequestAction {
  type: typeof ActionTypes.CREATE_GROUP_REQUEST;
  payload: GuaranteeGroupFormData;
}

export interface CreateGroupSuccessAction {
  type: typeof ActionTypes.CREATE_GROUP_SUCCESS;
  payload: string;
}

export interface CreateGroupFailureAction {
  type: typeof ActionTypes.CREATE_GROUP_FAILURE;
  payload: string;
}

export interface UpdateGroupRequestAction {
  type: typeof ActionTypes.UPDATE_GROUP_REQUEST;
  payload: {
    id: number;
    data: Partial<GuaranteeGroupFormData>;
  };
}

export interface UpdateGroupSuccessAction {
  type: typeof ActionTypes.UPDATE_GROUP_SUCCESS;
  payload: string;
}

export interface UpdateGroupFailureAction {
  type: typeof ActionTypes.UPDATE_GROUP_FAILURE;
  payload: string;
}

export interface DeleteGroupRequestAction {
  type: typeof ActionTypes.DELETE_GROUP_REQUEST;
  payload: number;
}

export interface DeleteGroupSuccessAction {
  type: typeof ActionTypes.DELETE_GROUP_SUCCESS;
  payload: {
    id: number;
    message: string;
  };
}

export interface DeleteGroupFailureAction {
  type: typeof ActionTypes.DELETE_GROUP_FAILURE;
  payload: string;
}

export interface AddNoteRequestAction {
  type: typeof ActionTypes.ADD_NOTE_REQUEST;
  payload: {
    guaranteeId: number;
    data: GuaranteeNoteCreateData;
  };
}

export interface AddNoteSuccessAction {
  type: typeof ActionTypes.ADD_NOTE_SUCCESS;
  payload: string;
}

export interface AddNoteFailureAction {
  type: typeof ActionTypes.ADD_NOTE_FAILURE;
  payload: string;
}

export interface SetGuaranteeFiltersAction {
  type: typeof ActionTypes.SET_GUARANTEE_FILTERS;
  payload: GuaranteeFilters;
}

export interface ClearGuaranteeErrorAction {
  type: typeof ActionTypes.CLEAR_GUARANTEE_ERROR;
}

export interface ConfirmGuaranteeRequestAction {
  type: typeof ActionTypes.CONFIRM_GUARANTEE_REQUEST;
  payload: {
    id: number;
    data: import('types/guarantees').GuaranteeConfirmData;
  };
}

export interface ConfirmGuaranteeSuccessAction {
  type: typeof ActionTypes.CONFIRM_GUARANTEE_SUCCESS;
  payload: {
    id: number;
    data: any;
    message: string;
  };
}

export interface ConfirmGuaranteeFailureAction {
  type: typeof ActionTypes.CONFIRM_GUARANTEE_FAILURE;
  payload: string;
}

export interface BulkConfirmGuaranteesRequestAction {
  type: typeof ActionTypes.BULK_CONFIRM_GUARANTEES_REQUEST;
  payload: import('types/guarantees').GuaranteeBulkConfirmData;
}

export interface BulkConfirmGuaranteesSuccessAction {
  type: typeof ActionTypes.BULK_CONFIRM_GUARANTEES_SUCCESS;
  payload: {
    updatedCount: number;
    message: string;
  };
}

export interface BulkConfirmGuaranteesFailureAction {
  type: typeof ActionTypes.BULK_CONFIRM_GUARANTEES_FAILURE;
  payload: string;
}

// ============================================================================
// UNION TYPE
// ============================================================================

export type GuaranteeActionTypes =
  | GetGuaranteesRequestAction
  | GetGuaranteesSuccessAction
  | GetGuaranteesFailureAction
  | CreateGuaranteeRequestAction
  | CreateGuaranteeSuccessAction
  | CreateGuaranteeFailureAction
  | UpdateGuaranteeRequestAction
  | UpdateGuaranteeSuccessAction
  | UpdateGuaranteeFailureAction
  | DeleteGuaranteeRequestAction
  | DeleteGuaranteeSuccessAction
  | DeleteGuaranteeFailureAction
  | QuickUpdateGuaranteeRequestAction
  | QuickUpdateGuaranteeSuccessAction
  | QuickUpdateGuaranteeFailureAction
  | BulkUpdateGuaranteesRequestAction
  | BulkUpdateGuaranteesSuccessAction
  | BulkUpdateGuaranteesFailureAction
  | GetStatisticsRequestAction
  | GetStatisticsSuccessAction
  | GetStatisticsFailureAction
  | GetGroupsRequestAction
  | GetGroupsSuccessAction
  | GetGroupsFailureAction
  | CreateGroupRequestAction
  | CreateGroupSuccessAction
  | CreateGroupFailureAction
  | UpdateGroupRequestAction
  | UpdateGroupSuccessAction
  | UpdateGroupFailureAction
  | DeleteGroupRequestAction
  | DeleteGroupSuccessAction
  | DeleteGroupFailureAction
  | AddNoteRequestAction
  | AddNoteSuccessAction
  | AddNoteFailureAction
  | ConfirmGuaranteeRequestAction
  | ConfirmGuaranteeSuccessAction
  | ConfirmGuaranteeFailureAction
  | BulkConfirmGuaranteesRequestAction
  | BulkConfirmGuaranteesSuccessAction
  | BulkConfirmGuaranteesFailureAction
  | SetGuaranteeFiltersAction
  | ClearGuaranteeErrorAction;
