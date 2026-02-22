import type { components } from "~/types/api";

export type APIError = components["schemas"]["Error"];
export type APIErrorResponse = {
  errors?: APIError[];
  [key: string]: unknown;
};

/**
 * Extracts error messages from API error response
 */
export function extractErrorMessage(error: APIErrorResponse): string {
  if (!error || !error.errors || error.errors.length === 0) {
    return "An unexpected error occurred";
  }

  const firstError = error.errors[0];
  if (typeof firstError === "string") {
    return firstError;
  }

  if (typeof firstError === "object" && "message" in firstError) {
    return (firstError as APIError).message;
  }

  return "An unexpected error occurred";
}

/**
 * Extracts all error messages from API error response
 */
export function extractErrorMessages(error: APIErrorResponse): string[] {
  if (!error || !error.errors || error.errors.length === 0) {
    return ["An unexpected error occurred"];
  }

  return error.errors.map((err) => {
    if (typeof err === "string") {
      return err;
    }
    if (typeof err === "object" && "message" in err) {
      return (err as APIError).message;
    }
    return "An unexpected error occurred";
  });
}

/**
 * Extracts error code from API error response
 */
export function extractErrorCode(error: APIErrorResponse): string | null {
  if (!error || !error.errors || error.errors.length === 0) {
    return null;
  }

  const firstError = error.errors[0];
  if (typeof firstError === "object" && "code" in firstError) {
    return (firstError as APIError).code as string;
  }

  return null;
}

/**
 * Type guard to check if error is an API error response
 */
export function isAPIError(error: unknown): error is APIErrorResponse {
  return (
    typeof error === "object" &&
    error !== null &&
    ("errors" in error || "message" in error)
  );
}

/**
 * Global error handler for API errors
 */
export function handleAPIError(
  error: unknown,
  defaultMessage: string = "An error occurred"
): string {
  if (isAPIError(error)) {
    return extractErrorMessage(error);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
}
