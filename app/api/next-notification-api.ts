import { queryOptions } from "@tanstack/react-query";
import { fetchData } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";

export const nextNotificationQueryKey = "next-notification";

export async function nextNotificationApi(token: string) {
  return fetchData<Date>("/api/v1/next-notification", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export const nextNotificationQuery = (token?: string) =>
  queryOptions({
    queryKey: [nextNotificationQueryKey],
    queryFn: async () => {
      if (!token) {
        const _token = await getSupabaseToken();
        if (!_token) {
          throw new Error("No token found");
        }
        token = _token;
      }
      return nextNotificationApi(token);
    },
  });
