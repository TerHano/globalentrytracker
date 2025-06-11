import { useQueryClient } from "@tanstack/react-query";
import { $api } from "~/utils/fetchData";
import type { MutationHookOptions } from "./mutationOptions";
import { QUERY_KEYS } from "~/api/query-keys";
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
    QUERY_KEYS.TRACKED_LOCATION,
    QUERY_KEYS.TRACKED_LOCATIONS,
    QUERY_KEYS.NEXT_NOTIFICATION,
    QUERY_KEYS.PERMISSIONS,
  ];
  if (!isUpdate) {
    return $api.useMutation("post", "/api/v1/track-location", {
      onSuccess: (data, request) => {
        // Default behavior
        // Call user-provided handler if it exists
        // Invalidate queries
        queriesToInvalidate.forEach((queryKey) => {
          queryClient.invalidateQueries({
            queryKey,
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
        queriesToInvalidate.forEach((queryKey) => {
          queryClient.invalidateQueries({
            queryKey,
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
