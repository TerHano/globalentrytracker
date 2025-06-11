import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";
import { QUERY_KEYS } from "./query-keys";

export const permissionQuery = (request?: Request) =>
  queryOptions({
    queryKey: QUERY_KEYS.PERMISSIONS,
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
