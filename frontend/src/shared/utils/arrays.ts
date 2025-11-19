/**
 * Shared array manipulation utilities
 *
 * Used for: Grouping, filtering, sorting, and transforming arrays
 * Provides reusable array operations across client tabs and components
 */

// ======================== GROUPING ========================

/**
 * Groups array items by a key
 * @param array - Array to group
 * @param keyGetter - Function to extract grouping key
 * @returns Object with grouped items
 *
 * @example
 * groupBy(appointments, (apt) => apt.status)
 * // Returns: { 'completed': [...], 'pending': [...] }
 */
export function groupBy<T>(array: T[], keyGetter: (item: T) => string | number): Record<string | number, T[]> {
  return array.reduce(
    (result, item) => {
      const key = keyGetter(item);
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(item);
      return result;
    },
    {} as Record<string | number, T[]>
  );
}

/**
 * Groups array items by date (year-month)
 * @param array - Array to group
 * @param dateGetter - Function to extract date
 * @returns Object with items grouped by month
 *
 * @example
 * groupByMonth(appointments, (apt) => apt.date)
 * // Returns: { '2024-01': [...], '2024-02': [...] }
 */
export function groupByMonth<T>(array: T[], dateGetter: (item: T) => string | Date): Record<string, T[]> {
  return groupBy(array, (item) => {
    const date = new Date(dateGetter(item));
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  });
}

/**
 * Groups array items by date (year-month-day)
 * @param array - Array to group
 * @param dateGetter - Function to extract date
 * @returns Object with items grouped by day
 *
 * @example
 * groupByDay(logs, (log) => log.timestamp)
 * // Returns: { '2024-01-15': [...], '2024-01-16': [...] }
 */
export function groupByDay<T>(array: T[], dateGetter: (item: T) => string | Date): Record<string, T[]> {
  return groupBy(array, (item) => {
    const date = new Date(dateGetter(item));
    return date.toISOString().split('T')[0];
  });
}

// ======================== FILTERING ========================

/**
 * Filters array by search term (searches multiple fields)
 * @param array - Array to filter
 * @param searchTerm - Search term
 * @param searchFields - Fields to search in
 * @returns Filtered array
 *
 * @example
 * filterBySearch(clients, 'john', ['name', 'email'])
 * // Returns: clients with 'john' in name or email
 */
export function filterBySearch<T>(array: T[], searchTerm: string, searchFields: (keyof T)[]): T[] {
  if (!searchTerm) return array;

  const lowerSearch = searchTerm.toLowerCase();

  return array.filter((item) => {
    return searchFields.some((field) => {
      const value = item[field];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(lowerSearch);
    });
  });
}

/**
 * Filters array by date range
 * @param array - Array to filter
 * @param dateGetter - Function to extract date
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Filtered array
 *
 * @example
 * filterByDateRange(appointments, (apt) => apt.date, '2024-01-01', '2024-01-31')
 * // Returns: appointments in January 2024
 */
export function filterByDateRange<T>(
  array: T[],
  dateGetter: (item: T) => string | Date,
  startDate?: string | Date,
  endDate?: string | Date
): T[] {
  return array.filter((item) => {
    const itemDate = new Date(dateGetter(item));

    if (startDate && itemDate < new Date(startDate)) return false;
    if (endDate && itemDate > new Date(endDate)) return false;

    return true;
  });
}

/**
 * Filters array by multiple conditions
 * @param array - Array to filter
 * @param filters - Object with filter conditions
 * @returns Filtered array
 *
 * @example
 * filterByConditions(appointments, { status: 'completed', staff_id: 5 })
 * // Returns: completed appointments by staff 5
 */
export function filterByConditions<T>(array: T[], filters: Partial<Record<keyof T, any>>): T[] {
  return array.filter((item) => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === '') return true;
      return item[key as keyof T] === value;
    });
  });
}

// ======================== SORTING ========================

/**
 * Sorts array by a field
 * @param array - Array to sort
 * @param field - Field to sort by
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array (new array, doesn't mutate original)
 *
 * @example
 * sortBy(clients, 'name', 'asc')
 * // Returns: clients sorted by name A-Z
 */
