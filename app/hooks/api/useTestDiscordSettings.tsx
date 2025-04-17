import { useMutation } from "@tanstack/react-query";
import { getSupabaseToken } from "~/util/supabase/get-supabase-token-client";
import type { MutationHookOptions } from "./mutationOptions";
import { fetchData } from "~/util/fetchData";
import type { ApiResponse } from "~/models/ApiResponse";

export interface TestDiscordSettingsRequest {
  webhookUrl: string;
}
interface useTestDiscordSettingsProps
  extends MutationHookOptions<TestDiscordSettingsRequest> {
  isUpdate?: boolean;
}

export const useTestDiscordSettings = ({
  onSuccess,
  onError,
}: useTestDiscordSettingsProps) => {
  return useMutation({
    mutationFn: async (request: TestDiscordSettingsRequest) => {
      const token = await getSupabaseToken();
      if (!token) {
        throw new Error("No token found");
      }
      return testDiscordNotificationSettingsApi(request);
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

async function testDiscordNotificationSettingsApi(
  request: TestDiscordSettingsRequest
) {
  const token = await getSupabaseToken();
  if (!token) {
    throw new Error("No token found");
  }
  return fetchData<ApiResponse>(`/api/v1/notification-settings/discord/test`, {
    method: "POST",
    body: JSON.stringify(request),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
