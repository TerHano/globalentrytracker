import type { ApiResponse } from "~/models/ApiResponse";
import createFetchClient, { type Middleware } from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "~/types/api";

const BASE_URL = import.meta.env.VITE_API_SERVER_BASE_URL;

function validateResponse<T>(response: {
  data?: ApiResponse<T>;
  error?: unknown;
  response: Response;
}): NonNullable<T> {
  // Check if the fetch itself failed
  if (response.error) {
    throw new Error(`Network error: ${response.error}`);
  }

  // Check if we got no data at all
  if (!response.data) {
    throw new Error(`No response data - Status: ${response.response.status}`);
  }

  // Check if the API response indicates failure
  if (!response.data.success) {
    throw new Error(`API error: ${response.data.errors || "Unknown error"}`);
  }

  // Check if the actual data is null/undefined
  if (response.data.data === null || response.data.data === undefined) {
    throw new Error("Response data is null or undefined");
  }

  return response.data.data;
}

// Enhanced error handling middleware with token refresh on client side
const errorMiddleware: Middleware = {
  onResponse: async ({ response, request }) => {
    // If 401, attempt token refresh and retry
    if (response.status === 401) {
      console.log("401 error - attempting token refresh...");

      try {
        const refreshResponse = await fetch(
          `${BASE_URL}/api/auth/v1/refresh-token`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.success && refreshData.data) {
            console.log(
              "Token refreshed successfully, retrying original request..."
            );

            // Retry the original request with the new token
            const retryResponse = await fetch(response.url, {
              method: request.method,
              headers: {
                ...Object.fromEntries(request.headers.entries()),
                Authorization: `Bearer ${refreshData.data}`,
              },
              body: request.body,
              credentials: "include",
            });

            return retryResponse;
          }
        }

        console.log("Token refresh failed - user needs to re-login");
      } catch (error) {
        console.error("Token refresh error:", error);
      }
    }
    return response;
  },
};

const fetchClient = createFetchClient<paths>({
  baseUrl: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  credentials: "include",
});

fetchClient.use(errorMiddleware);
const $api = createClient(fetchClient);

export { fetchClient, $api, validateResponse };
