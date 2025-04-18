import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { ApiResponse } from "~/models/ApiResponse";
import { fetchData } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";
import type { MutationHookOptions } from "./mutationOptions";
import { meQueryKey } from "~/api/me-api";

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
}

export const useUpdateUser = ({
  onSuccess,
  onError,
}: MutationHookOptions<UpdateUserRequest>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: UpdateUserRequest) => {
      const token = await getSupabaseToken();
      if (!token) {
        throw new Error("No token found");
      }
      return updateUserApi(request);
    },
    onSuccess: (data, body) => {
      // Default behavior

      // Call user-provided handler if it exists
      if (onSuccess) {
        onSuccess(data, body);
        queryClient.invalidateQueries({ queryKey: [meQueryKey] });
      }
    },
    onError: (error) => {
      // Default behavior
      console.error("Error deleting tracker:", error);

      // Call user-provided handler if it exists
      if (onError) {
        onError(error);
      }
    },
  });
};
async function updateUserApi(request: UpdateUserRequest) {
  const token = await getSupabaseToken();
  if (!token) {
    throw new Error("No token found");
  }
  return fetchData<ApiResponse>("/api/v1/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });
}
