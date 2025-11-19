/**
 * Async State Helpers
 * Shared utilities for managing loading and error states in Redux reducers
 * Election Management System
 */

// ============================================================================
// TYPES
// ============================================================================

/**
 * Standard async state shape for Redux reducers
 */
export interface AsyncState {
  loading: boolean;
  error: string | null;
}

/**
 * Granular async state for operations that need separate loading flags
 */
export interface GranularAsyncState {
  loading?: boolean;
  error?: string | null;
  [key: string]: any; // Allow additional loading/error flags
}

/**
 * Async state update options
 */
export interface AsyncStateUpdate {
  loading?: boolean;
  error?: string | null;
  clearError?: boolean;
}

// ============================================================================
// INITIAL STATE HELPERS
// ============================================================================

/**
 * Creates initial async state
 */
export const createAsyncState = (): AsyncState => ({
  loading: false,
  error: null
});

/**
 * Creates initial granular async state with custom loading flags
 */
export const createGranularAsyncState = <T extends Record<string, any>>(
  additionalFlags: T = {} as T
): GranularAsyncState & T => ({
  loading: false,
  error: null,
  ...additionalFlags
});

// ============================================================================
// REDUCER UPDATE HELPERS
// ============================================================================

/**
 * Creates state update for REQUEST actions
 * Sets loading to true and clears error
 */
export const asyncRequest = <T extends Record<string, any>>(
  state: T,
  options: AsyncStateUpdate = {}
): Partial<T> => ({
  ...state,
  loading: options.loading !== undefined ? options.loading : true,
  error: options.clearError !== false ? null : state.error
});

/**
 * Creates state update for SUCCESS actions
 * Sets loading to false and clears error
 */
export const asyncSuccess = <T extends Record<string, any>>(
  state: T,
  options: AsyncStateUpdate = {}
): Partial<T> => ({
  ...state,
  loading: options.loading !== undefined ? options.loading : false,
  error: options.clearError !== false ? null : state.error
});

/**
 * Creates state update for FAILURE/ERROR actions
 * Sets loading to false and sets error message
 */
export const asyncFailure = <T extends Record<string, any>>(
  state: T,
  error: string | null | { message?: string; error?: string } | Error,
  options: AsyncStateUpdate = {}
): Partial<T> => {
  // Extract error message from various error formats
  let errorMessage: string | null = null;

  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error === null) {
    errorMessage = null;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'object') {
    errorMessage = error.message || error.error || 'An error occurred';
  }

  return {
    ...state,
    loading: options.loading !== undefined ? options.loading : false,
    error: errorMessage
  };
};

/**
 * Creates state update for granular loading flags
 * Useful for operations that need separate loading states (e.g., searchLoading, statsLoading)
 */
export const granularAsyncRequest = <T extends Record<string, any>>(
  state: T,
  loadingKey: string,
  options: AsyncStateUpdate = {}
): Partial<T> => ({
  ...state,
  [loadingKey]: options.loading !== undefined ? options.loading : true,
  error: options.clearError !== false ? null : state.error
});

/**
 * Creates state update for granular success
 */
export const granularAsyncSuccess = <T extends Record<string, any>>(
  state: T,
  loadingKey: string,
  options: AsyncStateUpdate = {}
): Partial<T> => ({
  ...state,
  [loadingKey]: options.loading !== undefined ? options.loading : false,
  error: options.clearError !== false ? null : state.error
});

/**
 * Creates state update for granular failure
 */
export const granularAsyncFailure = <T extends Record<string, any>>(
  state: T,
  loadingKey: string,
  error: string | null | { message?: string; error?: string } | Error,
  errorKey: string = 'error',
  options: AsyncStateUpdate = {}
): Partial<T> => {
  let errorMessage: string | null = null;

  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error === null) {
    errorMessage = null;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'object') {
    errorMessage = error.message || error.error || 'An error occurred';
  }

  return {
    ...state,
    [loadingKey]: options.loading !== undefined ? options.loading : false,
    [errorKey]: errorMessage
  };
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Checks if any loading flag is true in granular async state
 */
export const isAnyLoading = (state: GranularAsyncState): boolean => {
  return Object.keys(state).some(
    (key) => key.includes('loading') || key.includes('Loading') && state[key] === true
  );
};

/**
 * Gets the first error message from granular async state
 */
export const getFirstError = (state: GranularAsyncState): string | null => {
  const errorKeys = Object.keys(state).filter(
    (key) => key.includes('error') || key.includes('Error')
  );
  
  for (const key of errorKeys) {
    if (state[key]) {
      return typeof state[key] === 'string' ? state[key] : null;
    }
  }
  
  return null;
};

