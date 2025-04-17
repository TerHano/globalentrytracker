import { fetchData } from "~/util/fetchData";

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
