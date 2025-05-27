import type { ApiResponse } from "~/models/ApiResponse";
import createFetchClient, { type Middleware } from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "~/types/api";
import { RefreshTokenError } from "~/root";

const BASE_URL = import.meta.env.VITE_API_SERVER_BASE_URL;

type RefreshTokenResponse =
  paths["/api/auth/v1/refresh-token"]["post"]["responses"]["200"]["content"]["application/json"];

function validateResponse<T>(
  apiResponse: ApiResponse<T> | undefined
): NonNullable<T> {
  if (!apiResponse) {
    throw new Error("No response data");
  }
  //const apiResponse = response as ApiResponse<unknown>;
  if (!apiResponse.success) {
    throw new Error(`Error fetching data: ${apiResponse.errors}`);
  }
  if (apiResponse.data === null || apiResponse.data === undefined) {
    throw new Error("Response data is null or undefined");
  }
  return apiResponse.data;
}
let refreshPromise: Promise<string | null> | null = null;

const authMiddleware: Middleware = {
  onResponse: async ({ request, response }) => {
    // Check if the response status is 401 (Unauthorized)

    if (response.status === 401) {
      console.log("401 error occurred");
      //Handle the 401 error here, e.g., redirect to login page
      const cookie = request.headers.get("cookie") || "";
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const refreshResponse = await fetch(
            BASE_URL + "/api/auth/v1/refresh-token",
            {
              headers: { cookie },
              method: "POST",
              credentials: "include",
            }
          );
          if (!refreshResponse.ok) {
            return null;
          }

          try {
            const refreshedAccessTokenBody: RefreshTokenResponse =
              await refreshResponse.json();
            return refreshedAccessTokenBody.data;
          } catch (error) {
            console.error("Failed to parse refresh token response:", error);
            return null;
          }
        })();
      }
      const refreshedAccessToken = await refreshPromise;
      refreshPromise = null;

      if (!refreshedAccessToken) {
        console.error("Failed to refresh token");

        throw new Error(RefreshTokenError);
        // throw new Error("Failed to refresh token");
      }

      const retryHeaders = new Headers(request.headers);
      retryHeaders.set("Authorization", `Bearer ${refreshedAccessToken}`);

      const retriedResponse = await fetch(request.url, {
        method: request.method,
        headers: retryHeaders,
        credentials: "include",
      });

      return retriedResponse;
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
fetchClient.use(authMiddleware);
const $api = createClient(fetchClient);

export { fetchClient, $api, validateResponse };
