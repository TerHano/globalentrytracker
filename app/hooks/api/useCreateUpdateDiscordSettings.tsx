import type { paths } from "~/types/api";
import type { MutationHookOptions } from "./mutationOptions";
import { $api } from "~/utils/fetchData";
import { mutationRetryConfig } from "~/utils/request-config";
import type { APIError } from "~/utils/error-utils";

export type CreateUpdateDiscordSettingsRequest =
  | paths["/api/v1/notification-settings/discord"]["post"]["requestBody"]["content"]["application/json"]
  | paths["/api/v1/notification-settings/discord"]["put"]["requestBody"]["content"]["application/json"];

interface useCreateUpdateDiscordSettingsProps
  extends MutationHookOptions<
    CreateUpdateDiscordSettingsRequest,
    number,
    APIError[]
  > {
  isUpdate?: boolean;
}

export const useCreateUpdateDiscordSettings = ({
  isUpdate = false,
  onSuccess,
  onError,
}: useCreateUpdateDiscordSettingsProps) => {
  if (isUpdate) {
    return $api.useMutation("put", "/api/v1/notification-settings/discord", {
      ...mutationRetryConfig,
      onSuccess: (data, request) => {
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
  return $api.useMutation("post", "/api/v1/notification-settings/discord", {
    ...mutationRetryConfig,
    onSuccess: (data, request) => {
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
