import type { MutationHookOptions } from "./mutationOptions";
import { $api } from "~/utils/fetchData";
import { mutationRetryConfig } from "~/utils/request-config";
import type { APIError } from "~/utils/error-utils";

export interface TestDiscordSettingsRequest {
  webhookUrl: string;
}
interface useTestDiscordSettingsProps
  extends MutationHookOptions<TestDiscordSettingsRequest, unknown, APIError[]> {
  isUpdate?: boolean;
}

export const useTestDiscordSettings = ({
  onSuccess,
  onError,
}: useTestDiscordSettingsProps) => {
  return $api.useMutation(
    "post",
    "/api/v1/notification-settings/discord/test",
    {
      ...mutationRetryConfig,
      onSuccess: (data, request) => {
        if (onSuccess) {
          onSuccess(data?.data, request?.body);
        }
      },
      onError: (response) => {
        if (onError) {
          onError(response.errors);
        }
      },
    },
  );
};
