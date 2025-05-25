import { $api } from "~/utils/fetchData";
import type { MutationHookOptions } from "./mutationOptions";

import type { paths } from "~/types/api";

export type SignUpUserRequest =
  paths["/api/auth/v1/sign-up"]["post"]["requestBody"]["content"]["application/json"];

export const useSignUpUser = ({
  onSuccess,
  onError,
}: MutationHookOptions<SignUpUserRequest, unknown>) => {
  return $api.useMutation("post", "/api/auth/v1/sign-up", {
    onSuccess: (data, request) => {
      // Call user-provided handler if it exists
      if (onSuccess) {
        onSuccess(data.data, request?.body);
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
