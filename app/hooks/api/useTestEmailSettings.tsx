import type { MutationHookOptions } from "./mutationOptions";
import { $api } from "~/utils/fetchData";
import { mutationRetryConfig } from "~/utils/request-config";
import type { APIError } from "~/utils/error-utils";

export const useTestEmailSettings = ({
  onSuccess,
  onError,
}: MutationHookOptions<void, unknown, APIError[]>) => {
  return $api.useMutation("post", "/api/v1/notification-settings/email/test", {
    ...mutationRetryConfig,
    onSuccess: (data, request) => {
      if (onSuccess) {
        onSuccess(data?.data, request?.body);
      }
    },
    onError: (response) => {
      if (onError) {
        onError(response.errors);
      }
    },
  });
};
