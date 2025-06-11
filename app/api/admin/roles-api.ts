import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";
import { QUERY_KEYS } from "../query-keys";

export const allRolesQuery = (request?: Request) =>
  queryOptions({
    queryKey: QUERY_KEYS.ALL_ROLES,
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
