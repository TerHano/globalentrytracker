import { useQueryClient } from "@tanstack/react-query";
import { $api } from "~/utils/fetchData";
import type { MutationHookOptions } from "~/hooks/api/mutationOptions";
import { QUERY_KEYS } from "~/api/query-keys";

export type DowngradeSubscriptionParams = { userId: string };

export const useDowngradeSubscription = ({
  onSuccess,
  onError,
}: MutationHookOptions<DowngradeSubscriptionParams, unknown>) => {
  const queryClient = useQueryClient();

  return $api.useMutation(
    "post",
    "/api/v1/admin/downgrade-to-free/{userId}",
    {
      onSuccess: (data, request) => {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.ALL_USERS,
        });
        if (onSuccess) {
          onSuccess(data.data, request?.params?.path);
        }
      },
      onError: (r) => {
        if (onError) {
          onError(r.errors);
        }
      },
    },
  );
};
