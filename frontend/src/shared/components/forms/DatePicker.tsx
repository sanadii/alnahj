import React, { useState } from 'react';
import {
  TextField,
  Box,
  Popover,
  alpha,
  useTheme,
  SxProps,
  Theme,
  IconButton,
  InputAdornment,
  Typography,
  Grid,
  Button
} from '@mui/material';
import { IconCalendar, IconX, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import {
  format,
  parse,
  isValid,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns';

export interface DatePickerProps {
  label?: string;
  placeholder?: string;
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  size?: 'small' | 'medium';
  variant?: 'outlined' | 'filled' | 'standard';
  fullWidth?: boolean;
  format?: string;
  minDate?: Date;
  maxDate?: Date;
  disablePast?: boolean;
  disableFuture?: boolean;
  clearable?: boolean;
  autoFocus?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  placeholder = 'Select date',
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
  size = 'medium',
  variant = 'outlined',
  fullWidth = true,
  format: dateFormat = 'MM/dd/yyyy',
  minDate,
  maxDate,
  disablePast = false,
  disableFuture = false,
  clearable = true,
  autoFocus = false,
  className,
  sx
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);

  const open = Boolean(anchorEl);

  // Initialize input value from props
  React.useEffect(() => {
    if (value) {
      setInputValue(format(value, dateFormat));
    } else if (defaultValue) {
      setInputValue(format(defaultValue, dateFormat));
    } else {
      setInputValue('');
    }
  }, [value, defaultValue, dateFormat]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    // Try to parse the input value
    const parsedDate = parse(newValue, dateFormat, new Date());
    if (isValid(parsedDate)) {
      onChange?.(parsedDate);
    } else if (newValue === '') {
      onChange?.(null);
    }
  };

  const handleInputFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    setIsFocused(true);
    if (!readOnly && !disabled) {
      setAnchorEl(event.currentTarget);
    }
    onFocus?.();
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleDateSelect = (selectedDate: Date | null) => {
    if (selectedDate) {
      setInputValue(format(selectedDate, dateFormat));
      onChange?.(selectedDate);
    } else {
      setInputValue('');
      onChange?.(null);
    }
    setAnchorEl(null);
  };

  const handleClear = () => {
    setInputValue('');
    onChange?.(null);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const isDateDisabled = (date: Date) => {
    if (disablePast && date < new Date()) return true;
    if (disableFuture && date > new Date()) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
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
        label={label}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        error={error}
        helperText={helperText}
        required={required}
        disabled={disabled}
        InputProps={{
          readOnly,
          startAdornment: (
            <InputAdornment position="start">
              <IconCalendar size={20} color={theme.palette.text.secondary} />
            </InputAdornment>
          ),
          endAdornment:
            clearable && inputValue && !disabled && !readOnly ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClear}
                  size="small"
                  sx={{
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04)
                    }
                  }}
                >
                  <IconX size={16} />
                </IconButton>
              </InputAdornment>
            ) : undefined
        }}
        size={size}
        variant={variant}
        fullWidth={fullWidth}
        autoFocus={autoFocus}
        sx={fieldStyles}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            boxShadow: theme.shadows[8],
            border: `1px solid ${theme.palette.divider}`
          }
        }}
      >
        <Box sx={{ p: 2, minWidth: 300 }}>
          <CustomCalendar
            value={value}
            onChange={handleDateSelect}
            disablePast={disablePast}
            disableFuture={disableFuture}
            minDate={minDate}
            maxDate={maxDate}
            isDateDisabled={isDateDisabled}
          />
        </Box>
      </Popover>
    </Box>
  );
};

// Custom Calendar Component
interface CustomCalendarProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  disablePast?: boolean;
  disableFuture?: boolean;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  value,
  onChange,
  disablePast = false,
  disableFuture = false,
  minDate,
  maxDate,
  isDateDisabled
}) => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(value || new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled?.(date)) return;
    onChange?.(date);
  };

  const isDateDisabledCheck = (date: Date) => {
    if (disablePast && date < new Date()) return true;
    if (disableFuture && date > new Date()) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return isDateDisabled?.(date) || false;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <IconButton onClick={handlePrevMonth} size="small">
          <IconChevronLeft size={20} />
        </IconButton>
        <Typography variant="h6" fontWeight={600}>
          {format(currentMonth, 'MMMM yyyy')}
        </Typography>
        <IconButton onClick={handleNextMonth} size="small">
          <IconChevronRight size={20} />
        </IconButton>
      </Box>

      {/* Week Days */}
      <Grid container spacing={0} sx={{ mb: 1 }}>
        {weekDays.map((day) => (
          <Grid item xs key={day}>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                fontWeight: 600,
                color: theme.palette.text.secondary,
                py: 1
              }}
            >
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* Calendar Days */}
      <Grid container spacing={0}>
        {daysInMonth.map((date) => {
          const isSelected = value && isSameDay(date, value);
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isDisabled = isDateDisabledCheck(date);

          return (
            <Grid item xs key={date.toISOString()}>
              <Button
                onClick={() => handleDateClick(date)}
                disabled={isDisabled}
                sx={{
                  minWidth: 'auto',
                  width: '100%',
                  height: 36,
                  borderRadius: 1,
                  color: isSelected
                    ? theme.palette.primary.contrastText
                    : isCurrentMonth
                      ? theme.palette.text.primary
                      : theme.palette.text.disabled,
                  backgroundColor: isSelected ? theme.palette.primary.main : 'transparent',
                  '&:hover': {
                    backgroundColor: isSelected ? theme.palette.primary.dark : alpha(theme.palette.primary.main, 0.08)
                  },
                  '&:disabled': {
                    color: theme.palette.text.disabled,
                    backgroundColor: 'transparent'
                  }
                }}
              >
                {format(date, 'd')}
              </Button>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default DatePicker;
