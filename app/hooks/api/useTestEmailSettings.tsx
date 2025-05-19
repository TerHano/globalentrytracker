import { useMutation } from "@tanstack/react-query";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";
import type { MutationHookOptions } from "./mutationOptions";
import { fetchData } from "~/utils/fetchData";
import type { ApiError } from "~/models/ApiError";

interface useTestEmailSettingsProps extends MutationHookOptions<void, number> {
  isUpdate?: boolean;
}

export const useTestEmailSettings = ({
  onSuccess,
  onError,
}: useTestEmailSettingsProps) => {
  return useMutation<number, ApiError[], void>({
    mutationFn: async () => {
      const token = await getSupabaseToken();
      if (!token) {
        throw new Error("No token found");
      }
      return testEmailNotificationSettingsApi();
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

async function testEmailNotificationSettingsApi() {
  const token = await getSupabaseToken();
  if (!token) {
    throw new Error("No token found");
  }
  return fetchData<number>(`/api/v1/notification-settings/Email/test`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
