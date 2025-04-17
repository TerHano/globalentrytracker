import { queryOptions } from "@tanstack/react-query";
import type { NotificationType } from "~/enum/NotificationType";
import { fetchData } from "~/util/fetchData";
import { getSupabaseToken } from "~/util/supabase/get-supabase-token-client";

export interface TrackLocation {
  id: number;
  locationId: number;
  enabled: boolean;
  notificationType: NotificationType;
  startDate: Date;
  endDate: Date;
}

export async function trackedLocationsApi(token: string) {
  return fetchData<TrackLocation>("/api/v1/track-location", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

// export const trackedLocationsQuery = queryOptions({
//   queryKey: ["track-location"],
//   queryFn: async () => {
//     const token = await getSupabaseToken();
//     if (!token) {
//       throw new Error("No token found");
//     }
//     return trackedLocationsApi(token);
//   },
// });
