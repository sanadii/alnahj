/**
 * Premium Filter Bar Component
 * Reusable filter section with modern design
 */

import React from 'react';

// material-ui
import { Box, TextField, InputAdornment, Button, Stack, Paper, Chip, IconButton, Tooltip, Typography, Fade } from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  FileDownload as ExportIcon,
  Add as AddIcon
} from '@mui/icons-material';

// ============================================================================
// TYPES
// ============================================================================

export interface FilterConfig {
  name: string;
  label: string;
  type: 'select' | 'text' | 'date' | 'autocomplete';
  value: any;
  onChange: (value: any) => void;
  options?: Array<{ value: string | number; label: string }>;
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface FilterBarProps {
  // Search
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: () => void;
  showSearch?: boolean;

  // Filters
  filters?: FilterConfig[];
  activeFiltersCount?: number;
  onClearFilters?: () => void;

  // Actions
  actions?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: 'contained' | 'outlined' | 'text';
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    disabled?: boolean;
    startIcon?: React.ReactNode;
  }>;

  // Layout
  dense?: boolean;
  elevation?: number;
  sx?: any;
}

// ============================================================================
// COMPONENT
// ============================================================================

const FilterBar: React.FC<FilterBarProps> = ({
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  onSearchSubmit,
  showSearch = true,
  filters = [],
  activeFiltersCount = 0,
  onClearFilters,
  actions = [],
  dense = false,
  elevation = 0,
  sx = {}
}) => {
  // Handle search key press
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearchSubmit) {
      onSearchSubmit();
    }
  };

  return (
    <Paper
      elevation={elevation}
      sx={{
        p: dense ? 2 : 2.5,
        mb: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        ...sx
      }}
    >
      <Stack spacing={2}>
        {/* Main Filter Row */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          {/* Search Field */}
          {showSearch && (
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 400px' }, minWidth: 0 }}>
              <TextField
                fullWidth
                size={dense ? 'small' : 'medium'}
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchValue && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => onSearchChange?.('')} edge="end">
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    bgcolor: 'background.paper',
                    borderRadius: 1.5,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main'
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
                    }
                  }
                }}
              />
            </Box>
          )}

          {/* Filters */}
          {filters.map((filter, index) => (
            <Box key={filter.name} sx={{ flex: { xs: '1 1 100%', md: '0 1 200px' }, minWidth: 0 }}>
              {filter.type === 'select' ? (
                <TextField
                  select
                  fullWidth
                  size={dense ? 'small' : 'medium'}
                  label={filter.label}
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  disabled={filter.disabled}
                  SelectProps={{
                    native: false
                  }}
                  sx={{
                    bgcolor: 'background.paper',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'divider'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main'
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 500
                    }
                  }}
                >
                  {filter.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              ) : (
                <TextField
                  fullWidth
                  size={dense ? 'small' : 'medium'}
                  label={filter.label}
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  disabled={filter.disabled}
                  placeholder={filter.placeholder}
                  sx={{
                    bgcolor: 'background.paper',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5
                    }
                  }}
                />
              )}
            </Box>
          ))}

          {/* Spacer */}
          <Box sx={{ flex: 1, minWidth: { xs: 0, md: 16 } }} />

          {/* Actions */}
          <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'contained'}
                color={action.color || 'primary'}
                onClick={action.onClick}
                disabled={action.disabled}
                startIcon={action.startIcon}
                size={dense ? 'medium' : 'large'}
                sx={{
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  boxShadow: action.variant === 'contained' ? 2 : 0,
                  '&:hover': {
                    boxShadow: action.variant === 'contained' ? 4 : 0,
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s'
                  }
                }}
              >
                {action.label}
              </Button>
            ))}
          </Stack>
        </Stack>

        {/* Active Filters Indicator */}
        {activeFiltersCount > 0 && (
          <Fade in>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
              </Typography>
              {onClearFilters && (
                <Chip
                  label="Clear all"
                  size="small"
                  onClick={onClearFilters}
                  onDelete={onClearFilters}
                  deleteIcon={<CloseIcon />}
                  sx={{
                    height: 24,
                    '& .MuiChip-deleteIcon': {
                      fontSize: 16
                    }
                  }}
                />
              )}
            </Box>
          </Fade>
        )}
      </Stack>
    </Paper>
  );
};

export default FilterBar;
