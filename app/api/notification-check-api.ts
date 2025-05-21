import { queryOptions } from "@tanstack/react-query";
import { fetchData } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";

export const notificationCheckQueryKey = "notification-check";

export interface NotificationCheck {
  isAnyNotificationsEnabled: boolean;
}

export async function notificationCheckApi(token: string) {
  return fetchData<NotificationCheck>("/api/v1/notification-settings/check", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export const notificationCheckQuery = (token?: string) =>
  queryOptions({
    queryKey: [notificationCheckQueryKey],
    queryFn: async () => {
      if (!token) {
        const _token = await getSupabaseToken();
        if (!_token) {
          throw new Error("No token found");
        }
        token = _token;
      }
      return notificationCheckApi(token);
    },
  });