export function sortBy<T>(array: T[], field: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (aVal === bVal) return 0;

    const comparison = aVal > bVal ? 1 : -1;
    return order === 'asc' ? comparison : -comparison;
  });
}

/**
 * Sorts array by date field
 * @param array - Array to sort
 * @param dateGetter - Function to extract date
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array (new array)
 *
 * @example
 * sortByDate(appointments, (apt) => apt.date, 'desc')
 * // Returns: appointments sorted newest first
 */
export function sortByDate<T>(array: T[], dateGetter: (item: T) => string | Date, order: 'asc' | 'desc' = 'desc'): T[] {
  return [...array].sort((a, b) => {
    const aDate = new Date(dateGetter(a)).getTime();
    const bDate = new Date(dateGetter(b)).getTime();

    return order === 'asc' ? aDate - bDate : bDate - aDate;
  });
}

/**
 * Sorts array by multiple fields
 * @param array - Array to sort
 * @param sortRules - Array of sort rules
 * @returns Sorted array (new array)
 *
 * @example
 * sortByMultiple(clients, [
 *   { field: 'tier', order: 'desc' },
 *   { field: 'name', order: 'asc' }
 * ])
 * // Returns: clients sorted by tier (desc), then name (asc)
 */
export function sortByMultiple<T>(array: T[], sortRules: Array<{ field: keyof T; order: 'asc' | 'desc' }>): T[] {
  return [...array].sort((a, b) => {
    for (const rule of sortRules) {
      const aVal = a[rule.field];
      const bVal = b[rule.field];

      if (aVal === bVal) continue;

      const comparison = aVal > bVal ? 1 : -1;
      return rule.order === 'asc' ? comparison : -comparison;
    }
    return 0;
  });
}

// ======================== TRANSFORMATION ========================

/**
 * Maps array to key-value pairs
 * @param array - Array to transform
 * @param keyGetter - Function to extract key
 * @param valueGetter - Function to extract value (optional)
 * @returns Object with key-value pairs
 *
 * @example
 * toKeyValuePairs(clients, (c) => c.id, (c) => c.name)
 * // Returns: { '1': 'John', '2': 'Jane', ... }
 */
export function toKeyValuePairs<T, V = T>(
  array: T[],
  keyGetter: (item: T) => string | number,
  valueGetter?: (item: T) => V
): Record<string | number, V | T> {
  return array.reduce(
    (result, item) => {
      const key = keyGetter(item);
      result[key] = valueGetter ? valueGetter(item) : item;
      return result;
    },
    {} as Record<string | number, V | T>
  );
}

/**
 * Removes duplicates from array
 * @param array - Array with potential duplicates
 * @param keyGetter - Function to extract unique key (optional)
 * @returns Array without duplicates
 *
 * @example
 * unique([1, 2, 2, 3, 3, 3])
 * // Returns: [1, 2, 3]
 *
 * unique(clients, (c) => c.email)
 * // Returns: clients with unique emails
 */
