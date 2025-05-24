import { queryOptions } from "@tanstack/react-query";
import type { components } from "~/types/api";
import { fetchClient, validateResponse } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";

export type Location = components["schemas"]["AppointmentLocationDto"];

export const locationsQuery = (token?: string) =>
  queryOptions({
    queryKey: [locationsQuery.name],
    queryFn: async () => {
      if (!token) {
        const _token = await getSupabaseToken();
        if (!_token) {
          throw new Error("No token found");
        }
        token = _token;
      }
      return fetchClient
        .GET("/api/v1/location", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => validateResponse(response.data));
    },
  });
