import { useMutation } from "@tanstack/react-query";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";
import type { MutationHookOptions } from "./mutationOptions";
import { fetchData } from "~/utils/fetchData";
import type { ApiError } from "~/models/ApiError";

export interface CreateUpdateEmailSettingsRequest {
  id?: number;
  enabled: boolean;
}
interface useCreateUpdateEmailSettingsProps
  extends MutationHookOptions<CreateUpdateEmailSettingsRequest, number> {
  isUpdate?: boolean;
}

export const useCreateUpdateEmailSettings = ({
  isUpdate = false,
  onSuccess,
  onError,
}: useCreateUpdateEmailSettingsProps) => {
  return useMutation<number, ApiError[], CreateUpdateEmailSettingsRequest>({
    mutationFn: async (request: CreateUpdateEmailSettingsRequest) => {
      const token = await getSupabaseToken();
      if (!token) {
        throw new Error("No token found");
      }
      return emailNotificationSettingsApi(request, isUpdate);
    },
    onSuccess: (data, body) => {
      // Default behavior

      // Call user-provided handler if it exists
      if (onSuccess) {
        onSuccess(data, body);
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

async function emailNotificationSettingsApi(
  request: CreateUpdateEmailSettingsRequest,
  isUpdate: boolean
) {
  const token = await getSupabaseToken();
  if (!token) {
    throw new Error("No token found");
  }
  return fetchData<number>(`/api/v1/notification-settings/email`, {
    method: isUpdate ? "PUT" : "POST",
    body: JSON.stringify(request),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
