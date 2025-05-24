import { useQueryClient } from "@tanstack/react-query";
import { permissionQuery } from "~/api/permissions-api";
import type { MutationHookOptions } from "./mutationOptions";
import { noop } from "@mantine/core";
import { meQuery } from "~/api/me-api";
import { $api } from "~/utils/fetchData";

export const useValidateSubscription = ({
  onSuccess = noop,
  onError = noop,
}: MutationHookOptions<undefined, boolean>) => {
  const queryClient = useQueryClient();

  return $api.useMutation("patch", "/api/v1/validate-subscription", {
    onSuccess: (data, request) => {
      queryClient.invalidateQueries({
        queryKey: [meQuery.name],
      });
      queryClient.invalidateQueries({
        queryKey: [permissionQuery],
      });
      onSuccess(data?.data, request?.body);
    },

    onError: (error) => {
      // Default behavior
      onError(error.errors);
    },
  });
};
