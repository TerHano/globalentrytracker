import { queryOptions } from "@tanstack/react-query";
import { fetchData } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";

export const meQueryKey = "me";

export interface me {
  firstName: string;
  lastName: string;
  email: string;
}

export async function meApi(token: string) {
  return fetchData<me>("/api/v1/me", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export const meQuery = queryOptions({
  queryKey: [meQueryKey],
  queryFn: async () => {
    const token = await getSupabaseToken();
    if (!token) {
      throw new Error("No token found");
    }
    return meApi(token);
  },
});
