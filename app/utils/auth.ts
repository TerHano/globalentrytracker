import { fetchClient } from "./fetchData";

export async function isAuthenticated(request?: Request) {
  const response = await fetchClient.GET("/api/v1/me", {
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
  return response.data.data;
}
