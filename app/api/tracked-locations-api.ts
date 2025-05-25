import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";
import type { components } from "~/types/api";

export type TrackedLocation =
  components["schemas"]["TrackedLocationForUserDtoApiResponse"]["data"];

export const trackedLocationsQuery = (request?: Request) =>
  queryOptions({
    queryKey: [trackedLocationsQuery.name],
    queryFn: async () => {
      return fetchClient
        .GET("/api/v1/tracked-locations", {
          credentials: "include",
          headers: {
            cookie: request?.headers.get("cookie"),
          },
        })
        .then((response) => validateResponse(response.data));
    },
  });
