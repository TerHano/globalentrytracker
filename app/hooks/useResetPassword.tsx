import { type AuthError, type User } from "@supabase/supabase-js";
import { supabaseBrowserClient } from "~/utils/supabase/createSupbaseBrowerClient";
import type { MutationHookOptions } from "./api/mutationOptions";
import { useMutation } from "@tanstack/react-query";

export interface ResetPasswordRequest {
  newPassword: string;
}

export const useResetPassword = ({
  onSuccess,
  onError,
}: MutationHookOptions<ResetPasswordRequest, User, AuthError | null>) => {
  return useMutation<User, AuthError, ResetPasswordRequest>({
    mutationFn: async (request: ResetPasswordRequest) => {
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
async function resetPassword({ newPassword }: ResetPasswordRequest) {
  return supabaseBrowserClient.auth
    .updateUser({
      password: newPassword,
    })
    .then((resp) => {
      if (resp.error) {
        throw resp.error;
      }
      return resp.data.user;
    });
}
