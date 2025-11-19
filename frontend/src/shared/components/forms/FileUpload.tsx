import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  alpha,
  useTheme,
  SxProps,
  Theme,
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip
} from '@mui/material';
import { IconUpload, IconX, IconFile, IconPhoto, IconFileText, IconFileTypePdf } from '@tabler/icons-react';

export interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  onFilesChange?: (files: File[]) => void;
  onFileRemove?: (file: File) => void;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  variant?: 'dropzone' | 'button' | 'compact';
  showPreview?: boolean;
  showProgress?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
}

interface FileWithProgress extends File {
  id: string;
  progress?: number;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label = 'Upload Files',
  accept = '*/*',
  multiple = false,
  maxFiles = 5,
  maxSize = 10, // 10MB
  onFilesChange,
  onFileRemove,
  disabled = false,
  required = false,
  error = false,
  helperText,
  variant = 'dropzone',
  showPreview = true,
  showProgress = false,
  className,
  sx
}) => {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const getFileIcon = (file: File) => {
    const type = file.type.toLowerCase();
    if (type.startsWith('image/')) return <IconPhoto size={20} />;
    if (type === 'application/pdf') return <IconFileTypePdf size={20} />;
    if (type.startsWith('text/')) return <IconFileText size={20} />;
    return <IconFile size={20} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }
    return null;
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: FileWithProgress[] = [];
    const fileArray = Array.from(selectedFiles);

    // Check max files limit
    if (files.length + fileArray.length > maxFiles) {
      // Handle error - could show a toast or set error state
      return;
    }

    fileArray.forEach((file) => {
      const error = validateFile(file);
      const fileWithProgress: FileWithProgress = {
        ...file,
        id: Math.random().toString(36).substr(2, 9),
        error,
        progress: showProgress ? 0 : undefined
      };
      newFiles.push(fileWithProgress);
    });

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);

    // Simulate progress if showProgress is true
    if (showProgress) {
      newFiles.forEach((file) => {
        simulateUpload(file);
      });
    }
  };

  const simulateUpload = (file: FileWithProgress) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }

      setFiles((prevFiles) => prevFiles.map((f) => (f.id === file.id ? { ...f, progress } : f)));
    }, 200);
  };

  const handleFileRemove = (fileToRemove: FileWithProgress) => {
    const updatedFiles = files.filter((file) => file.id !== fileToRemove.id);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
    onFileRemove?.(fileToRemove);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!disabled) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const getVariantStyles = (): SxProps<Theme> => {
    const baseStyles = {
      border: `2px dashed ${error ? theme.palette.error.main : theme.palette.divider}`,
      borderRadius: 2,
      transition: theme.transitions.create(['border-color', 'background-color'], {
        duration: theme.transitions.duration.short
      }),
      '&:hover': !disabled
        ? {
            borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.main, 0.02)
          }
        : {}
    };

    switch (variant) {
      case 'button':
        return {
          ...baseStyles,
          border: 'none',
          backgroundColor: 'transparent',
          '&:hover': !disabled
            ? {
                backgroundColor: alpha(theme.palette.primary.main, 0.04)
              }
            : {}
        };
      case 'compact':
        return {
          ...baseStyles,
          minHeight: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        };
      case 'dropzone':
      default:
        return {
          ...baseStyles,
          minHeight: 120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer'
        };
    }
  };

  const dropzoneStyles: SxProps<Theme> = {
    ...getVariantStyles(),
    backgroundColor: isDragOver && !disabled ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
    borderColor: isDragOver && !disabled ? theme.palette.primary.main : error ? theme.palette.error.main : theme.palette.divider,
    opacity: disabled ? 0.6 : 1,
    ...sx
  };

  return (
    <Box className={className} sx={{ width: '100%' }}>
      {label && (
        <Typography
          variant="body2"
          sx={{
            mb: 1,
            fontWeight: 600,
            color: error ? theme.palette.error.main : theme.palette.text.primary
          }}
        >
          {label}
          {required && <span style={{ color: theme.palette.error.main }}> *</span>}
        </Typography>
      )}

      <Box
        sx={dropzoneStyles}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={variant === 'dropzone' ? handleButtonClick : undefined}
      >
        {variant === 'dropzone' && (
          <>
            <IconUpload size={32} color={isDragOver ? theme.palette.primary.main : theme.palette.text.secondary} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              {isDragOver ? 'Drop files here' : 'Drag & drop files here or click to browse'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              Max {maxFiles} files, {maxSize}MB each
            </Typography>
          </>
        )}

        {variant === 'button' && (
          <Button
            variant="outlined"
            startIcon={<IconUpload size={16} />}
            onClick={handleButtonClick}
            disabled={disabled}
            sx={{ textTransform: 'none' }}
          >
            {label}
          </Button>
        )}

        {variant === 'compact' && (
          <Button
            variant="text"
            startIcon={<IconUpload size={16} />}
            onClick={handleButtonClick}
            disabled={disabled}
            sx={{ textTransform: 'none' }}
          >
            Upload Files
          </Button>
        )}
      </Box>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFileSelect(e.target.files)}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {showPreview && files.length > 0 && (
        <List sx={{ mt: 2 }}>
          {files.map((file) => (
            <ListItem
              key={file.id}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                mb: 1,
                backgroundColor: file.error ? alpha(theme.palette.error.main, 0.04) : 'transparent'
              }}
            >
              <ListItemIcon>{getFileIcon(file)}</ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {formatFileSize(file.size)}
                    </Typography>
                    {file.error && (
                      <Typography variant="caption" color="error" sx={{ display: 'block' }}>
                        {file.error}
                      </Typography>
                    )}
                    {showProgress && file.progress !== undefined && (
                      <Box sx={{ mt: 1 }}>
                        <LinearProgress variant="determinate" value={file.progress} color={file.error ? 'error' : 'primary'} />
                        <Typography variant="caption" color="text.secondary">
                          {file.progress}%
                        </Typography>
                      </Box>
                    )}
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleFileRemove(file)} disabled={disabled} size="small">
                  <IconX size={16} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {helperText && (
        <Typography variant="caption" color={error ? 'error' : 'text.secondary'} sx={{ mt: 1, display: 'block' }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default FileUpload;
