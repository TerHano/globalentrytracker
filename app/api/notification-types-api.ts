import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";
import { QUERY_KEYS } from "./query-keys";

export const notificationTypesQuery = (request?: Request) =>
  queryOptions({
    queryKey: QUERY_KEYS.NOTIFICATION_TYPES,
    queryFn: async () => {
      const response = await fetchClient.GET("/api/v1/notification-types", {
        credentials: "include",
        headers: {
          cookie: request?.headers.get("cookie"),
        },
      });
      return validateResponse(response);
    },
  });
