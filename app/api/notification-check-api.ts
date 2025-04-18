import { fetchData } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";

export const notificationCheckQueryKey = "notification-check";

export interface NotificationCheck {
  isNotificationsSetUp: boolean;
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

export const notificationCheckQuery = {
  queryKey: [notificationCheckQueryKey],
  queryFn: async () => {
    const token = await getSupabaseToken();
    if (!token) {
      throw new Error("No token found");
    }
    return notificationCheckApi(token);
  },
};
