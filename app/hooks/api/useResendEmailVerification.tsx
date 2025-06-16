import { $api } from "~/utils/fetchData";
import { noop } from "@mantine/core";
import type { MutationHookOptions } from "./mutationOptions";
import type { paths } from "~/types/api";

type ResendEmailVerificationRequest =
  paths["/api/auth/v1/resend-email-verification"]["post"]["requestBody"]["content"]["application/json"];
export const useResendEmailVerification = ({
  onSuccess = noop,
  onError = noop,
}: MutationHookOptions<ResendEmailVerificationRequest, unknown>) => {
  return $api.useMutation("post", "/api/auth/v1/resend-email-verification", {
    onSuccess: (data, request) => {
      onSuccess(data.data, request.body);
      // Default behavior
    },
    onError: (r) => {
      // Default behavior
      onError(r.errors);
      // Call user-provided handler if it exists
    },
  });
};
