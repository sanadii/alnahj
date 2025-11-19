/**
 * Guarantees API Helper
 * Centralized helper for all guarantee-related endpoints (CRUD, groups, confirmation, notes, search).
 */

import axios from 'utils/axios';
import type { APIResponse } from 'types/api';
import { wrapResponse } from './responseNormalizer';
import * as URL from '../urls/guarantees';
import type {
  Guarantee,
  GuaranteeListItem,
  GuaranteeStatistics,
  GuaranteeFilters,
  GuaranteeCreateData,
  GuaranteeUpdateData,
  GuaranteeBulkUpdateData,
  GuaranteeGroup,
  GuaranteeGroupFormData,
  GuaranteeNote,
  GuaranteeNoteCreateData,
  GuaranteeConfirmData,
  GuaranteeBulkConfirmData,
  Elector
} from 'types/guarantees';

const transformFilters = (filters: GuaranteeFilters = {}) => {
  if (!filters) return undefined;
  return {
    search: filters.search,
    guarantee_status: filters.guaranteeStatus || undefined,
    confirmation_status: filters.confirmationStatus || undefined,
    group: filters.group || undefined,
    page: filters.page,
    page_size: filters.pageSize
  };
};

const transformGuaranteePayload = (data: Partial<GuaranteeCreateData | GuaranteeUpdateData>) => {
  const payload: Record<string, any> = {};

  if ((data as GuaranteeCreateData).elector !== undefined) payload.elector = (data as GuaranteeCreateData).elector;
  if (data.guaranteeStatus !== undefined) payload.guarantee_status = data.guaranteeStatus;
  if (data.group !== undefined) payload.group = data.group;
  if ((data as GuaranteeCreateData).mobile !== undefined) payload.mobile = (data as GuaranteeCreateData).mobile;
  if ((data as GuaranteeCreateData).quick_note !== undefined) payload.quick_note = (data as GuaranteeCreateData).quick_note;
  if ((data as GuaranteeUpdateData).confirmation_status !== undefined)
    payload.confirmation_status = (data as GuaranteeUpdateData).confirmation_status;

  return payload;
};

export const getGuarantees = async (
  filters: GuaranteeFilters = {}
): Promise<
  APIResponse<{
    guarantees: GuaranteeListItem[];
    statistics?: GuaranteeStatistics;
    groups?: GuaranteeGroup[];
  }>
> => {
  const params = transformFilters(filters);
  const response = await axios.get(URL.GUARANTEES_LIST, { params });
  return wrapResponse(response.data);
};

export const getGuaranteeDetail = async (id: number): Promise<APIResponse<Guarantee>> => {
  const response = await axios.get(URL.guaranteeDetail(id));
  return wrapResponse(response.data);
};

export const createGuarantee = async (data: GuaranteeCreateData): Promise<APIResponse<Guarantee>> => {
  const payload = transformGuaranteePayload(data);
  const response = await axios.post(URL.GUARANTEES_CREATE, payload);
  return wrapResponse(response.data, 'Guarantee created successfully');
};

export const updateGuarantee = async (id: number, data: GuaranteeUpdateData): Promise<APIResponse<Guarantee>> => {
  const payload = transformGuaranteePayload(data);
  const response = await axios.patch(URL.guaranteeUpdate(id), payload);
  return wrapResponse(response.data, 'Guarantee updated successfully');
};

export const deleteGuarantee = async (id: number): Promise<APIResponse<null>> => {
  const response = await axios.delete(URL.guaranteeDelete(id));
  return wrapResponse(response.data, 'Guarantee deleted successfully');
};

export const quickUpdateGuarantee = async (id: number, guaranteeStatus: GuaranteeCreateData['guaranteeStatus']) => {
  const response = await axios.patch(URL.guaranteeQuickUpdate(id), { guarantee_status: guaranteeStatus });
  return wrapResponse(response.data, 'Guarantee status updated successfully');
};

export const quickUpdateGuaranteeByElector = async (electorKocId: string, guaranteeStatus: GuaranteeCreateData['guaranteeStatus']) => {
  const response = await axios.patch(URL.guaranteeByElectorQuickUpdate(electorKocId), { guarantee_status: guaranteeStatus });
  return wrapResponse(response.data, 'Guarantee status updated successfully');
};

export const deleteGuaranteeByElector = async (electorKocId: string) => {
  const response = await axios.delete(URL.guaranteeByElectorDelete(electorKocId));
  return wrapResponse(response.data, 'Guarantee removed successfully');
};

export const bulkUpdateGuarantees = async (data: GuaranteeBulkUpdateData) => {
  const payload: Record<string, any> = {
    guarantee_ids: data.guaranteeIds
  };
  if (data.guaranteeStatus !== undefined) payload.guarantee_status = data.guaranteeStatus;
  if (data.groupId !== undefined) payload.group_id = data.groupId;

  const response = await axios.post(URL.GUARANTEES_BULK_UPDATE, payload);
  return wrapResponse(response.data, 'Guarantees updated successfully');
};

export const confirmGuarantee = async (id: number, data: GuaranteeConfirmData) => {
  const response = await axios.post(URL.guaranteeConfirm(id), data);
  return wrapResponse(response.data, 'Guarantee confirmation updated successfully');
};

export const bulkConfirmGuarantees = async (data: GuaranteeBulkConfirmData) => {
  const response = await axios.post(URL.GUARANTEES_BULK_CONFIRM, data);
  return wrapResponse(response.data, 'Guarantees confirmed successfully');
};

export const addGuaranteeNote = async (guaranteeId: number, data: GuaranteeNoteCreateData): Promise<APIResponse<GuaranteeNote>> => {
  const response = await axios.post(URL.guaranteeAddNote(guaranteeId), data);
  return wrapResponse(response.data, 'Note added successfully');
};

export const getGuaranteeStatistics = async (): Promise<APIResponse<GuaranteeStatistics>> => {
  const response = await axios.get(URL.GUARANTEES_STATISTICS);
  return wrapResponse(response.data);
};

export const getGuaranteeGroups = async (): Promise<APIResponse<GuaranteeGroup[]>> => {
  const response = await axios.get(URL.GUARANTEES_GROUPS_LIST);
  return wrapResponse(response.data);
};

export const createGuaranteeGroup = async (data: GuaranteeGroupFormData): Promise<APIResponse<GuaranteeGroup>> => {
  const response = await axios.post(URL.GUARANTEES_GROUPS_CREATE, data);
  return wrapResponse(response.data, 'Group created successfully');
};

export const updateGuaranteeGroup = async (id: number, data: Partial<GuaranteeGroupFormData>) => {
  const response = await axios.patch(URL.guaranteeGroupUpdate(id), data);
  return wrapResponse(response.data, 'Group updated successfully');
};

export const deleteGuaranteeGroup = async (id: number) => {
  const response = await axios.delete(URL.guaranteeGroupDelete(id));
  return wrapResponse(response.data, 'Group deleted successfully');
};

export const searchElectors = async (query: string): Promise<APIResponse<Elector[]>> => {
  const response = await axios.get(URL.GUARANTEES_SEARCH_ELECTOR, { params: { query } });
  return wrapResponse(response.data);
};
