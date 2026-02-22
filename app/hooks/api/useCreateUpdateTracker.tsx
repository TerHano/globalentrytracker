import { useQueryClient } from "@tanstack/react-query";
import { $api } from "~/utils/fetchData";
import type { MutationHookOptions } from "./mutationOptions";
import { QUERY_KEYS } from "~/api/query-keys";
import type { paths } from "~/types/api";
import {
  invalidateTrackedLocationQueries,
  invalidateUserQueries,
} from "~/utils/query-invalidation-utils";
import { mutationRetryConfig } from "~/utils/request-config";
import type { APIError } from "~/utils/error-utils";

export type CreateUpdateTrackerRequest =
  | paths["/api/v1/track-location"]["post"]["requestBody"]["content"]["application/json"]
  | paths["/api/v1/track-location"]["put"]["requestBody"]["content"]["application/json"];

interface useCreateUpdateTrackerProps
  extends MutationHookOptions<CreateUpdateTrackerRequest, number, APIError[]> {
  isUpdate?: boolean;
}

export const useCreateUpdateTracker = ({
  isUpdate = false,
  onSuccess,
  onError,
}: useCreateUpdateTrackerProps) => {
  const queryClient = useQueryClient();

  if (!isUpdate) {
    return $api.useMutation("post", "/api/v1/track-location", {
      ...mutationRetryConfig,
      onSuccess: async (data, request) => {
        // Invalidate relevant queries
        await Promise.all([
          invalidateTrackedLocationQueries(queryClient),
          invalidateUserQueries(queryClient),
        ]);

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
  }

  // Update mutation
  return $api.useMutation("put", "/api/v1/track-location", {
    ...mutationRetryConfig,
    onSuccess: async (data, request) => {
      // Invalidate relevant queries
      await Promise.all([
        invalidateTrackedLocationQueries(queryClient),
        invalidateUserQueries(queryClient),
      ]);

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
