import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";

export const nextNotificationQuery = (request?: Request) =>
  queryOptions({
    queryKey: [nextNotificationQuery.name],
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
