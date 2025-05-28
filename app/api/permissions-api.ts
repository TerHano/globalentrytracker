import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";

export const permissionQuery = (request?: Request) =>
  queryOptions({
    queryKey: [permissionQuery.name],
    queryFn: async () => {
      const response = await fetchClient.GET("/api/v1/me/permissions", {
        credentials: "include",
        headers: {
          cookie: request?.headers.get("cookie"),
        },
      });
      return validateResponse(response);
    },
  });
