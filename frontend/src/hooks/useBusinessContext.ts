import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { Business, BusinessLocation } from 'types/business';

/**
 * Custom hook to access the current business and location context
 * Use this hook in any component that needs to know the selected business/location
 *
 * @example
 * ```tsx
 * const { selectedBusiness, selectedLocation, businessId, locationId } = useBusinessContext();
 *
 * // Use businessId in API calls
 * const appointments = await getAppointmentsApi({ business: businessId, location: locationId });
 * ```
 */
export default function useBusinessContext() {
  const { businesses, locations, selectedBusinessId, selectedLocationId } = useSelector((state: RootState) => state.business);

  const selectedBusiness = useMemo<Business | null>(
    () => businesses.find((b: Business) => b.id === selectedBusinessId) || businesses[0] || null,
    [businesses, selectedBusinessId]
  );

  const selectedLocation = useMemo<BusinessLocation | null>(
    () => locations.find((l: BusinessLocation) => l.id === selectedLocationId) || null,
    [locations, selectedLocationId]
  );

  // Filter locations for the selected business
  const businessLocations = useMemo<BusinessLocation[]>(
    () => locations.filter((loc: BusinessLocation) => loc.business === selectedBusiness?.id),
    [locations, selectedBusiness]
  );

  return {
    // Current selections
    selectedBusiness,
    selectedLocation,

    // IDs for API calls
    businessId: selectedBusiness?.id || null,
    locationId: selectedLocation?.id || null,

    // All available data
    businesses,
    locations,
    businessLocations,

    // Loading states
    hasMultipleBusinesses: businesses.length > 1,
    hasMultipleLocations: businessLocations.length > 1,

    // Helper flags
    isBusinessSelected: !!selectedBusiness,
    isLocationSelected: !!selectedLocation
  };
}
