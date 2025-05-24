import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";
import type { components } from "~/types/api";

export type TrackedLocation =
  components["schemas"]["TrackedLocationForUserDtoApiResponse"]["data"];

export const trackedLocationsQuery = (token?: string) =>
  queryOptions({
    queryKey: [trackedLocationsQuery.name],
    queryFn: async () => {
      if (!token) {
        const _token = await getSupabaseToken();
        if (!_token) {
          throw new Error("No token found");
        }
        token = _token;
      }
      return fetchClient
        .GET("/api/v1/tracked-locations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => validateResponse(response.data));
    },
  });
