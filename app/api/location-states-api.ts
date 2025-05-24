import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";

export const locationStatesQuery = (token?: string) =>
  queryOptions({
    queryKey: [locationStatesQuery.name],
    queryFn: async () => {
      if (!token) {
        const _token = await getSupabaseToken();
        if (!_token) {
          throw new Error("No token found");
        }
        token = _token;
      }
      return fetchClient
        .GET("/api/v1/location/states", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => validateResponse(response.data));
    },
  });
