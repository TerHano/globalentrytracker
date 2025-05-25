import type { MutationHookOptions } from "./api/mutationOptions";
import { $api } from "~/utils/fetchData";

export interface ResetPasswordRequest {
  newPassword: string;
}

export const useResetPassword = ({
  onSuccess,
  onError,
}: MutationHookOptions<ResetPasswordRequest, unknown>) => {
  return $api.useMutation("post", "/api/auth/v1/reset-password", {
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
