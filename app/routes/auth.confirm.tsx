import { redirect, type LoaderFunctionArgs } from "react-router";
import { fetchClient } from "~/utils/fetchData";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const next = requestUrl.searchParams.get("next") || "/";

  if (token_hash && type) {
    const response = await fetchClient.POST("/api/auth/v1/verify-email", {
      credentials: "include",
      body: {
        tokenHash: token_hash,
      },
    });
    if (response.response.status == 200) {
      const setCookie = response.response.headers.get("set-cookie");

      const headers = new Headers();
      if (setCookie) {
        headers.append("Set-Cookie", setCookie);
      }
      redirect(next, {
        headers,
      });
    }
  }
  // return the user to an error page with instructions
  return redirect("/auth/auth-code-error");
}
