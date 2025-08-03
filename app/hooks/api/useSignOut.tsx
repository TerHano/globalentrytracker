import type { MutationHookOptions } from "./mutationOptions";
import { $api } from "~/utils/fetchData";

export const useSignOutUser = ({
  onSuccess,
  onError,
}: MutationHookOptions<unknown, unknown>) => {
  return $api.useMutation("post", "/api/auth/v1/logout", {
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
