import { useQueryClient } from "@tanstack/react-query";
import { $api } from "~/utils/fetchData";
import type { MutationHookOptions } from "~/hooks/api/mutationOptions";
import type { paths } from "~/types/api";
import { planQuery } from "~/api/plans-api";

export type CreatePricingPlanRequest =
  paths["/api/v1/admin/pricing"]["post"]["requestBody"]["content"]["application/json"];

export const useCreatePricingPlan = ({
  onSuccess,
  onError,
}: MutationHookOptions<CreatePricingPlanRequest, number>) => {
  const queryClient = useQueryClient();

  const queriesToInvalidate = [planQuery.name];

  return $api.useMutation("post", "/api/v1/admin/pricing", {
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
