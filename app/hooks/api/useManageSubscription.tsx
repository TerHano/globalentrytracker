import { $api } from "~/utils/fetchData";
import { noop } from "@mantine/core";
import type { MutationHookOptions } from "./mutationOptions";

export const useManageSubscription = ({
  onSuccess = noop,
  onError = noop,
}: MutationHookOptions<void, string>) => {
  return $api.useMutation("post", "/api/v1/manage-subscription", {
    onSuccess: (data) => {
      window.location.href = data.data;
      onSuccess(data.data);
      // Default behavior
    },
    onError: (r) => {
      // Default behavior
      onError(r.errors);
      // Call user-provided handler if it exists
    },
  });
};
