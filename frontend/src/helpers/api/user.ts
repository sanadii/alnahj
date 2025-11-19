/**
 * User API Helper - Workspace
 * Handles user profile and management
 */

import api from 'utils/axios';
import type { APIResponse } from 'types/api';
import { wrapResponse, wrapListResponse } from './responseNormalizer';

// ============================================================================
// USER PROFILE
// ============================================================================

/**
 * Get current user profile
 */
export const getUserProfile = async (): Promise<APIResponse<any>> => {
  const response = await api.get('/api/users/me/');
  return wrapResponse(response.data);
};

/**
 * Update user profile
 */
export const updateUserProfile = async (data: any): Promise<APIResponse<any>> => {
  const response = await api.patch('/api/users/me/', data);
  return wrapResponse(response.data);
};

/**
 * Upload user avatar
 */
export const uploadAvatar = async (file: File): Promise<APIResponse<any>> => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await api.patch('/api/user/profile/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return wrapResponse(response.data);
};

/**
 * Change password
 */
export const changePassword = async (data: { old_password: string; new_password: string }): Promise<APIResponse<null>> => {
  const response = await api.post('/api/user/change-password/', data);
  return wrapResponse(response.data);
};

/**
 * Get user preferences
 */
export const getUserPreferences = async (): Promise<APIResponse<any>> => {
  const response = await api.get('/api/user/preferences/');
  return wrapResponse(response.data);
};

/**
 * Update user preferences
 */
export const updateUserPreferences = async (data: any): Promise<APIResponse<any>> => {
  const response = await api.patch('/api/user/preferences/', data);
  return wrapResponse(response.data);
};

/**
 * Get user notifications
 */
export const getUserNotifications = async (params?: {
  unread_only?: boolean;
  page?: number;
  page_size?: number;
}): Promise<APIResponse<any[]>> => {
  const response = await api.get('/api/user/notifications/', { params });
  return wrapResponse(response.data);
};

/**
 * Mark notification as read
 */
export const markNotificationRead = async (notificationId: number): Promise<APIResponse<null>> => {
  const response = await api.patch(`/api/user/notifications/${notificationId}/`, {
    is_read: true
  });
  return wrapResponse(response.data);
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsRead = async (): Promise<APIResponse<null>> => {
  const response = await api.post('/api/user/notifications/mark-all-read/');
  return wrapResponse(response.data);
};
