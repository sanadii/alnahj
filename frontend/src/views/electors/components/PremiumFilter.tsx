/**
 * Premium Filter Component for Electors List
 * Advanced filtering with modern UI
 */

import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Collapse,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { FilterList as FilterIcon, Close as CloseIcon, Refresh as RefreshIcon, Search as SearchIcon } from '@mui/icons-material';
import type { ElectorFilters } from 'types/electors';

interface PremiumFilterProps {
  filters: ElectorFilters;
  onFilterChange: (filters: ElectorFilters) => void;
  onSearch: () => void;
  onReset: () => void;
}

const PremiumFilter: React.FC<PremiumFilterProps> = ({ filters, onFilterChange, onSearch, onReset }) => {
  const [expanded, setExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<ElectorFilters>(filters);

  const handleFilterChange = (field: keyof ElectorFilters, value: any) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    onSearch();
  };

  const handleReset = () => {
    const resetFilters: ElectorFilters = {
      search: '',
      gender: '',
      committee: undefined,
      team: undefined,
      section: undefined,
      page: 1,
      pageSize: 25
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
    onReset();
  };

  const activeFiltersCount = [
    localFilters.search,
    localFilters.gender,
    localFilters.committee,
    localFilters.team,
    localFilters.section
  ].filter(Boolean).length;

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        background: expanded ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' : 'transparent'
      }}
    >
      {/* Filter Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          background: expanded ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
          backdropFilter: expanded ? 'blur(10px)' : 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.5)'
          }
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}
          >
            <FilterIcon sx={{ color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Advanced Filters
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {activeFiltersCount > 0 ? `${activeFiltersCount} filter(s) active` : 'Click to expand filters'}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          {activeFiltersCount > 0 && (
            <Chip
              label={activeFiltersCount}
              size="small"
              color="primary"
              sx={{
                height: 24,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            />
          )}
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }}
          >
            <FilterIcon />
          </IconButton>
        </Stack>
      </Box>

      {/* Filter Content */}
      <Collapse in={expanded}>
        <Box sx={{ p: 3, pt: 2, background: 'rgba(255, 255, 255, 0.95)' }}>
          <Grid container spacing={2}>
            {/* Search Field */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Search"
                placeholder="KOC ID, name, mobile..."
                value={localFilters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'white'
                  }
                }}
              />
            </Grid>

            {/* Gender Filter */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={localFilters.gender || ''}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                  label="Gender"
                  sx={{ background: 'white' }}
                >
                  <MenuItem value="">All Genders</MenuItem>
                  <MenuItem value="MALE">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
                      Male
                    </Box>
                  </MenuItem>
                  <MenuItem value="FEMALE">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'secondary.main' }} />
                      Female
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Team Filter */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                label="Team"
                placeholder="Filter by team..."
                value={localFilters.team || ''}
                onChange={(e) => handleFilterChange('team', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'white'
                  }
                }}
              />
            </Grid>

            {/* Section Filter */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                label="Section"
                placeholder="Filter by section..."
                value={localFilters.section || ''}
                onChange={(e) => handleFilterChange('section', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'white'
                  }
                }}
              />
            </Grid>

            {/* Committee Filter */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Committee</InputLabel>
                <Select
                  value={localFilters.committee || ''}
                  onChange={(e) => handleFilterChange('committee', e.target.value ? Number(e.target.value) : undefined)}
                  label="Committee"
                  sx={{ background: 'white' }}
                  disabled
                >
                  <MenuItem value="">All Committees</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleReset}
              sx={{
                borderColor: 'divider',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'primary.main',
                  background: 'rgba(102, 126, 234, 0.05)'
                }
              }}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleApplyFilters}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)'
                }
              }}
            >
              Apply Filters
            </Button>
          </Stack>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Active Filters:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {localFilters.search && (
                  <Chip
                    label={`Search: "${localFilters.search}"`}
                    size="small"
                    onDelete={() => handleFilterChange('search', '')}
                    sx={{ background: 'rgba(102, 126, 234, 0.1)' }}
                  />
                )}
                {localFilters.gender && (
                  <Chip
                    label={`Gender: ${localFilters.gender}`}
                    size="small"
                    onDelete={() => handleFilterChange('gender', '')}
                    sx={{ background: 'rgba(102, 126, 234, 0.1)' }}
                  />
                )}
                {localFilters.team && (
                  <Chip
                    label={`Team: ${localFilters.team}`}
                    size="small"
                    onDelete={() => handleFilterChange('team', '')}
                    sx={{ background: 'rgba(102, 126, 234, 0.1)' }}
                  />
                )}
                {localFilters.section && (
                  <Chip
                    label={`Section: ${localFilters.section}`}
                    size="small"
                    onDelete={() => handleFilterChange('section', '')}
                    sx={{ background: 'rgba(102, 126, 234, 0.1)' }}
                  />
                )}
                {localFilters.committee && (
                  <Chip
                    label={`Committee: ${localFilters.committee}`}
                    size="small"
                    onDelete={() => handleFilterChange('committee', undefined)}
                    sx={{ background: 'rgba(102, 126, 234, 0.1)' }}
                  />
                )}
              </Stack>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default PremiumFilter;
