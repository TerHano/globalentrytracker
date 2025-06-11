import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";
import { QUERY_KEYS } from "./query-keys";

export const planQuery = (request?: Request) =>
  queryOptions({
    queryKey: QUERY_KEYS.PLANS,
    queryFn: async () => {
      const response = await fetchClient.GET("/api/v1/plans", {
        credentials: "include",
        headers: {
          cookie: request?.headers.get("cookie"),
        },
      });
      return validateResponse(response);
    },
  });
