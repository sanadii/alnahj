import { useState, useMemo, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';

// icons
import { IconBuilding, IconMapPin, IconChevronDown, IconCheck, IconSearch, IconPhone, IconMail } from '@tabler/icons-react';

// project imports
import { setSelectedBusinessId, setSelectedLocationId } from 'store/business/actions';
import { RootState } from 'store';
import { Business, BusinessLocation } from 'types/business';

// ==============================|| HEADER BUSINESS & LOCATION SELECTOR ||============================== //

const STORAGE_KEY_BUSINESS = 'selectedBusinessId';
const STORAGE_KEY_LOCATION = 'selectedLocationId';

export default function BusinessLocationSection() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedBusinessId, setExpandedBusinessId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { businesses, locations, selectedBusinessId, selectedLocationId } = useSelector((state: RootState) => state.business);

  // ⚠️ IMPORTANT: All hooks must be called before any early returns!
  // Find selected business and location
  const selectedBusiness = useMemo(
    () => businesses.find((b: Business) => b.id === selectedBusinessId) || businesses[0],
    [businesses, selectedBusinessId]
  );

  // Filter locations for selected business
  const filteredLocations = useMemo(
    () => locations.filter((loc: BusinessLocation) => loc.business === selectedBusiness?.id),
    [locations, selectedBusiness]
  );

  const selectedLocation = useMemo(
    () => filteredLocations.find((l: BusinessLocation) => l.id === selectedLocationId) || filteredLocations[0],
    [filteredLocations, selectedLocationId]
  );

  // Load from localStorage on mount
  useEffect(() => {
    if (businesses.length > 0 && locations.length > 0) {
      const storedBusinessId = localStorage.getItem(STORAGE_KEY_BUSINESS);
      const storedLocationId = localStorage.getItem(STORAGE_KEY_LOCATION);

      if (storedBusinessId) {
        const businessId = parseInt(storedBusinessId, 10);
        const businessExists = businesses.find((b: Business) => b.id === businessId);

        if (businessExists) {
          dispatch(setSelectedBusinessId(businessId));

          if (storedLocationId) {
            const locationId = parseInt(storedLocationId, 10);
            const locationExists = locations.find((l: BusinessLocation) => l.id === locationId && l.business === businessId);

            if (locationExists) {
              dispatch(setSelectedLocationId(locationId));
            } else {
              // Location doesn't exist, select first one
              const businessLocations = locations.filter((loc: BusinessLocation) => loc.business === businessId);
              if (businessLocations.length > 0) {
                dispatch(setSelectedLocationId(businessLocations[0].id));
                localStorage.setItem(STORAGE_KEY_LOCATION, businessLocations[0].id.toString());
              }
            }
          } else {
            // No stored location, select first one
            const businessLocations = locations.filter((loc: BusinessLocation) => loc.business === businessId);
            if (businessLocations.length > 0) {
              dispatch(setSelectedLocationId(businessLocations[0].id));
              localStorage.setItem(STORAGE_KEY_LOCATION, businessLocations[0].id.toString());
            }
          }
        }
      } else if (!selectedBusinessId && businesses.length > 0) {
        // No stored selection, initialize with first business
        dispatch(setSelectedBusinessId(businesses[0].id));
        localStorage.setItem(STORAGE_KEY_BUSINESS, businesses[0].id.toString());

        const businessLocations = locations.filter((loc: BusinessLocation) => loc.business === businesses[0].id);
        if (businessLocations.length > 0) {
          dispatch(setSelectedLocationId(businessLocations[0].id));
          localStorage.setItem(STORAGE_KEY_LOCATION, businessLocations[0].id.toString());
        }
      }
    }
  }, [businesses, locations, dispatch, selectedBusinessId]);

  // Save to localStorage when selection changes
  useEffect(() => {
    if (selectedBusinessId) {
      localStorage.setItem(STORAGE_KEY_BUSINESS, selectedBusinessId.toString());
    }
  }, [selectedBusinessId]);

  useEffect(() => {
    if (selectedLocationId) {
      localStorage.setItem(STORAGE_KEY_LOCATION, selectedLocationId.toString());
    }
  }, [selectedLocationId]);

  // Get locations for each business with search filter
  const getBusinessLocations = useCallback(
    (businessId: number) => {
      const businessLocs = locations.filter((loc: BusinessLocation) => loc.business === businessId);

      if (!searchQuery) return businessLocs;

      const query = searchQuery.toLowerCase();
      return businessLocs.filter(
        (loc) =>
          loc.name.toLowerCase().includes(query) || loc.city?.toLowerCase().includes(query) || loc.address?.toLowerCase().includes(query)
      );
    },
    [locations, searchQuery]
  );

  // Filter businesses by search
  const filteredBusinesses = useMemo(() => {
    if (!searchQuery) return businesses;

    const query = searchQuery.toLowerCase();
    return businesses.filter((business: Business) => {
      const businessMatch = business.name.toLowerCase().includes(query) || business.industry?.toLowerCase().includes(query);
      const hasMatchingLocation = getBusinessLocations(business.id).length > 0;
      return businessMatch || hasMatchingLocation;
    });
  }, [businesses, searchQuery, getBusinessLocations]);

  // Total locations count
  const totalLocations = locations.length;

  // Now it's safe to do early returns after all hooks are called
  // Only show if user has multiple businesses
  if (businesses.length <= 1) {
    return null;
  }

  // Open/Close Menu
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    // Auto-expand current business to show its locations
    if (selectedBusinessId) {
      setExpandedBusinessId(selectedBusinessId);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setExpandedBusinessId(null);
    setSearchQuery(''); // Clear search on close
  };

  // Toggle business expansion to show/hide locations
  const handleBusinessClick = (businessId: number, event: React.MouseEvent) => {
    event.stopPropagation();

    if (expandedBusinessId === businessId) {
      // Clicking same business collapses it
      setExpandedBusinessId(null);
    } else {
      // Expand this business to show locations
      setExpandedBusinessId(businessId);
    }
  };

  // Select Location - This also selects the business
  const handleLocationSelect = (businessId: number, locationId: number) => {
    dispatch(setSelectedBusinessId(businessId));
    localStorage.setItem(STORAGE_KEY_BUSINESS, businessId.toString());
    dispatch(setSelectedLocationId(locationId));
    localStorage.setItem(STORAGE_KEY_LOCATION, locationId.toString());
    handleClose();
  };

  if (!selectedBusiness) {
    return null;
  }

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ display: { xs: 'none', md: 'block' }, ml: 1 }}>
      <Tooltip title="Switch Business or Location" arrow placement="bottom">
        <Badge
          badgeContent={totalLocations}
          color="primary"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.65rem',
              height: 18,
              minWidth: 18,
              top: 8,
              right: 8
            }
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClick}
            endIcon={
              <IconChevronDown
                size={16}
                style={{
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}
              />
            }
            sx={{
              height: 48,
              px: 2,
              borderRadius: '12px',
              borderWidth: 2,
              borderColor: open ? 'primary.main' : 'divider',
              color: 'text.primary',
              textTransform: 'none',
              minWidth: 220,
              justifyContent: 'space-between',
              background: open ? 'linear-gradient(135deg, rgba(103, 58, 183, 0.05), rgba(103, 58, 183, 0.02))' : 'transparent',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'primary.lighter',
                borderWidth: 2,
                transform: 'translateY(-1px)',
                boxShadow: theme.shadows[4]
              }
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  bgcolor: 'primary.main',
                  background: 'linear-gradient(135deg, #673ab7 0%, #9c27b0 100%)',
                  boxShadow: theme.shadows[2],
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <IconBuilding size={20} color="#fff" />
              </Box>
              <Stack spacing={0.25} alignItems="flex-start">
                <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 140, color: 'text.primary' }}>
                  {selectedBusiness.name}
                </Typography>
                {selectedLocation && (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <IconMapPin size={12} color={theme.palette.text.secondary} />
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 130 }}>
                      {selectedLocation.name}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Button>
        </Badge>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: 420,
            maxHeight: 600,
            mt: 1.5,
            boxShadow: theme.shadows[12],
            borderRadius: '16px',
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden'
          }
        }}
        TransitionProps={{
          timeout: 300
        }}
      >
        {/* Header with gradient */}
        <Box
          sx={{
            px: 3,
            py: 2,
            background: 'linear-gradient(135deg, #673ab7 0%, #9c27b0 100%)',
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" color="white" fontWeight={700} letterSpacing={0.5}>
                Switch Business & Location
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                {businesses.length} businesses · {totalLocations} locations
              </Typography>
            </Stack>
            <Chip
              label={`${businesses.length}/${totalLocations}`}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600,
                backdropFilter: 'blur(10px)'
              }}
            />
          </Stack>
        </Box>

        {/* Search Bar */}
        <Box sx={{ px: 2, py: 1.5, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search businesses or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={18} color={theme.palette.text.secondary} />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                bgcolor: 'grey.50',
                '&:hover': {
                  bgcolor: 'background.paper'
                },
                '&.Mui-focused': {
                  bgcolor: 'background.paper'
                }
              }
            }}
          />
        </Box>

        {/* Business List with Expandable Locations */}
        <Box
          sx={{
            maxHeight: 420,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px'
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: 'grey.50'
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'grey.300',
              borderRadius: '4px',
              '&:hover': {
                bgcolor: 'grey.400'
              }
            }
          }}
        >
          {filteredBusinesses.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No businesses or locations found
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Try a different search term
              </Typography>
            </Box>
          ) : (
            filteredBusinesses.map((business: Business, businessIndex: number) => {
              const businessLocations = getBusinessLocations(business.id);
              const isExpanded = expandedBusinessId === business.id;
              const isCurrent = business.id === selectedBusiness.id;

              return (
                <Box key={business.id}>
                  {/* Business Row */}
                  <MenuItem
                    onClick={(e) => handleBusinessClick(business.id, e)}
                    sx={{
                      py: 2,
                      px: 2.5,
                      bgcolor: isCurrent ? 'rgba(103, 58, 183, 0.08)' : 'transparent',
                      borderLeft: isCurrent ? '4px solid' : '4px solid transparent',
                      borderColor: isCurrent ? 'primary.main' : 'transparent',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: isCurrent ? 'rgba(103, 58, 183, 0.12)' : 'action.hover',
                        transform: 'translateX(2px)'
                      }
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 44,
                          height: 44,
                          borderRadius: '12px',
                          bgcolor: isCurrent ? 'primary.main' : 'grey.100',
                          background: isCurrent ? 'linear-gradient(135deg, #673ab7 0%, #9c27b0 100%)' : 'grey.100',
                          boxShadow: isCurrent ? theme.shadows[4] : 'none',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <IconBuilding size={22} color={isCurrent ? '#fff' : theme.palette.text.secondary} />
                      </Box>
                      <ListItemText
                        primary={business.name}
                        secondary={business.industry || 'No industry specified'}
                        primaryTypographyProps={{
                          variant: 'body2',
                          fontWeight: 700,
                          color: isCurrent ? 'primary.main' : 'text.primary'
                        }}
                        secondaryTypographyProps={{
                          variant: 'caption',
                          color: 'text.secondary',
                          fontWeight: 400
                        }}
                      />
                      <Stack direction="row" spacing={1} alignItems="center">
                        {businessLocations.length > 0 && (
                          <Chip
                            label={businessLocations.length}
                            size="small"
                            color={isCurrent ? 'primary' : 'default'}
                            sx={{
                              height: 24,
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              minWidth: 32
                            }}
                          />
                        )}
                        <IconChevronDown
                          size={18}
                          style={{
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease'
                          }}
                          color={isCurrent ? theme.palette.primary.main : theme.palette.text.secondary}
                        />
                      </Stack>
                    </Stack>
                  </MenuItem>

                  {/* Locations (Expanded inline) */}
                  {isExpanded && businessLocations.length > 0 && (
                    <Box
                      sx={{
                        bgcolor: 'rgba(103, 58, 183, 0.03)',
                        borderLeft: '4px solid',
                        borderColor: 'primary.main',
                        ml: 3,
                        mr: 2,
                        mb: 1.5,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: theme.shadows[1]
                      }}
                    >
                      {businessLocations.map((location: BusinessLocation, locIndex: number) => {
                        const isCurrentLocation = location.id === selectedLocationId && business.id === selectedBusinessId;

                        return (
                          <MenuItem
                            key={location.id}
                            onClick={() => handleLocationSelect(business.id, location.id)}
                            sx={{
                              py: 1.5,
                              px: 2.5,
                              bgcolor: isCurrentLocation ? 'rgba(103, 58, 183, 0.12)' : 'transparent',
                              borderBottom: locIndex < businessLocations.length - 1 ? '1px solid' : 'none',
                              borderColor: 'divider',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                bgcolor: isCurrentLocation ? 'rgba(103, 58, 183, 0.18)' : 'action.hover',
                                transform: 'translateX(4px)'
                              }
                            }}
                          >
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  minWidth: 32,
                                  height: 32,
                                  borderRadius: '8px',
                                  bgcolor: isCurrentLocation ? 'primary.main' : 'grey.200',
                                  transition: 'all 0.3s ease'
                                }}
                              >
                                <IconMapPin size={16} color={isCurrentLocation ? '#fff' : theme.palette.text.secondary} />
                              </Box>
                              <ListItemText
                                primary={
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography
                                      variant="body2"
                                      fontWeight={600}
                                      color={isCurrentLocation ? 'primary.main' : 'text.primary'}
                                    >
                                      {location.name}
                                    </Typography>
                                    {isCurrentLocation && (
                                      <Chip
                                        label="Active"
                                        size="small"
                                        color="primary"
                                        sx={{ height: 18, fontSize: '0.65rem', fontWeight: 600 }}
                                      />
                                    )}
                                  </Stack>
                                }
                                secondary={
                                  <Stack spacing={0.25} sx={{ mt: 0.5 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                      {[location.city, location.country].filter(Boolean).join(', ') || 'No address specified'}
                                    </Typography>
                                    <Stack direction="row" spacing={1.5} sx={{ mt: 0.5 }}>
                                      {location.phone && (
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                          <IconPhone size={12} color={theme.palette.text.disabled} />
                                          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
                                            {location.phone}
                                          </Typography>
                                        </Stack>
                                      )}
                                      {location.email && (
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                          <IconMail size={12} color={theme.palette.text.disabled} />
                                          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
                                            {location.email}
                                          </Typography>
                                        </Stack>
                                      )}
                                    </Stack>
                                  </Stack>
                                }
                              />
                              {isCurrentLocation && (
                                <IconCheck
                                  size={20}
                                  color={theme.palette.primary.main}
                                  style={{
                                    animation: 'fadeIn 0.3s ease'
                                  }}
                                />
                              )}
                            </Stack>
                          </MenuItem>
                        );
                      })}
                    </Box>
                  )}

                  {/* Divider between businesses */}
                  {businessIndex < filteredBusinesses.length - 1 && <Divider sx={{ my: 0.5 }} />}
                </Box>
              );
            })
          )}
        </Box>

        {/* Footer with gradient */}
        <Divider />
        <Box
          sx={{
            px: 3,
            py: 1.5,
            background: 'linear-gradient(90deg, rgba(103, 58, 183, 0.05) 0%, rgba(156, 39, 176, 0.05) 100%)',
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.7rem' }}>
              💡 Click a business to expand locations
            </Typography>
            <Chip
              icon={<IconMapPin size={14} />}
              label={`${totalLocations} Total`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem', height: 22 }}
            />
          </Stack>
        </Box>
      </Menu>
    </Box>
  );
}
