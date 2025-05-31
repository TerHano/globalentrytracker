import { useQueryClient } from "@tanstack/react-query";
import { $api } from "~/utils/fetchData";
import type { MutationHookOptions } from "~/hooks/api/mutationOptions";
import type { paths } from "~/types/api";
import { allUsersQuery } from "~/api/admin/all-users-api";

export type GrantSubscriptionRequest =
  paths["/api/v1/admin/grant-subscription"]["post"]["requestBody"]["content"]["application/json"];

export const useGrantSubscription = ({
  onSuccess,
  onError,
}: MutationHookOptions<GrantSubscriptionRequest, unknown>) => {
  const queryClient = useQueryClient();

  const queriesToInvalidate = [allUsersQuery.name];
  return $api.useMutation("post", "/api/v1/admin/grant-subscription", {
    onSuccess: (data, request) => {
      queriesToInvalidate.forEach((query) => {
        queryClient.invalidateQueries({
          queryKey: [query],
        });
      });
      if (onSuccess) {
        onSuccess(data.data, request?.body);
      }
    },
    onError: (r) => {
      if (onError) {
        onError(r.errors);
      }
    },
  });
};
