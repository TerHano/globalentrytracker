import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";
import type { ApiError } from "~/models/ApiError";
import { meQueryKey } from "~/api/me-api";
import { permissionQuery } from "~/api/permissions-api";
import type { MutationHookOptions } from "./mutationOptions";
import { noop } from "@mantine/core";

export const useSubscriptionInformation = ({
  onSuccess = noop,
  onError = noop,
}: MutationHookOptions<void, boolean>) => {
  const queryClient = useQueryClient();
  return useMutation<boolean, ApiError[], void>({
    mutationFn: async () => {
      const token = await getSupabaseToken();
      if (!token) {
        throw new Error("No token found");
      }
      return subscriptionInformationApi();
    },
    onSuccess: (data, request) => {
      queryClient.invalidateQueries({
        queryKey: [meQueryKey],
      });
      queryClient.invalidateQueries({
        queryKey: [permissionQuery],
      });
      onSuccess(data, request);
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
async function subscriptionInformationApi() {
  const token = await getSupabaseToken();
  if (!token) {
    throw new Error("No token found");
  }
  return fetchData<boolean>("/api/v1/subscription-information", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });
}
