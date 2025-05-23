import { type AuthError } from "@supabase/supabase-js";
import { supabaseBrowserClient } from "~/utils/supabase/createSupbaseBrowerClient";
import type { MutationHookOptions } from "./api/mutationOptions";
import { useMutation } from "@tanstack/react-query";

export const useSignOutUser = ({
  onSuccess,
  onError,
}: MutationHookOptions<void, void, AuthError>) => {
  return useMutation<void, AuthError, void>({
    mutationFn: async () => {
      return signOutUser();
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
async function signOutUser() {
  return supabaseBrowserClient.auth.signOut().then(({ error }) => {
    if (error) {
      throw error;
    }
  });
}
