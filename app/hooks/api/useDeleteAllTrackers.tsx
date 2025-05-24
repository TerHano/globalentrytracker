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

  // return useMutation<void, ApiError[], void>({
  //   mutationFn: async () => {
  //     const token = await getSupabaseToken();
  //     if (!token) {
  //       throw new Error("No token found");
  //     }
  //     return deleteAllTrackedLocationsApi();
  //   },
  //   onSuccess: (data) => {
  //     // Default behavior
  //     // Call user-provided handler if it exists
  //     if (onSuccess) {
  //       onSuccess(data);
  //       queryClient.invalidateQueries({ queryKey: [trackedLocationsQueryKey] });
  //       queryClient.invalidateQueries({
  //         queryKey: [trackedLocationQueryKey],
  //       });
  //       queryClient.invalidateQueries({ queryKey: [permissionQueryKey] });
  //     }
  //   },
  //   onError: (error) => {
  //     // Default behavior
  //     console.error("Error deleting tracker:", error);

  //     // Call user-provided handler if it exists
  //     if (onError) {
  //       onError(error);
  //     }
  //   },
  // });
}
