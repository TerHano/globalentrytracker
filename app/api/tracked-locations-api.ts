import { queryOptions } from "@tanstack/react-query";
import { fetchData } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";
import type { Location } from "./location-api";
import type { NotificationType } from "./notification-types-api";

export const trackedLocationsQueryKey = "tracked-locations";

export interface TrackedLocation {
  id: number;
  location: Location;
  enabled: boolean;
  notificationType: NotificationType;
  cutOffDate: string;
}

export async function trackedLocationsApi(token: string) {
  return fetchData<TrackedLocation[]>("/api/v1/tracked-locations", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export const trackedLocationsQuery = (token?: string) =>
  queryOptions({
    queryKey: [trackedLocationsQueryKey],
    queryFn: async () => {
      if (!token) {
        const _token = await getSupabaseToken();
        if (!_token) {
          throw new Error("No token found");
        }
        token = _token;
      }
      return trackedLocationsApi(token);
    },
  });
