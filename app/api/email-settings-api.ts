import { queryOptions } from "@tanstack/react-query";
import { fetchData } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";

export const emailNotificationSettingsQueryKey = "email-notification-settings";

export interface EmailSettings {
  id: number;
  enabled: boolean;
  email: string;
}

export async function emailNotificationSettingsApi(token: string) {
  return fetchData<EmailSettings>("/api/v1/notification-settings/email", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export const emailNotificationSettingsQuery = (token?: string) =>
  queryOptions({
    queryKey: [emailNotificationSettingsQueryKey],
    queryFn: async () => {
      if (!token) {
        const _token = await getSupabaseToken();
        if (!_token) {
          throw new Error("No token found");
        }
        token = _token;
      }
      return emailNotificationSettingsApi(token);
    },
  });
