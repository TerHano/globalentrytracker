import { fetchClient } from "./fetchData";

export async function isAuthenticated(request?: Request) {
  const response = await fetchClient.GET("/api/auth/v1/authenticated", {
    credentials: "include",
    headers: {
      cookie: request?.headers.get("cookie"),
    },
  });
  if (response.response.status === 400) {
    return false;
  }
  if (!response.data) {
    return false;
  }
  if (response.data.success === false) {
    return false;
  }
  return response.data.data.isAuthenticated;
}
