import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";

export const subscriptionInformationQuery = (request?: Request) =>
  queryOptions({
    queryKey: [subscriptionInformationQuery.name],
    queryFn: async () => {
      return fetchClient
        .GET("/api/v1/subscription", {
          credentials: "include",
          headers: {
            cookie: request?.headers.get("cookie"),
          },
        })
        .then((response) => validateResponse(response.data));
    },
  });
