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
  cutOffDate: Date;
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

export const trackedLocationsQuery = queryOptions({
  queryKey: [trackedLocationsQueryKey],
  queryFn: async () => {
    const token = await getSupabaseToken();
    if (!token) {
      throw new Error("No token found");
    }
    return trackedLocationsApi(token);
  },
});
