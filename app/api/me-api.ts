import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";
import { QUERY_KEYS } from "./query-keys";

export const meQuery = (request?: Request) =>
  queryOptions({
    queryKey: QUERY_KEYS.ME,
    queryFn: async () => {
      const response = await fetchClient.GET("/api/v1/me", {
        credentials: "include",
        headers: {
          cookie: request?.headers.get("cookie"),
        },
      });
      return validateResponse(response);
    },
    // Add configuration to prevent hydration mismatches
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: false, // Don't retry auth queries to prevent multiple failed attempts
  });
