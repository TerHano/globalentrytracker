import { queryOptions } from "@tanstack/react-query";
import { fetchClient } from "~/utils/fetchData";

export const nextNotificationQuery = (request?: Request) =>
  queryOptions({
    queryKey: [nextNotificationQuery.name],
    queryFn: async () => {
      return fetchClient
        .GET("/api/v1/next-notification", {
          credentials: "include",
          headers: {
            cookie: request?.headers.get("cookie"),
          },
        })
        .then((response) => response.data?.data);
    },
  });
