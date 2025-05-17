import type { ApiError } from "./ApiError";

export interface ApiResponse<T = null> {
  success: boolean;
  data?: T;
  errors: ApiError[];
}
