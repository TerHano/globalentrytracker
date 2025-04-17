import { queryOptions } from "@tanstack/react-query";
import { fetchData } from "~/util/fetchData";
import { getSupabaseToken } from "~/util/supabase/get-supabase-token-client";
import type { DiscordSettings } from "./discord-settings-api";

export const allNotificationSettingsQueryKey = "all-notification-settings";

export interface AllNotificationSettings {
  discordSettings: DiscordSettings;
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

export const notificationSettingsQuery = queryOptions({
  queryKey: [allNotificationSettingsQueryKey],
  queryFn: async () => {
    const token = await getSupabaseToken();
    if (!token) {
      throw new Error("No token found");
    }
    return allNotificationSettingsApi(token);
  },
});
