import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";

export const planQuery = (request?: Request) =>
  queryOptions({
    queryKey: [planQuery.name],
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
