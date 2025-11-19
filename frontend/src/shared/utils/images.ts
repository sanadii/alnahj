import config from '../../config';

/**
 * Shared image utilities
 *
 * Migrated from: frontend/src/utils/imageUtils.ts and frontend/src/utils/getImageUrl.ts
 * Used for: Image URL construction, validation, and asset handling
 */

export enum ImagePath {
  TESTAMENTS = 'testaments',
  USERS = 'users',
  ECOMMERCE = 'e-commerce',
  PROFILE = 'profile',
  BLOG = 'blog',
  CLIENTS = 'clients',
  BUSINESS_LOGOS = 'business_logos'
}

/**
 * Constructs a full URL for an image using the configured media URL
 * @param imagePath - The image path (e.g., "business_logos/logo.jpg" or "/media/business_logos/logo.jpg")
 * @returns The full URL to the image or null if no path provided
 *
 * @example
 * getFullImageUrl('business_logos/logo.jpg')
 * // Returns: 'http://127.0.0.1:8000/media/business_logos/logo.jpg'
 *
 * getFullImageUrl('http://example.com/image.jpg')
 * // Returns: 'http://example.com/image.jpg' (unchanged)
 */
export const getFullImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null;

  // If it's already a full URL or data URL, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }

  const mediaUrl = config.api.API_MEDIA;

  // Remove /media/ prefix if it exists in the path
  const cleanPath = imagePath.startsWith('/media/') ? imagePath.substring(7) : imagePath;

  return `${mediaUrl}${cleanPath}`;
};

/**
 * Gets a static image URL from the assets folder
 * @param name - Image filename
 * @param path - Path within assets/images
 * @returns The full URL to the static image
 *
 * @example
 * getImageUrl('avatar.png', 'profile')
 * // Returns: '/src/assets/images/profile/avatar.png'
 */
export function getImageUrl(name: string, path: string) {
  return new URL(`/src/assets/images/${path}/${name}`, import.meta.url).href;
}

/**
 * Validates if a file is a valid image
 * @param file - The file to validate
 * @returns True if the file is a valid image
 *
 * @example
 * isValidImageFile(uploadedFile)
 * // Returns: true (if JPEG, PNG, or GIF)
 */
export const isValidImageFile = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return allowedTypes.includes(file.type);
};

/**
 * Validates image file size
 * @param file - The file to validate
 * @param maxSizeMB - Maximum size in MB (default: 5)
 * @returns True if the file size is within limits
 *
 * @example
 * isValidImageSize(uploadedFile, 10)
 * // Returns: true (if file is less than 10MB)
 */
export const isValidImageSize = (file: File, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Validates both image type and size
 * @param file - The file to validate
 * @param maxSizeMB - Maximum size in MB (default: 5)
 * @returns Object with validation result and error message
 *
 * @example
 * validateImage(uploadedFile)
 * // Returns: { valid: true, error: null } or { valid: false, error: 'File too large' }
 */
export const validateImage = (file: File, maxSizeMB: number = 5): { valid: boolean; error: string | null } => {
  if (!isValidImageFile(file)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.'
    };
  }

  if (!isValidImageSize(file, maxSizeMB)) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit.`
    };
  }

  return { valid: true, error: null };
};

/**
 * Creates a preview URL for an uploaded image file
 * @param file - The file to preview
 * @returns The object URL for preview
 *
 * @example
 * const previewUrl = createImagePreview(uploadedFile);
 * // Returns: 'blob:http://localhost:3000/abc123...'
 * // Remember to revoke the URL when done: URL.revokeObjectURL(previewUrl)
 */
export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Gets initials from a name for avatar placeholder
 * @param name - Full name
 * @returns Initials (up to 2 characters)
 *
 * @example
 * getInitials('John Doe')
 * // Returns: 'JD'
 *
 * getInitials('Alice')
 * // Returns: 'A'
 */
export const getInitials = (name: string): string => {
  if (!name) return '';

  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Generates a color for avatar based on name
 * @param name - Full name
 * @returns Hex color code
 *
 * @example
 * getAvatarColor('John Doe')
 * // Returns: '#3f51b5' (consistent color for the same name)
 */
export const getAvatarColor = (name: string): string => {
  const colors = [
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#03a9f4',
    '#00bcd4',
    '#009688',
    '#4caf50',
    '#8bc34a',
    '#cddc39',
    '#ff9800',
    '#ff5722',
    '#795548',
    '#607d8b'
  ];

  if (!name) return colors[0];

  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  return colors[Math.abs(hash) % colors.length];
};
