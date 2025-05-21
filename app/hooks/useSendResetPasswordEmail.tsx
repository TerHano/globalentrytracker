import { type AuthError } from "@supabase/supabase-js";
import { supabaseBrowserClient } from "~/utils/supabase/createSupbaseBrowerClient";
import type { MutationHookOptions } from "./api/mutationOptions";
import { useMutation } from "@tanstack/react-query";

export interface SendResetPasswordEmailRequest {
  email: string;
}

export const useSendResetPasswordEmail = ({
  onSuccess,
  onError,
}: MutationHookOptions<
  SendResetPasswordEmailRequest,
  unknown | null,
  AuthError | null
>) => {
  return useMutation<unknown | null, AuthError, SendResetPasswordEmailRequest>({
    mutationFn: async (request: SendResetPasswordEmailRequest) => {
      return resetPassword(request);
    },
    onSuccess: (data, body) => {
      // Default behavior

      // Call user-provided handler if it exists
      if (onSuccess) {
        onSuccess(data, body);
      }
    },
    onError: (error) => {
      // Call user-provided handler if it exists
      if (onError) {
        onError(error);
      }
    },
  });
};
async function resetPassword({ email }: SendResetPasswordEmailRequest) {
  return supabaseBrowserClient.auth
    .resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    .then((resp) => {
      if (resp.error) {
        throw resp.error;
      }
      return resp;
    });
}
