/**
 * Premium Elector Filter Bar
 * Modern filter component with basic and advanced modes
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  Collapse,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  alpha,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import type { ElectorFilters } from 'types/electors';
import { getElectorFilterOptions } from 'helpers/api/electors';

interface ElectorFilterBarProps {
  filters: ElectorFilters;
  onFilterChange: (filters: ElectorFilters) => void;
  onSearch: () => void;
  onReset: () => void;
}

const ElectorFilterBar: React.FC<ElectorFilterBarProps> = ({ filters, onFilterChange, onSearch, onReset }) => {
  const theme = useTheme();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localFilters, setLocalFilters] = useState<ElectorFilters>(filters);
  const [areas, setAreas] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await getElectorFilterOptions();
        if (response.status === 'success' && response.data) {
          setAreas(response.data.areas || []);
          setDepartments(response.data.departments || []);
          setTeams(response.data.teams || []);
        }
      } catch (error) {
        console.error('Failed to fetch filter options:', error);
      }
    };
    fetchFilterOptions();
  }, []);

  // Sync local state when external filters change (e.g., reset)
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (field: keyof ElectorFilters, value: any) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearch = (value: string) => {
    handleFilterChange('search', value);
  };

  const handleReset = () => {
    const resetFilters: ElectorFilters = {
      search: '',
      gender: '',
      department: undefined,
      team: undefined,
      section: undefined,
      nameFirst: undefined,
      nameSecond: undefined,
      nameThird: undefined,
      nameFourth: undefined,
      subFamilyName: undefined,
      familyName: undefined,
      page: 1,
      pageSize: 25,
      area: undefined
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
    onReset();
  };

  const activeFiltersCount = [
    localFilters.search,
    localFilters.gender && localFilters.gender !== '',
    localFilters.area,
    localFilters.department,
    localFilters.team,
    localFilters.section,
    localFilters.nameFirst,
    localFilters.nameSecond,
    localFilters.nameThird,
    localFilters.nameFourth,
    localFilters.subFamilyName,
    localFilters.familyName
  ].filter(Boolean).length;

  return (
    <Paper
      elevation={isMobile ? 0 : 2}
      sx={{
        borderRadius: { xs: 0, sm: 3 },
        overflow: 'hidden',
        border: isMobile ? 'none' : '2px solid',
        borderColor: showAdvanced ? alpha(theme.palette.primary.main, 0.3) : alpha(theme.palette.divider, 0.2),
        background: showAdvanced
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : isMobile
            ? theme.palette.background.paper
            : `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.grey[50], 0.9)} 100%)`,
        backdropFilter: showAdvanced ? 'blur(20px)' : 'none',
        transition: 'all 0.3s ease',
        boxShadow: showAdvanced
          ? '0 12px 40px rgba(102, 126, 234, 0.25)'
          : isMobile
            ? 'none'
            : `0 4px 12px ${alpha(theme.palette.grey[500], 0.08)}`,
        position: 'relative'
      }}
    >
      {/* BASIC FILTER BAR */}
      <Box
        sx={{
          p: { xs: 0, md: 1.5 },
          background: showAdvanced ? 'rgba(255, 255, 255, 0.98)' : 'transparent',
          backdropFilter: showAdvanced ? 'blur(30px)' : 'none'
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', md: 'center' }}>
          {/* Search Input */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search by name, KOC ID, mobile..."
            value={localFilters.search || ''}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: localFilters.search && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => handleSearch('')}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2.5,
                bgcolor: 'background.paper',
                boxShadow: `0 2px 8px ${alpha(theme.palette.grey[500], 0.05)}`,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(theme.palette.primary.main, 0.15),
                  borderWidth: '1.5px'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.05)}`
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                  borderWidth: 2,
                  boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`
                }
              }
            }}
            sx={{ minWidth: { xs: '100%', md: 350 }, flex: 1 }}
          />

          {/* Action Buttons */}
          <Stack
            direction={{ xs: 'row', md: 'row' }}
            spacing={1}
            justifyContent={{ xs: 'space-between', md: 'flex-start' }}
            alignItems="center"
          >
            {/* Advanced Filters Toggle */}
            <Tooltip title={showAdvanced ? 'Hide Advanced Filters' : 'Show Advanced Filters'}>
              <Button
                variant={showAdvanced ? 'contained' : 'outlined'}
                startIcon={<FilterListIcon />}
                endIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                onClick={() => setShowAdvanced(!showAdvanced)}
                sx={{
                  borderRadius: 2,
                  minWidth: { xs: 'auto', md: 160 },
                  px: 2,
                  py: 0.8,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  width: { xs: '100%', md: 'auto' },
                  textTransform: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: showAdvanced
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : theme.palette.mode === 'dark'
                      ? alpha(theme.palette.common.white, 0.05)
                      : alpha(theme.palette.common.white, 0.9),
                  color: showAdvanced
                    ? 'white'
                    : theme.palette.mode === 'dark'
                      ? theme.palette.grey[100]
                      : theme.palette.primary.main,
                  borderColor: showAdvanced
                    ? 'transparent'
                    : alpha(theme.palette.primary.main, 0.35),
                  borderWidth: showAdvanced ? 0 : '1.5px',
                  boxShadow: showAdvanced
                    ? '0 8px 24px rgba(102, 126, 234, 0.35)'
                    : theme.palette.mode === 'dark'
                      ? `0 2px 10px ${alpha(theme.palette.common.black, 0.35)}`
                      : `0 2px 10px ${alpha(theme.palette.primary.main, 0.08)}`,
                  '&:hover': {
                    background: showAdvanced
                      ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                      : theme.palette.mode === 'dark'
                        ? alpha(theme.palette.common.white, 0.1)
                        : alpha(theme.palette.common.white, 1),
                    borderColor: alpha(theme.palette.primary.main, 0.6),
                    boxShadow: showAdvanced
                      ? '0 12px 32px rgba(102, 126, 234, 0.45)'
                      : theme.palette.mode === 'dark'
                        ? `0 4px 14px ${alpha(theme.palette.common.black, 0.45)}`
                        : `0 4px 14px ${alpha(theme.palette.primary.main, 0.18)}`,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Advanced Filters
                {activeFiltersCount > 0 && (
                  <Chip
                    label={activeFiltersCount}
                    size="small"
                    sx={{
                      ml: 1.5,
                      height: 22,
                      minWidth: 22,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      bgcolor: showAdvanced
                        ? 'rgba(255, 255, 255, 0.25)'
                        : theme.palette.mode === 'dark'
                          ? alpha(theme.palette.primary.main, 0.85)
                          : theme.palette.primary.main,
                      color: 'white',
                      boxShadow: showAdvanced
                        ? '0 2px 8px rgba(0, 0, 0, 0.15)'
                        : '0 2px 8px rgba(102, 126, 234, 0.3)',
                      animation: 'pulse 2s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.05)' }
                      }
                    }}
                  />
                )}
              </Button>
            </Tooltip>

            {/* Refresh */}
            <Tooltip title="Refresh Data">
              {isMobile ? (
                <IconButton
                  onClick={onSearch}
                  sx={{
                    bgcolor: alpha(theme.palette.success.main, 0.12),
                    color: 'success.main'
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              ) : (
                <Button
                  startIcon={<RefreshIcon />}
                  onClick={onSearch}
                  variant="outlined"
                  color="success"
                >
                  Refresh
                </Button>
              )}
            </Tooltip>

            {/* Clear All Button */}
            {isMobile ? (
              <Tooltip title="Clear All">
                <span>
                  <IconButton
                    onClick={handleReset}
                    disabled={activeFiltersCount === 0}
                    sx={{
                      bgcolor: alpha(theme.palette.error.main, 0.12),
                      color: 'error.main',
                      '&.Mui-disabled': {
                        opacity: 0.4
                      }
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </span>
              </Tooltip>
            ) : (
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleReset}
                disabled={activeFiltersCount === 0}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 0.8,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderColor: alpha(
                    theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[400],
                    0.5
                  ),
                  color:
                    theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.text.primary,
                  background:
                    theme.palette.mode === 'dark'
                      ? alpha(theme.palette.common.white, 0.04)
                      : alpha(theme.palette.common.white, 0.85),
                  boxShadow:
                    theme.palette.mode === 'dark'
                      ? `0 4px 12px ${alpha(theme.palette.common.black, 0.35)}`
                      : `0 4px 12px ${alpha(theme.palette.grey[500], 0.12)}`,
                  '&:hover': {
                    bgcolor:
                      theme.palette.mode === 'dark'
                        ? alpha(theme.palette.common.white, 0.1)
                        : alpha(theme.palette.common.white, 1),
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                    transform: 'translateY(-2px)',
                    boxShadow:
                      theme.palette.mode === 'dark'
                        ? `0 6px 16px ${alpha(theme.palette.common.black, 0.45)}`
                        : `0 6px 16px ${alpha(theme.palette.grey[500], 0.2)}`
                  },
                  '&.Mui-disabled': {
                    bgcolor:
                      theme.palette.mode === 'dark'
                        ? alpha(theme.palette.common.white, 0.04)
                        : alpha(theme.palette.common.white, 0.6),
                    borderColor: alpha(theme.palette.divider, 0.4),
                    color: alpha(theme.palette.text.primary, 0.4),
                    boxShadow: 'none'
                  }
                }}
              >
                Clear All
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>

      {/* ADVANCED FILTERS */}
      <Collapse in={showAdvanced} timeout={500}>
        <Box
          sx={{
            p: 2,
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(30px)',
            borderTop: '2px solid',
            borderColor: alpha(theme.palette.primary.main, 0.15)
          }}
        >
          <Stack spacing={2}>
            {/* Name Filters Section */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.04)} 0%, ${alpha(
                  theme.palette.primary.main,
                  0.08
                )} 100%)`,
                border: '1.5px solid',
                borderColor: alpha(theme.palette.primary.main, 0.2),
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: alpha(theme.palette.primary.main, 0.35),
                  boxShadow: `0 4px 18px ${alpha(theme.palette.primary.main, 0.12)}`
                }
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 2px 8px rgba(118, 75, 162, 0.35)'
                  }}
                />
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Name Filters
                </Typography>
              </Stack>

              <Grid container spacing={1.5}>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="First Name"
                    value={localFilters.nameFirst || ''}
                    onChange={(e) => handleFilterChange('nameFirst', e.target.value || undefined)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.background.paper, 0.85),
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'background.paper',
                          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.12)}`
                        },
                        '&.Mui-focused': {
                          bgcolor: 'background.paper',
                          boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Second Name"
                    value={localFilters.nameSecond || ''}
                    onChange={(e) => handleFilterChange('nameSecond', e.target.value || undefined)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.background.paper, 0.85),
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'background.paper',
                          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.12)}`
                        },
                        '&.Mui-focused': {
                          bgcolor: 'background.paper',
                          boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Third Name"
                    value={localFilters.nameThird || ''}
                    onChange={(e) => handleFilterChange('nameThird', e.target.value || undefined)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.background.paper, 0.85),
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'background.paper',
                          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.12)}`
                        },
                        '&.Mui-focused': {
                          bgcolor: 'background.paper',
                          boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Fourth Name"
                    value={localFilters.nameFourth || ''}
                    onChange={(e) => handleFilterChange('nameFourth', e.target.value || undefined)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.background.paper, 0.85),
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'background.paper',
                          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.12)}`
                        },
                        '&.Mui-focused': {
                          bgcolor: 'background.paper',
                          boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Sub-Family Name"
                    value={localFilters.subFamilyName || ''}
                    onChange={(e) => handleFilterChange('subFamilyName', e.target.value || undefined)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.background.paper, 0.85),
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'background.paper',
                          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.12)}`
                        },
                        '&.Mui-focused': {
                          bgcolor: 'background.paper',
                          boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Family Name"
                    value={localFilters.familyName || ''}
                    onChange={(e) => handleFilterChange('familyName', e.target.value || undefined)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.background.paper, 0.85),
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'background.paper',
                          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.12)}`
                        },
                        '&.Mui-focused': {
                          bgcolor: 'background.paper',
                          boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Department & Location Section */}
            <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: `linear-gradient(145deg, ${alpha(theme.palette.info.main, 0.04)} 0%, ${alpha(
              theme.palette.info.light,
              0.07
            )} 100%)`,
            border: '1.5px solid',
            borderColor: alpha(theme.palette.info.main, 0.16),
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: alpha(theme.palette.info.main, 0.35),
              boxShadow: `0 4px 16px ${alpha(theme.palette.info.main, 0.16)}`
            }
          }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
                    boxShadow: '0 2px 8px rgba(96, 165, 250, 0.35)'
                  }}
                />
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{
                    background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Department & Location
                </Typography>
              </Stack>
              <Grid container spacing={1}>
                <Grid size={{ xs: 4 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={localFilters.gender || ''}
                      onChange={(e) => handleFilterChange('gender', e.target.value)}
                      label="Gender"
                      sx={{
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.background.paper, 0.8),
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'background.paper',
                          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.12)}`
                        },
                        '&.Mui-focused': {
                          bgcolor: 'background.paper',
                          boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.15)}`
                        }
                      }}
                    >
                      <MenuItem value="">
                        <em>All</em>
                      </MenuItem>
                      <MenuItem value="MALE">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#3b82f6' }} />
                          <Typography>Male</Typography>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="FEMALE">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ec4899' }} />
                          <Typography>Female</Typography>
                        </Stack>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ fontSize: '0.875rem' }}>Department</InputLabel>
                    <Select
                      value={localFilters.department || ''}
                      onChange={(e) => handleFilterChange('department', e.target.value || undefined)}
                      label="Department"
                      sx={{
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.background.paper, 0.8),
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'background.paper',
                          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.12)}`
                        },
                        '&.Mui-focused': {
                          bgcolor: 'background.paper',
                          boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.15)}`
                        }
                      }}
                    >
                      <MenuItem value="">
                        <em>All Departments</em>
                      </MenuItem>
                      {departments.map((department) => (
                        <MenuItem key={department} value={department}>
                          {department}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 4 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ fontSize: '0.875rem' }}>Team</InputLabel>
                    <Select
                      value={localFilters.team || ''}
                      onChange={(e) => handleFilterChange('team', e.target.value || undefined)}
                      label="Team"
                      sx={{
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.background.paper, 0.8),
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'background.paper',
                          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.12)}`
                        },
                        '&.Mui-focused': {
                          bgcolor: 'background.paper',
                          boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.15)}`
                        }
                      }}
                    >
                      <MenuItem value="">
                        <em>All Teams</em>
                      </MenuItem>
                      {teams.map((team) => (
                        <MenuItem key={team} value={team}>
                          {team}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Area and Section removed */}
              </Grid>
            </Box>

            {/* Active Filters Summary */}
            {activeFiltersCount > 0 && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: `linear-gradient(145deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(
                    theme.palette.success.main,
                    0.08
                  )} 100%)`,
                  border: '1.5px solid',
                  borderColor: alpha(theme.palette.success.main, 0.2),
                  boxShadow: `0 2px 12px ${alpha(theme.palette.success.main, 0.12)}`
                }}
              >
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
                  <Chip
                    label={`${activeFiltersCount} Active Filter${activeFiltersCount > 1 ? 's' : ''}`}
                    size="small"
                    color="success"
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      height: 28,
                      mr: 1,
                      boxShadow: `0 2px 8px ${alpha(theme.palette.success.main, 0.2)}`
                    }}
                  />
                  {localFilters.search && (
                    <Chip
                      label={`Search: "${localFilters.search}"`}
                      size="small"
                      onDelete={() => handleSearch('')}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {localFilters.gender && (
                    <Chip
                      label={`Gender: ${localFilters.gender}`}
                      size="small"
                      onDelete={() => handleFilterChange('gender', '')}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {localFilters.area && (
                    <Chip
                      label={`Area: ${localFilters.area}`}
                      size="small"
                      onDelete={() => handleFilterChange('area', undefined)}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {localFilters.department && (
                    <Chip
                      label={`Department: ${localFilters.department}`}
                      onDelete={() => handleFilterChange('department', undefined)}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {localFilters.team && (
                    <Chip
                      label={`Team: ${localFilters.team}`}
                      onDelete={() => handleFilterChange('team', undefined)}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {localFilters.section && (
                    <Chip
                      label={`Section: ${localFilters.section}`}
                      size="small"
                      onDelete={() => handleFilterChange('section', undefined)}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {localFilters.nameFirst && (
                    <Chip
                      label={`First: ${localFilters.nameFirst}`}
                      size="small"
                      onDelete={() => handleFilterChange('nameFirst', undefined)}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {localFilters.nameSecond && (
                    <Chip
                      label={`Second: ${localFilters.nameSecond}`}
                      size="small"
                      onDelete={() => handleFilterChange('nameSecond', undefined)}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {localFilters.nameThird && (
                    <Chip
                      label={`Third: ${localFilters.nameThird}`}
                      size="small"
                      onDelete={() => handleFilterChange('nameThird', undefined)}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {localFilters.nameFourth && (
                    <Chip
                      label={`Fourth: ${localFilters.nameFourth}`}
                      size="small"
                      onDelete={() => handleFilterChange('nameFourth', undefined)}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {localFilters.subFamilyName && (
                    <Chip
                      label={`Sub-Family: ${localFilters.subFamilyName}`}
                      size="small"
                      onDelete={() => handleFilterChange('subFamilyName', undefined)}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {localFilters.familyName && (
                    <Chip
                      label={`Family: ${localFilters.familyName}`}
                      size="small"
                      onDelete={() => handleFilterChange('familyName', undefined)}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Stack>
              </Box>
            )}
          </Stack>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default ElectorFilterBar;
