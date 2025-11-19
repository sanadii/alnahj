// ========================================
// CONFIG API - Configuration Management
// ========================================
// NOTE: This module is DEPRECATED - use /api/settings/ instead
// Kept for backward compatibility (will be removed after April 2026)

import { APIClient } from '../api_helper';
import * as URL from '../urls/config';

const api = new APIClient();

// ==============================|| CONFIGURATION ||============================== //

/**
 * Get Configurations
 * @deprecated Use getAppSettings from settings API instead
 */
export const getConfigs = (params?: { key?: string }) => {
  const queryParams = new URLSearchParams();
  if (params?.key) queryParams.append('key', params.key);

  const queryString = queryParams.toString();
  return api.get(`${URL.CONFIG_CONFIGS}${queryString ? `?${queryString}` : ''}`);
};

/**
 * Get Single Configuration
 * @deprecated Use getAppSetting from settings API instead
 */
export const getConfig = (id: number) => api.get(URL.CONFIG_CONFIG_DETAIL(id));

/**
 * Create Configuration
 * @deprecated Use createAppSetting from settings API instead
 */
export const createConfig = (data: any) => api.post(URL.CONFIG_CONFIGS, data);

/**
 * Update Configuration
 * @deprecated Use updateAppSetting from settings API instead
 */
export const updateConfig = (id: number, data: any) => api.put(URL.CONFIG_CONFIG_DETAIL(id), data);

/**
 * Delete Configuration
 * @deprecated Use deleteAppSetting from settings API instead
 */
export const deleteConfig = (id: number) => api.delete(URL.CONFIG_CONFIG_DETAIL(id));
