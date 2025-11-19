import { useState, useCallback, useMemo } from 'react';

/**
 * usePagination Hook
 *
 * Manages pagination state and provides pagination functionality
 * Used in: All client tabs with paginated tables
 *
 * Replaces duplicate pagination logic across 10+ tabs
 */

export interface UsePaginationReturn<T> {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Items per page */
  pageSize: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of items */
  totalItems: number;
  /** Paginated data for current page */
  paginatedData: T[];
  /** Go to specific page */
  goToPage: (page: number) => void;
  /** Go to next page */
  nextPage: () => void;
  /** Go to previous page */
  previousPage: () => void;
  /** Go to first page */
  firstPage: () => void;
  /** Go to last page */
  lastPage: () => void;
  /** Change page size */
  setPageSize: (size: number) => void;
  /** Check if has next page */
  hasNextPage: boolean;
  /** Check if has previous page */
  hasPreviousPage: boolean;
}

export interface UsePaginationOptions {
  /** Initial page (1-indexed) */
  initialPage?: number;
  /** Initial page size */
  initialPageSize?: number;
  /** Available page size options */
  pageSizeOptions?: number[];
}

/**
 * Custom hook for pagination
 *
 * @example
 * const {
 *   paginatedData,
 *   currentPage,
 *   totalPages,
 *   nextPage,
 *   previousPage,
 *   goToPage
 * } = usePagination(data, {
 *   initialPage: 1,
 *   initialPageSize: 10
 * });
 */
function usePagination<T>(data: T[], options: UsePaginationOptions = {}): UsePaginationReturn<T> {
  const { initialPage = 1, initialPageSize = 10, pageSizeOptions = [5, 10, 25, 50, 100] } = options;

  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [pageSize, setPageSizeState] = useState<number>(initialPageSize);

  const totalItems = data?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Paginated data
  const paginatedData = useMemo(() => {
    if (!data) return [];

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  // Navigation flags
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  // Go to specific page
  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
    },
    [totalPages]
  );

  // Next page
  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasNextPage]);

  // Previous page
  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [hasPreviousPage]);

  // First page
  const firstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Last page
  const lastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  // Change page size (and reset to page 1)
  const setPageSize = useCallback(
    (size: number) => {
      // Validate page size
      const validSize = pageSizeOptions.includes(size) ? size : initialPageSize;
      setPageSizeState(validSize);
      setCurrentPage(1); // Reset to first page when changing page size
    },
    [pageSizeOptions, initialPageSize]
  );

  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedData,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    setPageSize,
    hasNextPage,
    hasPreviousPage
  };
}

export default usePagination;
