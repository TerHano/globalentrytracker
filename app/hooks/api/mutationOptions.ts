//import type { ApiError } from "~/models/ApiError";
import type { components } from "~/types/api";

type APIError = components["schemas"]["Error"];

export interface MutationHookOptions<Request, Response, Error = APIError[]> {
  onSuccess?: (data: Response, request: Request) => void;
  onError?: (error: Error) => void;
}
