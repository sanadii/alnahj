/**
 * Response Normalizer
 *
 * PROBLEM: Backend returns inconsistent response formats:
 * - Some endpoints return data directly: {id: 1, name: "..."}
 * - Some endpoints return wrapped: {data: {...}, message: "..."}
 * - Some endpoints return custom: {message: "...", user: {...}}
 *
 * SOLUTION: Normalize all responses to APIResponse<T> format for consistent frontend handling
 *
 * DOCUMENTED STANDARD (not currently implemented in backend):
 * {
 *   status: "success" | "error",
 *   data: T,
 *   message?: string,
 *   meta?: { timestamp: string, request_id: string }
 * }
 *
 * See: backend/RESPONSE-STRUCTURE-AUDIT.md for full details
 */

import { APIResponse } from 'types/api';

/**
 * Check if response looks like it's already wrapped in APIResponse format
 */
function isAPIResponse(response: any): boolean {
  return response && typeof response === 'object' && 'data' in response && response.data !== undefined;
}

/**
 * Check if response has a status field (future-proof for when backend is fixed)
 */
function hasStatusField(response: any): boolean {
  return response && typeof response === 'object' && 'status' in response && (response.status === 'success' || response.status === 'error');
}

/**
 * Normalize backend response to APIResponse<T> format
 *
 * Handles 3 cases:
 * 1. Already wrapped: {data: T, message: "..."} -> return as-is
 * 2. Has status: {status: "success", data: T, ...} -> return as-is (future)
 * 3. Direct data: T -> wrap it: {data: T, message: undefined}
 *
 * @param response - The raw backend response
 * @param defaultMessage - Optional default message if none provided
 * @returns Normalized APIResponse<T>
 */
export function normalizeResponse<T = any>(response: any, defaultMessage?: string): APIResponse<T> {
  // Case 1: Response already has status field (future-proof)
  if (hasStatusField(response)) {
    return {
      ...response,
      success: response.status === 'success' // Add success field for backwards compatibility
    } as APIResponse<T>;
  }

  // Case 2: Response looks like APIResponse format (has 'data' field)
  if (isAPIResponse(response)) {
    return {
      data: response.data,
      message: response.message || defaultMessage,
      meta: response.meta,
      success: true // Assume success if properly wrapped
    } as APIResponse<T>;
  }

  // Case 3: Direct data - wrap it
  return {
    data: response as T,
    message: defaultMessage,
    success: true // Assume success if no error thrown
  } as APIResponse<T>;
}

/**
 * Normalize list response with pagination
 *
 * Handles Django REST Framework pagination format:
 * {
 *   count: number,
 *   next: string | null,
 *   previous: string | null,
 *   results: T[]
 * }
 */
export function normalizeListResponse<T = any>(response: any, defaultMessage?: string): APIResponse<{ results: T[]; count: number }> {

  // If already has data.results, it's wrapped
  if (isAPIResponse(response) && response.data?.results) {
    return { ...response, success: true } as APIResponse<{ results: T[]; count: number }>;
  }

  // If response has results directly (DRF pagination)
  if (response && 'results' in response && Array.isArray(response.results)) {
    return {
      success: true,
      data: {
        results: response.results,
        count: response.count || response.results.length
      },
      message: defaultMessage,
      meta: {
        pagination: {
          count: response.count || response.results.length,
          next: response.next,
          previous: response.previous
        }
      }
    } as APIResponse<{ results: T[]; count: number }>;
  }

  // If response is array directly
  if (Array.isArray(response)) {
    return {
      success: true,
      data: {
        results: response,
        count: response.length
      },
      message: defaultMessage
    } as APIResponse<{ results: T[]; count: number }>;
  }

  // Fallback: wrap as-is
  return normalizeResponse<{ results: T[]; count: number }>(response, defaultMessage);
}

/**
 * Normalize error response
 *
 * Backend currently returns:
 * - {error: "message"}
 * - {message: "error"}
 * - {detail: "error"}
 *
 * Should normalize to:
 * {
 *   status: "error",
 *   data: null,
 *   message: "error message",
 *   errors: {...}
 * }
 */
export function normalizeErrorResponse(error: any): APIResponse<null> {
  const errorData = error?.response?.data || error?.data || error;

  // Extract error message
  let message = 'An error occurred';
  if (typeof errorData === 'string') {
    message = errorData;
  } else if (errorData?.message) {
    message = errorData.message;
  } else if (errorData?.error) {
    message = errorData.error;
  } else if (errorData?.detail) {
    message = errorData.detail;
  }

  // Extract errors object
  let errors = null;
  if (errorData?.errors) {
    errors = errorData.errors;
  } else if (errorData?.error && typeof errorData.error === 'object') {
    errors = errorData.error;
  }

  return {
    data: null,
    message,
    meta: {
      status: 'error',
      errors
    }
  } as APIResponse<null>;
}

/**
 * Wrapper for axios responses that auto-normalizes
 * Use this in API helpers instead of returning response.data directly
 *
 * @example
 * export const getElection = async (id: number) => {
 *   const response = await axios.get(`/api/elections/${id}/`);
 *   return wrapResponse<Election>(response.data);
 * };
 */
export function wrapResponse<T>(data: any, message?: string): APIResponse<T> {
  return normalizeResponse<T>(data, message);
}

/**
 * Wrapper for list responses
 */
export function wrapListResponse<T>(data: any, message?: string): APIResponse<{ results: T[]; count: number }> {
  return normalizeListResponse<T>(data, message);
}
