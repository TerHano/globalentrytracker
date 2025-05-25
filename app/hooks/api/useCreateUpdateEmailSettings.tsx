import type { MutationHookOptions } from "./mutationOptions";
import { $api } from "~/utils/fetchData";

export interface CreateUpdateEmailSettingsRequest {
  id?: number;
  enabled: boolean;
}
interface useCreateUpdateEmailSettingsProps
  extends MutationHookOptions<CreateUpdateEmailSettingsRequest, number> {
  isUpdate?: boolean;
}

export const useCreateUpdateEmailSettings = ({
  isUpdate = false,
  onSuccess,
  onError,
}: useCreateUpdateEmailSettingsProps) => {
  return $api.useMutation(
    isUpdate ? "put" : "post",
    "/api/v1/notification-settings/email",
    {
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
    }
  );
};
