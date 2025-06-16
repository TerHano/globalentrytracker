import { redirect, type LoaderFunctionArgs } from "react-router";
import { fetchClient } from "~/utils/fetchData";
import { VerifyEmailError } from "~/components/auth/verify-email-error-page";
import type { Route } from "./+types/auth.confirm";
import { Stack } from "@mantine/core";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const email = requestUrl.searchParams.get("email");
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
      return redirect(next, {
        headers,
      });
    }
  }
  // return the user to an error page with instructions
  return { email };
  //return redirect("/auth/email-verify-error");
}

export default function EmailVerificationFailed({
  loaderData,
}: Route.ComponentProps) {
  const { email } = loaderData;
  // This component is just a placeholder for the loader function
  // It will never be rendered, as the loader will redirect the user
  return (
    <Stack justify="center" align="center" p="md">
      <VerifyEmailError email={email} />
    </Stack>
  );
}
