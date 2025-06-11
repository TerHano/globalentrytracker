import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";
import { QUERY_KEYS } from "./query-keys";

export const nextNotificationQuery = (request?: Request) =>
  queryOptions({
    queryKey: QUERY_KEYS.NEXT_NOTIFICATION,
    queryFn: async () => {
      const response = await fetchClient.GET("/api/v1/next-notification", {
        credentials: "include",
        headers: {
          cookie: request?.headers.get("cookie"),
        },
      });
      return validateResponse(response);
    },
  });
