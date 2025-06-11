const BASE_URL =
  import.meta.env.VITE_API_SERVER_BASE_URL || "http://localhost:3000";

const REFRESH_TOKEN_NAME =
  import.meta.env.VITE_REFRESH_TOKEN_NAME || "refresh_token";

type RefreshTokenResponse = {
  success: boolean;
  data: string;
  errors?: string[];
};

type AuthResult = {
  success: boolean;
  headers?: Headers;
  // updatedCookieHeader?: string;
  accessToken?: string;
};

function hasRefreshTokenCookie(cookieHeader: string): boolean {
  if (!cookieHeader) return false;

  // Parse cookies and look for refresh token
  // Assuming your refresh token cookie is named REFRESH_TOKEN_NAME or similar
  // Adjust the cookie name to match your backend implementation
  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  return cookies.some((cookie) => cookie.startsWith(`${REFRESH_TOKEN_NAME}=`));
}

async function attemptTokenRefresh(cookieHeader: string): Promise<AuthResult> {
  try {
    // Check if refresh token cookie exists before attempting refresh
    if (!hasRefreshTokenCookie(cookieHeader)) {
      console.log("No refresh token cookie found, skipping refresh attempt");
      return { success: false };
    }

    console.log("Token expired, attempting refresh...");

    const refreshResponse = await fetch(
      `${BASE_URL}/api/auth/v1/refresh-token`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          cookie: cookieHeader,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!refreshResponse.ok) {
      console.log("Token refresh failed");
      return { success: false };
    }

    const refreshData: RefreshTokenResponse = await refreshResponse.json();

    if (!refreshData.success || !refreshData.data) {
      console.log("Token refresh unsuccessful");
      return { success: false };
    }

    // Collect all Set-Cookie headers from the refresh response
    const responseHeaders = new Headers();
    const setCookieHeaders = refreshResponse.headers.getSetCookie();

    setCookieHeaders.forEach((cookie) => {
      responseHeaders.append("Set-Cookie", cookie);
    });

    // Create updated cookie header for subsequent requests
    // const updatedCookieHeader =
    //   setCookieHeaders.length > 0 ? setCookieHeaders.join("; ") : cookieHeader;

    return {
      success: true,
      headers: responseHeaders,
      //  updatedCookieHeader,
      accessToken: refreshData.data,
    };
  } catch (error) {
    console.error("Token refresh failed:", error);
    return { success: false };
  }
}

export async function isAuthenticated(
  request: Request
): Promise<{ user: unknown; headers?: Headers }> {
  const cookieHeader = request.headers.get("cookie") || "";

  try {
    // First, try to get user data with existing cookies
    const response = await fetch(`${BASE_URL}/api/v1/me`, {
      credentials: "include",
      headers: {
        cookie: cookieHeader,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // If successful, return user data
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        return { user: data.data };
      }
    }

    // If 401, try to refresh token
    if (response.status === 401) {
      const refreshResult = await attemptTokenRefresh(cookieHeader);

      if (!refreshResult.success) {
        return { user: false };
      }

      // Token refreshed successfully, try to get user data again
      const retryResponse = await fetch(`${BASE_URL}/api/v1/me`, {
        credentials: "include",
        headers: {
          //  cookie: refreshResult.updatedCookieHeader ?? "",
          Authorization: `Bearer ${refreshResult.accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (retryResponse.ok) {
        const retryData = await retryResponse.json();
        if (retryData.success && retryData.data) {
          return { user: retryData.data, headers: refreshResult.headers };
        }
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
    // Try to access admin endpoint with existing cookies
    const response = await fetch(`${BASE_URL}/api/v1/admin/users`, {
      credentials: "include",
      headers: {
        cookie: cookieHeader,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // If successful, user is admin
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        return { isAdmin: true };
      }
    }

    // If 401, try to refresh token first
    if (response.status === 401) {
      const refreshResult = await attemptTokenRefresh(cookieHeader);

      if (!refreshResult.success) {
        return { isAdmin: false };
      }

      // Token refreshed successfully, try admin endpoint again
      const retryResponse = await fetch(`${BASE_URL}/api/v1/admin/users`, {
        credentials: "include",
        headers: {
          //  cookie: refreshResult.updatedCookieHeader ?? "",
          Authorization: `Bearer ${refreshResult.accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (retryResponse.ok) {
        const retryData = await retryResponse.json();
        if (retryData.success) {
          return { isAdmin: true, headers: refreshResult.headers };
        }
      }
    }

    return { isAdmin: false };
  } catch (error) {
    console.error("Admin check failed:", error);
    return { isAdmin: false };
  }
}
