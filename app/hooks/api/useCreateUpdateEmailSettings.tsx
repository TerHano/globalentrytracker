import type { MutationHookOptions } from "./mutationOptions";
import { $api } from "~/utils/fetchData";
import { mutationRetryConfig } from "~/utils/request-config";
import type { APIError } from "~/utils/error-utils";

export interface CreateUpdateEmailSettingsRequest {
  id?: number;
  enabled: boolean;
}
interface useCreateUpdateEmailSettingsProps
  extends MutationHookOptions<CreateUpdateEmailSettingsRequest, number, APIError[]> {
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
    }
  );
};
