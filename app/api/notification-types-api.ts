import { queryOptions } from "@tanstack/react-query";
import { fetchData } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";

export const notificationTypesQueryKey = "notification-types";

export interface NotificationType {
  id: number;
  name: string;
  description: string;
  type: number;
}

export async function notificationTypesApi(token: string) {
  return fetchData<NotificationType[]>("/api/v1/notification-types", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
export const notificationTypesQuery = queryOptions({
  queryKey: [notificationTypesQueryKey],
  queryFn: async () => {
    const token = await getSupabaseToken();
    if (!token) {
      throw new Error("No token found");
    }
    return notificationTypesApi(token);
  },
});
