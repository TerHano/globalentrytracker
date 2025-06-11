import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";
import type { components } from "~/types/api";
import { QUERY_KEYS } from "./query-keys";

export type TrackedLocation =
  components["schemas"]["TrackedLocationForUserDtoApiResponse"]["data"];

export const trackedLocationsQuery = (request?: Request) =>
  queryOptions({
    queryKey: QUERY_KEYS.TRACKED_LOCATIONS,
    queryFn: async () => {
      const response = await fetchClient.GET("/api/v1/tracked-locations", {
        credentials: "include",
        headers: {
          cookie: request?.headers.get("cookie"),
        },
      });
      return validateResponse(response);
    },
  });
