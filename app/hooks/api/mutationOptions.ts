//import type { ApiError } from "~/models/ApiError";
import type { components } from "~/types/api";

type DefaultAPIError = components["schemas"]["Error"];

export interface MutationHookOptions<
  Request,
  Response,
  Error = DefaultAPIError[],
> {
  onSuccess?: (data: Response, request?: Request) => void;
  onError?: (error: Error) => void;
}
