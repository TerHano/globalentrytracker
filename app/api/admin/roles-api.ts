import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";

export const allRolesQuery = (request?: Request) =>
  queryOptions({
    queryKey: [allRolesQuery.name],
    queryFn: async () => {
      const response = await fetchClient.GET("/api/v1/admin/roles", {
        credentials: "include",
        headers: {
          cookie: request?.headers.get("cookie"),
        },
      });
      return validateResponse(response);
    },
  });
