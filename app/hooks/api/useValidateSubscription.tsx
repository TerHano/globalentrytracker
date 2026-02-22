import { useQueryClient } from "@tanstack/react-query";
import { permissionQuery } from "~/api/permissions-api";
import type { MutationHookOptions } from "./mutationOptions";
import { noop } from "@mantine/core";
import { meQuery } from "~/api/me-api";
import { $api } from "~/utils/fetchData";
import { mutationRetryConfig } from "~/utils/request-config";
import type { APIError } from "~/utils/error-utils";

export const useValidateSubscription = ({
  onSuccess = noop,
  onError = noop,
}: MutationHookOptions<undefined, boolean, APIError[]>) => {
  const queryClient = useQueryClient();

  return $api.useMutation("patch", "/api/v1/validate-subscription", {
    ...mutationRetryConfig,
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
      onError(error.errors);
    },
  });
};
