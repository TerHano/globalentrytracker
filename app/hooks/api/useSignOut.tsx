import type { MutationHookOptions } from "./mutationOptions";
import { $api } from "~/utils/fetchData";
import { mutationRetryConfig } from "~/utils/request-config";
import type { APIError } from "~/utils/error-utils";

export const useSignOutUser = ({
  onSuccess,
  onError,
}: MutationHookOptions<unknown, unknown, APIError[]>) => {
  return $api.useMutation("post", "/api/auth/v1/logout", {
    ...mutationRetryConfig,
    onSuccess: (data, body) => {
      if (onSuccess) {
        onSuccess(data, body);
      }
    },
    onError: (error) => {
      if (onError) {
        onError(error.errors);
      }
    },
  });
};
