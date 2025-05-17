import { useMutation } from "@tanstack/react-query";
import { fetchData } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";
import type { ApiError } from "~/models/ApiError";
import { noop } from "@mantine/core";
import type { MutationHookOptions } from "./mutationOptions";

export const useManageSubscription = ({
  onSuccess = noop,
  onError = noop,
}: MutationHookOptions<void, string>) => {
  return useMutation<string, ApiError[], void>({
    mutationFn: async () => {
      const token = await getSupabaseToken();
      if (!token) {
        throw new Error("No token found");
      }
      return manageSubscriptionApi();
    },
    onSuccess: (data) => {
      if (data) {
        window.location.href = data;
      }
      onSuccess(data);
      // Default behavior
    },
    onError: (e) => {
      // Default behavior
      console.error("Error deleting tracker:", e);
      onError(e);

      // Call user-provided handler if it exists
    },
  });
};
async function manageSubscriptionApi() {
  const token = await getSupabaseToken();
  if (!token) {
    throw new Error("No token found");
  }
  return fetchData<string>("/api/v1/manage-subscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      returnUrl: `${window.location.origin}/settings/subscription`,
    }),
  });
}
