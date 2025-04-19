import { queryOptions } from "@tanstack/react-query";
import { fetchData } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";

export const locationStatesQueryKey = "all-locations-states";

export async function locationStatesApi(token: string) {
  return fetchData<string[]>("/api/v1/location/states", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export const locationStatesQuery = (token?: string) =>
  queryOptions({
    queryKey: [locationStatesQueryKey],
    queryFn: async () => {
      if (!token) {
        const _token = await getSupabaseToken();
        if (!_token) {
          throw new Error("No token found");
        }
        token = _token;
      }
      return locationStatesApi(token);
    },
  });
