import { useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchData } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";
import type { MutationHookOptions } from "./mutationOptions";
import { trackedLocationQueryKey } from "~/api/tracked-location-api";
import { permissionQueryKey } from "~/api/permissions-api";
import type { ApiError } from "~/models/ApiError";
import { trackedLocationsQueryKey } from "~/api/tracked-locations-api";
import { nextNotificationQueryKey } from "~/api/next-notification-api";

export interface CreateUpdateTrackerRequest {
  id?: number;
  locationId: number;
  enabled: boolean;
  notificationTypeId: number;
  cutOffDate: string;
}

interface useCreateUpdateTrackerProps
  extends MutationHookOptions<CreateUpdateTrackerRequest, number> {
  isUpdate?: boolean;
}

export const useCreateUpdateTracker = ({
  isUpdate = false,
  onSuccess,
  onError,
}: useCreateUpdateTrackerProps) => {
  const queryClient = useQueryClient();
  return useMutation<number, ApiError[], CreateUpdateTrackerRequest>({
    mutationFn: async (request: CreateUpdateTrackerRequest) => {
      const token = await getSupabaseToken();
      if (!token) {
        throw new Error("No token found");
      }
      return trackedLocationApi(request, isUpdate);
    },
    onSuccess: (data, body) => {
      // Default behavior

      // Call user-provided handler if it exists
      if (onSuccess) {
        onSuccess(data, body);
        queryClient.invalidateQueries({
          queryKey: [trackedLocationQueryKey],
        });
        queryClient.invalidateQueries({
          queryKey: [trackedLocationsQueryKey],
        });
        queryClient.invalidateQueries({
          queryKey: [nextNotificationQueryKey],
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
};
async function trackedLocationApi(
  request: CreateUpdateTrackerRequest,
  isUpdate: boolean
) {
  const token = await getSupabaseToken();
  if (!token) {
    throw new Error("No token found");
  }
  return fetchData<number>("/api/v1/track-location", {
    method: isUpdate ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });
}
