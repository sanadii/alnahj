// ==============================|| API RESPONSE TYPES ||============================== //
// Election Management System - Standard API Response Structure

/**
 * Standard API Response wrapper
 * Matches the backend's standardized response format
 *
 * Backend returns:
 * {
 *   status: "success" | "error",
 *   data: T,
 *   message?: string,
 *   meta?: { timestamp, request_id, pagination?, ... },
 *   errors?: {...}  // Only in error responses
 * }
 */
export interface APIResponse<T = any> {
  status?: 'success' | 'error';
  data: T;
  message?: string;
  // Legacy fields (for backwards compatibility)
  success?: boolean;
  error?: string | null;
  errors?: Record<string, string[]>;
  meta?: {
    timestamp?: string;
    request_id?: string;
    pagination?: {
      count?: number;
      next?: string | null;
      previous?: string | null;
    };
    [key: string]: any;
  };
}

/**
 * Paginated API Response
 */
export interface PaginatedAPIResponse<T = any> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
  message?: string;
  success?: boolean;
}

/**
 * API Error Response
 */
export interface APIError {
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
  status?: number;
  code?: string;
}

/**
 * Bulk Operation Result
 */
export interface BulkOperationResult {
  success: number;
  failed: number;
  errors?: Array<{
    id: number | string;
    error: string;
  }>;
  message?: string;
}
