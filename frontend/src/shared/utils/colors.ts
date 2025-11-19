/**
 * Shared color utilities for status, priority, and semantic colors
 *
 * Used across: AppointmentsTab, VoucherTab, DocumentsTab, LogsTab, etc.
 * Provides consistent color mapping for statuses, priorities, and labels
 */

// ======================== APPOINTMENT STATUS COLORS ========================

/**
 * Status mapping for appointments
 */
export const APPOINTMENT_STATUS_MAP: Record<number, string> = {
  1: 'pending',
  2: 'confirmed',
  3: 'checked_in',
  4: 'in_progress',
  5: 'completed',
  6: 'cancelled',
  7: 'no_show',
  8: 'rescheduled',
  9: 'declined',
  10: 'pencilled_in'
};

/**
 * Gets the status label from status code
 * @param status - Status code (number) or status string
 * @returns Human-readable status label
 *
 * @example
 * getStatusLabel(5)
 * // Returns: 'Completed'
 *
 * getStatusLabel('confirmed')
 * // Returns: 'Confirmed'
 */
export const getStatusLabel = (status: number | string): string => {
  if (typeof status === 'number') {
    const statusString = APPOINTMENT_STATUS_MAP[status] || 'pending';
    return statusString
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Gets color for appointment status
 * @param status - Status code (number) or status string
 * @returns MUI color name
 *
 * @example
 * getStatusColor(5)
 * // Returns: 'success'
 *
 * getStatusColor('cancelled')
 * // Returns: 'error'
 */
export const getStatusColor = (
  status: number | string | any
): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
  // Convert number to string if needed
  let statusString: string;

  if (typeof status === 'number') {
    statusString = APPOINTMENT_STATUS_MAP[status] || 'pending';
  } else if (typeof status === 'string') {
    statusString = status;
  } else {
    statusString = String(status);
  }

  statusString = statusString.toLowerCase();

  const colorMap: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
    // Appointment statuses
    pending: 'warning',
    confirmed: 'info',
    checked_in: 'primary',
    in_progress: 'primary',
    completed: 'success',
    cancelled: 'error',
    no_show: 'error',
    rescheduled: 'warning',
    declined: 'error',
    pencilled_in: 'default',
    // Invoice statuses
    paid: 'success',
    overdue: 'error',
    draft: 'default',
    partially_paid: 'info'
  };

  return colorMap[statusString] || 'default';
};

// ======================== VOUCHER STATUS COLORS ========================

/**
 * Gets color for voucher status
 * @param status - Voucher status string
 * @returns MUI color name
 *
 * @example
 * getVoucherStatusColor('active')
 * // Returns: 'success'
 */
export const getVoucherStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
  const colorMap: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
    active: 'success',
    used: 'default',
    expired: 'error',
    redeemed: 'info',
    pending: 'warning',
    cancelled: 'error'
  };

  return colorMap[status.toLowerCase()] || 'default';
};

// ======================== PRIORITY COLORS ========================

/**
 * Gets color for priority level
 * @param priority - Priority string ('low', 'medium', 'high', 'urgent')
 * @returns MUI color name
 *
 * @example
 * getPriorityColor('high')
 * // Returns: 'error'
 */
export const getPriorityColor = (priority: string): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
  const colorMap: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
    low: 'info',
    medium: 'warning',
    high: 'error',
    urgent: 'error',
    critical: 'error'
  };

  return colorMap[priority.toLowerCase()] || 'default';
};

// ======================== PAYMENT STATUS COLORS ========================

/**
 * Gets color for payment status
 * @param status - Payment status string
 * @returns MUI color name
 *
 * @example
 * getPaymentStatusColor('paid')
 * // Returns: 'success'
 */
export const getPaymentStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
  const colorMap: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
    paid: 'success',
    unpaid: 'error',
    partial: 'warning',
    pending: 'warning',
    refunded: 'info',
    cancelled: 'error',
    overdue: 'error'
  };

  return colorMap[status.toLowerCase()] || 'default';
};

// ======================== DOCUMENT STATUS COLORS ========================

/**
 * Gets color for document status
 * @param status - Document status string
 * @returns MUI color name
 *
 * @example
 * getDocumentStatusColor('approved')
 * // Returns: 'success'
 */
export const getDocumentStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
  const colorMap: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
    draft: 'default',
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
    archived: 'info'
  };

  return colorMap[status.toLowerCase()] || 'default';
};

// ======================== CLIENT TIER COLORS ========================

/**
 * Gets color for client tier/level
 * @param tier - Tier string ('bronze', 'silver', 'gold', 'platinum', 'vip')
 * @returns MUI color name
 *
 * @example
 * getTierColor('gold')
 * // Returns: 'warning'
 */
export const getTierColor = (tier: string): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
  const colorMap: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
    basic: 'default',
    bronze: 'default',
    silver: 'info',
    gold: 'warning',
    platinum: 'primary',
    vip: 'error',
    premium: 'secondary'
  };

  return colorMap[tier.toLowerCase()] || 'default';
};

// ======================== COMMUNICATION PREFERENCE COLORS ========================

/**
 * Gets color for communication method
 * @param method - Communication method string
 * @returns MUI color name
 *
 * @example
 * getCommunicationMethodColor('email')
 * // Returns: 'info'
 */
export const getCommunicationMethodColor = (
  method: string
): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
  const colorMap: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
    email: 'info',
    sms: 'success',
    phone: 'primary',
    whatsapp: 'success',
    push: 'warning'
  };

  return colorMap[method.toLowerCase()] || 'default';
};

// ======================== ACTION TYPE COLORS ========================

/**
 * Gets color for action/activity type
 * @param action - Action type string
 * @returns MUI color name
 *
 * @example
 * getActionTypeColor('create')
 * // Returns: 'success'
 */
export const getActionTypeColor = (action: string): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
  const colorMap: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
    create: 'success',
    created: 'success',
    update: 'info',
    updated: 'info',
    delete: 'error',
    deleted: 'error',
    view: 'default',
    viewed: 'default',
    download: 'primary',
    downloaded: 'primary',
    upload: 'primary',
    uploaded: 'primary',
    send: 'info',
    sent: 'info',
    receive: 'info',
    received: 'info'
  };

  return colorMap[action.toLowerCase()] || 'default';
};

// ======================== BOOLEAN STATE COLORS ========================

/**
 * Gets color for boolean states (active/inactive, enabled/disabled, etc.)
 * @param isActive - Boolean state
 * @param trueColor - Color for true state (default: 'success')
 * @param falseColor - Color for false state (default: 'error')
 * @returns MUI color name
 *
 * @example
 * getBooleanStateColor(true)
 * // Returns: 'success'
 *
 * getBooleanStateColor(false, 'primary', 'default')
 * // Returns: 'default'
 */
export const getBooleanStateColor = (
  isActive: boolean,
  trueColor: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' = 'success',
  falseColor: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' = 'error'
): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
  return isActive ? trueColor : falseColor;
};

// ======================== SEVERITY COLORS ========================

/**
 * Gets color for severity levels
 * @param severity - Severity string ('info', 'success', 'warning', 'error')
 * @returns MUI color name (maps directly)
 *
 * @example
 * getSeverityColor('error')
 * // Returns: 'error'
 */
export const getSeverityColor = (severity: string): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
  const validColors = ['info', 'success', 'warning', 'error'];
  const lowerSeverity = severity.toLowerCase();

  if (validColors.includes(lowerSeverity)) {
    return lowerSeverity as 'error' | 'warning' | 'info' | 'success';
  }

  return 'default';
};
