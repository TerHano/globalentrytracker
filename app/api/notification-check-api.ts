import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";
import { QUERY_KEYS } from "./query-keys";

export const notificationCheckQuery = (request?: Request) =>
  queryOptions({
    queryKey: QUERY_KEYS.NOTIFICATION_CHECK,
    queryFn: async () => {
      const response = await fetchClient.GET(
        "/api/v1/notification-settings/check",
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
