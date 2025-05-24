import type { MutationHookOptions } from "./mutationOptions";
import { $api } from "~/utils/fetchData";

export const useTestEmailSettings = ({
  onSuccess,
  onError,
}: MutationHookOptions<void, unknown>) => {
  return $api.useMutation("post", "/api/v1/notification-settings/email/test", {
    onSuccess: (data, request) => {
      // Call user-provided handler if it exists
      if (onSuccess) {
        onSuccess(data?.data, request?.body);
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
