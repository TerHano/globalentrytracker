import type { MutationHookOptions } from "./mutationOptions";
import { $api } from "~/utils/fetchData";

export interface SignInRequest {
  email: string | null;
  password: string | null;
}

export const useSignInUser = ({
  onSuccess,
  onError,
}: MutationHookOptions<SignInRequest, unknown>) => {
  return $api.useMutation("post", "/api/auth/v1/login", {
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
