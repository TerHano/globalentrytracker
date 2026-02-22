import { useQueryClient } from "@tanstack/react-query";
import { $api } from "~/utils/fetchData";
import type { MutationHookOptions } from "./mutationOptions";
import { QUERY_KEYS } from "~/api/query-keys";
import type { paths } from "~/types/api";
import { mutationRetryConfig } from "~/utils/request-config";
import type { APIError } from "~/utils/error-utils";

type UpdateUserRequest =
  paths["/api/v1/me"]["put"]["requestBody"]["content"]["application/json"];

export const useUpdateUser = ({
  onSuccess,
  onError,
}: MutationHookOptions<UpdateUserRequest, unknown, APIError[]>) => {
  const queryClient = useQueryClient();

  return $api.useMutation("put", "/api/v1/me", {
    ...mutationRetryConfig,
    onSuccess: (data, request) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ME });
      if (onSuccess) {
        onSuccess(data?.data, request?.body);
      }
    },
    onError: (response) => {
      if (onError) {
        onError(response.errors);
      }
    },
  });
};
