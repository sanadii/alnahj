import React from 'react';
import { Box, TextField, InputAdornment, Button, Stack, IconButton, alpha, useTheme, SxProps, Theme } from '@mui/material';
import { IconSearch, IconFilter, IconLayoutGrid, IconList, IconRefresh, IconDownload, IconPrinter } from '@tabler/icons-react';

export interface FilterOption {
  key: string;
  label: string;
  options: Array<{ value: string | number; label: string }>;
  value?: string | number;
  onChange?: (value: string | number) => void;
}

export interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: FilterOption[];
  onFilterChange?: (filters: Record<string, any>) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  actions?: React.ReactNode;
  placeholder?: string;
  showRefresh?: boolean;
  onRefresh?: () => void;
  className?: string;
  sx?: SxProps<Theme>;
}

/**
 * SearchFilterBar - A comprehensive search and filter component
 *
 * Features:
 * - Search input with icon
 * - Filter buttons
 * - View mode toggle (grid/list)
 * - Action buttons
 * - Refresh functionality
 * - Responsive design
 *
 * @example
 * ```tsx
 * <SearchFilterBar
 *   searchValue={searchValue}
 *   onSearchChange={setSearchValue}
 *   filters={filterOptions}
 *   onFilterChange={handleFilterChange}
 *   viewMode={viewMode}
 *   onViewModeChange={setViewMode}
 *   actions={<Button>Export</Button>}
 *   showRefresh
 *   onRefresh={handleRefresh}
 * />
 * ```
 */
const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchValue,
  onSearchChange,
  filters = [],
  onFilterChange,
  viewMode = 'list',
  onViewModeChange,
  actions,
  placeholder = 'Search...',
  showRefresh = false,
  onRefresh,
  className,
  sx
}) => {
  const theme = useTheme();

  const handleFilterChange = (key: string, value: string | number) => {
    const newFilters = { ...filters.reduce((acc, filter) => ({ ...acc, [filter.key]: filter.value }), {}), [key]: value };
    onFilterChange?.(newFilters);
  };

  const containerStyles: SxProps<Theme> = {
    p: 2,
    borderRadius: 2,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    border: `1px solid ${alpha(theme.palette.grey[200], 0.8)}`,
    ...sx
  };

  return (
    <Box className={className} sx={containerStyles}>
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
        {/* Search Input */}
        <TextField
          size="small"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch size={20} />
              </InputAdornment>
            )
          }}
          sx={{ minWidth: 200, flex: 1 }}
        />

        {/* Filters */}
        {filters.map((filter) => (
          <Button key={filter.key} size="small" variant="outlined" startIcon={<IconFilter size={16} />} sx={{ minWidth: 120 }}>
            {filter.label}
          </Button>
        ))}

        {/* View Mode Toggle */}
        {onViewModeChange && (
          <Stack direction="row" spacing={0.5}>
            <IconButton
              size="small"
              onClick={() => onViewModeChange('list')}
              sx={{
                color: viewMode === 'list' ? 'primary.main' : 'text.secondary',
                backgroundColor: viewMode === 'list' ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
              }}
            >
              <IconList size={16} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onViewModeChange('grid')}
              sx={{
                color: viewMode === 'grid' ? 'primary.main' : 'text.secondary',
                backgroundColor: viewMode === 'grid' ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
              }}
            >
              <IconLayoutGrid size={16} />
            </IconButton>
          </Stack>
        )}

        {/* Refresh Button */}
        {showRefresh && onRefresh && (
          <IconButton size="small" onClick={onRefresh}>
            <IconRefresh size={16} />
          </IconButton>
        )}

        {/* Actions */}
        {actions && (
          <Stack direction="row" spacing={1}>
            {actions}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default SearchFilterBar;
