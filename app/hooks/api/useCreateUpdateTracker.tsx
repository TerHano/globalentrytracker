import { useQueryClient } from "@tanstack/react-query";
import { $api } from "~/utils/fetchData";
import type { MutationHookOptions } from "./mutationOptions";
import { trackedLocationQuery } from "~/api/tracked-location-api";
import { permissionQuery } from "~/api/permissions-api";
import { trackedLocationsQuery } from "~/api/tracked-locations-api";
import { nextNotificationQuery } from "~/api/next-notification-api";
import type { paths } from "~/types/api";

export type CreateUpdateTrackerRequest =
  | paths["/api/v1/track-location"]["post"]["requestBody"]["content"]["application/json"]
  | paths["/api/v1/track-location"]["put"]["requestBody"]["content"]["application/json"];

// export interface CreateUpdateTrackerRequest {
//   id?: number;
//   locationId: number;
//   enabled: boolean;
//   notificationTypeId: number;
//   cutOffDate: string;
// }

interface useCreateUpdateTrackerProps
  extends MutationHookOptions<CreateUpdateTrackerRequest, number> {
  isUpdate?: boolean;
}

export const useCreateUpdateTracker = ({
  isUpdate = false,
  onSuccess,
  onError,
}: useCreateUpdateTrackerProps) => {
  const queryClient = useQueryClient();

  const queriesToInvalidate = [
    trackedLocationQuery.name,
    trackedLocationsQuery.name,
    nextNotificationQuery.name,
    permissionQuery.name,
  ];
  if (!isUpdate) {
    return $api.useMutation("post", "/api/v1/track-location", {
      onSuccess: (data, request) => {
        // Default behavior
        // Call user-provided handler if it exists
        // Invalidate queries
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
        // Default behavior
        // Call user-provided handler if it exists
        if (onError) {
          onError(r.errors);
        }
      },
    });
  } else
    return $api.useMutation("put", "/api/v1/track-location", {
      onSuccess: (data, request) => {
        // Default behavior
        // Call user-provided handler if it exists
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
        // Default behavior
        // Call user-provided handler if it exists
        if (onError) {
          onError(r.errors);
        }
      },
    });
};
