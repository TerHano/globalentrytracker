import { queryOptions } from "@tanstack/react-query";
import type { components } from "~/types/api";
import { fetchClient, validateResponse } from "~/utils/fetchData";
import { QUERY_KEYS } from "./query-keys";

export type Location = components["schemas"]["AppointmentLocationDto"];

export const locationsQuery = (request?: Request) =>
  queryOptions({
    queryKey: QUERY_KEYS.LOCATIONS,
    queryFn: async () => {
      const response = await fetchClient.GET("/api/v1/location", {
        credentials: "include",
        headers: {
          cookie: request?.headers.get("cookie"),
        },
      });
      return validateResponse(response);
    },
  });
