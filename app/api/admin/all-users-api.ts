import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";

export const allUsersQuery = (request?: Request) =>
  queryOptions({
    queryKey: [allUsersQuery.name],
    queryFn: async () => {
      const response = await fetchClient.GET("/api/v1/admin/users", {
        credentials: "include",
        headers: {
          cookie: request?.headers.get("cookie"),
        },
      });
      return validateResponse(response);
    },
  });
