import {
  type AuthError,
  type AuthTokenResponsePassword,
} from "@supabase/supabase-js";
import { supabaseBrowserClient } from "~/utils/supabase/createSupbaseBrowerClient";
import type { MutationHookOptions } from "./api/mutationOptions";
import { useMutation } from "@tanstack/react-query";

export interface SignInRequest {
  email: string;
  password: string;
}

export const useSignInUser = ({
  onSuccess,
  onError,
}: MutationHookOptions<
  SignInRequest,
  AuthTokenResponsePassword,
  AuthError
>) => {
  return useMutation<AuthTokenResponsePassword, AuthError, SignInRequest>({
    mutationFn: async (request: SignInRequest) => {
      return signInUser(request);
    },
    onSuccess: async (data, body) => {
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
async function signInUser({ email, password }: SignInRequest) {
  return supabaseBrowserClient.auth
    .signInWithPassword({ email, password })
    .then((resp) => {
      if (resp.error) {
        throw resp.error;
      }
      return resp;
    });
}
