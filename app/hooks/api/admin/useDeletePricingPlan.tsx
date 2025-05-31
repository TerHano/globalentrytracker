import { useQueryClient } from "@tanstack/react-query";
import type { MutationHookOptions } from "../mutationOptions";
import { $api } from "~/utils/fetchData";
import { planQuery } from "~/api/plans-api";

export const useDeletePricingPlan = ({
  onSuccess,
  onError,
}: MutationHookOptions<number, unknown>) => {
  const queryClient = useQueryClient();
  return $api.useMutation("delete", "/api/v1/admin/pricing/{id}", {
    onSuccess: (data, request) => {
      queryClient.invalidateQueries({
        queryKey: [planQuery.name],
      });
      const priceId = request?.params?.path?.id;
      if (onSuccess) {
        onSuccess(data.data, priceId);
      }
    },
    onError: (r) => {
      if (onError) {
        onError(r.errors);
      }
    },
  });
};
