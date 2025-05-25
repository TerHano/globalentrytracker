import { useQueryClient } from "@tanstack/react-query";
import { $api } from "~/utils/fetchData";
import type { MutationHookOptions } from "./mutationOptions";
import { meQuery } from "~/api/me-api";
import type { paths } from "~/types/api";

type UpdateUserRequest =
  paths["/api/v1/me"]["put"]["requestBody"]["content"]["application/json"];

export const useUpdateUser = ({
  onSuccess,
  onError,
}: MutationHookOptions<UpdateUserRequest, unknown>) => {
  const queryClient = useQueryClient();

  return $api.useMutation("put", "/api/v1/me", {
    onSuccess: (data, request) => {
      queryClient.invalidateQueries({ queryKey: [meQuery.name] });
      // Call user-provided handler if it exists
      if (onSuccess) {
        onSuccess(data?.data, request?.body);
      }
    },
    onError: (response) => {
      // Default behavior

      // Call user-provided handler if it exists
      if (onError) {
        onError(response.errors);
      }
    },
  });
};
