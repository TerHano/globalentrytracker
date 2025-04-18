import { queryOptions } from "@tanstack/react-query";
import { fetchData } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";

export const locationQueryKey = "all-locations";

export interface Location {
  id: number;
  name: string;
  address: string;
  addressAdditional: string | null;
  city: string;
  state: string;
  postalCode: string;
}

export async function locationApi(token: string) {
  return fetchData<Location[]>("/api/v1/location", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export const locationQuery = queryOptions({
  queryKey: [locationQueryKey],
  queryFn: async () => {
    const token = await getSupabaseToken();
    if (!token) {
      throw new Error("No token found");
    }
    return locationApi(token);
  },
});
