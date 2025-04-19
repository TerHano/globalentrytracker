import { queryOptions } from "@tanstack/react-query";
import { fetchData } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";
import type { TrackedLocation } from "./tracked-locations-api";

export const trackedLocationQueryKey = "tracked-location";

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

export const trackedLocationQuery = ({
  trackedLocationId,
  token,
}: {
  trackedLocationId: number;
  token?: string;
}) =>
  queryOptions({
    queryKey: [trackedLocationQueryKey, trackedLocationId],
    queryFn: async () => {
      if (!token) {
        const _token = await getSupabaseToken();
        if (!_token) {
          throw new Error("No token found");
        }
        token = _token;
      }
      return trackedLocationApi(token, trackedLocationId);
    },
  });
