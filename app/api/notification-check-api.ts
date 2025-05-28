import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";

export const notificationCheckQuery = (request?: Request) =>
  queryOptions({
    queryKey: [notificationCheckQuery.name],
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
