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
export const notificationTypesQuery = (token?: string) =>
  queryOptions({
    queryKey: [notificationTypesQueryKey],
    queryFn: async () => {
      if (!token) {
        const _token = await getSupabaseToken();
        if (!_token) {
          throw new Error("No token found");
        }
        token = _token;
      }
      return notificationTypesApi(token);
    },
  });
