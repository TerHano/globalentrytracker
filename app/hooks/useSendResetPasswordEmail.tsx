import type { MutationHookOptions } from "./api/mutationOptions";
import { $api } from "~/utils/fetchData";

export interface SendResetPasswordEmailRequest {
  email: string;
}

export const useSendResetPasswordEmail = ({
  onSuccess,
  onError,
}: MutationHookOptions<SendResetPasswordEmailRequest, unknown | null>) => {
  return $api.useMutation("post", "/api/auth/v1/password-recovery", {
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
