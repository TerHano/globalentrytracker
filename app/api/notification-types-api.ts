import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";

export const notificationTypesQuery = (request?: Request) =>
  queryOptions({
    queryKey: [notificationTypesQuery.name],
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
