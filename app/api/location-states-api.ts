import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";

export const locationStatesQuery = (request?: Request) =>
  queryOptions({
    queryKey: [locationStatesQuery.name],
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
