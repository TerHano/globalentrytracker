import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";

export const meQuery = (request?: Request) =>
  queryOptions({
    queryKey: [meQuery.name],
    queryFn: async () => {
      const response = await fetchClient.GET("/api/v1/me", {
        credentials: "include",
        headers: {
          cookie: request?.headers.get("cookie"),
        },
      });
      return validateResponse(response);
    },
  });
