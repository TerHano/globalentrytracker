import type { paths } from "~/types/api";
import type { MutationHookOptions } from "./mutationOptions";
import { $api } from "~/utils/fetchData";

export type CreateUpdateDiscordSettingsRequest =
  | paths["/api/v1/notification-settings/discord"]["post"]["requestBody"]["content"]["application/json"]
  | paths["/api/v1/notification-settings/discord"]["put"]["requestBody"]["content"]["application/json"];

interface useCreateUpdateDiscordSettingsProps
  extends MutationHookOptions<CreateUpdateDiscordSettingsRequest, number> {
  isUpdate?: boolean;
}

export const useCreateUpdateDiscordSettings = ({
  isUpdate = false,
  onSuccess,
  onError,
}: useCreateUpdateDiscordSettingsProps) => {
  if (isUpdate) {
    return $api.useMutation("put", "/api/v1/notification-settings/discord", {
      onSuccess: (data, request) => {
        // Default behavior
        // Call user-provided handler if it exists
        if (onSuccess) {
          onSuccess(data.data, request?.body);
        }
      },
      onError: (r) => {
        // Default behavior
        console.error("Error deleting tracker:", r.errors);

        // Call user-provided handler if it exists
        if (onError) {
          onError(r.errors);
        }
      },
    });
  }
  return $api.useMutation("post", "/api/v1/notification-settings/discord", {
    onSuccess: (data, request) => {
      // Default behavior
      // Call user-provided handler if it exists
      if (onSuccess) {
        onSuccess(data.data, request?.body);
      }
    },
    onError: (r) => {
      // Default behavior
      console.error("Error deleting tracker:", r.errors);

      // Call user-provided handler if it exists
      if (onError) {
        onError(r.errors);
      }
    },
  });
};
