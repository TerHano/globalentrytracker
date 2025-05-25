import { useQueryClient } from "@tanstack/react-query";
import { $api } from "~/utils/fetchData";
import type { MutationHookOptions } from "./mutationOptions";
import { trackedLocationsQuery } from "~/api/tracked-locations-api";
import { trackedLocationQuery } from "~/api/tracked-location-api";
import { permissionQuery } from "~/api/permissions-api";

export interface DeleteAllTrackersResponse {
  success: boolean;
  errorMessage?: string;
}

export function useDeleteAllTrackers({
  onSuccess,
  onError,
}: MutationHookOptions<void, unknown>) {
  const queryClient = useQueryClient();

  return $api.useMutation("delete", "/api/v1/track-location", {
    onSuccess: (data) => {
      // Default behavior
      // Call user-provided handler if it exists
      queryClient.invalidateQueries({
        queryKey: [trackedLocationsQuery.name],
      });
      queryClient.invalidateQueries({
        queryKey: [trackedLocationQuery.name],
      });
      queryClient.invalidateQueries({ queryKey: [permissionQuery.name] });
      if (onSuccess) {
        onSuccess(data.data);
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
  });
}
