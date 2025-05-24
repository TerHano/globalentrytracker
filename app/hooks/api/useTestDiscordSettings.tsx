import type { MutationHookOptions } from "./mutationOptions";
import { $api } from "~/utils/fetchData";

export interface TestDiscordSettingsRequest {
  webhookUrl: string;
}
interface useTestDiscordSettingsProps
  extends MutationHookOptions<TestDiscordSettingsRequest, unknown> {
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
      onSuccess: (data, request) => {
        // Call user-provided handler if it exists
        if (onSuccess) {
          onSuccess(data?.data, request?.body);
        }
      },
      onError: (response) => {
        // Default behavior
        // console.error("Error deleting tracker:", response);
        // Call user-provided handler if it exists
        if (onError) {
          onError(response.errors);
        }
      },
    }
  );
};
