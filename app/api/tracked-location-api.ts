import { queryOptions } from "@tanstack/react-query";
import { fetchData } from "~/util/fetchData";
import { getSupabaseToken } from "~/util/supabase/get-supabase-token-client";
import type { NotificationType } from "./notification-types-api";
import type { TrackedLocation } from "./tracked-locations-api";

export async function trackedLocationApi(
  token: string,
  trackedLocationId: number
) {
  return fetchData<TrackedLocation>(
    `/api/v1/tracked-locations/${trackedLocationId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export const trackedLocationsQuery = ({
  trackedLocationId,
}: {
  trackedLocationId: number;
}) =>
  queryOptions({
    queryKey: ["tracked-locations"],
    queryFn: async () => {
      const token = await getSupabaseToken();
      if (!token) {
        throw new Error("No token found");
      }
      return trackedLocationApi(token, trackedLocationId);
    },
  });
