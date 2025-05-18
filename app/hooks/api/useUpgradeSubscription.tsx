import { useMutation } from "@tanstack/react-query";
import { fetchData } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";
import type { ApiError } from "~/models/ApiError";
import type { MutationHookOptions } from "./mutationOptions";
import { noop } from "@mantine/core";

export const useUpgradeSubscription = ({
  onSuccess = noop,
  onError = noop,
}: MutationHookOptions<void, string>) => {
  //const queryClient = useQueryClient();
  return useMutation<string, ApiError[], string>({
    mutationFn: async (priceId: string) => {
      const token = await getSupabaseToken();
      if (!token) {
        throw new Error("No token found");
      }
      return upgradeSubscriptionApi(priceId);
    },
    onSuccess: (data) => {
      if (data) {
        window.location.href = data;
      }
      onSuccess(data);

      // Default behavior
    },
    onError: (error) => {
      // Default behavior
      console.error("Error deleting tracker:", error);
      onError(error);

      // Call user-provided handler if it exists
    },
  });
};
async function upgradeSubscriptionApi(priceId: string) {
  const token = await getSupabaseToken();
  const successUrl = `${window.location.origin}/subscribed`;
  const cancelUrl = `${window.location.origin}/subscribed`;
  if (!token) {
    throw new Error("No token found");
  }
  return fetchData<string>("/api/v1/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      priceId: priceId,
      successUrl: successUrl,
      cancelUrl: cancelUrl,
    }),
  });
}
