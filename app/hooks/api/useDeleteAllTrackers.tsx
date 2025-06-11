import { useQueryClient } from "@tanstack/react-query";
import { $api } from "~/utils/fetchData";
import type { MutationHookOptions } from "./mutationOptions";
import { QUERY_KEYS } from "~/api/query-keys";

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
        queryKey: QUERY_KEYS.TRACKED_LOCATIONS,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TRACKED_LOCATION,
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PERMISSIONS });
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
