import type { MutationHookOptions } from "./mutationOptions";
import { $api } from "~/utils/fetchData";
import { mutationRetryConfig } from "~/utils/request-config";
import type { APIError } from "~/utils/error-utils";

export interface SignInRequest {
  email: string | null;
  password: string | null;
}

export const useSignInUser = ({
  onSuccess,
  onError,
}: MutationHookOptions<SignInRequest, unknown, APIError[]>) => {
  return $api.useMutation("post", "/api/auth/v1/login", {
    ...mutationRetryConfig,
    onSuccess: (data, request) => {
      if (onSuccess) {
        onSuccess(data.data, request?.body);
      }
    },
    onError: (response) => {
      if (onError) {
        onError(response.errors);
      }
    },
  });
};
