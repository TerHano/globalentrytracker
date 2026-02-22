import { useQueryClient } from "@tanstack/react-query";
import { $api } from "~/utils/fetchData";
import type { MutationHookOptions } from "./mutationOptions";
import {
  invalidateTrackedLocationQueries,
  invalidateUserQueries,
} from "~/utils/query-invalidation-utils";
import { mutationRetryConfig } from "~/utils/request-config";
import type { APIError } from "~/utils/error-utils";

export interface DeleteAllTrackersResponse {
  success: boolean;
  errorMessage?: string;
}

export function useDeleteAllTrackers({
  onSuccess,
  onError,
}: MutationHookOptions<void, unknown, APIError[]>) {
  const queryClient = useQueryClient();

  return $api.useMutation("delete", "/api/v1/track-location", {
    ...mutationRetryConfig,
    onSuccess: async (data) => {
      // Invalidate all related queries
      await Promise.all([
        invalidateTrackedLocationQueries(queryClient),
        invalidateUserQueries(queryClient),
      ]);

      if (onSuccess) {
        onSuccess(data.data);
      }
    },
    onError: (r) => {
      // Call user-provided handler if it exists
      if (onError) {
        onError(r.errors);
      }
    },
  });
}
