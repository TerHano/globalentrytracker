import { useQueryClient } from "@tanstack/react-query";
import { $api } from "~/utils/fetchData";
import type { MutationHookOptions } from "~/hooks/api/mutationOptions";
import { allUsersQuery } from "~/api/admin/all-users-api";

export const useDeleteUser = ({
  onSuccess,
  onError,
}: MutationHookOptions<number, unknown>) => {
  const queryClient = useQueryClient();

  const queriesToInvalidate = [allUsersQuery.name];
  return $api.useMutation("delete", "/api/v1/admin/user/{userId}", {
    onSuccess: (data, request) => {
      queriesToInvalidate.forEach((query) => {
        queryClient.invalidateQueries({
          queryKey: [query],
        });
      });
      if (onSuccess) {
        const userId = Number.parseInt(request.params.path.userId ?? "0");
        onSuccess(data.data, userId);
      }
    },
    onError: (r) => {
      if (onError) {
        onError(r.errors);
      }
    },
  });
};
