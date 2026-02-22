import { $api } from "~/utils/fetchData";
import { noop } from "@mantine/core";
import type { MutationHookOptions } from "./mutationOptions";
import type { paths } from "~/types/api";
import { mutationRetryConfig } from "~/utils/request-config";
import type { APIError } from "~/utils/error-utils";

type ResendEmailVerificationRequest =
  paths["/api/auth/v1/resend-email-verification"]["post"]["requestBody"]["content"]["application/json"];
export const useResendEmailVerification = ({
  onSuccess = noop,
  onError = noop,
}: MutationHookOptions<ResendEmailVerificationRequest, unknown, APIError[]>) => {
  return $api.useMutation("post", "/api/auth/v1/resend-email-verification", {
    ...mutationRetryConfig,
    onSuccess: (data, request) => {
      onSuccess(data.data, request.body);
    },
    onError: (r) => {
      onError(r.errors);
    },
  });
};
