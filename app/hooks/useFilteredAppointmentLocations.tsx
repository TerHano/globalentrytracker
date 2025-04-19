import type { Location } from "~/api/location-api";

export const useFilteredAppointmentLocations = (
  locations: Location[],
  state?: string
) => {
  const filteredLocations = locations.filter((location) => {
    if (state) {
      return location.state === state;
    }
    return true;
  });
  return filteredLocations;
};
