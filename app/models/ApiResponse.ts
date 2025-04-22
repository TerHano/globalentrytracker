export interface ApiResponse<T = null> {
  success: boolean;
  data?: T;
  errorMessages: string[];
}
