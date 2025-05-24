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
  // return useMutation<number, ApiError[], CreateUpdateEmailSettingsRequest>({
  //   mutationFn: async (request: CreateUpdateEmailSettingsRequest) => {
  //     const token = await getSupabaseToken();
  //     if (!token) {
  //       throw new Error("No token found");
  //     }
  //     return emailNotificationSettingsApi(request, isUpdate);
  //   },
  //   onSuccess: (data, body) => {
  //     // Default behavior

  //     // Call user-provided handler if it exists
  //     if (onSuccess) {
  //       onSuccess(data, body);
  //     }
  //   },
  //   onError: (error) => {
  //     // Default behavior
  //     console.error("Error deleting tracker:", error);

  //     // Call user-provided handler if it exists
  //     if (onError) {
  //       onError(error);
  //     }
  //   },
  // });
};

// async function emailNotificationSettingsApi(
//   request: CreateUpdateEmailSettingsRequest,
//   isUpdate: boolean
// ) {
//   const token = await getSupabaseToken();
//   if (!token) {
//     throw new Error("No token found");
//   }
//   return fetchData<number>(`/api/v1/notification-settings/email`, {
//     method: isUpdate ? "PUT" : "POST",
//     body: JSON.stringify(request),
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });
// }
