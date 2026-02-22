import { useQueryClient } from "@tanstack/react-query";
import { $api } from "~/utils/fetchData";
import type { MutationHookOptions } from "./mutationOptions";
import { noop } from "@mantine/core";
import { QUERY_KEYS } from "~/api/query-keys";
import type { paths } from "~/types/api";
import { mutationRetryConfig } from "~/utils/request-config";
import type { APIError } from "~/utils/error-utils";

type UpgradeSubscriptionRequest =
  paths["/api/v1/subscribe"]["post"]["requestBody"]["content"]["application/json"];

export const useUpgradeSubscription = ({
  onSuccess = noop,
  onError = noop,
}: MutationHookOptions<UpgradeSubscriptionRequest, string, APIError[]>) => {
  const queryClient = useQueryClient();

  return $api.useMutation("post", "/api/v1/subscribe", {
    ...mutationRetryConfig,
    onSuccess: (data, request) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SUBSCRIPTION,
      });
      onSuccess(data.data, request?.body);
    },
    onError: (response) => {
      onError(response.errors);
    },
  });
};
