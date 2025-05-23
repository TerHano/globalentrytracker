import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";
import type { MutationHookOptions } from "./mutationOptions";
import { trackedLocationsQueryKey } from "~/api/tracked-locations-api";
import { trackedLocationQueryKey } from "~/api/tracked-location-api";
import { permissionQueryKey } from "~/api/permissions-api";
import type { ApiError } from "~/models/ApiError";

export interface DeleteAllTrackersResponse {
  success: boolean;
  errorMessage?: string;
}

export function useDeleteAllTrackers({
  onSuccess,
  onError,
}: MutationHookOptions<void, void>) {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError[], void>({
    mutationFn: async () => {
      const token = await getSupabaseToken();
      if (!token) {
        throw new Error("No token found");
      }
      return deleteAllTrackedLocationsApi();
    },
    onSuccess: (data) => {
      // Default behavior
      // Call user-provided handler if it exists
      if (onSuccess) {
        onSuccess(data);
        queryClient.invalidateQueries({ queryKey: [trackedLocationsQueryKey] });
        queryClient.invalidateQueries({
          queryKey: [trackedLocationQueryKey],
        });
        queryClient.invalidateQueries({ queryKey: [permissionQueryKey] });
      }
    },
    onError: (error) => {
      // Default behavior
      console.error("Error deleting tracker:", error);

      // Call user-provided handler if it exists
      if (onError) {
        onError(error);
      }
    },
  });
}

async function deleteAllTrackedLocationsApi() {
  const token = await getSupabaseToken();
  if (!token) {
    throw new Error("No token found");
  }
  return fetchData<void>(`/api/v1/track-location`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
