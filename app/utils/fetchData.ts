import type { ApiResponse } from "~/models/ApiResponse";
import createFetchClient, { type Middleware } from "openapi-fetch";
import createClient from "openapi-react-query";
import { redirect } from "react-router";
import type { paths } from "~/types/api";

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
let refreshPromise: Promise<Response | null> | null = null;

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
          return refreshResponse;
        })();
      }
      const refreshedAccessTokenResponse = await refreshPromise;
      refreshPromise = null;

      if (!refreshedAccessTokenResponse) {
        console.error("Failed to refresh token");

        throw redirect("/login");
        // throw new Error("Failed to refresh token");
      }
      const refreshedAccessTokenBody: RefreshTokenResponse =
        await refreshedAccessTokenResponse.json();
      const refreshedAccessToken = refreshedAccessTokenBody.data;
      if (!refreshedAccessToken) {
        console.error("Failed to refresh token");
        throw redirect("/login");
        // throw new Error("Failed to refresh token");
      }

      const setCookie = refreshedAccessTokenResponse.headers.get("set-cookie");
      const headers = new Headers();
      if (setCookie) {
        headers.append("Set-Cookie", setCookie);
      }
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers,
      });
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
