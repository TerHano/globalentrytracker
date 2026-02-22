import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "~/api/query-keys";
import type { components } from "~/types/api";

export type TrackedLocation =
  components["schemas"]["TrackedLocationForUserDtoApiResponse"]["data"];

/**
 * Creates an optimistic update for toggling a tracker's enabled status
 * Returns functions to apply and revert the optimistic update
 */
export function useOptimisticTrackerToggle(trackerId: number) {
  const queryClient = useQueryClient();

  return {
    applyOptimisticUpdate: (newEnabledStatus: boolean) => {
      // Store the previous data for rollback
      const previousData = queryClient.getQueryData(
        QUERY_KEYS.TRACKED_LOCATIONS
      );

      // Update the tracked locations list
      queryClient.setQueryData(QUERY_KEYS.TRACKED_LOCATIONS, (old: unknown) => {
        if (!Array.isArray(old)) return old;
        return old.map((tracker: unknown) => {
          const typedTracker = tracker as { id?: number; enabled?: boolean };
          if (typedTracker.id === trackerId) {
            return { ...typedTracker, enabled: newEnabledStatus };
          }
          return typedTracker;
        });
      });

      return previousData;
    },

    revertOptimisticUpdate: (previousData: unknown) => {
      queryClient.setQueryData(QUERY_KEYS.TRACKED_LOCATIONS, previousData);
    },
  };
}

/**
 * Invalidates the cache for a specific tracked location after mutation
 */
export function useInvalidateTrackedLocation() {
  const queryClient = useQueryClient();

  return (trackerId: number) => {
    queryClient.invalidateQueries({
      queryKey: [...QUERY_KEYS.TRACKED_LOCATION, trackerId],
    });
  };
}
