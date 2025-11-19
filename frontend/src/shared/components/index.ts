/**
 * Shared Components Index
 *
 * Central export point for all shared components
 */

// Buttons
export { default as ActionButton } from './buttons/ActionButton';
export { default as ActionButtonGroup } from './buttons/ActionButtonGroup';
export { default as FloatingActionButton } from './buttons/FloatingActionButton';

// Cards
export * from './cards';

// Feedback
export { default as EmptyState } from './feedback/EmptyState';
export { default as ErrorBoundary } from './feedback/ErrorBoundary';
export { default as LoadingSpinner } from './feedback/LoadingSpinner';
export { default as NotificationToast } from './feedback/NotificationToast';
export { default as ProgressIndicator } from './feedback/ProgressIndicator';
export { default as Tooltip } from './feedback/Tooltip';
export { default as WebSocketStatus } from './feedback/WebSocketStatus';

// Forms
export { default as DatePicker } from './forms/DatePicker';
export { default as FieldComponent } from './forms/FieldComponent';
export { default as FileUpload } from './forms/FileUpload';
export { default as FormField } from './forms/FormField';
export { default as FormFields } from './forms/FormFields';
export { default as FormStructureRenderer } from './forms/FormStructureRenderer';
export { default as SearchDropDown } from './forms/SearchDropDown';
export { default as SearchFilterBar } from './forms/SearchFilterBar';

// Headers
export { default as EntityHeader } from './headers/EntityHeader';
export { default as PremiumHeader } from './headers/PremiumHeader';

// Indicators
export { default as StatusChip } from './indicators/StatusChip';

// Metrics
export * from './metrics';

// Modals
export { default as ConfirmDialog } from './modals/ConfirmDialog';
export { default as ModalDialog } from './modals/ModalDialog';
export { default as DeleteModal } from './modals/DeleteModal';
export { default as DeleteConfirmationDialog } from './modals/DeleteConfirmationDialog';
export type { DeleteConfirmationDialogProps } from './modals/DeleteConfirmationDialog';
export { default as PremiumDialogHeader, DialogHeaderGradients } from './modals/PremiumDialogHeader';
export type { PremiumDialogHeaderProps } from './modals/PremiumDialogHeader';
export { default as PremiumDialogFooter, SubmitGradients } from './modals/PremiumDialogFooter';
export type { PremiumDialogFooterProps } from './modals/PremiumDialogFooter';

// Navigation
export * from './navigation';

// States
export * from './states';

// Tables
export * from './tables';
export { default as DataTable } from './tables/DataTable';
export { default as TableContainer } from './tables/TableContainer';
export { default as TableContainerHeader } from './tables/TableContainerHeader';
export * from './tables/TableColumns';

// Tabs
export { default as EntityTabs } from './tabs/EntityTabs';

// Tags
export * from './tags';

// Layout
export * from './layout';

// Legacy/Booking Components
export { default as SvgIcon } from './SvgIcon';
export { default as Spinners } from './Spinners';
export { default as BreadCrumb } from './BreadCrumb';
export { default as Loader } from './Loader';
