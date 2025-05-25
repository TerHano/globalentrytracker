import type { MutationHookOptions } from "./api/mutationOptions";
import { $api } from "~/utils/fetchData";

export const useSignOutUser = ({
  onSuccess,
  onError,
}: MutationHookOptions<unknown, unknown>) => {
  return $api.useMutation("post", "/api/auth/v1/sign-out", {
    onSuccess: (data, body) => {
      if (onSuccess) {
        onSuccess(data, body);
      }
    },
    onError: (error) => {
      if (onError) {
        onError(error.errors);
      }
    },
  });
};
