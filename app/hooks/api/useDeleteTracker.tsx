import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "~/models/ApiResponse";
import { fetchData } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";
import type { MutationHookOptions } from "./mutationOptions";
import { trackedLocationsQueryKey } from "~/api/tracked-locations-api";
import { trackedLocationQueryKey } from "~/api/tracked-location-api";
import { permissionQueryKey } from "~/api/permissions-api";

export interface DeleteTrackerResponse {
  success: boolean;
  errorMessage?: string;
}

export function useDeleteTracker({
  onSuccess,
  onError,
}: MutationHookOptions<number>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const token = await getSupabaseToken();
      if (!token) {
        throw new Error("No token found");
      }
      return deleteTrackedLocationApi(id);
    },
    onSuccess: (data, id) => {
      // Default behavior
      // Call user-provided handler if it exists
      if (onSuccess) {
        onSuccess(data, id);
        queryClient.invalidateQueries({ queryKey: [trackedLocationsQueryKey] });
        queryClient.invalidateQueries({
          queryKey: [trackedLocationQueryKey, id],
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

async function deleteTrackedLocationApi(trackerId: number) {
  const token = await getSupabaseToken();
  if (!token) {
    throw new Error("No token found");
  }
  return fetchData<ApiResponse>(`/api/v1/track-location/${trackerId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
