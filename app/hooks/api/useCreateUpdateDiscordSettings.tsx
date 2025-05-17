import { useMutation } from "@tanstack/react-query";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";
import type { MutationHookOptions } from "./mutationOptions";
import { fetchData } from "~/utils/fetchData";
import type { ApiError } from "~/models/ApiError";

export interface CreateUpdateDiscordSettingsRequest {
  id?: number;
  enabled: boolean;
  webhookUrl: string;
}
interface useCreateUpdateDiscordSettingsProps
  extends MutationHookOptions<CreateUpdateDiscordSettingsRequest, number> {
  isUpdate?: boolean;
}

export const useCreateUpdateDiscordSettings = ({
  isUpdate = false,
  onSuccess,
  onError,
}: useCreateUpdateDiscordSettingsProps) => {
  return useMutation<number, ApiError[], CreateUpdateDiscordSettingsRequest>({
    mutationFn: async (request: CreateUpdateDiscordSettingsRequest) => {
      const token = await getSupabaseToken();
      if (!token) {
        throw new Error("No token found");
      }
      return discordNotificationSettingsApi(request, isUpdate);
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

async function discordNotificationSettingsApi(
  request: CreateUpdateDiscordSettingsRequest,
  isUpdate: boolean
) {
  const token = await getSupabaseToken();
  if (!token) {
    throw new Error("No token found");
  }
  return fetchData<number>(`/api/v1/notification-settings/discord`, {
    method: isUpdate ? "PUT" : "POST",
    body: JSON.stringify(request),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
