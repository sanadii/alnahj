// ========================================
// CONFIG - Configuration Management
// Base URL: /api/config/
// ========================================
// NOTE: This module is DEPRECATED - use /api/settings/ instead
// Kept for backward compatibility (will be removed after April 2026)

// Configuration
export const CONFIG_CONFIGS = '/api/config/configs/';
export const CONFIG_CONFIG_DETAIL = (id: number) => `/api/config/configs/${id}/`;

// Legacy
export const GET_CONFIG = '/api/config/getConfig/';
export const UPDATE_CONFIG = '/api/config/updateConfig/';

// Deprecated Warning:
// These endpoints are deprecated. Use /api/settings/ instead:
// - /api/config/ → /api/settings/
