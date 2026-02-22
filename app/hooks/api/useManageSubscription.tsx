import { $api } from "~/utils/fetchData";
import { noop } from "@mantine/core";
import type { MutationHookOptions } from "./mutationOptions";
import { mutationRetryConfig } from "~/utils/request-config";
import type { APIError } from "~/utils/error-utils";

export const useManageSubscription = ({
  onSuccess = noop,
  onError = noop,
}: MutationHookOptions<void, string, APIError[]>) => {
  return $api.useMutation("post", "/api/v1/manage-subscription", {
    ...mutationRetryConfig,
    onSuccess: (data) => {
      window.location.href = data.data;
      onSuccess(data.data);
    },
    onError: (r) => {
      onError(r.errors);
    },
  });
};
