import { useQueryClient } from "@tanstack/react-query";
import { $api } from "~/utils/fetchData";
import type { MutationHookOptions } from "~/hooks/api/mutationOptions";
import { trackedLocationQuery } from "~/api/tracked-location-api";
import { permissionQuery } from "~/api/permissions-api";
import { trackedLocationsQuery } from "~/api/tracked-locations-api";
import { nextNotificationQuery } from "~/api/next-notification-api";
import type { paths } from "~/types/api";

export type UpdatePricingPlanRequest =
  paths["/api/v1/admin/pricing"]["post"]["requestBody"]["content"]["application/json"];

export const useCreateUpdateTracker = ({
  onSuccess,
  onError,
}: MutationHookOptions<UpdatePricingPlanRequest, unknown>) => {
  const queryClient = useQueryClient();

  const queriesToInvalidate = [
    trackedLocationQuery.name,
    trackedLocationsQuery.name,
    nextNotificationQuery.name,
    permissionQuery.name,
  ];
  return $api.useMutation("put", "/api/v1/admin/pricing", {
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
