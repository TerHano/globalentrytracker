import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";
import type { components } from "~/types/api";

export type DiscordNotificationSettings =
  components["schemas"]["DiscordNotificationSettingsDtoApiResponse"]["data"];

export const discordNotificationSettingsQuery = (token?: string) =>
  queryOptions({
    queryKey: [discordNotificationSettingsQuery.name],
    queryFn: async () => {
      if (!token) {
        const _token = await getSupabaseToken();
        if (!_token) {
          throw new Error("No token found");
        }
        token = _token;
      }
      return fetchClient
        .GET("/api/v1/notification-settings/discord", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => validateResponse(response.data));
    },
  });
