import React, { forwardRef } from 'react';
import {
  TextField,
  FormControl,
  FormLabel,
  FormHelperText,
  InputAdornment,
  IconButton,
  Box,
  alpha,
  useTheme,
  SxProps,
  Theme
} from '@mui/material';
import { ReactNode } from 'react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

export interface FormFieldProps {
  label?: string;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  multiline?: boolean;
  rows?: number;
  maxRows?: number;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  size?: 'small' | 'medium';
  variant?: 'outlined' | 'filled' | 'standard';
  fullWidth?: boolean;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  showPasswordToggle?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  inputProps?: Record<string, any>;
  className?: string;
  sx?: SxProps<Theme>;
}

const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      label,
      placeholder,
      value,
      defaultValue,
      onChange,
      onBlur,
      onFocus,
      error = false,
      helperText,
      required = false,
      disabled = false,
      readOnly = false,
      multiline = false,
      rows,
      maxRows,
      type = 'text',
      size = 'medium',
      variant = 'outlined',
      fullWidth = true,
      startAdornment,
      endAdornment,
      showPasswordToggle = false,
      autoComplete,
      autoFocus = false,
      inputProps,
      className,
      sx,
      ...props
    },
    ref
  ) => {
    const theme = useTheme();
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event.target.value);
    };

    const handleFocus = () => {
      setIsFocused(true);
      onFocus?.();
    };

    const handleBlur = () => {
      setIsFocused(false);
      onBlur?.();
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const getInputType = () => {
      if (type === 'password' && showPasswordToggle) {
        return showPassword ? 'text' : 'password';
      }
      return type;
    };

    const getEndAdornment = () => {
      if (showPasswordToggle && type === 'password') {
        return (
          <InputAdornment position="end">
            <IconButton
              onClick={togglePasswordVisibility}
              edge="end"
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04)
                }
              }}
            >
              {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </IconButton>
          </InputAdornment>
        );
      }
      return endAdornment ? <InputAdornment position="end">{endAdornment}</InputAdornment> : undefined;
    };

    const fieldStyles: SxProps<Theme> = {
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        transition: theme.transitions.create(['border-color', 'box-shadow'], {
          duration: theme.transitions.duration.short
        }),
        '&:hover': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: error ? theme.palette.error.main : theme.palette.primary.main
          }
        },
        '&.Mui-focused': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
            borderWidth: 2
          }
        },
        '&.Mui-error': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.error.main
          }
        }
      },
      '& .MuiInputLabel-root': {
        fontWeight: 600,
        '&.Mui-focused': {
          color: error ? theme.palette.error.main : theme.palette.primary.main
        }
      },
      '& .MuiFormHelperText-root': {
        marginLeft: 0,
        marginTop: 0.5,
        fontSize: '0.75rem'
      },
      ...sx
    };

    return (
      <Box className={className} sx={{ width: fullWidth ? '100%' : 'auto' }}>
        <TextField
          ref={ref}
          label={label}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          error={error}
          helperText={helperText}
          required={required}
          disabled={disabled}
          InputProps={{
            readOnly,
            startAdornment: startAdornment ? <InputAdornment position="start">{startAdornment}</InputAdornment> : undefined,
            endAdornment: getEndAdornment(),
            ...inputProps
          }}
          multiline={multiline}
          rows={rows}
          maxRows={maxRows}
          type={getInputType()}
          size={size}
          variant={variant}
          fullWidth={fullWidth}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          sx={fieldStyles}
          {...props}
        />
      </Box>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;
