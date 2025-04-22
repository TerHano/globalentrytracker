import { queryOptions } from "@tanstack/react-query";
import { fetchData } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";

export const permissionQueryKey = "permission";

export interface Permission {
  canCreateTracker: boolean;
}

export async function permissionApi(token: string) {
  return fetchData<Permission>("/api/v1/me/permissions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export const permissionQuery = (token?: string) =>
  queryOptions({
    queryKey: [permissionQueryKey],
    queryFn: async () => {
      if (!token) {
        const _token = await getSupabaseToken();
        if (!_token) {
          throw new Error("No token found");
        }
        token = _token;
      }
      return permissionApi(token);
    },
  });
