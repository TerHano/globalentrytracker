import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { ApiResponse } from "~/models/ApiResponse";
import { fetchData } from "~/util/fetchData";
import { getSupabaseToken } from "~/util/supabase/get-supabase-token-client";
import type { MutationHookOptions } from "./mutationOptions";

export interface CreateUpdateTrackerRequest {
  id?: number;
  locationId: number;
  enabled: boolean;
  notificationTypeId: number;
  startDate: string;
  endDate?: string;
}

interface useCreateUpdateTrackerProps
  extends MutationHookOptions<CreateUpdateTrackerRequest> {
  isUpdate?: boolean;
}

export const useCreateUpdateTracker = ({
  isUpdate = false,
  onSuccess,
  onError,
}: useCreateUpdateTrackerProps) => {
  const queryClient = useQueryClient();
  return useMutation({
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
        queryClient.invalidateQueries({ queryKey: ["tracked-locations"] });
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
  return fetchData<ApiResponse>("/api/v1/track-location", {
    method: isUpdate ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });
}
