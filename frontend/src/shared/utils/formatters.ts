import { format, parseISO } from 'date-fns';

/**
 * Shared formatting utilities for dates, times, currency, etc.
 *
 * Used across Client Detail tabs to ensure consistent formatting.
 * Replaces duplicate functions in: NotesTab, LogsTab, VoucherTab, DocumentsTab, CommunicationPreferencesTab
 */

/**
 * Formats a timestamp into separate date and time strings
 * @param timestamp - ISO timestamp string
 * @returns Object with formatted date and time
 *
 * @example
 * formatTimestamp('2024-01-30 14:30:25')
 * // Returns: { date: '30/01/2024', time: '14:30:25' }
 */
export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return {
    date: date.toLocaleDateString('en-GB'),
    time: date.toLocaleTimeString('en-GB', { hour12: false })
  };
};

/**
 * Formats a date string into a human-readable format
 * @param dateString - ISO date string
 * @param formatType - Type of format to use
 * @returns Formatted date string
 *
 * @example
 * formatDate('2024-06-03T16:30:00Z', 'long')
 * // Returns: 'Mon, Jun 3, 2024 at 4:30PM'
 *
 * formatDate('2024-06-03T16:30:00Z', 'short')
 * // Returns: '03/06/2024'
 */
export const formatDate = (dateString: string, formatType: 'short' | 'medium' | 'long' = 'medium'): string => {
  try {
    const date = parseISO(dateString);

    switch (formatType) {
      case 'short':
        return format(date, 'dd/MM/yyyy');
      case 'long':
        return format(date, "EEE, MMM d, yyyy 'at' h:mma");
      case 'medium':
      default:
        return format(date, 'MMM d, yyyy');
    }
  } catch {
    return dateString;
  }
};

/**
 * Formats a date/time string for appointments and schedules
 * @param dateString - ISO date string
 * @returns Formatted date-time string
 *
 * @example
 * formatDateTime('2024-06-03T16:30:00Z')
 * // Returns: 'Mon, Jun 3, 2024 at 4:30PM'
 */
export const formatDateTime = (dateString: string): string => {
  try {
    return format(parseISO(dateString), "EEE, MMM d, yyyy 'at' h:mma");
  } catch {
    return dateString;
  }
};

/**
 * Formats just the time portion of a datetime string
 * @param dateString - ISO date string
 * @param use12Hour - Whether to use 12-hour format (default: true)
 * @returns Formatted time string
 *
 * @example
 * formatTime('2024-06-03T16:30:00Z', true)
 * // Returns: '4:30PM'
 *
 * formatTime('2024-06-03T16:30:00Z', false)
 * // Returns: '16:30'
 */
export const formatTime = (dateString: string, use12Hour: boolean = true): string => {
  try {
    return format(parseISO(dateString), use12Hour ? 'h:mma' : 'HH:mm');
  } catch {
    return dateString;
  }
};

/**
 * Formats a currency amount
 * @param amount - Numeric amount
 * @param currency - Currency code (default: 'KD')
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(139.5)
 * // Returns: '139.50 KD'
 *
 * formatCurrency(1234.567, 'USD', 2)
 * // Returns: '1234.57 USD'
 */
export const formatCurrency = (amount: number, currency: string = 'KD', decimals: number = 2): string => {
  return `${amount.toFixed(decimals)} ${currency}`;
};

/**
 * Formats a phone number
 * @param phone - Phone number string
 * @param countryCode - Country code (default: '+965')
 * @returns Formatted phone string
 *
 * @example
 * formatPhoneNumber('12345678')
 * // Returns: '+965 12345678'
 */
export const formatPhoneNumber = (phone: string, countryCode: string = '+965'): string => {
  if (!phone) return 'N/A';
  return `${countryCode} ${phone}`;
};

/**
 * Calculates age from date of birth
 * @param dateOfBirth - Date of birth string
 * @returns Age in years
 *
 * @example
 * calculateAge('1990-01-15')
 * // Returns: 35 (as of 2025)
 */
export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

/**
 * Formats a date of birth with age
 * @param dateOfBirth - Date of birth string
 * @returns Formatted string with date and age
 *
 * @example
 * formatDateOfBirth('1990-01-15')
 * // Returns: '15 Jan 1990 (35 years old)'
 */
export const formatDateOfBirth = (dateOfBirth: string): string => {
  if (!dateOfBirth) return 'N/A';

  try {
    const formattedDate = format(parseISO(dateOfBirth), 'd MMM yyyy');
    const age = calculateAge(dateOfBirth);
    return `${formattedDate} (${age} years old)`;
  } catch {
    return dateOfBirth;
  }
};

/**
 * Formats a relative time (e.g., "2 hours ago")
 * @param dateString - ISO date string
 * @returns Relative time string
 *
 * @example
 * formatRelativeTime('2024-10-10T10:00:00Z') // Current time: 12:00
 * // Returns: '2 hours ago'
 */
export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return formatDate(dateString, 'medium');
  } catch {
    return dateString;
  }
};