export function unique<T>(array: T[], keyGetter?: (item: T) => any): T[] {
  if (!keyGetter) {
    return Array.from(new Set(array));
  }

  const seen = new Set();
  return array.filter((item) => {
    const key = keyGetter(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Chunks array into smaller arrays
 * @param array - Array to chunk
 * @param size - Size of each chunk
 * @returns Array of chunks
 *
 * @example
 * chunk([1, 2, 3, 4, 5], 2)
 * // Returns: [[1, 2], [3, 4], [5]]
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Flattens nested arrays
 * @param array - Array with nested arrays
 * @returns Flattened array
 *
 * @example
 * flatten([[1, 2], [3, 4], [5]])
 * // Returns: [1, 2, 3, 4, 5]
 */
export function flatten<T>(array: T[][]): T[] {
  return array.reduce((result, item) => result.concat(item), []);
}

// ======================== AGGREGATION ========================

/**
 * Calculates sum of numeric field
 * @param array - Array to sum
 * @param field - Field to sum (or function to extract value)
 * @returns Total sum
 *
 * @example
 * sum(orders, 'total')
 * // Returns: 1250.50
 *
 * sum(orders, (order) => order.price * order.quantity)
 * // Returns: calculated sum
 */
export function sum<T>(array: T[], field: keyof T | ((item: T) => number)): number {
  return array.reduce((total, item) => {
    const value = typeof field === 'function' ? field(item) : item[field];
    return total + (Number(value) || 0);
  }, 0);
}

/**
 * Calculates average of numeric field
 * @param array - Array to average
 * @param field - Field to average (or function to extract value)
 * @returns Average value
 *
 * @example
 * average(orders, 'rating')
 * // Returns: 4.5
 */
export function average<T>(array: T[], field: keyof T | ((item: T) => number)): number {
  if (array.length === 0) return 0;
  return sum(array, field) / array.length;
}

/**
 * Finds minimum value
 * @param array - Array to search
 * @param field - Field to compare (or function to extract value)
 * @returns Minimum value
 *
 * @example
 * min(products, 'price')
 * // Returns: 10.50
 */
export function min<T>(array: T[], field: keyof T | ((item: T) => number)): number {
  if (array.length === 0) return 0;

  return Math.min(
    ...array.map((item) => {
      const value = typeof field === 'function' ? field(item) : item[field];
      return Number(value) || 0;
    })
  );
}

/**
 * Finds maximum value
 * @param array - Array to search
 * @param field - Field to compare (or function to extract value)
 * @returns Maximum value
 *
 * @example
 * max(products, 'price')
 * // Returns: 999.99
 */
export function max<T>(array: T[], field: keyof T | ((item: T) => number)): number {
  if (array.length === 0) return 0;

  return Math.max(
    ...array.map((item) => {
      const value = typeof field === 'function' ? field(item) : item[field];
      return Number(value) || 0;
    })
  );
}

/**
 * Counts items by condition
 * @param array - Array to count
 * @param predicate - Condition function
 * @returns Count of matching items
 *
 * @example
 * countBy(appointments, (apt) => apt.status === 'completed')
 * // Returns: 42
 */
export function countBy<T>(array: T[], predicate: (item: T) => boolean): number {
  return array.filter(predicate).length;
}

// ======================== PAGINATION ========================

/**
 * Paginates array
 * @param array - Array to paginate
 * @param page - Page number (1-indexed)
 * @param pageSize - Items per page
 * @returns Object with paginated data and metadata
 *
 * @example
 * paginate(clients, 2, 10)
 * // Returns: { data: [...10 items...], page: 2, pageSize: 10, totalPages: 5, totalItems: 50 }
 */
export function paginate<T>(
  array: T[],
  page: number = 1,
  pageSize: number = 10
): {
  data: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
} {
  const totalItems = array.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: array.slice(start, end),
    page,
    pageSize,
    totalPages,
    totalItems,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
}

// ======================== UTILITIES ========================

/**
 * Checks if array is empty or null/undefined
 * @param array - Array to check
 * @returns True if empty
 *
 * @example
 * isEmpty([])
 * // Returns: true
 */
export function isEmpty<T>(array?: T[] | null): boolean {
  return !array || array.length === 0;
}

/**
 * Gets first item or default value
 * @param array - Array to get from
 * @param defaultValue - Default if empty
 * @returns First item or default
 *
 * @example
 * first([1, 2, 3])
 * // Returns: 1
 *
 * first([], 'default')
 * // Returns: 'default'
 */
export function first<T>(array: T[], defaultValue?: T): T | undefined {
  return array.length > 0 ? array[0] : defaultValue;
}

/**
 * Gets last item or default value
 * @param array - Array to get from
 * @param defaultValue - Default if empty
 * @returns Last item or default
 *
 * @example
 * last([1, 2, 3])
 * // Returns: 3
 */
export function last<T>(array: T[], defaultValue?: T): T | undefined {
  return array.length > 0 ? array[array.length - 1] : defaultValue;
}

/**
 * Safely gets item at index with default
 * @param array - Array to get from
 * @param index - Index to access
 * @param defaultValue - Default if out of bounds
 * @returns Item at index or default
 *
 * @example
 * at([1, 2, 3], 10, 0)
 * // Returns: 0 (out of bounds)
 */
export function at<T>(array: T[], index: number, defaultValue?: T): T | undefined {
  return array[index] !== undefined ? array[index] : defaultValue;
}
