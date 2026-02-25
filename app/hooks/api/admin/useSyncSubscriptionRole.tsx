import { useQueryClient } from "@tanstack/react-query";
import { $api } from "~/utils/fetchData";
import type { MutationHookOptions } from "~/hooks/api/mutationOptions";
import { allUsersQuery } from "~/api/admin/all-users-api";

export type SyncSubscriptionRoleParams = { userId: string };

export const useSyncSubscriptionRole = ({
  onSuccess,
  onError,
}: MutationHookOptions<SyncSubscriptionRoleParams, unknown>) => {
  const queryClient = useQueryClient();

  const queriesToInvalidate = [allUsersQuery.name];
  return $api.useMutation(
    "post",
    "/api/v1/admin/sync-subscription-role/{userId}",
    {
      onSuccess: (data, request) => {
        queriesToInvalidate.forEach((query) => {
          queryClient.invalidateQueries({
            queryKey: [query],
          });
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
