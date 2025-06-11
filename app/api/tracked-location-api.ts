import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";
import type { components } from "~/types/api";
import { QUERY_KEYS } from "./query-keys";

export type TrackedLocation =
  components["schemas"]["TrackedLocationForUserDto"];

export const trackedLocationQuery = (params: {
  trackedLocationId: number;
  request?: Request;
}) =>
  queryOptions({
    queryKey: [...QUERY_KEYS.TRACKED_LOCATION, params.trackedLocationId],
    queryFn: async () => {
      const response = await fetchClient.GET(`/api/v1/tracked-locations/{id}`, {
        params: { path: { id: params.trackedLocationId } },
        credentials: "include",
        headers: {
          cookie: params.request?.headers.get("cookie"),
        },
      });
      return validateResponse(response);
    },
  });
