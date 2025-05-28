import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";

export const allNotificationSettingsQuery = (request?: Request) =>
  queryOptions({
    queryKey: [allNotificationSettingsQuery.name],
    queryFn: async () => {
      const response = await fetchClient.GET("/api/v1/notification-settings", {
        credentials: "include",
        headers: {
          cookie: request?.headers.get("cookie"),
        },
      });
      return validateResponse(response);
    },
  });
