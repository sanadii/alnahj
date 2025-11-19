import { CustomFile } from 'types/dropzone';

/**
 * Shared file upload utilities
 *
 * Migrated from: frontend/src/utils/getDropzoneData.ts
 * Used for: File upload handling, dropzone data processing
 */

/**
 * Processes file data for dropzone components
 * @param file - File object or URL string
 * @param index - Optional index for generating unique keys
 * @returns Processed file data with preview and metadata
 *
 * @example
 * // With File object
 * getDropzoneData(uploadedFile, 0)
 * // Returns: { key: 'filename-0', name: 'filename', size: 1024, preview: '...', ... }
 *
 * // With URL string
 * getDropzoneData('http://example.com/image.jpg', 0)
 * // Returns: { key: 'http://example.com/image.jpg-0', preview: 'http://example.com/image.jpg' }
 */
export function getDropzoneData(file: CustomFile | string, index?: number) {
  if (typeof file === 'string') {
    return {
      key: index !== undefined ? `${file}-${index}` : file,
      preview: file
    };
  }

  return {
    key: index !== undefined ? `${file.name}-${index}` : file.name,
    name: file.name,
    size: file.size,
    path: file.path,
    type: file.type,
    preview: file.preview,
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate
  };
}

/**
 * Formats file size to human-readable format
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted file size string
 *
 * @example
 * formatFileSize(1536)
 * // Returns: '1.50 KB'
 *
 * formatFileSize(1048576)
 * // Returns: '1.00 MB'
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Gets file extension from filename
 * @param filename - Name of the file
 * @returns File extension in lowercase
 *
 * @example
 * getFileExtension('document.pdf')
 * // Returns: 'pdf'
 *
 * getFileExtension('image.JPEG')
 * // Returns: 'jpeg'
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Checks if a file is an image based on extension
 * @param filename - Name of the file
 * @returns True if the file is an image
 *
 * @example
 * isImageFile('photo.jpg')
 * // Returns: true
 *
 * isImageFile('document.pdf')
 * // Returns: false
 */
export function isImageFile(filename: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
  const extension = getFileExtension(filename);
  return imageExtensions.includes(extension);
}

/**
 * Checks if a file is a document based on extension
 * @param filename - Name of the file
 * @returns True if the file is a document
 *
 * @example
 * isDocumentFile('report.pdf')
 * // Returns: true
 *
 * isDocumentFile('photo.jpg')
 * // Returns: false
 */
export function isDocumentFile(filename: string): boolean {
  const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
  const extension = getFileExtension(filename);
  return documentExtensions.includes(extension);
}

/**
 * Gets an icon name based on file type
 * @param filename - Name of the file
 * @returns Icon name for the file type
 *
 * @example
 * getFileIcon('document.pdf')
 * // Returns: 'pdf'
 *
 * getFileIcon('spreadsheet.xlsx')
 * // Returns: 'excel'
 */
export function getFileIcon(filename: string): string {
  const extension = getFileExtension(filename);

  const iconMap: Record<string, string> = {
    pdf: 'pdf',
    doc: 'word',
    docx: 'word',
    xls: 'excel',
    xlsx: 'excel',
    ppt: 'powerpoint',
    pptx: 'powerpoint',
    zip: 'archive',
    rar: 'archive',
    txt: 'text',
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    gif: 'image',
    svg: 'image'
  };

  return iconMap[extension] || 'file';
}

/**
 * Validates multiple files against size and count limits
 * @param files - Array of files to validate
 * @param maxFiles - Maximum number of files allowed
 * @param maxSizeMB - Maximum size per file in MB
 * @returns Validation result with error messages
 *
 * @example
 * validateFiles(uploadedFiles, 5, 10)
 * // Returns: { valid: true, errors: [] } or { valid: false, errors: ['Too many files'] }
 */
export function validateFiles(files: File[], maxFiles: number = 10, maxSizeMB: number = 10): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (files.length > maxFiles) {
    errors.push(`Maximum ${maxFiles} files allowed`);
  }

  files.forEach((file, index) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      errors.push(`File ${index + 1} (${file.name}) exceeds ${maxSizeMB}MB limit`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}
