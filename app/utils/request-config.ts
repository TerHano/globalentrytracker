/**
 * Global retry configuration for API requests
 * Implements exponential backoff with a maximum of 3 retries
 */
export const requestRetryConfig = {
  // Retry up to 3 times (4 attempts total)
  retry: 3,
  // Exponential backoff: (2 ^ attempt) * 1000ms
  // Attempt 1: 1000ms
  // Attempt 2: 2000ms
  // Attempt 3: 4000ms
  retryDelay: (attemptIndex: number) => {
    return Math.min(1000 * 2 ** attemptIndex, 30000);
  },
  // Don't retry on these status codes
  shouldRetry: (failureCount: number, error: unknown) => {
    // Don't retry if we've hit the limit
    if (failureCount > 3) {
      return false;
    }

    // Check if it's a response-like object with status
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as { response: unknown }).response === "object" &&
      (error as { response: { status: unknown } }).response !== null
    ) {
      const status = (error as { response: { status: number } }).response.status;
      // Don't retry on client errors (4xx) except 408, 429
      if (status >= 400 && status < 500) {
        if (status === 408 || status === 429) {
          return true;
        }
        return false;
      }
    }

    // Retry on server errors (5xx) and network errors
    return true;
  },
};

/**
 * Mutation-specific retry config
 * Mutations should have stricter retry logic than queries
 */
export const mutationRetryConfig = {
  retry: 1, // Only 1 retry for mutations (2 attempts total)
  retryDelay: (attemptIndex: number) => {
    return 1000 * (attemptIndex + 1); // 1s, 2s
  },
};
