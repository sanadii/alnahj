/**
 * Shared Hooks Index
 *
 * Central export point for all shared custom hooks
 */

export { default as useTableSort } from './useTableSort';
export type { UseTableSortReturn, UseTableSortOptions } from './useTableSort';

export { default as useTableFilter } from './useTableFilter';
export type { UseTableFilterReturn, UseTableFilterOptions } from './useTableFilter';

export { default as usePagination } from './usePagination';
export type { UsePaginationReturn, UsePaginationOptions } from './usePagination';

export { default as useApi } from './useApi';
export type { UseApiReturn, UseApiOptions } from './useApi';

export { default as useDebounce } from './useDebounce';

export { useEntityActions } from './useEntityActions';
export type { UseEntityActionsReturn, UseEntityActionsConfig } from './useEntityActions';

export { useEntityDetail } from './useEntityDetail';
export type { UseEntityDetailReturn, UseEntityDetailConfig } from './useEntityDetail';

// Booking/Calendar hooks
export { default as useDurationOptions } from './useDurationOptions';
export { default as useTotalPrice } from './useTotalPrice';
export { default as useTotalTime } from './useTotalTime';
export { default as useGroupedServices } from './useGroupedServices';
export type { Service, ServiceOption, GroupedService } from './useGroupedServices';

// Calendar utilities
export {
  convertUTCToTimeZone,
  convertTimeZoneToUTC,
  formatTime,
  displayLocalTime,
  convertAppointmentTimes,
  findStaffNameById,
  formatServiceDate
} from './calendarHooks';

// Delete hook
export { useDelete } from './useDelete';
