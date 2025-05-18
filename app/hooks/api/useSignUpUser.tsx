import { useMutation } from "@tanstack/react-query";
import { fetchData } from "~/utils/fetchData";
import type { MutationHookOptions } from "./mutationOptions";
import type { ApiError } from "~/models/ApiError";

export interface SignUpUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  redirectUrl: string;
}

export const useSignUpUser = ({
  onSuccess,
  onError,
}: MutationHookOptions<SignUpUserRequest, number>) => {
  return useMutation<number, ApiError[], SignUpUserRequest>({
    mutationFn: async (request: SignUpUserRequest) => {
      return signUpUserApi(request);
    },
    onSuccess: (data, body) => {
      // Default behavior

      // Call user-provided handler if it exists
      if (onSuccess) {
        onSuccess(data, body);
      }
    },
    onError: (error) => {
      // Call user-provided handler if it exists
      if (onError) {
        onError(error);
      }
    },
  });
};
async function signUpUserApi(request: SignUpUserRequest) {
  return fetchData<number>("/api/v1/sign-up", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
}
