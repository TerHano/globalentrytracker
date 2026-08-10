const BASE_URL =
  import.meta.env.VITE_API_SERVER_BASE_URL || "http://localhost:3000";

export async function isAuthenticated(
  request: Request
): Promise<{ user: unknown; headers?: Headers }> {
  const cookieHeader = request.headers.get("cookie") || "";
  try {
    const response = await fetch(`${BASE_URL}/api/v1/me`, {
      credentials: "include",
      headers: {
        cookie: cookieHeader,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        return { user: data.data };
      }
    }

    return { user: false };
  } catch (error) {
    console.error("Auth check failed:", error);
    return { user: false };
  }
}

export async function isAdmin(
  request: Request
): Promise<{ isAdmin: boolean; headers?: Headers }> {
  const cookieHeader = request.headers.get("cookie") || "";

  try {
    const response = await fetch(`${BASE_URL}/api/v1/admin/users`, {
      credentials: "include",
      headers: {
        cookie: cookieHeader,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        return { isAdmin: true };
      }
    }

    return { isAdmin: false };
  } catch (error) {
    console.error("Admin check failed:", error);
    return { isAdmin: false };
  }
}
