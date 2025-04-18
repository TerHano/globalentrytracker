import { queryOptions } from "@tanstack/react-query";
import { fetchData } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";

export const discordNotificationSettingsQueryKey =
  "discord-notification-settings";

export interface DiscordSettings {
  id: number;
  enabled: boolean;
  webhookUrl: string;
}

export async function discordNotificationSettingsApi(token: string) {
  return fetchData<DiscordSettings>("/api/v1/notification-settings/discord", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export const discordNotificationSettingsQuery = queryOptions({
  queryKey: [discordNotificationSettingsQueryKey],
  queryFn: async () => {
    const token = await getSupabaseToken();
    if (!token) {
      throw new Error("No token found");
    }
    return discordNotificationSettingsApi(token);
  },
});
