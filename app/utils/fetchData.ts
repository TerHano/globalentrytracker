import type { ApiResponse } from "~/models/ApiResponse";
import createFetchClient from "openapi-fetch";
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

const fetchClient = createFetchClient<paths>({
  baseUrl: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  credentials: "include",
});

const $api = createClient(fetchClient);

export { fetchClient, $api, validateResponse };
