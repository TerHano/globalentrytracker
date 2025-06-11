import { queryOptions } from "@tanstack/react-query";
import type { components } from "~/types/api";
import { fetchClient, validateResponse } from "~/utils/fetchData";
import { QUERY_KEYS } from "./query-keys";

export type EmailNotificationSettings =
  components["schemas"]["EmailNotificationSettingsDtoApiResponse"]["data"];

export const emailNotificationSettingsQuery = (request?: Request) =>
  queryOptions({
    queryKey: QUERY_KEYS.EMAIL_NOTIFICATION_SETTINGS,
    queryFn: async () => {
      const response = await fetchClient.GET(
        "/api/v1/notification-settings/email",
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
