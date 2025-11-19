import type { AxiosError } from 'axios';
import type { APIError } from 'types/api';

/**
 * Normalized API Error
 * Ensures every error follows a predictable shape
 */
export class NormalizedApiError extends Error {
  status?: number;
  code?: string;
  details?: Record<string, string[]>;
  raw?: unknown;

  constructor(message: string, options: Partial<APIError> & { raw?: unknown } = {}) {
    super(message);
    this.name = 'NormalizedApiError';
    this.status = options.status;
    this.code = options.code;
    this.details = options.errors;
    this.raw = options.raw;
  }
}

/**
 * Normalize any thrown error into NormalizedApiError
 */
export const normalizeApiError = (error: unknown): NormalizedApiError => {
  if (error instanceof NormalizedApiError) {
    return error;
  }

  if (typeof error === 'string') {
    return new NormalizedApiError(error);
  }

  if (error instanceof Error && !('isAxiosError' in error)) {
    return new NormalizedApiError(error.message, { raw: error });
  }

  if (isAxiosError(error)) {
    const status = error.response?.status;
    const data = (error.response?.data || {}) as APIError | Record<string, any>;
    const message =
      data?.message ||
      data?.error ||
      parseFirstError(data?.errors) ||
      error.message ||
      'An unexpected error occurred';

    return new NormalizedApiError(message, {
      status,
      code: (data as APIError)?.code,
      errors: (data as APIError)?.errors,
      raw: error
    });
  }

  if (typeof error === 'object' && error !== null) {
    const generic = error as Record<string, any>;
    const message = generic.message || generic.error || 'An unexpected error occurred';
    return new NormalizedApiError(message, {
      status: generic.status,
      code: generic.code,
      errors: generic.errors,
      raw: error
    });
  }

  return new NormalizedApiError('An unexpected error occurred', { raw: error });
};

/**
 * Convenience helper for sagas/components
 */
export const getErrorMessage = (error: unknown, fallback: string): string => {
  try {
    const normalized = normalizeApiError(error);
    return normalized.message || fallback;
  } catch {
    return fallback;
  }
};

const isAxiosError = (error: unknown): error is AxiosError => {
  return typeof error === 'object' && error !== null && (error as AxiosError).isAxiosError === true;
};

const parseFirstError = (errors?: Record<string, string[]>): string | undefined => {
  if (!errors) return undefined;
  const firstKey = Object.keys(errors)[0];
  if (!firstKey) return undefined;
  const firstMessage = errors[firstKey]?.[0];
  return firstMessage;
};

