import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";
import { QUERY_KEYS } from "./query-keys";

export const locationStatesQuery = (request?: Request) =>
  queryOptions({
    queryKey: QUERY_KEYS.LOCATION_STATES,
    queryFn: async () => {
      const response = await fetchClient.GET("/api/v1/location/states", {
        credentials: "include",
        headers: {
          cookie: request?.headers.get("cookie"),
        },
      });
      return validateResponse(response);
    },
  });
