import { useQueryClient } from "@tanstack/react-query";
import { $api } from "~/utils/fetchData";
import type { MutationHookOptions } from "./mutationOptions";
import { trackedLocationsQuery } from "~/api/tracked-locations-api";
import { trackedLocationQuery } from "~/api/tracked-location-api";
import { permissionQuery } from "~/api/permissions-api";

export interface DeleteTrackerResponse {
  success: boolean;
  errorMessage?: string;
}

export function useDeleteTracker({
  onSuccess,
  onError,
}: MutationHookOptions<number, number>) {
  const queryClient = useQueryClient();

  return $api.useMutation(
    "delete",
    "/api/v1/track-location/{locationTrackerId}",
    {
      onSuccess: (data, request) => {
        // Default behavior
        // Call user-provided handler if it exists
        queryClient.invalidateQueries({
          queryKey: [trackedLocationsQuery.name],
        });
        queryClient.invalidateQueries({
          queryKey: [
            trackedLocationQuery.name,
            request.params.path.locationTrackerId,
          ],
        });
        queryClient.invalidateQueries({ queryKey: [permissionQuery.name] });
        if (onSuccess) {
          onSuccess(data.data, request.params.path.locationTrackerId);
        }
      },
      onError: (r) => {
        // Default behavior
        console.error("Error deleting tracker:", r.errors);

        // Call user-provided handler if it exists
        if (onError) {
          onError(r.errors);
        }
      },
    }
  );
}
