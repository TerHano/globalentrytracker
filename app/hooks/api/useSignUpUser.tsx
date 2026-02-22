import { $api } from "~/utils/fetchData";
import type { MutationHookOptions } from "./mutationOptions";
import type { paths } from "~/types/api";
import { mutationRetryConfig } from "~/utils/request-config";
import type { APIError } from "~/utils/error-utils";

export type SignUpUserRequest =
  paths["/api/auth/v1/register"]["post"]["requestBody"]["content"]["application/json"];

export const useSignUpUser = ({
  onSuccess,
  onError,
}: MutationHookOptions<SignUpUserRequest, unknown, APIError[]>) => {
  return $api.useMutation("post", "/api/auth/v1/register", {
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
