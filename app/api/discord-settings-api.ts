import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";
import type { components } from "~/types/api";

export type DiscordNotificationSettings =
  components["schemas"]["DiscordNotificationSettingsDtoApiResponse"]["data"];

export const discordNotificationSettingsQuery = (request?: Request) =>
  queryOptions({
    queryKey: [discordNotificationSettingsQuery.name],
    queryFn: async () => {
      const response = await fetchClient.GET(
        "/api/v1/notification-settings/discord",
        {
          credentials: "include",
          headers: {
            cookie: request?.headers.get("cookie"),
          },
        }
      );
      return validateResponse(response);
    },
  });
