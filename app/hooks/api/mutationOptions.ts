import type { ApiError } from "~/models/ApiError";

export interface MutationHookOptions<Request, Response> {
  onSuccess?: (data: Response, request: Request) => void;
  onError?: (error: ApiError[]) => void;
}
