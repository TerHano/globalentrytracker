import { useQueryClient } from "@tanstack/react-query";
import { $api } from "~/utils/fetchData";
import type { MutationHookOptions } from "./mutationOptions";
import { QUERY_KEYS } from "~/api/query-keys";
import {
  invalidateTrackedLocationQueries,
  invalidateUserQueries,
} from "~/utils/query-invalidation-utils";
import {
  mutationRetryConfig,
  requestRetryConfig,
} from "~/utils/request-config";
import type { APIError } from "~/utils/error-utils";

export interface DeleteTrackerResponse {
  success: boolean;
  errorMessage?: string;
}

export function useDeleteTracker({
  onSuccess,
  onError,
}: MutationHookOptions<number, number, APIError[]>) {
  const queryClient = useQueryClient();

  return $api.useMutation(
    "delete",
    "/api/v1/track-location/{locationTrackerId}",
    {
      ...mutationRetryConfig,
      onSuccess: async (data, request) => {
        const trackerId = request.params.path.locationTrackerId;

        // Invalidate all related queries
        await Promise.all([
          invalidateTrackedLocationQueries(queryClient),
          invalidateUserQueries(queryClient),
        ]);

        if (onSuccess) {
          onSuccess(data.data, trackerId);
        }
      },
      onError: (r) => {
        // Call user-provided handler if it exists
        if (onError) {
          onError(r.errors);
        }
      },
    },
  );
}
