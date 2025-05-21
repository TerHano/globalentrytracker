import type { ApiError } from "~/models/ApiError";

export interface MutationHookOptions<Request, Response, Error = ApiError[]> {
  onSuccess?: (data: Response, request: Request) => void;
  onError?: (error: Error) => void;
}
