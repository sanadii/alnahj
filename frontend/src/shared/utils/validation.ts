import { NumbColorFunc, StringBoolFunc, StringNumFunc } from 'types';
import value from 'assets/scss/_themes-vars.module.scss';

/**
 * Shared validation utilities
 *
 * Migrated from: frontend/src/utils/password-strength.ts
 * Used for: Password validation, email validation, form validation
 */

// ======================== PASSWORD VALIDATION ========================

/**
 * Checks if string contains numbers
 * @param value - String to check
 * @returns True if contains numbers
 */
const hasNumber: StringBoolFunc = (value) => new RegExp(/[0-9]/).test(value);

/**
 * Checks if string has mix of lowercase and uppercase letters
 * @param value - String to check
 * @returns True if has mixed case
 */
const hasMixed: StringBoolFunc = (value) => new RegExp(/[a-z]/).test(value) && new RegExp(/[A-Z]/).test(value);

/**
 * Checks if string has special characters
 * @param value - String to check
 * @returns True if contains special characters
 */
const hasSpecial: StringBoolFunc = (value) => new RegExp(/[!#@$%^&*)(+=._-]/).test(value);

/**
 * Returns color based on password strength score
 * @param count - Strength score (0-5)
 * @returns Object with label and color
 *
 * @example
 * strengthColor(4)
 * // Returns: { label: 'Good', color: '#4caf50' }
 */
export const strengthColor: NumbColorFunc = (count) => {
  if (count < 2) return { label: 'Poor', color: value.errorMain };
  if (count < 3) return { label: 'Weak', color: value.warningDark };
  if (count < 4) return { label: 'Normal', color: value.orangeMain };
  if (count < 5) return { label: 'Good', color: value.successMain };
  if (count < 6) return { label: 'Strong', color: value.successDark };
  return { label: 'Poor', color: value.errorMain };
};

/**
 * Calculates password strength score
 * @param password - Password to evaluate
 * @returns Strength score (0-5)
 *
 * @example
 * strengthIndicator('Pass123!')
 * // Returns: 4 (Good)
 */
export const strengthIndicator: StringNumFunc = (password) => {
  let strengths = 0;
  if (password.length > 5) strengths += 1;
  if (password.length > 7) strengths += 1;
  if (hasNumber(password)) strengths += 1;
  if (hasSpecial(password)) strengths += 1;
  if (hasMixed(password)) strengths += 1;
  return strengths;
};

// ======================== EMAIL VALIDATION ========================

/**
 * Validates email format
 * @param email - Email address to validate
 * @returns True if email is valid
 *
 * @example
 * isValidEmail('user@example.com')
 * // Returns: true
 *
 * isValidEmail('invalid-email')
 * // Returns: false
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ======================== PHONE VALIDATION ========================

/**
 * Validates phone number format (Kuwait format)
 * @param phone - Phone number to validate
 * @returns True if phone is valid
 *
 * @example
 * isValidPhone('12345678')
 * // Returns: true (Kuwait: 8 digits)
 *
 * isValidPhone('123')
 * // Returns: false
 */
export const isValidPhone = (phone: string): boolean => {
  // Kuwait phone numbers are typically 8 digits
  const phoneRegex = /^\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validates mobile number format (Kuwait format)
 * @param mobile - Mobile number to validate
 * @returns True if mobile is valid
 *
 * @example
 * isValidMobile('55123456')
 * // Returns: true (starts with 5, 6, or 9)
 *
 * isValidMobile('12345678')
 * // Returns: false
 */
export const isValidMobile = (mobile: string): boolean => {
  // Kuwait mobile numbers start with 5, 6, or 9 and are 8 digits
  const mobileRegex = /^[569]\d{7}$/;
  return mobileRegex.test(mobile.replace(/\s/g, ''));
};

// ======================== TEXT VALIDATION ========================

/**
 * Validates if string contains only letters
 * @param text - Text to validate
 * @returns True if contains only letters
 *
 * @example
 * isAlphabetic('John')
 * // Returns: true
 *
 * isAlphabetic('John123')
 * // Returns: false
 */
export const isAlphabetic = (text: string): boolean => {
  return /^[a-zA-Z\s]+$/.test(text);
};

/**
 * Validates if string contains only letters and numbers
 * @param text - Text to validate
 * @returns True if contains only letters and numbers
 *
 * @example
 * isAlphanumeric('User123')
 * // Returns: true
 *
 * isAlphanumeric('User@123')
 * // Returns: false
 */
export const isAlphanumeric = (text: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(text);
};

// ======================== NUMBER VALIDATION ========================

/**
 * Validates if value is a positive number
 * @param value - Value to validate
 * @returns True if positive number
 *
 * @example
 * isPositiveNumber(10)
 * // Returns: true
 *
 * isPositiveNumber(-5)
 * // Returns: false
 */
export const isPositiveNumber = (value: number): boolean => {
  return typeof value === 'number' && value > 0;
};

/**
 * Validates if value is within a range
 * @param value - Value to validate
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns True if within range
 *
 * @example
 * isInRange(5, 1, 10)
 * // Returns: true
 *
 * isInRange(15, 1, 10)
 * // Returns: false
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

// ======================== FORM VALIDATION ========================

/**
 * Validates required field
 * @param value - Value to validate
 * @returns Error message or null if valid
 *
 * @example
 * validateRequired('')
 * // Returns: 'This field is required'
 *
 * validateRequired('John')
 * // Returns: null
 */
export const validateRequired = (value: any): string | null => {
  if (value === undefined || value === null || value === '') {
    return 'This field is required';
  }
  return null;
};

/**
 * Validates minimum length
 * @param value - Value to validate
 * @param minLength - Minimum length required
 * @returns Error message or null if valid
 *
 * @example
 * validateMinLength('Hi', 5)
 * // Returns: 'Minimum 5 characters required'
 *
 * validateMinLength('Hello', 5)
 * // Returns: null
 */
export const validateMinLength = (value: string, minLength: number): string | null => {
  if (value && value.length < minLength) {
    return `Minimum ${minLength} characters required`;
  }
  return null;
};

/**
 * Validates maximum length
 * @param value - Value to validate
 * @param maxLength - Maximum length allowed
 * @returns Error message or null if valid
 *
 * @example
 * validateMaxLength('This is a very long text', 10)
 * // Returns: 'Maximum 10 characters allowed'
 *
 * validateMaxLength('Short', 10)
 * // Returns: null
 */
export const validateMaxLength = (value: string, maxLength: number): string | null => {
  if (value && value.length > maxLength) {
    return `Maximum ${maxLength} characters allowed`;
  }
  return null;
};

/**
 * Combines multiple validation functions
 * @param value - Value to validate
 * @param validators - Array of validator functions
 * @returns First error message or null if all valid
 *
 * @example
 * validateField('ab', [
 *   (v) => validateRequired(v),
 *   (v) => validateMinLength(v, 5)
 * ])
 * // Returns: 'Minimum 5 characters required'
 */
export const validateField = (value: any, validators: Array<(value: any) => string | null>): string | null => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};
