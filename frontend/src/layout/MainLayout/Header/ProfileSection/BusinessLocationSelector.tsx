import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';

// icons
import { IconBuilding, IconMapPin, IconChevronDown, IconCheck } from '@tabler/icons-react';

// project imports
import { setSelectedBusinessId, setSelectedLocationId } from 'store/business/actions';
import { RootState } from 'store';
import { Business, BusinessLocation } from 'types/business';

// ==============================|| BUSINESS & LOCATION SELECTOR ||============================== //

export default function BusinessLocationSelector() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [businessAnchorEl, setBusinessAnchorEl] = useState<null | HTMLElement>(null);
  const [locationAnchorEl, setLocationAnchorEl] = useState<null | HTMLElement>(null);

  const { businesses, locations, selectedBusinessId, selectedLocationId } = useSelector((state: RootState) => state.business);

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

  // Open/Close Business Menu
  const handleBusinessClick = (event: React.MouseEvent<HTMLElement>) => {
    setBusinessAnchorEl(event.currentTarget);
  };

  const handleBusinessClose = () => {
    setBusinessAnchorEl(null);
  };

  // Open/Close Location Menu
  const handleLocationClick = (event: React.MouseEvent<HTMLElement>) => {
    setLocationAnchorEl(event.currentTarget);
  };

  const handleLocationClose = () => {
    setLocationAnchorEl(null);
  };

  // Select Business
  const handleBusinessSelect = (businessId: number) => {
    dispatch(setSelectedBusinessId(businessId));

    // Auto-select first location for this business
    const businessLocations = locations.filter((loc: BusinessLocation) => loc.business === businessId);
    if (businessLocations.length > 0) {
      dispatch(setSelectedLocationId(businessLocations[0].id));
    } else {
      dispatch(setSelectedLocationId(null));
    }

    handleBusinessClose();
  };

  // Select Location
  const handleLocationSelect = (locationId: number) => {
    dispatch(setSelectedLocationId(locationId));
    handleLocationClose();
  };

  if (!selectedBusiness) {
    return null;
  }

  return (
    <Stack spacing={1} sx={{ my: 2 }}>
      {/* Business Selector */}
      <Box>
        <Typography variant="caption" sx={{ mb: 0.5, display: 'block', color: 'text.secondary' }}>
          Business
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleBusinessClick}
          startIcon={<IconBuilding size={18} />}
          endIcon={<IconChevronDown size={16} />}
          sx={{
            justifyContent: 'space-between',
            textAlign: 'left',
            color: 'text.primary',
            borderColor: 'divider',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'primary.lighter'
            }
          }}
        >
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" noWrap>
              {selectedBusiness.name}
            </Typography>
          </Box>
        </Button>

        <Menu
          anchorEl={businessAnchorEl}
          open={Boolean(businessAnchorEl)}
          onClose={handleBusinessClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{
            sx: { width: 280, maxHeight: 400 }
          }}
        >
          {businesses.map((business: Business) => (
            <MenuItem key={business.id} selected={business.id === selectedBusiness.id} onClick={() => handleBusinessSelect(business.id)}>
              <ListItemText
                primary={business.name}
                secondary={business.industry || 'No industry'}
                primaryTypographyProps={{ variant: 'body2' }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
              {business.id === selectedBusiness.id && <IconCheck size={18} color={theme.palette.primary.main} />}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Location Selector */}
      {filteredLocations.length > 0 && (
        <Box>
          <Typography variant="caption" sx={{ mb: 0.5, display: 'block', color: 'text.secondary' }}>
            Location
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleLocationClick}
            startIcon={<IconMapPin size={18} />}
            endIcon={<IconChevronDown size={16} />}
            sx={{
              justifyContent: 'space-between',
              textAlign: 'left',
              color: 'text.primary',
              borderColor: 'divider',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'primary.lighter'
              }
            }}
          >
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="body2" noWrap>
                {selectedLocation?.name || 'Select Location'}
              </Typography>
            </Box>
            {filteredLocations.length > 1 && (
              <Chip label={filteredLocations.length} size="small" color="primary" sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} />
            )}
          </Button>

          <Menu
            anchorEl={locationAnchorEl}
            open={Boolean(locationAnchorEl)}
            onClose={handleLocationClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{
              sx: { width: 280, maxHeight: 400 }
            }}
          >
            {filteredLocations.map((location: BusinessLocation) => (
              <MenuItem key={location.id} selected={location.id === selectedLocation?.id} onClick={() => handleLocationSelect(location.id)}>
                <ListItemText
                  primary={location.name}
                  secondary={[location.city, location.country].filter(Boolean).join(', ') || 'No address'}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
                {location.id === selectedLocation?.id && <IconCheck size={18} color={theme.palette.primary.main} />}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      )}

      {filteredLocations.length === 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', py: 1 }}>
          No locations available for this business
        </Typography>
      )}

      <Divider sx={{ my: 1 }} />
    </Stack>
  );
}
