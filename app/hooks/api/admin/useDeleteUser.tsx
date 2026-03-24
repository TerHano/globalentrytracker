import { useQueryClient } from "@tanstack/react-query";
import { $api } from "~/utils/fetchData";
import type { MutationHookOptions } from "~/hooks/api/mutationOptions";
import { QUERY_KEYS } from "~/api/query-keys";

export const useDeleteUser = ({
  onSuccess,
  onError,
}: MutationHookOptions<number, unknown>) => {
  const queryClient = useQueryClient();

  return $api.useMutation("delete", "/api/v1/admin/user/{userId}", {
    onSuccess: (data, request) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ALL_USERS,
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
