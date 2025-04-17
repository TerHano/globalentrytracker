import type { ApiResponse } from "~/models/ApiResponse";

export interface MutationHookOptions<T> {
  onSuccess?: (data: ApiResponse, request: T) => void;
  onError?: (error: unknown) => void;
}
