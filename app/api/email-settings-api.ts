import { queryOptions } from "@tanstack/react-query";
import type { components } from "~/types/api";
import { fetchClient, validateResponse } from "~/utils/fetchData";

export type EmailNotificationSettings =
  components["schemas"]["EmailNotificationSettingsDtoApiResponse"]["data"];

export const emailNotificationSettingsQuery = (request?: Request) =>
  queryOptions({
    queryKey: [emailNotificationSettingsQuery.name],
    queryFn: async () => {
      return fetchClient
        .GET("/api/v1/notification-settings/email", {
          credentials: "include",
          headers: {
            cookie: request?.headers.get("cookie"),
          },
        })
        .then((response) => validateResponse(response.data));
    },
  });
