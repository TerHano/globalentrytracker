import { queryOptions } from "@tanstack/react-query";
import { fetchData } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";
import type { DiscordSettings } from "./discord-settings-api";
import type { EmailSettings } from "./email-settings-api";

export const allNotificationSettingsQueryKey = "all-notification-settings";

export interface AllNotificationSettings {
  discordSettings: DiscordSettings;
  emailSettings: EmailSettings;
}

export async function allNotificationSettingsApi(token: string) {
  return fetchData<AllNotificationSettings>("/api/v1/notification-settings", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export const allNotificationSettingsQuery = (token?: string) =>
  queryOptions({
    queryKey: [allNotificationSettingsQueryKey],
    queryFn: async () => {
      if (!token) {
        const _token = await getSupabaseToken();
        if (!_token) {
          throw new Error("No token found");
        }
        token = _token;
      }
      return allNotificationSettingsApi(token);
    },
  });
