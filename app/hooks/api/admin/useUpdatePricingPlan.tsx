import { useQueryClient } from "@tanstack/react-query";
import { $api } from "~/utils/fetchData";
import type { MutationHookOptions } from "~/hooks/api/mutationOptions";
import type { paths } from "~/types/api";
import { QUERY_KEYS } from "~/api/query-keys";

export type UpdatePricingPlanRequest =
  paths["/api/v1/admin/pricing"]["post"]["requestBody"]["content"]["application/json"];

export const useUpdatePricingPlan = ({
  onSuccess,
  onError,
}: MutationHookOptions<UpdatePricingPlanRequest, unknown>) => {
  const queryClient = useQueryClient();

  return $api.useMutation("put", "/api/v1/admin/pricing", {
    onSuccess: (data, request) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PLANS,
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
