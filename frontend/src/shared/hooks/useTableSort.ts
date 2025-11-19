import { useState, useCallback, useMemo } from 'react';

/**
 * useTableSort Hook
 *
 * Manages table sorting state and provides sort functionality
 * Used in: All client tabs with sortable tables
 *
 * Replaces duplicate sorting logic across 10+ tabs
 */

export interface UseTableSortReturn<T> {
  /** Current sort column */
  sortBy: string | null;
  /** Current sort order */
  sortOrder: 'asc' | 'desc';
  /** Sorted data */
  sortedData: T[];
  /** Handle column sort */
  handleSort: (columnId: string) => void;
  /** Reset sort */
  resetSort: () => void;
}

export interface UseTableSortOptions {
  /** Initial sort column */
  initialSortBy?: string;
  /** Initial sort order */
  initialSortOrder?: 'asc' | 'desc';
}

/**
 * Custom hook for table sorting
 *
 * @example
 * const { sortedData, sortBy, sortOrder, handleSort } = useTableSort(data, {
 *   initialSortBy: 'date',
 *   initialSortOrder: 'desc'
 * });
 */
function useTableSort<T extends Record<string, any>>(data: T[], options: UseTableSortOptions = {}): UseTableSortReturn<T> {
  const { initialSortBy = null, initialSortOrder = 'asc' } = options;

  const [sortBy, setSortBy] = useState<string | null>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder);

  // Handle sort click
  const handleSort = useCallback((columnId: string) => {
    setSortBy((prevSortBy) => {
      if (prevSortBy === columnId) {
        // Toggle sort order if same column
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
        return columnId;
      } else {
        // Set new column with ascending order
        setSortOrder('asc');
        return columnId;
      }
    });
  }, []);

  // Reset sort
  const resetSort = useCallback(() => {
    setSortBy(initialSortBy);
    setSortOrder(initialSortOrder);
  }, [initialSortBy, initialSortOrder]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortBy || !data) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      // Handle null/undefined values
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      // Handle different data types
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const comparison = aVal.localeCompare(bVal);
        return sortOrder === 'asc' ? comparison : -comparison;
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      // Handle dates
      if (aVal instanceof Date && bVal instanceof Date) {
        return sortOrder === 'asc' ? aVal.getTime() - bVal.getTime() : bVal.getTime() - aVal.getTime();
      }

      // Default comparison
      const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [data, sortBy, sortOrder]);

  return {
    sortBy,
    sortOrder,
    sortedData,
    handleSort,
    resetSort
  };
}

export default useTableSort;
