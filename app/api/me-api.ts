import { queryOptions } from "@tanstack/react-query";
import type { RoleEnum } from "~/enum/RoleEnum";
import { fetchData } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";

export const meQueryKey = "me";

/**
 * Represents the user profile information returned by the "me" API endpoint.
 *
 * @property firstName - The user's first name.
 * @property lastName - The user's last name.
 * @property email - The user's email address.
 * @property role - The user's role within the system, as defined by the RoleEnum.
 */
export interface me {
  firstName: string;
  lastName: string;
  email: string;
  role: RoleEnum;
}

export async function meApi(token: string) {
  return fetchData<me>("/api/v1/me", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export const meQuery = (token?: string) =>
  queryOptions({
    queryKey: [meQueryKey],
    queryFn: async () => {
      if (!token) {
        const _token = await getSupabaseToken();
        if (!_token) {
          throw new Error("No token found");
        }
        token = _token;
      }
      return meApi(token);
    },
  });
