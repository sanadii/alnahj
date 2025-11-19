import { useState, useCallback, useMemo } from 'react';

/**
 * useTableFilter Hook
 *
 * Manages table filtering/search state and provides filter functionality
 * Used in: All client tabs with searchable/filterable tables
 *
 * Replaces duplicate filtering logic across 10+ tabs
 */

export interface UseTableFilterReturn<T> {
  /** Search/filter term */
  searchTerm: string;
  /** Active filters */
  filters: Record<string, any>;
  /** Filtered data */
  filteredData: T[];
  /** Set search term */
  setSearchTerm: (term: string) => void;
  /** Set a filter */
  setFilter: (key: string, value: any) => void;
  /** Clear a specific filter */
  clearFilter: (key: string) => void;
  /** Clear all filters */
  clearAllFilters: () => void;
  /** Check if any filters are active */
  hasActiveFilters: boolean;
}

export interface UseTableFilterOptions<T> {
  /** Fields to search in */
  searchFields?: (keyof T)[];
  /** Initial search term */
  initialSearchTerm?: string;
  /** Initial filters */
  initialFilters?: Record<string, any>;
}

/**
 * Custom hook for table filtering and search
 *
 * @example
 * const { filteredData, searchTerm, setSearchTerm, filters, setFilter } = useTableFilter(data, {
 *   searchFields: ['name', 'email'],
 *   initialFilters: { status: 'active' }
 * });
 */
function useTableFilter<T extends Record<string, any>>(data: T[], options: UseTableFilterOptions<T> = {}): UseTableFilterReturn<T> {
  const { searchFields = [], initialSearchTerm = '', initialFilters = {} } = options;

  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);

  // Set a single filter
  const setFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Clear a specific filter
  const clearFilter = useCallback((key: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setFilters({});
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return searchTerm !== '' || Object.keys(filters).length > 0;
  }, [searchTerm, filters]);

  // Filter data
  const filteredData = useMemo(() => {
    if (!data) return [];

    let result = [...data];

    // Apply search term
    if (searchTerm && searchFields.length > 0) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((item) => {
        return searchFields.some((field) => {
          const value = item[field];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(lowerSearch);
        });
      });
    }

    // Apply filters
    if (Object.keys(filters).length > 0) {
      result = result.filter((item) => {
        return Object.entries(filters).every(([key, value]) => {
          // Skip empty filter values
          if (value === undefined || value === null || value === '') return true;

          const itemValue = item[key];

          // Handle array filters (e.g., multiple selections)
          if (Array.isArray(value)) {
            return value.includes(itemValue);
          }

          // Handle date range filters
          if (typeof value === 'object' && value.start && value.end) {
            const itemDate = new Date(itemValue);
            const startDate = new Date(value.start);
            const endDate = new Date(value.end);
            return itemDate >= startDate && itemDate <= endDate;
          }

          // Default equality check
          return itemValue === value;
        });
      });
    }

    return result;
  }, [data, searchTerm, searchFields, filters]);

  return {
    searchTerm,
    filters,
    filteredData,
    setSearchTerm,
    setFilter,
    clearFilter,
    clearAllFilters,
    hasActiveFilters
  };
}

export default useTableFilter;
